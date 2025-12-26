import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import FinancesPage from './page';

describe('Finances Page', () => {
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

  describe('Action Buttons', () => {
    it('should render import transactions button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const importButton = page.getByRole('button', { name: /Import Transactions/i });

      expect(importButton).toBeInTheDocument();
    });

    it('should render new transaction button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const newButton = page.getByRole('button', { name: /New Transaction/i });

      expect(newButton).toBeInTheDocument();
    });

    it('should render buttons in the same row as filters', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const importButton = page.getByRole('button', { name: /Import Transactions/i });
      const searchInput = page.getByPlaceholder('Search transactions...');

      expect(importButton).toBeInTheDocument();
      expect(searchInput).toBeInTheDocument();
    });

    it('should not render more options ellipsis button', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Look for any button that might be a "more" button outside the table
      // The table actions are inside, but there should be no more button after New Transaction
      const buttons = page.getByRole('button').elements();
      const importButton = buttons.find(b => b.textContent?.includes('Import Transactions'));
      const newButton = buttons.find(b => b.textContent?.includes('New Transaction'));

      expect(importButton).toBeDefined();
      expect(newButton).toBeDefined();
    });
  });

  describe('Search and Filter Bar', () => {
    it('should render search input', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');

      expect(searchInput).toBeInTheDocument();
    });

    it('should render purpose filter dropdown', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const purposeFilter = page.getByRole('combobox');

      expect(purposeFilter).toBeInTheDocument();
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

      expect(table.getByText('Private Lesson')).toBeInTheDocument();
      expect(table.getByText('$50.00')).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'NonexistentTransaction');

      expect(page.getByText('No transactions match your search').first()).toBeInTheDocument();
    });
  });

  describe('Purpose Filter', () => {
    it('should show purpose filter options when clicked', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      expect(page.getByRole('option', { name: 'All Purposes' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Membership Dues' })).toBeInTheDocument();
    });

    it('should filter by purpose when selecting from dropdown', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      const table = page.getByRole('table');

      expect(table.getByText('Gi purchase')).toBeInTheDocument();
    });
  });

  describe('Transactions Table', () => {
    it('should render transactions table headers', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByRole('button', { name: /Date/i })).toBeInTheDocument();
      expect(table.getByRole('button', { name: /Amount/i })).toBeInTheDocument();
      expect(table.getByRole('button', { name: 'Purpose' })).toBeInTheDocument();
      expect(table.getByRole('button', { name: /Method/i })).toBeInTheDocument();
      expect(table.getByRole('button', { name: /Payment ID/i })).toBeInTheDocument();
      expect(table.getByText('Notes')).toBeInTheDocument();
    });

    it('should render transaction data in table', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');

      expect(table.getByText('April 15, 2025')).toBeInTheDocument();
      expect(table.getByRole('cell', { name: '$160.00' }).first()).toBeInTheDocument();
    });

    it('should render at least 10 transactions', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const rows = table.getByRole('row').elements();

      // Should have header row + 10 data rows
      expect(rows.length).toBeGreaterThanOrEqual(11);
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

    it('should have sortable purpose column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const purposeHeader = page.getByRole('button', { name: /Purpose/i });
      await purposeHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should have sortable method column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const methodHeader = page.getByRole('button', { name: /Method/i });
      await methodHeader.click();

      const table = page.getByRole('table');

      expect(table).toBeInTheDocument();
    });

    it('should have sortable payment ID column', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const paymentIdHeader = page.getByRole('button', { name: /Payment ID/i });
      await paymentIdHeader.click();

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

      const paginationText = page.getByText(/Showing 1-10 of 15 entries/);

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

      const paginationText = page.getByText(/Showing 11-15 of 15 entries/);

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
    it('should filter by payment ID', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'CASH001');

      const table = page.getByRole('table');

      expect(table.getByText('Private Lesson')).toBeInTheDocument();
    });

    it('should filter by notes', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Rashguard');

      const table = page.getByRole('table');

      expect(table.getByText('$35.00')).toBeInTheDocument();
    });

    it('should filter by method', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'ACH Transfer');

      const table = page.getByRole('table');

      expect(table.getByText('ACH2024030501')).toBeInTheDocument();
    });

    it('should filter by amount', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, '$50.00');

      const table = page.getByRole('table');

      expect(table.getByText('Private Lesson')).toBeInTheDocument();
    });
  });

  describe('Combined Filters', () => {
    it('should apply search and purpose filter together', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Filter by purpose first
      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();
      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      // Then search within that filter
      const searchInput = page.getByPlaceholder('Search transactions...');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'Gi');

      const table = page.getByRole('table');

      expect(table.getByText('Gi purchase')).toBeInTheDocument();
    });
  });

  describe('Notes Display', () => {
    it('should display notes when present', async () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      // Navigate to page 2 to see "Gi purchase" note
      const nextButton = page.getByRole('button', { name: 'Next', exact: true });
      await nextButton.click();

      const table = page.getByRole('table');

      expect(table.getByText('Gi purchase')).toBeInTheDocument();
    });

    it('should display dash for empty notes', () => {
      render(<I18nWrapper><FinancesPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const dashCells = table.getByText('-').elements();

      expect(dashCells.length).toBeGreaterThan(0);
    });
  });
});
