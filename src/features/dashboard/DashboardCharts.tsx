'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type DashboardChartsProps = {
  memberAverageData: Array<{ month: string; average: number }>;
  earningsData: Array<{ month: string; earnings: number }>;
};

export default function DashboardCharts({ memberAverageData, earningsData }: DashboardChartsProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Member Average Chart */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Member average</h2>
          <Button variant="outline" size="sm">
            Monthly
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={memberAverageData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
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
          <Button variant="outline" size="sm">
            Monthly
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
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
