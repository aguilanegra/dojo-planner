'use client';

import type { Transaction } from '@/features/finances/FinancesTable';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FinancesTable } from '@/features/finances/FinancesTable';
import { StatsCards } from '@/templates/StatsCards';

// Mock transaction data for demonstration (test-data, not real credentials)
// Note: Card numbers shown are masked display values (****1234), not actual card numbers
const mockTransactions: Transaction[] = [
  // Membership Dues transactions
  { id: '1', date: 'April 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXN71MC01ANQ130', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '2', date: 'March 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXN8CJ19CAMGB10', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '3', date: 'February 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNHCM1829NBAU', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '4', date: 'January 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNCP120C72N72KA', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '5', date: 'December 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXN7621KCD721B92', memberName: 'Jane Doe', memberId: 'M002', status: 'paid' },
  { id: '6', date: 'November 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXN73VBSV6DKSVD', memberName: 'Jane Doe', memberId: 'M002', status: 'declined' },
  { id: '7', date: 'October 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNABC123DEF456', memberName: 'Mike Johnson', memberId: 'M003', status: 'paid' },
  { id: '8', date: 'September 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNXYZ789GHI012', memberName: 'Mike Johnson', memberId: 'M003', status: 'refunded' },
  { id: '9', date: 'August 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNJKL345MNO678', memberName: 'Sarah Williams', memberId: 'M004', status: 'paid' },
  { id: '10', date: 'July 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ****1234', transactionId: 'TXNPQR901STU234', memberName: 'Sarah Williams', memberId: 'M004', status: 'pending' },
  { id: '14', date: 'March 5, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'ACH Transfer', transactionId: 'TXNACH2024030501', memberName: 'Lisa Garcia', memberId: 'M007', status: 'paid' },
  // Merchandise transactions
  { id: '11', date: 'June 15, 2024', amount: '$75.00', purpose: 'Merchandise', method: 'Saved Card Ending ****5678', transactionId: 'TXNVWX567YZA890', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '15', date: 'February 28, 2024', amount: '$35.00', purpose: 'Merchandise', method: 'Saved Card Ending ****5678', transactionId: 'TXNMERCH20240228', memberName: 'Chris Martinez', memberId: 'M008', status: 'paid' },
  { id: '16', date: 'January 10, 2024', amount: '$45.00', purpose: 'Merchandise', method: 'Cash', transactionId: 'TXNMERCH20240110', memberName: 'Emily Brown', memberId: 'M005', status: 'pending' },
  { id: '17', date: 'December 20, 2023', amount: '$120.00', purpose: 'Merchandise', method: 'Saved Card Ending ****1234', transactionId: 'TXNMERCH20231220', memberName: 'David Lee', memberId: 'M006', status: 'refunded' },
  { id: '18', date: 'November 5, 2023', amount: '$65.00', purpose: 'Merchandise', method: 'Saved Card Ending ****5678', transactionId: 'TXNMERCH20231105', memberName: 'Sarah Williams', memberId: 'M004', status: 'declined' },
  // Event transactions
  { id: '19', date: 'April 5, 2025', amount: '$50.00', purpose: 'Event', method: 'Saved Card Ending ****1234', transactionId: 'TXNEVT20250405', memberName: 'John Smith', memberId: 'M001', status: 'paid' },
  { id: '20', date: 'March 20, 2025', amount: '$75.00', purpose: 'Event', method: 'Saved Card Ending ****5678', transactionId: 'TXNEVT20250320', memberName: 'Jane Doe', memberId: 'M002', status: 'paid' },
  { id: '21', date: 'February 10, 2025', amount: '$100.00', purpose: 'Event', method: 'Cash', transactionId: 'TXNEVT20250210', memberName: 'Mike Johnson', memberId: 'M003', status: 'processing' },
  { id: '22', date: 'January 25, 2025', amount: '$50.00', purpose: 'Event', method: 'Saved Card Ending ****1234', transactionId: 'TXNEVT20250125', memberName: 'Lisa Garcia', memberId: 'M007', status: 'pending' },
  { id: '23', date: 'December 15, 2024', amount: '$75.00', purpose: 'Event', method: 'Saved Card Ending ****5678', transactionId: 'TXNEVT20241215', memberName: 'Chris Martinez', memberId: 'M008', status: 'declined' },
  { id: '24', date: 'November 10, 2024', amount: '$60.00', purpose: 'Event', method: 'ACH Transfer', transactionId: 'TXNEVT20241110', memberName: 'Emily Brown', memberId: 'M005', status: 'refunded' },
  // Private Lesson transactions
  { id: '12', date: 'May 10, 2024', amount: '$50.00', purpose: 'Private Lesson', method: 'Cash', transactionId: 'TXNCASH001', memberName: 'Emily Brown', memberId: 'M005', status: 'paid' },
  { id: '25', date: 'April 1, 2024', amount: '$50.00', purpose: 'Private Lesson', method: 'Saved Card Ending ****1234', transactionId: 'TXNPL20240401', memberName: 'David Lee', memberId: 'M006', status: 'paid' },
  { id: '26', date: 'March 15, 2024', amount: '$75.00', purpose: 'Private Lesson', method: 'Cash', transactionId: 'TXNPL20240315', memberName: 'Sarah Williams', memberId: 'M004', status: 'pending' },
  // Seminar transactions
  { id: '13', date: 'April 22, 2024', amount: '$25.00', purpose: 'Seminar', method: 'Saved Card Ending ****1234', transactionId: 'TXNSEM20240422', memberName: 'David Lee', memberId: 'M006', status: 'processing' },
  { id: '27', date: 'February 5, 2024', amount: '$30.00', purpose: 'Seminar', method: 'Saved Card Ending ****5678', transactionId: 'TXNSEM20240205', memberName: 'Mike Johnson', memberId: 'M003', status: 'paid' },
];

function getTransactionsInPast30Days(transactions: Transaction[]): Transaction[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= thirtyDaysAgo;
  });
}

export default function FinancesPage() {
  const t = useTranslations('FinancesPage');

  const stats = useMemo(() => {
    const recentTransactions = getTransactionsInPast30Days(mockTransactions);

    const paid = recentTransactions.filter(tx => tx.status === 'paid').length;
    const declined = recentTransactions.filter(tx => tx.status === 'declined').length;
    const refunded = recentTransactions.filter(tx => tx.status === 'refunded').length;

    return { paid, declined, refunded };
  }, []);

  const statsData = useMemo(() => [
    { id: 'paid', label: t('stats_paid_label'), value: stats.paid },
    { id: 'declined', label: t('stats_declined_label'), value: stats.declined },
    { id: 'refunded', label: t('stats_refunded_label'), value: stats.refunded },
  ], [stats, t]);

  return (
    <div className="space-y-6">
      <StatsCards stats={statsData} columns={3} fullWidth={false} />
      <FinancesTable transactions={mockTransactions} />
    </div>
  );
}
