import { describe, expect, it, vi } from 'vitest';

import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MemberDetailFinancial } from './MemberDetailFinancial';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('MemberDetailFinancial', () => {
  const mockProps = {
    memberId: '1',
    memberName: 'Anika Smith',
    photoUrl: 'https://example.com/photo.jpg',
    billingContactRole: 'Billing Contact',
    membershipBadge: 'Monthly Member',
    amountOverdue: '$45 Overdue',
    membershipDetails: {
      status: 'active' as const,
      program: 'Caio Terra Academy Palo Alto (Adults)',
      membershipType: 'Month-to-Month',
      membershipFee: 300,
      paymentFrequency: 'Monthly',
      registrationDate: 'Sep 01, 2025',
      startDate: 'Sep 01, 2025',
      nextPaymentDate: 'Oct 01, 2025',
      nextPaymentAmount: 300,
    },
    paymentMethod: {
      last4: '0046',
      brand: 'Visa',
      isDefault: true,
    },
    agreement: {
      signedDate: 'Sep 01, 2025',
      status: 'signed' as const,
    },
    billingHistory: [
      {
        id: '1',
        date: 'Apr 15, 2025',
        member: 'Family Membership',
        amount: 480,
        purpose: 'Monthly Family Dues',
        method: 'Card ending •••• 1234',
        groupType: 'family' as const,
        children: [],
      },
    ],
    onChangeMembership: vi.fn(),
    onSendSecureLink: vi.fn(),
    onDownloadAgreement: vi.fn(),
    onRefund: vi.fn(),
  };

  describe('Render method', () => {
    it('should render member header with name', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByRole('heading', { name: 'Anika Smith' })).toBeInTheDocument();
    });

    it('should render membership details', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByRole('heading', { name: 'membership_details' })).toBeInTheDocument();
    });

    it('should render program information', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByText('Caio Terra Academy Palo Alto (Adults)')).toBeInTheDocument();
    });

    it('should render payment method section', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByRole('heading', { name: 'payment_method' })).toBeInTheDocument();
    });

    it('should render agreement section', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByText('agreement_waiver')).toBeInTheDocument();
    });

    it('should render billing history', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByText('billing_history')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByRole('button', { name: 'change_membership_button' })).toBeInTheDocument();
      expect(page.getByRole('button', { name: 'download_button' })).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onChangeMembership when change membership button is clicked', async () => {
      render(<MemberDetailFinancial {...mockProps} />);
      const changeButton = page.getByRole('button', { name: 'change_membership_button' });
      await changeButton.click();

      expect(mockProps.onChangeMembership).toHaveBeenCalled();
    });

    it('should call onDownloadAgreement when download button is clicked', async () => {
      render(<MemberDetailFinancial {...mockProps} />);
      const downloadButton = page.getByRole('button', { name: 'download_button' });
      await downloadButton.click();

      expect(mockProps.onDownloadAgreement).toHaveBeenCalled();
    });
  });

  describe('Status rendering', () => {
    it('should render active status', () => {
      render(<MemberDetailFinancial {...mockProps} />);

      expect(page.getByText('Active').first()).toBeInTheDocument();
    });

    it('should render on-hold status', () => {
      const propsWithHold = {
        ...mockProps,
        membershipDetails: {
          ...mockProps.membershipDetails,
          status: 'on-hold' as const,
        },
      };
      render(<MemberDetailFinancial {...propsWithHold} />);

      expect(page.getByText('On Hold')).toBeInTheDocument();
    });
  });
});
