import { os } from '@orpc/server';
import { getOrganizationEvents } from '@/services/EventsService';
import { ORG_ROLE } from '@/types/Auth';
import { guardRole } from './AuthGuards';

export const list = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const events = await getOrganizationEvents(orgId);

  return { events };
});
