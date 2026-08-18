import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { boards, columns } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, isNull, and } from 'drizzle-orm';
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
  reorderColumns: protectedProcedure
    .input(
      z.object({
        boardId: z.string().uuid(),
        orderedColumnIds: z.array(z.string().uuid()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { boardId, orderedColumnIds } = input;
      const userId = ctx.session.user.id;

      return await db.transaction(async (tx) => {
        const [board] = await tx
          .select({ id: boards.id })
          .from(boards)
          .where(
            and(
              eq(boards.id, boardId),
              eq(boards.createdBy, userId),
              isNull(boards.deletedAt),
            ),
          )
          .limit(1);

        if (!board) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Board not found',
          });
        }

        const existingColumns = await tx.query.columns.findMany({
          where: (c, { eq, and, isNull }) =>
            and(eq(c.boardId, boardId), isNull(c.deletedAt)),
        });

        const existingIds = new Set(existingColumns.map((c) => c.id));
        const incomingIds = new Set(orderedColumnIds);

        if (existingIds.size !== incomingIds.size) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Ordered column IDs do not match board columns',
          });
        }

        for (const id of orderedColumnIds) {
          if (!existingIds.has(id)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Column ${id} does not belong to this board or is deleted`,
            });
          }
        }

        for (const [index, id] of orderedColumnIds.entries()) {
          await tx
            .update(columns)
            .set({ position: index })
            .where(eq(columns.id, id));
        }

        return tx.query.columns.findMany({
          where: (c, { eq, and, isNull }) =>
            and(eq(c.boardId, boardId), isNull(c.deletedAt)),
          orderBy: (c, { asc }) => [asc(c.position)],
        });
      });
    }),
});
