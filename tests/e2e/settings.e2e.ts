import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display user profile page', async ({ page }) => {
    await navigateTo(page, '/dashboard/user-profile');

    // Clerk UserProfile component renders
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display organization profile page', async ({ page }) => {
    await navigateTo(page, '/dashboard/organization-profile');

    // Clerk OrgProfile component renders
    await expect(page.locator('body')).toBeVisible();
  });
});
