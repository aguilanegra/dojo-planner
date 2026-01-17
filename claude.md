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
│   └── staff/             # Staff management
│
├── routers/               # ORPC API handlers
│   ├── AuthGuards.ts      # Auth middleware (guardAuth, guardRole)
│   ├── Member.ts          # Member CRUD
│   └── Members.ts         # Members list ops
│
├── services/              # Business logic layer
│   ├── BillingService.ts  # Stripe integration
│   ├── ClerkRolesService.ts # Clerk Backend API
│   ├── MembersService.ts  # Member operations
│   └── OrganizationService.ts # Org & Stripe customer storage
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
  - Security audit (`npm audit --audit-level=critical`)
  - CodeQL SAST scanning (`.github/workflows/codeql.yml`)
- **Release:** Semantic release on main branch (uses `RELEASE_PAT` for branch protection bypass)
- **Monitoring:** Checkly synthetic monitoring

## Security & Compliance (SOC2)

This codebase implements security controls for SOC2 Type 1 compliance (Security Trust Service Criteria).

### Audit Logging

**Purpose:** Track WHO did WHAT to WHICH entity WHEN (CC7.2)

**Key Files:**
- `src/types/Audit.ts` - Audit event types and constants
- `src/services/AuditService.ts` - Audit logging service
- `src/libs/Logger.ts` - Dual logger (app + audit categories)

**Usage Pattern:**
```typescript
import { audit } from '@/services/AuditService';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '@/types/Audit';

// In router handlers after guardRole/guardAuth
const context = await guardRole(ORG_ROLE.ADMIN);

try {
  const result = await someOperation();
  await audit(context, AUDIT_ACTION.MEMBER_CREATE, AUDIT_ENTITY_TYPE.MEMBER, {
    entityId: result.id,
    status: 'success',
  });
  return result;
} catch (error) {
  await audit(context, AUDIT_ACTION.MEMBER_CREATE, AUDIT_ENTITY_TYPE.MEMBER, {
    status: 'failure',
    error: error instanceof Error ? error.message : 'Unknown error',
  });
  throw error;
}
```

**Audit Actions:**
```typescript
AUDIT_ACTION.MEMBER_CREATE; // member.create
AUDIT_ACTION.MEMBER_UPDATE; // member.update
AUDIT_ACTION.MEMBER_REMOVE; // member.remove
AUDIT_ACTION.MEMBER_RESTORE; // member.restore
AUDIT_ACTION.MEMBER_UPDATE_CONTACT; // member.updateContact
AUDIT_ACTION.MEMBER_ADD_MEMBERSHIP; // member.addMembership
AUDIT_ACTION.MEMBER_CHANGE_MEMBERSHIP; // member.changeMembership
```

**Adding New Audit Events:**
1. Add action constant to `AUDIT_ACTION` in `src/types/Audit.ts`
2. Add entity type to `AUDIT_ENTITY_TYPE` if needed
3. Call `audit()` in the router handler with proper context

### Rate Limiting

**Purpose:** Prevent abuse and DoS attacks (CC6.1)

**Key Files:**
- `src/libs/RateLimit.ts` - Upstash Redis rate limiters
- `src/libs/Env.ts` - Environment variables for Upstash
- `src/routers/RateLimitGuard.ts` - ORPC rate limit guard
- `src/app/[locale]/rpc/[[...rest]]/route.ts` - RPC rate limiting
- `src/app/[locale]/webhook/billing/route.ts` - Webhook rate limiting

**Rate Limits:**
| Endpoint | Limit | Window | Identifier |
|----------|-------|--------|------------|
| `/rpc/*` (authenticated) | 100 req | 1 min | orgId |
| `/rpc/*` (unauthenticated) | 10 req | 1 min | IP |
| `/webhook/billing` | 100 req | 1 min | IP |

**Environment Variables:**
```bash
# Optional - rate limiting disabled if not set
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Adding Rate Limiting to New Endpoints:**
```typescript
import { getClientIP, isRateLimitingEnabled, rpcRateLimiter } from '@/libs/RateLimit';

async function handleRequest(request: Request) {
  if (isRateLimitingEnabled()) {
    const ip = getClientIP(request);
    const result = await rpcRateLimiter.limit(ip);
    if (!result.success) {
      return new Response('Too Many Requests', { status: 429 });
    }
  }
  // ... handle request
}
```

### Security Headers

HTTP security headers are configured in `next.config.ts`:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation disabled)

### Auth Guards (Enhanced for Audit)

Guards now return full audit context:

```typescript
// guardAuth returns userId for audit logging
const { userId, orgId, has } = await guardAuth();

// guardRole returns AuditContext with role
const context = await guardRole(ORG_ROLE.ADMIN);
// context = { userId, orgId, role: 'org:admin' }
```

### Security Checklist for New Features

When adding new features, ensure:

1. **Authentication:** Use `guardAuth()` or `guardRole()` for all protected endpoints
2. **Audit Logging:** Add `audit()` calls for all mutations (create, update, delete)
3. **Rate Limiting:** Consider if the endpoint needs rate limiting
4. **Input Validation:** Use Zod schemas in `src/validations/`
5. **Error Handling:** Never expose internal errors to clients

## Post-Implementation Checklist

After completing any code changes, always run the following verification steps:

### 1. Create/Update Unit Tests
- Add tests for new functionality in co-located `*.test.ts` files
- Update existing tests to reflect changed behavior
- Ensure mocks are properly configured

### 2. Run All Checks
```bash
# Run all checks in sequence
npm run lint          # ESLint - fix issues, never use eslint-ignore
npm run check:types   # TypeScript type checking
npm run check:deps    # Unused dependencies (knip)
npm run check:i18n    # i18n key validation
npm run test          # Unit tests
npm run test -- --coverage  # Verify coverage
```

### 3. Code Coverage Target
- Aim for as close to 100% coverage as possible on new/modified code
- Review uncovered lines and add tests for edge cases
- Focus on branch coverage for conditional logic

### 4. Git Guardian Compliance
When using test credentials or example values in tests:
```typescript
// Use clearly fake/test values that won't trigger secret scanning
const testUserId = 'test-user-123'; // Clearly a test value
const testOrgId = 'test-org-456'; // Clearly a test value

// For API keys in tests, use obvious placeholder patterns
const mockApiKey = 'test_api_key_not_real'; // nosecret
```

### 5. Final Verification
```bash
# Full verification before commit
npm run lint && npm run check:types && npm run check:deps && npm run check:i18n && npm run test -- --coverage
```

All checks must pass without errors or warnings before committing.
