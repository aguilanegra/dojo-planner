'use client';

import { Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FinancesTable } from '@/features/finances/FinancesTable';

// Mock transaction data for demonstration (test-data, not real credentials)
const mockTransactions = [
  { id: '1', date: 'April 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: '71MC01ANQ130', notes: '' },
  { id: '2', date: 'March 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: '8CJ19CAMGB10', notes: '' },
  { id: '3', date: 'February 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'HCM1829NBAU', notes: '' },
  { id: '4', date: 'January 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'CP120C72N72KA', notes: '' },
  { id: '5', date: 'December 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: '7621KCD721B92', notes: '' },
  { id: '6', date: 'November 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: '73VBSV6DKSVD', notes: '' },
  { id: '7', date: 'October 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'ABC123DEF456', notes: '' },
  { id: '8', date: 'September 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'XYZ789GHI012', notes: '' },
  { id: '9', date: 'August 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'JKL345MNO678', notes: '' },
  { id: '10', date: 'July 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', paymentId: 'PQR901STU234', notes: '' },
  { id: '11', date: 'June 15, 2024', amount: '$75.00', purpose: 'Merchandise', method: 'Saved Card Ending ****5678', paymentId: 'VWX567YZA890', notes: 'Gi purchase' },
  { id: '12', date: 'May 10, 2024', amount: '$50.00', purpose: 'Private Lesson', method: 'Cash', paymentId: 'CASH001', notes: '1 hour session' },
  { id: '13', date: 'April 22, 2024', amount: '$25.00', purpose: 'Seminar', method: 'Saved Card Ending ****1234', paymentId: 'SEM20240422', notes: 'Guest instructor seminar' },
  { id: '14', date: 'March 5, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'ACH Transfer', paymentId: 'ACH2024030501', notes: '' },
  { id: '15', date: 'February 28, 2024', amount: '$35.00', purpose: 'Merchandise', method: 'Saved Card Ending ****5678', paymentId: 'MERCH20240228', notes: 'Rashguard' },
];

export default function FinancesPage() {
  const t = useTranslations('FinancesPage');

  return (
    <div className="space-y-6">
      <FinancesTable
        transactions={mockTransactions}
        headerActions={(
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="mr-0.5 h-4 w-4" />
              {t('import_transactions_button')}
            </Button>
            <Button>
              <Plus className="mr-0.5 h-4 w-4" />
              {t('new_transaction_button')}
            </Button>
          </div>
        )}
      />
    </div>
  );
}
