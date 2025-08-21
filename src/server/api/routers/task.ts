import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { createInsertSchema } from 'drizzle-zod';
import { tasks } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const taskRouter = createTRPCRouter({
  updateTask: protectedProcedure
    .input(createInsertSchema(tasks))
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
});
