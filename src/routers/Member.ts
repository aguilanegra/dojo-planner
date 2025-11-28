import { randomUUID } from 'node:crypto';
import { auth } from '@clerk/nextjs/server';
import { ORPCError, os } from '@orpc/server';
import { logger } from '@/libs/Logger';
import { createMember, flagMemberForDeletion, restoreFlaggedMember, updateMember } from '@/services/MembersService';
import { ORG_ROLE } from '@/types/Auth';
import { DeleteMemberValidation, EditMemberValidation, MemberValidation } from '@/validations/MemberValidation';
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
        subscriptionPlan: input.subscriptionPlan,
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

    const result = await flagMemberForDeletion(input.id, orgId);

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info(`Member flagged for deletion: ${input.id}`);

    return {};
  });

export const restore = os
  .input(DeleteMemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    const result = await restoreFlaggedMember(input.id, orgId);

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info(`Member restored from deletion: ${input.id}`);

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
