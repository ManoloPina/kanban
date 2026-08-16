# Product Overview

Kanban is a practical study case for a workflow board application.

The goal is to model the core lifecycle of work items in a small but realistic product:

1. A user authenticates.
2. The user creates or opens a board.
3. The board is split into columns.
4. Tasks are created inside columns.
5. Tasks can be expanded with subtasks.

## Main user goals

- Create and manage boards.
- Organize work into columns.
- Track tasks inside each column.
- Break tasks into smaller subtasks.
- Move through the app with a focused board-first interface.

## Current scope

- Authentication supports email/password and OAuth providers.
- Boards, columns, tasks, and subtasks are persisted in PostgreSQL.
- The UI is built around a dashboard and board detail experience.
- The project is intentionally narrow so it can stay usable as a reference implementation.

## Out of scope for now

- Time tracking.
- Rich project reporting.
- Multi-workspace or team administration features.
- Complex dependency graphs between tasks.
