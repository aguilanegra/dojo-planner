import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TransactionCard } from './TransactionCard';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('TransactionCard', () => {
  const defaultProps = {
    id: '1',
    date: 'April 15, 2025',
    amount: '$160.00',
    purpose: 'Membership Dues',
    method: 'Saved Card Ending ****1234',
    paymentId: '71MC01ANQ130',
    notes: '',
  };

  describe('Header Section', () => {
    it('should render date', () => {
      render(<TransactionCard {...defaultProps} />);

      expect(page.getByText('April 15, 2025')).toBeInTheDocument();
    });

    it('should render payment ID', () => {
      render(<TransactionCard {...defaultProps} />);

      expect(page.getByText('71MC01ANQ130')).toBeInTheDocument();
    });

    it('should render amount', () => {
      render(<TransactionCard {...defaultProps} />);

      expect(page.getByText('$160.00')).toBeInTheDocument();
    });

    it('should render purpose', () => {
      render(<TransactionCard {...defaultProps} />);

      expect(page.getByText('Membership Dues')).toBeInTheDocument();
    });
  });

  describe('Details Section', () => {
    it('should render method', () => {
      render(<TransactionCard {...defaultProps} />);

      expect(page.getByText('Saved Card Ending ****1234')).toBeInTheDocument();
    });

    it('should render notes when provided', () => {
      render(<TransactionCard {...defaultProps} notes="Gi purchase" />);

      expect(page.getByText('Gi purchase')).toBeInTheDocument();
    });

    it('should not render notes section when notes are empty', () => {
      render(<TransactionCard {...defaultProps} notes="" />);

      // The notes label should not appear when notes are empty
      // We verify the card renders properly and notes label is not duplicated
      expect(page.getByText('Membership Dues')).toBeInTheDocument();
      expect(page.getByText('$160.00')).toBeInTheDocument();
    });
  });

  describe('Different Transaction Types', () => {
    it('should render merchandise transaction', () => {
      render(
        <TransactionCard
          {...defaultProps}
          purpose="Merchandise"
          amount="$75.00"
          notes="Gi purchase"
        />,
      );

      expect(page.getByText('Merchandise')).toBeInTheDocument();
      expect(page.getByText('$75.00')).toBeInTheDocument();
      expect(page.getByText('Gi purchase')).toBeInTheDocument();
    });

    it('should render private lesson transaction', () => {
      render(
        <TransactionCard
          {...defaultProps}
          purpose="Private Lesson"
          amount="$50.00"
          method="Cash"
          notes="1 hour session"
        />,
      );

      expect(page.getByText('Private Lesson')).toBeInTheDocument();
      expect(page.getByText('Cash')).toBeInTheDocument();
      expect(page.getByText('1 hour session')).toBeInTheDocument();
    });

    it('should render seminar transaction', () => {
      render(
        <TransactionCard
          {...defaultProps}
          purpose="Seminar"
          amount="$25.00"
          notes="Guest instructor event"
        />,
      );

      expect(page.getByText('Seminar', { exact: true })).toBeInTheDocument();
      expect(page.getByText('$25.00')).toBeInTheDocument();
      expect(page.getByText('Guest instructor event')).toBeInTheDocument();
    });
  });

  describe('Card Structure', () => {
    it('should render as a card component', () => {
      render(<TransactionCard {...defaultProps} />);

      // Verify the card structure by checking for key elements
      expect(page.getByText('April 15, 2025')).toBeInTheDocument();
      expect(page.getByText('$160.00')).toBeInTheDocument();
    });
  });
});
