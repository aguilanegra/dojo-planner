import type { EnumValues } from './Enum';

export const ORG_ROLE = {
  ADMIN: 'org:admin',
  ACADEMY_OWNER: 'org:academy_owner',
  FRONT_DESK: 'org:front_desk',
  MEMBER: 'org:member',
  INDIVIDUAL_MEMBER: 'org:individual_member',
} as const;

export type OrgRole = EnumValues<typeof ORG_ROLE>;

export const ORG_PERMISSION = {
  // Add Organization Permissions here
} as const;

export type OrgPermission = EnumValues<typeof ORG_PERMISSION>;
