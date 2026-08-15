# Epic 1 — Autenticação & conta

> **Milestone:** `Epic 1 — Auth`
> **Label pai:** `epic-1-auth`
> **GitHub Project:** #6

## Issues

- [ ] [1.1] Disparar verificação de e-mail em `useEffect` ao receber token
  - **Arquivo(s):** `src/app/auth/verify-email/page.tsx`, `src/server/api/routers/auth.ts` (verificar `verifyEmailToken`)
  - **Tipo:** bug
  - **Severidade:** alta
  - **Contexto:** o link de verificação de e-mail enviado pelo Resend cai em `/auth/verify-email?token=…`. Hoje a mutação `trpc.auth.verifyEmail` é chamada durante o render do componente (no body do `function Page`), o que dispara antes do React hidratar — em SSR pode chamar o procedimento com `ctx.session` indefinido e logar erro no console; em CSR também roda no paint inicial em vez de após o mount.
  - **Comportamento atual:** a mutation roda no render; se o usuário abrir DevTools, vê o request saindo antes do app estar pronto; em modo estrito do React (`reactStrictMode: true` no `next.config.js`) a mutação é chamada **duas vezes**, gerando tokens consumidos e invalidando o link de verificação.
  - **Comportamento esperado:** a mutation só roda depois do `useEffect` (client-only), exatamente uma vez por token, e o loading state aparece enquanto a verificação está em andamento.
  - **Critérios de aceite:**
    - [ ] A chamada `trpc.auth.verifyEmail` está dentro de um `useEffect` com dependência `[token]`
    - [ ] Existe um estado local `isVerifying` que renderiza um skeleton/Spinner
    - [ ] Token duplicado (rodar 2x) consome só uma vez e a segunda chamada retorna erro amigável "Link já utilizado"
    - [ ] React StrictMode não dispara a mutation duas vezes em dev
  - **Como testar:**
    1. Pedir e-mail de verificação no sign-up
    2. Clicar no link do e-mail
    3. Verificar que o request sai **depois** do `load` event do DevTools Network
    4. Repetir o mesmo link → deve mostrar erro "já utilizado", não sucesso
  - **Notas:** considerar mover pra um `route handler` (`app/api/auth/verify/route.ts`) se a verificação puder ser server-side sem precisar do client.

- [ ] [1.2] Esqueci minha senha + reset via Resend
  - **Tipo:** feature
  - **Severidade:** média
  - **Novos arquivos:**
    - `src/app/auth/forgot-password/page.tsx`
    - `src/app/auth/reset-password/page.tsx`
    - `src/server/api/routers/auth.ts` (adicionar procedures)
    - `src/server/auth/password-reset.ts` (token generation/validation)
    - `drizzle/<timestamp>_add_password_reset_tokens.ts` (migration)
  - **Schema necessário:** tabela `password_reset_tokens` (id, userId FK, tokenHash, expiresAt, usedAt NULL) ou colunas no `users` (lastPasswordResetSentAt, passwordResetTokenHash, passwordResetExpiresAt).
  - **Contexto:** usuários não conseguem recuperar acesso se esquecem a senha. Fluxo padrão: pedir e-mail → receber link com token de uso único + expiração curta (15-30 min) → definir nova senha → login.
  - **Routers a criar:**
    - `requestPasswordReset({ email })`: rate-limit (1 req/min), gera token, envia e-mail via Resend com template `password-reset`. Sempre responde 200 mesmo se e-mail não existir (evita enumeração).
    - `resetPassword({ token, newPassword })`: valida token (hash, expiração, não usado), atualiza senha com hash bcrypt/argon2, marca token como usado, invalida sessões existentes (opcional).
  - **UI a criar:**
    - `/auth/forgot-password`: input de e-mail, botão "Enviar link", estado de sucesso genérico
    - `/auth/reset-password?token=…`: input de nova senha + confirmação, validação de força (min 8 chars, 1 número, 1 símbolo), submit
  - **Critérios de aceite:**
    - [ ] Usuário pede reset → recebe e-mail em < 30s com link válido
    - [ ] Link funciona por 30 min, depois expira com mensagem amigável
    - [ ] Token só pode ser usado uma vez (segunda tentativa → erro)
    - [ ] Senha atualizada permite login imediato
    - [ ] Tentativa com e-mail inexistente não vaza informação (mesma resposta 200)
    - [ ] Rate limit: máximo 3 requests por e-mail por hora
  - **Como testar:** fluxo completo + expirar token manualmente (ajustar `expiresAt` no DB) + tentar reusar token.
  - **Notas:** considerar usar NextAuth's `sendVerificationRequest` hook ou fazer manual via Resend SDK; revisar LGPD — registrar timestamp do reset no audit log (issue 9.3).

- [ ] [1.3] Logout funcional (botão + server action)
  - **Arquivo(s):** `src/app/_components/dashboard-header.tsx`, `src/actions/auth.ts` (criar), `src/server/auth/config.ts` (verificar callback `signOut`)
  - **Tipo:** feature
  - **Severidade:** alta
  - **Contexto:** o item "Logout" no dropdown do header (já presente) atualmente não está conectado a nenhuma action — clicar não faz nada. O NextAuth v5 expõe `signOut()` que pode ser chamado de Server Action ou Client Component.
  - **Comportamento atual:** clique no "Logout" → nada acontece visualmente, usuário continua logado.
  - **Comportamento esperado:** clique → request de sign-out → cookies de sessão limpos → redirect pra `/auth/sign-in`.
  - **Critérios de aceite:**
    - [ ] Server Action `logoutAction` em `src/actions/auth.ts` chama `signOut({ redirectTo: "/auth/sign-in" })`
    - [ ] Item "Logout" do dropdown está wrapped num `<form action={logoutAction}>` ou usa `useTransition` + `await signOut()`
    - [ ] Após logout, `ctx.session` é `null` em qualquer chamada tRPC subsequente
    - [ ] Estado de loading enquanto o request está em vôo (botão disabled + spinner)
  - **Como testar:** logar → clicar Logout → ver redirect → tentar acessar `/dashboard` → deve redirecionar pra `/auth/sign-in`.
  - **Notas:** preferir Server Action (não expõe `signOut` no client bundle); verificar se `signOut` no NextAuth v5 precisa de `await` ou não.

- [x] [1.4] ~~Testar callback do provedor Google~~ — **não fará parte do escopo**
  - **Decisão (2026-08-14):** o projeto suportará apenas login por **Credentials** (e-mail/senha) e **GitHub**. O provider Google foi removido do backlog e será removido do código em [1.5].
  - **Motivo:** simplificar o escopo de autenticação e evitar manter configuração/credenciais de OAuth que não serão utilizadas.
  - **Issue relacionada:** #7 (fechada por fora de escopo).

- [x] [1.5] Remover providers não utilizados (Google, Auth0, Discord) — concluído em 2026-08-15
  - **Arquivo(s):** `src/server/auth/config.ts`, `src/env.js`, `.env.example`, `package.json`
  - **Tipo:** tech-debt
  - **Severidade:** média
  - **Contexto:** o escopo de autenticação foi redefinido para Credentials + GitHub apenas. Ainda existiam referências a providers que não seriam usados (Google importado e registrado no auth config; Auth0 importado mas não registrado; Discord listado nas variáveis de ambiente) e variáveis de ambiente desnecessárias. Esses resíduos aumentavam a superfície de ataque e a complexidade de configuração do projeto.
  - **O que foi feito:**
    - [x] Remover `GoogleProvider` e seu import de `src/server/auth/config.ts`
    - [x] Remover `Auth0` e seu import de `src/server/auth/config.ts`
    - [x] Remover comentários/imports referentes a Discord/Google no `src/server/auth/config.ts`
    - [x] Remover `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` do schema em `src/env.js` (server e runtimeEnv)
    - [x] Remover variáveis de providers não utilizados do `.env.example` e orientar limpeza do `.env` local
    - [x] Verificar se existe dependência `@auth0/nextjs-auth0` em `package.json` (não existia)
    - [x] Atualizar lockfile
  - **Critérios de aceite:**
    - [x] Apenas `Credentials` e `GithubProvider` aparecem no array `providers` de `auth.config.ts`
    - [x] Nenhuma referência a `google`, `auth0` (case-insensitive) ou `discord` no `src/server/auth/config.ts` e `src/env.js`
    - [x] `.env.example` contém apenas variáveis necessárias para Credentials, GitHub e banco
    - [x] Build e sign-in com Credentials e GitHub continuam funcionando
    - [x] Issue #7 é fechada com referência a esta tarefa
  - **Como testar:**
    1. Rodar `pnpm check` após as alterações
    2. Fazer sign-in com Credentials
    3. Fazer sign-in com GitHub
    4. Verificar que não há mais erros de variáveis de ambiente faltantes
  - **Notas:**
    - A tarefa original de testar Google ([1.4]) foi cancelada por decisão de produto.
    - `npm run check` ainda aponta erros de lint preexistentes em `src/app/_components/board-dialog/`, mas nenhum deles é causado por esta alteração.
