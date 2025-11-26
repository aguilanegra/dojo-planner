import { randomUUID } from 'node:crypto';
import { clerkClient } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { addressSchema, memberSchema } from '@/models/Schema';

type MemberWithCustomData = {
  id: string; // Clerk user ID
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  photoUrl: string | null;
  memberType: string | null;
  subscriptionPlan: string | null;
  lastAccessedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  create_organization_enabled?: boolean;
};

type CreateMemberInput = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  memberType?: string;
  subscriptionPlan?: string;
  photoUrl?: string;
  status: string;
  address?: {
    street?: string;
    apartment?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

type UpdateMemberInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  photoUrl?: string;
  memberType?: string;
  subscriptionPlan?: string;
  dateOfBirth?: Date;
  lastAccessedAt?: Date;
  status: string;
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
    // Check if user is an organization admin via the 'org:admin' role from Clerk
    const isAdmin = clerkMember.role === 'org:admin';

    return {
      id: userId || '',
      firstName: clerkMember.publicUserData?.firstName || null,
      lastName: clerkMember.publicUserData?.lastName || null,
      email: clerkMember.publicUserData?.identifier || '',
      phone: customData?.phone || null,
      dateOfBirth: customData?.dateOfBirth || null,
      photoUrl: clerkMember.publicUserData?.imageUrl || null,
      memberType: customData?.memberType || null,
      subscriptionPlan: customData?.subscriptionPlan || null,
      lastAccessedAt: customData?.lastAccessedAt || null,
      status: customData?.status || 'active',
      createdAt: customData?.createdAt || new Date(),
      updatedAt: customData?.updatedAt || new Date(),
      create_organization_enabled: isAdmin,
    };
  });
}

/**
 * Create a new member in the database and optional address record
 * @param member - Member data to create
 * @param organizationId - The organization ID
 * @returns The created member record
 */
export async function createMember(member: CreateMemberInput, organizationId: string) {
  const { address, ...memberData } = member;

  const result = await db
    .insert(memberSchema)
    .values({
      ...memberData,
      organizationId,
    })
    .returning();

  // Create address record if address data is provided
  if (address && (address.street || address.city || address.state) && result[0]) {
    await db
      .insert(addressSchema)
      .values({
        id: randomUUID(),
        memberId: result[0].id,
        type: 'home',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: '', // Not collected in wizard
        country: address.country || 'US',
        isDefault: true,
      })
      .returning();
  }

  return result;
}

/**
 * Update an existing member
 * @param member - Partial member data to update
 * @param organizationId - The organization ID
 * @returns The updated member record
 */
export function updateMember(member: UpdateMemberInput, organizationId: string) {
  return db
    .update(memberSchema)
    .set(member)
    .where(and(eq(memberSchema.id, member.id), eq(memberSchema.organizationId, organizationId)))
    .returning();
}

/**
 * Delete a member
 * @param memberId - The member ID to delete
 * @param organizationId - The organization ID
 * @returns The deleted member record
 */
export function deleteMember(memberId: string, organizationId: string) {
  return db
    .delete(memberSchema)
    .where(and(eq(memberSchema.id, memberId), eq(memberSchema.organizationId, organizationId)))
    .returning();
}
