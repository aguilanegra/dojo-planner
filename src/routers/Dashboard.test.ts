import type { AuditContext } from '@/types/Audit';
import { ORPCError } from '@orpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ORG_ROLE } from '@/types/Auth';

// Mock all dependencies
vi.mock('@/libs/DB', () => ({ db: {} }));
vi.mock('@/libs/Logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));
vi.mock('./AuthGuards', () => ({
  guardRole: vi.fn(),
}));
vi.mock('@/services/DashboardService', () => ({
  getMembershipStats: vi.fn(),
  getFinancialStats: vi.fn(),
  getMemberAverageChartData: vi.fn(),
  getEarningsChartData: vi.fn(),
}));

const mockContext: AuditContext = {
  userId: 'test-user-123',
  orgId: 'test-org-456',
  role: 'org:front_desk',
};

// Helper to call ORPC handlers
function callHandler(handler: unknown, input?: unknown) {
  const h = handler as { '~orpc': { handler: (args: Record<string, unknown>) => unknown } };
  return h['~orpc'].handler({ input, context: undefined, errors: undefined });
}

describe('Dashboard Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('membershipStats', () => {
    it('should return membership stats on success', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getMembershipStats } = await import('@/services/DashboardService');

      const mockStats = {
        totalPeople: 150,
        totalStudents: 142,
        totalFamilies: 35,
        newStudentsLast30Days: 12,
        autopayOn: 128,
        autopayOff: 14,
        membershipsOnHold: 3,
        cancelledLast30Days: 2,
        membershipNetChange30Days: 10,
      };

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getMembershipStats).mockResolvedValue(mockStats);

      const { membershipStats } = await import('./Dashboard');
      const result = await callHandler(membershipStats);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getMembershipStats).toHaveBeenCalledWith('test-org-456');
      expect(result).toEqual(mockStats);
    });

    it('should rethrow ORPCError from guardRole', async () => {
      const { guardRole } = await import('./AuthGuards');
      const error = new ORPCError('UNAUTHORIZED', {
        message: 'Insufficient permissions',
      });
      vi.mocked(guardRole).mockRejectedValue(error);

      const { membershipStats } = await import('./Dashboard');

      await expect(callHandler(membershipStats)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getMembershipStats } = await import('@/services/DashboardService');

      const serviceError = new Error('Database query failed');
      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getMembershipStats).mockRejectedValue(serviceError);

      const { membershipStats } = await import('./Dashboard');

      await expect(callHandler(membershipStats)).rejects.toThrow(serviceError);
    });
  });

  describe('financialStats', () => {
    it('should return financial stats on success', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getFinancialStats } = await import('@/services/DashboardService');

      const mockStats = {
        autopaysSuspended: 5,
        expiringCreditCards60Days: 8,
        amountDueNext30Days: 12500,
        pastDueTotal: 3200,
        paymentsLast30Days: 45000,
        paymentsPending: 8500,
        failedPaymentsLast30Days: 2,
        incomePerStudent30Days: 317.5,
      };

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getFinancialStats).mockResolvedValue(mockStats);

      const { financialStats } = await import('./Dashboard');
      const result = await callHandler(financialStats);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getFinancialStats).toHaveBeenCalledWith('test-org-456');
      expect(result).toEqual(mockStats);
    });

    it('should rethrow ORPCError from guardRole', async () => {
      const { guardRole } = await import('./AuthGuards');
      const error = new ORPCError('UNAUTHORIZED', {
        message: 'Insufficient permissions',
      });
      vi.mocked(guardRole).mockRejectedValue(error);

      const { financialStats } = await import('./Dashboard');

      await expect(callHandler(financialStats)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getFinancialStats } = await import('@/services/DashboardService');

      const serviceError = new Error('Connection timeout');
      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getFinancialStats).mockRejectedValue(serviceError);

      const { financialStats } = await import('./Dashboard');

      await expect(callHandler(financialStats)).rejects.toThrow(serviceError);
    });
  });

  describe('memberAverageChart', () => {
    it('should return member average chart data on success', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getMemberAverageChartData } = await import('@/services/DashboardService');

      const mockChartData = {
        monthly: [
          { month: '2026-01', value: 145, previousYearValue: 135 },
          { month: '2026-02', value: 150, previousYearValue: 138 },
          { month: '2026-03', value: 152, previousYearValue: null },
        ],
        yearly: [
          { year: '2025', value: 140 },
          { year: '2026', value: 152 },
        ],
      };

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getMemberAverageChartData).mockResolvedValue(mockChartData);

      const { memberAverageChart } = await import('./Dashboard');
      const result = await callHandler(memberAverageChart);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getMemberAverageChartData).toHaveBeenCalledWith('test-org-456');
      expect(result).toEqual(mockChartData);
    });

    it('should rethrow ORPCError from guardRole', async () => {
      const { guardRole } = await import('./AuthGuards');
      const error = new ORPCError('UNAUTHORIZED', {
        message: 'Insufficient permissions',
      });
      vi.mocked(guardRole).mockRejectedValue(error);

      const { memberAverageChart } = await import('./Dashboard');

      await expect(callHandler(memberAverageChart)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getMemberAverageChartData } = await import('@/services/DashboardService');

      const serviceError = new Error('Chart calculation error');
      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getMemberAverageChartData).mockRejectedValue(serviceError);

      const { memberAverageChart } = await import('./Dashboard');

      await expect(callHandler(memberAverageChart)).rejects.toThrow(serviceError);
    });
  });

  describe('earningsChart', () => {
    it('should return earnings chart data on success', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getEarningsChartData } = await import('@/services/DashboardService');

      const mockChartData = {
        monthly: [
          { month: '2026-01', value: 23000, previousYearValue: 21000 },
          { month: '2026-02', value: 25000, previousYearValue: 22000 },
          { month: '2026-03', value: 27500, previousYearValue: null },
        ],
        yearly: [
          { year: '2025', value: 275000 },
          { year: '2026', value: 300000 },
        ],
      };

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getEarningsChartData).mockResolvedValue(mockChartData);

      const { earningsChart } = await import('./Dashboard');
      const result = await callHandler(earningsChart);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getEarningsChartData).toHaveBeenCalledWith('test-org-456');
      expect(result).toEqual(mockChartData);
    });

    it('should rethrow ORPCError from guardRole', async () => {
      const { guardRole } = await import('./AuthGuards');
      const error = new ORPCError('UNAUTHORIZED', {
        message: 'Insufficient permissions',
      });
      vi.mocked(guardRole).mockRejectedValue(error);

      const { earningsChart } = await import('./Dashboard');

      await expect(callHandler(earningsChart)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getEarningsChartData } = await import('@/services/DashboardService');

      const serviceError = new Error('Aggregation failed');
      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getEarningsChartData).mockRejectedValue(serviceError);

      const { earningsChart } = await import('./Dashboard');

      await expect(callHandler(earningsChart)).rejects.toThrow(serviceError);
    });
  });
});
