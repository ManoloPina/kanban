import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { boards, columns, subtasks, tasks } from '../../db/schema';
import { boardFormSchema } from '@/model/board';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const boardRouter = createTRPCRouter({
  createDemo: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;
      const existing = await db
        .select()
        .from(boards)
        .where(eq(boards.createdBy, userId));

      if (existing.length > 0) return { board: existing[0] };

      const [board] = await db
        .insert(boards)
        .values({
          name: 'Platform Launch',
          createdBy: userId,
        })
        .returning();

      if (!board)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'There was an error on try to inert the demo board',
        });

      const [todo, doing, done] = await db
        .insert(columns)
        .values([
          { name: 'TODO', boardId: board.id },
          { name: 'DOING', boardId: board.id },
          { name: 'DONE', boardId: board.id },
        ])
        .returning();

      if (!todo || !doing || !done)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'There was an error on insert the demo board columns',
        });

      const todos = await db
        .insert(tasks)
        .values([
          { title: 'Build UI for onboarding flow', columnId: todo.id },
          { title: 'Build UI for search', columnId: todo.id },
          { title: 'QA and test all major user journeys', columnId: todo.id },
          {
            title:
              'Research pricing points of various competitors and trial different business models',
            columnId: doing.id,
            description: `We know what we're planning to build for version one. 
          Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.`,
          },
          { title: 'Design settings and search pages', columnId: done.id },
          { title: 'Design settings and search pages', columnId: done.id },
        ])
        .returning();

      if (todos.length === 0)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Was not possible to insert the board demo tasks',
        });

      await db.insert(subtasks).values([
        {
          title: 'Research competitor pricing and business models',
          taskId: todos[3]?.id,
          done: true,
        },
        {
          title: 'Outline a business model that works for our solution',
          taskId: todos[3]?.id,
          done: true,
        },
        {
          title:
            'Talk to potential customers about our proposed solution and ask for fair price expectancy',
          taskId: todos[3]?.id,
          done: false,
        },
      ]);
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
  getBoards: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;
      const _boards = await db.query.boards.findMany({
        where: (u, { eq }) => eq(u.createdBy, userId),
      });
      return _boards;
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
  getBoardById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input: boardId }) => {
      try {
        const board = db.query.boards.findFirst({
          where: (u, { eq }) => eq(u.id, boardId),
          with: {
            columns: {
              with: {
                tasks: {
                  where: (t, { isNull }) => isNull(t.deletedAt),
                  with: {
                    subtasks: true,
                  },
                },
              },
            },
          },
        });
        return board;
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
  createBoard: protectedProcedure
    .input(boardFormSchema)
    .mutation(async ({ input, ctx }) => {
      console.log('🚀 ~ ctx:', ctx);
      console.log('🚀 ~ input:', input);
      return await db.transaction(async (tx) => {
        const [board] = await tx
          .insert(boards)
          .values({
            createdBy: ctx.session.user.id,
            name: input.name.trim(),
          })
          .returning();

        if (!board) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create board',
          });
        }

        const cleanedColumns = input.columns
          .map((column) => ({ name: column.name.trim() }))
          .filter((column) => column.name.length > 0);

        if (cleanedColumns.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'A board must have at least one column',
          });
        }

        await tx.insert(columns).values(
          cleanedColumns.map((column) => ({
            ...column,
            boardId: board.id,
          })),
        );
        return tx.query.boards.findFirst({
          where: (_board, { eq }) => eq(_board.id, board.id),
          with: {
            columns: true,
          },
        });
      });
    }),
});
