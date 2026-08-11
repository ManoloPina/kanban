# Kanban Documentation

This folder collects the project documentation for the Kanban app.

The structure follows the same idea used in the reference repository: product docs, architecture notes, data modeling, and a backlog that can evolve into GitHub issues and milestones.

## What this project is

Kanban is a study-focused full-stack application for organizing work in boards, columns, tasks, and subtasks.

It combines authentication, persisted data, and a simple workflow UI so the codebase can be used as a practical reference for Next.js, tRPC, Drizzle, and NextAuth.

## Documentation map

- [Product overview](product/overview.md)
- [Navigation flow](product/navigation-flow.md)
- [Architecture](architecture.md)
- [Database schema](database/schema.md)
- [Backlog and epics](backlog/README.md)

## Project scope

- Users can sign up, sign in, and verify email.
- Boards group work into columns.
- Tasks belong to columns and can contain subtasks.
- The app is intentionally focused on workflow management, not on general-purpose project management features.

## Useful entry points in the codebase

- App routes live in `src/app`.
- Shared UI lives in `src/app/_components`.
- The API layer lives in `src/server/api`.
- Database modeling lives in `src/server/db`.
- Authentication setup lives in `src/server/auth`.
