import { test as teardown } from '@playwright/test';

import { cleanupCredentials, readCredentials } from './e2e-credentials';
import { deleteUserWithOrganization } from './TestUtils';

teardown('cleanup', async () => {
  try {
    const creds = readCredentials();
    process.env.E2E_CLERK_USER_USERNAME = creds.username;
    await deleteUserWithOrganization();
  } catch (error) {
    console.warn('Global teardown failed:', error);
  } finally {
    cleanupCredentials();
  }
});
