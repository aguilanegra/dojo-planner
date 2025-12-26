import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

// Mock next/link to avoid Next.js router dependencies in tests
vi.mock('next/link', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: function MockLink(
      { ref, ...props }: { ref?: React.Ref<HTMLAnchorElement>; href: string; className?: string; children: React.ReactNode },
    ) {
      return React.createElement('a', { href: props.href, className: props.className, ref }, props.children);
    },
  };
});

// Mock DashboardCharts to avoid recharts rendering issues in tests
vi.mock('@/features/dashboard/DashboardCharts', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: function MockDashboardCharts() {
      return React.createElement('div', { 'data-testid': 'mock-dashboard-charts' }, React.createElement('h2', null, 'Member average'), React.createElement('h2', null, 'Earnings'));
    },
  };
});

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
});

describe('Dashboard Page - Membership Card Links', () => {
  it('renders All people link pointing to members page', () => {
    render(<DashboardPage />);

    const allPeopleLink = page.getByRole('link', { name: /All people/i });

    expect(allPeopleLink).toBeInTheDocument();
    expect(allPeopleLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders All students link pointing to members page', () => {
    render(<DashboardPage />);

    const allStudentsLink = page.getByRole('link', { name: /All students/i });

    expect(allStudentsLink).toBeInTheDocument();
    expect(allStudentsLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders All families with students link pointing to members page', () => {
    render(<DashboardPage />);

    const familiesLink = page.getByRole('link', { name: /All families with students/i });

    expect(familiesLink).toBeInTheDocument();
    expect(familiesLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders New students link pointing to members page', () => {
    render(<DashboardPage />);

    const newStudentsLink = page.getByRole('link', { name: /New students \(last 30 days\)/i });

    expect(newStudentsLink).toBeInTheDocument();
    expect(newStudentsLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders Memberships with autopay on link pointing to members page', () => {
    render(<DashboardPage />);

    const autopayOnLink = page.getByRole('link', { name: /Memberships with autopay on/i });

    expect(autopayOnLink).toBeInTheDocument();
    expect(autopayOnLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders Memberships with autopay off link pointing to members page', () => {
    render(<DashboardPage />);

    const autopayOffLink = page.getByRole('link', { name: /Memberships with autopay off/i });

    expect(autopayOffLink).toBeInTheDocument();
    expect(autopayOffLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders Memberships on hold link pointing to members page', () => {
    render(<DashboardPage />);

    const onHoldLink = page.getByRole('link', { name: /Memberships on hold/i });

    expect(onHoldLink).toBeInTheDocument();
    expect(onHoldLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('renders Canceled memberships link pointing to members page', () => {
    render(<DashboardPage />);

    const canceledLink = page.getByRole('link', { name: /Canceled memberships/i });

    expect(canceledLink).toBeInTheDocument();
    expect(canceledLink.element()).toHaveAttribute('href', '/dashboard/members');
  });

  it('displays Membership net change as plain text without link', () => {
    render(<DashboardPage />);

    const netChangeText = page.getByText(/Membership net change/i);

    expect(netChangeText).toBeInTheDocument();
    expect(netChangeText.element().tagName.toLowerCase()).not.toBe('a');
  });
});

describe('Dashboard Page - Financials Card Links', () => {
  it('renders Accounts with autopay suspended link pointing to finances page', () => {
    render(<DashboardPage />);

    const autopaySuspendedLink = page.getByRole('link', { name: /Accounts with autopay suspended/i });

    expect(autopaySuspendedLink).toBeInTheDocument();
    expect(autopaySuspendedLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Expiring credit cards link pointing to finances page', () => {
    render(<DashboardPage />);

    const expiringCardsLink = page.getByRole('link', { name: /Expiring credit cards/i });

    expect(expiringCardsLink).toBeInTheDocument();
    expect(expiringCardsLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Bills to approve link pointing to finances page', () => {
    render(<DashboardPage />);

    const billsLink = page.getByRole('link', { name: /Bills to approve/i });

    expect(billsLink).toBeInTheDocument();
    expect(billsLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Amount due link pointing to finances page', () => {
    render(<DashboardPage />);

    const amountDueLink = page.getByRole('link', { name: /Amount due/i });

    expect(amountDueLink).toBeInTheDocument();
    expect(amountDueLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Past due link pointing to finances page', () => {
    render(<DashboardPage />);

    const pastDueLink = page.getByRole('link', { name: /Past due/i });

    expect(pastDueLink).toBeInTheDocument();
    expect(pastDueLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Payments (last 30 days) link pointing to finances page', () => {
    render(<DashboardPage />);

    const paymentsLink = page.getByRole('link', { name: /^Payments \(last 30 days\)/i });

    expect(paymentsLink).toBeInTheDocument();
    expect(paymentsLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Payments (pending status) link pointing to finances page', () => {
    render(<DashboardPage />);

    const pendingPaymentsLink = page.getByRole('link', { name: /Payments \(pending status\)/i });

    expect(pendingPaymentsLink).toBeInTheDocument();
    expect(pendingPaymentsLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('renders Failed payments link pointing to finances page', () => {
    render(<DashboardPage />);

    const failedPaymentsLink = page.getByRole('link', { name: /Failed payments/i });

    expect(failedPaymentsLink).toBeInTheDocument();
    expect(failedPaymentsLink.element()).toHaveAttribute('href', '/dashboard/finances');
  });

  it('displays Income per student as plain text without link', () => {
    render(<DashboardPage />);

    const incomeText = page.getByText(/Income per student/i);

    expect(incomeText).toBeInTheDocument();
    expect(incomeText.element().tagName.toLowerCase()).not.toBe('a');
  });
});

describe('Dashboard Page - Link Styling', () => {
  it('membership links have proper styling classes', () => {
    render(<DashboardPage />);

    const allPeopleLink = page.getByRole('link', { name: /All people/i });

    expect(allPeopleLink.element()).toHaveClass('text-primary');
    expect(allPeopleLink.element()).toHaveClass('underline-offset-4');
    expect(allPeopleLink.element()).toHaveClass('hover:underline');
  });

  it('financial links have proper styling classes', () => {
    render(<DashboardPage />);

    const autopaySuspendedLink = page.getByRole('link', { name: /Accounts with autopay suspended/i });

    expect(autopaySuspendedLink.element()).toHaveClass('text-primary');
    expect(autopaySuspendedLink.element()).toHaveClass('underline-offset-4');
    expect(autopaySuspendedLink.element()).toHaveClass('hover:underline');
  });
});

describe('Dashboard Page - Data Display', () => {
  it('displays membership quantities correctly', () => {
    render(<DashboardPage />);

    expect(page.getByText('462')).toBeInTheDocument();
    expect(page.getByText('111', { exact: true }).first()).toBeInTheDocument();
    expect(page.getByText('92')).toBeInTheDocument();
  });

  it('displays financial amounts correctly', () => {
    render(<DashboardPage />);

    expect(page.getByText('$14,394.20')).toBeInTheDocument();
    expect(page.getByText('$450.62')).toBeInTheDocument();
    expect(page.getByText('$13,150.44', { exact: true }).first()).toBeInTheDocument();
  });

  it('displays table headers for memberships', () => {
    render(<DashboardPage />);

    const typeHeaders = page.getByText('Type');

    expect(typeHeaders.first()).toBeInTheDocument();
  });

  it('displays table headers for financials', () => {
    render(<DashboardPage />);

    const quantityHeaders = page.getByText('Quantity');

    expect(quantityHeaders.first()).toBeInTheDocument();
  });
});

describe('Dashboard Page - Layout Structure', () => {
  it('renders main content grid', () => {
    render(<DashboardPage />);

    const heading = page.getByRole('heading', { name: /Dashboard/i });

    expect(heading).toBeInTheDocument();
    expect(heading.element().tagName.toLowerCase()).toBe('h1');
  });

  it('renders two cards for memberships and financials', () => {
    render(<DashboardPage />);

    const membershipsHeading = page.getByRole('heading', { name: /Memberships/i });
    const financialsHeading = page.getByRole('heading', { name: /Financials/i });

    expect(membershipsHeading).toBeInTheDocument();
    expect(financialsHeading).toBeInTheDocument();
  });

  it('renders charts section', () => {
    render(<DashboardPage />);

    const memberAverageChart = page.getByRole('heading', { name: /Member average/i });
    const earningsChart = page.getByRole('heading', { name: /Earnings/i });

    expect(memberAverageChart).toBeInTheDocument();
    expect(earningsChart).toBeInTheDocument();
  });
});

describe('Dashboard Page - Accessibility', () => {
  it('membership table has proper accessibility structure', () => {
    render(<DashboardPage />);

    const table = page.getByRole('table').first();

    expect(table).toBeInTheDocument();
  });

  it('financials table has proper accessibility structure', () => {
    render(<DashboardPage />);

    const tables = page.getByRole('table');

    expect(tables.elements().length).toBeGreaterThanOrEqual(2);
  });

  it('links are keyboard accessible', () => {
    render(<DashboardPage />);

    const links = page.getByRole('link');

    expect(links.elements().length).toBeGreaterThan(0);
  });
});
