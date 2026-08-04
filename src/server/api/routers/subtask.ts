import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { subtasks } from '@/server/db/schema';
import { createSelectSchema } from 'drizzle-zod';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const subtaskRouter = createTRPCRouter({
  updateSubtask: protectedProcedure
    .input(createSelectSchema(subtasks))
    .mutation(async ({ input }) => {
      try {
        const [subtask] = await db
          .update(subtasks)
          .set(input)
          .where(eq(subtasks.id, input.id))
          .returning();
        return { success: true, subtask };
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
