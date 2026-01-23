/**
 * Database Seed Script
 *
 * Populates the database with sample data for development and testing.
 * Based on mock data from the codebase.
 *
 * Usage:
 *   npx tsx src/scripts/seed.ts              # Seed all organizations
 *   npx tsx src/scripts/seed.ts --orgId=org_xxx  # Seed specific organization
 *   npx tsx src/scripts/seed.ts --reset      # Clear and re-seed
 */

import { randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import {
  attendanceSchema,
  classEnrollmentSchema,
  classInstructorSchema,
  classScheduleExceptionSchema,
  classScheduleInstanceSchema,
  classSchema,
  classTagSchema,
  couponSchema,
  eventBillingSchema,
  eventSchema,
  eventSessionSchema,
  eventTagSchema,
  memberMembershipSchema,
  memberSchema,
  membershipPlanSchema,
  membershipTagSchema,
  organizationSchema,
  programSchema,
  tagSchema,
} from '../models/Schema';

// Parse command line arguments
const args = process.argv.slice(2);
const orgIdArg = args.find(arg => arg.startsWith('--orgId='));
const specificOrgId = orgIdArg ? orgIdArg.split('=')[1] : undefined;
const shouldReset = args.includes('--reset');

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
});
const db = drizzle({ client: pool });

// =============================================================================
// SEED DATA
// =============================================================================

// Programs (inferred from classes)
const programsData = [
  { name: 'Adult BJJ', slug: 'adult-bjj', description: 'Brazilian Jiu-Jitsu for adults', color: '#3b82f6' },
  { name: 'Kids Program', slug: 'kids-program', description: 'BJJ training for children', color: '#06b6d4' },
  { name: 'Competition Team', slug: 'competition-team', description: 'Training for competitors', color: '#a855f7' },
  { name: 'Special Programs', slug: 'special-programs', description: 'Women\'s classes and open mat', color: '#ec4899' },
];

// Class tags
const classTagsData = [
  { name: 'Event', slug: 'event', color: '#0ea5e9', entityType: 'class' },
  { name: 'Beginner', slug: 'beginner', color: '#22c55e', entityType: 'class' },
  { name: 'Advanced', slug: 'advanced', color: '#ef4444', entityType: 'class' },
  { name: 'Adults', slug: 'adults', color: '#3b82f6', entityType: 'class' },
  { name: 'Kids', slug: 'kids', color: '#06b6d4', entityType: 'class' },
  { name: 'Gi', slug: 'gi', color: '#8b5cf6', entityType: 'class' },
  { name: 'No-Gi', slug: 'no-gi', color: '#f97316', entityType: 'class' },
  { name: 'Intermediate', slug: 'intermediate', color: '#eab308', entityType: 'class' },
  { name: 'Competition', slug: 'competition', color: '#ec4899', entityType: 'class' },
];

// Membership tags
const membershipTagsData = [
  { name: 'Active', slug: 'active', color: '#22c55e', entityType: 'membership' },
  { name: 'Trial', slug: 'trial', color: '#f59e0b', entityType: 'membership' },
  { name: 'Inactive', slug: 'inactive', color: '#ef4444', entityType: 'membership' },
  { name: 'Monthly', slug: 'monthly', color: '#3b82f6', entityType: 'membership' },
  { name: 'Punchcard', slug: 'punchcard', color: '#8b5cf6', entityType: 'membership' },
];

// Classes data
const classesData = [
  {
    name: 'BJJ Fundamentals I',
    slug: 'bjj-fundamentals-i',
    description: 'Covers core positions, escapes, and submissions. Ideal for students in their first 6 months.',
    color: '#22c55e',
    programSlug: 'adult-bjj',
    defaultDurationMinutes: 60,
    tags: ['beginner', 'adults', 'gi'],
    schedule: [
      { dayOfWeek: 1, startTime: '06:00', endTime: '07:00' }, // Monday 6 AM
      { dayOfWeek: 3, startTime: '06:00', endTime: '07:00' }, // Wednesday 6 AM
      { dayOfWeek: 5, startTime: '18:00', endTime: '19:00' }, // Friday 6 PM
    ],
  },
  {
    name: 'BJJ Fundamentals II',
    slug: 'bjj-fundamentals-ii',
    description: 'Learn core BJJ techniques like sweeps, submissions, and escapes.',
    color: '#22c55e',
    programSlug: 'adult-bjj',
    defaultDurationMinutes: 90,
    tags: ['beginner', 'adults', 'gi'],
    schedule: [
      { dayOfWeek: 2, startTime: '06:00', endTime: '07:30' }, // Tuesday 6 AM
      { dayOfWeek: 4, startTime: '06:00', endTime: '07:30' }, // Thursday 6 AM
      { dayOfWeek: 2, startTime: '18:00', endTime: '19:30' }, // Tuesday 6 PM
      { dayOfWeek: 4, startTime: '18:00', endTime: '19:30' }, // Thursday 6 PM
    ],
  },
  {
    name: 'BJJ Intermediate',
    slug: 'bjj-intermediate',
    description: 'Covers intermediate curriculum. Builds on Fundamentals.',
    color: '#eab308',
    programSlug: 'adult-bjj',
    defaultDurationMinutes: 60,
    tags: ['intermediate', 'adults', 'gi'],
    schedule: [
      { dayOfWeek: 1, startTime: '19:00', endTime: '20:00' }, // Monday 7 PM
      { dayOfWeek: 3, startTime: '19:00', endTime: '20:00' }, // Wednesday 7 PM
    ],
  },
  {
    name: 'BJJ Advanced',
    slug: 'bjj-advanced',
    description: 'Advanced curriculum requiring at least blue belt.',
    color: '#a855f7',
    programSlug: 'adult-bjj',
    defaultDurationMinutes: 60,
    tags: ['advanced', 'adults', 'no-gi'],
    schedule: [
      { dayOfWeek: 3, startTime: '19:00', endTime: '20:00' }, // Wednesday 7 PM
      { dayOfWeek: 5, startTime: '19:00', endTime: '20:00' }, // Friday 7 PM
      { dayOfWeek: 5, startTime: '11:00', endTime: '12:00' }, // Friday 11 AM
    ],
  },
  {
    name: 'Kids Class',
    slug: 'kids-class',
    description: 'Builds coordination, focus, and basic grappling skills through games.',
    color: '#06b6d4',
    programSlug: 'kids-program',
    defaultDurationMinutes: 60,
    minAge: 6,
    maxAge: 12,
    tags: ['beginner', 'kids', 'gi'],
    schedule: [
      { dayOfWeek: 2, startTime: '16:00', endTime: '17:00' }, // Tuesday 4 PM
      { dayOfWeek: 4, startTime: '16:00', endTime: '17:00' }, // Thursday 4 PM
    ],
  },
  {
    name: 'Advanced No-Gi',
    slug: 'advanced-no-gi',
    description: 'High percentage transitions, leg entanglements, and situational sparring.',
    color: '#f97316',
    programSlug: 'adult-bjj',
    defaultDurationMinutes: 60,
    tags: ['advanced', 'adults', 'no-gi'],
    schedule: [
      { dayOfWeek: 6, startTime: '12:00', endTime: '13:00' }, // Saturday 12 PM
      { dayOfWeek: 0, startTime: '12:00', endTime: '13:00' }, // Sunday 12 PM
    ],
  },
  {
    name: 'Women\'s BJJ',
    slug: 'womens-bjj',
    description: 'Technique focused class with optional sparring for women.',
    color: '#ec4899',
    programSlug: 'special-programs',
    defaultDurationMinutes: 60,
    tags: ['adults', 'gi'],
    schedule: [
      { dayOfWeek: 2, startTime: '17:00', endTime: '18:00' }, // Tuesday 5 PM
    ],
  },
  {
    name: 'Open Mat',
    slug: 'open-mat',
    description: 'Open training session. Bring your skill level to practice freely.',
    color: '#ef4444',
    programSlug: 'special-programs',
    defaultDurationMinutes: 120,
    tags: ['adults', 'gi'],
    schedule: [
      { dayOfWeek: 6, startTime: '10:00', endTime: '12:00' }, // Saturday 10 AM
      { dayOfWeek: 0, startTime: '10:00', endTime: '12:00' }, // Sunday 10 AM
    ],
  },
  {
    name: 'Competition Team',
    slug: 'competition-team',
    description: 'Advanced training for competition preparation.',
    color: '#a855f7',
    programSlug: 'competition-team',
    defaultDurationMinutes: 60,
    tags: ['advanced', 'competition', 'gi'],
    schedule: [
      { dayOfWeek: 1, startTime: '20:00', endTime: '21:00' }, // Monday 8 PM
      { dayOfWeek: 3, startTime: '20:00', endTime: '21:00' }, // Wednesday 8 PM
      { dayOfWeek: 5, startTime: '20:00', endTime: '21:00' }, // Friday 8 PM
    ],
  },
];

// Event pricing type
type EventPricing = {
  name: string;
  price: number;
  memberOnly?: boolean;
  validUntil?: string;
};

// Events data
const eventsData: Array<{
  name: string;
  slug: string;
  description: string;
  eventType: string;
  maxCapacity?: number;
  sessions: Array<{ date: string; startTime: string; endTime: string }>;
  pricing: EventPricing[];
}> = [
  {
    name: 'BJJ Fundamentals Seminar Series',
    slug: 'bjj-fundamentals-seminar-2026',
    description: 'A comprehensive 3-day seminar covering essential BJJ fundamentals with world-class instruction.',
    eventType: 'seminar',
    sessions: [
      { date: '2026-01-15', startTime: '10:00', endTime: '13:00' },
      { date: '2026-01-15', startTime: '15:00', endTime: '18:00' },
      { date: '2026-01-16', startTime: '10:00', endTime: '13:00' },
      { date: '2026-01-16', startTime: '15:00', endTime: '18:00' },
      { date: '2026-01-17', startTime: '10:00', endTime: '13:00' },
    ],
    pricing: [
      { name: 'Early Bird', price: 149.99, validUntil: '2026-01-01' },
      { name: 'Regular', price: 199.99 },
    ],
  },
  {
    name: 'Guest Instructor: Master Rodriguez',
    slug: 'master-rodriguez-seminar-2026',
    description: 'One-day exclusive training session with IBJJF World Champion.',
    eventType: 'workshop',
    maxCapacity: 40,
    sessions: [
      { date: '2026-02-08', startTime: '11:00', endTime: '14:00' },
    ],
    pricing: [
      { name: 'Member Price', price: 60, memberOnly: true },
      { name: 'Non-Member', price: 75 },
    ],
  },
];

// Coupons data
const couponsData = [
  { code: 'CTA_FAMILY_1', name: 'Family Member Discount', discountType: 'percentage', discountValue: 15, applicableTo: 'membership', usageLimit: 100, status: 'active' },
  { code: 'NEWSTUDENT50', name: 'New Student Special', discountType: 'fixed', discountValue: 50, applicableTo: 'membership', usageLimit: 50, status: 'active' },
  { code: 'FREETRIAL7', name: '7 Day Free Trial', discountType: 'free_days', discountValue: 7, applicableTo: 'membership', usageLimit: null, status: 'active' },
  { code: 'BLACKFRIDAY', name: 'Black Friday Sale', discountType: 'percentage', discountValue: 25, applicableTo: 'event', usageLimit: 200, status: 'expired' },
  { code: 'SUMMER2024', name: 'Summer Promotion', discountType: 'percentage', discountValue: 20, applicableTo: 'all', usageLimit: 100, status: 'inactive' },
  { code: 'HOLIDAY25', name: 'Holiday Special', discountType: 'fixed', discountValue: 25, applicableTo: 'membership', usageLimit: 75, status: 'active' },
  { code: 'REFERRAL10', name: 'Referral Bonus', discountType: 'percentage', discountValue: 10, applicableTo: 'membership', usageLimit: null, status: 'active' },
  { code: 'FLASH20', name: 'Flash Sale', discountType: 'fixed', discountValue: 20, applicableTo: 'event', usageLimit: 50, status: 'expired' },
  { code: 'NEWYEAR25', name: 'New Year Special', discountType: 'percentage', discountValue: 25, applicableTo: 'all', usageLimit: 150, status: 'active' },
  { code: 'LOYALTY15', name: 'Loyalty Reward', discountType: 'percentage', discountValue: 15, applicableTo: 'membership', usageLimit: 100, status: 'active' },
  { code: 'SPRING10', name: 'Spring Sale', discountType: 'fixed', discountValue: 10, applicableTo: 'event', usageLimit: 40, status: 'active' },
  { code: 'VIP50', name: 'VIP Member Discount', discountType: 'fixed', discountValue: 50, applicableTo: 'membership', usageLimit: 20, status: 'inactive' },
];

// Members data (from MemberCard.stories.tsx)
const membersData = [
  { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1234567890', dateOfBirth: '1990-01-15', status: 'active', memberType: 'individual' },
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', phone: '+1987654321', dateOfBirth: '1985-03-22', status: 'active', memberType: 'individual' },
  { firstName: 'Mike', lastName: 'Rodriguez', email: 'mike.rodriguez@example.com', phone: '+1555123456', dateOfBirth: '1992-07-10', status: 'trial', memberType: 'individual' },
  { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@example.com', phone: null, dateOfBirth: '1995-11-03', status: 'active', memberType: 'individual' },
  { firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', phone: '+1777888999', dateOfBirth: '1988-09-18', status: 'cancelled', memberType: 'individual' },
  { firstName: 'Lisa', lastName: 'Martinez', email: 'lisa.martinez@example.com', phone: '+1444555666', dateOfBirth: '1991-12-07', status: 'past_due', memberType: 'individual' },
  { firstName: 'Alex', lastName: 'Thompson', email: 'alex.thompson@example.com', phone: '+1222333444', dateOfBirth: '1993-04-25', status: 'active', memberType: 'individual' },
  { firstName: 'Isabella', lastName: 'Chen', email: 'isabella.chen@example.com', phone: '+1666777888', dateOfBirth: '1987-08-12', status: 'active', memberType: 'individual' },
];

// Schedule exceptions data
const scheduleExceptionsData = [
  {
    classSlug: 'bjj-fundamentals-i',
    exceptionDate: '2025-09-15', // Monday
    exceptionType: 'modified',
    newInstructorClerkId: null,
    reason: 'Coach Alex out sick - Professor Jessica substituting',
  },
  {
    classSlug: 'bjj-fundamentals-i',
    exceptionDate: '2025-09-17', // Wednesday
    exceptionType: 'cancelled',
    reason: 'Gym closed for maintenance',
  },
  {
    classSlug: 'competition-team',
    exceptionDate: '2025-09-15', // Monday
    exceptionType: 'modified',
    newStartTime: '19:30',
    newEndTime: '20:30',
    reason: 'Earlier start time this week',
  },
  {
    classSlug: 'bjj-intermediate',
    exceptionDate: '2025-09-17', // Wednesday
    exceptionType: 'modified',
    newStartTime: '19:30',
    newEndTime: '20:30',
    reason: 'Permanent time change',
  },
];

// Membership plans
const membershipPlansData = [
  { name: '12 Month Commitment (Gold)', slug: '12-month-gold', category: 'Adult Brazilian Jiu-Jitsu', program: 'Adult', price: 149, signupFee: 99, frequency: 'Monthly', contractLength: '12 Months', accessLevel: 'Unlimited', isTrial: false },
  { name: 'Month to Month (Gold)', slug: 'month-to-month-gold', category: 'Adult Brazilian Jiu-Jitsu', program: 'Adult', price: 179, signupFee: 99, frequency: 'Monthly', contractLength: 'Month-to-Month', accessLevel: 'Unlimited', isTrial: false },
  { name: '7-Day Free Trial', slug: '7-day-trial', category: 'Adult Brazilian Jiu-Jitsu', program: 'Adult', price: 0, signupFee: 0, frequency: 'None', contractLength: '7 Days', accessLevel: 'Unlimited', isTrial: true },
  { name: 'Kids Monthly', slug: 'kids-monthly', category: 'Kids Brazilian Jiu-Jitsu', program: 'Kids', price: 99, signupFee: 50, frequency: 'Monthly', contractLength: 'Month-to-Month', accessLevel: 'Kids Classes', isTrial: false },
  { name: 'Competition Team', slug: 'competition-team', category: 'Competition', program: 'Competition', price: 199, signupFee: 0, frequency: 'Monthly', contractLength: 'Month-to-Month', accessLevel: 'Unlimited + Comp Classes', isTrial: false },
  { name: '10-Class Punch Card', slug: '10-class-punchcard', category: 'Adult Brazilian Jiu-Jitsu', program: 'Adult', price: 200, signupFee: 0, frequency: 'None', contractLength: 'N/A', accessLevel: '10 Classes', isTrial: false },
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

async function clearSeededData(organizationId: string) {
  console.info(`  🗑️  Clearing existing seed data for org ${organizationId}...`);

  // Delete in reverse dependency order
  await db.delete(attendanceSchema).where(eq(attendanceSchema.organizationId, organizationId));
  await db.delete(classEnrollmentSchema).where(sql`${classEnrollmentSchema.classId} IN (SELECT id FROM class WHERE organization_id = ${organizationId})`);
  await db.delete(classScheduleExceptionSchema).where(sql`${classScheduleExceptionSchema.classScheduleInstanceId} IN (SELECT csi.id FROM class_schedule_instance csi JOIN class c ON csi.class_id = c.id WHERE c.organization_id = ${organizationId})`);
  await db.delete(classScheduleInstanceSchema).where(sql`${classScheduleInstanceSchema.classId} IN (SELECT id FROM class WHERE organization_id = ${organizationId})`);
  await db.delete(classInstructorSchema).where(sql`${classInstructorSchema.classId} IN (SELECT id FROM class WHERE organization_id = ${organizationId})`);
  await db.delete(classTagSchema).where(sql`${classTagSchema.classId} IN (SELECT id FROM class WHERE organization_id = ${organizationId})`);
  await db.delete(eventSessionSchema).where(sql`${eventSessionSchema.eventId} IN (SELECT id FROM event WHERE organization_id = ${organizationId})`);
  await db.delete(eventBillingSchema).where(sql`${eventBillingSchema.eventId} IN (SELECT id FROM event WHERE organization_id = ${organizationId})`);
  await db.delete(eventTagSchema).where(sql`${eventTagSchema.eventId} IN (SELECT id FROM event WHERE organization_id = ${organizationId})`);
  await db.delete(membershipTagSchema).where(sql`${membershipTagSchema.membershipPlanId} IN (SELECT id FROM membership_plan WHERE organization_id = ${organizationId})`);
  await db.delete(memberMembershipSchema).where(sql`${memberMembershipSchema.memberId} IN (SELECT id FROM member WHERE organization_id = ${organizationId})`);
  await db.delete(classSchema).where(eq(classSchema.organizationId, organizationId));
  await db.delete(eventSchema).where(eq(eventSchema.organizationId, organizationId));
  await db.delete(memberSchema).where(eq(memberSchema.organizationId, organizationId));
  await db.delete(membershipPlanSchema).where(eq(membershipPlanSchema.organizationId, organizationId));
  await db.delete(couponSchema).where(eq(couponSchema.organizationId, organizationId));
  await db.delete(tagSchema).where(eq(tagSchema.organizationId, organizationId));
  await db.delete(programSchema).where(eq(programSchema.organizationId, organizationId));
}

async function seedOrganization(organizationId: string) {
  console.info(`\n📦 Seeding organization: ${organizationId}`);

  if (shouldReset) {
    await clearSeededData(organizationId);
  }

  // 1. Seed Programs
  console.info('  📚 Seeding programs...');
  const programIdMap: Record<string, string> = {};
  for (const program of programsData) {
    const id = randomUUID();
    programIdMap[program.slug] = id;
    await db.insert(programSchema).values({
      id,
      organizationId,
      ...program,
    }).onConflictDoNothing();
  }

  // 2. Seed Tags
  console.info('  🏷️  Seeding tags...');
  const tagIdMap: Record<string, string> = {};
  const allTags = [...classTagsData, ...membershipTagsData];
  for (const tag of allTags) {
    const id = randomUUID();
    tagIdMap[`${tag.entityType}-${tag.slug}`] = id;
    await db.insert(tagSchema).values({
      id,
      organizationId,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      entityType: tag.entityType,
    }).onConflictDoNothing();
  }

  // 3. Seed Classes
  console.info('  🥋 Seeding classes...');
  const classIdMap: Record<string, string> = {};
  for (const classData of classesData) {
    const id = randomUUID();
    classIdMap[classData.slug] = id;
    const programId = programIdMap[classData.programSlug];

    await db.insert(classSchema).values({
      id,
      organizationId,
      programId,
      name: classData.name,
      slug: classData.slug,
      description: classData.description,
      color: classData.color,
      defaultDurationMinutes: classData.defaultDurationMinutes,
      minAge: classData.minAge,
      maxAge: classData.maxAge,
    }).onConflictDoNothing();

    // Link tags to class
    for (const tagSlug of classData.tags) {
      const tagId = tagIdMap[`class-${tagSlug}`];
      if (tagId) {
        await db.insert(classTagSchema).values({
          classId: id,
          tagId,
        }).onConflictDoNothing();
      }
    }

    // Create schedule instances
    const scheduleInstanceIds: string[] = [];
    for (const schedule of classData.schedule) {
      const scheduleId = randomUUID();
      scheduleInstanceIds.push(scheduleId);
      await db.insert(classScheduleInstanceSchema).values({
        id: scheduleId,
        classId: id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      }).onConflictDoNothing();
    }

    // Create schedule exceptions for this class
    const classExceptions = scheduleExceptionsData.filter(e => e.classSlug === classData.slug);
    for (const exception of classExceptions) {
      // Use the first schedule instance for this class (simplified - in production would match by day)
      const scheduleInstanceId = scheduleInstanceIds[0];
      if (scheduleInstanceId) {
        await db.insert(classScheduleExceptionSchema).values({
          id: randomUUID(),
          classScheduleInstanceId: scheduleInstanceId,
          exceptionDate: new Date(exception.exceptionDate),
          exceptionType: exception.exceptionType,
          newStartTime: exception.newStartTime,
          newEndTime: exception.newEndTime,
          newInstructorClerkId: exception.newInstructorClerkId,
          reason: exception.reason,
        }).onConflictDoNothing();
      }
    }
  }

  // 4. Seed Events
  console.info('  🎪 Seeding events...');
  for (const eventData of eventsData) {
    const eventId = randomUUID();
    await db.insert(eventSchema).values({
      id: eventId,
      organizationId,
      name: eventData.name,
      slug: eventData.slug,
      description: eventData.description,
      eventType: eventData.eventType,
      maxCapacity: eventData.maxCapacity,
    }).onConflictDoNothing();

    // Create event sessions
    for (const session of eventData.sessions) {
      await db.insert(eventSessionSchema).values({
        id: randomUUID(),
        eventId,
        sessionDate: new Date(session.date),
        startTime: session.startTime,
        endTime: session.endTime,
      }).onConflictDoNothing();
    }

    // Create event pricing
    for (const pricing of eventData.pricing) {
      await db.insert(eventBillingSchema).values({
        id: randomUUID(),
        eventId,
        name: pricing.name,
        price: pricing.price,
        memberOnly: pricing.memberOnly ?? false,
        validUntil: pricing.validUntil ? new Date(pricing.validUntil) : null,
      }).onConflictDoNothing();
    }
  }

  // 5. Seed Coupons
  console.info('  🎫 Seeding coupons...');
  for (const coupon of couponsData) {
    await db.insert(couponSchema).values({
      id: randomUUID(),
      organizationId,
      code: coupon.code,
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      applicableTo: coupon.applicableTo,
      usageLimit: coupon.usageLimit,
      status: coupon.status,
    }).onConflictDoNothing();
  }

  // 6. Seed Membership Plans
  console.info('  💳 Seeding membership plans...');
  const membershipPlanIdMap: Record<string, string> = {};
  for (const plan of membershipPlansData) {
    const id = randomUUID();
    membershipPlanIdMap[plan.slug] = id;
    await db.insert(membershipPlanSchema).values({
      id,
      organizationId,
      name: plan.name,
      slug: plan.slug,
      category: plan.category,
      program: plan.program,
      price: plan.price,
      signupFee: plan.signupFee,
      frequency: plan.frequency,
      contractLength: plan.contractLength,
      accessLevel: plan.accessLevel,
      isTrial: plan.isTrial,
    }).onConflictDoNothing();
  }

  // 7. Seed Members
  console.info('  👥 Seeding members...');
  const memberIds: string[] = [];
  for (const member of membersData) {
    const id = randomUUID();
    memberIds.push(id);
    await db.insert(memberSchema).values({
      id,
      organizationId,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
      status: member.status,
      memberType: member.memberType,
      clerkUserId: null, // Members don't have Clerk accounts in seed data
    }).onConflictDoNothing();

    // Assign a membership plan to active/trial members
    if (member.status === 'active' || member.status === 'trial') {
      const planSlug = member.status === 'trial' ? '7-day-trial' : '12-month-gold';
      const planId = membershipPlanIdMap[planSlug];
      if (planId) {
        await db.insert(memberMembershipSchema).values({
          id: randomUUID(),
          memberId: id,
          membershipPlanId: planId,
          status: 'active',
          billingType: member.status === 'trial' ? 'one-time' : 'autopay',
          startDate: new Date(),
        }).onConflictDoNothing();
      }
    }
  }

  console.info(`  ✅ Seeded ${programsData.length} programs, ${allTags.length} tags, ${classesData.length} classes, ${eventsData.length} events, ${couponsData.length} coupons, ${membershipPlansData.length} membership plans, ${membersData.length} members`);
}

async function main() {
  console.info('🌱 Dojo Planner Database Seed Script');
  console.info('====================================\n');

  try {
    // Get organizations to seed
    let organizations: { id: string }[];

    if (specificOrgId) {
      // Check if org exists, create if not (org is managed by Clerk, we just need the ID)
      const org = await db.select({ id: organizationSchema.id }).from(organizationSchema).where(eq(organizationSchema.id, specificOrgId));
      if (org.length === 0) {
        console.info(`  📝 Creating organization record for ${specificOrgId}...`);
        await db.insert(organizationSchema).values({
          id: specificOrgId,
        }).onConflictDoNothing();
      }
      organizations = [{ id: specificOrgId }];
    } else {
      // Get all organizations
      organizations = await db.select({ id: organizationSchema.id }).from(organizationSchema);
      if (organizations.length === 0) {
        console.info('⚠️  No organizations found in database.');
        console.info('');
        console.info('   To seed your Clerk organizations, run with --orgId:');
        console.info('');
        console.info('   DATABASE_URL="..." npx tsx src/scripts/seed.ts --orgId=org_xxxxx');
        console.info('');
        console.info('   How to find your organization ID:');
        console.info('   1. Go to Clerk Dashboard → Organizations');
        console.info('   2. Click on an organization');
        console.info('   3. Copy the Organization ID (starts with "org_")');
        console.info('');
        console.info('   Or, sign into the app and the organization will sync automatically');
        console.info('   when you visit /dashboard and select an organization.');
        process.exit(0);
      }
    }

    console.info(`Found ${organizations.length} organization(s) to seed.\n`);

    for (const org of organizations) {
      await seedOrganization(org.id);
    }

    console.info('\n✅ Seed completed successfully!');
    console.info('\n📋 Next steps:');
    console.info('   1. Run `npm run db:studio` to view seeded data');
    console.info('   2. Create staff users in Clerk dashboard for instructor assignments');
    console.info('   3. Optionally create Clerk accounts for sample members (for kiosk testing)');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
