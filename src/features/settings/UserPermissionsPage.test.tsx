import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { UserPermissionsPage } from './UserPermissionsPage';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'User Permissions',
      description: 'These are users you assigned to your business.',
      total_users_label: 'Total users',
      total_admins_label: 'Total admins',
      total_coaches_label: 'Total coaches',
      my_users_title: 'My Users',
      add_user_button: 'Add User',
      filter_all: 'All',
      filter_admins: 'Admins',
      filter_coaches: 'Coaches',
      filter_others: 'Others',
      user_name_column: 'User name',
      user_title_column: 'User title',
      permissions_column: 'Permissions',
      status_column: 'Status',
      recent_activity_column: 'Recent activity',
      last_logged_in_column: 'Last logged in',
      action_column: 'Action',
      view_details_button: 'View details',
      showing_label: 'Showing {start}-{end} of {total} entries',
      permission_types_title: 'Permission Types',
    };
    return translations[key] || key;
  },
}));

describe('UserPermissionsPage', () => {
  it('should render the page title', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('User Permissions')).toBeDefined();
  });

  it('should render page description', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('These are users you assigned to your business.')).toBeDefined();
  });

  it('should render summary stat cards', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('Total users')).toBeDefined();
    expect(page.getByText('Total admins')).toBeDefined();
    expect(page.getByText('Total coaches')).toBeDefined();
  });

  it('should render my users section title', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('My Users')).toBeDefined();
  });

  it('should render add user button', () => {
    render(<UserPermissionsPage />);
    const addUserButton = page.getByRole('button', { name: /add user/i });

    expect(addUserButton).toBeDefined();
  });

  it('should render filter tabs', () => {
    render(<UserPermissionsPage />);

    expect(page.getByRole('button', { name: /all/i })).toBeDefined();
    expect(page.getByRole('button', { name: /admins/i })).toBeDefined();
    expect(page.getByRole('button', { name: /coaches/i })).toBeDefined();
  });

  it('should render users table headers', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('User name')).toBeDefined();
    expect(page.getByText('User title')).toBeDefined();
    expect(page.getByText('Permissions')).toBeDefined();
    expect(page.getByText('Status')).toBeDefined();
    expect(page.getByText('Recent activity')).toBeDefined();
    expect(page.getByText('Last logged in')).toBeDefined();
  });

  it('should render users in the table', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('Charlie Baptista')).toBeDefined();
    expect(page.getByText('Hanna Septimus')).toBeDefined();
  });

  it('should render permission types section title', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText('Permission Types')).toBeDefined();
  });

  it('should render pagination info', () => {
    render(<UserPermissionsPage />);

    expect(page.getByText(/showing/i)).toBeDefined();
  });

  it('should render view details button for users', () => {
    render(<UserPermissionsPage />);
    const viewDetailsButton = page.getByRole('button', { name: /view details/i });

    expect(viewDetailsButton).toBeDefined();
  });
});
