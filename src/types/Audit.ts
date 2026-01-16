import type { OrgRole } from './Auth';

/**
 * Supported audit actions for SOC2 compliance tracking.
 * Format: {entity}.{operation}
 */
export const AUDIT_ACTION = {
  // Member operations
  MEMBER_CREATE: 'member.create',
  MEMBER_UPDATE: 'member.update',
  MEMBER_REMOVE: 'member.remove',
  MEMBER_RESTORE: 'member.restore',
  MEMBER_UPDATE_CONTACT: 'member.updateContact',
  MEMBER_UPDATE_ACCESS: 'member.updateAccess',
  MEMBER_ADD_MEMBERSHIP: 'member.addMembership',
  MEMBER_CHANGE_MEMBERSHIP: 'member.changeMembership',

  // Todo operations
  TODO_CREATE: 'todo.create',
  TODO_UPDATE: 'todo.update',
  TODO_DELETE: 'todo.delete',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

/**
 * Entity types that can be audited.
 */
export const AUDIT_ENTITY_TYPE = {
  MEMBER: 'member',
  TODO: 'todo',
  MEMBERSHIP: 'membership',
} as const;

export type AuditEntityType = (typeof AUDIT_ENTITY_TYPE)[keyof typeof AUDIT_ENTITY_TYPE];

/**
 * Status of the audited operation.
 */
export type AuditStatus = 'success' | 'failure';

/**
 * Represents a change to a field during an update operation.
 */
export type AuditFieldChange = {
  before: unknown;
  after: unknown;
};

/**
 * Context about the authenticated user performing the action.
 * Extracted from Clerk auth and passed through guards.
 */
export type AuditContext = {
  /** Clerk user ID performing the action */
  userId: string;
  /** Organization ID for multi-tenant isolation */
  orgId: string;
  /** User's role at time of action */
  role?: OrgRole;
};

/**
 * Full audit event structure for SOC2 compliance.
 * Answers: WHO did WHAT to WHICH entity WHEN
 */
export type AuditEvent = {
  /** Clerk user ID - WHO performed the action */
  userId: string;
  /** Organization ID - WHICH ORG context */
  orgId: string;
  /** Action performed - WHAT was done */
  action: AuditAction;
  /** Type of entity affected */
  entityType: AuditEntityType;
  /** ID of the affected entity - WHICH entity */
  entityId?: string;
  /** Timestamp of the action - WHEN */
  timestamp: Date;
  /** User's role at time of action */
  role?: OrgRole;
  /** Operation outcome */
  status: AuditStatus;
  /** Field-level changes for update operations */
  changes?: Record<string, AuditFieldChange>;
  /** Error message if status is 'failure' */
  error?: string;
  /** Client IP address (when available) */
  ipAddress?: string;
  /** User agent string (when available) */
  userAgent?: string;
  /** Request correlation ID for tracing */
  requestId?: string;
};

/**
 * Input for creating an audit event (timestamp auto-generated).
 */
export type AuditEventInput = Omit<AuditEvent, 'timestamp'>;
