# Dojo Planner - Claude Context

## Project Overview

**Dojo Planner** is a full-stack SaaS application for managing martial arts dojos - handling classes, members, billing, and business operations.

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + Drizzle ORM + PostgreSQL + Clerk Auth + Stripe

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # i18n routing (next-intl)
│   │   ├── (auth)/        # Protected routes (ClerkProvider)
│   │   │   ├── (center)/  # Centered layouts (sign-in/sign-up)
│   │   │   └── dashboard/ # Main app routes
│   │   ├── (marketing)/   # Public landing page
│   │   ├── api/           # REST API endpoints
│   │   ├── rpc/           # ORPC endpoint
│   │   └── webhook/       # Stripe webhooks
│   ├── global-error.tsx   # Sentry error boundary
│   ├── robots.ts          # SEO robots.txt
│   └── sitemap.ts         # SEO sitemap
│
├── features/              # Feature modules (domain logic + UI)
│   ├── auth/              # Authentication
│   ├── billing/           # Stripe subscriptions
│   ├── classes/           # Class scheduling
│   ├── dashboard/         # Analytics views
│   ├── finances/          # Transaction tracking
│   ├── marketing/         # Coupons/promos
│   ├── members/           # Member management
│   ├── memberships/       # Membership plans
│   ├── programs/          # Training programs
│   ├── reports/           # Analytics/reporting
│   ├── roles/             # RBAC
│   ├── settings/          # Org settings
│   ├── staff/             # Staff management
│   └── todo/              # Task tracking
│
├── routers/               # ORPC API handlers
│   ├── AuthGuards.ts      # Auth middleware (guardAuth, guardRole)
│   ├── Member.ts          # Member CRUD
│   ├── Members.ts         # Members list ops
│   └── Todo.ts            # Todo CRUD
│
├── services/              # Business logic layer
│   ├── BillingService.ts  # Stripe integration
│   ├── ClerkRolesService.ts # Clerk Backend API
│   ├── MembersService.ts  # Member operations
│   ├── OrganizationService.ts # Org & Stripe customer storage
│   └── TodoService.ts
│
├── models/
│   └── Schema.ts          # Drizzle ORM tables
│
├── components/ui/         # Shadcn UI components (37+)
├── templates/             # Page templates & cards (34)
├── hooks/                 # React hooks (17)
├── libs/                  # Core utilities
│   ├── DB.ts              # Database client
│   ├── Env.ts             # Environment validation (t3-oss)
│   ├── I18n.ts            # i18n configuration
│   ├── I18nRouting.ts     # Locale routing
│   ├── Logger.ts          # Better Stack logging
│   ├── Orpc.ts            # RPC client setup
│   └── Stripe.ts          # Stripe client
├── utils/                 # Helper functions
│   ├── AppConfig.ts       # Pricing plans, Clerk locales
│   └── Auth.ts            # Page-level auth helpers
├── validations/           # Zod schemas
├── types/                 # TypeScript types
│   └── Auth.ts            # Role definitions (ORG_ROLE)
├── locales/               # i18n translations
└── constants/             # App constants

tests/                     # E2E tests (Playwright)
├── e2e/                   # E2E spec files (*.e2e.ts)
├── fixtures.ts            # Test fixtures
├── global.setup.ts        # Clerk auth setup
├── global.teardown.ts     # Cleanup
└── TestUtils.ts           # Test helpers

migrations/                # Drizzle migrations
docs/                      # Documentation
.storybook/                # Storybook config
```

## Routing (Next.js App Router)

### Route Groups

| Group | Purpose |
|-------|---------|
| `(auth)` | Protected routes with ClerkProvider |
| `(center)` | Centered layout for auth pages |
| `(marketing)` | Public landing page |

### Dashboard Routes

| Route | File | Purpose |
|-------|------|---------|
| `/dashboard` | `dashboard/page.tsx` | Main dashboard |
| `/dashboard/members` | `members/page.tsx` | Members list |
| `/dashboard/members/[memberId]` | `members/[memberId]/page.tsx` | Member detail |
| `/dashboard/members/[memberId]/edit` | `members/[memberId]/edit/page.tsx` | Edit member |
| `/dashboard/classes` | `classes/page.tsx` | Classes list |
| `/dashboard/classes/[classId]` | `classes/[classId]/page.tsx` | Class detail |
| `/dashboard/programs` | `programs/page.tsx` | Programs list |
| `/dashboard/memberships` | `memberships/page.tsx` | Memberships list |
| `/dashboard/memberships/[membershipId]` | `memberships/[membershipId]/page.tsx` | Membership detail |
| `/dashboard/staff` | `staff/page.tsx` | Staff list |
| `/dashboard/roles` | `roles/page.tsx` | Role management |
| `/dashboard/billing` | `billing/page.tsx` | Billing overview |
| `/dashboard/billing/portal` | `billing/portal/route.ts` | Stripe portal redirect |
| `/dashboard/billing/checkout/[planId]` | `billing/checkout/[planId]/route.ts` | Stripe checkout |
| `/dashboard/transactions` | `transactions/page.tsx` | Finances |
| `/dashboard/reports` | `reports/page.tsx` | Reports |
| `/dashboard/marketing` | `marketing/page.tsx` | Marketing tools |
| `/dashboard/todos` | `todos/page.tsx` | Todo list |
| `/dashboard/todos/add` | `todos/add/page.tsx` | Add todo |
| `/dashboard/todos/edit/[id]` | `todos/edit/[id]/page.tsx` | Edit todo |
| `/dashboard/user-profile` | `user-profile/[[...user-profile]]/page.tsx` | Clerk UserProfile |
| `/dashboard/organization-profile` | `organization-profile/[[...organization-profile]]/page.tsx` | Clerk OrgProfile |
| `/dashboard/preferences` | `preferences/page.tsx` | User preferences |
| `/dashboard/security` | `security/page.tsx` | Security settings |

### Auth Routes

| Route | Purpose |
|-------|---------|
| `/sign-in/[[...sign-in]]` | Clerk SignIn component |
| `/sign-up/[[...sign-up]]` | Clerk SignUp component |
| `/onboarding/organization-selection` | Organization picker |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/rpc/[[...rest]]` | ALL | ORPC handler |
| `/webhook/billing` | POST | Stripe webhooks |
| `/api/organization/[orgId]/subscription` | GET | Subscription details |

### Layout Hierarchy

```
RootLayout (theme, i18n, migrations)
└── AuthLayout (ClerkProvider)
    ├── CenterLayout (sign-in/sign-up)
    └── DashboardLayout (sidebar, nav)
```

## Vendor Integrations

### Clerk (Authentication)

**Package:** `@clerk/nextjs` v6.36.5

**Key Files:**
- `src/app/[locale]/(auth)/layout.tsx` - ClerkProvider wrapper
- `src/routers/AuthGuards.ts` - API guards (`guardAuth`, `guardRole`)
- `src/utils/Auth.ts` - Page auth (`requireOrganization`)
- `src/services/ClerkRolesService.ts` - Clerk Backend API
- `src/types/Auth.ts` - Role definitions

**Roles:**
```
ORG_ROLE.ADMIN            -> org:admin
ORG_ROLE.ACADEMY_OWNER    -> org:academy_owner
ORG_ROLE.FRONT_DESK       -> org:front_desk
ORG_ROLE.MEMBER           -> org:member
ORG_ROLE.INDIVIDUAL_MEMBER -> org:individual_member
```

**Auth Patterns:**
```
// API route protection
const { orgId } = await guardRole(ORG_ROLE.ADMIN)

// Page protection
const { orgId, has } = await requireOrganization()
if (!has({ role: ORG_ROLE.ADMIN })) redirect('/dashboard')
```

**Test Email:** `user+clerk_test@example.com` (code: `424242`)

### Stripe (Billing)

**Package:** `stripe` v18.5.0

**Key Files:**
- `src/libs/Stripe.ts` - Client setup
- `src/services/BillingService.ts` - Billing logic
- `src/services/OrganizationService.ts` - Customer storage
- `src/app/[locale]/webhook/billing/route.ts` - Webhook handler
- `src/utils/AppConfig.ts` - Pricing plans

**Pricing Plans:**
```
PLAN_ID.FREE        -> Free tier
PLAN_ID.FREE_TRIAL  -> Trial period
PLAN_ID.MONTHLY     -> $79/month
PLAN_ID.ANNUAL      -> $790/year
```

**Webhook Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`

**Commands:**
```bash
npm run stripe:listen    # Forward webhooks locally
npm run stripe:setup-price # Create test prices
```

### Sentry (Error Monitoring)

**Package:** `@sentry/nextjs` v10.32.1

**Key Files:**
- `src/instrumentation.ts` - Server-side init
- `src/instrumentation-client.ts` - Client-side init
- `src/app/global-error.tsx` - Error boundary
- `next.config.ts` - Sentry webpack config

**Features:**
- Error tracking with source maps
- Session replay (10% normal, 100% errors)
- Performance tracing
- Spotlight (dev mode debugging)
- Tunnel route: `/monitoring` (bypasses ad-blockers)

**Disable:** Set `NEXT_PUBLIC_SENTRY_DISABLED=true`

### Checkly (Synthetic Monitoring)

**Package:** `checkly` v6.9.7

**Config:** `checkly.config.ts`

**Features:**
- Runs E2E tests as synthetic checks
- Locations: `us-east-1`, `eu-west-1`
- Frequency: Every 24 hours
- Email alerts on failure/recovery
- Test pattern: `**/tests/e2e/**/*.e2e.ts`

### Better Stack (Logging)

**Package:** `@logtape/logtape` v1.3.5

**Config:** `src/libs/Logger.ts`

**Features:**
- JSON Lines format
- Console + remote ingestion
- Conditional based on env vars

## Storybook

**Framework:** `@storybook/nextjs-vite` v10.1.11

**Config:** `.storybook/`
- `main.ts` - Framework and addons
- `preview.tsx` - Global decorators (I18nWrapper)
- `vitest.config.mts` - Component testing

**Addons:**
- `@storybook/addon-docs` - Auto documentation
- `@storybook/addon-a11y` - Accessibility testing

**Story Organization:**
```
Design System/       # Color palette, typography
UI/Primitives/       # Button, Input, Checkbox, etc.
UI/Display/          # Badge, Alert, Skeleton, etc.
UI/Containers/       # Dialog, Sheet, Card, etc.
Templates/           # MemberCard, ClassCard, etc.
Features/            # AppSidebarNav
```

**Patterns:**
```
// Dark mode story
export const DarkMode: Story = {
  decorators: [Story => (
    <div className="dark bg-background p-4 text-foreground">
      <Story />
    </div>
  )],
}
```

**Commands:**
```bash
npm run storybook       # Dev server (port 6006)
npm run storybook:test  # Run story tests
```

## Testing

### Unit/UI Tests (Vitest)

**Config:** `vitest.config.mts`

**Projects:**
- `unit` - Node environment (`*.test.ts`)
- `ui` - Browser environment (`*.test.tsx`, hooks)

**Run:** `npm run test`

### E2E Tests (Playwright)

**Config:** `playwright.config.ts`

**Key Files:**
- `tests/global.setup.ts` - Clerk auth setup
- `tests/TestUtils.ts` - Test helpers

**Helpers:**
```typescript
await setupClerkTestingToken({ page });
await createUserWithOrganization(page);
await signIn(page);
await deleteUserWithOrganization();
```

**Run:** `npm run test:e2e`

## Database

**ORM:** Drizzle with PostgreSQL

**Schema:** `src/models/Schema.ts`

**Key Tables:**
- `organization` - Multi-tenant orgs with Stripe IDs
- `member` - Member records
- `membership_plan` - Pricing tiers
- `member_membership` - Member-plan associations
- `payment_method` - Saved payment methods
- `address` - Member addresses
- `note` - Member notes
- `family_member` - Family relationships
- `todo` - Tasks

**Commands:**
```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## Environment Variables

**Validation:** `src/libs/Env.ts` (t3-oss/env-nextjs)

**Required Server:**
```bash
CLERK_SECRET_KEY
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
BILLING_PLAN_ENV          # dev | test | prod
```

**Required Client:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

**Optional:**
```bash
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SENTRY_DSN
NEXT_PUBLIC_SENTRY_DISABLED
NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN
NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST
```

## Scripts

```bash
npm run dev           # Dev server with PGLite DB + Sentry Spotlight
npm run build         # Production build
npm run test          # Vitest (unit + UI)
npm run test -- --coverage  # Run tests with coverage report
npm run test:e2e      # Playwright E2E
npm run lint          # ESLint
npm run check:types   # TypeScript check
npm run check:deps    # Unused deps (knip)
npm run check:i18n    # Validate i18n keys (source: en)
npm run storybook     # Component docs
npm run stripe:listen # Forward Stripe webhooks
npm run commit        # Interactive commit helper
```

## Conventions

- **Feature modules:** Each feature in `src/features/` contains its own components, hooks, and logic
- **Path alias:** `@/*` maps to `src/*`
- **Tests:** Co-located with source files
- **Validation:** Zod schemas in `src/validations/`
- **i18n:** Translation keys in `src/locales/[lang].json`
- **Locales:** English (en), French (fr)
- **Lint:** Never use eslint-ignore comments; fix the underlying issue instead

## CI/CD

- **CI:** GitHub Actions (`.github/workflows/CI.yml`)
  - Build matrix: Node 22.x, 24.x
  - Lint, types, deps check
  - Unit tests, Storybook tests, E2E tests
- **Release:** Semantic release on main branch
- **Monitoring:** Checkly synthetic monitoring
