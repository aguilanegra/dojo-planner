'use client';

import type { Coupon } from './types';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CouponCardProps = {
  coupon: Coupon;
  onEdit: (coupon: Coupon) => void;
  onDelete: (couponId: string) => void;
};

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Expired':
      return 'secondary';
    case 'Inactive':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getUsagePercentage(usage: string): number {
  const parts = usage.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return 0;
  }

  const used = Number.parseFloat(parts[0]);
  const limit = parts[1];

  if (limit === '\u221E') {
    return 100;
  }

  const limitNum = Number.parseFloat(limit);
  if (Number.isNaN(used) || Number.isNaN(limitNum) || limitNum === 0) {
    return 0;
  }

  return Math.min((used / limitNum) * 100, 100);
}

function formatExpiryDate(expiry: string): string {
  if (!expiry) {
    return 'No Expiry';
  }

  try {
    const date = new Date(expiry);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return expiry;
  }
}

export function CouponCard({
  coupon,
  onEdit,
  onDelete,
}: CouponCardProps) {
  const t = useTranslations('MarketingPage');

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header with Code and Status */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-muted-foreground">{t('table_code')}</div>
            <div className="mt-1">
              <p className="text-sm font-medium text-foreground">{coupon.code}</p>
              <p className="text-xs text-muted-foreground">{coupon.description}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(coupon.status)}>
            {coupon.status}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground">{t('table_type')}</span>
            <div className="mt-1 text-sm font-medium text-foreground">{coupon.type}</div>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground">{t('table_amount')}</span>
            <div className="mt-1 text-sm font-medium text-foreground">{coupon.amount}</div>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground">{t('table_apply_to')}</span>
            <div className="mt-1 text-sm font-medium text-foreground">{coupon.applyTo}</div>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground">{t('table_expiry')}</span>
            <div className="mt-1 text-sm font-medium text-foreground">{formatExpiryDate(coupon.expiry)}</div>
          </div>
        </div>

        {/* Usage */}
        <div>
          <span className="text-xs font-semibold text-muted-foreground">{t('table_usage_limit')}</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-foreground">{coupon.usage}</span>
            <div className="relative h-1 flex-1 rounded-full bg-muted">
              <div
                className="h-1 rounded-full bg-blue-500"
                style={{ width: `${getUsagePercentage(coupon.usage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(coupon)}
            aria-label={`Edit ${coupon.code}`}
            title={`Edit ${coupon.code}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(coupon.id)}
            aria-label={`Delete ${coupon.code}`}
            title={`Delete ${coupon.code}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
