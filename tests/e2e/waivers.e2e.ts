import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { loadSharedCredentials, navigateTo, signIn } from '../TestUtils';

test.describe('Waivers Management', () => {
  test.beforeEach(async ({ page }) => {
    loadSharedCredentials();
    await setupClerkTestingToken({ page });
    await signIn(page);
  });

  test('should show waivers page with heading', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');

    await expect(page.getByRole('heading', { name: /waivers/i })).toBeVisible();
  });

  test('should create a new active waiver template', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');

    await page.getByRole('button', { name: /add waiver/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Use unique names to avoid slug conflicts when Chromium and Firefox run in parallel
    const waiverName = `Liability Waiver ${faker.string.alphanumeric(6)}`;
    await page.getByPlaceholder('e.g. Liability Waiver').fill(waiverName);
    await page.getByPlaceholder('Internal notes about this waiver...').fill('Standard waiver for all members');

    // Fill content with at least 100 characters
    const waiverContent = 'I, the undersigned, acknowledge the inherent risks associated with martial arts training and agree to release and hold harmless the academy from any claims.';
    await page.getByPlaceholder('Enter the full waiver text...').fill(waiverContent);

    await page.getByRole('button', { name: /create waiver/i }).click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(waiverName)).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to waiver detail page', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');

    await page.getByLabel(/edit waiver/i).first().click();

    await expect(page).toHaveURL(/\/dashboard\/waivers\/.+/);
  });

  test('should display content preview and settings', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Content preview area should be visible
    await expect(page.getByText(/waiver|liability|risks/i).first()).toBeVisible();

    // Settings card should show status
    await expect(page.getByText(/active|inactive/i).first()).toBeVisible();
  });

  test('should edit waiver basics', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Click the Settings edit button (not the Content edit button)
    await page.getByLabel('Edit waiver settings').click();

    await expect(page.getByRole('dialog')).toBeVisible();

    const updatedName = `Updated Waiver ${faker.string.alphanumeric(4)}`;
    const nameInput = page.getByPlaceholder('e.g., Standard Adult Waiver');
    await nameInput.clear();
    await nameInput.fill(updatedName);

    await page.getByRole('button', { name: /save changes/i }).click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(updatedName)).toBeVisible();
  });

  test('should edit waiver content and create new version', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Find the content edit button
    const contentArea = page.locator('[class*="col-span"]').first();
    await contentArea.getByRole('button', { name: /edit/i }).click();

    const updatedContent = 'Updated waiver content: I acknowledge the risks of martial arts training and voluntarily participate in all activities. I release the academy from liability for any injuries sustained during training.';
    const contentInput = page.getByPlaceholder('Enter the full waiver text...');
    await contentInput.clear();
    await contentInput.fill(updatedContent);

    await page.getByRole('button', { name: /save changes/i }).click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(/updated waiver content/i)).toBeVisible();
  });

  test('should show version history after content edit', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Version history section should show previous versions
    await expect(page.getByText(/version/i).first()).toBeVisible();
  });

  test('should display version history section', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Verify the version history section is displayed
    await expect(page.getByText(/version history/i)).toBeVisible();
    // Verify current version label is shown
    await expect(page.getByText(/current.*version/i)).toBeVisible();
  });

  test('should manage associated memberships', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');
    await page.getByLabel(/edit waiver/i).first().click();
    await page.waitForLoadState('domcontentloaded');

    // Click the Edit membership associations button by aria-label
    await page.getByLabel('Edit membership associations').click();

    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: /save changes|cancel/i }).first().click();
  });

  test('should navigate to waiver detail and see delete button', async ({ page }) => {
    // Create a waiver with a unique name to avoid slug conflicts in parallel CI
    const deleteWaiverName = `Delete Waiver ${faker.string.alphanumeric(6)}`;
    await navigateTo(page, '/dashboard/waivers');
    await page.getByRole('button', { name: /add waiver/i }).click();

    await page.getByPlaceholder('e.g. Liability Waiver').fill(deleteWaiverName);
    await page.getByPlaceholder('Internal notes about this waiver...').fill('Will be deleted');
    const content = 'This is a temporary waiver content that will be deleted after creation. It needs to be at least one hundred characters long to pass validation requirements.';
    await page.getByPlaceholder('Enter the full waiver text...').fill(content);

    await page.getByRole('button', { name: /create waiver/i }).click();
    await page.waitForLoadState('domcontentloaded');

    // Navigate to detail page via the Edit button on the waiver card
    await expect(page.getByText(deleteWaiverName)).toBeVisible({ timeout: 10000 });

    const waiverCard = page.locator('[class*="card"]').filter({ has: page.getByRole('heading', { name: deleteWaiverName }) });
    await waiverCard.getByLabel(/edit waiver/i).click();
    await page.waitForLoadState('domcontentloaded');

    // Verify the delete button is visible on the detail page
    await expect(page.getByRole('button', { name: /delete/i })).toBeVisible();
  });

  test('should disable create button when form is empty', async ({ page }) => {
    await navigateTo(page, '/dashboard/waivers');

    await page.getByRole('button', { name: /add waiver/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();

    // Create Waiver button is disabled when name and content are empty
    await expect(page.getByRole('button', { name: /create waiver/i })).toBeDisabled();
  });
});
