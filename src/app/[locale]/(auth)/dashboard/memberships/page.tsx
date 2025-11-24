'use client';

import { ChevronDown, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Membership = {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Trial';
  trialType?: 'Trial';
  price: string;
  signup: string;
  frequency: string;
  contract: string;
  access: string;
  activeMembers: number;
  revenue: string;
  trials?: number;
  converted?: number;
  discontinued?: string;
};

const mockMemberships: Membership[] = [
  {
    id: '1',
    name: '12 Month Commitment (Gold)',
    category: 'Adult Brazilian Jiu-Jltsu',
    status: 'Active',
    price: '$150.00/mo',
    signup: '$35 signup fee',
    frequency: 'Monthly',
    contract: '12 Months',
    access: 'Unlimited',
    activeMembers: 89,
    revenue: '$13,350/mo revenue',
  },
  {
    id: '2',
    name: 'Month to Month (Gold)',
    category: 'Adult Brazilian Jiu-Jltsu',
    status: 'Active',
    price: '$170.00/mo',
    signup: '$35 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: 'Unlimited',
    activeMembers: 52,
    revenue: '$9,100/mo revenue',
  },
  {
    id: '3',
    name: '7-Day Free Trial',
    category: 'Adult Brazilian Jiu-Jltsu',
    status: 'Active',
    trialType: 'Trial',
    price: 'Free',
    signup: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '3 Classes Total',
    activeMembers: 23,
    revenue: '15 Converted This Month',
    trials: 23,
  },
  {
    id: '4',
    name: 'Kids Monthly',
    category: 'Kids Program',
    status: 'Active',
    price: '$95.00/mo',
    signup: '$25 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: '8 Classes/mo',
    activeMembers: 34,
    revenue: '$3,230/mo revenue',
  },
  {
    id: '5',
    name: 'Kids Free Trial Week',
    category: 'Adult Brazilian Jiu-Jltsu',
    status: 'Active',
    trialType: 'Trial',
    price: 'Free',
    signup: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '2 Classes Total',
    activeMembers: 8,
    revenue: '6 Converted This Month',
    trials: 8,
  },
  {
    id: '6',
    name: 'Competition Team',
    category: 'Competition Team',
    status: 'Active',
    price: '$200.00/mo',
    signup: '$50 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeMembers: 16,
    revenue: '$3,200/mo revenue',
  },
  {
    id: '7',
    name: '6 Month Commitment (Silver)',
    category: 'Adult Brazilian Jiu-Jltsu',
    status: 'Inactive',
    price: '$165.00/mo',
    signup: '$35 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeMembers: 0,
    revenue: 'Discontinued',
  },
];

function getStatusBadge(status: string, trialType?: string) {
  if (status === 'Active') {
    if (trialType === 'Trial') {
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>;
    }
    return <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>;
  }
  if (status === 'Inactive') {
    return <Badge className="bg-red-500 text-white hover:bg-red-600">Inactive</Badge>;
  }
  return <Badge>{status}</Badge>;
}

export default function MembershipsPage() {
  const t = useTranslations('MembershipsPage');

  const stats = [
    { label: t('total_memberships_label'), value: '12' },
    { label: t('active_label'), value: '9' },
    { label: t('trial_options_label'), value: '3' },
    { label: t('total_members_label'), value: '247' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Statistics */}
      <div className="flex gap-8">
        {stats.map(stat => (
          <div key={stat.label}>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
        >
          {t('status_filter')}
          <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
        >
          {t('programs_filter')}
          <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
        >
          {t('types_filter')}
          <ChevronDown className="h-4 w-4" />
        </button>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_new_membership_button')}
        </Button>
      </div>

      {/* Memberships Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mockMemberships.map(membership => (
          <Card key={membership.id} className="p-6">
            <div className="space-y-4">
              {/* Header with Title and Badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{membership.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{membership.category}</p>
                </div>
                <div>
                  {getStatusBadge(membership.status, membership.trialType)}
                  {membership.trialType && <Badge className="ml-2 bg-amber-500 text-gray-900 hover:bg-amber-600">Trial</Badge>}
                </div>
              </div>

              {/* Price and Signup */}
              <div>
                <p className="text-2xl font-bold text-foreground">{membership.price}</p>
                <p className="text-sm text-muted-foreground">{membership.signup}</p>
              </div>

              {/* Details Grid */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('frequency_label')}</span>
                  <span className="text-sm font-medium text-foreground">{membership.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('contract_label')}</span>
                  <span className="text-sm font-medium text-foreground">{membership.contract}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('access_label')}</span>
                  <span className="text-sm font-medium text-foreground">{membership.access}</span>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">
                  {membership.activeMembers}
                  {' '}
                  {membership.trials ? 'Active Trials' : 'Active Members'}
                </p>
                <p className="text-sm text-muted-foreground">{membership.revenue}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
