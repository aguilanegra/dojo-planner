import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import SubscriptionPage from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Subscription Page', () => {
  it('renders subscription header', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Subscription/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders billing cycle toggle buttons', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const monthlyButton = page.getByRole('button', { name: /Monthly/i });
    const annualButton = page.getByRole('button', { name: /Annual/i });

    expect(monthlyButton).toBeInTheDocument();
    expect(annualButton).toBeInTheDocument();
  });

  it('renders pricing cards', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const basicCard = page.getByText(/Basic/);
    const growthCard = page.getByText(/Growth/);
    const enterpriseCard = page.getByText(/Enterprise/);

    expect(basicCard).toBeInTheDocument();
    expect(growthCard).toBeInTheDocument();
    expect(enterpriseCard).toBeInTheDocument();
  });

  it('renders monthly pricing by default', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const basicPrice = page.getByText(/\$49 \/ month/);
    const growthPrice = page.getByText(/\$125 \/ month/);

    expect(basicPrice).toBeInTheDocument();
    expect(growthPrice).toBeInTheDocument();
  });

  it('renders annual pricing when annual tab is selected', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const annualButton = page.getByRole('button', { name: /Annual/i });
    await annualButton.click();

    const basicPrice = page.getByText(/\$29 \/ month/);
    const growthPrice = page.getByText(/\$99 \/ month/);

    expect(basicPrice).toBeInTheDocument();
    expect(growthPrice).toBeInTheDocument();
  });

  it('switches prices when toggling between monthly and annual', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Initially shows monthly prices
    expect(page.getByText(/\$49 \/ month/)).toBeInTheDocument();
    expect(page.getByText(/\$125 \/ month/)).toBeInTheDocument();

    // Switch to annual
    const annualButton = page.getByRole('button', { name: /Annual/i });
    await annualButton.click();

    // Should show annual prices
    expect(page.getByText(/\$29 \/ month/)).toBeInTheDocument();
    expect(page.getByText(/\$99 \/ month/)).toBeInTheDocument();

    // Switch back to monthly
    const monthlyButton = page.getByRole('button', { name: /Monthly/i });
    await monthlyButton.click();

    // Should show monthly prices again
    expect(page.getByText(/\$49 \/ month/)).toBeInTheDocument();
    expect(page.getByText(/\$125 \/ month/)).toBeInTheDocument();
  });

  it('renders plan buttons with Current Plan for Basic Monthly', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Monthly is selected by default, so Basic should show "Current Plan"
    const currentPlanButton = page.getByRole('button', { name: /Current Plan/i });
    const upgradePlanButton = page.getByRole('button', { name: /Upgrade Plan/i });
    const contactButton = page.getByRole('button', { name: /Contact Us/i });

    expect(currentPlanButton).toBeInTheDocument();
    expect(upgradePlanButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
  });

  it('shows Upgrade Plan for Basic when Annual is selected', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Initially Monthly is selected, Basic shows "Current Plan"
    expect(page.getByRole('button', { name: /Current Plan/i })).toBeInTheDocument();

    // Switch to Annual
    const annualButton = page.getByRole('button', { name: /Annual/i });
    await annualButton.click();

    // Now Basic should show "Upgrade Plan" since current plan is Basic Monthly
    // There should be no "Current Plan" button
    const currentPlanButtons = page.getByRole('button', { name: /Current Plan/i }).elements();

    expect(currentPlanButtons.length).toBe(0);

    // There should be two "Upgrade Plan" buttons (Basic and Growth)
    const upgradePlanButtons = page.getByRole('button', { name: /Upgrade Plan/i }).elements();

    expect(upgradePlanButtons.length).toBe(2);
  });

  it('renders features list', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const feature1 = page.getByText(/Unlimited students & classes/).first();
    const feature2 = page.getByText(/Digital attendance & student profiles/).first();

    expect(feature1).toBeInTheDocument();
    expect(feature2).toBeInTheDocument();
  });

  it('renders billing history heading', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const billingHeading = page.getByText(/My Billing History/);

    expect(billingHeading).toBeInTheDocument();
  });

  it('renders billing history table headers', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const dateHeader = page.getByText('Date').first();
    const methodHeader = page.getByText('Method').first();
    const paymentIdHeader = page.getByText('Payment ID').first();

    expect(dateHeader).toBeInTheDocument();
    expect(methodHeader).toBeInTheDocument();
    expect(paymentIdHeader).toBeInTheDocument();
  });

  it('renders billing history data', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Check for billing history entries - Card ending should be visible in table/cards
    const methodElement = page.getByText(/Card ending/).first();

    expect(methodElement).toBeInTheDocument();
  });

  it('renders bottom action buttons', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const supportButton = page.getByRole('button', { name: /Support/i });
    const cancelButton = page.getByRole('button', { name: /Cancel Membership/i });

    expect(supportButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders enterprise plan pricing', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const enterprisePrice = page.getByText(/Set up a free exploratory call/);

    expect(enterprisePrice).toBeInTheDocument();
  });

  it('renders payment method information', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Check for masked card number - test data uses masked format
    const paymentMethod = page.getByText(/Card ending/).first();

    expect(paymentMethod).toBeInTheDocument();
  });

  it('renders payment IDs in billing history', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Test data - payment IDs should be rendered in the billing history
    // When sorted alphabetically descending, September entries come first
    const paymentIds = page.getByText(/SEP/).elements();

    expect(paymentIds.length).toBeGreaterThan(0);
  });

  it('renders billing history entries on first page', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // First page shows entries - checking for the pattern used in all entries
    const entries = page.getByText(/15, 20/).elements();

    expect(entries.length).toBeGreaterThan(0);
  });

  it('maintains enterprise price for both billing cycles', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Check enterprise price in monthly mode
    expect(page.getByText(/Set up a free exploratory call/)).toBeInTheDocument();

    // Switch to annual
    const annualButton = page.getByRole('button', { name: /Annual/i });
    await annualButton.click();

    // Enterprise price should remain the same
    expect(page.getByText(/Set up a free exploratory call/)).toBeInTheDocument();
  });

  it('renders plan descriptions', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const basicDescription = page.getByText(/Just the Dojo Planner CRM without payment processing integration/);
    const growthDescription = page.getByText(/Our premier product with payment processing and CRM all in one/);

    expect(basicDescription).toBeInTheDocument();
    expect(growthDescription).toBeInTheDocument();
  });

  it('has Current Plan button disabled', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const currentPlanButton = page.getByRole('button', { name: /Current Plan/i });

    expect(currentPlanButton.element().hasAttribute('disabled')).toBe(true);
  });

  it('has Upgrade Plan button enabled', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const upgradePlanButton = page.getByRole('button', { name: /Upgrade Plan/i });

    expect(upgradePlanButton.element().hasAttribute('disabled')).toBe(false);
  });

  it('renders Growth plan features', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const paymentProcessing = page.getByText(/Payment processing integration/).first();
    const lowerFees = page.getByText(/Lower fees than Stripe/).first();

    expect(paymentProcessing).toBeInTheDocument();
    expect(lowerFees).toBeInTheDocument();
  });

  it('renders Enterprise plan features', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const multiLocation = page.getByText(/Multi location dashboard/).first();
    const whiteLabelingFeature = page.getByText(/Full white labeling/).first();

    expect(multiLocation).toBeInTheDocument();
    expect(whiteLabelingFeature).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const previousButton = page.getByRole('button', { name: /previous/i });
    const nextButton = page.getByRole('button', { name: /next/i });
    const pageInfo = page.getByText(/page 1 of/i);

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(pageInfo).toBeInTheDocument();
  });

  it('has previous button disabled on first page', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const previousButton = page.getByRole('button', { name: /previous/i });

    expect(previousButton.element().hasAttribute('disabled')).toBe(true);
  });

  it('navigates to next page when next button is clicked', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.click();

    const pageInfo = page.getByText(/page 2 of/i);

    expect(pageInfo).toBeInTheDocument();
  });

  it('navigates to previous page when previous button is clicked', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // First navigate to page 2
    const nextButton = page.getByRole('button', { name: /next/i });
    await nextButton.click();

    expect(page.getByText(/page 2 of/i)).toBeInTheDocument();

    // Now click previous to go back to page 1
    const previousButton = page.getByRole('button', { name: /previous/i });
    await previousButton.click();

    expect(page.getByText(/page 1 of/i)).toBeInTheDocument();
  });

  it('toggles sort direction when sort button is clicked', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Default is descending - newest first (April 2025)
    const firstDateBefore = page.getByText('April 15, 2025').first();

    expect(firstDateBefore).toBeInTheDocument();

    // Click the sort button in the table header
    const sortButton = page.getByRole('button', { name: /Date/i });
    await sortButton.click();

    // After clicking, it should be ascending - oldest first (July 2022)
    const oldestDate = page.getByText('July 15, 2022').first();

    expect(oldestDate).toBeInTheDocument();

    // Click again to toggle back to descending
    await sortButton.click();

    // Should show newest first again (April 2025)
    expect(page.getByText('April 15, 2025').first()).toBeInTheDocument();
  });

  it('shows only 10 billing history items per page', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Count the billing history entries - there are 10 in mobile view + 10 in desktop view = 20 total
    // Both views show 10 items per page as expected
    const billingEntries = page.getByText(/Card ending/).elements();

    // Both desktop table and mobile cards are rendered, each with 10 items
    expect(billingEntries.length).toBe(20);
  });

  it('has green background on active subscription card', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // The Basic card should have green background when Monthly is selected
    const basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeTruthy();
  });

  it('removes green background from Basic when Annual is selected', async () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Initially Basic has green background
    let basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeTruthy();

    // Switch to Annual
    const annualButton = page.getByRole('button', { name: /Annual/i });
    await annualButton.click();

    // Basic should no longer have green background
    basicCard = page.getByText('Basic').element().closest('[class*="bg-green"]');

    expect(basicCard).toBeNull();
  });

  it('displays 34 total billing history entries across pages', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    // Check that pagination shows 4 total pages (34 items / 10 per page = 4 pages)
    const pageInfo = page.getByText(/page 1 of 4/i);

    expect(pageInfo).toBeInTheDocument();
  });
});
