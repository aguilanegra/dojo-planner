'use client';

import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Panel, PanelContent, PanelHeader } from '@/components/ui/panel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Invoice = {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
};

type SortField = 'number' | 'date' | 'description' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

const mockLocations = [
  {
    id: 'downtown-hq',
    name: 'Downtown HQ',
    address: '123 Main St. San Francisco. CA',
    phone: '(415) 555-0123',
    email: 'downtown@example.com',
    activeMembers: 247,
  },
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-012',
    date: 'Dec 15, 2024',
    description: 'Dojo Planner Pro - Annual',
    amount: '$1,188.00',
    status: 'PAID',
  },
  {
    id: '2',
    number: 'INV-2023-011',
    date: 'Dec 15, 2023',
    description: 'Dojo Planner Pro - Annual',
    amount: '$1,188.00',
    status: 'PAID',
  },
  {
    id: '3',
    number: 'INV-2023-010',
    date: 'Nov 15, 2023',
    description: 'Setup Fee',
    amount: '$49.00',
    status: 'PAID',
  },
];

export function AccountSettingsPage() {
  const t = useTranslations('AccountSettings');
  const [selectedLocation, setSelectedLocation] = useState('downtown-hq');
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const currentLocation = mockLocations.find(l => l.id === selectedLocation) || mockLocations[0];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...mockInvoices].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'number':
        aValue = a.number.toLowerCase();
        bValue = b.number.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'description':
        aValue = a.description.toLowerCase();
        bValue = b.description.toLowerCase();
        break;
      case 'amount':
        aValue = Number.parseFloat(a.amount.replace(/[$,]/g, ''));
        bValue = Number.parseFloat(b.amount.replace(/[$,]/g, ''));
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

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'PAID':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Location Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">{t('location_label')}</label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockLocations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location & Billing Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {currentLocation!.name}
          {' '}
          - Billing
        </h2>
      </div>

      {/* Location Information and Subscription Details Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Location Information Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground">{t('location_information_title')}</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">{t('address_label')}</label>
              <p className="mt-1 text-foreground">{currentLocation!.address}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t('phone_label')}</label>
              <p className="mt-1 text-foreground">{currentLocation!.phone}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t('email_label')}</label>
              <p className="mt-1 text-foreground">{currentLocation!.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t('active_members_label')}</label>
              <p className="mt-1 text-foreground">
                {currentLocation!.activeMembers.toString()}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">{t('status_label')}</label>
              <p className="mt-1">
                <Badge>{t('active_status')}</Badge>
              </p>
            </div>
          </div>
        </Card>

        {/* Subscription Details Card */}
        <Card className="p-6">
          <div className="rounded bg-green-50 p-6 dark:bg-green-950">
            <h3 className="text-lg font-semibold text-foreground">{t('subscription_details_title')}</h3>
            <div className="mt-4 space-y-2">
              <p className="font-semibold text-foreground">{t('subscription_plan_name')}</p>
              <p className="text-sm text-muted-foreground">{t('subscription_price')}</p>
              <p className="text-sm text-muted-foreground">{t('next_billing_label')}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline">{t('change_plan_button')}</Button>
            <Button variant="destructive">{t('cancel_subscription_button')}</Button>
          </div>
        </Card>
      </div>

      {/* Payment Method Card */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t('payment_method_title')}</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-100 dark:bg-blue-900">
                <span className="font-bold text-blue-600 dark:text-blue-400">VISA</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{t('payment_method_card')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('payment_method_expires')}
                  {' '}
                  • Last updated: Nov 15, 2024
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{t('billing_address_label')}</p>
              <p className="mt-1 text-foreground">123 Main St. San Francisco. CA 94102</p>
            </div>
          </div>
          <Button>{t('update_payment_method_button')}</Button>
        </div>
      </Card>

      {/* Billing History Section */}
      <Panel>
        <PanelHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('billing_history_title')}</h3>
            <Button variant="outline" size="sm">
              {t('download_all_invoices_button')}
            </Button>
          </div>
        </PanelHeader>

        <PanelContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => handleSort('number')}
                      className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                    >
                      {t('invoice_number_column')}
                      {sortField === 'number' && (
                        sortDirection === 'asc'
                          ? <ArrowDownAZ className="h-4 w-4" />
                          : <ArrowUpZA className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => handleSort('date')}
                      className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                    >
                      {t('date_column')}
                      {sortField === 'date' && (
                        sortDirection === 'asc'
                          ? <ArrowDown01 className="h-4 w-4" />
                          : <ArrowUp10 className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => handleSort('description')}
                      className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                    >
                      {t('description_column')}
                      {sortField === 'description' && (
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
                      {t('amount_column')}
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
                      onClick={() => handleSort('status')}
                      className="flex cursor-pointer items-center gap-2 hover:text-foreground/80"
                    >
                      {t('status_column')}
                      {sortField === 'status' && (
                        sortDirection === 'asc'
                          ? <ArrowDownAZ className="h-4 w-4" />
                          : <ArrowUpZA className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>{t('actions_column')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell className="text-sm font-medium text-foreground">{invoice.number}</TableCell>
                    <TableCell className="text-sm text-foreground">{invoice.date}</TableCell>
                    <TableCell className="text-sm text-foreground">{invoice.description}</TableCell>
                    <TableCell className="text-sm text-foreground">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          {t('view_action_button')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 lg:hidden">
            {sortedInvoices.map(invoice => (
              <Card key={invoice.id} className="p-4">
                <div className="space-y-4">
                  {/* Header with Invoice Number and Date */}
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">{t('invoice_number_column')}</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{invoice.number}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-muted-foreground">{t('date_column')}</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{invoice.date}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">{t('description_column')}</div>
                      <div className="mt-1 text-sm text-foreground">{invoice.description}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">{t('amount_column')}</div>
                      <div className="mt-1 text-sm text-foreground">{invoice.amount}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">{t('status_column')}</div>
                      <Badge variant={getStatusVariant(invoice.status)} className="mt-1">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <Button variant="outline" size="sm">
                      {t('view_action_button')}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </PanelContent>
      </Panel>
    </div>
  );
}
