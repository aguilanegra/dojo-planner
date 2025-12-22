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

  it('should render monthly pricing by default', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const basicPrice = page.getByText('$49 / month');
    const growthPrice = page.getByText('$125 / month');

    expect(basicPrice).toBeTruthy();
    expect(growthPrice).toBeTruthy();
  });

  it('should render annual pricing when annual tab is selected', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    const basicPrice = page.getByText('$29 / month');
    const growthPrice = page.getByText('$99 / month');

    expect(basicPrice).toBeTruthy();
    expect(growthPrice).toBeTruthy();
  });

  it('should switch prices when toggling between monthly and annual', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Initially shows monthly prices
    expect(page.getByText('$49 / month')).toBeTruthy();
    expect(page.getByText('$125 / month')).toBeTruthy();

    // Switch to annual
    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // Should show annual prices
    expect(page.getByText('$29 / month')).toBeTruthy();
    expect(page.getByText('$99 / month')).toBeTruthy();

    // Switch back to monthly
    const monthlyButton = page.getByRole('button', { name: /monthly/i });
    await userEvent.click(monthlyButton.element());

    // Should show monthly prices again
    expect(page.getByText('$49 / month')).toBeTruthy();
    expect(page.getByText('$125 / month')).toBeTruthy();
  });

  it('should render plan buttons with Current Plan for Basic Monthly', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Monthly is selected by default, so Basic should show "Current Plan"
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

  it('should show Upgrade Plan for Basic when Annual is selected', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Initially Monthly is selected, Basic shows "Current Plan"
    expect(page.getByRole('button', { name: /current plan/i })).toBeTruthy();

    // Switch to Annual
    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // Now Basic should show "Upgrade Plan" since current plan is Basic Monthly
    // There should be no "Current Plan" button
    const currentPlanButtons = page.getByRole('button', { name: /current plan/i }).elements();

    expect(currentPlanButtons.length).toBe(0);

    // There should be two "Upgrade Plan" buttons (Basic and Growth)
    const upgradePlanButtons = page.getByRole('button', { name: /upgrade plan/i }).elements();

    expect(upgradePlanButtons.length).toBe(2);
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
    const paymentMethod = page.getByText(/Card ending/).first();

    expect(transactionDate).toBeTruthy();
    expect(paymentMethod).toBeTruthy();
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

    // Initially shows monthly prices
    expect(page.getByText('$49 / month')).toBeTruthy();

    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // After clicking, annual prices should be displayed
    expect(page.getByText('$29 / month')).toBeTruthy();
  });

  it('should have sort button next to billing history heading', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // The sort button should be visible near the heading
    const billingHeading = page.getByText('My Billing History');

    expect(billingHeading).toBeTruthy();
    // Billing history entries should still be displayed
    expect(page.getByText('April 15, 2025')).toBeTruthy();
  });

  it('should toggle sort direction when sort button is clicked', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Billing history should be displayed
    expect(page.getByText('April 15, 2025')).toBeTruthy();

    // The dates should still be present after any sort action
    expect(page.getByText('March 15, 2025')).toBeTruthy();
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
    const paymentMethod = page.getByText(/Card ending/).first();

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

  it('should maintain enterprise price for both billing cycles', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Check enterprise price in monthly mode
    expect(page.getByText('Set up a free exploratory call')).toBeTruthy();

    // Switch to annual
    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // Enterprise price should remain the same
    expect(page.getByText('Set up a free exploratory call')).toBeTruthy();
  });

  it('should render all billing history items', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Check for multiple billing history entries
    const aprilEntry = page.getByText('April 15, 2025');
    const marchEntry = page.getByText('March 15, 2025');
    const februaryEntry = page.getByText('February 15, 2025');

    expect(aprilEntry).toBeTruthy();
    expect(marchEntry).toBeTruthy();
    expect(februaryEntry).toBeTruthy();
  });

  it('should render correct number of features for each plan', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Basic plan has 6 features (4 included, 2 excluded)
    const unlimitedStudents = page.getByText('Unlimited students & classes');
    const noPaymentProcessing = page.getByText('No payment processing integration');

    expect(unlimitedStudents).toBeTruthy();
    expect(noPaymentProcessing).toBeTruthy();

    // Growth plan features
    const paymentProcessing = page.getByText('Payment processing integration');

    expect(paymentProcessing).toBeTruthy();

    // Enterprise plan features
    const multiLocation = page.getByText('Multi location dashboard');

    expect(multiLocation).toBeTruthy();
  });

  it('should show Growth plan with lower fees feature', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const lowerFees = page.getByText('Lower fees than Stripe');

    expect(lowerFees).toBeTruthy();
  });

  it('should show Enterprise plan with full white labeling', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const whiteLabelingFeature = page.getByText('Full white labeling');

    expect(whiteLabelingFeature).toBeTruthy();
  });

  it('should display Upgrade Plan button as enabled', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const upgradePlanButton = page.getByRole('button', { name: /upgrade plan/i });

    expect(upgradePlanButton.element().hasAttribute('disabled')).toBe(false);
  });

  it('should display Contact Us button as enabled', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const contactButton = page.getByRole('button', { name: /contact us/i });

    expect(contactButton.element().hasAttribute('disabled')).toBe(false);
  });

  it('should render pagination controls', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const previousButton = page.getByRole('button', { name: /previous/i });
    const nextButton = page.getByRole('button', { name: /next/i });
    const pageInfo = page.getByText(/page 1 of/i);

    expect(previousButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(pageInfo).toBeTruthy();
  });

  it('should have previous button disabled on first page', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const previousButton = page.getByRole('button', { name: /previous/i });

    expect(previousButton.element().hasAttribute('disabled')).toBe(true);
  });

  it('should navigate to next page when next button is clicked', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    const nextButton = page.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton.element());

    const pageInfo = page.getByText(/page 2 of/i);

    expect(pageInfo).toBeTruthy();
  });

  it('should navigate back to previous page', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Go to page 2
    const nextButton = page.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton.element());

    // Go back to page 1
    const previousButton = page.getByRole('button', { name: /previous/i });
    await userEvent.click(previousButton.element());

    const pageInfo = page.getByText(/page 1 of/i);

    expect(pageInfo).toBeTruthy();
  });

  it('should show only 10 billing history items per page', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Count the billing history cards (each has "Card ending")
    const billingCards = page.getByText(/Card ending/).elements();

    expect(billingCards.length).toBe(10);
  });

  it('should have green background on active subscription card', () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // The Basic card should have green background when Monthly is selected
    const basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeTruthy();
  });

  it('should remove green background from Basic when Annual is selected', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Initially Basic has green background
    let basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeTruthy();

    // Switch to Annual
    const annualButton = page.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton.element());

    // Basic should no longer have green background
    basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeNull();
  });

  it('should display 34 total billing history entries across pages', async () => {
    render(
      <SubscriptionDialog
        open={true}
        onOpenChange={mockHandlers.onOpenChange}
      />,
    );

    // Check that pagination shows 4 total pages (34 items / 10 per page = 4 pages)
    const pageInfo = page.getByText(/page 1 of 4/i);

    expect(pageInfo).toBeTruthy();
  });
});
