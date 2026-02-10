import { and, count, eq, gte, inArray, ne, sql, sum } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { memberMembershipSchema, memberSchema, membershipPlanSchema, transactionSchema } from '@/models/Schema';

export type MembershipStats = {
  totalPeople: number;
  totalStudents: number;
  totalFamilies: number;
  newStudentsLast30Days: number;
  autopayOn: number;
  autopayOff: number;
  membershipsOnHold: number;
  cancelledLast30Days: number;
  membershipNetChange30Days: number;
};

export type FinancialStats = {
  autopaysSuspended: number;
  expiringCreditCards60Days: number;
  amountDueNext30Days: number;
  pastDueTotal: number;
  paymentsLast30Days: number;
  paymentsPending: number;
  failedPaymentsLast30Days: number;
  incomePerStudent30Days: number;
};

type MonthlyChartPoint = {
  month: string;
  value: number;
  previousYearValue: number | null;
};

type YearlyChartPoint = {
  year: string;
  value: number;
};

export type ChartData = {
  monthly: MonthlyChartPoint[];
  yearly: YearlyChartPoint[];
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function getMembershipStats(organizationId: string): Promise<MembershipStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Total people
  const [totalResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(eq(memberSchema.organizationId, organizationId));
  const totalPeople = totalResult?.count ?? 0;

  // Total students (active or trial)
  const [studentsResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      inArray(memberSchema.status, ['active', 'trial']),
    ));
  const totalStudents = studentsResult?.count ?? 0;

  // New students in last 30 days
  const [newStudentsResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      gte(memberSchema.createdAt, thirtyDaysAgo),
    ));
  const newStudentsLast30Days = newStudentsResult?.count ?? 0;

  // Autopay on (active memberships with billingType = 'autopay')
  const [autopayOnResult] = await db
    .select({ count: count() })
    .from(memberMembershipSchema)
    .innerJoin(memberSchema, eq(memberMembershipSchema.memberId, memberSchema.id))
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberMembershipSchema.status, 'active'),
      eq(memberMembershipSchema.billingType, 'autopay'),
    ));
  const autopayOn = autopayOnResult?.count ?? 0;

  // Autopay off (active memberships with billingType != 'autopay')
  const [autopayOffResult] = await db
    .select({ count: count() })
    .from(memberMembershipSchema)
    .innerJoin(memberSchema, eq(memberMembershipSchema.memberId, memberSchema.id))
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberMembershipSchema.status, 'active'),
      ne(memberMembershipSchema.billingType, 'autopay'),
    ));
  const autopayOff = autopayOffResult?.count ?? 0;

  // On hold
  const [onHoldResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberSchema.status, 'hold'),
    ));
  const membershipsOnHold = onHoldResult?.count ?? 0;

  // Cancelled in last 30 days
  const [cancelledResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberSchema.status, 'cancelled'),
      gte(memberSchema.updatedAt, thirtyDaysAgo),
    ));
  const cancelledLast30Days = cancelledResult?.count ?? 0;

  return {
    totalPeople,
    totalStudents,
    totalFamilies: totalStudents, // Placeholder until family_member is populated
    newStudentsLast30Days,
    autopayOn,
    autopayOff,
    membershipsOnHold,
    cancelledLast30Days,
    membershipNetChange30Days: newStudentsLast30Days - cancelledLast30Days,
  };
}

export async function getFinancialStats(organizationId: string): Promise<FinancialStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Autopays suspended (past_due members with autopay memberships)
  const [suspendedResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .innerJoin(memberMembershipSchema, eq(memberMembershipSchema.memberId, memberSchema.id))
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberSchema.status, 'past_due'),
      eq(memberMembershipSchema.billingType, 'autopay'),
    ));
  const autopaysSuspended = suspendedResult?.count ?? 0;

  // Amount due next 30 days (sum of active autopay membership plan prices)
  const amountDueRows = await db
    .select({ price: membershipPlanSchema.price })
    .from(memberMembershipSchema)
    .innerJoin(memberSchema, eq(memberMembershipSchema.memberId, memberSchema.id))
    .innerJoin(membershipPlanSchema, eq(memberMembershipSchema.membershipPlanId, membershipPlanSchema.id))
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      eq(memberMembershipSchema.status, 'active'),
      eq(memberMembershipSchema.billingType, 'autopay'),
    ));
  const amountDueNext30Days = amountDueRows.reduce((sum, row) => sum + (row.price ?? 0), 0);

  // Past due total (sum of declined transactions)
  const [pastDueResult] = await db
    .select({ total: sum(transactionSchema.amount) })
    .from(transactionSchema)
    .where(and(
      eq(transactionSchema.organizationId, organizationId),
      eq(transactionSchema.status, 'declined'),
    ));
  const pastDueTotal = Number(pastDueResult?.total ?? 0);

  // Payments last 30 days
  const [paymentsResult] = await db
    .select({ total: sum(transactionSchema.amount) })
    .from(transactionSchema)
    .where(and(
      eq(transactionSchema.organizationId, organizationId),
      eq(transactionSchema.status, 'paid'),
      gte(transactionSchema.createdAt, thirtyDaysAgo),
    ));
  const paymentsLast30Days = Number(paymentsResult?.total ?? 0);

  // Payments pending
  const [pendingResult] = await db
    .select({ total: sum(transactionSchema.amount) })
    .from(transactionSchema)
    .where(and(
      eq(transactionSchema.organizationId, organizationId),
      inArray(transactionSchema.status, ['pending', 'processing']),
    ));
  const paymentsPending = Number(pendingResult?.total ?? 0);

  // Failed payments last 30 days
  const [failedResult] = await db
    .select({ total: sum(transactionSchema.amount) })
    .from(transactionSchema)
    .where(and(
      eq(transactionSchema.organizationId, organizationId),
      eq(transactionSchema.status, 'declined'),
      gte(transactionSchema.createdAt, thirtyDaysAgo),
    ));
  const failedPaymentsLast30Days = Number(failedResult?.total ?? 0);

  // Income per student
  const [studentsResult] = await db
    .select({ count: count() })
    .from(memberSchema)
    .where(and(
      eq(memberSchema.organizationId, organizationId),
      inArray(memberSchema.status, ['active', 'trial']),
    ));
  const totalStudents = studentsResult?.count ?? 1;
  const incomePerStudent30Days = totalStudents > 0 ? paymentsLast30Days / totalStudents : 0;

  return {
    autopaysSuspended,
    expiringCreditCards60Days: 0, // Schema has no card expiry field
    amountDueNext30Days,
    pastDueTotal,
    paymentsLast30Days,
    paymentsPending,
    failedPaymentsLast30Days,
    incomePerStudent30Days,
  };
}

export async function getMemberAverageChartData(organizationId: string): Promise<ChartData> {
  const currentYear = new Date().getFullYear();

  // Monthly: count members who existed and were not cancelled at end of each month
  const monthly: MonthlyChartPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const endOfMonth = new Date(currentYear, m + 1, 0, 23, 59, 59);
    const endOfMonthPrev = new Date(currentYear - 1, m + 1, 0, 23, 59, 59);

    const [currentResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfMonth}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfMonth})`,
      ));

    const [prevResult] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfMonthPrev}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfMonthPrev})`,
      ));

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: currentResult?.count ?? 0,
      previousYearValue: prevResult?.count ?? 0,
    });
  }

  // Yearly: last 5 years
  const yearly: YearlyChartPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);
    const [result] = await db
      .select({ count: count() })
      .from(memberSchema)
      .where(and(
        eq(memberSchema.organizationId, organizationId),
        sql`${memberSchema.createdAt} <= ${endOfYear}`,
        sql`(${memberSchema.status} != 'cancelled' OR ${memberSchema.updatedAt} > ${endOfYear})`,
      ));
    yearly.push({
      year: String(y),
      value: result?.count ?? 0,
    });
  }

  return { monthly, yearly };
}

export async function getEarningsChartData(organizationId: string): Promise<ChartData> {
  const currentYear = new Date().getFullYear();

  // Monthly: sum paid transactions by month for current and previous year
  const monthly: MonthlyChartPoint[] = [];
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
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfMonth),
        sql`${transactionSchema.createdAt} <= ${endOfMonth}`,
      ));

    const [prevResult] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfMonthPrev),
        sql`${transactionSchema.createdAt} <= ${endOfMonthPrev}`,
      ));

    monthly.push({
      month: MONTH_NAMES[m]!,
      value: Number(currentResult?.total ?? 0),
      previousYearValue: Number(prevResult?.total ?? 0),
    });
  }

  // Yearly: last 5 years
  const yearly: YearlyChartPoint[] = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    const startOfYear = new Date(y, 0, 1);
    const endOfYear = new Date(y, 11, 31, 23, 59, 59);

    const [result] = await db
      .select({ total: sum(transactionSchema.amount) })
      .from(transactionSchema)
      .where(and(
        eq(transactionSchema.organizationId, organizationId),
        eq(transactionSchema.status, 'paid'),
        gte(transactionSchema.createdAt, startOfYear),
        sql`${transactionSchema.createdAt} <= ${endOfYear}`,
      ));
    yearly.push({
      year: String(y),
      value: Number(result?.total ?? 0),
    });
  }

  return { monthly, yearly };
}
