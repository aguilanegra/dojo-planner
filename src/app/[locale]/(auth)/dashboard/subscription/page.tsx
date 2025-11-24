'use client';

import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpZA, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';

const plans = [
  {
    name: 'Basic',
    price: '$29 / month',
    description: 'Just the Dojo Planner CRM without payment processing integration',
    features: [
      { name: 'Unlimited students & classes', included: true },
      { name: 'Digital attendance & student profiles', included: true },
      { name: 'Belt promotion & curriculum tracking', included: true },
      { name: 'Class calendar with RSVP', included: true },
      { name: 'No payment processing integration', included: false },
      { name: 'No team accounts', included: false },
    ],
    button: {
      text: 'Current Plan',
      disabled: true,
    },
  },
  {
    name: 'Growth',
    price: '$99/month',
    description: 'Our premier product with payment processing and CRM all in one',
    features: [
      { name: 'Payment processing integration', included: true },
      { name: 'Lower fees than Stripe', included: true },
      { name: 'Team accounts (instructors, admins, etc)', included: true },
      { name: 'Priority support (chat + email)', included: true },
      { name: 'Automated welcome flows for new students', included: true },
    ],
    button: {
      text: 'Upgrade Plan',
      disabled: false,
    },
  },
  {
    name: 'Enterprise',
    price: 'Set up a free exploratory call',
    description: 'All of the above plus custom branded experiences and more, get in touch!',
    features: [
      { name: 'Multi location dashboard', included: true },
      { name: 'Instructor analytics & performance tracking', included: true },
      { name: 'Full white labeling', included: true },
      { name: 'Dedicated onboarding & setup', included: true },
      { name: 'Premium customer support', included: true },
    ],
    button: {
      text: 'Contact Us',
      disabled: false,
    },
  },
];

const billingHistory = [
  { date: 'April 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '71MC01ANQ130', notes: '' },
  { date: 'March 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '8CJ19CAMGB10', notes: '' },
  { date: 'February 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'HCM1829NBAU', notes: '' },
  { date: 'January 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'CP120C72N72KA', notes: '' },
  { date: 'December 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '7621KCD721B92', notes: '' },
  { date: 'November 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD', notes: '' },
  { date: 'October 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD', notes: '' },
];

type SortField = 'date' | 'amount' | 'purpose' | 'method' | 'paymentId';
type SortDirection = 'asc' | 'desc';

export default function SubscriptionPage() {
  const t = useTranslations('SubscriptionPage');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBillingHistory = [...billingHistory].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'date':
        aValue = a.date.toLowerCase();
        bValue = b.date.toLowerCase();
        break;
      case 'amount':
        aValue = Number.parseFloat(a.amount.replace('$', '').replace(',', ''));
        bValue = Number.parseFloat(b.amount.replace('$', '').replace(',', ''));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Billing Cycle Toggle */}
      <ButtonGroupRoot value={billingCycle} onValueChange={setBillingCycle}>
        <ButtonGroupItem value="monthly">
          {t('monthly_button')}
        </ButtonGroupItem>
        <ButtonGroupItem value="annual">
          {t('annual_button')}
        </ButtonGroupItem>
      </ButtonGroupRoot>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <Card key={plan.name} className="flex flex-col p-6">
            <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
            {plan.price && <p className="mt-2 text-2xl font-bold text-foreground">{plan.price}</p>}
            <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>

            {/* Features List */}
            <div className="mt-6 flex-1 space-y-3">
              {plan.features.map(feature => (
                <div key={feature.name} className="flex items-start gap-3">
                  {feature.included
                    ? <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    : <X className="h-5 w-5 flex-shrink-0 text-gray-400" />}
                  <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Button className="mt-6 w-full" disabled={plan.button.disabled}>
              {plan.button.text}
            </Button>
          </Card>
        ))}
      </div>

      {/* Billing History Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{t('billing_history_heading')}</h2>

        {/* Billing History Table - Desktop View */}
        <Card className="hidden overflow-hidden lg:block">
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">{t('table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedBillingHistory.map(item => (
                  <tr key={`${item.date}-${item.amount}`} className="border-b border-border hover:bg-secondary/30">
                    <td className="px-6 py-4 text-sm text-foreground">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.amount}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{item.purpose}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.method}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.paymentId}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.notes}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">
                        ...
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Billing History Cards - Mobile View */}
        <div className="space-y-4 lg:hidden">
          {sortedBillingHistory.map(item => (
            <Card key={`${item.date}-${item.amount}`} className="p-4">
              <div className="space-y-4">
                {/* Header with Date and Amount */}
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('table_date')}</div>
                    <div className="mt-1 text-sm font-medium text-foreground">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-muted-foreground">{t('table_amount')}</div>
                    <div className="mt-1 text-sm font-medium text-foreground">{item.amount}</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('table_purpose')}</div>
                    <div className="mt-1 text-sm text-foreground">{item.purpose}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('table_method')}</div>
                    <div className="mt-1 text-sm text-foreground">{item.method}</div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{t('table_payment_id')}</div>
                    <div className="mt-1 text-sm text-foreground">{item.paymentId}</div>
                  </div>

                  {item.notes && (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">{t('table_notes')}</div>
                      <div className="mt-1 text-sm text-foreground">{item.notes}</div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="border-t border-border pt-4">
                  <Button variant="ghost" size="sm" className="w-full">
                    ...
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">{t('support_button')}</Button>
        <Button variant="destructive">{t('cancel_membership_button')}</Button>
      </div>
    </div>
  );
}
