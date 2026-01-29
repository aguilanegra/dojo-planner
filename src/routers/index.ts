import {
  categoryCreate,
  categoryList,
  categoryRemove,
  categoryUpdate,
  create as createCatalogItem,
  get as getCatalogItem,
  imageCreate,
  imageRemove,
  list as listCatalogItems,
  listForKiosk as listCatalogItemsForKiosk,
  remove as removeCatalogItem,
  sizeCreate,
  sizeRemove,
  sizeUpdate,
  stockAdjust,
  update as updateCatalogItem,
} from './Catalog';
import { tags as classTags, list as listClasses } from './Classes';
import { listActive as listActiveCoupons, list as listCoupons } from './Coupons';
import { list as listEvents } from './Events';
import { addMembership, changeMembership, create as createMember, listMembershipPlans, remove as removeMember, restore as restoreMember, updateLastAccessed, update as updateMember, updateContactInfo as updateMemberContactInfo } from './Member';
import { list as listMembers } from './Members';
import { listAll as listAllTags, listClassTags, listMembershipTags } from './Tags';

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
  classes: {
    list: listClasses,
    tags: classTags,
  },
  events: {
    list: listEvents,
  },
  tags: {
    listAll: listAllTags,
    listClassTags,
    listMembershipTags,
  },
  coupons: {
    list: listCoupons,
    listActive: listActiveCoupons,
  },
  catalog: {
    list: listCatalogItems,
    listForKiosk: listCatalogItemsForKiosk,
    get: getCatalogItem,
    create: createCatalogItem,
    update: updateCatalogItem,
    remove: removeCatalogItem,
    sizeCreate,
    sizeUpdate,
    sizeRemove,
    stockAdjust,
    categoryList,
    categoryCreate,
    categoryUpdate,
    categoryRemove,
    imageCreate,
    imageRemove,
  },
};
