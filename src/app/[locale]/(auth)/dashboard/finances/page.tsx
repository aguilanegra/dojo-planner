'use client';

import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, MoreHorizontal, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';

const mockTransactions = [
  { id: '1', date: 'April 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '71MC01ANQ130', notes: '' },
  { id: '2', date: 'March 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '8CJ19CAMGB10', notes: '' },
  { id: '3', date: 'February 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'HCM1829NBAU', notes: '' },
  { id: '4', date: 'January 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'CP120C72N72KA', notes: '' },
  { id: '5', date: 'December 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '7621KCD721B92', notes: '' },
  { id: '6', date: 'November 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD', notes: '' },
  { id: '7', date: 'October 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD', notes: '' },
];

type FilterType = 'all' | 'membership_dues' | 'purchases' | 'manually_added';
type SortField = 'date' | 'amount' | 'purpose' | 'method' | 'paymentId';
type SortDirection = 'asc' | 'desc';

export default function FinancesPage() {
  const t = useTranslations('FinancesPage');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const ROWS_PER_PAGE = 7;
  const TOTAL_ITEMS = 240;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const sortedTransactions = [...mockTransactions].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'date':
        aValue = a.date.toLowerCase();
        bValue = b.date.toLowerCase();
        break;
      case 'amount':
        aValue = Number.parseFloat(a.amount);
        bValue = Number.parseFloat(b.amount);
        break;
      case 'purpose':
        aValue = a.purpose.toLowerCase();
        bValue = b.purpose.toLowerCase();
        break;
      case 'method':
        aValue = a.method.toLowerCase();
        bValue = b.method.toLowerCase();
        break;
      case 'paymentId':
        aValue = a.paymentId.toLowerCase();
        bValue = b.paymentId.toLowerCase();
        break;
      default:
        aValue = '';
        bValue = '';
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(TOTAL_ITEMS / ROWS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Transactions Card */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t('transactions_heading')}</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {t('import_transactions_button')}
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('new_transaction_button')}
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('tab_all')}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('membership_dues')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeFilter === 'membership_dues'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('tab_membership_dues')}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('purchases')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeFilter === 'purchases'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('tab_purchases')}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('manually_added')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeFilter === 'manually_added'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('tab_manually_added')}
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('date')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_date')}
                    {sortField === 'date' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('amount')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_amount')}
                    {sortField === 'amount' && (
                      sortDirection === 'asc'
                        ? <ArrowDown01 className="h-4 w-4" />
                        : <ArrowUp10 className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('purpose')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_purpose')}
                    {sortField === 'purpose' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('method')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_method')}
                    {sortField === 'method' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('paymentId')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_payment_id')}
                    {sortField === 'paymentId' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('table_notes')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4 text-sm text-foreground">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{transaction.amount}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{transaction.purpose}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.method}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.notes}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={TOTAL_ITEMS}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
}
