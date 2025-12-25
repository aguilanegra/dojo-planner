import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { StaffTable } from '@/features/staff/StaffTable';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockStaffMembers = [
  {
    id: 'user_1',
    firstName: 'Charlie',
    lastName: 'Baptista',
    email: 'charlie@dojo.com',
    photoUrl: null,
    emailAddress: 'charlie@dojo.com',
    role: 'org:admin',
    status: 'Active' as const,
    phone: null,
  },
  {
    id: 'user_2',
    firstName: 'Professor',
    lastName: 'Jessica',
    email: 'jessica@dojo.com',
    photoUrl: null,
    emailAddress: 'jessica@dojo.com',
    role: 'org:admin',
    status: 'Invitation sent' as const,
    phone: null,
  },
];

describe('Staff Page', () => {
  const mockOnEditStaff = vi.fn();
  const mockOnRemoveStaff = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders staff table', async () => {
    render(
      <StaffTable
        staffMembers={mockStaffMembers}
        onEditStaff={mockOnEditStaff}
        onRemoveStaff={mockOnRemoveStaff}
        headerActions={<div>Actions</div>}
      />,
    );

    const table = page.getByRole('table');

    await expect.element(table).toBeVisible();
  });

  it('displays staff member names', async () => {
    render(
      <StaffTable
        staffMembers={mockStaffMembers}
        onEditStaff={mockOnEditStaff}
        onRemoveStaff={mockOnRemoveStaff}
        headerActions={<div>Actions</div>}
      />,
    );

    // Use table to scope to desktop view only
    const table = page.getByRole('table');

    await expect.element(table.getByText('Charlie Baptista')).toBeVisible();
    await expect.element(table.getByText('Professor Jessica')).toBeVisible();
  });

  it('displays staff member emails', async () => {
    render(
      <StaffTable
        staffMembers={mockStaffMembers}
        onEditStaff={mockOnEditStaff}
        onRemoveStaff={mockOnRemoveStaff}
        headerActions={<div>Actions</div>}
      />,
    );

    // Use table to scope to desktop view only
    const table = page.getByRole('table');

    await expect.element(table.getByText('charlie@dojo.com')).toBeVisible();
  });

  it('displays staff status badges', async () => {
    render(
      <StaffTable
        staffMembers={mockStaffMembers}
        onEditStaff={mockOnEditStaff}
        onRemoveStaff={mockOnRemoveStaff}
        headerActions={<div>Actions</div>}
      />,
    );

    // Use first() since there are desktop and mobile views
    await expect.element(page.getByText('Active').first()).toBeVisible();
    await expect.element(page.getByText('Invitation sent').first()).toBeVisible();
  });

  it('displays action buttons for each staff member', async () => {
    render(
      <StaffTable
        staffMembers={mockStaffMembers}
        onEditStaff={mockOnEditStaff}
        onRemoveStaff={mockOnRemoveStaff}
        headerActions={<div>Actions</div>}
      />,
    );

    // Use first() to get only the desktop view button
    const editCharlieButton = page.getByRole('button', { name: /Edit Charlie Baptista/i }).first();

    await expect.element(editCharlieButton).toBeVisible();

    const removeCharlieButton = page.getByRole('button', { name: /Remove Charlie Baptista/i }).first();

    await expect.element(removeCharlieButton).toBeVisible();
  });
});
