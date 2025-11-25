'use client';

import { ArrowDownAZ, ArrowUpZA, ChevronDown, Edit, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination/Pagination';

type Coupon = {
  id: string;
  code: string;
  description: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Trial';
  amount: string;
  applyTo: 'Memberships' | 'Products' | 'Both';
  usage: string;
  expiry: string;
  status: 'Active' | 'Expired' | 'Inactive';
};

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'CTA_FAMILY_1',
    description: 'Family Member Discount',
    type: 'Percentage',
    amount: '15%',
    applyTo: 'Memberships',
    usage: '23/100',
    expiry: 'Dec 31 24',
    status: 'Active',
  },
  {
    id: '2',
    code: 'NEWSTUDENT50',
    description: 'New Student Special',
    type: 'Fixed Amount',
    amount: '$50',
    applyTo: 'Memberships',
    usage: '8/50',
    expiry: 'Mar 15 25',
    status: 'Active',
  },
  {
    id: '3',
    code: 'FREETRIAL7',
    description: '7 Day Free Trial',
    type: 'Free Trial',
    amount: '7 Days',
    applyTo: 'Memberships',
    usage: '45/∞',
    expiry: 'No Expiry',
    status: 'Active',
  },
  {
    id: '4',
    code: 'BLACKFRIDAY',
    description: 'Black Friday Sale',
    type: 'Percentage',
    amount: '25%',
    applyTo: 'Products',
    usage: '67/200',
    expiry: 'Nov 30 24',
    status: 'Expired',
  },
  {
    id: '5',
    code: 'SUMMER2024',
    description: 'Summer Promotion',
    type: 'Percentage',
    amount: '20%',
    applyTo: 'Both',
    usage: '12/100',
    expiry: 'Aug 31 24',
    status: 'Inactive',
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'text-green-600';
    case 'Expired':
      return 'text-yellow-600';
    case 'Inactive':
      return 'text-red-600';
    default:
      return 'text-foreground';
  }
}

function getUsagePercentage(usage: string): number {
  const parts = usage.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return 0;
  }

  const used = Number.parseFloat(parts[0]);
  const limit = parts[1];

  // If limit is infinity symbol, show full bar
  if (limit === '∞') {
    return 100;
  }

  const limitNum = Number.parseFloat(limit);
  if (Number.isNaN(used) || Number.isNaN(limitNum) || limitNum === 0) {
    return 0;
  }

  return Math.min((used / limitNum) * 100, 100);
}

type SortField = 'code' | 'type' | 'amount' | 'applyTo' | 'usage' | 'expiry' | 'status';
type SortDirection = 'asc' | 'desc';

export default function MarketingPage() {
  const t = useTranslations('MarketingPage');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const ROWS_PER_PAGE = 5;
  const TOTAL_ITEMS = 15;
  const STATUS_FILTER = t('status_filter');
  const TYPE_FILTER = t('type_filter');
  const APPLY_FILTER = t('apply_filter');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const sortedCoupons = [...mockCoupons].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'code':
        aValue = a.code.toLowerCase();
        bValue = b.code.toLowerCase();
        break;
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'amount':
        aValue = a.amount.toLowerCase();
        bValue = b.amount.toLowerCase();
        break;
      case 'applyTo':
        aValue = a.applyTo.toLowerCase();
        bValue = b.applyTo.toLowerCase();
        break;
      case 'usage':
        aValue = a.usage.toLowerCase();
        bValue = b.usage.toLowerCase();
        break;
      case 'expiry':
        aValue = a.expiry.toLowerCase();
        bValue = b.expiry.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
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
  const paginatedCoupons = sortedCoupons.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Coupons Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t('coupons_heading')}</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_new_coupon_button')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('total_coupons_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">12</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('active_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">8</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('total_savings_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">$2,450</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">{t('times_used_label')}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">156</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          {/* Status Filter */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            {STATUS_FILTER}
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Type Filter */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            {TYPE_FILTER}
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Apply To Filter */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
          >
            {APPLY_FILTER}
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Reset Button */}
          <Button variant="outline">{t('reset_filters_button')}</Button>
        </div>

        {/* Coupons Table - Desktop View */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="w-12 px-6 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('code')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_code')}
                    {sortField === 'code' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('type')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_type')}
                    {sortField === 'type' && (
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
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('applyTo')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_apply_to')}
                    {sortField === 'applyTo' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('usage')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_usage_limit')}
                    {sortField === 'usage' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('expiry')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_expiry')}
                    {sortField === 'expiry' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  <button
                    type="button"
                    onClick={() => handleSort('status')}
                    className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                  >
                    {t('table_status')}
                    {sortField === 'status' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpZA className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map(coupon => (
                <tr key={coupon.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{coupon.code}</p>
                      <p className="text-xs text-muted-foreground">{coupon.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{coupon.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{coupon.amount}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{coupon.applyTo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{coupon.usage}</span>
                      <div className="relative h-1 w-16 rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-blue-500"
                          style={{ width: `${getUsagePercentage(coupon.usage)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{coupon.expiry}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${getStatusColor(coupon.status)}`}>
                    {coupon.status}
                  </td>
                  <td className="flex gap-2 px-6 py-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Coupons Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {paginatedCoupons.map(coupon => (
            <Card key={coupon.id} className="p-4">
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
                  <div className={`text-sm font-medium whitespace-nowrap ${getStatusColor(coupon.status)}`}>
                    {coupon.status}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{t('table_type')}</span>
                    <span className="text-sm font-medium text-foreground">{coupon.type}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{t('table_amount')}</span>
                    <span className="text-sm font-medium text-foreground">{coupon.amount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{t('table_apply_to')}</span>
                    <span className="text-sm font-medium text-foreground">{coupon.applyTo}</span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">{t('table_usage_limit')}</span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-foreground">{coupon.usage}</span>
                      <div className="relative h-1 w-16 rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-blue-500"
                          style={{ width: `${getUsagePercentage(coupon.usage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{t('table_expiry')}</span>
                    <span className="text-sm font-medium text-foreground">{coupon.expiry}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      {t('table_actions')}
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
