import { bigint, boolean, pgTable, primaryKey, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

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
  id: text('id').primaryKey(), // Clerk user ID
  organizationId: text('organization_id').notNull(),
  // Note: email, firstName, lastName come from Clerk API via useOrganization
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  photoUrl: text('photo_url'),
  lastAccessedAt: timestamp('last_accessed_at', { mode: 'date' }),
  status: text('status').notNull().default('active'),
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
