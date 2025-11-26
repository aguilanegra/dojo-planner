'use client';

import { useOrganization } from '@clerk/nextjs';
import { Download, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { invalidateMembersCache, useMembersCache } from '@/hooks/useMembersCache';
import { MembersTable } from './MembersTable';
import { AddMemberModal } from './wizard/AddMemberModal';

type Member = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  photoUrl: string | null;
  lastAccessedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  create_organization_enabled?: boolean;
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  amountDue?: string;
  nextPayment?: Date;
};

export function CustomMembersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('Members');

  const { organization, isLoaded } = useOrganization({
    memberships: {
      keepPreviousData: true,
    },
  });

  // Use intelligent caching hook
  const { members: cachedMembers, loading: cacheLoading } = useMembersCache(organization?.id);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  // Handle enriching members with subscription type
  useEffect(() => {
    const enrichMembersWithSubscription = async () => {
      try {
        if (!cachedMembers || cachedMembers.length === 0 || !organization) {
          setMembers(cachedMembers);
          setLoading(cacheLoading);
          return;
        }

        // Fetch organization subscription data
        const subscriptionResponse = await fetch(
          `/${locale}/api/organization/${organization.id}/subscription`,
        );

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to fetch subscription data');
        }

        const { subscriptionType } = await subscriptionResponse.json();

        // Filter out admins (create_organization_enabled === true) and enrich remaining members with subscription type
        const nonAdminMembers = cachedMembers.filter(member => member.create_organization_enabled !== true);
        const enrichedMembers: Member[] = nonAdminMembers.map(member => ({
          ...member,
          membershipType: subscriptionType as 'free' | 'free_trial' | 'monthly' | 'annual',
        }));

        setMembers(enrichedMembers);
        setLoading(cacheLoading);
      } catch (error) {
        // Check if this is a permission error (403 Forbidden)
        if (error instanceof Error && error.message.includes('403')) {
          setHasPermission(false);
          setLoading(false);
          return;
        }
        // If subscription fetch fails, filter out admins and use cached members without subscription type
        console.warn('CustomMembersPage - Failed to fetch subscription:', error);
        const nonAdminMembers = cachedMembers.filter(member => member.create_organization_enabled !== true);
        setMembers(nonAdminMembers);
        setLoading(cacheLoading);
      }
    };

    enrichMembersWithSubscription();
  }, [cachedMembers, cacheLoading, organization, locale]);

  const handleEditMember = useCallback((memberId: string) => {
    // Navigate to member edit page
    window.location.href = `/${locale}/dashboard/members/${memberId}/edit`;
  }, [locale]);

  const handleRemoveMember = useCallback((memberId: string) => {
    // TODO: Implement member removal logic
    console.warn('[Members] Remove member action triggered for member ID:', memberId);
  }, []);

  const handleAddMemberModalClose = useCallback(() => {
    setIsAddMemberModalOpen(false);
    // Invalidate cache when modal closes (member was likely added)
    invalidateMembersCache();
  }, []);

  // Show permission error if user is not an organization admin
  if (!hasPermission) {
    return (
      <div className="rounded-lg border border-border bg-background p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">{t('access_denied_title')}</h2>
        <p className="mt-2 text-muted-foreground">
          {t('access_denied_message')}
        </p>
      </div>
    );
  }

  // Render the table with intelligent caching
  // Shows loading state while data is being fetched from cache
  return (
    <>
      <MembersTable
        members={members}
        onEditAction={handleEditMember}
        onRemoveAction={handleRemoveMember}
        loading={loading || !isLoaded || cacheLoading}
        headerActions={(
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-0.5 h-4 w-4" />
              {t('import_members_button')}
            </Button>
            <Button onClick={() => setIsAddMemberModalOpen(true)}>
              <Plus className="mr-0.5 h-4 w-4" />
              {t('add_member_button')}
            </Button>
          </div>
        )}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onCloseAction={handleAddMemberModalClose}
      />
    </>
  );
}
