/**
 * Authentication guards for ORPC API routes
 *
 * Naming Convention: `guard*` functions guard API access by throwing
 * ORPCError with proper HTTP status codes when authentication/authorization fails.
 *
 * For App Router authentication with redirects, use Auth.ts (`require*` functions) instead.
 *
 * SOC2 Compliance: Guards return userId for audit logging purposes.
 * All mutations should use the returned context for audit trail creation.
 */
import type { AuditContext } from '@/types/Audit';
import type { OrgRole } from '@/types/Auth';
import { auth } from '@clerk/nextjs/server';
import { ORPCError } from '@orpc/server';

/**
 * Guards ORPC procedures requiring authentication.
 * Returns user context for audit logging.
 *
 * @returns Promise containing userId, orgId, and has function for role checking
 * @throws ORPCError with 401 status if userId or orgId is missing
 */
export const guardAuth = async (): Promise<{
  userId: string;
  orgId: string;
  has: (params: { role: OrgRole }) => boolean;
}> => {
  const { userId, orgId, has } = await auth();

  if (!userId || !orgId) {
    throw new ORPCError('Unauthorized', { status: 401 });
  }

  return { userId, orgId, has };
};

/**
 * Guards ORPC procedures requiring specific role permissions.
 * Returns audit context including the verified role.
 *
 * @param role - The required organization role
 * @returns Promise containing audit context (userId, orgId, role)
 * @throws ORPCError with 401 status if not authenticated, 403 if insufficient permissions
 */
export const guardRole = async (role: OrgRole): Promise<AuditContext> => {
  const { userId, orgId, has } = await guardAuth();

  if (!has({ role })) {
    throw new ORPCError('Forbidden', { status: 403 });
  }

  return { userId, orgId, role };
};
