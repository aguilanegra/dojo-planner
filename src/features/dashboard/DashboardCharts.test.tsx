import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import DashboardCharts from './DashboardCharts';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockMemberAverageData = {
  monthly: [
    { month: 'Jan', average: 110 },
    { month: 'Feb', average: 105 },
    { month: 'Mar', average: 115 },
  ],
  yearly: [
    { year: '2022', average: 100 },
    { year: '2023', average: 115 },
    { year: '2024', average: 125 },
  ],
};

const mockEarningsData = {
  monthly: [
    { month: 'Jan', earnings: 14000 },
    { month: 'Feb', earnings: 13000 },
    { month: 'Mar', earnings: 14500 },
  ],
  yearly: [
    { year: '2022', earnings: 150000 },
    { year: '2023', earnings: 175000 },
    { year: '2024', earnings: 195000 },
  ],
};

describe('DashboardCharts', () => {
  it('renders Member average chart heading', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const memberAverageHeading = page.getByRole('heading', { name: /Member average/i });

    expect(memberAverageHeading).toBeInTheDocument();
  });

  it('renders Earnings chart heading', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const earningsHeading = page.getByRole('heading', { name: /Earnings/i });

    expect(earningsHeading).toBeInTheDocument();
  });

  it('renders time period select for Member average', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const memberAverageSelect = page.getByRole('combobox', { name: /Select time period for member average/i });

    expect(memberAverageSelect).toBeInTheDocument();
  });

  it('renders time period select for Earnings', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const earningsSelect = page.getByRole('combobox', { name: /Select time period for earnings/i });

    expect(earningsSelect).toBeInTheDocument();
  });

  it('defaults to Monthly view for Member average', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const memberAverageSelect = page.getByRole('combobox', { name: /Select time period for member average/i });

    expect(memberAverageSelect).toHaveTextContent('Monthly');
  });

  it('defaults to Monthly view for Earnings', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const earningsSelect = page.getByRole('combobox', { name: /Select time period for earnings/i });

    expect(earningsSelect).toHaveTextContent('Monthly');
  });

  it('can change Member average to Yearly view', async () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const memberAverageSelect = page.getByRole('combobox', { name: /Select time period for member average/i });
    await userEvent.click(memberAverageSelect.element());

    const yearlyOption = page.getByRole('option', { name: /Yearly/i }).first();
    await userEvent.click(yearlyOption.element());

    expect(memberAverageSelect).toHaveTextContent('Yearly');
  });

  it('can change Earnings to Yearly view', async () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const earningsSelect = page.getByRole('combobox', { name: /Select time period for earnings/i });
    await userEvent.click(earningsSelect.element());

    const yearlyOptions = page.getByRole('option', { name: /Yearly/i });
    await userEvent.click(yearlyOptions.elements()[yearlyOptions.elements().length - 1]!);

    expect(earningsSelect).toHaveTextContent('Yearly');
  });

  it('renders View details buttons', () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const viewDetailsButtons = page.getByRole('button', { name: /View details/i });

    expect(viewDetailsButtons.elements().length).toBe(2);
  });

  it('Member average and Earnings selects work independently', async () => {
    render(
      <DashboardCharts
        memberAverageData={mockMemberAverageData}
        earningsData={mockEarningsData}
      />,
    );

    const memberAverageSelect = page.getByRole('combobox', { name: /Select time period for member average/i });
    const earningsSelect = page.getByRole('combobox', { name: /Select time period for earnings/i });

    // Change Member average to Yearly
    await userEvent.click(memberAverageSelect.element());
    const memberYearlyOption = page.getByRole('option', { name: /Yearly/i }).first();
    await userEvent.click(memberYearlyOption.element());

    // Verify Member average is Yearly but Earnings is still Monthly
    expect(memberAverageSelect).toHaveTextContent('Yearly');
    expect(earningsSelect).toHaveTextContent('Monthly');
  });
});
