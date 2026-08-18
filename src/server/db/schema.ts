import { relations, sql } from 'drizzle-orm';
import { index, pgTableCreator, primaryKey } from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';
import { title } from 'process';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `kanban_${name}`);

export const posts = createTable(
  'post',
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index('created_by_idx').on(t.createdById),
    index('name_idx').on(t.name),
  ],
);

export const users = createTable('user', (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: 'date',
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  password: d.varchar({ length: 255 }),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  'account',
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index('account_user_id_idx').on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  'session',
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  }),
  (t) => [index('t_user_id_idx').on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  'verification_token',
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const boards = createTable('board', (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  createdBy: d
    .varchar('created_by', { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: d
    .timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date()),
  deletedAt: d.timestamp('deleted_at', { withTimezone: true }),
}));

export const columns = createTable(
  'column',
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    name: d.varchar({ length: 255 }).notNull(),
    boardId: d
      .varchar('board_id', { length: 255 })
      .notNull()
      .references(() => boards.id),
    position: d.integer('position').notNull().default(0),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
    deletedAt: d.timestamp('deleted_at', { withTimezone: true }),
  }),
  (t) => [index('board_id_position_idx').on(t.boardId, t.position)],
);

export const tasks = createTable('task', (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  title: d.varchar({ length: 255 }).notNull(),
  description: d.varchar({ length: 255 }),
  columnId: d
    .varchar('column_id', { length: 255 })
    .notNull()
    .references(() => columns.id),
  createdAt: d
    .timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date()),
  deletedAt: d.timestamp('deleted_at', { withTimezone: true }),
}));

export const subtasks = createTable('subtask', (d) => ({
  id: d
    .varchar({ length: 255 })
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  title: d.varchar({ length: 255 }).notNull(),
  taskId: d.varchar('task_id', { length: 255 }).references(() => tasks.id),
  done: d.boolean().default(false),
  createdAt: d
    .timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date()),
  deletedAt: d.timestamp('deleted_at', { withTimezone: true }),
}));

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const columnsRelationship = relations(columns, ({ one, many }) => ({
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
  tasks: many(tasks),
}));

export const columnsRelations = relations(columns, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  subtasks: many(subtasks),
}));

export const tasksRelationship = relations(tasks, ({ one, many }) => ({
  column: one(columns, { fields: [tasks.columnId], references: [columns.id] }),
  subtasks: many(subtasks),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, { fields: [subtasks.taskId], references: [tasks.id] }),
}));
