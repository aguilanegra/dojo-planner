'use client';

import type { MembershipFilters } from '@/features/memberships/MembershipFilterBar';
import type { MembershipCardProps, MembershipStatus } from '@/templates/MembershipCard';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MembershipFilterBar } from '@/features/memberships/MembershipFilterBar';
import { MembershipCard } from '@/templates/MembershipCard';

type ProgramType = 'Adult' | 'Kids' | 'Women' | 'Competition';

type Membership = {
  id: string;
  name: string;
  category: string;
  program: ProgramType;
  status: MembershipStatus;
  isTrial?: boolean;
  price: string;
  signupFee: string;
  frequency: string;
  contract: string;
  access: string;
  activeCount: number;
  revenue: string;
};

const mockMemberships: Membership[] = [
  {
    id: '1',
    name: '12 Month Commitment (Gold)',
    category: 'Adult Brazilian Jiu-Jitsu',
    program: 'Adult',
    status: 'Active',
    price: '$150.00/mo',
    signupFee: '$35 signup fee',
    frequency: 'Monthly',
    contract: '12 Months',
    access: 'Unlimited',
    activeCount: 89,
    revenue: '$13,350/mo revenue',
  },
  {
    id: '2',
    name: 'Month to Month (Gold)',
    category: 'Adult Brazilian Jiu-Jitsu',
    program: 'Adult',
    status: 'Active',
    price: '$170.00/mo',
    signupFee: '$35 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: 'Unlimited',
    activeCount: 52,
    revenue: '$9,100/mo revenue',
  },
  {
    id: '3',
    name: '7-Day Free Trial',
    category: 'Adult Brazilian Jiu-Jitsu',
    program: 'Adult',
    status: 'Active',
    isTrial: true,
    price: 'Free',
    signupFee: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '3 Classes Total',
    activeCount: 23,
    revenue: '15 Converted This Month',
  },
  {
    id: '4',
    name: 'Kids Monthly',
    category: 'Kids Program',
    program: 'Kids',
    status: 'Active',
    price: '$95.00/mo',
    signupFee: '$25 signup fee',
    frequency: 'Monthly',
    contract: 'Month-to-Month',
    access: '8 Classes/mo',
    activeCount: 34,
    revenue: '$3,230/mo revenue',
  },
  {
    id: '5',
    name: 'Kids Free Trial Week',
    category: 'Kids Program',
    program: 'Kids',
    status: 'Active',
    isTrial: true,
    price: 'Free',
    signupFee: 'No signup fee',
    frequency: 'None',
    contract: '7 Days',
    access: '2 Classes Total',
    activeCount: 8,
    revenue: '6 Converted This Month',
  },
  {
    id: '6',
    name: 'Competition Team',
    category: 'Competition Team',
    program: 'Competition',
    status: 'Active',
    price: '$200.00/mo',
    signupFee: '$50 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeCount: 16,
    revenue: '$3,200/mo revenue',
  },
  {
    id: '7',
    name: '6 Month Commitment (Silver)',
    category: 'Adult Brazilian Jiu-Jitsu',
    program: 'Adult',
    status: 'Inactive',
    price: '$165.00/mo',
    signupFee: '$35 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeCount: 0,
    revenue: 'Discontinued',
  },
];

function handleEditMembership(_id: string) {
  // Placeholder for edit functionality - will be implemented when edit modal is added
}

export default function MembershipsPage() {
  const t = useTranslations('MembershipsPage');
  const [filters, setFilters] = useState<MembershipFilters>({
    search: '',
    tag: 'all',
    program: 'all',
  });

  // Get unique programs from mockMemberships
  const allPrograms = Array.from(
    new Set(mockMemberships.map(m => m.program)),
  );

  const stats = useMemo(() => ({
    totalMemberships: mockMemberships.length,
    active: mockMemberships.filter(m => m.status === 'Active' && !m.isTrial).length,
    trialOptions: mockMemberships.filter(m => m.isTrial).length,
    totalMembers: mockMemberships.reduce((sum, m) => sum + m.activeCount, 0),
  }), []);

  const filteredMemberships = useMemo(() => {
    return mockMemberships.filter((membership) => {
      // Search filter
      const matchesSearch = membership.name.toLowerCase().includes(filters.search.toLowerCase())
        || membership.category.toLowerCase().includes(filters.search.toLowerCase());

      // Tag filter (status/trial)
      let matchesTag = true;
      if (filters.tag !== 'all') {
        if (filters.tag === 'Trial') {
          matchesTag = !!membership.isTrial;
        } else if (filters.tag === 'Active') {
          matchesTag = membership.status === 'Active' && !membership.isTrial;
        } else if (filters.tag === 'Inactive') {
          matchesTag = membership.status === 'Inactive';
        }
      }

      // Program filter
      const matchesProgram = filters.program === 'all' || membership.program === filters.program;

      return matchesSearch && matchesTag && matchesProgram;
    });
  }, [filters]);

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_memberships_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalMemberships}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('active_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('trial_options_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.trialOptions}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('total_members_label')}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{stats.totalMembers}</div>
        </Card>
      </div>

      {/* Header with Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Filter Bar */}
          <div className="flex-1">
            <MembershipFilterBar
              onFiltersChange={setFilters}
              programs={allPrograms}
            />
          </div>

          {/* Add New Membership Button */}
          <Button>
            <Plus className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{t('add_new_membership_button')}</span>
          </Button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>

      {/* Memberships Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredMemberships.length === 0
          ? (
              <div className="col-span-full p-8 text-center text-muted-foreground">
                No memberships found
              </div>
            )
          : (
              filteredMemberships.map((membership) => {
                const cardProps: MembershipCardProps = {
                  id: membership.id,
                  name: membership.name,
                  category: membership.category,
                  status: membership.status,
                  isTrial: membership.isTrial,
                  price: membership.price,
                  signupFee: membership.signupFee,
                  frequency: membership.frequency,
                  contract: membership.contract,
                  access: membership.access,
                  activeCount: membership.activeCount,
                  revenue: membership.revenue,
                  onEdit: handleEditMembership,
                };

                return <MembershipCard key={membership.id} {...cardProps} />;
              })
            )}
      </div>
    </div>
  );
}
