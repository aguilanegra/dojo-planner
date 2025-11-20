import { create as createMember, remove as removeMember, update as updateMember } from './Member';
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
    remove: removeMember,
  },
};
