# Kanban

This project is a Kanban board built for educational purposes only. It is intended to be a practical study case for a full-stack application with authentication, database persistence, and task organization in columns.

## Stack

- Next.js
- React
- TypeScript
- tRPC
- Drizzle ORM
- PostgreSQL
- NextAuth
- Tailwind CSS
- Radix UI and shadcn/ui

## Setup

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   copy .env.example .env
   ```

3. Fill in the environment variables in `.env`. The main ones are defined in `src/env.js` and include the database URL, authentication secret, and the provider credentials configured in the project.

4. Prepare the database with Drizzle:

   ```bash
   npm run db:generate
   npm run db:push
   ```

## How to Run

To start the application in development mode:

```bash
npm run dev
```

If you need to open the database UI, use:

```bash
npm run db:studio
```

## Purpose

The purpose of this project is to provide a practical Kanban base for creating, organizing, and tracking tasks in columns, simulating a simple workflow management process.
