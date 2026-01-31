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
  addressSchema,
  attendanceSchema,
  catalogCategorySchema,
  catalogItemCategorySchema,
  catalogItemImageSchema,
  catalogItemSchema,
  catalogItemVariantSchema,
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
  noteSchema,
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

// Catalog categories
const catalogCategoriesData = [
  { name: 'Gis', slug: 'gis', description: 'Brazilian Jiu-Jitsu kimonos' },
  { name: 'Belts', slug: 'belts', description: 'Ranking belts for all levels' },
  { name: 'Apparel', slug: 'apparel', description: 'Rash guards, shorts, and training gear' },
  { name: 'Accessories', slug: 'accessories', description: 'Gear bags, patches, and more' },
  { name: 'Seminars & Events', slug: 'seminars-events', description: 'Access passes for special events' },
];

// Catalog items with variants
type VariantData = {
  name: string;
  price: number;
  stockQuantity: number;
};

type CatalogItemData = {
  type: 'merchandise' | 'event_access';
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku?: string;
  basePrice: number;
  compareAtPrice?: number;
  maxPerOrder: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  isFeatured: boolean;
  categories: string[]; // category slugs
  variants: VariantData[]; // user-defined variants with name, price, and stock
  eventSlug?: string; // for event_access items
  imageUrl?: string; // placeholder image URL
};

const catalogItemsData: CatalogItemData[] = [
  // Gis - variants by size and color
  {
    type: 'merchandise',
    name: 'Academy White Gi',
    slug: 'academy-white-gi',
    description: 'Premium pearl weave gi with academy patches. Durable construction designed for daily training. Pre-shrunk cotton blend ensures a consistent fit wash after wash.',
    shortDescription: 'Premium pearl weave gi with academy patches',
    sku: 'GI-WHT',
    basePrice: 129.99,
    compareAtPrice: 159.99,
    maxPerOrder: 3,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: true,
    categories: ['gis'],
    variants: [
      { name: 'A0 White', price: 129.99, stockQuantity: 8 },
      { name: 'A1 White', price: 129.99, stockQuantity: 12 },
      { name: 'A2 White', price: 129.99, stockQuantity: 15 },
      { name: 'A3 White', price: 139.99, stockQuantity: 10 },
      { name: 'A4 White', price: 149.99, stockQuantity: 6 },
      { name: 'A5 White', price: 159.99, stockQuantity: 3 },
    ],
    imageUrl: 'https://placehold.co/600x600/f8fafc/1e293b?text=White+Gi',
  },
  {
    type: 'merchandise',
    name: 'Academy Blue Gi',
    slug: 'academy-blue-gi',
    description: 'Competition-approved blue gi with reinforced stitching. Perfect for tournaments and daily training. IBJJF approved.',
    shortDescription: 'Competition-approved blue gi',
    sku: 'GI-BLU',
    basePrice: 139.99,
    maxPerOrder: 3,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['gis'],
    variants: [
      { name: 'A1 Blue', price: 139.99, stockQuantity: 8 },
      { name: 'A2 Blue', price: 139.99, stockQuantity: 10 },
      { name: 'A3 Blue', price: 149.99, stockQuantity: 7 },
      { name: 'A4 Blue', price: 159.99, stockQuantity: 4 },
    ],
    imageUrl: 'https://placehold.co/600x600/1e40af/ffffff?text=Blue+Gi',
  },
  {
    type: 'merchandise',
    name: 'Kids Training Gi',
    slug: 'kids-training-gi',
    description: 'Lightweight and durable gi designed for young practitioners. Easy-care fabric that withstands frequent washing.',
    shortDescription: 'Durable gi for young practitioners',
    sku: 'GI-KIDS',
    basePrice: 69.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['gis'],
    variants: [
      { name: 'M0 White', price: 59.99, stockQuantity: 10 },
      { name: 'M1 White', price: 64.99, stockQuantity: 12 },
      { name: 'M2 White', price: 69.99, stockQuantity: 8 },
      { name: 'M3 White', price: 74.99, stockQuantity: 6 },
    ],
    imageUrl: 'https://placehold.co/600x600/f8fafc/1e293b?text=Kids+Gi',
  },

  // Belts - variants by size
  {
    type: 'merchandise',
    name: 'White Belt',
    slug: 'white-belt',
    description: 'Standard white belt for beginners. Cotton construction with reinforced stitching.',
    shortDescription: 'Beginner ranking belt',
    sku: 'BELT-WHT',
    basePrice: 15.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 10,
    isFeatured: false,
    categories: ['belts'],
    variants: [
      { name: 'A0', price: 15.99, stockQuantity: 20 },
      { name: 'A1', price: 15.99, stockQuantity: 25 },
      { name: 'A2', price: 15.99, stockQuantity: 30 },
      { name: 'A3', price: 15.99, stockQuantity: 25 },
      { name: 'A4', price: 15.99, stockQuantity: 15 },
    ],
    imageUrl: 'https://placehold.co/600x600/f8fafc/1e293b?text=White+Belt',
  },
  {
    type: 'merchandise',
    name: 'Blue Belt',
    slug: 'blue-belt',
    description: 'Premium blue belt for intermediate practitioners. Pearl weave construction.',
    shortDescription: 'Intermediate ranking belt',
    sku: 'BELT-BLU',
    basePrice: 19.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 8,
    isFeatured: false,
    categories: ['belts'],
    variants: [
      { name: 'A1', price: 19.99, stockQuantity: 15 },
      { name: 'A2', price: 19.99, stockQuantity: 18 },
      { name: 'A3', price: 19.99, stockQuantity: 12 },
      { name: 'A4', price: 19.99, stockQuantity: 8 },
    ],
    imageUrl: 'https://placehold.co/600x600/1e40af/ffffff?text=Blue+Belt',
  },
  {
    type: 'merchandise',
    name: 'Purple Belt',
    slug: 'purple-belt',
    description: 'Premium purple belt for advanced practitioners. Pearl weave construction.',
    shortDescription: 'Advanced ranking belt',
    sku: 'BELT-PUR',
    basePrice: 24.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['belts'],
    variants: [
      { name: 'A1', price: 24.99, stockQuantity: 8 },
      { name: 'A2', price: 24.99, stockQuantity: 10 },
      { name: 'A3', price: 24.99, stockQuantity: 6 },
      { name: 'A4', price: 24.99, stockQuantity: 4 },
    ],
    imageUrl: 'https://placehold.co/600x600/7c3aed/ffffff?text=Purple+Belt',
  },
  {
    type: 'merchandise',
    name: 'Brown Belt',
    slug: 'brown-belt',
    description: 'Premium brown belt. Pearl weave construction with reinforced core.',
    shortDescription: 'Expert ranking belt',
    sku: 'BELT-BRN',
    basePrice: 29.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 3,
    isFeatured: false,
    categories: ['belts'],
    variants: [
      { name: 'A1', price: 29.99, stockQuantity: 0 },
      { name: 'A2', price: 29.99, stockQuantity: 0 },
      { name: 'A3', price: 29.99, stockQuantity: 0 },
    ],
    imageUrl: 'https://placehold.co/600x600/78350f/ffffff?text=Brown+Belt',
  },
  {
    type: 'merchandise',
    name: 'Black Belt',
    slug: 'black-belt',
    description: 'Premium black belt for masters. Satin finish with embroidered bar.',
    shortDescription: 'Master ranking belt',
    sku: 'BELT-BLK',
    basePrice: 49.99,
    maxPerOrder: 1,
    trackInventory: true,
    lowStockThreshold: 2,
    isFeatured: false,
    categories: ['belts'],
    variants: [
      { name: 'A1', price: 49.99, stockQuantity: 0 },
      { name: 'A2', price: 49.99, stockQuantity: 0 },
      { name: 'A3', price: 49.99, stockQuantity: 0 },
    ],
    imageUrl: 'https://placehold.co/600x600/0f172a/ffffff?text=Black+Belt',
  },

  // Apparel - variants by size
  {
    type: 'merchandise',
    name: 'Academy Rash Guard - Long Sleeve',
    slug: 'rash-guard-long-sleeve',
    description: 'Compression fit rash guard with academy logo. Moisture-wicking fabric for no-gi training.',
    shortDescription: 'Long sleeve compression rash guard',
    sku: 'RG-LS',
    basePrice: 49.99,
    maxPerOrder: 5,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: true,
    categories: ['apparel'],
    variants: [
      { name: 'Small', price: 49.99, stockQuantity: 18 },
      { name: 'Medium', price: 49.99, stockQuantity: 25 },
      { name: 'Large', price: 49.99, stockQuantity: 20 },
      { name: 'X-Large', price: 54.99, stockQuantity: 13 },
    ],
    imageUrl: 'https://placehold.co/600x600/0f172a/ffffff?text=Rash+Guard',
  },
  {
    type: 'merchandise',
    name: 'Academy Rash Guard - Short Sleeve',
    slug: 'rash-guard-short-sleeve',
    description: 'Compression fit short sleeve rash guard. Perfect for hot training sessions.',
    shortDescription: 'Short sleeve compression rash guard',
    sku: 'RG-SS',
    basePrice: 39.99,
    maxPerOrder: 5,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['apparel'],
    variants: [
      { name: 'Small', price: 39.99, stockQuantity: 12 },
      { name: 'Medium', price: 39.99, stockQuantity: 15 },
      { name: 'Large', price: 39.99, stockQuantity: 10 },
      { name: 'X-Large', price: 44.99, stockQuantity: 6 },
    ],
    imageUrl: 'https://placehold.co/600x600/0f172a/ffffff?text=Short+Sleeve',
  },
  {
    type: 'merchandise',
    name: 'No-Gi Shorts',
    slug: 'no-gi-shorts',
    description: 'Durable fight shorts with no pockets or zippers. Stretch fabric allows full range of motion.',
    shortDescription: 'Grappling shorts for no-gi training',
    sku: 'SHORTS',
    basePrice: 44.99,
    maxPerOrder: 5,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['apparel'],
    variants: [
      { name: 'Small Black', price: 44.99, stockQuantity: 10 },
      { name: 'Medium Black', price: 44.99, stockQuantity: 12 },
      { name: 'Large Black', price: 44.99, stockQuantity: 10 },
      { name: 'X-Large Black', price: 49.99, stockQuantity: 6 },
      { name: 'XX-Large Black', price: 54.99, stockQuantity: 4 },
    ],
    imageUrl: 'https://placehold.co/600x600/0f172a/ffffff?text=Fight+Shorts',
  },
  {
    type: 'merchandise',
    name: 'Academy T-Shirt',
    slug: 'academy-tshirt',
    description: 'Soft cotton blend t-shirt with academy logo. Perfect for casual wear.',
    shortDescription: 'Cotton t-shirt with academy logo',
    sku: 'TSHIRT',
    basePrice: 29.99,
    maxPerOrder: 10,
    trackInventory: true,
    lowStockThreshold: 10,
    isFeatured: false,
    categories: ['apparel'],
    variants: [
      { name: 'Small Black', price: 29.99, stockQuantity: 20 },
      { name: 'Medium Black', price: 29.99, stockQuantity: 25 },
      { name: 'Large Black', price: 29.99, stockQuantity: 20 },
      { name: 'X-Large Black', price: 29.99, stockQuantity: 15 },
      { name: 'Small White', price: 29.99, stockQuantity: 15 },
      { name: 'Medium White', price: 29.99, stockQuantity: 18 },
      { name: 'Large White', price: 29.99, stockQuantity: 15 },
      { name: 'X-Large White', price: 29.99, stockQuantity: 10 },
    ],
    imageUrl: 'https://placehold.co/600x600/374151/ffffff?text=T-Shirt',
  },

  // Accessories - single variant or no variants
  {
    type: 'merchandise',
    name: 'Gear Bag',
    slug: 'gear-bag',
    description: 'Large capacity gear bag with ventilated compartment for wet gear. Multiple pockets for organization.',
    shortDescription: 'Spacious bag for all your training gear',
    sku: 'BAG',
    basePrice: 59.99,
    maxPerOrder: 2,
    trackInventory: true,
    lowStockThreshold: 5,
    isFeatured: false,
    categories: ['accessories'],
    variants: [{ name: 'Standard', price: 59.99, stockQuantity: 15 }],
    imageUrl: 'https://placehold.co/600x600/1e293b/ffffff?text=Gear+Bag',
  },
  {
    type: 'merchandise',
    name: 'Academy Patch',
    slug: 'academy-patch',
    description: 'Embroidered academy patch for your gi. Iron-on backing for easy application.',
    shortDescription: 'Embroidered gi patch',
    sku: 'PATCH',
    basePrice: 9.99,
    maxPerOrder: 10,
    trackInventory: true,
    lowStockThreshold: 20,
    isFeatured: false,
    categories: ['accessories'],
    variants: [{ name: 'Standard', price: 9.99, stockQuantity: 50 }],
    imageUrl: 'https://placehold.co/600x600/1e293b/ffffff?text=Patch',
  },
  {
    type: 'merchandise',
    name: 'Mouth Guard',
    slug: 'mouth-guard',
    description: 'Boil-and-bite mouth guard with protective case. Essential for sparring.',
    shortDescription: 'Protective mouth guard with case',
    sku: 'MOUTH',
    basePrice: 14.99,
    maxPerOrder: 3,
    trackInventory: true,
    lowStockThreshold: 15,
    isFeatured: false,
    categories: ['accessories'],
    variants: [{ name: 'Standard', price: 14.99, stockQuantity: 0 }],
    imageUrl: 'https://placehold.co/600x600/1e293b/ffffff?text=Mouth+Guard',
  },

  // Event Access - no variants needed
  {
    type: 'event_access',
    name: 'BJJ Fundamentals Seminar Pass',
    slug: 'fundamentals-seminar-pass',
    description: 'Full access pass for the 3-day BJJ Fundamentals Seminar Series. Includes all sessions and lunch.',
    shortDescription: '3-day seminar full access',
    sku: 'SEM-FUND',
    basePrice: 199.99,
    compareAtPrice: 249.99,
    maxPerOrder: 4,
    trackInventory: false,
    lowStockThreshold: 0,
    isFeatured: true,
    categories: ['seminars-events'],
    variants: [],
    eventSlug: 'bjj-fundamentals-seminar-2026',
    imageUrl: 'https://placehold.co/600x600/059669/ffffff?text=Seminar+Pass',
  },
  {
    type: 'event_access',
    name: 'Master Rodriguez Workshop',
    slug: 'master-rodriguez-workshop',
    description: 'Exclusive training session with IBJJF World Champion Master Rodriguez. Limited to 40 participants.',
    shortDescription: 'Training with world champion',
    sku: 'SEM-ROD',
    basePrice: 75,
    maxPerOrder: 2,
    trackInventory: false,
    lowStockThreshold: 0,
    isFeatured: true,
    categories: ['seminars-events'],
    variants: [],
    eventSlug: 'master-rodriguez-seminar-2026',
    imageUrl: 'https://placehold.co/600x600/7c3aed/ffffff?text=Workshop',
  },
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
  await db.delete(addressSchema).where(sql`${addressSchema.memberId} IN (SELECT id FROM member WHERE organization_id = ${organizationId})`);
  await db.delete(noteSchema).where(sql`${noteSchema.memberId} IN (SELECT id FROM member WHERE organization_id = ${organizationId})`);
  await db.delete(classSchema).where(eq(classSchema.organizationId, organizationId));
  await db.delete(eventSchema).where(eq(eventSchema.organizationId, organizationId));
  await db.delete(memberSchema).where(eq(memberSchema.organizationId, organizationId));
  await db.delete(membershipPlanSchema).where(eq(membershipPlanSchema.organizationId, organizationId));
  await db.delete(couponSchema).where(eq(couponSchema.organizationId, organizationId));
  await db.delete(tagSchema).where(eq(tagSchema.organizationId, organizationId));
  await db.delete(programSchema).where(eq(programSchema.organizationId, organizationId));

  // Clear catalog data
  await db.delete(catalogItemCategorySchema).where(sql`${catalogItemCategorySchema.catalogItemId} IN (SELECT id FROM catalog_item WHERE organization_id = ${organizationId})`);
  await db.delete(catalogItemImageSchema).where(sql`${catalogItemImageSchema.catalogItemId} IN (SELECT id FROM catalog_item WHERE organization_id = ${organizationId})`);
  await db.delete(catalogItemVariantSchema).where(sql`${catalogItemVariantSchema.catalogItemId} IN (SELECT id FROM catalog_item WHERE organization_id = ${organizationId})`);
  await db.delete(catalogItemSchema).where(eq(catalogItemSchema.organizationId, organizationId));
  await db.delete(catalogCategorySchema).where(eq(catalogCategorySchema.organizationId, organizationId));
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

  // 8. Seed Catalog Categories
  console.info('  🏷️  Seeding catalog categories...');
  const categoryIdMap: Record<string, string> = {};
  for (const category of catalogCategoriesData) {
    const id = randomUUID();
    categoryIdMap[category.slug] = id;
    await db.insert(catalogCategorySchema).values({
      id,
      organizationId,
      name: category.name,
      slug: category.slug,
      description: category.description,
    }).onConflictDoNothing();
  }

  // 9. Seed Catalog Items with Sizes and Images
  console.info('  📦 Seeding catalog items...');
  // First, get the event IDs for event_access items
  const eventIdMap: Record<string, string> = {};
  const events = await db.select({ id: eventSchema.id, slug: eventSchema.slug }).from(eventSchema).where(eq(eventSchema.organizationId, organizationId));
  for (const event of events) {
    if (event.slug) {
      eventIdMap[event.slug] = event.id;
    }
  }

  for (const item of catalogItemsData) {
    const itemId = randomUUID();

    await db.insert(catalogItemSchema).values({
      id: itemId,
      organizationId,
      type: item.type,
      name: item.name,
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription,
      sku: item.sku,
      basePrice: item.basePrice,
      compareAtPrice: item.compareAtPrice,
      eventId: item.eventSlug ? eventIdMap[item.eventSlug] : null,
      maxPerOrder: item.maxPerOrder,
      trackInventory: item.trackInventory,
      lowStockThreshold: item.lowStockThreshold,
      isFeatured: item.isFeatured,
    }).onConflictDoNothing();

    // Link item to categories
    for (const catSlug of item.categories) {
      const catId = categoryIdMap[catSlug];
      if (catId) {
        await db.insert(catalogItemCategorySchema).values({
          catalogItemId: itemId,
          categoryId: catId,
        }).onConflictDoNothing();
      }
    }

    // Create variants with stock
    for (const [i, variant] of item.variants.entries()) {
      await db.insert(catalogItemVariantSchema).values({
        id: randomUUID(),
        catalogItemId: itemId,
        name: variant.name,
        price: variant.price,
        stockQuantity: variant.stockQuantity,
        sortOrder: i,
      }).onConflictDoNothing();
    }

    // Create primary image
    if (item.imageUrl) {
      await db.insert(catalogItemImageSchema).values({
        id: randomUUID(),
        catalogItemId: itemId,
        url: item.imageUrl,
        thumbnailUrl: item.imageUrl.replace('600x600', '200x200'),
        altText: item.name,
        isPrimary: true,
        sortOrder: 0,
      }).onConflictDoNothing();
    }
  }

  console.info(`  ✅ Seeded ${programsData.length} programs, ${allTags.length} tags, ${classesData.length} classes, ${eventsData.length} events, ${couponsData.length} coupons, ${membershipPlansData.length} membership plans, ${membersData.length} members, ${catalogCategoriesData.length} catalog categories, ${catalogItemsData.length} catalog items`);
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
