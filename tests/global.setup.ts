import { clerkSetup, setupClerkTestingToken } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

setup('authenticate with Clerk', async ({ page, context }) => {
  // Initialize Clerk testing environment
  await clerkSetup();

  // Setup Clerk testing token - this injects test credentials into the browser
  await setupClerkTestingToken({ page });

  // Navigate to the app to initialize authenticated session
  await page.goto('/');

  // Wait for Clerk to initialize
  await page.waitForLoadState('domcontentloaded');

  // Save the authenticated state for reuse in tests
  await context.storageState({ path: '.playwright/auth.json' });
});
