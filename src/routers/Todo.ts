import { ORPCError, os } from '@orpc/server';
import { logger } from '@/libs/Logger';
import { audit } from '@/services/AuditService';
import { createTodo, deleteTodo, updateTodo } from '@/services/TodoService';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from '@/types/Audit';
import { ORG_ROLE } from '@/types/Auth';
import { DeleteTodoValidation, EditTodoValidation, TodoValidation } from '@/validations/TodoValidation';
import { guardAuth, guardRole } from './AuthGuards';

export const create = os
  .input(TodoValidation)
  .handler(async ({ input }) => {
    const context = await guardAuth();

    try {
      const todo = await createTodo(input, context.orgId);

      logger.info('A new todo has been created');

      // Audit the todo creation
      await audit(context, AUDIT_ACTION.TODO_CREATE, AUDIT_ENTITY_TYPE.TODO, {
        entityId: todo[0]?.id?.toString(),
        status: 'success',
      });

      return {
        id: todo[0]?.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Audit the failure
      await audit(context, AUDIT_ACTION.TODO_CREATE, AUDIT_ENTITY_TYPE.TODO, {
        status: 'failure',
        error: errorMessage,
      });

      throw error;
    }
  });

export const edit = os
  .input(EditTodoValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const result = await updateTodo(input, context.orgId);

      if (result.length === 0) {
        throw new ORPCError('Todo not found', { status: 404 });
      }

      logger.info('A todo has been updated');

      // Audit the todo update
      await audit(context, AUDIT_ACTION.TODO_UPDATE, AUDIT_ENTITY_TYPE.TODO, {
        entityId: String(input.id),
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Audit the failure
      await audit(context, AUDIT_ACTION.TODO_UPDATE, AUDIT_ENTITY_TYPE.TODO, {
        entityId: String(input.id),
        status: 'failure',
        error: errorMessage,
      });

      throw error;
    }
  });

export const remove = os
  .input(DeleteTodoValidation)
  .handler(async ({ input }) => {
    const context = await guardRole(ORG_ROLE.ADMIN);

    try {
      const result = await deleteTodo(input.id, context.orgId);

      if (result.length === 0) {
        throw new ORPCError('Todo not found', { status: 404 });
      }

      logger.info('A todo entry has been deleted');

      // Audit the todo deletion
      await audit(context, AUDIT_ACTION.TODO_DELETE, AUDIT_ENTITY_TYPE.TODO, {
        entityId: String(input.id),
        status: 'success',
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Audit the failure
      await audit(context, AUDIT_ACTION.TODO_DELETE, AUDIT_ENTITY_TYPE.TODO, {
        entityId: String(input.id),
        status: 'failure',
        error: errorMessage,
      });

      throw error;
    }
  });
