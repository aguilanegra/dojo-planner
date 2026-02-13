import { test as teardown } from '@playwright/test';

import { cleanupCredentials, readCredentials } from './e2e-credentials';
import { cleanupOrphanedE2EUsers, deleteUserWithOrganization } from './TestUtils';

teardown('cleanup', async () => {
  try {
    const creds = readCredentials();
    process.env.E2E_CLERK_USER_USERNAME = creds.username;
    await deleteUserWithOrganization();
  } catch (error) {
    console.warn('Primary cleanup failed:', error);
  }

  // Catch any remaining orphans (from this or previous runs)
  try {
    await cleanupOrphanedE2EUsers();
  } catch (error) {
    console.warn('Orphan cleanup failed:', error);
  }

  cleanupCredentials();
});
