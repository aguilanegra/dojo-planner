import { addMembership, changeMembership, create as createMember, listMembershipPlans, remove as removeMember, restore as restoreMember, updateLastAccessed, update as updateMember, updateContactInfo as updateMemberContactInfo } from './Member';
import { list as listMembers } from './Members';

export const router = {
  members: {
    list: listMembers,
  },
  member: {
    create: createMember,
    update: updateMember,
    updateContactInfo: updateMemberContactInfo,
    addMembership,
    changeMembership,
    listMembershipPlans,
    remove: removeMember,
    restore: restoreMember,
    updateLastAccessed,
  },
};
