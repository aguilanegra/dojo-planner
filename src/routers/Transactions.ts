import { os } from '@orpc/server';
import { getOrganizationTransactions } from '@/services/TransactionsService';
import { ORG_ROLE } from '@/types/Auth';
import { TransactionListValidation } from '@/validations/TransactionValidation';
import { guardRole } from './AuthGuards';

export const list = os
  .input(TransactionListValidation)
  .handler(async ({ input }) => {
    const { orgId } = await guardRole(ORG_ROLE.FRONT_DESK);

    const transactions = await getOrganizationTransactions(orgId, input ?? undefined);

    return { transactions };
  });
