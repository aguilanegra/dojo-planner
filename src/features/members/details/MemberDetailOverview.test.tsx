import { describe, expect, it, vi } from 'vitest';

import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MemberDetailOverview } from './MemberDetailOverview';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('MemberDetailOverview', () => {
  const mockProps = {
    memberId: '1',
    memberName: 'Anika Smith',
    photoUrl: 'https://example.com/photo.jpg',
    billingContactRole: 'Billing Contact',
    membershipBadge: 'Monthly Member',
    amountOverdue: '$45 Overdue',
    contactInfo: {
      address: '1234 S Side Road, San Francisco CA 94125',
      phone: '(415) 223-4123',
      email: 'email@example.com',
    },
    subscriptionDetails: {
      membershipType: 'Monthly Membership',
      status: 'active' as const,
      amount: 160,
      pastDuePayments: 0,
      lastPayment: 'Last payment: Sep 1, 2025',
    },
    familyMembers: [
      {
        id: '2',
        name: 'John Smith',
        relationship: 'Family Member',
        membershipType: 'Monthly Membership',
        status: 'active' as const,
        amount: 160,
      },
      {
        id: '3',
        name: 'Emma Smith',
        relationship: 'Family Member',
        membershipType: 'Youth Membership',
        status: 'active' as const,
        amount: 80,
      },
    ],
    onEditDetails: vi.fn(),
    onAddFamilyMember: vi.fn(),
    onChangeMembership: vi.fn(),
    onHoldMembership: vi.fn(),
  };

  describe('Render method', () => {
    it('should render member header with name', () => {
      render(<MemberDetailOverview {...mockProps} />);

      expect(page.getByRole('heading', { name: 'Anika Smith' })).toBeInTheDocument();
    });

    it('should render member badges', () => {
      render(<MemberDetailOverview {...mockProps} />);

      expect(page.getByText('Billing Contact')).toBeInTheDocument();
    });

    it('should render contact information section', () => {
      render(<MemberDetailOverview {...mockProps} />);

      expect(page.getByText('contact_information')).toBeInTheDocument();
      expect(page.getByText('1234 S Side Road, San Francisco CA 94125')).toBeInTheDocument();
    });

    it('should render family members section', () => {
      render(<MemberDetailOverview {...mockProps} />);

      expect(page.getByText('John Smith')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<MemberDetailOverview {...mockProps} />);

      expect(page.getByRole('button', { name: 'edit_details_button' }).first()).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onEditDetails when edit button clicked', async () => {
      render(<MemberDetailOverview {...mockProps} />);
      const editButton = page.getByRole('button', { name: 'edit_details_button' }).first();
      await editButton.click();

      expect(mockProps.onEditDetails).toHaveBeenCalled();
    });

    it('should call onAddFamilyMember when add family clicked', async () => {
      render(<MemberDetailOverview {...mockProps} />);
      const addButton = page.getByRole('button', { name: 'add_family_member' });
      await addButton.click();

      expect(mockProps.onAddFamilyMember).toHaveBeenCalled();
    });

    it('should call onChangeMembership', async () => {
      render(<MemberDetailOverview {...mockProps} />);
      const changeButton = page.getByRole('button', { name: 'change_membership_button' }).first();
      await changeButton.click();

      expect(mockProps.onChangeMembership).toHaveBeenCalled();
    });

    it('should call onHoldMembership', async () => {
      render(<MemberDetailOverview {...mockProps} />);
      const holdButton = page.getByRole('button', { name: 'hold_button' });
      await holdButton.click();

      expect(mockProps.onHoldMembership).toHaveBeenCalled();
    });
  });

  describe('Empty states', () => {
    it('should render empty family members list with add button', () => {
      const propsWithoutFamily = {
        ...mockProps,
        familyMembers: [],
      };
      render(<MemberDetailOverview {...propsWithoutFamily} />);

      expect(page.getByRole('button', { name: 'add_family_member' })).toBeInTheDocument();
    });
  });

  describe('Avatar rendering', () => {
    it('should render avatar with initials when no photo', () => {
      const propsWithoutPhoto = {
        ...mockProps,
        photoUrl: undefined,
      };
      render(<MemberDetailOverview {...propsWithoutPhoto} />);

      expect(page.getByText('AS').first()).toBeInTheDocument();
    });
  });
});
