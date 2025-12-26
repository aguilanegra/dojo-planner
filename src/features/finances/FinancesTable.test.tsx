import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { FinancesTable } from './FinancesTable';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Helper to create mock transactions
const createMockTransaction = (overrides = {}) => ({
  id: '1',
  date: 'April 15, 2025',
  amount: '$160.00',
  purpose: 'Membership Dues',
  method: 'Saved Card Ending ****1234',
  paymentId: '71MC01ANQ130',
  notes: '',
  ...overrides,
});

describe('FinancesTable', () => {
  describe('Page Header', () => {
    it('should render title heading', () => {
      const mockTransactions = [createMockTransaction()];

      render(<FinancesTable transactions={mockTransactions} />);

      const heading = page.getByRole('heading', { name: 'title', level: 1 });

      expect(heading).toBeInTheDocument();
    });
  });

  describe('Render method', () => {
    it('should render transactions table with transactions list', () => {
      const mockTransactions = [createMockTransaction()];

      render(<FinancesTable transactions={mockTransactions} />);

      const table = page.getByRole('table');

      expect(table.getByText('April 15, 2025')).toBeInTheDocument();
    });

    it('should render empty state when no transactions', () => {
      render(<FinancesTable transactions={[]} />);

      const emptyState = page.getByText('no_transactions').first();

      expect(emptyState).toBeInTheDocument();
    });

    it('should render loading state when loading prop is true', () => {
      render(<FinancesTable transactions={[]} loading />);

      const loadingText = page.getByText('loading_transactions').first();

      expect(loadingText).toBeInTheDocument();
    });

    it('should render header actions when provided', () => {
      render(
        <FinancesTable
          transactions={[]}
          headerActions={<button type="button">Add Transaction</button>}
        />,
      );

      const addButton = page.getByRole('button', { name: 'Add Transaction' });

      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort transactions by date column', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', date: 'April 15, 2025' }),
        createMockTransaction({ id: '2', date: 'March 15, 2025' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const dateHeader = page.getByRole('button', { name: /table_date/i });
      await dateHeader.click();

      const table = page.getByRole('table');

      expect(table.getByText('April 15, 2025')).toBeInTheDocument();
      expect(table.getByText('March 15, 2025')).toBeInTheDocument();
    });

    it('should sort transactions by amount column', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', amount: '$200.00' }),
        createMockTransaction({ id: '2', amount: '$100.00' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const amountHeader = page.getByRole('button', { name: /table_amount/i });
      await amountHeader.click();

      const table = page.getByRole('table');

      expect(table.getByText('$200.00')).toBeInTheDocument();
      expect(table.getByText('$100.00')).toBeInTheDocument();
    });

    it('should sort transactions by purpose column', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', purpose: 'Merchandise' }),
        createMockTransaction({ id: '2', purpose: 'Membership Dues' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const purposeHeader = page.getByRole('button', { name: /table_purpose/i });
      await purposeHeader.click();

      const table = page.getByRole('table');

      expect(table.getByText('Merchandise')).toBeInTheDocument();
      expect(table.getByText('Membership Dues')).toBeInTheDocument();
    });

    it('should toggle sort direction when clicking same column twice', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', date: 'April 15, 2025' }),
        createMockTransaction({ id: '2', date: 'March 15, 2025' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const dateHeader = page.getByRole('button', { name: /table_date/i });
      await dateHeader.click();
      await dateHeader.click();

      const table = page.getByRole('table');

      expect(table.getByText('April 15, 2025')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should have a search input', () => {
      const mockTransactions = [createMockTransaction()];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');

      expect(searchInput).toBeInTheDocument();
    });

    it('should allow typing in search input', async () => {
      const mockTransactions = [createMockTransaction()];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Membership');

      const table = page.getByRole('table');

      expect(table.getByText('Membership Dues')).toBeInTheDocument();
    });

    it('should filter by search term', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', purpose: 'Membership Dues' }),
        createMockTransaction({ id: '2', purpose: 'Merchandise' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Merchandise');

      const table = page.getByRole('table');

      expect(table.getByText('Merchandise')).toBeInTheDocument();
    });

    it('should have purpose filter dropdown', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', purpose: 'Membership Dues' }),
        createMockTransaction({ id: '2', purpose: 'Merchandise' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const purposeTrigger = page.getByRole('combobox');
      await purposeTrigger.click();

      expect(page.getByRole('option', { name: 'Membership Dues' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Merchandise' })).toBeInTheDocument();
    });

    it('should filter by purpose when selecting from dropdown', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', purpose: 'Membership Dues' }),
        createMockTransaction({ id: '2', purpose: 'Merchandise', notes: 'Gi purchase' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const purposeTrigger = page.getByRole('combobox');
      await purposeTrigger.click();

      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      const table = page.getByRole('table');

      expect(table.getByText('Gi purchase')).toBeInTheDocument();
    });

    it('should show no results message when filter has no matches', async () => {
      const mockTransactions = [createMockTransaction()];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'NonexistentItem');

      expect(page.getByText('no_results_found').first()).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should show pagination when there are more than 10 transactions', () => {
      const mockTransactions = Array.from({ length: 15 }, (_, i) =>
        createMockTransaction({ id: `${i}`, date: `April ${i + 1}, 2025` }));

      render(<FinancesTable transactions={mockTransactions} />);

      expect(page.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
      expect(page.getByRole('button', { name: 'Next', exact: true })).toBeInTheDocument();
    });

    it('should only show first 10 transactions on first page', () => {
      const mockTransactions = Array.from({ length: 15 }, (_, i) =>
        createMockTransaction({ id: `${i}`, paymentId: `PAY${String(i).padStart(2, '0')}` }));

      render(<FinancesTable transactions={mockTransactions} />);

      const table = page.getByRole('table');

      expect(table.getByText('PAY00')).toBeInTheDocument();
      expect(table.getByText('PAY09')).toBeInTheDocument();
      expect(table.getByText('PAY10').elements()).toHaveLength(0);
    });

    it('should navigate to second page when clicking next', async () => {
      const mockTransactions = Array.from({ length: 15 }, (_, i) =>
        createMockTransaction({ id: `${i}`, paymentId: `PAY${String(i).padStart(2, '0')}` }));

      render(<FinancesTable transactions={mockTransactions} />);

      const nextButton = page.getByRole('button', { name: 'Next', exact: true });
      await nextButton.click();

      const table = page.getByRole('table');

      expect(table.getByText('PAY10')).toBeInTheDocument();
    });

    it('should reset page when filtering', async () => {
      const mockTransactions = Array.from({ length: 15 }, (_, i) =>
        createMockTransaction({ id: `${i}`, paymentId: `PAY${String(i).padStart(2, '0')}` }));

      render(<FinancesTable transactions={mockTransactions} />);

      const nextButton = page.getByRole('button', { name: 'Next', exact: true });
      await nextButton.click();

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'PAY01');

      const table = page.getByRole('table');

      expect(table.getByText('PAY01')).toBeInTheDocument();
    });
  });

  describe('Notes display', () => {
    it('should display notes when present', () => {
      const mockTransactions = [createMockTransaction({ notes: 'Test note' })];

      render(<FinancesTable transactions={mockTransactions} />);

      const table = page.getByRole('table');

      expect(table.getByText('Test note')).toBeInTheDocument();
    });

    it('should display dash for empty notes', () => {
      const mockTransactions = [createMockTransaction({ notes: '' })];

      render(<FinancesTable transactions={mockTransactions} />);

      const table = page.getByRole('table');

      expect(table.getByText('-').first()).toBeInTheDocument();
    });
  });

  describe('Search by different fields', () => {
    it('should filter by payment ID', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', paymentId: 'PAY001' }),
        createMockTransaction({ id: '2', paymentId: 'PAY002' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'PAY001');

      const table = page.getByRole('table');

      expect(table.getByText('PAY001')).toBeInTheDocument();
      expect(table.getByText('PAY002').elements()).toHaveLength(0);
    });

    it('should filter by method', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', method: 'Credit Card' }),
        createMockTransaction({ id: '2', method: 'Cash' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Cash');

      const table = page.getByRole('table');

      expect(table.getByText('Cash')).toBeInTheDocument();
    });

    it('should filter by notes', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', notes: 'Gi purchase' }),
        createMockTransaction({ id: '2', notes: 'Belt upgrade' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Belt');

      const table = page.getByRole('table');

      expect(table.getByText('Belt upgrade')).toBeInTheDocument();
    });
  });

  describe('Dynamic filter options', () => {
    it('should only show available purposes in filter', async () => {
      const mockTransactions = [
        createMockTransaction({ id: '1', purpose: 'Membership Dues' }),
        createMockTransaction({ id: '2', purpose: 'Merchandise' }),
      ];

      render(<FinancesTable transactions={mockTransactions} />);

      const purposeTrigger = page.getByRole('combobox');
      await purposeTrigger.click();

      expect(page.getByRole('option', { name: 'Membership Dues' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Merchandise' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Seminar' }).elements()).toHaveLength(0);
    });
  });
});
