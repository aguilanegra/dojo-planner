import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { MembersTable } from './MembersTable';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Helper to create mock members
const createMockMember = (overrides = {}) => ({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: null,
  dateOfBirth: null,
  photoUrl: null,
  lastAccessedAt: null,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  membershipType: 'monthly' as const,
  amountDue: '0.00',
  nextPayment: new Date(),
  ...overrides,
});

describe('MembersTable', () => {
  describe('Render method', () => {
    it('should render members table with members list', () => {
      const mockMembers = [createMockMember()];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      const memberName = page.getByRole('table').getByText('John Doe');

      expect(memberName).toBeInTheDocument();
    });

    it('should render empty state when no members', () => {
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={[]}
          onRowClickAction={mockOnRowClick}
        />,
      );

      const emptyState = page.getByText('No members found').first();

      expect(emptyState).toBeInTheDocument();
    });

    it('should render loading state when loading prop is true', () => {
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={[]}
          onRowClickAction={mockOnRowClick}
          loading
        />,
      );

      const loadingText = page.getByText('Loading members...').first();

      expect(loadingText).toBeInTheDocument();
    });

    it('should render header actions when provided', () => {
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={[]}
          onRowClickAction={mockOnRowClick}
          headerActions={<button type="button">Add Member</button>}
        />,
      );

      const addButton = page.getByRole('button', { name: 'Add Member' });

      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Statistics cards', () => {
    it('should display correct member statistics', () => {
      const mockMembers = [
        createMockMember({ id: '1', status: 'active', membershipType: 'monthly' }),
        createMockMember({ id: '2', status: 'active', membershipType: 'annual' }),
        createMockMember({ id: '3', status: 'cancelled', membershipType: 'monthly' }),
        createMockMember({ id: '4', status: 'hold', membershipType: 'free-trial' }),
        createMockMember({ id: '5', status: 'active', membershipType: 'free' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Check statistics are displayed
      expect(page.getByText('Total members')).toBeInTheDocument();
      expect(page.getByText('Total cancelled')).toBeInTheDocument();
      expect(page.getByText('Paid members')).toBeInTheDocument();
      expect(page.getByText('Free members')).toBeInTheDocument();
    });
  });

  describe('Status display', () => {
    it('should display Active status with correct label', () => {
      const mockMembers = [createMockMember({ status: 'active' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Use first() since element appears in both desktop and mobile views
      expect(page.getByText('Active').first()).toBeInTheDocument();
    });

    it('should display Past Due status with correct label', () => {
      const mockMembers = [createMockMember({ status: 'past due' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Past Due').first()).toBeInTheDocument();
    });

    it('should display Trial status with correct label', () => {
      const mockMembers = [createMockMember({ status: 'trial' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Trial').first()).toBeInTheDocument();
    });

    it('should display Cancelled status with correct label', () => {
      const mockMembers = [createMockMember({ status: 'cancelled' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Cancelled').first()).toBeInTheDocument();
    });

    it('should display Hold status with correct label', () => {
      const mockMembers = [createMockMember({ status: 'hold' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Hold').first()).toBeInTheDocument();
    });
  });

  describe('Membership type display', () => {
    it('should display Free Trial for free-trial membership', () => {
      const mockMembers = [createMockMember({ membershipType: 'free-trial' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Use first() since element appears in both desktop and mobile views
      expect(page.getByText('Free Trial').first()).toBeInTheDocument();
    });

    it('should display Monthly for monthly membership', () => {
      const mockMembers = [createMockMember({ membershipType: 'monthly' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Monthly').first()).toBeInTheDocument();
    });

    it('should display Annual for annual membership', () => {
      const mockMembers = [createMockMember({ membershipType: 'annual' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      expect(page.getByText('Annual').first()).toBeInTheDocument();
    });

    it('should display dash for undefined membership type', () => {
      const mockMembers = [createMockMember({ membershipType: undefined })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // The membership type badge should show '-'
      const table = page.getByRole('table');

      expect(table.getByText('-').first()).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort members by name column', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'Zach', lastName: 'Smith' }),
        createMockMember({ id: '2', firstName: 'Alice', lastName: 'Brown' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click name header to sort (toggles from default asc to desc)
      const nameHeader = page.getByRole('button', { name: /Member name/i });
      await nameHeader.click();

      // Verify both members are present in the table
      const table = page.getByRole('table');

      expect(table.getByText('Alice Brown')).toBeInTheDocument();
      expect(table.getByText('Zach Smith')).toBeInTheDocument();
    });

    it('should have sortable status column', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', status: 'cancelled' }),
        createMockMember({ id: '2', firstName: 'Jane', status: 'active' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click status header
      const statusHeader = page.getByRole('button', { name: /Status/i });
      await statusHeader.click();

      // Verify both statuses are present
      const table = page.getByRole('table');

      expect(table.getByText('Active')).toBeInTheDocument();
      expect(table.getByText('Cancelled')).toBeInTheDocument();
    });

    it('should have sortable amount due column', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', amountDue: '100.00' }),
        createMockMember({ id: '2', firstName: 'Jane', amountDue: '50.00' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click amount due header
      const amountHeader = page.getByRole('button', { name: /Amount due/i });
      await amountHeader.click();

      // Verify both amounts are present
      const table = page.getByRole('table');

      expect(table.getByText('$50.00')).toBeInTheDocument();
      expect(table.getByText('$100.00')).toBeInTheDocument();
    });
  });

  describe('Row click', () => {
    it('should call onRowClickAction when clicking a row', async () => {
      const mockMembers = [createMockMember({ id: 'member-123' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click the row
      const row = page.getByRole('table').getByRole('row').nth(1);
      await row.click();

      expect(mockOnRowClick).toHaveBeenCalledWith('member-123');
    });
  });

  describe('Filtering', () => {
    it('should have a search input', () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', lastName: 'Doe' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      const searchInput = page.getByPlaceholder('search_placeholder');

      expect(searchInput).toBeInTheDocument();
    });

    it('should allow typing in search input', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', lastName: 'Doe' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Type in search
      const searchInput = page.getByPlaceholder('search_placeholder');
      await userEvent.fill(searchInput.element() as HTMLInputElement, 'John');

      // Verify member is still visible in table
      const table = page.getByRole('table');

      expect(table.getByText('John Doe')).toBeInTheDocument();
    });

    it('should have status filter dropdown', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', status: 'active' }),
        createMockMember({ id: '2', firstName: 'Jane', status: 'cancelled' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click the status filter dropdown
      const statusTrigger = page.getByRole('combobox').first();
      await statusTrigger.click();

      // Verify status options are shown
      expect(page.getByRole('option', { name: 'status_active' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'status_cancelled' })).toBeInTheDocument();
    });

    it('should have membership type filter dropdown', async () => {
      const mockMembers = [
        createMockMember({ id: '1', firstName: 'John', membershipType: 'monthly' }),
        createMockMember({ id: '2', firstName: 'Jane', membershipType: 'annual' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click the membership type filter dropdown (second combobox)
      const membershipTrigger = page.getByRole('combobox').nth(1);
      await membershipTrigger.click();

      // Verify membership type options are shown
      expect(page.getByRole('option', { name: 'membership_type_monthly' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'membership_type_annual' })).toBeInTheDocument();
    });
  });

  describe('Date and currency formatting', () => {
    it('should format currency correctly', () => {
      const mockMembers = [createMockMember({ amountDue: '1234.56' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Check in table specifically
      const table = page.getByRole('table');

      expect(table.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('should display dash for missing amount', () => {
      const mockMembers = [createMockMember({ amountDue: undefined })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // The amount column should show '-'
      const table = page.getByRole('table');

      expect(table.getByText('-').first()).toBeInTheDocument();
    });
  });

  describe('Avatar initials', () => {
    it('should display initials for member with names', () => {
      const mockMembers = [createMockMember({ firstName: 'John', lastName: 'Doe' })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Should show 'JD' initials
      expect(page.getByText('JD').first()).toBeInTheDocument();
    });

    it('should display question mark for missing names', () => {
      const mockMembers = [createMockMember({ firstName: null, lastName: null })];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Should show '?' for missing names
      expect(page.getByText('?').first()).toBeInTheDocument();
    });
  });

  describe('Dynamic filter options', () => {
    it('should only show available statuses in filter', async () => {
      const mockMembers = [
        createMockMember({ id: '1', status: 'active' }),
        createMockMember({ id: '2', status: 'hold' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click the status filter dropdown
      const statusTrigger = page.getByRole('combobox').first();
      await statusTrigger.click();

      // Should show 'active' and 'hold' options
      expect(page.getByRole('option', { name: 'status_active' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'status_hold' })).toBeInTheDocument();

      // Should NOT show 'cancelled' option (not in data)
      expect(page.getByRole('option', { name: 'status_cancelled' }).elements()).toHaveLength(0);
    });

    it('should only show available membership types in filter', async () => {
      const mockMembers = [
        createMockMember({ id: '1', membershipType: 'monthly' }),
        createMockMember({ id: '2', membershipType: 'annual' }),
      ];
      const mockOnRowClick = vi.fn();

      render(
        <MembersTable
          members={mockMembers}
          onRowClickAction={mockOnRowClick}
        />,
      );

      // Click the membership type filter dropdown
      const membershipTrigger = page.getByRole('combobox').nth(1);
      await membershipTrigger.click();

      // Should show 'monthly' and 'annual' options
      expect(page.getByRole('option', { name: 'membership_type_monthly' })).toBeInTheDocument();
      expect(page.getByRole('option', { name: 'membership_type_annual' })).toBeInTheDocument();

      // Should NOT show 'free-trial' option (not in data)
      expect(page.getByRole('option', { name: 'membership_type_free_trial' }).elements()).toHaveLength(0);
    });
  });
});
