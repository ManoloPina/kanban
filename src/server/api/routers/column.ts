import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const columnRouter = createTRPCRouter({
  getColumnsByBoardId: protectedProcedure
    .input(z.string().uuid().nonempty())
    .query(async ({ input }) => {
      try {
        const columns = await db.query.columns.findMany({
          where: (u, { eq }) => eq(u.boardId, input),
        });

        return columns;
      } catch (err: unknown) {
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
