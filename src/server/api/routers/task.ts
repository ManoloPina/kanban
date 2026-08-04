import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { createInsertSchema } from 'drizzle-zod';
import { tasks, subtasks } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod/v4';
import { z as _z } from 'zod';
import type { Subtask } from '@/model/board';

const subtaskSchema = createInsertSchema(subtasks);

const updateTaskInputSchema = createInsertSchema(tasks).extend({
  subtasks: z.array(subtaskSchema).optional(),
});

export const taskRouter = createTRPCRouter({
  updateTask: protectedProcedure
    .input(updateTaskInputSchema)
    .mutation(async ({ input }) => {
      if (!input.id)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Task id is required for update.',
        });
      try {
        const [task] = await db
          .update(tasks)
          .set(input)
          .where(eq(tasks.id, input.id))
          .returning();

        if (input.subtasks && input.subtasks.length > 0) {
          const toUpdate = input.subtasks.filter((s) => s.id);
          const toInsert = input.subtasks.filter((s) => !s.id);
          for (const subtask of toUpdate) {
            if (subtask.id) {
              await db
                .update(subtasks)
                .set(subtask)
                .where(eq(subtasks.id, subtask.id));
            }
          }

          if (toInsert.length > 0) {
            await db.insert(subtasks).values(
              toInsert.map((s) => ({
                ...s,
                taskId: input.id,
              })),
            );
          }
        }

        return { success: true, task };
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: err,
          message,
        });
      }
    }),
  createTask: protectedProcedure
    .input(updateTaskInputSchema)
    .mutation(async ({ input }) => {
      try {
        const { subtasks: _subtasks = [], ...taskValues } = input;
        let createdSubtasks: Subtask[] = [];
        const [task] = await db.insert(tasks).values(taskValues).returning();
        if (_subtasks && _subtasks.length > 0 && task) {
          const withTaskId = _subtasks.map((s) => ({
            ...s,
            taskId: task.id,
          }));
          createdSubtasks = await db
            .insert(subtasks)
            .values(withTaskId)
            .returning();
        }
        return { success: true, task: { ...task, subtasks: createdSubtasks } };
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: err,
          message,
        });
      }
    }),
  deleteTask: protectedProcedure
    .input(_z.string().uuid())
    .mutation(async ({ input }) => {
      try {
        const [removedTask] = await db
          .update(tasks)
          .set({ deletedAt: new Date() })
          .where(eq(tasks.id, input))
          .returning();
        return { success: true, task: removedTask };
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: err,
          message,
        });
      }
    }),
});
