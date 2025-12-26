'use client';

import type { Coupon, CouponFilters, CouponFormData } from '@/features/marketing';
import { ArrowDownAZ, ArrowUpZA, Edit, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { AddEditCouponModal, CouponCard, CouponFilterBar, DeleteCouponAlertDialog } from '@/features/marketing';
import { StatsCards } from '@/templates/StatsCards';

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'CTA_FAMILY_1',
    description: 'Family Member Discount',
    type: 'Percentage',
    amount: '15%',
    applyTo: 'Memberships',
    usage: '23/100',
    expiry: '2024-12-31',
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
    expiry: '2025-03-15',
    status: 'Active',
  },
  {
    id: '3',
    code: 'FREETRIAL7',
    description: '7 Day Free Trial',
    type: 'Free Trial',
    amount: '7 Days',
    applyTo: 'Memberships',
    usage: '45/\u221E',
    expiry: '',
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
    expiry: '2024-11-30',
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
    expiry: '2024-08-31',
    status: 'Inactive',
  },
  {
    id: '6',
    code: 'HOLIDAY25',
    description: 'Holiday Special',
    type: 'Fixed Amount',
    amount: '$25',
    applyTo: 'Memberships',
    usage: '35/75',
    expiry: '2024-12-25',
    status: 'Active',
  },
  {
    id: '7',
    code: 'REFERRAL10',
    description: 'Referral Bonus',
    type: 'Percentage',
    amount: '10%',
    applyTo: 'Memberships',
    usage: '102/\u221E',
    expiry: '',
    status: 'Active',
  },
  {
    id: '8',
    code: 'FLASH20',
    description: 'Flash Sale',
    type: 'Fixed Amount',
    amount: '$20',
    applyTo: 'Products',
    usage: '50/50',
    expiry: '2025-01-01',
    status: 'Expired',
  },
  {
    id: '9',
    code: 'NEWYEAR25',
    description: 'New Year Discount',
    type: 'Percentage',
    amount: '25%',
    applyTo: 'Both',
    usage: '0/150',
    expiry: '2025-01-31',
    status: 'Active',
  },
  {
    id: '10',
    code: 'LOYALTY15',
    description: 'Loyalty Reward',
    type: 'Percentage',
    amount: '15%',
    applyTo: 'Memberships',
    usage: '88/100',
    expiry: '2025-02-28',
    status: 'Active',
  },
  {
    id: '11',
    code: 'SPRING10',
    description: 'Spring Savings',
    type: 'Fixed Amount',
    amount: '$10',
    applyTo: 'Products',
    usage: '15/40',
    expiry: '2025-04-01',
    status: 'Active',
  },
  {
    id: '12',
    code: 'VIP50',
    description: 'VIP Member Exclusive',
    type: 'Fixed Amount',
    amount: '$50',
    applyTo: 'Memberships',
    usage: '5/20',
    expiry: '2025-05-15',
    status: 'Inactive',
  },
];

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

type SortField = 'code' | 'type' | 'amount' | 'applyTo' | 'usage' | 'expiry' | 'status';
type SortDirection = 'asc' | 'desc';

export default function MarketingPage() {
  const t = useTranslations('MarketingPage');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<CouponFilters>({
    search: '',
    status: 'all',
    type: 'all',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<{ id: string; code: string } | null>(null);
  const ROWS_PER_PAGE = 10;

  const handleFiltersChange = (newFilters: CouponFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  // Compute available values from actual coupon data
  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    mockCoupons.forEach((coupon) => {
      if (coupon.status) {
        statuses.add(coupon.status);
      }
    });
    return Array.from(statuses).sort();
  }, []);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    mockCoupons.forEach((coupon) => {
      if (coupon.type) {
        types.add(coupon.type);
      }
    });
    return Array.from(types).sort();
  }, []);

  // Filter coupons
  const filteredCoupons = mockCoupons.filter((coupon) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch = filters.search === ''
      || coupon.code.toLowerCase().includes(searchLower)
      || coupon.description.toLowerCase().includes(searchLower);

    const matchesStatus = filters.status === 'all' || coupon.status === filters.status;
    const matchesType = filters.type === 'all' || coupon.type === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedCoupons.length / ROWS_PER_PAGE);
  const paginatedCoupons = sortedCoupons.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE,
  );

  // Stats data
  const stats = useMemo(() => ({
    totalCoupons: mockCoupons.length,
    activeCoupons: mockCoupons.filter(c => c.status === 'Active').length,
    totalSavings: '$2,450',
    timesUsed: 156,
  }), []);

  const statsData = useMemo(() => [
    { id: 'total', label: t('total_coupons_label'), value: stats.totalCoupons },
    { id: 'active', label: t('active_label'), value: stats.activeCoupons },
    { id: 'savings', label: t('total_savings_label'), value: stats.totalSavings },
    { id: 'used', label: t('times_used_label'), value: stats.timesUsed },
  ], [stats, t]);

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDeleteCoupon = useCallback((couponId: string) => {
    const coupon = mockCoupons.find(c => c.id === couponId);
    if (coupon) {
      setDeletingCoupon({ id: coupon.id, code: coupon.code });
    }
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeletingCoupon(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingCoupon) {
      // Mock delete - in real app, this would call an API
      console.info('[Marketing] Delete coupon:', deletingCoupon.id);
      setDeletingCoupon(null);
    }
  }, [deletingCoupon]);

  const handleSaveCoupon = (couponData: CouponFormData, isEdit: boolean) => {
    // Mock save - in real app, this would call an API
    console.info('[Marketing] Save coupon:', { couponData, isEdit });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <StatsCards stats={statsData} columns={4} />

      {/* Header */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Coupons Heading */}
      <h2 className="text-lg font-semibold text-foreground">{t('coupons_heading')}</h2>

      {/* Search, Filter Bar, and Add Button */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex-1">
            <CouponFilterBar
              onFiltersChangeAction={handleFiltersChange}
              availableStatuses={availableStatuses}
              availableTypes={availableTypes}
            />
          </div>
          <Button onClick={handleOpenAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            {t('add_new_coupon_button')}
          </Button>
        </div>

        {/* Coupons Table - Desktop View */}
        <div className="hidden rounded-lg border border-border bg-background lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
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
                    <td className="px-6 py-4 text-sm text-foreground">{formatExpiryDate(coupon.expiry)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        getStatusVariant(coupon.status) === 'default'
                          ? 'bg-primary/10 text-primary'
                          : getStatusVariant(coupon.status) === 'secondary'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-destructive/10 text-destructive'
                      }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCoupon(coupon)}
                          aria-label={`Edit ${coupon.code}`}
                          title={`Edit ${coupon.code}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          aria-label={`Delete ${coupon.code}`}
                          title={`Delete ${coupon.code}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coupons Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {paginatedCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={handleEditCoupon}
              onDelete={handleDeleteCoupon}
            />
          ))}
        </div>

        {/* Pagination */}
        {sortedCoupons.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedCoupons.length}
            itemsPerPage={ROWS_PER_PAGE}
            onPageChangeAction={setCurrentPage}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddEditCouponModal
        isOpen={isModalOpen}
        onCloseAction={handleCloseModal}
        coupon={editingCoupon}
        onSaveAction={handleSaveCoupon}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCouponAlertDialog
        isOpen={!!deletingCoupon}
        couponCode={deletingCoupon?.code ?? ''}
        onCloseAction={handleCloseDeleteDialog}
        onConfirmAction={handleConfirmDelete}
      />
    </div>
  );
}
