import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { StaffFilterBar } from './StaffFilterBar';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('StaffFilterBar', () => {
  const mockOnFiltersChange = vi.fn();
  const mockAvailableRoles = ['org:admin', 'org:instructor', 'org:front_desk'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input and role filter', async () => {
      render(
        <StaffFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableRoles={mockAvailableRoles}
        />,
      );

      await expect.element(page.getByTestId('staff-search-input')).toBeVisible();
      await expect.element(page.getByTestId('staff-role-filter')).toBeVisible();
    });

    it('should show placeholder text in search input', async () => {
      render(
        <StaffFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableRoles={mockAvailableRoles}
        />,
      );

      const searchInput = page.getByTestId('staff-search-input');

      await expect.element(searchInput).toHaveAttribute('placeholder', 'search_placeholder');
    });
  });

  describe('Search functionality', () => {
    it('should call onFiltersChangeAction when search input changes', async () => {
      render(
        <StaffFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableRoles={mockAvailableRoles}
        />,
      );

      const searchInput = page.getByTestId('staff-search-input');
      await userEvent.type(searchInput, 'John');

      expect(mockOnFiltersChange).toHaveBeenCalled();

      const lastCall = mockOnFiltersChange.mock.calls.at(-1);

      expect(lastCall?.[0].search).toBe('John');
    });

    it('should update filter with each keystroke', async () => {
      render(
        <StaffFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableRoles={mockAvailableRoles}
        />,
      );

      const searchInput = page.getByTestId('staff-search-input');
      await userEvent.type(searchInput, 'abc');

      expect(mockOnFiltersChange).toHaveBeenCalledTimes(3);
    });
  });
});
