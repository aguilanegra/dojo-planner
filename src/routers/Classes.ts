import { os } from '@orpc/server';
import { getClassTags, getOrganizationClasses } from '@/services/ClassesService';
import { ORG_ROLE } from '@/types/Auth';
import { guardRole } from './AuthGuards';

export const list = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const classes = await getOrganizationClasses(orgId);

  return { classes };
});

export const tags = os.handler(async () => {
  const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

  const classTags = await getClassTags(orgId);

  return { tags: classTags };
});
