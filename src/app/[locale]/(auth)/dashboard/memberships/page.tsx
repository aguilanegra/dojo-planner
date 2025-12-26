'use client';

import type { AvailableTag, MembershipFilters } from '@/features/memberships/MembershipFilterBar';
import type { MembershipCardProps, MembershipStatus } from '@/templates/MembershipCard';
import { Plus, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MembershipFilterBar } from '@/features/memberships/MembershipFilterBar';
import { MembershipTagsManagement } from '@/features/memberships/MembershipTagsManagement';
import { AddMembershipModal } from '@/features/memberships/wizard/AddMembershipModal';
import { MembershipCard } from '@/templates/MembershipCard';
import { StatsCards } from '@/templates/StatsCards';

type ProgramType = 'Adult' | 'Kids' | 'Women' | 'Competition';

type Membership = {
  id: string;
  name: string;
  category: string;
  program: ProgramType;
  status: MembershipStatus;
  isTrial?: boolean;
  isMonthly?: boolean;
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
    isMonthly: true,
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
    isMonthly: true,
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
    isMonthly: true,
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
    isMonthly: true,
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
    isMonthly: true,
    price: '$165.00/mo',
    signupFee: '$35 signup fee',
    frequency: 'Monthly',
    contract: '6 Months',
    access: 'Unlimited',
    activeCount: 0,
    revenue: 'Discontinued',
  },
];

export default function MembershipsPage() {
  const t = useTranslations('MembershipsPage');
  const router = useRouter();
  const [isTagsSheetOpen, setIsTagsSheetOpen] = useState(false);
  const [isAddMembershipModalOpen, setIsAddMembershipModalOpen] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [filters, setFilters] = useState<MembershipFilters>({
    search: '',
    tag: 'all',
    program: 'all',
  });

  const handleEditMembership = useCallback((id: string) => {
    router.push(`/dashboard/memberships/${id}`);
  }, [router]);

  const handleMembershipCreated = useCallback((newMembership: MembershipCardProps) => {
    const membership: Membership = {
      id: newMembership.id,
      name: newMembership.name,
      category: newMembership.category,
      program: 'Adult', // Default program for new memberships
      status: newMembership.status,
      isTrial: newMembership.isTrial,
      isMonthly: newMembership.isMonthly,
      price: newMembership.price,
      signupFee: newMembership.signupFee,
      frequency: newMembership.frequency,
      contract: newMembership.contract,
      access: newMembership.access,
      activeCount: newMembership.activeCount,
      revenue: newMembership.revenue,
    };
    setMemberships(prev => [membership, ...prev]);
  }, []);

  // Get unique programs from memberships
  const allPrograms = Array.from(
    new Set(memberships.map(m => m.program)),
  );

  const stats = useMemo(() => ({
    totalMemberships: memberships.length,
    active: memberships.filter(m => m.status === 'Active' && !m.isTrial).length,
    trialOptions: memberships.filter(m => m.isTrial).length,
    totalMembers: memberships.reduce((sum, m) => sum + m.activeCount, 0),
  }), [memberships]);

  // Helper function to get all tags for a membership
  const getMembershipTags = (membership: Membership): AvailableTag[] => {
    const tags: AvailableTag[] = [];
    if (membership.isTrial) {
      tags.push('Trial');
    }
    if (membership.status === 'Inactive') {
      tags.push('Inactive');
    }
    if (membership.status === 'Active' && !membership.isTrial) {
      tags.push('Active');
    }
    if (membership.isMonthly) {
      tags.push('Monthly');
    }
    return tags;
  };

  // Helper function to check if membership matches tag filter
  const matchesTagFilter = (membership: Membership, tag: string): boolean => {
    if (tag === 'all') {
      return true;
    }
    if (tag === 'Trial') {
      return !!membership.isTrial;
    }
    if (tag === 'Active') {
      return membership.status === 'Active' && !membership.isTrial;
    }
    if (tag === 'Inactive') {
      return membership.status === 'Inactive';
    }
    if (tag === 'Monthly') {
      return !!membership.isMonthly;
    }
    return true;
  };

  // Helper function to check if membership matches search filter
  const matchesSearchFilter = (membership: Membership, search: string): boolean => {
    if (!search) {
      return true;
    }
    const searchLower = search.toLowerCase();
    return membership.name.toLowerCase().includes(searchLower)
      || membership.category.toLowerCase().includes(searchLower);
  };

  // Helper function to check if membership matches program filter
  const matchesProgramFilter = (membership: Membership, program: string): boolean => {
    return program === 'all' || membership.program === program;
  };

  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => {
      const matchesSearch = matchesSearchFilter(membership, filters.search);
      const matchesTag = matchesTagFilter(membership, filters.tag);
      const matchesProgram = matchesProgramFilter(membership, filters.program);
      return matchesSearch && matchesTag && matchesProgram;
    });
  }, [filters, memberships]);

  // Compute available tags based on memberships that match current search and program filters
  const availableTags = useMemo((): AvailableTag[] => {
    const membershipsMatchingOtherFilters = memberships.filter((membership) => {
      const matchesSearch = matchesSearchFilter(membership, filters.search);
      const matchesProgram = matchesProgramFilter(membership, filters.program);
      return matchesSearch && matchesProgram;
    });

    const tagsInResults = new Set<AvailableTag>();
    membershipsMatchingOtherFilters.forEach((membership) => {
      getMembershipTags(membership).forEach(tag => tagsInResults.add(tag));
    });

    return Array.from(tagsInResults);
  }, [filters.search, filters.program, memberships]);

  // Compute available programs based on memberships that match current search and tag filters
  const availablePrograms = useMemo((): string[] => {
    const membershipsMatchingOtherFilters = memberships.filter((membership) => {
      const matchesSearch = matchesSearchFilter(membership, filters.search);
      const matchesTag = matchesTagFilter(membership, filters.tag);
      return matchesSearch && matchesTag;
    });

    const programsInResults = new Set<string>();
    membershipsMatchingOtherFilters.forEach((membership) => {
      programsInResults.add(membership.program);
    });

    return Array.from(programsInResults);
  }, [filters.search, filters.tag, memberships]);

  const statsData = useMemo(() => [
    { id: 'memberships', label: t('total_memberships_label'), value: stats.totalMemberships },
    { id: 'active', label: t('active_label'), value: stats.active },
    { id: 'trials', label: t('trial_options_label'), value: stats.trialOptions },
    { id: 'members', label: t('total_members_label'), value: stats.totalMembers },
  ], [stats, t]);

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <StatsCards stats={statsData} columns={4} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <Button variant="outline" onClick={() => setIsTagsSheetOpen(true)}>
          <Tags className="mr-1 size-4" />
          {t('manage_tags_button')}
        </Button>
      </div>

      {/* Filter Bar and Add Button */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Filter Bar */}
          <div className="flex-1">
            <MembershipFilterBar
              onFiltersChangeAction={setFilters}
              programs={allPrograms}
              availableTags={availableTags}
              availablePrograms={availablePrograms}
            />
          </div>

          {/* Add New Membership Button */}
          <Button onClick={() => setIsAddMembershipModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{t('add_new_membership_button')}</span>
          </Button>
        </div>
      </div>

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
                  isMonthly: membership.isMonthly,
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

      {/* Membership Tags Management Sheet */}
      <MembershipTagsManagement
        open={isTagsSheetOpen}
        onOpenChange={setIsTagsSheetOpen}
      />

      {/* Add Membership Modal */}
      <AddMembershipModal
        isOpen={isAddMembershipModalOpen}
        onCloseAction={() => setIsAddMembershipModalOpen(false)}
        onMembershipCreated={handleMembershipCreated}
      />
    </div>
  );
}
