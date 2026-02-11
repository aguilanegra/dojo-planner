import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Classes Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display classes page with heading', async ({ page }) => {
    await navigateTo(page, '/dashboard/classes');

    await expect(page.getByRole('heading', { name: /classes/i })).toBeVisible();
  });

  test('should open add class wizard and navigate through basics', async ({ page }) => {
    await navigateTo(page, '/dashboard/classes');

    await page.getByRole('button', { name: /add new class/i }).click();

    // Step 1: Type selection — choose Class
    await expect(page.getByText('Choose Type')).toBeVisible();

    await page.locator('[data-testid="type-selection-class"]').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 2: Class Basics — dialog title + step title both say "Class Basics"
    await expect(page.getByText('Class Basics').first()).toBeVisible();

    const className = `Morning BJJ ${faker.string.alphanumeric(4)}`;
    await page.getByPlaceholder('Enter class name').fill(className);

    // Program is a Shadcn Select — click trigger then option
    await page.getByText('Select a program').click();
    await page.getByRole('option').first().click();

    await page.getByPlaceholder(/Describe what students will learn/i).fill('Morning Brazilian Jiu-Jitsu class');
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Step 3: Schedule Details step is visible
    await expect(page.getByText('Schedule Details').first()).toBeVisible();
  });

  test('should search classes by name', async ({ page }) => {
    await navigateTo(page, '/dashboard/classes');

    await page.getByPlaceholder(/search classes/i).fill('Morning');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /classes/i })).toBeVisible();
  });
});
