import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the DB and Schema modules
vi.mock('@/libs/DB');
vi.mock('@/models/Schema', () => ({
  memberSchema: {
    id: 'id',
    organizationId: 'organizationId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  memberMembershipSchema: {
    id: 'id',
    memberId: 'memberId',
    membershipPlanId: 'membershipPlanId',
    status: 'status',
    billingType: 'billingType',
  },
  membershipPlanSchema: {
    id: 'id',
    price: 'price',
  },
  transactionSchema: {
    id: 'id',
    organizationId: 'organizationId',
    status: 'status',
    amount: 'amount',
    createdAt: 'createdAt',
  },
}));

describe('DashboardService', () => {
  let mockQueryBuilder: {
    select: ReturnType<typeof vi.fn>;
    from: ReturnType<typeof vi.fn>;
    innerJoin: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a chainable mock query builder
    mockQueryBuilder = {
      select: vi.fn(),
      from: vi.fn(),
      innerJoin: vi.fn(),
      where: vi.fn(),
      groupBy: vi.fn(),
      orderBy: vi.fn(),
    };

    // Make all methods return the builder for chaining
    mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.from.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.innerJoin.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.groupBy.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.orderBy.mockReturnValue(mockQueryBuilder);
  });

  describe('getMembershipStats', () => {
    it('should return correct membership stats with all fields', async () => {
      // Mock query results for each query in sequence
      const queryResults = [
        [{ count: 100 }], // totalPeople
        [{ count: 85 }], // totalStudents
        [{ count: 15 }], // newStudentsLast30Days
        [{ count: 60 }], // autopayOn
        [{ count: 25 }], // autopayOff
        [{ count: 5 }], // membershipsOnHold
        [{ count: 3 }], // cancelledLast30Days
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMembershipStats } = await import('./DashboardService');
      const result = await getMembershipStats('org_test123');

      expect(result).toEqual({
        totalPeople: 100,
        totalStudents: 85,
        totalFamilies: 85, // Placeholder - same as totalStudents
        newStudentsLast30Days: 15,
        autopayOn: 60,
        autopayOff: 25,
        membershipsOnHold: 5,
        cancelledLast30Days: 3,
        membershipNetChange30Days: 12, // 15 - 3
      });

      // Verify select was called 7 times (one for each stat)
      expect(db.select).toHaveBeenCalledTimes(7);
    });

    it('should handle zero results (empty database)', async () => {
      // Mock all queries returning empty/zero results
      const queryResults = [
        [{ count: 0 }], // totalPeople
        [{ count: 0 }], // totalStudents
        [{ count: 0 }], // newStudentsLast30Days
        [{ count: 0 }], // autopayOn
        [{ count: 0 }], // autopayOff
        [{ count: 0 }], // membershipsOnHold
        [{ count: 0 }], // cancelledLast30Days
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMembershipStats } = await import('./DashboardService');
      const result = await getMembershipStats('org_empty');

      expect(result).toEqual({
        totalPeople: 0,
        totalStudents: 0,
        totalFamilies: 0,
        newStudentsLast30Days: 0,
        autopayOn: 0,
        autopayOff: 0,
        membershipsOnHold: 0,
        cancelledLast30Days: 0,
        membershipNetChange30Days: 0,
      });
    });

    it('should handle null count results gracefully', async () => {
      // Mock queries returning undefined/null count
      const queryResults = [
        [{ count: null }], // totalPeople
        [{ count: undefined }], // totalStudents
        [{ count: 5 }], // newStudentsLast30Days
        [{ count: null }], // autopayOn
        [{ count: undefined }], // autopayOff
        [{ count: null }], // membershipsOnHold
        [{ count: 2 }], // cancelledLast30Days
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMembershipStats } = await import('./DashboardService');
      const result = await getMembershipStats('org_test123');

      expect(result.totalPeople).toBe(0);
      expect(result.totalStudents).toBe(0);
      expect(result.autopayOn).toBe(0);
      expect(result.autopayOff).toBe(0);
      expect(result.membershipsOnHold).toBe(0);
      expect(result.membershipNetChange30Days).toBe(3); // 5 - 2
    });

    it('should calculate membershipNetChange30Days correctly', async () => {
      const queryResults = [
        [{ count: 100 }], // totalPeople
        [{ count: 85 }], // totalStudents
        [{ count: 20 }], // newStudentsLast30Days (new)
        [{ count: 60 }], // autopayOn
        [{ count: 25 }], // autopayOff
        [{ count: 5 }], // membershipsOnHold
        [{ count: 8 }], // cancelledLast30Days (cancelled)
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMembershipStats } = await import('./DashboardService');
      const result = await getMembershipStats('org_test123');

      expect(result.newStudentsLast30Days).toBe(20);
      expect(result.cancelledLast30Days).toBe(8);
      expect(result.membershipNetChange30Days).toBe(12); // 20 - 8
    });
  });

  describe('getFinancialStats', () => {
    it('should return correct financial stats', async () => {
      const queryResults = [
        [{ count: 5 }], // autopaysSuspended
        [ // amountDueNext30Days (array of prices)
          { price: 100 },
          { price: 150 },
          { price: 200 },
        ],
        [{ total: 500 }], // pastDueTotal
        [{ total: 12000 }], // paymentsLast30Days
        [{ total: 300 }], // paymentsPending
        [{ total: 250 }], // failedPaymentsLast30Days
        [{ count: 80 }], // totalStudents (for income per student)
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        const result = queryResults[queryIndex++];
        return Promise.resolve(result);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getFinancialStats } = await import('./DashboardService');
      const result = await getFinancialStats('org_test123');

      expect(result).toEqual({
        autopaysSuspended: 5,
        expiringCreditCards60Days: 0, // Not implemented in schema
        amountDueNext30Days: 450, // 100 + 150 + 200
        pastDueTotal: 500,
        paymentsLast30Days: 12000,
        paymentsPending: 300,
        failedPaymentsLast30Days: 250,
        incomePerStudent30Days: 150, // 12000 / 80
      });

      expect(db.select).toHaveBeenCalledTimes(7);
    });

    it('should handle zero financial data', async () => {
      const queryResults = [
        [{ count: 0 }], // autopaysSuspended
        [], // amountDueNext30Days (no active memberships)
        [{ total: null }], // pastDueTotal
        [{ total: null }], // paymentsLast30Days
        [{ total: null }], // paymentsPending
        [{ total: null }], // failedPaymentsLast30Days
        [{ count: 0 }], // totalStudents
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getFinancialStats } = await import('./DashboardService');
      const result = await getFinancialStats('org_empty');

      expect(result).toEqual({
        autopaysSuspended: 0,
        expiringCreditCards60Days: 0,
        amountDueNext30Days: 0,
        pastDueTotal: 0,
        paymentsLast30Days: 0,
        paymentsPending: 0,
        failedPaymentsLast30Days: 0,
        incomePerStudent30Days: 0, // Avoid division by zero
      });
    });

    it('should calculate incomePerStudent30Days correctly', async () => {
      const queryResults = [
        [{ count: 2 }], // autopaysSuspended
        [{ price: 100 }], // amountDueNext30Days
        [{ total: 100 }], // pastDueTotal
        [{ total: 5000 }], // paymentsLast30Days
        [{ total: 0 }], // paymentsPending
        [{ total: 0 }], // failedPaymentsLast30Days
        [{ count: 25 }], // totalStudents
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getFinancialStats } = await import('./DashboardService');
      const result = await getFinancialStats('org_test123');

      expect(result.paymentsLast30Days).toBe(5000);
      expect(result.incomePerStudent30Days).toBe(200); // 5000 / 25
    });

    it('should handle null prices in amountDueNext30Days', async () => {
      const queryResults = [
        [{ count: 1 }],
        [
          { price: 100 },
          { price: null }, // null price
          { price: undefined }, // undefined price
          { price: 200 },
        ],
        [{ total: 0 }],
        [{ total: 1000 }],
        [{ total: 0 }],
        [{ total: 0 }],
        [{ count: 10 }],
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getFinancialStats } = await import('./DashboardService');
      const result = await getFinancialStats('org_test123');

      expect(result.amountDueNext30Days).toBe(300); // 100 + 0 + 0 + 200
    });

    it('should avoid division by zero when no students', async () => {
      const queryResults = [
        [{ count: 0 }],
        [],
        [{ total: 0 }],
        [{ total: 5000 }], // Has payments but no students
        [{ total: 0 }],
        [{ total: 0 }],
        [{ count: 0 }], // Zero students
      ];

      let queryIndex = 0;
      mockQueryBuilder.where.mockImplementation(() => {
        return Promise.resolve(queryResults[queryIndex++]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getFinancialStats } = await import('./DashboardService');
      const result = await getFinancialStats('org_test123');

      expect(result.incomePerStudent30Days).toBe(0); // Should not be NaN or Infinity
    });
  });

  describe('getMemberAverageChartData', () => {
    it('should return monthly and yearly chart data', async () => {
      // For this test, we'll mock 12 months + 12 months prev year + 5 years = 29 queries
      const mockCount = 50;
      mockQueryBuilder.where.mockResolvedValue([{ count: mockCount }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMemberAverageChartData } = await import('./DashboardService');
      const result = await getMemberAverageChartData('org_test123');

      // Verify structure
      expect(result).toHaveProperty('monthly');
      expect(result).toHaveProperty('yearly');
      expect(result.monthly).toHaveLength(12);
      expect(result.yearly).toHaveLength(5);

      // Verify monthly data structure
      expect(result.monthly[0]).toHaveProperty('month');
      expect(result.monthly[0]).toHaveProperty('value');
      expect(result.monthly[0]).toHaveProperty('previousYearValue');
      expect(result.monthly[0]?.month).toBe('Jan');
      expect(result.monthly[0]?.value).toBe(mockCount);
      expect(result.monthly[0]?.previousYearValue).toBe(mockCount);

      // Verify yearly data structure
      const currentYear = new Date().getFullYear();

      expect(result.yearly[0]).toHaveProperty('year');
      expect(result.yearly[0]).toHaveProperty('value');
      expect(result.yearly[0]?.year).toBe(String(currentYear - 4));
      expect(result.yearly[4]?.year).toBe(String(currentYear));

      // Each month has 2 queries current + prev year, plus 5 years
      expect(db.select).toHaveBeenCalledTimes(12 * 2 + 5);
    });

    it('should handle zero member data', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ count: 0 }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMemberAverageChartData } = await import('./DashboardService');
      const result = await getMemberAverageChartData('org_empty');

      // All months should have 0 values
      expect(result.monthly.every(m => m.value === 0)).toBe(true);
      expect(result.monthly.every(m => m.previousYearValue === 0)).toBe(true);

      // All years should have 0 values
      expect(result.yearly.every(y => y.value === 0)).toBe(true);
    });

    it('should return correct month names in order', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ count: 10 }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMemberAverageChartData } = await import('./DashboardService');
      const result = await getMemberAverageChartData('org_test123');

      const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const actualMonths = result.monthly.map(m => m.month);

      expect(actualMonths).toEqual(expectedMonths);
    });

    it('should handle null count results', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ count: null }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMemberAverageChartData } = await import('./DashboardService');
      const result = await getMemberAverageChartData('org_test123');

      // Null counts should default to 0
      expect(result.monthly.every(m => m.value === 0)).toBe(true);
      expect(result.monthly.every(m => m.previousYearValue === 0)).toBe(true);
      expect(result.yearly.every(y => y.value === 0)).toBe(true);
    });

    it('should calculate correct year range', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ count: 25 }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getMemberAverageChartData } = await import('./DashboardService');
      const result = await getMemberAverageChartData('org_test123');

      const currentYear = new Date().getFullYear();
      const expectedYears = [
        String(currentYear - 4),
        String(currentYear - 3),
        String(currentYear - 2),
        String(currentYear - 1),
        String(currentYear),
      ];
      const actualYears = result.yearly.map(y => y.year);

      expect(actualYears).toEqual(expectedYears);
    });
  });

  describe('getEarningsChartData', () => {
    it('should return monthly and yearly earnings data', async () => {
      const mockTotal = 5000;
      mockQueryBuilder.where.mockResolvedValue([{ total: mockTotal }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_test123');

      // Verify structure
      expect(result).toHaveProperty('monthly');
      expect(result).toHaveProperty('yearly');
      expect(result.monthly).toHaveLength(12);
      expect(result.yearly).toHaveLength(5);

      // Verify monthly data structure
      expect(result.monthly[0]).toHaveProperty('month');
      expect(result.monthly[0]).toHaveProperty('value');
      expect(result.monthly[0]).toHaveProperty('previousYearValue');
      expect(result.monthly[0]?.month).toBe('Jan');
      expect(result.monthly[0]?.value).toBe(mockTotal);
      expect(result.monthly[0]?.previousYearValue).toBe(mockTotal);

      // Verify yearly data structure
      const currentYear = new Date().getFullYear();

      expect(result.yearly[0]).toHaveProperty('year');
      expect(result.yearly[0]).toHaveProperty('value');
      expect(result.yearly[0]?.year).toBe(String(currentYear - 4));
      expect(result.yearly[4]?.year).toBe(String(currentYear));

      // Each month has 2 queries (current + prev year), plus 5 years
      expect(db.select).toHaveBeenCalledTimes(12 * 2 + 5); // 29 total
    });

    it('should handle zero earnings data', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ total: null }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_empty');

      // All months should have 0 values
      expect(result.monthly.every(m => m.value === 0)).toBe(true);
      expect(result.monthly.every(m => m.previousYearValue === 0)).toBe(true);

      // All years should have 0 values
      expect(result.yearly.every(y => y.value === 0)).toBe(true);
    });

    it('should convert total amounts to numbers', async () => {
      // Mock returns string-like totals (as SQL aggregates might)
      mockQueryBuilder.where.mockResolvedValue([{ total: '1234.56' }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_test123');

      // Should convert to number
      expect(typeof result.monthly[0]?.value).toBe('number');
      expect(result.monthly[0]?.value).toBe(1234.56);
    });

    it('should return correct month names in order', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ total: 1000 }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_test123');

      const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const actualMonths = result.monthly.map(m => m.month);

      expect(actualMonths).toEqual(expectedMonths);
    });

    it('should calculate correct year range', async () => {
      mockQueryBuilder.where.mockResolvedValue([{ total: 10000 }]);

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_test123');

      const currentYear = new Date().getFullYear();
      const expectedYears = [
        String(currentYear - 4),
        String(currentYear - 3),
        String(currentYear - 2),
        String(currentYear - 1),
        String(currentYear),
      ];
      const actualYears = result.yearly.map(y => y.year);

      expect(actualYears).toEqual(expectedYears);
    });

    it('should handle varying earnings per month', async () => {
      // Mock different earnings for each month
      let callCount = 0;
      const monthlyEarnings = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500];

      mockQueryBuilder.where.mockImplementation(() => {
        const monthIndex = Math.floor(callCount / 2) % 12;
        callCount++;
        return Promise.resolve([{ total: monthlyEarnings[monthIndex] }]);
      });

      const { db } = await import('@/libs/DB');
      (db as any).select = vi.fn(() => mockQueryBuilder);

      const { getEarningsChartData } = await import('./DashboardService');
      const result = await getEarningsChartData('org_test123');

      // Verify each month has different values
      expect(result.monthly[0]?.value).toBe(1000);
      expect(result.monthly[1]?.value).toBe(1500);
      expect(result.monthly[11]?.value).toBe(6500);
    });
  });
});
