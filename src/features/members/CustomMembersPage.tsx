'use client';

import { useOrganization } from '@clerk/nextjs';
import { Download, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
  membershipType?: 'free' | 'free_trial' | 'monthly' | 'annual';
  amountDue?: string;
  nextPayment?: Date;
};

export function CustomMembersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('Members');

  const { memberships, organization, isLoaded } = useOrganization({
    memberships: {
      keepPreviousData: true,
    },
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!organization) {
      return;
    }

    const fetchMembersWithDetails = async () => {
      try {
        // Fetch organization subscription data
        const subscriptionResponse = await fetch(
          `/${locale}/api/organization/${organization.id}/subscription`,
        );

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to fetch subscription data');
        }

        const { subscriptionType } = await subscriptionResponse.json();

        // Try to fetch detailed member data from the server
        let detailedMembers: Array<{
          id: string;
          phone: string | null;
          dateOfBirth: Date | null;
          lastAccessedAt: Date | null;
          status: string;
          createdAt: Date;
          updatedAt: Date;
        }> = [];

        try {
          const membersData = await client.members.list();
          // members.list returns { members: [...] }
          detailedMembers = (membersData.members || []) as typeof detailedMembers;
        } catch (error) {
          // Check if this is a permission error (403 Forbidden)
          if (error instanceof Error && error.message.includes('403')) {
            setHasPermission(false);
            setLoading(false);
            return;
          }
          // If detailed fetch fails for other reasons, just continue with empty detailedMembers
          // This ensures members still display even if the detailed data fetch fails
          console.warn('Failed to fetch detailed member data, displaying basic info');
        }

        // Create a map of detailed member data by ID
        const detailedMemberMap = new Map(
          detailedMembers.map(m => [m.id, m]),
        );

        // Map Clerk memberships with detailed member data and subscription type
        const mappedMembers: Member[] = (memberships?.data || []).map((m) => {
          const userId = m.publicUserData?.userId || '';
          const detailedData = detailedMemberMap.get(userId);

          return {
            id: userId,
            firstName: m.publicUserData?.firstName || null,
            lastName: m.publicUserData?.lastName || null,
            email: m.publicUserData?.identifier || '',
            phone: detailedData?.phone || null,
            dateOfBirth: detailedData?.dateOfBirth || null,
            photoUrl: m.publicUserData?.imageUrl || null,
            lastAccessedAt: detailedData?.lastAccessedAt || null,
            status: detailedData?.status || 'active',
            createdAt: detailedData?.createdAt || new Date(),
            updatedAt: detailedData?.updatedAt || new Date(),
            membershipType: subscriptionType as 'free' | 'free_trial' | 'monthly' | 'annual',
          };
        });

        setMembers(mappedMembers);
      } catch (error) {
        console.warn('CustomMembersPage - Failed to fetch members with subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersWithDetails();
  }, [isLoaded, locale, organization, memberships?.data]);

  const handleViewDetails = (memberId: string) => {
    console.warn('View details for member:', memberId);
  };

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

  // Render the table even while loading - it will show loading state internally
  // This ensures the page structure is visible immediately for tests and prevents timeouts
  return (
    <>
      <MembersTable
        members={members}
        onViewDetailsAction={handleViewDetails}
        loading={loading || !isLoaded}
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
        onCloseAction={() => setIsAddMemberModalOpen(false)}
      />
    </>
  );
}
