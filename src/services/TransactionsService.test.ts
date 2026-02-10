import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock DB and Schema modules
vi.mock('@/libs/DB', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('@/models/Schema', () => ({
  memberSchema: {
    id: 'member.id',
    firstName: 'member.firstName',
    lastName: 'member.lastName',
  },
  transactionSchema: {
    id: 'transaction.id',
    organizationId: 'transaction.organizationId',
    memberId: 'transaction.memberId',
    transactionType: 'transaction.transactionType',
    amount: 'transaction.amount',
    currency: 'transaction.currency',
    status: 'transaction.status',
    paymentMethod: 'transaction.paymentMethod',
    description: 'transaction.description',
    processedAt: 'transaction.processedAt',
    createdAt: 'transaction.createdAt',
  },
}));

describe('TransactionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrganizationTransactions', () => {
    it('should return transactions with default options (no filters)', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'payment',
          amount: 10000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Monthly membership',
          processedAt: new Date('2026-01-15'),
          createdAt: new Date('2026-01-15'),
        },
        {
          id: 'txn-2',
          memberId: 'member-2',
          memberFirstName: 'Jane',
          memberLastName: 'Smith',
          transactionType: 'refund',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Partial refund',
          processedAt: new Date('2026-01-14'),
          createdAt: new Date('2026-01-14'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123');

      expect(result).toEqual(mockTransactions);
      expect(db.select).toHaveBeenCalledTimes(1);
      expect(mockFrom).toHaveBeenCalledTimes(1);
      expect(mockInnerJoin).toHaveBeenCalledTimes(1);
      expect(mockWhere).toHaveBeenCalledTimes(1);
      expect(mockOrderBy).toHaveBeenCalledTimes(1);
      expect(mockLimit).toHaveBeenCalledWith(500);
      expect(mockOffset).toHaveBeenCalledWith(0);
    });

    it('should filter by status when provided', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'payment',
          amount: 10000,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'credit_card',
          description: 'Monthly membership',
          processedAt: null,
          createdAt: new Date('2026-01-15'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123', {
        status: 'pending',
      });

      expect(result).toEqual(mockTransactions);
      expect(mockWhere).toHaveBeenCalledTimes(1);
      expect(mockLimit).toHaveBeenCalledWith(500);
    });

    it('should filter by transactionType when provided', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'refund',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Refund',
          processedAt: new Date('2026-01-15'),
          createdAt: new Date('2026-01-15'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123', {
        transactionType: 'refund',
      });

      expect(result).toEqual(mockTransactions);
      expect(mockWhere).toHaveBeenCalledTimes(1);
      expect(mockLimit).toHaveBeenCalledWith(500);
    });

    it('should use custom limit and offset', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'payment',
          amount: 10000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          description: 'Monthly membership',
          processedAt: new Date('2026-01-15'),
          createdAt: new Date('2026-01-15'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123', {
        limit: 50,
        offset: 100,
      });

      expect(result).toEqual(mockTransactions);
      expect(mockOffset).toHaveBeenCalledWith(100);
      expect(mockLimit).toHaveBeenCalledWith(50);
    });

    it('should return empty array when no results', async () => {
      const mockTransactions: any[] = [];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(db.select).toHaveBeenCalledTimes(1);
    });

    it('should filter by both status and transactionType when provided', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: 'John',
          memberLastName: 'Doe',
          transactionType: 'refund',
          amount: 5000,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'credit_card',
          description: 'Pending refund',
          processedAt: null,
          createdAt: new Date('2026-01-15'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123', {
        status: 'pending',
        transactionType: 'refund',
      });

      expect(result).toEqual(mockTransactions);
      expect(mockWhere).toHaveBeenCalledTimes(1);
    });

    it('should handle null values in optional fields', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          memberId: 'member-1',
          memberFirstName: null,
          memberLastName: null,
          transactionType: 'payment',
          amount: 10000,
          currency: 'USD',
          status: 'completed',
          paymentMethod: null,
          description: null,
          processedAt: null,
          createdAt: new Date('2026-01-15'),
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockTransactions);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin = vi.fn().mockReturnValue({ where: mockWhere });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

      const { db } = await import('@/libs/DB');
      vi.mocked(db.select).mockReturnValue(mockSelect() as any);

      const { getOrganizationTransactions } = await import('./TransactionsService');

      const result = await getOrganizationTransactions('org-test-123');

      expect(result).toEqual(mockTransactions);
      expect(result[0]?.memberFirstName).toBeNull();
      expect(result[0]?.memberLastName).toBeNull();
      expect(result[0]?.paymentMethod).toBeNull();
      expect(result[0]?.description).toBeNull();
      expect(result[0]?.processedAt).toBeNull();
    });
  });
});
