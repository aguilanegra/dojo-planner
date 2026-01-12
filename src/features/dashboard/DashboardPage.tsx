'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import DashboardCharts from './DashboardCharts';

const memberAverageData = {
  monthly: [
    { month: 'Jan', average: 110, previousYearAverage: 95 },
    { month: 'Feb', average: 105, previousYearAverage: 92 },
    { month: 'Mar', average: 115, previousYearAverage: 98 },
    { month: 'Apr', average: 120, previousYearAverage: 102 },
    { month: 'May', average: 112, previousYearAverage: 100 },
    { month: 'Jun', average: 118, previousYearAverage: 105 },
    { month: 'Jul', average: 125, previousYearAverage: 110 },
    { month: 'Aug', average: 122, previousYearAverage: 108 },
    { month: 'Sep', average: 128, previousYearAverage: 112 },
    { month: 'Oct', average: 135, previousYearAverage: 118 },
    { month: 'Nov', average: 130, previousYearAverage: 115 },
    { month: 'Dec', average: 115, previousYearAverage: 100 },
  ],
  yearly: [
    { year: '2020', average: 85 },
    { year: '2021', average: 95 },
    { year: '2022', average: 108 },
    { year: '2023', average: 118 },
    { year: '2024', average: 125 },
  ],
};

const earningsData = {
  monthly: [
    { month: 'Jan', earnings: 14000, previousYearEarnings: 12000 },
    { month: 'Feb', earnings: 13000, previousYearEarnings: 11500 },
    { month: 'Mar', earnings: 14500, previousYearEarnings: 12800 },
    { month: 'Apr', earnings: 15200, previousYearEarnings: 13200 },
    { month: 'May', earnings: 14800, previousYearEarnings: 12900 },
    { month: 'Jun', earnings: 15800, previousYearEarnings: 13800 },
    { month: 'Jul', earnings: 16200, previousYearEarnings: 14200 },
    { month: 'Aug', earnings: 15500, previousYearEarnings: 13600 },
    { month: 'Sep', earnings: 16800, previousYearEarnings: 14800 },
    { month: 'Oct', earnings: 17500, previousYearEarnings: 15400 },
    { month: 'Nov', earnings: 17200, previousYearEarnings: 15100 },
    { month: 'Dec', earnings: 14800, previousYearEarnings: 13000 },
  ],
  yearly: [
    { year: '2020', earnings: 125000 },
    { year: '2021', earnings: 142000 },
    { year: '2022', earnings: 168000 },
    { year: '2023', earnings: 185000 },
    { year: '2024', earnings: 195300 },
  ],
};

type DashboardDataItem = {
  type: string;
  quantity: number | string;
  link?: string;
};

const membershipsData: DashboardDataItem[] = [
  { type: 'All people', quantity: 462, link: '/dashboard/members' },
  { type: 'All students', quantity: 111, link: '/dashboard/members' },
  { type: 'All families with students', quantity: 92, link: '/dashboard/members' },
  { type: 'New students (last 30 days)', quantity: 3, link: '/dashboard/members' },
  { type: 'Memberships with autopay on (automatic)', quantity: 108, link: '/dashboard/members' },
  { type: 'Memberships with autopay off (manual)', quantity: 3, link: '/dashboard/members' },
  { type: 'Memberships on hold', quantity: 5, link: '/dashboard/members' },
  { type: 'Canceled memberships (last 30 days)', quantity: 5, link: '/dashboard/members' },
  { type: 'Membership net change (30 days)', quantity: 0 },
];

const financialsData: DashboardDataItem[] = [
  { type: 'Accounts with autopay suspended:', quantity: 2, link: '/dashboard/reports?report=accounts-autopay-suspended' },
  { type: 'Expiring credit cards (next 60 days)', quantity: 5, link: '/dashboard/reports?report=expiring-credit-cards' },
  { type: 'Amount due (next 30 days)', quantity: '$14,394.20', link: '/dashboard/reports?report=amount-due' },
  { type: 'Past due (total)', quantity: '$450.62', link: '/dashboard/reports?report=past-due' },
  { type: 'Payments (last 30 days)', quantity: '$13,150.44', link: '/dashboard/reports?report=payments-last-30-days' },
  { type: 'Payments (pending status)', quantity: '$0.00', link: '/dashboard/reports?report=payments-pending' },
  { type: 'Failed payments (last 30 days)', quantity: '$1,834.67', link: '/dashboard/reports?report=failed-payments' },
  { type: 'Income per student (30 days, $13,150.44 / 111 students)', quantity: '$118.47', link: '/dashboard/reports?report=income-per-student' },
];

export function DashboardPage() {
  const t = useTranslations('PerformancePage');

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Tables */}
        <div className="space-y-6 lg:col-span-1">
          {/* Memberships Table */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t('memberships_card_title')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-semibold text-foreground">Type</th>
                    <th className="py-2 text-right font-semibold text-foreground">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipsData.map(item => (
                    <tr key={item.type} className="border-b border-border last:border-b-0">
                      <td className="py-3 text-foreground">
                        {item.link
                          ? (
                              <Link href={item.link} className="text-primary underline-offset-4 hover:underline">
                                {item.type}
                              </Link>
                            )
                          : (
                              item.type
                            )}
                      </td>
                      <td className="py-3 text-right text-foreground">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Financials Table */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t('financials_card_title')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-semibold text-foreground">Type</th>
                    <th className="py-2 text-right font-semibold text-foreground">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {financialsData.map(item => (
                    <tr key={item.type} className="border-b border-border last:border-b-0">
                      <td className="py-3 text-foreground">
                        {item.link
                          ? (
                              <Link href={item.link} className="text-primary underline-offset-4 hover:underline">
                                {item.type}
                              </Link>
                            )
                          : (
                              item.type
                            )}
                      </td>
                      <td className="py-3 text-right text-foreground">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Charts */}
        <DashboardCharts memberAverageData={memberAverageData} earningsData={earningsData} />
      </div>
    </div>
  );
}
