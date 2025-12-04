'use client';

import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, MoreHorizontal, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Panel, PanelContent, PanelFooter, PanelHeader, PanelTabs } from '@/components/ui/panel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Transactions Panel */}
      <Panel>
        <Tabs
          defaultValue="all"
          onValueChange={(value) => {
            setActiveFilter(value as FilterType);
            setCurrentPage(0);
          }}
        >
          <PanelHeader withDivider={true}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-medium text-foreground">{t('transactions_heading')}</h2>
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
              <PanelTabs>
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger value="all" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('tab_all')}</TabsTrigger>
                  <TabsTrigger value="membership_dues" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('tab_membership_dues')}</TabsTrigger>
                  <TabsTrigger value="purchases" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('tab_purchases')}</TabsTrigger>
                  <TabsTrigger value="manually_added" className="border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent">{t('tab_manually_added')}</TabsTrigger>
                </TabsList>
              </PanelTabs>
            </div>
          </PanelHeader>

          <TabsContent value={activeFilter} className="mt-0">
            <PanelContent>
              {/* Transactions Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>{t('table_notes')}</TableHead>
                    <TableHead>{t('table_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm text-foreground">{transaction.date}</TableCell>
                      <TableCell className="text-sm text-foreground">{transaction.amount}</TableCell>
                      <TableCell className="text-sm text-foreground">{transaction.purpose}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.method}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.paymentId}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.notes}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PanelContent>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <PanelFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={TOTAL_ITEMS}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        </PanelFooter>
      </Panel>
    </div>
  );
}
