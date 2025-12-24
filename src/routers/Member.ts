import { randomUUID } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { ORPCError, os } from '@orpc/server';
import { z } from 'zod';
import { logger } from '@/libs/Logger';
import { addMemberMembership, changeMemberMembership, createMember, getMembershipPlans, updateMember, updateMemberContactInfo, updateMemberStatus } from '@/services/MembersService';
import { ORG_ROLE } from '@/types/Auth';
import { DeleteMemberValidation, EditMemberValidation, MemberValidation, UpdateMemberContactInfoValidation } from '@/validations/MemberValidation';
import { guardRole } from './AuthGuards';

export const create = os
  .input(MemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    try {
      // Create the member record in the database with a generated UUID
      const memberId = randomUUID();
      const member = await createMember({
        id: memberId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        memberType: input.memberType,
        status: 'active',
        address: input.address,
        ...(input.photoUrl && { photoUrl: input.photoUrl }),
      }, orgId);

      logger.info(`A new member has been created: ${memberId}`);

      return {
        id: member[0]?.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create member: ${errorMessage}`, {
        error,
        errorString: String(error),
        errorKeys: error instanceof Error ? Object.keys(error) : [],
      });
      throw error instanceof ORPCError ? error : new ORPCError('Failed to create member. Please try again.', { status: 500 });
    }
  });

export const update = os
  .input(EditMemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    const result = await updateMember({ ...input, status: 'active' }, orgId);

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info('A member has been updated');

    return {};
  });

export const remove = os
  .input(DeleteMemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    const result = await updateMemberStatus(input.id, orgId, 'cancelled');

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info(`Member cancelled: ${input.id}`);

    return {};
  });

export const restore = os
  .input(DeleteMemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    const result = await updateMemberStatus(input.id, orgId, 'active');

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info(`Member restored to active: ${input.id}`);

    return {};
  });

export const updateLastAccessed = os
  .handler(async () => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new ORPCError('Unauthorized', { status: 401 });
    }

    // Note: This function is a placeholder since members are now independent of Clerk
    // and use UUID-based IDs. To track member access, implement a mapping between
    // Clerk users and member records, or use a separate user activity tracking system.
    logger.info(`Access tracking called for user: ${userId} in org: ${orgId}`);
    return {};
  });

export const updateContactInfo = os
  .input(UpdateMemberContactInfoValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    const result = await updateMemberContactInfo(input, orgId);

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info(`Member contact info updated: ${input.id}`);

    return {};
  });

// Membership-related validation schemas
const AddMembershipValidation = z.object({
  memberId: z.string().min(1),
  membershipPlanId: z.string().min(1),
});

const ChangeMembershipValidation = z.object({
  memberId: z.string().min(1),
  newMembershipPlanId: z.string().min(1),
});

export const addMembership = os
  .input(AddMembershipValidation)
  .handler(async ({ input }) => {
    await guardRole(ORG_ROLE.ADMIN);

    try {
      const result = await addMemberMembership(input.memberId, input.membershipPlanId);

      if (result.length === 0) {
        throw new ORPCError('Failed to add membership', { status: 500 });
      }

      logger.info(`Membership added for member: ${input.memberId}, planId: ${input.membershipPlanId}`);

      return { id: result[0]?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to add membership: ${errorMessage}`);
      throw error instanceof ORPCError ? error : new ORPCError('Failed to add membership. Please try again.', { status: 500 });
    }
  });

export const changeMembership = os
  .input(ChangeMembershipValidation)
  .handler(async ({ input }) => {
    await guardRole(ORG_ROLE.ADMIN);

    try {
      const result = await changeMemberMembership(input.memberId, input.newMembershipPlanId);

      if (result.length === 0) {
        throw new ORPCError('Failed to change membership', { status: 500 });
      }

      logger.info(`Membership changed for member: ${input.memberId}, new planId: ${input.newMembershipPlanId}`);

      return { id: result[0]?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to change membership: ${errorMessage}`);
      throw error instanceof ORPCError ? error : new ORPCError('Failed to change membership. Please try again.', { status: 500 });
    }
  });

export const listMembershipPlans = os
  .handler(async () => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    try {
      const plans = await getMembershipPlans(orgId);
      return { plans };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to fetch membership plans: ${errorMessage}`);
      throw error instanceof ORPCError ? error : new ORPCError('Failed to fetch membership plans. Please try again.', { status: 500 });
    }
  });
