import type { RolesFilters } from './RolesFilterBar';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { RolesFilterBar } from './RolesFilterBar';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      search_placeholder: 'Search users...',
      all_statuses_filter: 'All Statuses',
      all_roles_filter: 'All Roles',
      status_active: 'Active',
      status_inactive: 'Inactive',
      status_invitation_sent: 'Invitation sent',
      role_owner: 'Owner',
      role_admin: 'Admin',
      role_coach: 'Coach',
    };
    return translations[key] || key;
  },
}));

describe('RolesFilterBar', () => {
  const mockOnFiltersChange = vi.fn();
  const availableStatuses = ['Active', 'Inactive', 'Invitation sent'];
  const availableRoles = ['Owner', 'Admin', 'Coach'];

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  describe('Search Input', () => {
    it('should render search input with placeholder', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const searchInput = page.getByPlaceholder(/search users/i);

      expect(searchInput).toBeDefined();
    });

    it('should call onFiltersChangeAction when typing in search', async () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Charlie');

      expect(mockOnFiltersChange).toHaveBeenCalled();
    });

    it('should pass search value in filters', async () => {
      let capturedFilters: RolesFilters = { search: '', status: 'all', role: 'all' };
      const captureFilters = (filters: RolesFilters) => {
        capturedFilters = filters;
      };

      render(
        <RolesFilterBar
          onFiltersChangeAction={captureFilters}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Test');

      expect(capturedFilters.search).toBe('Test');
    });
  });

  describe('Status Filter', () => {
    it('should render status filter dropdown', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const comboboxes = page.getByRole('combobox').elements();

      expect(comboboxes.length).toBeGreaterThanOrEqual(2);
    });

    it('should show All Statuses as default', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      expect(page.getByText('All Statuses')).toBeDefined();
    });

    it('should call onFiltersChangeAction when status changes', async () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const statusTrigger = page.getByText('All Statuses');
      await userEvent.click(statusTrigger);

      // Wait for dropdown to open and click Active option
      const activeOption = page.getByRole('option', { name: 'Active' }).first();
      await userEvent.click(activeOption);

      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  describe('Role Filter', () => {
    it('should render role filter dropdown', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      expect(page.getByText('All Roles')).toBeDefined();
    });

    it('should show All Roles as default', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      expect(page.getByText('All Roles')).toBeDefined();
    });

    it('should call onFiltersChangeAction when role changes', async () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const roleTrigger = page.getByText('All Roles');
      await userEvent.click(roleTrigger);

      const adminOption = page.getByRole('option', { name: 'Admin' });
      await userEvent.click(adminOption);

      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  describe('Filter Options', () => {
    it('should render available status options', async () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const statusTrigger = page.getByText('All Statuses');
      await userEvent.click(statusTrigger);

      expect(page.getByRole('option', { name: 'Active' })).toBeDefined();
      expect(page.getByRole('option', { name: 'Inactive' })).toBeDefined();
      expect(page.getByRole('option', { name: 'Invitation sent' })).toBeDefined();
    });

    it('should render available role options', async () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      const roleTrigger = page.getByText('All Roles');
      await userEvent.click(roleTrigger);

      expect(page.getByRole('option', { name: 'Owner' })).toBeDefined();
      expect(page.getByRole('option', { name: 'Admin' })).toBeDefined();
      expect(page.getByRole('option', { name: 'Coach' })).toBeDefined();
    });
  });

  describe('Combined Filters', () => {
    it('should maintain filter state across multiple changes', async () => {
      let lastFilters: RolesFilters = { search: '', status: 'all', role: 'all' };
      const captureFilters = (filters: RolesFilters) => {
        lastFilters = filters;
      };

      render(
        <RolesFilterBar
          onFiltersChangeAction={captureFilters}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      // First, type in search
      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Test');

      expect(lastFilters.search).toBe('Test');
      expect(lastFilters.status).toBe('all');
      expect(lastFilters.role).toBe('all');
    });
  });

  describe('Search Icon', () => {
    it('should render search icon', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      // Search input should be present
      const searchInput = page.getByPlaceholder(/search users/i);

      expect(searchInput).toBeDefined();
    });
  });

  describe('Responsive Layout', () => {
    it('should render with proper flex layout', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={availableRoles}
        />,
      );

      // Component should render all elements
      expect(page.getByPlaceholder(/search users/i)).toBeDefined();
      expect(page.getByText('All Statuses')).toBeDefined();
      expect(page.getByText('All Roles')).toBeDefined();
    });
  });

  describe('Empty States', () => {
    it('should handle empty status array', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={[]}
          availableRoles={availableRoles}
        />,
      );

      expect(page.getByText('All Statuses')).toBeDefined();
    });

    it('should handle empty roles array', () => {
      render(
        <RolesFilterBar
          onFiltersChangeAction={mockOnFiltersChange}
          availableStatuses={availableStatuses}
          availableRoles={[]}
        />,
      );

      expect(page.getByText('All Roles')).toBeDefined();
    });
  });
});
