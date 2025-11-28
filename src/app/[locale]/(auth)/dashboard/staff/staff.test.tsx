import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { StaffTable } from '@/features/staff/StaffTable';

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
  },
];

describe('Staff Page', () => {
  it('renders staff table', () => {
    render(<StaffTable staffMembers={mockStaffMembers} headerActions={<div>Actions</div>} />);

    const table = page.getByRole('table');

    expect(table).toBeInTheDocument();
  });

  it('displays staff member names', () => {
    render(<StaffTable staffMembers={mockStaffMembers} headerActions={<div>Actions</div>} />);

    const table = page.getByRole('table');
    const charlie = table.getByText(/Charlie Baptista/);
    const jessica = table.getByText(/Professor Jessica/);

    expect(charlie).toBeInTheDocument();
    expect(jessica).toBeInTheDocument();
  });

  it('displays staff member emails', () => {
    render(<StaffTable staffMembers={mockStaffMembers} headerActions={<div>Actions</div>} />);

    const table = page.getByRole('table');
    const email = table.getByText(/charlie@dojo.com/);

    expect(email).toBeInTheDocument();
  });

  it('displays staff status badges', () => {
    render(<StaffTable staffMembers={mockStaffMembers} headerActions={<div>Actions</div>} />);

    const table = page.getByRole('table');
    const activeStatus = table.getByText(/Active/);
    const invitationStatus = table.getByText(/Invitation sent/);

    expect(activeStatus).toBeInTheDocument();
    expect(invitationStatus).toBeInTheDocument();
  });

  it('displays action buttons for each staff member', () => {
    render(<StaffTable staffMembers={mockStaffMembers} headerActions={<div>Actions</div>} />);

    const buttons = page.getByRole('button');

    expect(buttons.length).toBeGreaterThan(0);
  });
});
