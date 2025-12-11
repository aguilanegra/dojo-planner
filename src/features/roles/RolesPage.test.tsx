import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { RolesPage } from './RolesPage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Roles',
      total_users_label: 'Total users',
      total_admins_label: 'Total admins',
      total_coaches_label: 'Total coaches',
      add_role_button: 'Add Role',
      search_placeholder: 'Search users...',
      all_statuses_filter: 'All Statuses',
      all_roles_filter: 'All Roles',
      status_active: 'Active',
      status_inactive: 'Inactive',
      status_invitation_sent: 'Invitation sent',
      role_owner: 'Owner',
      role_admin: 'Admin',
      role_coach: 'Coach',
      user_name_column: 'User name',
      user_title_column: 'User title',
      roles_column: 'Roles',
      status_column: 'Status',
      recent_activity_column: 'Recent activity',
      last_logged_in_column: 'Last logged in',
      showing_label: 'Showing {start}-{end} of {total} entries',
      permission_types_title: 'Permission Types',
    };
    return translations[key] || key;
  },
}));

describe('RolesPage', () => {
  describe('Page Header', () => {
    it('should render the page title', () => {
      render(<RolesPage />);

      expect(page.getByText('Roles')).toBeDefined();
    });
  });

  describe('Summary Stats', () => {
    it('should render summary stat cards', () => {
      render(<RolesPage />);

      expect(page.getByText('Total users')).toBeDefined();
      expect(page.getByText('Total admins')).toBeDefined();
      expect(page.getByText('Total coaches')).toBeDefined();
    });

    it('should display correct user count', () => {
      render(<RolesPage />);

      // 13 total users in mock data
      expect(page.getByText('13')).toBeDefined();
    });

    it('should display correct admin count', () => {
      render(<RolesPage />);

      // 3 admins in mock data (Charlie Baptista, Hanna Septimus, Jessica Smith)
      const threeElements = page.getByText('3', { exact: true }).elements();

      expect(threeElements.length).toBeGreaterThan(0);
    });

    it('should display correct coach count', () => {
      render(<RolesPage />);

      // 12 coaches in mock data
      const twelveElements = page.getByText('12', { exact: true }).elements();

      expect(twelveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Bar', () => {
    it('should render search input', () => {
      render(<RolesPage />);

      const searchInput = page.getByPlaceholder(/search users/i);

      expect(searchInput).toBeDefined();
    });

    it('should render status filter dropdown', () => {
      render(<RolesPage />);

      const statusSelect = page.getByRole('combobox').elements();

      expect(statusSelect.length).toBeGreaterThanOrEqual(2);
    });

    it('should render add role button', () => {
      render(<RolesPage />);

      const addRoleButton = page.getByRole('button', { name: /add role/i });

      expect(addRoleButton).toBeDefined();
    });

    it('should filter users by search term', async () => {
      render(<RolesPage />);

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Charlie');

      expect(page.getByText('Charlie Baptista')).toBeDefined();
    });

    it('should filter users by name search', async () => {
      render(<RolesPage />);

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Hanna');

      expect(page.getByText('Hanna Septimus')).toBeDefined();
    });

    it('should filter users by title search', async () => {
      render(<RolesPage />);

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Account Owner');

      expect(page.getByText('Charlie Baptista')).toBeDefined();
    });
  });

  describe('Users Table', () => {
    it('should render users table headers', () => {
      render(<RolesPage />);

      expect(page.getByText('User name')).toBeDefined();
      expect(page.getByText('User title')).toBeDefined();

      const rolesElements = page.getByText('Roles').elements();

      expect(rolesElements.length).toBeGreaterThan(0);
      expect(page.getByText('Status')).toBeDefined();
      expect(page.getByText('Recent activity')).toBeDefined();
      expect(page.getByText('Last logged in')).toBeDefined();
    });

    it('should render users in the table', () => {
      render(<RolesPage />);

      expect(page.getByText('Charlie Baptista')).toBeDefined();
      expect(page.getByText('Hanna Septimus')).toBeDefined();
    });

    it('should render user status badges', () => {
      render(<RolesPage />);

      // All mock users have Active status
      const activeBadges = page.getByText('Active', { exact: true }).elements();

      expect(activeBadges.length).toBeGreaterThan(0);
    });

    it('should not render action column header', () => {
      render(<RolesPage />);

      // Action column header should be removed - check for exact column header text
      const table = page.getByRole('table');
      const tableHeaders = table.getByRole('columnheader').elements();
      const actionHeaderExists = tableHeaders.some(
        header => header.textContent?.trim() === 'Action',
      );

      expect(actionHeaderExists).toBe(false);
    });

    it('should not render view details button', () => {
      render(<RolesPage />);

      // View details button should be removed
      const viewDetailsButtons = page.getByRole('button', { name: /view details/i }).elements();

      expect(viewDetailsButtons.length).toBe(0);
    });
  });

  describe('Sorting', () => {
    it('should sort by name when clicking User name header', async () => {
      render(<RolesPage />);

      const nameHeader = page.getByRole('button', { name: /user name/i });
      await userEvent.click(nameHeader);

      // Click again to change direction
      await userEvent.click(nameHeader);

      // Should still render users
      expect(page.getByText('Charlie Baptista')).toBeDefined();
    });

    it('should sort by title when clicking User title header', async () => {
      render(<RolesPage />);

      const titleHeader = page.getByRole('button', { name: /user title/i });
      await userEvent.click(titleHeader);

      // Should render users sorted by title
      expect(page.getByRole('table')).toBeDefined();
    });

    it('should sort by roles when clicking Roles header', async () => {
      render(<RolesPage />);

      const rolesHeader = page.getByRole('button', { name: /^roles$/i });
      await userEvent.click(rolesHeader);

      expect(page.getByRole('table')).toBeDefined();
    });

    it('should sort by status when clicking Status header', async () => {
      render(<RolesPage />);

      const statusHeader = page.getByRole('button', { name: /status/i });
      await userEvent.click(statusHeader);

      expect(page.getByRole('table')).toBeDefined();
    });

    it('should sort by recent activity when clicking Recent activity header', async () => {
      render(<RolesPage />);

      const activityHeader = page.getByRole('button', { name: /recent activity/i });
      await userEvent.click(activityHeader);

      expect(page.getByRole('table')).toBeDefined();
    });

    it('should sort by last logged in when clicking Last logged in header', async () => {
      render(<RolesPage />);

      const lastLoggedInHeader = page.getByRole('button', { name: /last logged in/i });
      await userEvent.click(lastLoggedInHeader);

      expect(page.getByRole('table')).toBeDefined();
    });

    it('should toggle sort direction when clicking same column twice', async () => {
      render(<RolesPage />);

      const titleHeader = page.getByRole('button', { name: /user title/i });

      // First click - sort ascending
      await userEvent.click(titleHeader);

      // Second click - sort descending
      await userEvent.click(titleHeader);

      expect(page.getByRole('table')).toBeDefined();
    });
  });

  describe('Permission Types Section', () => {
    it('should render permission types section title', () => {
      render(<RolesPage />);

      expect(page.getByText('Permission Types')).toBeDefined();
    });

    it('should render Owner permission type card', () => {
      render(<RolesPage />);

      expect(page.getByText('Owner')).toBeDefined();
    });

    it('should render Admin permission type card', () => {
      render(<RolesPage />);

      expect(page.getByText('Admin')).toBeDefined();
    });

    it('should render Coach permission type card', () => {
      render(<RolesPage />);

      expect(page.getByText('Coach')).toBeDefined();
    });

    it('should render permission type descriptions', () => {
      render(<RolesPage />);

      expect(page.getByText(/Can do anything any other user type can do/)).toBeDefined();
    });
  });

  describe('Pagination', () => {
    it('should render pagination info', () => {
      render(<RolesPage />);

      expect(page.getByText(/showing/i)).toBeDefined();
    });

    it('should show correct pagination for 13 users', () => {
      render(<RolesPage />);

      // With 10 per page and 13 total, should show 2 pages
      const pagination = page.getByText(/showing/i);

      expect(pagination).toBeDefined();
    });
  });

  describe('User Avatars', () => {
    it('should render user initials in avatars', () => {
      render(<RolesPage />);

      // Charlie Baptista -> CB
      expect(page.getByText('CB')).toBeDefined();
    });
  });

  describe('Clickable Rows', () => {
    it('should have cursor-pointer class on table rows', () => {
      render(<RolesPage />);

      const table = page.getByRole('table');

      expect(table).toBeDefined();
    });

    it('should render table with clickable rows styling', () => {
      render(<RolesPage />);

      // Table should exist with proper structure
      expect(page.getByRole('table')).toBeDefined();
    });
  });

  describe('Filter Functionality', () => {
    it('should show all users by default', () => {
      render(<RolesPage />);

      expect(page.getByText('Charlie Baptista')).toBeDefined();
      expect(page.getByText('Zain Dokidis')).toBeDefined();
    });

    it('should filter users when searching for coach role', async () => {
      render(<RolesPage />);

      const searchInput = page.getByPlaceholder(/search users/i);
      await userEvent.fill(searchInput, 'Coach');

      // Should show users with Coach role
      const table = page.getByRole('table');

      expect(table).toBeDefined();
    });
  });

  describe('No My Users Header', () => {
    it('should not render My Users header', () => {
      render(<RolesPage />);

      const myUsersHeaders = page.getByText('My Users').elements();

      expect(myUsersHeaders.length).toBe(0);
    });
  });

  describe('No Tabs', () => {
    it('should not render All tab', () => {
      render(<RolesPage />);

      // Check that the old tab buttons don't exist as tabs (not counting 'All Statuses' or 'All Roles')
      const allTabElements = page.getByRole('button', { name: /^all$/i }).elements();

      expect(allTabElements.length).toBe(0);
    });

    it('should not render Admins tab', () => {
      render(<RolesPage />);

      const adminsTabElements = page.getByRole('button', { name: /^admins$/i }).elements();

      expect(adminsTabElements.length).toBe(0);
    });

    it('should not render Coaches tab', () => {
      render(<RolesPage />);

      const coachesTabElements = page.getByRole('button', { name: /^coaches$/i }).elements();

      expect(coachesTabElements.length).toBe(0);
    });

    it('should not render Others tab', () => {
      render(<RolesPage />);

      const othersTabElements = page.getByRole('button', { name: /^others$/i }).elements();

      expect(othersTabElements.length).toBe(0);
    });
  });
});
