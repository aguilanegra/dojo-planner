import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { memberSchema } from '@/models/Schema';

type MemberWithCustomData = {
  id: string; // Clerk user ID
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
};

/**
 * Fetch organization members from Clerk and merge with custom member data
 * @param organizationId - The Clerk organization ID
 * @returns Array of members with both Clerk data and custom database data
 */
export async function getOrganizationMembers(
  organizationId: string,
): Promise<MemberWithCustomData[]> {
  // Fetch memberships from Clerk
  const client = await clerkClient();
  const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId,
  });

  const members = memberships.data || [];

  if (!members || members.length === 0) {
    return [];
  }

  // Extract user IDs to fetch custom data
  const userIds = members
    .map(m => m.publicUserData?.userId)
    .filter((id): id is string => Boolean(id));

  // Fetch custom member data from database
  const customMemberData = userIds.length > 0
    ? await db.select().from(memberSchema)
    : [];

  // Create a map of custom member data by user ID
  const customDataMap = new Map(
    customMemberData.map(member => [member.id, member]),
  );

  // Merge Clerk data with custom database data
  return members.map((clerkMember) => {
    const userId = clerkMember.publicUserData?.userId;
    const customData = userId ? customDataMap.get(userId) : null;

    return {
      id: userId || '',
      firstName: clerkMember.publicUserData?.firstName || null,
      lastName: clerkMember.publicUserData?.lastName || null,
      email: clerkMember.publicUserData?.identifier || '',
      phone: customData?.phone || null,
      dateOfBirth: customData?.dateOfBirth || null,
      photoUrl: customData?.photoUrl || null,
      lastAccessedAt: customData?.lastAccessedAt || null,
      status: customData?.status || 'active',
      createdAt: customData?.createdAt || new Date(),
      updatedAt: customData?.updatedAt || new Date(),
    };
  });
}
