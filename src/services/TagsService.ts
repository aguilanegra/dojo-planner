import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  classTagSchema,
  membershipTagSchema,
  tagSchema,
} from '@/models/Schema';

// =============================================================================
// TYPES
// =============================================================================

export type Tag = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  entityType: string;
  usageCount: number;
};

export type ClassTag = Tag & {
  classNames: string[];
};

export type MembershipTag = Tag & {
  membershipNames: string[];
};

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all class tags for an organization with usage counts
 */
export async function getClassTags(organizationId: string): Promise<ClassTag[]> {
  // Get all class tags
  const tags = await db
    .select()
    .from(tagSchema)
    .where(and(
      eq(tagSchema.organizationId, organizationId),
      eq(tagSchema.entityType, 'class'),
    ));

  if (tags.length === 0) {
    return [];
  }

  // Get usage counts for each tag using inArray instead of ANY
  const tagIds = tags.map(t => t.id);
  const usageCounts = await db
    .select({
      tagId: classTagSchema.tagId,
      count: sql<number>`cast(count(*) as integer)`,
    })
    .from(classTagSchema)
    .where(inArray(classTagSchema.tagId, tagIds))
    .groupBy(classTagSchema.tagId);

  const countMap = new Map(usageCounts.map(u => [u.tagId, u.count]));

  return tags.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    color: t.color,
    entityType: t.entityType,
    usageCount: countMap.get(t.id) || 0,
    classNames: [], // Would need additional join to populate
  }));
}

/**
 * Get all membership tags for an organization with usage counts
 */
export async function getMembershipTags(organizationId: string): Promise<MembershipTag[]> {
  // Get all membership tags
  const tags = await db
    .select()
    .from(tagSchema)
    .where(and(
      eq(tagSchema.organizationId, organizationId),
      eq(tagSchema.entityType, 'membership'),
    ));

  if (tags.length === 0) {
    return [];
  }

  // Get usage counts for each tag using inArray instead of ANY
  const tagIds = tags.map(t => t.id);
  const usageCounts = await db
    .select({
      tagId: membershipTagSchema.tagId,
      count: sql<number>`cast(count(*) as integer)`,
    })
    .from(membershipTagSchema)
    .where(inArray(membershipTagSchema.tagId, tagIds))
    .groupBy(membershipTagSchema.tagId);

  const countMap = new Map(usageCounts.map(u => [u.tagId, u.count]));

  return tags.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    color: t.color,
    entityType: t.entityType,
    usageCount: countMap.get(t.id) || 0,
    membershipNames: [], // Would need additional join to populate
  }));
}

/**
 * Get all tags for an organization
 */
export async function getAllTags(organizationId: string): Promise<Tag[]> {
  const tags = await db
    .select()
    .from(tagSchema)
    .where(eq(tagSchema.organizationId, organizationId));

  return tags.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    color: t.color,
    entityType: t.entityType,
    usageCount: 0, // Would need additional queries to populate
  }));
}
