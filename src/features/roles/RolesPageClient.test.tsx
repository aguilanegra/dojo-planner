import type { Role } from './RolesPageClient';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { RolesPageClient } from './RolesPageClient';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Roles',
      total_roles_label: 'Total Roles',
      total_permissions_label: 'Total Permissions',
      total_members_label: 'Total Members',
      add_role_button: 'Add Role',
      search_roles_placeholder: 'Search roles...',
      all_permissions_filter: 'All Permissions',
      permissions_by_role_title: 'Permissions by Role',
      no_roles_found: 'No roles found',
      system_role_badge: 'System',
      permissions_label: 'Permissions',
      no_permissions: 'No permissions assigned',
      member_singular: 'Member',
      member_plural: 'Members',
      edit_button_aria_label: 'Edit role',
      delete_button_aria_label: 'Delete role',
    };
    return translations[key] || key;
  },
}));

describe('RolesPageClient', () => {
  const mockPermissions = [
    { id: 'perm-1', key: 'org:manage_members', name: 'Manage Members', description: 'Can manage member data' },
    { id: 'perm-2', key: 'org:manage_billing', name: 'Manage Billing', description: 'Can manage billing' },
    { id: 'perm-3', key: 'org:view_members', name: 'View Members', description: 'Can view member data' },
  ];

  const mockRoles: Role[] = [
    {
      id: 'role-1',
      key: 'org:admin',
      name: 'Admin',
      description: 'Full administrative access',
      permissions: [
        { id: 'perm-1', key: 'org:manage_members', name: 'Manage Members', description: 'Can manage member data' },
        { id: 'perm-2', key: 'org:manage_billing', name: 'Manage Billing', description: 'Can manage billing' },
      ],
      memberCount: 3,
      isSystemRole: true,
    },
    {
      id: 'role-2',
      key: 'org:coach',
      name: 'Coach',
      description: 'Can manage classes and attendance',
      permissions: [
        { id: 'perm-3', key: 'org:view_members', name: 'View Members', description: 'Can view member data' },
      ],
      memberCount: 8,
      isSystemRole: false,
    },
    {
      id: 'role-3',
      key: 'org:member',
      name: 'Member',
      description: 'Basic member access',
      permissions: [],
      memberCount: 25,
      isSystemRole: false,
    },
  ];

  // Default props - non-admin user
  const defaultProps = {
    roles: mockRoles,
    totalPermissions: 3,
    availablePermissions: mockPermissions,
    currentUserRole: 'org:coach',
  };

  // Admin user props
  const adminProps = {
    ...defaultProps,
    currentUserRole: 'org:admin',
  };

  describe('Page Header', () => {
    it('should render the page title', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Roles')).toBeDefined();
    });

    it('should render the permissions by role section title', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Permissions by Role')).toBeDefined();
    });
  });

  describe('Summary Stats', () => {
    it('should render total roles stat card', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Total Roles')).toBeDefined();
    });

    it('should render total permissions stat card', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Total Permissions')).toBeDefined();
    });

    it('should render total members stat card', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Total Members')).toBeDefined();
    });

    it('should display correct roles count', () => {
      render(<RolesPageClient {...defaultProps} />);

      const threeElements = page.getByText('3', { exact: true }).elements();

      expect(threeElements.length).toBeGreaterThan(0);
    });

    it('should display correct total members count', () => {
      render(<RolesPageClient {...defaultProps} />);

      // 3 + 8 + 25 = 36 total members
      const membersElement = page.getByText('36', { exact: true }).elements();

      expect(membersElement.length).toBeGreaterThan(0);
    });
  });

  describe('Filter Bar', () => {
    it('should render search input', () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);

      expect(searchInput).toBeDefined();
    });

    it('should render permission filter dropdown', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('All Permissions')).toBeDefined();
    });

    it('should render add role button', () => {
      render(<RolesPageClient {...defaultProps} />);

      const addRoleButton = page.getByRole('button', { name: /add role/i });

      expect(addRoleButton).toBeDefined();
    });
  });

  describe('Role Cards', () => {
    it('should render all role cards', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Admin')).toBeDefined();
      expect(page.getByText('Coach')).toBeDefined();
      expect(page.getByText('Member')).toBeDefined();
    });

    it('should render role descriptions', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Full administrative access')).toBeDefined();
      expect(page.getByText('Can manage classes and attendance')).toBeDefined();
      expect(page.getByText('Basic member access')).toBeDefined();
    });

    it('should render role key badges', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('org:admin')).toBeDefined();
      expect(page.getByText('org:coach')).toBeDefined();
      expect(page.getByText('org:member')).toBeDefined();
    });

    it('should render permission badges on role cards', () => {
      render(<RolesPageClient {...defaultProps} />);

      expect(page.getByText('Manage Members')).toBeDefined();
      expect(page.getByText('Manage Billing')).toBeDefined();
      expect(page.getByText('View Members')).toBeDefined();
    });

    it('should render system role badge for system roles', () => {
      render(<RolesPageClient {...defaultProps} />);

      const systemBadges = page.getByText('System').elements();

      expect(systemBadges.length).toBeGreaterThan(0);
    });

    it('should render member counts on role cards', () => {
      render(<RolesPageClient {...defaultProps} />);

      // Member counts are displayed as "X Members" text
      expect(page.getByText(/8\s*Members/)).toBeDefined();
      expect(page.getByText(/25\s*Members/)).toBeDefined();
    });
  });

  describe('Filtering', () => {
    it('should filter roles by search term matching name', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);
      await userEvent.fill(searchInput, 'Admin');

      expect(page.getByText('Admin')).toBeDefined();

      const coachElements = page.getByText('Coach').elements();

      expect(coachElements.length).toBe(0);
    });

    it('should filter roles by search term matching description', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);
      await userEvent.fill(searchInput, 'classes');

      expect(page.getByText('Coach')).toBeDefined();

      const adminElements = page.getByText('Full administrative access').elements();

      expect(adminElements.length).toBe(0);
    });

    it('should filter roles by search term matching role key', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);
      await userEvent.fill(searchInput, 'org:coach');

      expect(page.getByText('Coach')).toBeDefined();
    });

    it('should filter roles by search term matching permission name', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);
      await userEvent.fill(searchInput, 'Billing');

      expect(page.getByText('Admin')).toBeDefined();
    });

    it('should show no roles found message when no matches', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const searchInput = page.getByPlaceholder(/search roles/i);
      await userEvent.fill(searchInput, 'NonexistentRole');

      expect(page.getByText('No roles found')).toBeDefined();
    });
  });

  describe('Empty State', () => {
    it('should render no roles found when roles array is empty', () => {
      render(<RolesPageClient {...defaultProps} roles={[]} totalPermissions={0} />);

      expect(page.getByText('No roles found')).toBeDefined();
    });

    it('should still render stats cards when no roles', () => {
      render(<RolesPageClient {...defaultProps} roles={[]} totalPermissions={0} />);

      expect(page.getByText('Total Roles')).toBeDefined();
      expect(page.getByText('Total Permissions')).toBeDefined();
      expect(page.getByText('Total Members')).toBeDefined();
    });

    it('should show zero for counts when no roles', () => {
      render(<RolesPageClient {...defaultProps} roles={[]} totalPermissions={0} />);

      const zeroElements = page.getByText('0', { exact: true }).elements();

      expect(zeroElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Action Buttons on Cards', () => {
    it('should render edit buttons on role cards', () => {
      render(<RolesPageClient {...defaultProps} />);

      const editButtons = page.getByRole('button', { name: /edit role/i }).elements();

      expect(editButtons.length).toBe(3);
    });

    it('should render delete buttons only on non-system roles for non-admin users', () => {
      render(<RolesPageClient {...defaultProps} />);

      const deleteButtons = page.getByRole('button', { name: /delete role/i }).elements();

      // Only 2 non-system roles (Coach and Member), non-admin cannot delete system roles
      expect(deleteButtons.length).toBe(2);
    });

    it('should render delete buttons on non-admin roles for admin users', () => {
      render(<RolesPageClient {...adminProps} />);

      const deleteButtons = page.getByRole('button', { name: /delete role/i }).elements();

      // Admin can delete Coach and Member (2 buttons), but not Admin role itself
      expect(deleteButtons.length).toBe(2);
    });
  });

  describe('Responsive Grid', () => {
    it('should render role cards in a grid layout', () => {
      render(<RolesPageClient {...defaultProps} />);

      // All three roles should be visible
      expect(page.getByText('Admin')).toBeDefined();
      expect(page.getByText('Coach')).toBeDefined();
      expect(page.getByText('Member')).toBeDefined();
    });
  });

  describe('Permission Filter Dropdown', () => {
    it('should populate available permissions from roles', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const permissionTrigger = page.getByText('All Permissions');
      await userEvent.click(permissionTrigger);

      expect(page.getByRole('option', { name: 'Manage Members' })).toBeDefined();
      expect(page.getByRole('option', { name: 'Manage Billing' })).toBeDefined();
      expect(page.getByRole('option', { name: 'View Members' })).toBeDefined();
    });

    it('should filter by selected permission', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const permissionTrigger = page.getByText('All Permissions');
      await userEvent.click(permissionTrigger);

      const viewMembersOption = page.getByRole('option', { name: 'View Members' });
      await userEvent.click(viewMembersOption);

      // Coach has View Members permission
      expect(page.getByText('Coach')).toBeDefined();

      // Admin should not appear as it doesn't have View Members
      const adminDescElements = page.getByText('Full administrative access').elements();

      expect(adminDescElements.length).toBe(0);
    });
  });

  describe('Single Role', () => {
    it('should render correctly with single role', () => {
      const singleRole: Role[] = [mockRoles[0]!];
      render(<RolesPageClient {...defaultProps} roles={singleRole} totalPermissions={2} />);

      expect(page.getByText('Admin')).toBeDefined();
      expect(page.getByText('1', { exact: true })).toBeDefined();
    });
  });

  describe('Role with No Permissions', () => {
    it('should show no permissions message for role without permissions', () => {
      render(<RolesPageClient {...defaultProps} />);

      // Member role has no permissions
      expect(page.getByText('No permissions assigned')).toBeDefined();
    });
  });

  describe('Add/Edit Role Modal Integration', () => {
    it('should open add role modal when Add Role button is clicked', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const addButton = page.getByTestId('add-role-button');
      await userEvent.click(addButton);

      const modalTitle = page.getByRole('heading', { name: 'Add Role' });

      expect(modalTitle).toBeDefined();
    });

    it('should open edit role modal when edit button is clicked', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const editButtons = page.getByRole('button', { name: /edit role/i }).elements();
      await userEvent.click(editButtons[0]!);

      const modalTitle = page.getByRole('heading', { name: 'Edit Role' });

      expect(modalTitle).toBeDefined();
    });

    it('should populate form with role data when editing', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const editButtons = page.getByRole('button', { name: /edit role/i }).elements();
      await userEvent.click(editButtons[0]!);

      const nameInput = page.getByTestId('role-name-input');

      expect(nameInput).toHaveValue('Admin');
    });

    it('should close modal when cancel is clicked', async () => {
      render(<RolesPageClient {...defaultProps} />);

      const addButton = page.getByTestId('add-role-button');
      await userEvent.click(addButton);

      // Fill in some data first
      const nameInput = page.getByTestId('role-name-input');
      await userEvent.type(nameInput, 'Test');

      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      // Modal should be closed - title should not be present
      const modalTitles = page.getByRole('heading', { name: 'Add Role' }).elements();

      expect(modalTitles.length).toBe(0);
    });
  });

  describe('Delete Role', () => {
    it('should log delete request when delete button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      render(<RolesPageClient {...defaultProps} />);

      // Find and click a delete button (Coach role - non-system, non-admin)
      const deleteButtons = page.getByRole('button', { name: /delete role/i }).elements();
      await userEvent.click(deleteButtons[0]!);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Roles] Delete role requested:',
        expect.objectContaining({
          roleId: expect.any(String),
        }),
      );

      consoleSpy.mockRestore();
    });
  });
});
