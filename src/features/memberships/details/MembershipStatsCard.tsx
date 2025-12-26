'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

type MembershipStatsCardProps = {
  activeCount: number;
  revenue: string;
  isTrial: boolean;
  price: string;
};

export function MembershipStatsCard({
  activeCount,
  revenue,
  isTrial,
  price,
}: MembershipStatsCardProps) {
  const t = useTranslations('MembershipDetailPage.StatsCard');

  const activeLabel = isTrial ? t('active_trials') : t('active_members');

  return (
    <Card className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('price_label')}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{price}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{activeLabel}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{activeCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('revenue_label')}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{revenue}</p>
        </div>
      </div>
    </Card>
  );
}
