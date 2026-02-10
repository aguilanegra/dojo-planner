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
vi.mock('@/services/TransactionsService', () => ({
  getOrganizationTransactions: vi.fn(),
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

describe('Transactions Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('should return transactions on success', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getOrganizationTransactions } = await import('@/services/TransactionsService');

      const mockTransactions = [
        {
          id: 'txn_1',
          memberId: 'member_1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'payment',
          amount: 10000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Monthly membership',
          processedAt: new Date('2026-01-01'),
          createdAt: new Date('2026-01-01'),
        },
        {
          id: 'txn_2',
          memberId: 'member_2',
          memberFirstName: 'Jane',
          memberLastName: 'Smith',
          transactionType: 'refund',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Refund for cancellation',
          processedAt: new Date('2026-01-02'),
          createdAt: new Date('2026-01-02'),
        },
      ];

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getOrganizationTransactions).mockResolvedValue(mockTransactions);

      const { list } = await import('./Transactions');
      const input = { limit: 10, offset: 0 };
      const result = await callHandler(list, input);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getOrganizationTransactions).toHaveBeenCalledWith('test-org-456', input);
      expect(result).toEqual({ transactions: mockTransactions });
    });

    it('should pass undefined when input is null', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getOrganizationTransactions } = await import('@/services/TransactionsService');

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getOrganizationTransactions).mockResolvedValue([]);

      const { list } = await import('./Transactions');
      const result = await callHandler(list, null);

      expect(guardRole).toHaveBeenCalledWith(ORG_ROLE.FRONT_DESK);
      expect(getOrganizationTransactions).toHaveBeenCalledWith('test-org-456', undefined);
      expect(result).toEqual({ transactions: [] });
    });

    it('should rethrow ORPCError from guardRole', async () => {
      const { guardRole } = await import('./AuthGuards');
      const error = new ORPCError('UNAUTHORIZED', {
        message: 'Insufficient permissions',
      });
      vi.mocked(guardRole).mockRejectedValue(error);

      const { list } = await import('./Transactions');

      await expect(callHandler(list)).rejects.toThrow(error);
    });

    it('should propagate service errors', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getOrganizationTransactions } = await import('@/services/TransactionsService');

      const serviceError = new Error('Database connection failed');
      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getOrganizationTransactions).mockRejectedValue(serviceError);

      const { list } = await import('./Transactions');

      await expect(callHandler(list)).rejects.toThrow(serviceError);
    });

    it('should handle empty transactions list', async () => {
      const { guardRole } = await import('./AuthGuards');
      const { getOrganizationTransactions } = await import('@/services/TransactionsService');

      vi.mocked(guardRole).mockResolvedValue(mockContext);
      vi.mocked(getOrganizationTransactions).mockResolvedValue([]);

      const { list } = await import('./Transactions');
      const result = await callHandler(list, { limit: 10, offset: 0 });

      expect(result).toEqual({ transactions: [] });
    });
  });
});
