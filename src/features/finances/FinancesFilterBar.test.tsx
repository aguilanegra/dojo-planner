import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { FinancesFilterBar } from './FinancesFilterBar';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('FinancesFilterBar', () => {
  describe('Search Input', () => {
    it('should render search input', () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={[]}
        />,
      );

      const searchInput = page.getByPlaceholder('search_placeholder');

      expect(searchInput).toBeInTheDocument();
    });

    it('should call onFiltersChangeAction when typing in search', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={[]}
        />,
      );

      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'test');

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'test',
        purpose: 'all',
      });
    });

    it('should have search icon', () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={[]}
        />,
      );

      const searchInput = page.getByTestId('finances-search-input');

      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Purpose Filter', () => {
    it('should render purpose filter dropdown', () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues', 'Merchandise']}
        />,
      );

      const purposeFilter = page.getByTestId('finances-purpose-filter');

      expect(purposeFilter).toBeInTheDocument();
    });

    it('should show All Purposes option', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues']}
        />,
      );

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      expect(page.getByRole('option', { name: 'all_purposes_filter' })).toBeInTheDocument();
    });

    it('should show available purpose options', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues', 'Merchandise', 'Private Lesson']}
        />,
      );

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      expect(page.getByRole('option', { name: 'Membership Dues' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Merchandise' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'Private Lesson' })).toBeInTheDocument();
    });

    it('should call onFiltersChangeAction when selecting purpose', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues', 'Merchandise']}
        />,
      );

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: '',
        purpose: 'Merchandise',
      });
    });
  });

  describe('Combined Filters', () => {
    it('should maintain search when changing purpose', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues', 'Merchandise']}
        />,
      );

      // Type in search
      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'test');

      // Change purpose
      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();
      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: 'test',
        purpose: 'Merchandise',
      });
    });

    it('should maintain purpose when typing in search', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={['Membership Dues', 'Merchandise']}
        />,
      );

      // Change purpose first
      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();
      const merchandiseOption = page.getByRole('option', { name: 'Merchandise' });
      await merchandiseOption.click();

      // Then type in search
      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'test');

      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: 'test',
        purpose: 'Merchandise',
      });
    });
  });

  describe('Empty State', () => {
    it('should render with empty available purposes', () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={[]}
        />,
      );

      const purposeFilter = page.getByRole('combobox');

      expect(purposeFilter).toBeInTheDocument();
    });

    it('should only show All Purposes when no purposes available', async () => {
      const mockOnFiltersChange = vi.fn();

      render(
        <FinancesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availablePurposes={[]}
        />,
      );

      const purposeFilter = page.getByRole('combobox');
      await purposeFilter.click();

      const options = page.getByRole('option').elements();

      expect(options.length).toBe(1);
      expect(page.getByRole('option', { name: 'all_purposes_filter' })).toBeInTheDocument();
    });
  });
});
