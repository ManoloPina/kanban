import {
  columnDeleteSchema,
  columnInsertSchema,
  columnUpdateSchema,
} from '@/model/column';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { boards, columns, subtasks, tasks } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, isNull, and, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';
import {
  assertBoardOwnership,
  getNextColumnPosition,
  type Transaction,
} from '@/server/db/helpers';

const assertColumn = async (
  tx: Transaction,
  columnId: string,
  userId: string,
): Promise<{ id: string; boardId: string }> => {
  const [column] = await tx
    .select({
      id: columns.id,
      boardId: columns.boardId,
    })
    .from(columns)
    .innerJoin(boards, eq(boards.id, columns.boardId))
    .where(
      and(
        eq(columns.id, columnId),
        eq(boards.createdBy, userId),
        isNull(columns.deletedAt),
        isNull(boards.deletedAt),
      ),
    )
    .limit(1);

  if (!column) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Column not found',
    });
  }

  return column;
};

export const columnRouter = createTRPCRouter({
  getColumnsByBoardId: protectedProcedure
    .input(z.string().uuid().nonempty())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await assertBoardOwnership(db, input, userId);

      const columns = await db.query.columns.findMany({
        where: (u, { eq }) => eq(u.boardId, input),
      });

      return columns;
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
        await assertBoardOwnership(tx, boardId, userId);

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
  createColumn: protectedProcedure
    .input(columnInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await db.transaction(async (tx) => {
        const [board] = await tx
          .select({ id: boards.id })
          .from(boards)
          .where(
            and(
              eq(boards.id, input.boardId),
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

        const position = await getNextColumnPosition(tx, input.boardId);

        const [column] = await tx
          .insert(columns)
          .values({
            name: input.name.trim(),
            boardId: input.boardId,
            position,
          })
          .returning();
        return column;
      });
    }),
  updateColumn: protectedProcedure
    .input(columnUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await db.transaction(async (tx) => {
        await assertColumn(tx, input.id, userId);

        const [column] = await tx
          .update(columns)
          .set({ name: input.name.trim() })
          .where(eq(columns.id, input.id))
          .returning();

        return column;
      });
    }),
  deleteColumn: protectedProcedure
    .input(columnDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const now = new Date();

      return await db.transaction(async (tx) => {
        await assertColumn(tx, input.id, userId);

        await tx
          .update(subtasks)
          .set({ deletedAt: now })
          .where(
            inArray(
              subtasks.taskId,
              tx
                .select({ id: tasks.id })
                .from(tasks)
                .where(eq(tasks.columnId, input.id)),
            ),
          );

        await tx
          .update(tasks)
          .set({ deletedAt: now })
          .where(eq(tasks.columnId, input.id));

        const [column] = await tx
          .update(columns)
          .set({ deletedAt: now })
          .where(eq(columns.id, input.id))
          .returning();
        return column;
      });
    }),
});
