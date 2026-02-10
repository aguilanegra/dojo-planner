import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { memberSchema, transactionSchema } from '@/models/Schema';

export type TransactionData = {
  id: string;
  memberId: string;
  memberFirstName: string | null;
  memberLastName: string | null;
  transactionType: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  description: string | null;
  processedAt: Date | null;
  createdAt: Date;
};

export type TransactionListOptions = {
  limit?: number;
  offset?: number;
  status?: string;
  transactionType?: string;
};

export async function getOrganizationTransactions(
  organizationId: string,
  options?: TransactionListOptions,
): Promise<TransactionData[]> {
  const conditions = [eq(transactionSchema.organizationId, organizationId)];

  if (options?.status) {
    conditions.push(eq(transactionSchema.status, options.status));
  }
  if (options?.transactionType) {
    conditions.push(eq(transactionSchema.transactionType, options.transactionType));
  }

  const rows = await db
    .select({
      id: transactionSchema.id,
      memberId: transactionSchema.memberId,
      memberFirstName: memberSchema.firstName,
      memberLastName: memberSchema.lastName,
      transactionType: transactionSchema.transactionType,
      amount: transactionSchema.amount,
      currency: transactionSchema.currency,
      status: transactionSchema.status,
      paymentMethod: transactionSchema.paymentMethod,
      description: transactionSchema.description,
      processedAt: transactionSchema.processedAt,
      createdAt: transactionSchema.createdAt,
    })
    .from(transactionSchema)
    .innerJoin(memberSchema, eq(transactionSchema.memberId, memberSchema.id))
    .where(and(...conditions))
    .orderBy(desc(transactionSchema.createdAt))
    .limit(options?.limit ?? 500)
    .offset(options?.offset ?? 0);

  return rows;
}
