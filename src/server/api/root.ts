import { postRouter } from '@/server/api/routers/post';
import { authRouter } from '@/server/api/routers/auth';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { boardRouter } from './routers/board';
import { columnRouter } from '@/server/api/routers/column';
import { subtaskRouter } from '@/server/api/routers/subtask';
import { taskRouter } from '@/server/api/routers/task';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  board: boardRouter,
  column: columnRouter,
  subtask: subtaskRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
