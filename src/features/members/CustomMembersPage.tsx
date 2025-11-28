'use client';

import { useOrganization } from '@clerk/nextjs';
import { Download, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { invalidateMembersCache, useMembersCache } from '@/hooks/useMembersCache';
import { client } from '@/libs/Orpc';
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
  const { organization } = useOrganization();

  // Use intelligent caching hook with organization ID for proper cache invalidation
  const { members: cachedMembers, loading: cacheLoading } = useMembersCache(organization?.id);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Handle enriching members with subscription type
  useEffect(() => {
    const enrichMembersWithSubscription = async () => {
      try {
        if (!cachedMembers || cachedMembers.length === 0) {
          setMembers(cachedMembers);
          setLoading(cacheLoading);
          return;
        }

        // Get organization ID from the member data or from auth context
        // For now, we'll skip subscription enrichment since members don't have org admin info
        setMembers(cachedMembers);
        setLoading(cacheLoading);
      } catch (error) {
        console.warn('CustomMembersPage - Error processing members:', error);
        setMembers(cachedMembers);
        setLoading(cacheLoading);
      }
    };

    enrichMembersWithSubscription();
  }, [cachedMembers, cacheLoading]);

  const handleEditMember = useCallback((memberId: string) => {
    // Navigate to member edit page
    window.location.href = `/${locale}/dashboard/members/${memberId}/edit`;
  }, [locale]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    try {
      await client.member.remove({ id: memberId });
      invalidateMembersCache();
    } catch (error) {
      console.error('[Members] Failed to flag member for deletion:', error);
    }
  }, []);

  const handleRestoreMember = useCallback(async (memberId: string) => {
    try {
      await client.member.restore({ id: memberId });
      invalidateMembersCache();
    } catch (error) {
      console.error('[Members] Failed to restore member:', error);
    }
  }, []);

  const handleAddMemberModalClose = useCallback(() => {
    setIsAddMemberModalOpen(false);
    // Invalidate cache when modal closes (member was likely added)
    invalidateMembersCache();
  }, []);

  // Render the table with intelligent caching
  // Shows loading state while data is being fetched from cache
  return (
    <>
      <MembersTable
        members={members}
        onEditAction={handleEditMember}
        onRemoveAction={handleRemoveMember}
        onRestoreAction={handleRestoreMember}
        loading={loading || cacheLoading}
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
