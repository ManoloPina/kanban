import { z } from 'zod';

export const subtaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'The subtask name is required'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'The title name is required'),
  description: z.string().nullable().optional(),
  columnId: z.string().min(1, 'The status is required'),
  subtasks: z.array(subtaskSchema).optional(),
});
