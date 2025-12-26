'use client';

import type { FinancesFilters } from './FinancesFilterBar';
import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Spinner } from '@/components/ui/spinner';
import { TransactionCard } from '@/templates/TransactionCard';
import { FinancesFilterBar } from './FinancesFilterBar';

type Transaction = {
  id: string;
  date: string;
  amount: string;
  purpose: string;
  method: string;
  paymentId: string;
  notes: string;
};

type FinancesTableProps = {
  transactions: Transaction[];
  loading?: boolean;
  headerActions?: React.ReactNode;
};

type SortField = 'date' | 'amount' | 'purpose' | 'method' | 'paymentId';
type SortDirection = 'asc' | 'desc';

export function FinancesTable({
  transactions,
  loading = false,
  headerActions,
}: FinancesTableProps) {
  const t = useTranslations('FinancesPage');
  const [filters, setFilters] = useState<FinancesFilters>({
    search: '',
    purpose: 'all',
  });
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 10;

  const handleFiltersChange = (newFilters: FinancesFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const availablePurposes = useMemo(() => {
    const purposes = new Set<string>();
    transactions.forEach((transaction) => {
      if (transaction.purpose) {
        purposes.add(transaction.purpose);
      }
    });
    return Array.from(purposes).sort();
  }, [transactions]);

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = filters.search === ''
      || transaction.date.toLowerCase().includes(searchLower)
      || transaction.amount.toLowerCase().includes(searchLower)
      || transaction.purpose.toLowerCase().includes(searchLower)
      || transaction.method.toLowerCase().includes(searchLower)
      || transaction.paymentId.toLowerCase().includes(searchLower)
      || transaction.notes.toLowerCase().includes(searchLower);

    const matchesPurpose = filters.purpose === 'all' || transaction.purpose === filters.purpose;

    return matchesSearch && matchesPurpose;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'amount':
        aValue = Number.parseFloat(a.amount.replace(/[$,]/g, ''));
        bValue = Number.parseFloat(b.amount.replace(/[$,]/g, ''));
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

  const totalPages = Math.ceil(sortedTransactions.length / ROWS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const hasFiltersApplied = filters.search !== '' || filters.purpose !== 'all';
  const showNoResults = hasFiltersApplied && filteredTransactions.length === 0 && transactions.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Search and Filter Bar with Actions */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex-1">
            <FinancesFilterBar
              onFiltersChangeAction={handleFiltersChange}
              availablePurposes={availablePurposes}
            />
          </div>
          {headerActions}
        </div>

        {/* Transactions Table - Desktop View */}
        <div className="hidden rounded-lg border border-border bg-background lg:block">
          {loading
            ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground">{t('loading_transactions')}</p>
                </div>
              )
            : filteredTransactions.length === 0
              ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {showNoResults ? t('no_results_found') : t('no_transactions')}
                  </div>
                )
              : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary">
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
                            <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
        </div>

        {/* Transaction Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {loading
            ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground">{t('loading_transactions')}</p>
                </div>
              )
            : filteredTransactions.length === 0
              ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {showNoResults ? t('no_results_found') : t('no_transactions')}
                  </div>
                )
              : (
                  paginatedTransactions.map(transaction => (
                    <TransactionCard
                      key={transaction.id}
                      id={transaction.id}
                      date={transaction.date}
                      amount={transaction.amount}
                      purpose={transaction.purpose}
                      method={transaction.method}
                      paymentId={transaction.paymentId}
                      notes={transaction.notes}
                    />
                  ))
                )}
        </div>

        {/* Pagination */}
        {!loading && sortedTransactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedTransactions.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
