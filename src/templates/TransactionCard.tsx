'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';

type TransactionCardProps = {
  id: string;
  date: string;
  amount: string;
  purpose: string;
  method: string;
  paymentId: string;
  notes: string;
};

export function TransactionCard({
  date,
  amount,
  purpose,
  method,
  paymentId,
  notes,
}: TransactionCardProps) {
  const t = useTranslations('FinancesPage');

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header - Date and Amount */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="font-medium text-foreground">{date}</div>
            <div className="text-xs text-muted-foreground">{paymentId}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">{amount}</div>
            <div className="text-xs text-muted-foreground">{purpose}</div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-muted-foreground">{t('table_method')}</div>
            <div className="mt-1 text-sm text-foreground">{method}</div>
          </div>
          {notes && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground">{t('table_notes')}</div>
              <div className="mt-1 text-sm text-foreground">{notes}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
