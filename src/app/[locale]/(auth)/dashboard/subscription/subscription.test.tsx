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

  it('renders pricing information', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const basicPrice = page.getByText(/\$29 \/ month/);
    const growthPrice = page.getByText(/\$99\/month/);

    expect(basicPrice).toBeInTheDocument();
    expect(growthPrice).toBeInTheDocument();
  });

  it('renders plan buttons', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const currentPlanButton = page.getByRole('button', { name: /Current Plan/i });
    const upgradePlanButton = page.getByRole('button', { name: /Upgrade Plan/i });
    const contactButton = page.getByRole('button', { name: /Contact Us/i });

    expect(currentPlanButton).toBeInTheDocument();
    expect(upgradePlanButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
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
    const amountHeader = page.getByText('Amount').first();
    const purposeHeader = page.getByText('Purpose').first();

    expect(dateHeader).toBeInTheDocument();
    expect(amountHeader).toBeInTheDocument();
    expect(purposeHeader).toBeInTheDocument();
  });

  it('renders billing history data', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const transactionDate = page.getByText(/April 15, 2025/).first();
    const transactionAmount = page.getByText(/\$160.00/).first();

    expect(transactionDate).toBeInTheDocument();
    expect(transactionAmount).toBeInTheDocument();
  });

  it('renders bottom action buttons', () => {
    render(<I18nWrapper><SubscriptionPage /></I18nWrapper>);

    const supportButton = page.getByRole('button', { name: /Support/i });
    const cancelButton = page.getByRole('button', { name: /Cancel Membership/i });

    expect(supportButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
});
