'use client';

import { Card } from '@/components/ui/card';

type StatCard = {
  id: string;
  label: string;
  value: string | number;
  /**
   * Optional formatting for the value display
   * @example formatValue={(value) => `${value}%`}
   * @example formatValue={(value) => `$${Number(value).toLocaleString()}`}
   * @example formatValue={(value) => `+${value}%`}
   * @example formatValue={(value) => `${value}°F`}
   */
  formatValue?: (value: string | number) => string;
};

type StatsCardsProps = {
  /**
   * Array of stat card data to display
   */
  stats: StatCard[];

  /**
   * Number of columns for medium+ screens
   * @default 4
   */
  columns?: 3 | 4;

  /**
   * Optional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to show the cards in full width container
   * @default true
   */
  fullWidth?: boolean;
};

export function StatsCards({
  stats,
  columns = 4,
  className = '',
  fullWidth = true,
}: StatsCardsProps) {
  const containerClass = fullWidth ? 'w-full space-y-6' : 'space-y-6';
  const gridClass = `grid grid-cols-1 gap-4 md:grid-cols-${columns}`;

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      {/* Summary Cards */}
      <div className={gridClass}>
        {stats.map(stat => (
          <Card key={stat.id} className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {stat.formatValue ? stat.formatValue(stat.value) : stat.value}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
