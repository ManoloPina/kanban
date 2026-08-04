# Epic 1 — Autenticação & conta

## Issues

- [ ] [1.1] Disparar verificação de e-mail em `useEffect` ao receber token
  - **Arquivo:** `src/app/auth/verify-email/page.tsx`
  - **Tipo:** bug
  - **Contexto:** hoje a mutação pode disparar antes do client montar.
- [ ] [1.2] Esqueci minha senha + reset via Resend
  - **Tipo:** feature
  - **Novos arquivos:** `src/app/auth/forgot-password/page.tsx`, `src/app/auth/reset-password/page.tsx`
  - **Router:** `requestPasswordReset`, `resetPassword`
- [ ] [1.3] Logout funcional (botão + server action)
  - **Arquivo:** `src/app/_components/dashboard-header.tsx`
  - **Tipo:** feature
- [ ] [1.4] Testar callback do provedor Google
  - **Arquivo:** `src/server/auth/config.ts`
  - **Tipo:** tech-debt
- [ ] [1.5] Remover Auth0 não configurado
  - **Arquivo:** `src/server/auth/config.ts`
  - **Tipo:** tech-debt
