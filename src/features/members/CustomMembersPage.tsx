'use client';

import { useOrganization } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { mockCoupons } from '@/features/marketing';
import { invalidateMembersCache, useMembersCache } from '@/hooks/useMembersCache';
import { MembersTable } from './MembersTable';
import { AddMemberModal } from './wizard/AddMemberModal';

export function CustomMembersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('Members');
  const { organization } = useOrganization();

  // Use intelligent caching hook with organization ID for proper cache invalidation
  const { members, loading } = useMembersCache(organization?.id);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const handleRowClick = useCallback((memberId: string) => {
    window.location.href = `/${locale}/dashboard/members/${memberId}/edit`;
  }, [locale]);

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
        onRowClickAction={handleRowClick}
        loading={loading}
        headerActions={(
          <Button onClick={() => setIsAddMemberModalOpen(true)}>
            <Plus className="mr-0.5 h-4 w-4" />
            {t('add_member_button')}
          </Button>
        )}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onCloseAction={handleAddMemberModalClose}
        availableCoupons={mockCoupons}
      />
    </>
  );
}
