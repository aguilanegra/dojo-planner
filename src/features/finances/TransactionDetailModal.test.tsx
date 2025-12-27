import type { Transaction, TransactionStatus } from './FinancesTable';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TransactionDetailModal } from './TransactionDetailModal';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Helper to create mock transactions
const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: '1',
  date: 'April 15, 2025',
  amount: '$160.00',
  purpose: 'Membership Dues',
  method: 'Saved Card Ending ****1234',
  transactionId: 'TXN71MC01ANQ130',
  memberName: 'John Smith',
  memberId: 'M001',
  status: 'paid' as TransactionStatus,
  ...overrides,
});

describe('TransactionDetailModal', () => {
  describe('Rendering', () => {
    it('should render dialog when isOpen is true', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render dialog when isOpen is false', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={false}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByRole('dialog').elements()).toHaveLength(0);
    });

    it('should not render anything when transaction is null', () => {
      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={null}
        />,
      );

      expect(page.getByRole('dialog').elements()).toHaveLength(0);
    });

    it('should display transaction dialog', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Transaction Summary', () => {
    it('should display member name', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('John Smith').first()).toBeInTheDocument();
    });

    it('should display transaction ID', () => {
      const mockTransaction = createMockTransaction({ transactionId: 'TXN123456' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('TXN123456')).toBeInTheDocument();
    });

    it('should display amount', () => {
      const mockTransaction = createMockTransaction({ amount: '$250.00' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('$250.00')).toBeInTheDocument();
    });

    it('should display date', () => {
      const mockTransaction = createMockTransaction({ date: 'May 20, 2025' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('May 20, 2025')).toBeInTheDocument();
    });

    it('should display method', () => {
      const mockTransaction = createMockTransaction({ method: 'ACH Transfer' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('ACH Transfer')).toBeInTheDocument();
    });

    it('should display purpose', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('Merchandise')).toBeInTheDocument();
    });
  });

  describe('Status Badge', () => {
    it('should display paid status badge', () => {
      const mockTransaction = createMockTransaction({ status: 'paid' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('status_paid')).toBeInTheDocument();
    });

    it('should display pending status badge', () => {
      const mockTransaction = createMockTransaction({ status: 'pending' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('status_pending')).toBeInTheDocument();
    });

    it('should display declined status badge', () => {
      const mockTransaction = createMockTransaction({ status: 'declined' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('status_declined')).toBeInTheDocument();
    });

    it('should display refunded status badge', () => {
      const mockTransaction = createMockTransaction({ status: 'refunded' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('status_refunded')).toBeInTheDocument();
    });

    it('should display processing status badge', () => {
      const mockTransaction = createMockTransaction({ status: 'processing' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('status_processing')).toBeInTheDocument();
    });
  });

  describe('Transaction Types', () => {
    it('should display membership details for Membership Dues transactions', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M002',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('membership_details_title')).toBeInTheDocument();
      expect(page.getByText('type_membership')).toBeInTheDocument();
    });

    it('should display family membership details for family accounts', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M001',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('family_membership_title')).toBeInTheDocument();
      expect(page.getByText('family_members_label')).toBeInTheDocument();
      expect(page.getByText('type_family_membership')).toBeInTheDocument();
    });

    it('should display product details for Merchandise transactions', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('product_details_title')).toBeInTheDocument();
      expect(page.getByText('subtotal_label', { exact: true })).toBeInTheDocument();
      expect(page.getByText('tax_label')).toBeInTheDocument();
      expect(page.getByText('total_label', { exact: true })).toBeInTheDocument();
      expect(page.getByText('type_product')).toBeInTheDocument();
    });

    it('should display seminar details for Seminar transactions', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Seminar' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('seminar_details_title')).toBeInTheDocument();
      expect(page.getByText('seminar_name_label')).toBeInTheDocument();
      expect(page.getByText('instructor_label')).toBeInTheDocument();
      expect(page.getByText('type_seminar')).toBeInTheDocument();
    });

    it('should display product details for Private Lesson transactions', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Private Lesson' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('product_details_title')).toBeInTheDocument();
      expect(page.getByText('type_product')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should display close button', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByRole('button', { name: 'close_button' })).toBeInTheDocument();
    });

    it('should call onCloseAction when close button is clicked', async () => {
      const mockTransaction = createMockTransaction();
      const mockOnClose = vi.fn();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={mockOnClose}
          transaction={mockTransaction}
        />,
      );

      const closeButton = page.getByRole('button', { name: 'close_button' });
      await closeButton.click();

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dialog Labels', () => {
    it('should display date label', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('date_label')).toBeInTheDocument();
    });

    it('should display method label', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('method_label')).toBeInTheDocument();
    });

    it('should display purpose label', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('purpose_label')).toBeInTheDocument();
    });

    it('should display type label', () => {
      const mockTransaction = createMockTransaction();

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('type_label')).toBeInTheDocument();
    });
  });

  describe('Family Member Details', () => {
    it('should display individual family member information', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M001',
        memberName: 'John Smith',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('John Smith').first()).toBeInTheDocument();
      expect(page.getByText('Alex Smith')).toBeInTheDocument();
      expect(page.getByText('Emma Smith')).toBeInTheDocument();
    });

    it('should display program for each family member', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M001',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('(Adult BJJ)')).toBeInTheDocument();
      expect(page.getByText('(Kids BJJ)').first()).toBeInTheDocument();
    });

    it('should display due amounts for family members', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M001',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('$80.00')).toBeInTheDocument();
      expect(page.getByText('$40.00').first()).toBeInTheDocument();
    });
  });

  describe('Membership Plan Details', () => {
    it('should display plan name for membership transactions', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M002',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('Individual Monthly Membership')).toBeInTheDocument();
    });

    it('should display frequency for membership transactions', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M002',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('frequency_label')).toBeInTheDocument();
    });

    it('should display plan name label', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M002',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('plan_name_label')).toBeInTheDocument();
    });

    it('should display frequency label', () => {
      const mockTransaction = createMockTransaction({
        purpose: 'Membership Dues',
        memberId: 'M002',
      });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('frequency_label')).toBeInTheDocument();
    });
  });

  describe('Product Purchase Details', () => {
    it('should display product items for merchandise transactions', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('BJJ Gi - White')).toBeInTheDocument();
      expect(page.getByText('Rashguard - Black')).toBeInTheDocument();
    });

    it('should display quantity for product items', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('x1').first()).toBeInTheDocument();
    });

    it('should display subtotal for product purchases', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('$100.00')).toBeInTheDocument();
    });

    it('should display tax for product purchases', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Merchandise' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('$8.00')).toBeInTheDocument();
    });
  });

  describe('Seminar Details', () => {
    it('should display seminar name', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Seminar' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('Advanced Guard Passing Seminar')).toBeInTheDocument();
    });

    it('should display instructor name', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Seminar' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('Professor Garcia')).toBeInTheDocument();
    });

    it('should display seminar location', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Seminar' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('Main Academy')).toBeInTheDocument();
    });

    it('should display location label', () => {
      const mockTransaction = createMockTransaction({ purpose: 'Seminar' });

      render(
        <TransactionDetailModal
          isOpen={true}
          onCloseAction={() => {}}
          transaction={mockTransaction}
        />,
      );

      expect(page.getByText('location_label')).toBeInTheDocument();
    });
  });
});
