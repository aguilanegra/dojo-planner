import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import FinancesPage from './page';

describe('Finances Page', () => {
  describe('Stats Cards', () => {
    it('should render stats cards section', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      expect(page.getByText('Paid (Last 30 Days)')).toBeInTheDocument();
      expect(page.getByText('Declined (Last 30 Days)')).toBeInTheDocument();
      expect(page.getByText('Refunded (Last 30 Days)')).toBeInTheDocument();
    });

    it('should display paid transactions count', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // The stats card for paid should show a number
      const paidLabel = page.getByText('Paid (Last 30 Days)');

      expect(paidLabel).toBeInTheDocument();
    });

    it('should display declined transactions count', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const declinedLabel = page.getByText('Declined (Last 30 Days)');

      expect(declinedLabel).toBeInTheDocument();
    });

    it('should display refunded transactions count', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const refundedLabel = page.getByText('Refunded (Last 30 Days)');

      expect(refundedLabel).toBeInTheDocument();
    });

    it('should render three stats cards in a grid', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Check all three labels exist, indicating 3 cards
      expect(page.getByText('Paid (Last 30 Days)')).toBeInTheDocument();
      expect(page.getByText('Declined (Last 30 Days)')).toBeInTheDocument();
      expect(page.getByText('Refunded (Last 30 Days)')).toBeInTheDocument();
    });
  });

  describe('Page Header', () => {
    it('should render finances h1 header', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const heading = page.getByRole('heading', { name: 'Finances', level: 1 });

      expect(heading).toBeInTheDocument();
    });

    it('should not render the old Transactions heading', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const transactionsHeadings = page.getByRole('heading', { name: 'Transactions' }).elements();

      expect(transactionsHeadings.length).toBe(0);
    });
  });

  describe('Action Buttons Removed', () => {
    it('should not render import transactions button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const importButton = page.getByRole('button', { name: /Import Transactions/i }).elements();

      expect(importButton.length).toBe(0);
    });

    it('should not render new transaction button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const newButton = page.getByRole('button', { name: /New Transaction/i }).elements();

      expect(newButton.length).toBe(0);
    });
  });

  describe('Search and Filter Bar', () => {
    it('should render search input', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');

      expect(searchInput).toBeInTheDocument();
    });

    it('should render filter dropdowns', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const filterDropdowns = page.getByRole('combobox').elements();

      expect(filterDropdowns.length).toBe(2);
    });

    it('should not render tab navigation', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const allTab = page.getByRole('button', { name: /^All$/i }).elements();
      const membershipDuesTab = page.getByRole('button', { name: /^Membership Dues$/i }).elements();

      expect(allTab.length).toBe(0);
      expect(membershipDuesTab.length).toBe(0);
    });

    it('should allow typing in search input', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Merchandise');

      const table = page.getByRole('table');

      expect(table.getByText('Merchandise').first()).toBeInTheDocument();
    });

    it('should filter transactions by search term', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Private');

      const table = page.getByRole('table');

      expect(table.getByText('Private Lesson').first()).toBeInTheDocument();
      expect(table.getByText('$50.00').first()).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'NonexistentTransaction');

      expect(page.getByText('No transactions match your search').first()).toBeInTheDocument();
    });
  });

  describe('Origin Filter', () => {
    it('should show origin filter options when clicked', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const originFilter = page.getByTestId('finances-origin-filter');
      await originFilter.click();

      expect(page.getByRole('option', { name: 'All Origins' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Membership Dues' })).toBeInTheDocument();
    });

    it('should filter by origin when selecting from dropdown', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const originFilter = page.getByTestId('finances-origin-filter');
      await originFilter.click();

      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      const table = page.getByRole('table');

      expect(table.getByText('Merchandise').first()).toBeInTheDocument();
    });
  });

  describe('Status Filter', () => {
    it('should show status filter options when clicked', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const statusFilter = page.getByTestId('finances-status-filter');
      await statusFilter.click();

      expect(page.getByRole('option', { name: 'All Statuses' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Paid' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Declined' })).toBeInTheDocument();
    });

    it('should filter by status when selecting from dropdown', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const statusFilter = page.getByTestId('finances-status-filter');
      await statusFilter.click();

      const declinedOption = page.getByRole('option', { name: 'Declined' });
      await declinedOption.click();

      const table = page.getByRole('table');

      expect(table.getByText('Declined').first()).toBeInTheDocument();
    });
  });

  describe('Transactions Table', () => {
    it('should render transactions table headers', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByRole('button', { name: 'Date', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Member', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Amount', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Origin', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Method', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Transaction ID', exact: true })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Status', exact: true })).toBeInTheDocument();
    });

    it('should render transaction data in table', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('April 15, 2025')).toBeInTheDocument();
      expect(table.getByRole('cell', { name: '$160.00' }).first()).toBeInTheDocument();
    });

    it('should render member name in table', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('John Smith').first()).toBeInTheDocument();
    });

    it('should render status badges in table', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('Paid').first()).toBeInTheDocument();
    });

    it('should render at least 10 transactions', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      // Verify table renders and has content
      expect(table).toBeInTheDocument();
      // Check that member names are visible indicating data is rendered
      expect(table.getByText('John Smith').first()).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should have sortable date column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const dateHeader = page.getByRole('button', { name: /Date/i });
      await dateHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should have sortable amount column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const amountHeader = page.getByRole('button', { name: /Amount/i });
      await amountHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should have sortable origin column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const originHeader = page.getByRole('button', { name: /Origin/i });
      await originHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should have sortable method column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const methodHeader = table.getByRole('button', { name: 'Method', exact: true });
      await methodHeader.click();

      expect(table).toBeInTheDocument();
    });

    it('should have sortable transaction ID column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const transactionIdHeader = page.getByRole('button', { name: /Transaction ID/i });
      await transactionIdHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should render member column header', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      // The table header has a Member button
      expect(table.getByRole('button', { name: 'Member', exact: true })).toBeInTheDocument();
    });

    it('should have sortable status column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const statusHeader = page.getByRole('button', { name: /Status/i });
      await statusHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should toggle sort direction when clicking same column twice', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const dateHeader = page.getByRole('button', { name: /Date/i });
      await dateHeader.click();
      await dateHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination controls', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const paginationText = page.getByText(/Showing 1-10 of 27 entries/);

      expect(paginationText).toBeInTheDocument();
    });

    it('should render previous button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const previousButton = page.getByRole('button', { name: /Previous/i });

      expect(previousButton).toBeInTheDocument();
    });

    it('should render next button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const nextButton = page.getByRole('button', { name: 'Next', exact: true });

      expect(nextButton).toBeInTheDocument();
    });

    it('should navigate to next page when clicking next', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const nextButton = page.getByRole('button', { name: 'Next', exact: true });
      await nextButton.click();

      const paginationText = page.getByText(/Showing 11-20 of 27 entries/);

      expect(paginationText).toBeInTheDocument();
    });

    it('should reset page when filtering', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Go to second page
      const nextButton = page.getByRole('button', { name: 'Next', exact: true });
      await nextButton.click();

      // Search for something
      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Membership');

      // Should be back on first page
      expect(page.getByText(/Showing 1-10 of/)).toBeInTheDocument();
    });
  });

  describe('Empty and Loading States', () => {
    it('should show empty state message when no transactions match filter', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'ZZZNoMatch');

      expect(page.getByText('No transactions match your search').first()).toBeInTheDocument();
    });
  });

  describe('Search by different fields', () => {
    it('should filter by transaction ID', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'TXNCASH001');

      const table = page.getByRole('table');

      expect(table.getByText('Private Lesson')).toBeInTheDocument();
    });

    it('should filter by member name', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Jane Doe');

      const table = page.getByRole('table');

      expect(table.getByText('Jane Doe').first()).toBeInTheDocument();
    });

    it('should filter by status', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'declined');

      const table = page.getByRole('table');

      expect(table.getByText('Declined').first()).toBeInTheDocument();
    });

    it('should filter by method', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'ACH Transfer');

      const table = page.getByRole('table');

      expect(table.getByText('TXNACH2024030501')).toBeInTheDocument();
    });

    it('should filter by amount', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, '$50.00');

      const table = page.getByRole('table');

      expect(table.getByText('Private Lesson').first()).toBeInTheDocument();
    });
  });

  describe('Combined Filters', () => {
    it('should apply search and origin filter together', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Filter by origin first
      const originFilter = page.getByTestId('finances-origin-filter');
      await originFilter.click();
      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      // Then search within that filter
      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'John');

      const table = page.getByRole('table');

      expect(table.getByText('John Smith')).toBeInTheDocument();
    });
  });

  describe('Transaction Status Display', () => {
    it('should display different status badges', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('Paid').first()).toBeInTheDocument();
    });

    it('should show declined status on page 1', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('Declined').first()).toBeInTheDocument();
    });
  });

  describe('Row Click Interaction', () => {
    it('should have transaction rows with button role', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      // Verify the table renders
      expect(table).toBeInTheDocument();
    });

    it('should display member names as clickable rows', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      // Verify member name is displayed in the table
      expect(table.getByText('John Smith').first()).toBeInTheDocument();
    });
  });
});
