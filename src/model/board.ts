import { z } from 'zod';
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

export const columnsSchema = z.object({
  name: z.string().trim().min(1, 'Column name is required').max(255),
});

export const boardFormSchema = z.object({
  name: z.string().trim().min(1, 'Board name is required').max(255),
  columns: z.array(columnsSchema).min(1, 'Add at least one column'),
});
