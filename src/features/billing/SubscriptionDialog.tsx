'use client';

import { ArrowDownAZ, ArrowUpZA, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

// Test data - these are mock payment IDs for demonstration purposes
const billingHistory = [
  { date: 'April 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '71MC01ANQ130', notes: '' },
  { date: 'March 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '8CJ19CAMGB10', notes: '' },
  { date: 'February 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'HCM1829NBAU', notes: '' },
  { date: 'January 15, 2025', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: 'CP120C72N72KA', notes: '' },
  { date: 'December 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '7621KCD721B92', notes: '' },
  { date: 'November 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD', notes: '' },
  { date: 'October 15, 2024', amount: '$160.00', purpose: 'Membership Dues', method: 'Saved Card Ending ••••1234', paymentId: '73VBSV6DKSVD1', notes: '' },
];

type SortField = 'date' | 'amount' | 'purpose' | 'method' | 'paymentId';
type SortDirection = 'asc' | 'desc';

type SubscriptionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6">
          {/* Billing Cycle Toggle */}
          <ButtonGroupRoot value={billingCycle} onValueChange={setBillingCycle} className="w-full">
            <ButtonGroupItem value="monthly" className="flex-1">
              {t('monthly_button')}
            </ButtonGroupItem>
            <ButtonGroupItem value="annual" className="flex-1">
              {t('annual_button')}
            </ButtonGroupItem>
          </ButtonGroupRoot>

          {/* Pricing Cards - Always stack on smaller screens, side by side on larger */}
          <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
            {plans.map(plan => (
              <Card key={plan.name} className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2 lg:flex-col lg:items-stretch">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    {plan.price && <p className="mt-1 text-base font-bold text-foreground">{plan.price}</p>}
                  </div>
                  <Button
                    className="shrink-0 lg:mt-3 lg:w-full"
                    size="sm"
                    disabled={plan.button.disabled}
                  >
                    {plan.button.text}
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{plan.description}</p>

                {/* Features List - Collapsible on mobile, always visible on desktop */}
                <div className="mt-3 space-y-1.5">
                  {plan.features.map(feature => (
                    <div key={feature.name} className="flex items-start gap-2">
                      {feature.included
                        ? <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                        : <X className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                      <span className={`text-xs leading-tight ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Billing History Section */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">{t('billing_history_heading')}</h2>

            {/* Billing History - Card-based for all screen sizes */}
            <div className="space-y-2">
              {sortedBillingHistory.map(item => (
                <Card key={item.paymentId} className="p-3">
                  <div className="space-y-2">
                    {/* Header Row - Date, Amount, Purpose */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleSort('date')}
                          className="text-sm font-medium text-foreground hover:text-foreground/80"
                        >
                          {item.date}
                          {sortField === 'date' && (
                            <span className="ml-1 inline-block">
                              {sortDirection === 'asc' ? <ArrowDownAZ className="inline h-3 w-3" /> : <ArrowUpZA className="inline h-3 w-3" />}
                            </span>
                          )}
                        </button>
                        <span className="text-sm font-semibold text-foreground">{item.amount}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.purpose}</span>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="truncate">{item.method}</span>
                      <span className="font-mono">{item.paymentId}</span>
                    </div>

                    {/* Notes (if any) */}
                    {item.notes && (
                      <div className="text-xs text-muted-foreground">
                        {t('table_notes')}
                        :
                        {item.notes}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">{t('support_button')}</Button>
            <Button variant="destructive" size="sm" className="w-full sm:w-auto">{t('cancel_membership_button')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
