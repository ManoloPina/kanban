# Epic 7 — Qualidade

## Issues

- [ ] [7.1] Setup Vitest + React Testing Library
  - **Tipo:** feature
- [ ] [7.2] Testes unitários dos schemas Zod
  - **Arquivos:** `src/model/board.ts`, `src/model/task.ts`, `src/model/auth.ts`
  - **Tipo:** feature
- [ ] [7.3] Testes de componentes (`TaskDialog`, `BoardForm`, `TaskForm`)
  - **Pasta:** `src/app/_components`
  - **Tipo:** feature
- [ ] [7.4] Testes de routers tRPC com Postgres de teste
  - **Pasta:** `src/server/api/routers`
  - **Tipo:** feature
- [ ] [7.5] Playwright E2E: sign-up → verify → login → board → task → mover
  - **Tipo:** feature
- [ ] [7.6] Resolver conflito de imports `zod` vs `zod/v4` em `task.ts`
  - **Arquivo:** `src/server/api/routers/task.ts`
  - **Tipo:** tech-debt
- [ ] [7.7] Habilitar `strict` no `tsconfig.json` e resolver warnings
  - **Tipo:** tech-debt
- [ ] [7.8] Revisar `actions/auth.ts` chamando tRPC server caller
  - **Arquivo:** `src/actions/auth.ts`
  - **Tipo:** tech-debt
