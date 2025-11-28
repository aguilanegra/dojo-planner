import { os } from '@orpc/server';
import { logger } from '@/libs/Logger';
import { getOrganizationMembers } from '@/services/MembersService';
import { ORG_ROLE } from '@/types/Auth';
import { guardRole } from './AuthGuards';

export const list = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.ADMIN);

  logger.info(`[Members.list] Fetching members for organization: ${orgId}`);

  const members = await getOrganizationMembers(orgId);

  logger.info(`[Members.list] Found ${members.length} members for organization: ${orgId}`);

  return {
    members,
  };
});
