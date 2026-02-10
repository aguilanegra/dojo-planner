import { os } from '@orpc/server';
import { getEarningsChartData, getFinancialStats, getMemberAverageChartData, getMembershipStats } from '@/services/DashboardService';
import { ORG_ROLE } from '@/types/Auth';
import { guardRole } from './AuthGuards';

export const membershipStats = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);
  return getMembershipStats(orgId);
});

export const financialStats = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);
  return getFinancialStats(orgId);
});

export const memberAverageChart = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);
  return getMemberAverageChartData(orgId);
});

export const earningsChart = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);
  return getEarningsChartData(orgId);
});
