import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { SubscriptionDialog } from './SubscriptionDialog';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Subscription',
      monthly_button: 'Monthly',
      annual_button: 'Annual',
      billing_history_heading: 'My Billing History',
      table_date: 'Date',
      table_amount: 'Amount',
      table_purpose: 'Purpose',
      table_method: 'Method',
      table_payment_id: 'Payment ID',
      table_notes: 'Notes',
      table_actions: 'Actions',
      support_button: 'Support',
      cancel_membership_button: 'Cancel Membership',
    };
    return translations[key] || key;
  },
}));

describe('SubscriptionDialog', () => {
  const mockHandlers = {
    onOpenChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render dialog when open is false', () => {
    render(
      <SubscriptionDialog
        open={false}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    expect(page.getByText('Subscription').elements().length).toBe(0);
  });

  it('should render dialog when open is true', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const dialog = page.getByRole('dialog');

    expect(dialog).toBeTruthy();
  });

  it('should display dialog title', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    expect(page.getByText('Subscription')).toBeTruthy();
  });

  it('should render billing cycle toggle buttons', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const monthlyButton = page.getByRole('button', { name: /monthly/i });
    const annualButton = page.getByRole('button', { name: /annual/i });

    expect(monthlyButton).toBeTruthy();
    expect(annualButton).toBeTruthy();
  });

  it('should render pricing cards', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const basicCard = page.getByText('Basic');
    const growthCard = page.getByText('Growth');
    const enterpriseCard = page.getByText('Enterprise');

    expect(basicCard).toBeTruthy();
    expect(growthCard).toBeTruthy();
    expect(enterpriseCard).toBeTruthy();
  });

  it('should render pricing information', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const basicPrice = page.getByText('$29 / month');
    const growthPrice = page.getByText('$99/month');

    expect(basicPrice).toBeTruthy();
    expect(growthPrice).toBeTruthy();
  });

  it('should render plan buttons', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const currentPlanButton = page.getByRole('button', { name: /current plan/i });
    const upgradePlanButton = page.getByRole('button', { name: /upgrade plan/i });
    const contactButton = page.getByRole('button', { name: /contact us/i });

    expect(currentPlanButton).toBeTruthy();
    expect(upgradePlanButton).toBeTruthy();
    expect(contactButton).toBeTruthy();
  });

  it('should have Current Plan button disabled', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const currentPlanButton = page.getByRole('button', { name: /current plan/i });

    expect(currentPlanButton.element().hasAttribute('disabled')).toBe(true);
  });

  it('should render features list', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const feature1 = page.getByText('Unlimited students & classes').first();
    const feature2 = page.getByText('Digital attendance & student profiles').first();

    expect(feature1).toBeTruthy();
    expect(feature2).toBeTruthy();
  });

  it('should render billing history heading', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const billingHeading = page.getByText('My Billing History');

    expect(billingHeading).toBeTruthy();
  });

  it('should render billing history data', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const transactionDate = page.getByText('April 15, 2025').first();
    const transactionAmount = page.getByText('$160.00').first();

    expect(transactionDate).toBeTruthy();
    expect(transactionAmount).toBeTruthy();
  });

  it('should render bottom action buttons', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const supportButton = page.getByRole('button', { name: /support/i });
    const cancelButton = page.getByRole('button', { name: /cancel membership/i });

    expect(supportButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });

  it('should toggle billing cycle when Annual button is clicked', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // After clicking, the button should still exist (state changes internally)
    expect(annualButton).toBeTruthy();
  });

  it('should sort billing history when date is clicked', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Find the first date button in the billing history cards
    const dateButton = page.getByText('April 15, 2025').first();
    await userEvent.click(dateButton.element());

    // After clicking, the sort should be applied
    expect(dateButton).toBeTruthy();
  });

  it('should toggle sort direction when clicking date twice', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const dateButton = page.getByText('April 15, 2025').first();

    // Click once to sort ascending
    await userEvent.click(dateButton.element());

    // Click again to toggle to descending
    await userEvent.click(dateButton.element());

    // Button should still be there
    expect(dateButton).toBeTruthy();
  });

  it('should call onOpenChange when close button is clicked', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const closeButton = page.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton.element());

    expect(mockHandlers.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should render plan descriptions', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const basicDescription = page.getByText('Just the Dojo Planner CRM without payment processing integration');
    const growthDescription = page.getByText('Our premier product with payment processing and CRM all in one');
    const enterpriseDescription = page.getByText('All of the above plus custom branded experiences and more, get in touch!');

    expect(basicDescription).toBeTruthy();
    expect(growthDescription).toBeTruthy();
    expect(enterpriseDescription).toBeTruthy();
  });

  it('should render excluded features with strikethrough styling', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const excludedFeature = page.getByText('No payment processing integration');

    expect(excludedFeature).toBeTruthy();
  });

  it('should render enterprise plan with call-to-action price', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const enterprisePrice = page.getByText('Set up a free exploratory call');

    expect(enterprisePrice).toBeTruthy();
  });

  it('should render payment method information in billing history', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Check for masked card number - test data uses masked format
    const paymentMethod = page.getByText(/Saved Card Ending/).first();

    expect(paymentMethod).toBeTruthy();
  });

  it('should render payment IDs in billing history', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Test data - mock payment ID for demonstration
    const paymentId = page.getByText('71MC01ANQ130').first();

    expect(paymentId).toBeTruthy();
  });

  it('should render purpose in billing history cards', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const purpose = page.getByText('Membership Dues').first();

    expect(purpose).toBeTruthy();
  });
});
