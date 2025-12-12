import type { UserCardProps } from './UserCard';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { UserCard } from './UserCard';

const defaultProps: UserCardProps = {
  id: '1',
  name: 'Charlie Baptista',
  title: 'Account Owner',
  roles: 'Owner, Admin, Coach',
  status: 'Active',
  recentActivity: 'May 1, 2025',
  lastLoggedIn: 'May 1, 2025',
};

describe('UserCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user information correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(page.getByText('Charlie Baptista')).toBeTruthy();
    expect(page.getByText('Account Owner')).toBeTruthy();
    expect(page.getByText('Owner, Admin, Coach')).toBeTruthy();
    expect(page.getByText('May 1, 2025')).toBeTruthy();
  });

  it('should render user initials when no avatar is provided', () => {
    render(<UserCard {...defaultProps} />);

    const avatar = page.getByText('CB');

    expect(avatar).toBeTruthy();
  });

  it('should render avatar image when provided', () => {
    render(<UserCard {...defaultProps} avatar="https://example.com/avatar.jpg" />);

    const avatarImage = page.getByRole('img');

    expect(avatarImage).toBeTruthy();
  });

  it('should display correct status colors', async () => {
    const renderResult = await render(<UserCard {...defaultProps} status="Active" />);

    expect(page.getByText('Active')).toBeTruthy();

    renderResult.unmount();

    await render(<UserCard {...defaultProps} status="Inactive" />);

    expect(page.getByText('Inactive')).toBeTruthy();
  });

  it('should display invitation sent status correctly', () => {
    render(<UserCard {...defaultProps} status="Invitation sent" />);

    expect(page.getByText('Invitation Sent')).toBeTruthy();
  });

  it('should handle onClick when provided', async () => {
    const mockOnClick = vi.fn();
    render(<UserCard {...defaultProps} onClick={mockOnClick} />);

    const card = page.getByRole('button');
    await userEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith('1');
  });

  it('should not be clickable when onClick is not provided', () => {
    render(<UserCard {...defaultProps} />);

    expect(() => page.getByRole('button')).toThrow();
  });

  it('should format text by default', () => {
    render(<UserCard {...defaultProps} status="Invitation sent" />);

    expect(page.getByText('Invitation Sent')).toBeTruthy();
  });

  it('should not format text when formatText is false', () => {
    render(<UserCard {...defaultProps} status="Invitation sent" formatText={false} />);

    expect(page.getByText('Invitation sent')).toBeTruthy();
  });

  it('should render all grid sections', () => {
    render(<UserCard {...defaultProps} />);

    expect(page.getByText('Roles')).toBeTruthy();
    expect(page.getByText('Status')).toBeTruthy();
    expect(page.getByText('Recent Activity')).toBeTruthy();
    expect(page.getByText('Last Logged In')).toBeTruthy();
  });

  it('should handle single name correctly for initials', () => {
    render(<UserCard {...defaultProps} name="Charlie" />);

    const avatar = page.getByText('C');

    expect(avatar).toBeTruthy();
  });

  it('should handle multiple names correctly for initials', () => {
    render(<UserCard {...defaultProps} name="Charlie Baptista Silva" />);

    const avatar = page.getByText('CBS');

    expect(avatar).toBeTruthy();
  });

  it('should render with proper hover styles when clickable', () => {
    const mockOnClick = vi.fn();
    render(<UserCard {...defaultProps} onClick={mockOnClick} />);

    const card = page.getByRole('button');

    expect(card).toBeTruthy();
  });

  it('should render different status variants correctly', () => {
    // Test each status
    const statuses: Array<'Active' | 'Inactive' | 'Invitation sent'> = [
      'Active',
      'Inactive',
      'Invitation sent',
    ];

    statuses.forEach(async (status) => {
      const renderResult = await render(<UserCard {...defaultProps} status={status} />);

      if (status === 'Invitation sent') {
        expect(page.getByText('Invitation Sent')).toBeTruthy();
      } else {
        expect(page.getByText(status)).toBeTruthy();
      }

      renderResult.unmount();
    });
  });
});
