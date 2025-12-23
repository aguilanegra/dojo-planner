'use client';

import { ArrowDownAZ, ArrowUpZA, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroupItem, ButtonGroupRoot } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PlanFeature = {
  name: string;
  included: boolean;
};

type PlanButton = {
  text: string;
  disabled: boolean;
};

type Plan = {
  name: string;
  id: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  features: PlanFeature[];
  defaultButton: PlanButton;
};

// Mock current subscription - Basic Monthly
const currentPlan = {
  planId: 'basic',
  billingCycle: 'monthly',
};

const plans: Plan[] = [
  {
    name: 'Basic',
    id: 'basic',
    monthlyPrice: '$49 / month',
    annualPrice: '$29 / month',
    description: 'Just the Dojo Planner CRM without payment processing integration',
    features: [
      { name: 'Unlimited students & classes', included: true },
      { name: 'Digital attendance & student profiles', included: true },
      { name: 'Belt promotion & curriculum tracking', included: true },
      { name: 'Class calendar with RSVP', included: true },
      { name: 'No payment processing integration', included: false },
      { name: 'No team accounts', included: false },
    ],
    defaultButton: {
      text: 'Upgrade Plan',
      disabled: false,
    },
  },
  {
    name: 'Growth',
    id: 'growth',
    monthlyPrice: '$125 / month',
    annualPrice: '$99 / month',
    description: 'Our premier product with payment processing and CRM all in one',
    features: [
      { name: 'Payment processing integration', included: true },
      { name: 'Lower fees than Stripe', included: true },
      { name: 'Team accounts (instructors, admins, etc)', included: true },
      { name: 'Priority support (chat + email)', included: true },
      { name: 'Automated welcome flows for new students', included: true },
    ],
    defaultButton: {
      text: 'Upgrade Plan',
      disabled: false,
    },
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    monthlyPrice: 'Set up a free exploratory call',
    annualPrice: 'Set up a free exploratory call',
    description: 'All of the above plus custom branded experiences and more, get in touch!',
    features: [
      { name: 'Multi location dashboard', included: true },
      { name: 'Instructor analytics & performance tracking', included: true },
      { name: 'Full white labeling', included: true },
      { name: 'Dedicated onboarding & setup', included: true },
      { name: 'Premium customer support', included: true },
    ],
    defaultButton: {
      text: 'Contact Us',
      disabled: false,
    },
  },
];

function getPlanButton(plan: Plan, selectedBillingCycle: string): PlanButton {
  const isCurrentPlan = plan.id === currentPlan.planId && selectedBillingCycle === currentPlan.billingCycle;

  if (isCurrentPlan) {
    return {
      text: 'Current Plan',
      disabled: true,
    };
  }

  return plan.defaultButton;
}

// Test data - these are mock payment IDs for demonstration purposes
const billingHistory = [
  { date: 'April 15, 2025', amount: '$160.00', method: 'Card ending •••1234', paymentId: '71MC01ANQ130' },
  { date: 'March 15, 2025', amount: '$160.00', method: 'Card ending •••1234', paymentId: '8CJ19CAMGB10' },
  { date: 'February 15, 2025', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'HCM1829NBAU' },
  { date: 'January 15, 2025', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'CP120C72N72KA' },
  { date: 'December 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: '7621KCD721B92' },
  { date: 'November 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: '73VBSV6DKSVD' },
  { date: 'October 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: '73VBSV6DKSVD1' },
  { date: 'September 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'SEP24A1B2C3D' },
  { date: 'August 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'AUG24E4F5G6H' },
  { date: 'July 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JUL24I7J8K9L' },
  { date: 'June 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JUN24M0N1O2P' },
  { date: 'May 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'MAY24Q3R4S5T' },
  { date: 'April 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'APR24U6V7W8X' },
  { date: 'March 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'MAR24Y9Z0A1B' },
  { date: 'February 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'FEB24C2D3E4F' },
  { date: 'January 15, 2024', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JAN24G5H6I7J' },
  { date: 'December 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'DEC23K8L9M0N' },
  { date: 'November 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'NOV23O1P2Q3R' },
  { date: 'October 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'OCT23S4T5U6V' },
  { date: 'September 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'SEP23W7X8Y9Z' },
  { date: 'August 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'AUG23A0B1C2D' },
  { date: 'July 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JUL23E3F4G5H' },
  { date: 'June 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JUN23I6J7K8L' },
  { date: 'May 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'MAY23M9N0O1P' },
  { date: 'April 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'APR23Q2R3S4T' },
  { date: 'March 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'MAR23U5V6W7X' },
  { date: 'February 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'FEB23Y8Z9A0B' },
  { date: 'January 15, 2023', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JAN23C1D2E3F' },
  { date: 'December 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'DEC22G4H5I6J' },
  { date: 'November 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'NOV22K7L8M9N' },
  { date: 'October 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'OCT22O0P1Q2R' },
  { date: 'September 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'SEP22S3T4U5V' },
  { date: 'August 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'AUG22W6X7Y8Z' },
  { date: 'July 15, 2022', amount: '$160.00', method: 'Card ending •••1234', paymentId: 'JUL22A9B0C1D' },
];

type SortDirection = 'asc' | 'desc';

type SubscriptionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const t = useTranslations('SubscriptionPage');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedBillingHistory = [...billingHistory].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
  });

  const totalPages = Math.ceil(sortedBillingHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBillingHistory = sortedBillingHistory.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

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
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan.planId && billingCycle === currentPlan.billingCycle;
              return (
                <Card key={plan.name} className={`flex flex-col p-4 ${isCurrentPlan ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}`}>
                  <div className="flex items-start justify-between gap-2 lg:flex-col lg:items-stretch">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      <p className="mt-1 text-base font-bold text-foreground">{billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</p>
                    </div>
                    <Button
                      className="shrink-0 lg:mt-3 lg:w-full"
                      size="sm"
                      disabled={getPlanButton(plan, billingCycle).disabled}
                    >
                      {getPlanButton(plan, billingCycle).text}
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
              );
            })}
          </div>

          {/* Billing History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t('billing_history_heading')}</h2>
              <button
                type="button"
                onClick={handleSort}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {sortDirection === 'asc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
              </button>
            </div>

            {/* Billing History - Card-based for all screen sizes */}
            <div className="space-y-2">
              {paginatedBillingHistory.map(item => (
                <Card key={item.paymentId} className="px-3 py-2">
                  <div className="flex items-center text-sm">
                    <span className="w-1/3 font-medium text-foreground">{item.date}</span>
                    <span className="w-1/3 text-muted-foreground">{item.method}</span>
                    <span className="w-1/3 text-right font-mono text-muted-foreground">{item.paymentId}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">
                  Page
                  {' '}
                  {currentPage}
                  {' '}
                  of
                  {' '}
                  {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
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
