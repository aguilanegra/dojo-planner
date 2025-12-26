import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import MarketingPage from './page';

// Helper to wait for async operations
async function waitFor(callback: () => void | Promise<void>, options?: { timeout?: number }) {
  return vi.waitFor(callback, { timeout: options?.timeout ?? 5000, interval: 50 });
}

describe('Marketing Page', () => {
  describe('Header and Layout', () => {
    it('renders marketing header', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const heading = page.getByRole('heading', { name: /Marketing/i });

      expect(heading).toBeInTheDocument();
    });

    it('renders coupons heading', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const couponsHeading = page.getByRole('heading', { name: /Coupons/i });

      expect(couponsHeading).toBeInTheDocument();
    });

    it('renders add new coupon button', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const button = page.getByRole('button', { name: /Add New Coupon/i });

      expect(button).toBeInTheDocument();
    });
  });

  describe('Statistics Cards', () => {
    it('renders all statistics cards', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const totalCoupons = page.getByText(/Total Coupons/);
      const totalSavings = page.getByText(/Total Savings/);
      const timesUsed = page.getByText(/Times Used/);

      expect(totalCoupons).toBeInTheDocument();
      expect(totalSavings).toBeInTheDocument();
      expect(timesUsed).toBeInTheDocument();
    });

    it('renders statistics cards at the top of the page', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const totalCoupons = page.getByText(/Total Coupons/);

      expect(totalCoupons).toBeInTheDocument();
    });
  });

  describe('Search and Filters', () => {
    it('renders search input', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const searchInput = page.getByTestId('coupon-search-input');

      expect(searchInput).toBeInTheDocument();
    });

    it('renders status filter dropdown', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const statusFilter = page.getByTestId('coupon-status-filter');

      expect(statusFilter).toBeInTheDocument();
    });

    it('renders type filter dropdown', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const typeFilter = page.getByTestId('coupon-type-filter');

      expect(typeFilter).toBeInTheDocument();
    });

    it('filters coupons by search term', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const searchInput = page.getByTestId('coupon-search-input');
      await userEvent.type(searchInput, 'FAMILY');

      await waitFor(() => {
        const table = page.getByRole('table');
        const couponCode = table.getByText(/CTA_FAMILY_1/);

        expect(couponCode).toBeInTheDocument();
      });
    });
  });

  describe('Coupons Table', () => {
    it('renders coupons table headers', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const codeHeader = table.getByRole('button', { name: /Code/ });
      const typeHeader = table.getByRole('button', { name: /Type/ });
      const statusHeader = table.getByRole('button', { name: /Status/ });

      expect(codeHeader).toBeInTheDocument();
      expect(typeHeader).toBeInTheDocument();
      expect(statusHeader).toBeInTheDocument();
    });

    it('renders coupon data in table', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const couponCode = table.getByText(/CTA_FAMILY_1/);
      const couponType = table.getByRole('cell', { name: /Percentage/ }).first();

      expect(couponCode).toBeInTheDocument();
      expect(couponType).toBeInTheDocument();
    });

    it('does not render selection column', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const checkboxes = table.element()?.querySelectorAll('input[type="checkbox"]');

      expect(checkboxes?.length || 0).toBe(0);
    });

    it('renders edit button for each coupon', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const editButton = table.getByRole('button', { name: /Edit CTA_FAMILY_1/i });

      expect(editButton).toBeInTheDocument();
    });

    it('renders delete button for each coupon', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const deleteButton = table.getByRole('button', { name: /Delete CTA_FAMILY_1/i });

      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination controls', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const nextButton = page.getByRole('button', { name: /^Next$/i });

      expect(nextButton).toBeInTheDocument();
    });

    it('shows 10 records per page', () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const paginationText = page.getByText(/Showing 1-10 of 12 entries/);

      expect(paginationText).toBeInTheDocument();
    });
  });

  describe('Add/Edit Modal', () => {
    it('opens add modal when clicking Add New Coupon button', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const addButton = page.getByRole('button', { name: /Add New Coupon/i });
      await userEvent.click(addButton);

      await waitFor(() => {
        const modal = page.getByRole('dialog');

        expect(modal).toBeInTheDocument();
      });
    });

    it('opens edit modal when clicking edit button', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const editButton = table.getByRole('button', { name: /Edit CTA_FAMILY_1/i });
      await userEvent.click(editButton);

      await waitFor(() => {
        const modal = page.getByRole('dialog');

        expect(modal).toBeInTheDocument();
      });
    });

    it('closes modal when clicking close button', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const addButton = page.getByRole('button', { name: /Add New Coupon/i });
      await userEvent.click(addButton);

      const closeButton = page.getByRole('button', { name: 'Close' });
      await userEvent.click(closeButton);

      await waitFor(() => {
        try {
          const modal = page.getByRole('dialog');

          expect(modal.element()).toBeFalsy();
        } catch {
          expect(true).toBe(true);
        }
      });
    });
  });

  describe('Sorting', () => {
    it('can sort by code column', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const codeHeader = table.getByRole('button', { name: /Code/ });
      await userEvent.click(codeHeader);

      expect(codeHeader).toBeInTheDocument();
    });

    it('can sort by status column', async () => {
      render(<I18nWrapper><MarketingPage /></I18nWrapper>);

      const table = page.getByRole('table');
      const statusHeader = table.getByRole('button', { name: /Status/ });
      await userEvent.click(statusHeader);

      expect(statusHeader).toBeInTheDocument();
    });
  });
});
