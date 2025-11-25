import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { I18nWrapper } from '@/lib/test-utils';
import MarketingPage from './page';

describe('Marketing Page', () => {
  it('renders marketing header', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const heading = page.getByRole('heading', { name: /Marketing/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders coupons heading', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const couponsHeading = page.getByRole('heading', { name: /Coupons/i });

    expect(couponsHeading).toBeInTheDocument();
  });

  it('renders add new coupon button', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const button = page.getByRole('button', { name: /Add New Coupon/i });

    expect(button).toBeInTheDocument();
  });

  it('renders statistics cards', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const totalCoupons = page.getByText(/Total Coupons/);
    const totalSavings = page.getByText(/Total Savings/);
    const timesUsed = page.getByText(/Times Used/);
    const activeCount = page.getByText(/^8$/);

    expect(totalCoupons).toBeInTheDocument();
    expect(totalSavings).toBeInTheDocument();
    expect(timesUsed).toBeInTheDocument();
    expect(activeCount).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const resetButton = page.getByRole('button', { name: /Reset Filters/i });

    expect(resetButton).toBeInTheDocument();
  });

  it('renders coupons table headers', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const table = page.getByRole('table');
    const codeHeader = table.getByRole('button', { name: /Code/ });
    const typeHeader = table.getByRole('button', { name: /Type/ });
    const statusHeader = table.getByRole('button', { name: /Status/ });

    expect(codeHeader).toBeInTheDocument();
    expect(typeHeader).toBeInTheDocument();
    expect(statusHeader).toBeInTheDocument();
  });

  it('renders coupon data in table', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const table = page.getByRole('table');
    const couponCode = table.getByText(/CTA_FAMILY_1/);
    const couponType = table.getByRole('cell', { name: /Percentage/ }).first();

    expect(couponCode).toBeInTheDocument();
    expect(couponType).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<I18nWrapper><MarketingPage /></I18nWrapper>);

    const paginationText = page.getByText(/Showing 1-5 of 15 entries/);
    const nextButton = page.getByRole('button', { name: /^Next$/i });

    expect(paginationText).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
