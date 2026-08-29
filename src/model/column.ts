import { z } from 'zod/v4';
import { columns } from '@/server/db/schema';
import { createInsertSchema } from 'drizzle-zod';

const baseInsertSchema = createInsertSchema(columns, {
  name: (schema) =>
    schema
      .trim()
      .min(1, 'Column name is required')
      .max(255, 'Column name is too long'),
});

export const columnInsertSchema = baseInsertSchema.pick({
  name: true,
  boardId: true,
});

export const columnUpdateSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Column name is required')
    .max(255, 'Column name is too long'),
});

export const columnDeleteSchema = z.object({
  id: z.uuid(),
});

export const columnNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Column name is required')
    .max(50, 'Column name must be at most 50 characters'),
});

export type ColumnNameInput = z.infer<typeof columnNameSchema>;
export type ColumnInsert = z.infer<typeof columnInsertSchema>;
export type ColumnUpdate = z.infer<typeof columnUpdateSchema>;
