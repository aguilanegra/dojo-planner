import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

describe('Dashboard Page', () => {
  it('renders dashboard header', () => {
    render(<DashboardPage />);

    const heading = page.getByRole('heading', { name: /Dashboard/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders memberships section', () => {
    render(<DashboardPage />);

    const membershipsHeading = page.getByRole('heading', { name: /Memberships/i });

    expect(membershipsHeading).toBeInTheDocument();
  });

  it('renders financial metrics', () => {
    render(<DashboardPage />);

    const financialsHeading = page.getByRole('heading', { name: /Financials/i });

    expect(financialsHeading).toBeInTheDocument();
  });

  it('displays membership types and counts', () => {
    render(<DashboardPage />);

    const allPeople = page.getByText(/All people/);

    expect(allPeople).toBeInTheDocument();
  });

  it('displays financial data in table', () => {
    render(<DashboardPage />);

    const expireCards = page.getByText(/Expiring credit cards/);

    expect(expireCards).toBeInTheDocument();
  });

  it('displays chart headings', () => {
    render(<DashboardPage />);

    const memberAverageChart = page.getByRole('heading', { name: /Member average/i });
    const earningsChart = page.getByRole('heading', { name: /Earnings/i });

    expect(memberAverageChart).toBeInTheDocument();
    expect(earningsChart).toBeInTheDocument();
  });

  it('renders utility bar with search', () => {
    render(<DashboardPage />);

    const searchInput = page.getByPlaceholder(/Search anything/i);

    expect(searchInput).toBeInTheDocument();
  });
});
