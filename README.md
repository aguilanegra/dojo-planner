# Dojo Planner

[![CI](https://github.com/aguilanegra/dojo-planner/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/aguilanegra/dojo-planner/actions/workflows/CI.yml)
[![Release](https://github.com/aguilanegra/dojo-planner/actions/workflows/release.yml/badge.svg)](https://github.com/aguilanegra/dojo-planner/actions/workflows/release.yml)

A comprehensive web-based management system for martial arts dojos. Dojo Planner helps school owners and managers organize classes, track members, handle billing, and run their martial arts business efficiently.

## Features

### Classes & Scheduling
- Create and manage classes with details like program, level, type, and style (Gi/No Gi)
- Schedule recurring weekly classes with exception handling for modified or cancelled sessions
- Set capacity limits, minimum age requirements, and walk-in policies
- Assign primary and assistant instructors
- Multiple calendar views: grid, weekly, and monthly
- Track enrollments, attendance, and session statistics

### Members
- Add and manage dojo members with contact information and profiles
- Track member enrollments in classes and memberships
- View member history and notes

### Programs
- Create training programs (e.g., Adult BJJ, Kids Program, Competition Team)
- Link classes to programs and track participation

### Memberships & Subscriptions
- Create membership tiers with configurable pricing and signup fees
- Set contract terms (month-to-month, 6-month, 12-month, etc.)
- Configure access levels (class limits or unlimited)
- Offer free trial periods
- Track active memberships and revenue per tier

### Events
- Create and schedule special events separate from regular classes
- Configure event billing and track attendance

### Marketing & Coupons
- Create promotional codes (percentage off, fixed amount, free trials)
- Set validity dates and usage limits
- Track coupon performance and redemption rates

### Finances
- View all transactions (membership dues, merchandise, events, lessons)
- Track payment status (paid, pending, declined, refunded)
- Multiple payment methods including saved cards, ACH, and cash
- Financial summaries and analytics

### Staff & Permissions
- Invite and manage staff members
- Create custom roles with specific permissions
- Role-based access control

### Organization Management
- Multi-tenancy support for managing multiple locations
- Organization and location settings
- User profiles with security settings and MFA

## Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Authentication**: Clerk
- **Database**: PostgreSQL via DrizzleORM
- **Payments**: Stripe
- **Error Monitoring**: Sentry

## Getting Started

### Requirements

- Node.js 20+
- npm

### Environment Setup

1. Clone the repository

2. Copy the environment template and configure your variables:
   ```shell
   cp .env .env.local
   ```

3. Configure required environment variables in `.env.local`:
   ```shell
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Stripe Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Database (for production)
   DATABASE_URL=your_postgres_connection_string
   ```

4. Install dependencies:
   ```shell
   npm install
   ```

### Development

Run the development server with a local database:

```shell
npm run dev
```

This starts:
- A local PGLite database with automatic migrations
- The Next.js development server
- Sentry Spotlight for local error monitoring

Access the app at http://localhost:3000

### Database Commands

```shell
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:studio     # Open Drizzle Studio to explore the database
```

### Stripe Integration

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and login:
   ```shell
   stripe login
   ```

2. Set up subscription prices:
   ```shell
   npm run stripe:setup-price
   ```

3. Forward webhooks to your local server:
   ```shell
   npm run stripe:listen
   ```

## Building & Deployment

### Local Production Build

Build with a temporary in-memory database:

```shell
npm run build-local
```

### Production Build

For deployment to Vercel or similar platforms with an external PostgreSQL database:

```shell
npm run build
npm run start
```

Migrations run automatically on first application startup in production.

### Deployment Options

- **Vercel** (recommended) - optimized for Next.js
- Netlify
- AWS Amplify

For production, configure your PostgreSQL database (Neon, AWS RDS, etc.) and set the `DATABASE_URL` environment variable.

## Testing

```shell
npm run test        # Run unit tests with Vitest
npm run test:e2e    # Run E2E tests with Playwright
```

## Code Quality

```shell
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting issues
npm run check:types   # TypeScript type checking
npm run check:deps    # Detect unused dependencies
npm run check:i18n    # Validate translations
```

## Commit Messages

The project uses [Conventional Commits](https://www.conventionalcommits.org/). Use the interactive CLI to write properly formatted commit messages:

```shell
npm run commit
```

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for more information.
