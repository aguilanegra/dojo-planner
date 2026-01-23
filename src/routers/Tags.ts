import { os } from '@orpc/server';
import { getAllTags, getClassTags, getMembershipTags } from '@/services/TagsService';
import { ORG_ROLE } from '@/types/Auth';
import { guardRole } from './AuthGuards';

export const listAll = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const tags = await getAllTags(orgId);

  return { tags };
});

export const listClassTags = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const tags = await getClassTags(orgId);

  return { tags };
});

export const listMembershipTags = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const tags = await getMembershipTags(orgId);

  return { tags };
});
