'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimePeriod = 'monthly' | 'yearly';
type ChartType = 'bar' | 'line' | 'area';

// Chart type mapping for each report - using blue-themed colors for dark/light mode visibility
const reportChartTypes: Record<ReportType, { type: ChartType; color: string }> = {
  'accounts-autopay-suspended': { type: 'area', color: 'hsl(210, 100%, 50%)' }, // Bright blue
  'expiring-credit-cards': { type: 'bar', color: 'hsl(200, 90%, 45%)' }, // Cyan-blue
  'amount-due': { type: 'line', color: 'hsl(220, 85%, 55%)' }, // Royal blue
  'past-due': { type: 'area', color: 'hsl(230, 80%, 60%)' }, // Indigo-blue
  'payments-last-30-days': { type: 'bar', color: 'hsl(205, 95%, 50%)' }, // Sky blue
  'payments-pending': { type: 'area', color: 'hsl(195, 85%, 45%)' }, // Teal-blue
  'failed-payments': { type: 'area', color: 'hsl(240, 70%, 55%)' }, // Purple-blue
  'income-per-student': { type: 'line', color: 'hsl(215, 90%, 55%)' }, // Dodger blue
};

export type ReportType
  = 'accounts-autopay-suspended'
    | 'expiring-credit-cards'
    | 'amount-due'
    | 'past-due'
    | 'payments-last-30-days'
    | 'payments-pending'
    | 'failed-payments'
    | 'income-per-student';

type ReportDefinition = {
  id: ReportType;
  currentValue: string | number;
};

// Helper function to get translated title - uses explicit keys for i18n detection
function useReportTitle(reportId: ReportType): string {
  const t = useTranslations('ReportsPage');
  switch (reportId) {
    case 'accounts-autopay-suspended':
      return t('report_accounts_autopay_suspended');
    case 'expiring-credit-cards':
      return t('report_expiring_credit_cards');
    case 'amount-due':
      return t('report_amount_due');
    case 'past-due':
      return t('report_past_due');
    case 'payments-last-30-days':
      return t('report_payments_last_30_days');
    case 'payments-pending':
      return t('report_payments_pending');
    case 'failed-payments':
      return t('report_failed_payments');
    case 'income-per-student':
      return t('report_income_per_student');
  }
}

// Helper function to get translated description - uses explicit keys for i18n detection
function useReportDescription(reportId: ReportType): string {
  const t = useTranslations('ReportsPage');
  switch (reportId) {
    case 'accounts-autopay-suspended':
      return t('report_accounts_autopay_suspended_description');
    case 'expiring-credit-cards':
      return t('report_expiring_credit_cards_description');
    case 'amount-due':
      return t('report_amount_due_description');
    case 'past-due':
      return t('report_past_due_description');
    case 'payments-last-30-days':
      return t('report_payments_last_30_days_description');
    case 'payments-pending':
      return t('report_payments_pending_description');
    case 'failed-payments':
      return t('report_failed_payments_description');
    case 'income-per-student':
      return t('report_income_per_student_description');
  }
}

// Type for monthly data with optional previous year comparison
type MonthlyDataPoint = {
  month: string;
  value: number;
  previousYear?: number;
};

type YearlyDataPoint = {
  year: string;
  value: number;
};

// Mock historical data for each report type (test-data, not real)
// Monthly data includes both current year and previous year values for comparison
const mockReportData: Record<ReportType, { monthly: MonthlyDataPoint[]; yearly: YearlyDataPoint[] }> = {
  'accounts-autopay-suspended': {
    monthly: [
      { month: 'Jan', value: 3, previousYear: 4 },
      { month: 'Feb', value: 2, previousYear: 3 },
      { month: 'Mar', value: 4, previousYear: 2 },
      { month: 'Apr', value: 2, previousYear: 3 },
      { month: 'May', value: 1, previousYear: 2 },
      { month: 'Jun', value: 3, previousYear: 4 },
      { month: 'Jul', value: 2, previousYear: 3 },
      { month: 'Aug', value: 1, previousYear: 2 },
      { month: 'Sep', value: 2, previousYear: 1 },
      { month: 'Oct', value: 3, previousYear: 2 },
      { month: 'Nov', value: 2, previousYear: 3 },
      { month: 'Dec', value: 2, previousYear: 2 },
    ],
    yearly: [
      { year: '2020', value: 15 },
      { year: '2021', value: 22 },
      { year: '2022', value: 18 },
      { year: '2023', value: 12 },
      { year: '2024', value: 25 },
    ],
  },
  'expiring-credit-cards': {
    monthly: [
      { month: 'Jan', value: 8, previousYear: 6 },
      { month: 'Feb', value: 6, previousYear: 5 },
      { month: 'Mar', value: 10, previousYear: 8 },
      { month: 'Apr', value: 5, previousYear: 4 },
      { month: 'May', value: 7, previousYear: 6 },
      { month: 'Jun', value: 9, previousYear: 7 },
      { month: 'Jul', value: 4, previousYear: 5 },
      { month: 'Aug', value: 6, previousYear: 5 },
      { month: 'Sep', value: 8, previousYear: 7 },
      { month: 'Oct', value: 5, previousYear: 6 },
      { month: 'Nov', value: 7, previousYear: 5 },
      { month: 'Dec', value: 5, previousYear: 4 },
    ],
    yearly: [
      { year: '2020', value: 45 },
      { year: '2021', value: 62 },
      { year: '2022', value: 58 },
      { year: '2023', value: 72 },
      { year: '2024', value: 80 },
    ],
  },
  'amount-due': {
    monthly: [
      { month: 'Jan', value: 12500, previousYear: 11200 },
      { month: 'Feb', value: 13200, previousYear: 12100 },
      { month: 'Mar', value: 14100, previousYear: 12800 },
      { month: 'Apr', value: 14394, previousYear: 13100 },
      { month: 'May', value: 13800, previousYear: 12600 },
      { month: 'Jun', value: 15200, previousYear: 13900 },
      { month: 'Jul', value: 14800, previousYear: 13500 },
      { month: 'Aug', value: 15500, previousYear: 14200 },
      { month: 'Sep', value: 16200, previousYear: 14800 },
      { month: 'Oct', value: 15800, previousYear: 14500 },
      { month: 'Nov', value: 14900, previousYear: 13700 },
      { month: 'Dec', value: 13500, previousYear: 12400 },
    ],
    yearly: [
      { year: '2020', value: 145000 },
      { year: '2021', value: 162000 },
      { year: '2022', value: 178000 },
      { year: '2023', value: 185000 },
      { year: '2024', value: 173892 },
    ],
  },
  'past-due': {
    monthly: [
      { month: 'Jan', value: 380, previousYear: 420 },
      { month: 'Feb', value: 420, previousYear: 450 },
      { month: 'Mar', value: 350, previousYear: 380 },
      { month: 'Apr', value: 451, previousYear: 490 },
      { month: 'May', value: 520, previousYear: 550 },
      { month: 'Jun', value: 480, previousYear: 510 },
      { month: 'Jul', value: 390, previousYear: 420 },
      { month: 'Aug', value: 410, previousYear: 440 },
      { month: 'Sep', value: 445, previousYear: 470 },
      { month: 'Oct', value: 380, previousYear: 410 },
      { month: 'Nov', value: 420, previousYear: 450 },
      { month: 'Dec', value: 350, previousYear: 380 },
    ],
    yearly: [
      { year: '2020', value: 4200 },
      { year: '2021', value: 4800 },
      { year: '2022', value: 5100 },
      { year: '2023', value: 4600 },
      { year: '2024', value: 4996 },
    ],
  },
  'payments-last-30-days': {
    monthly: [
      { month: 'Jan', value: 11800, previousYear: 10500 },
      { month: 'Feb', value: 12400, previousYear: 11200 },
      { month: 'Mar', value: 13150, previousYear: 11900 },
      { month: 'Apr', value: 13150, previousYear: 12100 },
      { month: 'May', value: 12900, previousYear: 11800 },
      { month: 'Jun', value: 14200, previousYear: 12900 },
      { month: 'Jul', value: 13800, previousYear: 12500 },
      { month: 'Aug', value: 14500, previousYear: 13200 },
      { month: 'Sep', value: 15100, previousYear: 13800 },
      { month: 'Oct', value: 14700, previousYear: 13400 },
      { month: 'Nov', value: 13900, previousYear: 12700 },
      { month: 'Dec', value: 12600, previousYear: 11500 },
    ],
    yearly: [
      { year: '2020', value: 135000 },
      { year: '2021', value: 152000 },
      { year: '2022', value: 168000 },
      { year: '2023', value: 175000 },
      { year: '2024', value: 162300 },
    ],
  },
  'payments-pending': {
    monthly: [
      { month: 'Jan', value: 250, previousYear: 280 },
      { month: 'Feb', value: 180, previousYear: 220 },
      { month: 'Mar', value: 320, previousYear: 350 },
      { month: 'Apr', value: 0, previousYear: 50 },
      { month: 'May', value: 150, previousYear: 180 },
      { month: 'Jun', value: 280, previousYear: 300 },
      { month: 'Jul', value: 120, previousYear: 150 },
      { month: 'Aug', value: 200, previousYear: 230 },
      { month: 'Sep', value: 350, previousYear: 380 },
      { month: 'Oct', value: 180, previousYear: 210 },
      { month: 'Nov', value: 220, previousYear: 250 },
      { month: 'Dec', value: 100, previousYear: 130 },
    ],
    yearly: [
      { year: '2020', value: 2800 },
      { year: '2021', value: 3200 },
      { year: '2022', value: 2950 },
      { year: '2023', value: 2600 },
      { year: '2024', value: 2350 },
    ],
  },
  'failed-payments': {
    monthly: [
      { month: 'Jan', value: 1200, previousYear: 1400 },
      { month: 'Feb', value: 980, previousYear: 1150 },
      { month: 'Mar', value: 1500, previousYear: 1700 },
      { month: 'Apr', value: 1835, previousYear: 2100 },
      { month: 'May', value: 1100, previousYear: 1300 },
      { month: 'Jun', value: 1400, previousYear: 1600 },
      { month: 'Jul', value: 900, previousYear: 1100 },
      { month: 'Aug', value: 1250, previousYear: 1450 },
      { month: 'Sep', value: 1600, previousYear: 1800 },
      { month: 'Oct', value: 1350, previousYear: 1550 },
      { month: 'Nov', value: 1150, previousYear: 1350 },
      { month: 'Dec', value: 800, previousYear: 1000 },
    ],
    yearly: [
      { year: '2020', value: 12500 },
      { year: '2021', value: 14200 },
      { year: '2022', value: 15800 },
      { year: '2023', value: 13600 },
      { year: '2024', value: 15065 },
    ],
  },
  'income-per-student': {
    monthly: [
      { month: 'Jan', value: 105, previousYear: 98 },
      { month: 'Feb', value: 112, previousYear: 104 },
      { month: 'Mar', value: 118, previousYear: 110 },
      { month: 'Apr', value: 118, previousYear: 109 },
      { month: 'May', value: 115, previousYear: 107 },
      { month: 'Jun', value: 125, previousYear: 116 },
      { month: 'Jul', value: 122, previousYear: 113 },
      { month: 'Aug', value: 128, previousYear: 119 },
      { month: 'Sep', value: 132, previousYear: 122 },
      { month: 'Oct', value: 129, previousYear: 120 },
      { month: 'Nov', value: 123, previousYear: 114 },
      { month: 'Dec', value: 114, previousYear: 106 },
    ],
    yearly: [
      { year: '2020', value: 1080 },
      { year: '2021', value: 1220 },
      { year: '2022', value: 1350 },
      { year: '2023', value: 1420 },
      { year: '2024', value: 1441 },
    ],
  },
};

// Mock insights for each report type (test-data, not real)
const mockInsights: Record<ReportType, string[]> = {
  'accounts-autopay-suspended': [
    'Current suspended accounts represent 1.8% of total active memberships',
    'Most suspensions occur due to expired payment methods',
    'Average time to resolve suspension is 5 business days',
    'Sending reminder emails 7 days before expiration reduces suspensions by 35%',
  ],
  'expiring-credit-cards': [
    '5 cards are expiring in the next 60 days',
    'Proactive outreach to members with expiring cards has 78% update rate',
    'Members with updated payment methods have 12% higher retention',
    'Consider implementing card updater service to reduce manual updates',
  ],
  'amount-due': [
    '$14,394.20 expected in the next 30 days',
    'This represents a 3.2% increase from previous month',
    '92% of expected payments historically collected on time',
    'Early payment reminders increase on-time collection by 15%',
  ],
  'past-due': [
    'Total past due amount is $450.62 across 4 members',
    'Average days past due is 18 days',
    'Personalized payment plans recover 65% of past due amounts',
    'Members past due more than 60 days have 40% cancellation rate',
  ],
  'payments-last-30-days': [
    '$13,150.44 collected in the last 30 days',
    'This is 98.2% of expected collections',
    'Card payments account for 82% of total collections',
    'Average transaction value is $145.67',
  ],
  'payments-pending': [
    'No payments are currently pending processing',
    'Average pending duration is 1.2 business days',
    'ACH transfers typically clear within 3-5 business days',
    'Consider faster payment processing for improved cash flow',
  ],
  'failed-payments': [
    '$1,834.67 in failed payments over the last 30 days',
    'Insufficient funds accounts for 62% of failures',
    'Automatic retry within 3 days recovers 45% of failed payments',
    'Members with 2+ failures have 3x higher churn risk',
  ],
  'income-per-student': [
    'Average income per student is $118.47 over 30 days',
    'This is 2.5% higher than the same period last year',
    'Top tier members generate 3.2x average income',
    'Private lessons add an average of $35 per participating student',
  ],
};

const reportDefinitions: ReportDefinition[] = [
  { id: 'accounts-autopay-suspended', currentValue: 2 },
  { id: 'expiring-credit-cards', currentValue: 5 },
  { id: 'amount-due', currentValue: '$14,394.20' },
  { id: 'past-due', currentValue: '$450.62' },
  { id: 'payments-last-30-days', currentValue: '$13,150.44' },
  { id: 'payments-pending', currentValue: '$0.00' },
  { id: 'failed-payments', currentValue: '$1,834.67' },
  { id: 'income-per-student', currentValue: '$118.47' },
];

function ReportCard({ report, onClick }: { report: ReportDefinition; onClick: () => void }) {
  const title = useReportTitle(report.id);
  const description = useReportDescription(report.id);

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
      onClick={onClick}
      data-testid={`report-card-${report.id}`}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{report.currentValue}</div>
      </CardContent>
    </Card>
  );
}

// Shared tooltip style configuration - solid dark background for legibility
const tooltipStyle = {
  backgroundColor: 'hsl(222.2 84% 4.9%)',
  border: '1px solid hsl(217.2 32.6% 17.5%)',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  padding: '8px 12px',
  color: 'hsl(210 40% 98%)',
};

// Label style for tooltip - makes the header text more prominent
const tooltipLabelStyle = {
  color: 'hsl(210 40% 98%)',
  fontWeight: 600,
  marginBottom: '4px',
};

// Item style for tooltip - ensures items are readable
const tooltipItemStyle = {
  color: 'hsl(210 40% 98%)',
};

// Previous year color - a muted gray-blue for contrast
const previousYearColor = 'hsl(210, 20%, 60%)';

// Render the appropriate chart type based on report configuration
function renderChart(
  reportId: ReportType,
  chartData: Array<{ month?: string; year?: string; value: number; previousYear?: number }>,
  xKey: string,
  formatValue: (value: number) => string,
  showComparison: boolean = false,
) {
  const chartConfig = reportChartTypes[reportId] || { type: 'bar', color: 'hsl(var(--primary))' };
  const { type, color } = chartConfig;

  const commonProps = {
    data: chartData,
    margin: { left: -10, right: 10, top: 10, bottom: 0 },
  };

  const xAxisProps = {
    dataKey: xKey,
    axisLine: false,
    tickLine: false,
    tick: { fill: 'currentColor', className: 'fill-muted-foreground', fontSize: 12 },
  };

  const yAxisProps = {
    axisLine: false,
    tickLine: false,
    width: 60,
    tickFormatter: formatValue,
    tick: { fill: 'currentColor', className: 'fill-muted-foreground', fontSize: 12 },
  };

  const tooltipFormatter = (value: number | string | Array<number | string> | undefined, name?: string) => {
    if (value === undefined) {
      return ['N/A', name ?? 'Value'] as [string, string];
    }
    const numValue = typeof value === 'number' ? value : Number(value);
    const label = name === 'previousYear' ? 'Last Year' : 'This Year';
    return [formatValue(numValue), label] as [string, string];
  };

  // Check if previous year data exists in the dataset
  const hasPreviousYearData = showComparison && chartData.some(d => d.previousYear !== undefined);

  switch (type) {
    case 'line':
      return (
        <LineChart {...commonProps}>
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={tooltipFormatter} />
          {hasPreviousYearData && (
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={value => (value === 'previousYear' ? 'Last Year' : 'This Year')}
            />
          )}
          {hasPreviousYearData && (
            <Line
              type="monotone"
              dataKey="previousYear"
              name="previousYear"
              stroke={previousYearColor}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: previousYearColor, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: previousYearColor }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            name="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      );
    case 'area':
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id={`gradient-${reportId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`gradient-${reportId}-prev`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={previousYearColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={previousYearColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={tooltipFormatter} />
          {hasPreviousYearData && (
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={value => (value === 'previousYear' ? 'Last Year' : 'This Year')}
            />
          )}
          {hasPreviousYearData && (
            <Area
              type="monotone"
              dataKey="previousYear"
              name="previousYear"
              stroke={previousYearColor}
              strokeWidth={2}
              strokeDasharray="5 5"
              fill={`url(#gradient-${reportId}-prev)`}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            name="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${reportId})`}
          />
        </AreaChart>
      );
    case 'bar':
    default:
      return (
        <BarChart {...commonProps}>
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={tooltipFormatter} />
          {hasPreviousYearData && (
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={value => (value === 'previousYear' ? 'Last Year' : 'This Year')}
            />
          )}
          {hasPreviousYearData && (
            <Bar dataKey="previousYear" name="previousYear" fill={previousYearColor} radius={[4, 4, 0, 0]} maxBarSize={35} />
          )}
          <Bar dataKey="value" name="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={35} />
        </BarChart>
      );
  }
}

function ReportDetail({ reportId, onBack }: { reportId: ReportType; onBack: () => void }) {
  const t = useTranslations('ReportsPage');
  const title = useReportTitle(reportId);
  const description = useReportDescription(reportId);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const report = useMemo(
    () => reportDefinitions.find(r => r.id === reportId),
    [reportId],
  );

  const chartData = useMemo(() => {
    const data = mockReportData[reportId];
    if (!data) {
      return [];
    }
    return timePeriod === 'monthly' ? data.monthly : data.yearly;
  }, [reportId, timePeriod]);

  // Check if previous year data is available (only in monthly view)
  const hasPreviousYearData = useMemo(() => {
    if (timePeriod !== 'monthly') {
      return false;
    }
    const data = mockReportData[reportId];
    if (!data) {
      return false;
    }
    return data.monthly.some(d => d.previousYear !== undefined);
  }, [reportId, timePeriod]);

  const xKey = timePeriod === 'monthly' ? 'month' : 'year';

  const insights = mockInsights[reportId] || [];

  const formatValue = useCallback((value: number) => {
    // Format currency values appropriately
    if (reportId === 'amount-due' || reportId === 'past-due' || reportId === 'payments-last-30-days' || reportId === 'payments-pending' || reportId === 'failed-payments') {
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
      }
      return `$${value}`;
    }
    if (reportId === 'income-per-student') {
      return `$${value}`;
    }
    return value.toString();
  }, [reportId]);

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_reports')}
        </Button>
        <div>{t('no_data')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} data-testid="back-button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_reports')}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">{t('chart_title')}</h2>
            <div className="flex items-center gap-4">
              {hasPreviousYearData && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="compare-years"
                    checked={showComparison}
                    onCheckedChange={checked => setShowComparison(checked === true)}
                    data-testid="compare-years-checkbox"
                  />
                  <Label htmlFor="compare-years" className="cursor-pointer text-sm">
                    {t('compare_with_last_year')}
                  </Label>
                </div>
              )}
              <Select
                value={timePeriod}
                onValueChange={value => setTimePeriod(value as TimePeriod)}
              >
                <SelectTrigger size="sm" aria-label="Select time period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('time_period_monthly')}</SelectItem>
                  <SelectItem value="yearly">{t('time_period_yearly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(reportId, chartData, xKey, formatValue, showComparison)}
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-3xl font-bold text-primary">{report.currentValue}</span>
            <span className="ml-2 text-sm text-muted-foreground">Current Value</span>
          </div>
        </Card>

        {/* Insights Section */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t('insights_title')}</h2>
          <ul className="space-y-3">
            {insights.map(insight => (
              <li key={insight} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {insight}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const t = useTranslations('ReportsPage');
  const searchParams = useSearchParams();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(
    () => (searchParams.get('report') as ReportType) || null,
  );

  const handleReportClick = useCallback((reportId: ReportType) => {
    setSelectedReport(reportId);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('report', reportId);
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleBack = useCallback(() => {
    setSelectedReport(null);
    // Remove report from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('report');
    window.history.pushState({}, '', url.toString());
  }, []);

  if (selectedReport) {
    return <ReportDetail reportId={selectedReport} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reportDefinitions.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            onClick={() => handleReportClick(report.id)}
          />
        ))}
      </div>
    </div>
  );
}
