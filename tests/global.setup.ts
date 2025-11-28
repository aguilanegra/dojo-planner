import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

setup.describe.configure({ mode: 'serial' });

setup('authenticate with Clerk', async ({ page, context }) => {
  try {
    await clerkSetup();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: '.playwright/auth.json' });
  } catch (error) {
    console.error('Clerk authentication setup failed:', error);
    throw error;
  }
});
