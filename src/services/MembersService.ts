import { randomUUID } from 'node:crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { addressSchema, memberSchema } from '@/models/Schema';

type Address = {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type MemberWithCustomData = {
  id: string;
  firstName: string;
  lastName: string;
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
  address?: Address;
};

type CreateMemberInput = {
  id?: string;
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
    zipCode?: string;
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
 * Fetch organization members from database
 * @param organizationId - The organization ID
 * @returns Array of members from the database
 */
export async function getOrganizationMembers(
  organizationId: string,
): Promise<MemberWithCustomData[]> {
  // Fetch all members for the organization from the database
  const members = await db
    .select()
    .from(memberSchema)
    .where(eq(memberSchema.organizationId, organizationId));

  console.info('[MembersService] Fetched members from database:', {
    organizationId,
    count: members.length,
    memberIds: members.map(m => m.id),
  });

  // Fetch addresses for all members
  const memberIds = members.map(m => m.id);
  const addresses = memberIds.length > 0
    ? await db
        .select()
        .from(addressSchema)
        .where(inArray(addressSchema.memberId, memberIds))
    : [];

  // Create a map of member ID to address for quick lookup
  const addressMap = new Map<string, Address>();
  addresses.forEach((addr) => {
    if (addr.memberId && addr.isDefault) {
      addressMap.set(addr.memberId, {
        street: addr.street,
        apartment: undefined,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
      });
    }
  });

  return members.map(member => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone || null,
    dateOfBirth: member.dateOfBirth || null,
    photoUrl: member.photoUrl || null,
    memberType: member.memberType || null,
    subscriptionPlan: member.subscriptionPlan || null,
    lastAccessedAt: member.lastAccessedAt || null,
    status: member.status,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    create_organization_enabled: false, // Members table doesn't have admins
    address: addressMap.get(member.id),
  }));
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
      id: memberData.id || randomUUID(),
      organizationId,
    })
    .returning();

  // Create address record if address data is provided
  if (address && address.street && address.city && address.state && address.zipCode && result[0]) {
    await db
      .insert(addressSchema)
      .values({
        id: randomUUID(),
        memberId: result[0].id,
        type: 'home',
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
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
 * Update a member's status
 * @param memberId - The member ID to update
 * @param organizationId - The organization ID
 * @param status - The new status (active, hold, trial, cancelled, past due)
 * @returns The updated member record
 */
export function updateMemberStatus(memberId: string, organizationId: string, status: string) {
  return db
    .update(memberSchema)
    .set({
      status,
      statusChangedAt: new Date(),
    })
    .where(and(eq(memberSchema.id, memberId), eq(memberSchema.organizationId, organizationId)))
    .returning();
}
