'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimePeriod = 'monthly' | 'yearly';

type MonthlyDataPoint = {
  month: string;
  average?: number;
  earnings?: number;
};

type YearlyDataPoint = {
  year: string;
  average?: number;
  earnings?: number;
};

type DashboardChartsProps = {
  memberAverageData: {
    monthly: MonthlyDataPoint[];
    yearly: YearlyDataPoint[];
  };
  earningsData: {
    monthly: MonthlyDataPoint[];
    yearly: YearlyDataPoint[];
  };
};

export default function DashboardCharts({ memberAverageData, earningsData }: DashboardChartsProps) {
  const [memberAveragePeriod, setMemberAveragePeriod] = useState<TimePeriod>('monthly');
  const [earningsPeriod, setEarningsPeriod] = useState<TimePeriod>('monthly');

  const currentMemberAverageData = memberAveragePeriod === 'monthly'
    ? memberAverageData.monthly
    : memberAverageData.yearly;

  const currentEarningsData = earningsPeriod === 'monthly'
    ? earningsData.monthly
    : earningsData.yearly;

  const memberAverageXKey = memberAveragePeriod === 'monthly' ? 'month' : 'year';
  const earningsXKey = earningsPeriod === 'monthly' ? 'month' : 'year';

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Member Average Chart */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Member average</h2>
          <Select
            value={memberAveragePeriod}
            onValueChange={value => setMemberAveragePeriod(value as TimePeriod)}
          >
            <SelectTrigger size="sm" aria-label="Select time period for member average">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentMemberAverageData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
            <XAxis dataKey={memberAverageXKey} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={60} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="average" fill="hsl(var(--primary))" radius={[12, 12, 10, 10]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-end">
          <Button variant="outline" size="sm">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Earnings Chart */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Earnings</h2>
          <Select
            value={earningsPeriod}
            onValueChange={value => setEarningsPeriod(value as TimePeriod)}
          >
            <SelectTrigger size="sm" aria-label="Select time period for earnings">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentEarningsData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
            <XAxis dataKey={earningsXKey} axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={60} tickFormatter={value => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="earnings" fill="hsl(var(--accent))" radius={[12, 12, 10, 10]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-end">
          <Button variant="outline" size="sm">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
