import { clerkClient } from '@clerk/nextjs/server';
import { ORPCError, os } from '@orpc/server';
import { logger } from '@/libs/Logger';
import { createMember, deleteMember, updateMember } from '@/services/MembersService';
import { ORG_ROLE } from '@/types/Auth';
import { DeleteMemberValidation, EditMemberValidation, MemberValidation } from '@/validations/MemberValidation';
import { guardRole } from './AuthGuards';

export const create = os
  .input(MemberValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.ADMIN);

    try {
      // Step 1: Create the user in Clerk
      const clerk = await clerkClient();
      let clerkUserId: string;

      try {
        const clerkUser = await clerk.users.createUser({
          emailAddress: [input.email],
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phone ? [input.phone] : undefined,
        });
        clerkUserId = clerkUser.id;
      } catch (clerkError) {
        // Check if user already exists
        if (clerkError instanceof Error && clerkError.message.includes('already exists')) {
          // Find the existing user
          const users = await clerk.users.getUserList({ emailAddress: [input.email] });
          const existingUser = users.data?.[0];
          if (existingUser?.id) {
            clerkUserId = existingUser.id;
          } else {
            throw new ORPCError('Failed to create or find user in Clerk', { status: 400 });
          }
        } else {
          throw new ORPCError(`Failed to create user in Clerk: ${clerkError instanceof Error ? clerkError.message : 'Unknown error'}`, { status: 400 });
        }
      }

      // Step 2: Add the user to the organization in Clerk
      try {
        await clerk.organizations.createOrganizationMembership({
          organizationId: orgId,
          userId: clerkUserId,
          role: 'basic_member',
        });
      } catch (clerkOrgError) {
        throw new ORPCError(`Failed to add user to organization in Clerk: ${clerkOrgError instanceof Error ? clerkOrgError.message : 'Unknown error'}`, { status: 400 });
      }

      // Step 3: Create the member record in the local database
      const member = await createMember({
        id: clerkUserId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        memberType: input.memberType,
        subscriptionPlan: input.subscriptionPlan,
        status: 'active',
        address: input.address,
      }, orgId);

      logger.info(`A new member has been created: ${clerkUserId}`);

      return {
        id: member[0]?.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to create member: ${errorMessage}`);
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

    const result = await deleteMember(input.id, orgId);

    if (result.length === 0) {
      throw new ORPCError('Member not found', { status: 404 });
    }

    logger.info('A member has been deleted');

    return {};
  });
