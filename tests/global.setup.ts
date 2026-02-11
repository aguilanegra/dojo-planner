import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { expect, test as setup } from '@playwright/test';

import { writeCredentials } from './e2e-credentials';
import { createUserWithOrganization } from './TestUtils';

setup.describe.configure({ mode: 'serial' });

setup('authenticate with Clerk', async ({ page }) => {
  await clerkSetup();
  await createUserWithOrganization();

  writeCredentials({
    username: process.env.E2E_CLERK_USER_USERNAME!,
    password: process.env.E2E_CLERK_USER_PASSWORD!,
  });

  // Sign in using email-based approach (uses signInTokens + ticket strategy
  // which is more reliable than password strategy for programmatic sign-in)
  await page.goto('/sign-in');
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_USERNAME!,
  });

  // After sign-in, navigate to dashboard to verify auth works
  await page.goto('/dashboard');
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });

  await expect(page.getByRole('heading', { name: 'Performance' })).toBeVisible();

  await page.context().storageState({ path: '.playwright/auth.json' });
});
