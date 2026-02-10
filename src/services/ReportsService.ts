import { and, count, eq, gte, inArray, sql, sum } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { memberMembershipSchema, memberSchema, membershipPlanSchema, transactionSchema } from '@/models/Schema';
import { getFinancialStats } from './DashboardService';

export type ReportCurrentValues = {
  autopaysSuspended: number;
  expiringCreditCards: number;
  amountDue: number;
  pastDue: number;
  paymentsLast30Days: number;
  paymentsPending: number;
  failedPayments: number;
  incomePerStudent: number;
};

type MonthlyDataPoint = {
  month: string;
  value: number;
  previousYear?: number;
};

type YearlyDataPoint = {
  year: string;
  value: number;
};

export type ReportChartData = {
  monthly: MonthlyDataPoint[];
  yearly: YearlyDataPoint[];
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function getReportCurrentValues(organizationId: string): Promise<ReportCurrentValues> {
  const stats = await getFinancialStats(organizationId);
  return {
    autopaysSuspended: stats.autopaysSuspended,
    expiringCreditCards: stats.expiringCreditCards60Days,
    amountDue: stats.amountDueNext30Days,
    pastDue: stats.pastDueTotal,
    paymentsLast30Days: stats.paymentsLast30Days,
    paymentsPending: stats.paymentsPending,
    failedPayments: stats.failedPaymentsLast30Days,
    incomePerStudent: stats.incomePerStudent30Days,
  };
}

export async function getReportChartData(
  organizationId: string,
  reportType: string,
): Promise<ReportChartData> {
  const currentYear = new Date().getFullYear();

  switch (reportType) {
    case 'accounts-autopay-suspended':
      return getAutopayChartData(organizationId, currentYear);
    case 'expiring-credit-cards':
      return getEmptyChartData(currentYear);
    case 'amount-due':
      return getAmountDueChartData(organizationId, currentYear);
    case 'past-due':
      return getStatusChartData(organizationId, currentYear, 'declined');
    case 'payments-last-30-days':
      return getStatusChartData(organizationId, currentYear, 'paid');
    case 'payments-pending':
      return getPendingChartData(organizationId, currentYear);
    case 'failed-payments':
      return getStatusChartData(organizationId, currentYear, 'declined');
    case 'income-per-student':
      return getIncomePerStudentChartData(organizationId, currentYear);
    default:
      return getEmptyChartData(currentYear);
  }
}

export async function getReportInsights(
  organizationId: string,
  reportType: string,
): Promise<string[]> {
  const stats = await getFinancialStats(organizationId);

  const [studentsResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      inArray(memberSchema.status, ['active', 'trial']),
    ));
  const totalStudents = studentsResult?.count ?? 0;

  const [totalMembersResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(eq(memberSchema.organizationId, organizationId));
  const totalMembers = totalMembersResult?.count ?? 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  switch (reportType) {
    case 'accounts-autopay-suspended': {
      const pct = totalMembers > 0 ? ((stats.autopaysSuspended / totalMembers) * 100).toFixed(1) : '0';
      return [
        `${stats.autopaysSuspended} account${stats.autopaysSuspended !== 1 ? 's' : ''} currently have autopay suspended`,
        `Suspended accounts represent ${pct}% of total memberships`,
        `Past due balance from suspended accounts: $${stats.pastDueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${totalStudents} active students currently enrolled`,
      ];
    }
    case 'expiring-credit-cards':
      return [
        `${stats.expiringCreditCards60Days} cards expiring in the next 60 days`,
        'Card expiration tracking requires payment processor integration',
        `${totalStudents} active students with memberships`,
        'Proactive outreach to members with expiring cards improves retention',
      ];
    case 'amount-due': {
      const collectionRate = stats.amountDueNext30Days > 0
        ? ((stats.paymentsLast30Days / stats.amountDueNext30Days) * 100).toFixed(1)
        : '0';
      return [
        `$${stats.amountDueNext30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} expected in the next 30 days`,
        `Based on ${totalStudents} active memberships with autopay`,
        `Historical collection rate: ${collectionRate}%`,
        `$${stats.pastDueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} currently past due`,
      ];
    }
    case 'past-due': {
      // Count members with declined transactions
      const [pastDueMembersResult] = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${transactionSchema.memberId})` })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, 'declined'),
        ));
      const pastDueMembers = Number(pastDueMembersResult?.count ?? 0);
      const avgPerMember = pastDueMembers > 0 ? stats.pastDueTotal / pastDueMembers : 0;
      return [
        `Total past due: $${stats.pastDueTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} across ${pastDueMembers} member${pastDueMembers !== 1 ? 's' : ''}`,
        `Average past due per member: $${avgPerMember.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Failed payments in last 30 days: $${stats.failedPaymentsLast30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${pastDueMembers > 0 ? 'Consider personalized payment plans for affected members' : 'No members currently past due'}`,
      ];
    }
    case 'payments-last-30-days': {
      // Count paid transactions in last 30 days
      const [paidCountResult] = await db
        .select({ count: count() })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, 'paid'),
          gte(transactionSchema.createdAt, thirtyDaysAgo),
        ));
      const paidCount = paidCountResult?.count ?? 0;
      const avgTx = paidCount > 0 ? stats.paymentsLast30Days / paidCount : 0;

      // Count by payment method
      const methodCounts = await db
        .select({
          method: transactionSchema.paymentMethod,
          count: count(),
        })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, 'paid'),
          gte(transactionSchema.createdAt, thirtyDaysAgo),
        ))
        .groupBy(transactionSchema.paymentMethod)
        .orderBy(sql`count(*) DESC`);

      const topMethod = methodCounts[0]?.method ?? 'card';
      const topMethodPct = paidCount > 0 ? ((Number(methodCounts[0]?.count ?? 0) / paidCount) * 100).toFixed(0) : '0';

      return [
        `$${stats.paymentsLast30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} collected in the last 30 days`,
        `${paidCount} successful transactions processed`,
        `Average transaction value: $${avgTx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${topMethod} payments account for ${topMethodPct}% of collections`,
      ];
    }
    case 'payments-pending':
      return [
        `$${stats.paymentsPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in pending payments`,
        `${stats.paymentsPending === 0 ? 'No payments currently awaiting processing' : 'Payments typically clear within 1-3 business days'}`,
        'ACH transfers may take 3-5 business days to settle',
        `$${stats.paymentsLast30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} successfully collected in the last 30 days`,
      ];
    case 'failed-payments': {
      const [failedCountResult] = await db
        .select({ count: count() })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, 'declined'),
          gte(transactionSchema.createdAt, thirtyDaysAgo),
        ));
      const failedCount = failedCountResult?.count ?? 0;
      const failureRate = stats.paymentsLast30Days + stats.failedPaymentsLast30Days > 0
        ? ((stats.failedPaymentsLast30Days / (stats.paymentsLast30Days + stats.failedPaymentsLast30Days)) * 100).toFixed(1)
        : '0';
      return [
        `$${stats.failedPaymentsLast30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in failed payments over the last 30 days`,
        `${failedCount} failed transaction${failedCount !== 1 ? 's' : ''} recorded`,
        `Failure rate: ${failureRate}% of attempted payments`,
        `${stats.autopaysSuspended} member${stats.autopaysSuspended !== 1 ? 's' : ''} with suspended autopay`,
      ];
    }
    case 'income-per-student': {
      const prevMonthStart = new Date();
      prevMonthStart.setMonth(prevMonthStart.getMonth() - 2);
      prevMonthStart.setDate(1);
      const prevMonthEnd = new Date();
      prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);
      prevMonthEnd.setDate(0);

      const [prevResult] = await db
        .select({ total: sum(transactionSchema.amount) })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, 'paid'),
          gte(transactionSchema.createdAt, prevMonthStart),
          sql`${transactionSchema.createdAt} <= ${prevMonthEnd}`,
        ));
      const prevIncome = totalStudents > 0 ? Number(prevResult?.total ?? 0) / totalStudents : 0;
      const change = prevIncome > 0
        ? (((stats.incomePerStudent30Days - prevIncome) / prevIncome) * 100).toFixed(1)
        : '0';

      return [
        `Average income per student: $${stats.incomePerStudent30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over 30 days`,
        `${totalStudents} active student${totalStudents !== 1 ? 's' : ''} currently enrolled`,
        `${Number(change) >= 0 ? '+' : ''}${change}% change from previous period`,
        `Total revenue last 30 days: $${stats.paymentsLast30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ];
    }
    default:
      return [];
  }
}

// Helper functions for chart data

async function getAutopayChartData(organizationId: string, currentYear: number): Promise<ReportChartData> {
  // Count past_due members per month approximation
  const monthly: MonthlyDataPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const endOfMonth = new Date(currentYear, m + 1, 0, 23, 59, 59);
    const endOfMonthPrev = new Date(currentYear - 1, m + 1, 0, 23, 59, 59);

    const [currentResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        eq(memberSchema.status, 'past_due'),
        sql`${memberSchema.createdAt} <= ${endOfMonth}`,
      ));

    const [prevResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        eq(memberSchema.status, 'past_due'),
        sql`${memberSchema.createdAt} <= ${endOfMonthPrev}`,
      ));

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: currentResult?.count ?? 0,
      previousYear: prevResult?.count ?? 0,
    });
  }

  const yearly: YearlyDataPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);
    const [result] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        eq(memberSchema.status, 'past_due'),
        sql`${memberSchema.createdAt} <= ${endOfYear}`,
      ));
    yearly.push({ year: String(y), value: result?.count ?? 0 });
  }

  return { monthly, yearly };
}

function getEmptyChartData(currentYear: number): ReportChartData {
  const monthly = MONTH_NAMES.map(month => ({ month, value: 0, previousYear: 0 }));
  const yearly: YearlyDataPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    yearly.push({ year: String(y), value: 0 });
  }
  return { monthly, yearly };
}

async function getAmountDueChartData(organizationId: string, currentYear: number): Promise<ReportChartData> {
  // Sum active autopay membership plan prices per month (constant based on active members)
  const [currentDue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${membershipPlanSchema.price}), 0)` })
    .from(memberMembershipSchema)
    .innerJoin(memberSchema, eq(memberMembershipSchema.memberId, memberSchema.id))
    .innerJoin(membershipPlanSchema, eq(memberMembershipSchema.membershipPlanId, membershipPlanSchema.id))
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberMembershipSchema.status, 'active'),
      eq(memberMembershipSchema.billingType, 'autopay'),
    ));

  const due = Number(currentDue?.total ?? 0);

  // For chart, use actual paid amounts per month as a proxy for "amount due"
  return getStatusChartData(organizationId, currentYear, 'paid', due);
}

async function getStatusChartData(
  organizationId: string,
  currentYear: number,
  status: string,
  currentMonthOverride?: number,
): Promise<ReportChartData> {
  const monthly: MonthlyDataPoint[] = [];
  const currentMonth = new Date().getMonth();

  for (let m = 0; m < 12; m++) {
    const startOfMonth = new Date(currentYear, m, 1);
    const endOfMonth = new Date(currentYear, m + 1, 0, 23, 59, 59);
    const startOfMonthPrev = new Date(currentYear - 1, m, 1);
    const endOfMonthPrev = new Date(currentYear - 1, m + 1, 0, 23, 59, 59);

    let currentValue = 0;
    // Use override for current month if provided (for amount-due chart)
    if (currentMonthOverride !== undefined && m === currentMonth) {
      currentValue = currentMonthOverride;
    } else {
      const [currentResult] = await db
        .select({ total: sum(transactionSchema.amount) })
        .from(transactionSchema)
        .where(and(
          eq(transactionSchema.organizationId, organizationId),
          eq(transactionSchema.status, status),
          gte(transactionSchema.createdAt, startOfMonth),
          sql`${transactionSchema.createdAt} <= ${endOfMonth}`,
        ));
      currentValue = Number(currentResult?.total ?? 0);
    }

    const [prevResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, status),
        gte(transactionSchema.createdAt, startOfMonthPrev),
        sql`${transactionSchema.createdAt} <= ${endOfMonthPrev}`,
      ));

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: Math.abs(currentValue),
      previousYear: Math.abs(Number(prevResult?.total ?? 0)),
    });
  }

  const yearly: YearlyDataPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const startOfYear = new Date(y, 0, 1);
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);
    const [result] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, status),
        gte(transactionSchema.createdAt, startOfYear),
        sql`${transactionSchema.createdAt} <= ${endOfYear}`,
      ));
    yearly.push({ year: String(y), value: Math.abs(Number(result?.total ?? 0)) });
  }

  return { monthly, yearly };
}

async function getPendingChartData(organizationId: string, currentYear: number): Promise<ReportChartData> {
  const monthly: MonthlyDataPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const startOfMonth = new Date(currentYear, m, 1);
    const endOfMonth = new Date(currentYear, m + 1, 0, 23, 59, 59);
    const startOfMonthPrev = new Date(currentYear - 1, m, 1);
    const endOfMonthPrev = new Date(currentYear - 1, m + 1, 0, 23, 59, 59);

    const [currentResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        inArray(transactionSchema.status, ['pending', 'processing']),
        gte(transactionSchema.createdAt, startOfMonth),
        sql`${transactionSchema.createdAt} <= ${endOfMonth}`,
      ));

    const [prevResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        inArray(transactionSchema.status, ['pending', 'processing']),
        gte(transactionSchema.createdAt, startOfMonthPrev),
        sql`${transactionSchema.createdAt} <= ${endOfMonthPrev}`,
      ));

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: Number(currentResult?.total ?? 0),
      previousYear: Number(prevResult?.total ?? 0),
    });
  }

  const yearly: YearlyDataPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const startOfYear = new Date(y, 0, 1);
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);
    const [result] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        inArray(transactionSchema.status, ['pending', 'processing']),
        gte(transactionSchema.createdAt, startOfYear),
        sql`${transactionSchema.createdAt} <= ${endOfYear}`,
      ));
    yearly.push({ year: String(y), value: Number(result?.total ?? 0) });
  }

  return { monthly, yearly };
}

async function getIncomePerStudentChartData(organizationId: string, currentYear: number): Promise<ReportChartData> {
  const monthly: MonthlyDataPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const startOfMonth = new Date(currentYear, m, 1);
    const endOfMonth = new Date(currentYear, m + 1, 0, 23, 59, 59);
    const startOfMonthPrev = new Date(currentYear - 1, m, 1);
    const endOfMonthPrev = new Date(currentYear - 1, m + 1, 0, 23, 59, 59);

    // Current year income
    const [incomeResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfMonth),
        sql`${transactionSchema.createdAt} <= ${endOfMonth}`,
      ));

    // Current members at end of month
    const [membersResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfMonth}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfMonth})`,
      ));

    const income = Number(incomeResult?.total ?? 0);
    const members = membersResult?.count ?? 1;
    const currentValue = members > 0 ? income / members : 0;

    // Previous year
    const [prevIncomeResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfMonthPrev),
        sql`${transactionSchema.createdAt} <= ${endOfMonthPrev}`,
      ));

    const [prevMembersResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfMonthPrev}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfMonthPrev})`,
      ));

    const prevIncome = Number(prevIncomeResult?.total ?? 0);
    const prevMembers = prevMembersResult?.count ?? 1;
    const prevValue = prevMembers > 0 ? prevIncome / prevMembers : 0;

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: Math.round(currentValue * 100) / 100,
      previousYear: Math.round(prevValue * 100) / 100,
    });
  }

  const yearly: YearlyDataPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const startOfYear = new Date(y, 0, 1);
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);

    const [incomeResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfYear),
        sql`${transactionSchema.createdAt} <= ${endOfYear}`,
      ));

    const [membersResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfYear}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfYear})`,
      ));

    const income = Number(incomeResult?.total ?? 0);
    const members = membersResult?.count ?? 1;
    yearly.push({ year: String(y), value: members > 0 ? Math.round((income / members) * 100) / 100 : 0 });
  }

  return { monthly, yearly };
}
