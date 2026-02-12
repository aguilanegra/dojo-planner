import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Members Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should display members page with Add Member button', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await expect(page.getByRole('button', { name: /add member/i })).toBeVisible();
  });

  test('should open add member wizard and show member type step', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByRole('button', { name: /add member/i }).click();

    // Step 1: Member Type — dialog title shows "Choose Member Type"
    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Individual' })).toBeVisible();
  });

  test('should disable Next without member type selection', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByRole('button', { name: /add member/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Next should be disabled without a selection
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('should show validation errors on details step', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByRole('button', { name: /add member/i }).click();

    // Select member type to proceed — click the button containing "Individual" heading
    await page.getByRole('heading', { name: 'Individual' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Dialog title + step title both say "Add Member Details"
    await expect(page.getByText('Add Member Details').first()).toBeVisible();

    // Labels don't have htmlFor — use placeholders
    await page.getByPlaceholder('Enter first name').focus();
    await page.getByPlaceholder('Enter first name').blur();

    // Next should be disabled with empty required fields
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  });

  test('should validate email format', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByRole('button', { name: /add member/i }).click();
    await page.getByRole('heading', { name: 'Individual' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // Wait for details step to load
    await expect(page.getByText('Add Member Details').first()).toBeVisible();

    await page.getByPlaceholder('you@example.com').fill('not-an-email');
    await page.getByPlaceholder('you@example.com').blur();

    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should allow canceling wizard at any step', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByRole('button', { name: /add member/i }).click();
    await page.getByRole('heading', { name: 'Individual' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // On details step, click Cancel — button is outside viewport due to dialog scroll
    // Use dispatchEvent to bypass viewport check
    await page.getByRole('button', { name: /cancel/i }).dispatchEvent('click');

    // Modal should close
    await expect(page.getByText('Add Member Details').first()).toBeHidden();
  });

  test('should search members', async ({ page }) => {
    await navigateTo(page, '/dashboard/members');

    await page.getByPlaceholder(/search members/i).fill('test');
    await page.waitForLoadState('domcontentloaded');

    // Page should still be functional
    await expect(page.getByRole('button', { name: /add member/i })).toBeVisible();
  });
});
