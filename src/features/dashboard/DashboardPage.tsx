'use client';

import { Card } from '@/components/ui/card';
import { UtilityBar } from '@/components/ui/utility-bar';
import DashboardCharts from './DashboardCharts';

const memberAverageData = [
  { month: 'Jan', average: 110 },
  { month: 'Feb', average: 105 },
  { month: 'Mar', average: 115 },
  { month: 'Apr', average: 120 },
  { month: 'May', average: 112 },
  { month: 'Jun', average: 118 },
  { month: 'Jul', average: 125 },
  { month: 'Aug', average: 122 },
  { month: 'Sep', average: 128 },
  { month: 'Oct', average: 135 },
  { month: 'Nov', average: 130 },
  { month: 'Dec', average: 115 },
];

const earningsData = [
  { month: 'Jan', earnings: 14000 },
  { month: 'Feb', earnings: 13000 },
  { month: 'Mar', earnings: 14500 },
  { month: 'Apr', earnings: 15200 },
  { month: 'May', earnings: 14800 },
  { month: 'Jun', earnings: 15800 },
  { month: 'Jul', earnings: 16200 },
  { month: 'Aug', earnings: 15500 },
  { month: 'Sep', earnings: 16800 },
  { month: 'Oct', earnings: 17500 },
  { month: 'Nov', earnings: 17200 },
  { month: 'Dec', earnings: 14800 },
];

const membershipsData = [
  { type: 'All people', quantity: 462 },
  { type: 'All students', quantity: 111 },
  { type: 'All families with students', quantity: 92 },
  { type: 'New students (last 30 days)', quantity: 3 },
  { type: 'Memberships with autopay on (automatic)', quantity: 108 },
  { type: 'Memberships with autopay off (manual)', quantity: 3 },
  { type: 'Memberships on hold', quantity: 5 },
  { type: 'Canceled memberships (last 30 days)', quantity: 5 },
  { type: 'Membership net change (30 days)', quantity: 0 },
];

const financialsData = [
  { type: 'Accounts with autopay suspended:', quantity: 2 },
  { type: 'Expiring credit cards (next 60 days)', quantity: 5 },
  { type: 'Bills to approve (next 30 days)', quantity: 0 },
  { type: 'Amount due (next 30 days)', quantity: '$14,394.20' },
  { type: 'Past due (total)', quantity: '$450.62' },
  { type: 'Payments (last 30 days)', quantity: '$13,150.44' },
  { type: 'Payments (pending status)', quantity: '$0.00' },
  { type: 'Failed payments (last 30 days)', quantity: '$1,834.67' },
  { type: 'Income per student (30 days, $13,150.44 / 111 students)', quantity: '$118.47' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header with Utility Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <UtilityBar />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Tables */}
        <div className="space-y-6 lg:col-span-1">
          {/* Memberships Table */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Memberships</h2>
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
                      <td className="py-3 text-foreground">{item.type}</td>
                      <td className="py-3 text-right text-foreground">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Financials Table */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Financials</h2>
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
                      <td className="py-3 text-foreground">{item.type}</td>
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
