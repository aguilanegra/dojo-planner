import { bigint, boolean, pgTable, primaryKey, real, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the Next.js initialization process through `instrumentation.ts`.
// Simply restart your Next.js server to apply the database changes.
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with SaaS Boilerplate

export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  table => [
    uniqueIndex('stripe_customer_id_idx').on(table.stripeCustomerId),
  ],
);

export const memberSchema = pgTable('member', {
  id: text('id').primaryKey(), // UUID v4
  organizationId: text('organization_id').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  memberType: text('member_type'), // individual, family-member, head-of-household
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  photoUrl: text('photo_url'),
  lastAccessedAt: timestamp('last_accessed_at', { mode: 'date' })
    .$onUpdate(() => new Date()),
  status: text('status').notNull().default('active'), // active, hold, trial, cancelled, past due
  statusChangedAt: timestamp('status_changed_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Membership plans table - stores available membership types that can be created/edited/deleted
export const membershipPlanSchema = pgTable('membership_plan', {
  id: text('id').primaryKey(), // UUID v4
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(), // e.g., '12 Month Commitment (Gold)'
  slug: text('slug').notNull(), // e.g., '12_month_commitment_gold' - used for identification
  category: text('category').notNull(), // e.g., 'Adult Brazilian Jiu-Jitsu'
  program: text('program').notNull(), // e.g., 'Adult', 'Kids', 'Competition'
  price: real('price').notNull().default(0), // Monthly price amount
  signupFee: real('signup_fee').notNull().default(0),
  frequency: text('frequency').notNull().default('Monthly'), // Monthly, Annual, None
  contractLength: text('contract_length').notNull(), // e.g., '12 Months', 'Month-to-Month', '7 Days'
  accessLevel: text('access_level').notNull(), // e.g., 'Unlimited', '8 Classes/mo'
  description: text('description'), // Short description of the plan
  isTrial: boolean('is_trial').default(false),
  isActive: boolean('is_active').default(true), // Whether the plan is currently offered
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Links members to their membership plans with historical tracking
export const memberMembershipSchema = pgTable('member_membership', {
  id: text('id').primaryKey(), // UUID v4
  memberId: text('member_id').references(() => memberSchema.id).notNull(),
  membershipPlanId: text('membership_plan_id').references(() => membershipPlanSchema.id).notNull(),
  status: text('status').notNull().default('active'), // active, cancelled, expired, converted
  startDate: timestamp('start_date', { mode: 'date' }).defaultNow().notNull(),
  endDate: timestamp('end_date', { mode: 'date' }), // null if ongoing
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const addressSchema = pgTable('address', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => memberSchema.id).notNull(),
  type: text('type').notNull(), // home, billing, mailing
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  country: text('country').notNull().default('US'),
  isDefault: boolean('is_default').default(false),
});

export const noteSchema = pgTable('note', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => memberSchema.id).notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('active'), // active, archived
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const paymentMethodSchema = pgTable('payment_method', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => memberSchema.id).notNull(),
  stripePaymentMethodId: text('stripe_payment_method_id'),
  type: text('type').notNull(),
  last4: text('last4'),
  isDefault: boolean('is_default').default(false),
});

export const familyMemberSchema = pgTable('family_member', {
  memberId: text('member_id').references(() => memberSchema.id).notNull(),
  relatedMemberId: text('related_member_id').references(() => memberSchema.id).notNull(),
  relationship: text('relationship').notNull(),
}, table => [
  primaryKey({ columns: [table.memberId, table.relatedMemberId] }),
]);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
