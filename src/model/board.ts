import {
  tasks,
  type boards,
  type columns,
  type subtasks,
} from '@/server/db/schema';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type Subtask = typeof subtasks.$inferSelect;

export type Task = typeof tasks.$inferSelect & {
  subtasks: Subtask[];
};

export type Column = typeof columns.$inferSelect & {
  tasks: Task[];
};

export type Board = typeof boards.$inferSelect & {
  columns: Column[];
};

export interface IBoard extends Board {
  columns: Column[];
}

export interface IColumn extends Column {
  tasks: Task[];
}

export interface ITask extends Task {
  subtasks: Subtask[];
}

export const insertTaskSchema = createInsertSchema(tasks);

export const selectTaskSchema = createSelectSchema(tasks);
