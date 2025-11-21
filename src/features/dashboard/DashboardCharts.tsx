'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
          <BarChart data={memberAverageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="earnings" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
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
