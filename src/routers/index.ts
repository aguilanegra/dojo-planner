import { addMembership, changeMembership, create as createMember, listMembershipPlans, remove as removeMember, restore as restoreMember, updateLastAccessed, update as updateMember, updateContactInfo as updateMemberContactInfo } from './Member';
import { list as listMembers } from './Members';
import { create, edit, remove } from './Todo';

export const router = {
  todo: {
    create,
    edit,
    remove,
  },
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
