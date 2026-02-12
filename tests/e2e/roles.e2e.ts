import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Roles Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display roles page with role information', async ({ page }) => {
    await navigateTo(page, '/dashboard/roles');

    await expect(page.getByRole('heading', { name: /roles/i })).toBeVisible();
  });
});
