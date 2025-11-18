'use client';

import { useOrganization } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MembersTable } from './MembersTable';

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

  const { memberships, organization, isLoaded } = useOrganization({
    memberships: {
      keepPreviousData: true,
    },
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !organization) {
      return;
    }

    const fetchMembersWithSubscription = async () => {
      try {
        // Fetch organization subscription data
        const subscriptionResponse = await fetch(
          `/${locale}/api/organization/${organization.id}/subscription`,
        );

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to fetch subscription data');
        }

        const { subscriptionType } = await subscriptionResponse.json();

        // Map Clerk memberships with organization subscription type
        const mappedMembers: Member[] = (memberships?.data || []).map(m => ({
          id: m.publicUserData?.userId || '',
          firstName: m.publicUserData?.firstName || null,
          lastName: m.publicUserData?.lastName || null,
          email: m.publicUserData?.identifier || '',
          phone: null,
          dateOfBirth: null,
          photoUrl: m.publicUserData?.imageUrl || null,
          lastAccessedAt: null,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          membershipType: subscriptionType as 'free' | 'free_trial' | 'monthly' | 'annual',
        }));

        setMembers(mappedMembers);
      } catch (error) {
        console.warn('Failed to fetch members with subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersWithSubscription();
  }, [isLoaded, locale, organization, memberships?.data]);

  const handleViewDetails = (memberId: string) => {
    console.warn('View details for member:', memberId);
  };

  // Render the table even while loading - it will show loading state internally
  // This ensures the page structure is visible immediately for tests and prevents timeouts
  return (
    <MembersTable
      members={members}
      onViewDetailsAction={handleViewDetails}
      loading={loading || !isLoaded}
    />
  );
}
