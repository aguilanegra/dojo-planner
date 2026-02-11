import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { createUserWithOrganization, deleteUserWithOrganization, signIn } from '../TestUtils';

// Auth tests create their own users — clear the global storageState
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test.describe('Sign Up Flow', () => {
    test.afterEach(async () => {
      await deleteUserWithOrganization();
    });

    test('should create user and organization via API and access dashboard', async ({ page }) => {
      await createUserWithOrganization();

      await setupClerkTestingToken({ page });
      await signIn(page);

      await expect(page.getByRole('heading', { name: 'Performance' })).toBeVisible();

      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Sign In Flow', () => {
    test.beforeAll(async () => {
      await createUserWithOrganization();
    });

    test.afterAll(async () => {
      await deleteUserWithOrganization();
    });

    test('should sign in with valid credentials', async ({ page }) => {
      await setupClerkTestingToken({ page });
      await signIn(page);

      await expect(page).toHaveURL(/\/dashboard/);

      await expect(page.getByRole('heading', { name: 'Performance' })).toBeVisible();
    });
  });

  test.describe('Organization Switching', () => {
    let secondOrgName: string;

    test.beforeAll(async () => {
      await createUserWithOrganization();

      // Create a second org via API so the switcher has multiple options
      const { createClerkClient } = await import('@clerk/backend');
      const authClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
      const { data: users } = await authClient.users.getUserList({
        emailAddress: [process.env.E2E_CLERK_USER_USERNAME!],
      });
      secondOrgName = faker.company.name();
      await authClient.organizations.createOrganization({
        name: secondOrgName,
        createdBy: users[0]!.id,
      });
    });

    test.afterAll(async () => {
      await deleteUserWithOrganization();
    });

    test('should switch to a different organization', async ({ page }) => {
      await setupClerkTestingToken({ page });
      await signIn(page);

      // Open the custom org selector
      const orgSwitcher = page.getByLabel('Open organization switcher');

      await expect(orgSwitcher).toBeVisible();

      await orgSwitcher.click();

      // Select the second organization
      await page.getByRole('option', { name: secondOrgName }).click();

      // Verify the switcher now shows the second org name
      await expect(orgSwitcher).toContainText(secondOrgName, { timeout: 10000 });
    });
  });
});
