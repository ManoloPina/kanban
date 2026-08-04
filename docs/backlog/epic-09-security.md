# Epic 9 — Segurança & Observabilidade

## Issues

- [ ] [9.1] Rate-limit em sign-in / register (middleware Next.js)
  - **Tipo:** security
- [ ] [9.2] Sanitizar mensagens de erro tRPC expostas ao cliente
  - **Tipo:** security
- [ ] [9.3] Audit log (created/updated/deleted) opcional
  - **Arquivo:** `src/server/db/schema.ts`
  - **Tipo:** feature, security
- [ ] [9.4] Logging estruturado (pino) no middleware tRPC
  - **Arquivo:** `src/server/api/trpc.ts`
  - **Tipo:** feature
- [ ] [9.5] Garantir `ctx.session.user.id` filtra todos os routers (multi-tenant)
  - **Arquivos:** `src/server/api/routers/board.ts`, `column.ts`, `task.ts`
  - **Tipo:** security
