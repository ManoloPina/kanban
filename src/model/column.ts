import { z as _z } from 'zod/v4';
import { columns } from '@/server/db/schema';
import { createInsertSchema } from 'drizzle-zod';

export const columnInsertSchema = createInsertSchema(columns);

export type ColumInsert = typeof columns.$inferInsert;
