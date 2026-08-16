# Database Modeling Decisions

This page documents the main modeling choices behind the Kanban schema.

## 1. Kanban data is centered on ownership

The primary shape is:

user -> board -> column -> task -> subtask

This keeps the model aligned with the user experience: a user owns boards, boards contain columns, columns contain tasks, and tasks can be decomposed into subtasks.

## 2. Authentication data stays separate from board data

NextAuth tables are modeled separately from the kanban domain.

- `users` stores the application identity.
- `accounts` stores provider links.
- `sessions` stores login state.
- `verificationTokens` stores email verification tokens.

This separation keeps auth concerns isolated from board/task behavior while still using the same database.

## 3. Soft delete is used for kanban records

Boards, columns, tasks, and subtasks include `deletedAt` instead of hard deletion.

This supports safer deletion flows and makes it easier to preserve history or restore records later if the product evolves in that direction.

## 4. Timestamps are part of the domain model

The main tables track creation and update timestamps.

That gives the app a predictable audit trail for board and task changes without introducing a separate event system.

## 5. The schema is intentionally small

The project keeps a narrow model on purpose.

The current schema is enough to support the app's purpose as a study case for authentication, persistence, typed server actions, and board management.
