import { eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  eventBillingSchema,
  eventSchema,
  eventSessionSchema,
  eventTagSchema,
  tagSchema,
} from '@/models/Schema';

// =============================================================================
// TYPES
// =============================================================================

export type EventSession = {
  id: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  instructorClerkId: string | null;
};

export type EventBilling = {
  id: string;
  name: string;
  price: number;
  memberOnly: boolean | null;
  validUntil: Date | null;
};

export type EventTag = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

export type EventData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  eventType: string;
  maxCapacity: number | null;
  isActive: boolean | null;
  tags: EventTag[];
  sessions: EventSession[];
  billing: EventBilling[];
};

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all events for an organization with their sessions, billing, and tags
 */
export async function getOrganizationEvents(organizationId: string): Promise<EventData[]> {
  // Fetch all events for the organization
  const events = await db
    .select()
    .from(eventSchema)
    .where(eq(eventSchema.organizationId, organizationId));

  if (events.length === 0) {
    return [];
  }

  const eventIds = events.map(e => e.id);

  // Fetch related data in parallel
  const [sessions, billings, eventTags, allTags] = await Promise.all([
    // Fetch event sessions
    db.select().from(eventSessionSchema).where(inArray(eventSessionSchema.eventId, eventIds)),

    // Fetch event billing
    db.select().from(eventBillingSchema).where(inArray(eventBillingSchema.eventId, eventIds)),

    // Fetch event-tag relationships
    db.select().from(eventTagSchema).where(inArray(eventTagSchema.eventId, eventIds)),

    // Fetch all tags for the organization
    db.select().from(tagSchema).where(eq(tagSchema.organizationId, organizationId)),
  ]);

  // Create lookup maps
  const tagMap = new Map(allTags.map(t => [t.id, t]));

  // Group sessions by event
  const sessionsByEvent = new Map<string, EventSession[]>();
  sessions.forEach((session) => {
    const existing = sessionsByEvent.get(session.eventId) || [];
    existing.push({
      id: session.id,
      sessionDate: session.sessionDate,
      startTime: session.startTime,
      endTime: session.endTime,
      instructorClerkId: session.primaryInstructorClerkId,
    });
    sessionsByEvent.set(session.eventId, existing);
  });

  // Group billing by event
  const billingByEvent = new Map<string, EventBilling[]>();
  billings.forEach((billing) => {
    const existing = billingByEvent.get(billing.eventId) || [];
    existing.push({
      id: billing.id,
      name: billing.name,
      price: billing.price,
      memberOnly: billing.memberOnly,
      validUntil: billing.validUntil,
    });
    billingByEvent.set(billing.eventId, existing);
  });

  // Group tags by event
  const tagsByEvent = new Map<string, EventTag[]>();
  eventTags.forEach((et) => {
    const tag = tagMap.get(et.tagId);
    if (tag) {
      const existing = tagsByEvent.get(et.eventId) || [];
      existing.push({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
      });
      tagsByEvent.set(et.eventId, existing);
    }
  });

  // Map events with all related data
  return events.map(event => ({
    id: event.id,
    name: event.name,
    slug: event.slug,
    description: event.description,
    eventType: event.eventType,
    maxCapacity: event.maxCapacity,
    isActive: event.isActive,
    tags: tagsByEvent.get(event.id) || [],
    sessions: sessionsByEvent.get(event.id) || [],
    billing: billingByEvent.get(event.id) || [],
  }));
}

/**
 * Get a single event by ID
 */
export async function getEventById(eventId: string, organizationId: string): Promise<EventData | null> {
  const events = await getOrganizationEvents(organizationId);
  return events.find(e => e.id === eventId) || null;
}
