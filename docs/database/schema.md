# Database Schema

The kanban domain is modeled around a simple ownership chain:

users -> boards -> columns -> tasks -> subtasks

Authentication tables are also present for NextAuth sessions and provider accounts.

## Related docs

- [Modeling decisions](decisions.md)
- [Detailed schema diagram](schema-detail.md)

## Core entities

- `users`: application users and profile data.
- `boards`: kanban boards owned by a user.
- `columns`: board columns.
- `tasks`: tasks inside a column.
- `subtasks`: smaller checklist items attached to a task.

## Auth entities

- `accounts`: OAuth and credential-linked provider accounts.
- `sessions`: active NextAuth sessions.
- `verificationTokens`: email verification tokens.

## Notes

- Boards, columns, tasks, and subtasks use soft delete fields.
- Timestamps are tracked on the main domain tables.
- The schema keeps the project typed through Drizzle definitions in `src/server/db/schema.ts`.
- The starter `posts` table still exists in the schema file, but it is not part of the kanban domain model.

The detailed diagram below includes the main fields from the current Drizzle schema.
