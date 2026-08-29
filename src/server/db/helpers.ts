import { eq, isNull, and, sql } from 'drizzle-orm';
import { columns, boards } from './schema';
import { db } from './index';
import { TRPCError } from '@trpc/server';

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Database = typeof db;
export type DatabaseOrTransaction = Database | Transaction;

export async function getNextColumnPosition(
  tx: DatabaseOrTransaction,
  boardId: string,
): Promise<number> {
  const [result] = await tx
    .select({
      maxPosition: sql<number>`COALESCE(MAX(${columns.position}), 0)`,
    })
    .from(columns)
    .where(and(eq(columns.boardId, boardId), isNull(columns.deletedAt)));

  return (result?.maxPosition ?? 0) + 1;
}

export async function assertBoardOwnership(
  tx: DatabaseOrTransaction,
  boardId: string,
  userId: string,
): Promise<{ id: string }> {
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

  return board;
}
