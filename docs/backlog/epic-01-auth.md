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

- [ ] [1.4] Testar callback do provedor Google
  - **Arquivo(s):** `src/server/auth/config.ts`, `src/server/auth/index.ts`, `prisma/seed.ts` (se houver), e variáveis `.env`
  - **Tipo:** tech-debt
  - **Severidade:** média
  - **Contexto:** o provider Google está configurado em `auth.config.ts` mas nunca foi testado em ambiente real. Não há evidência de que `profile → user creation → account linking` funcionam corretamente. Possíveis bugs: `email_verified` não sendo respeitado, `picture` muito grande, callback URL errada.
  - **O que validar (manualmente):**
    - [ ] Login com conta Google nova (sem conta previa) → cria user com `email`, `name`, `image` corretos
    - [ ] Login com mesma conta Google segunda vez → reconhece user existente, não duplica
    - [ ] Email Google é o mesmo de uma conta credentials já existente → NextAuth faz account linking automaticamente (ou não, dependendo config)
    - [ ] `email_verified = false` do Google → bloqueia criação de conta
    - [ ] Avatar do Google é persistido e exibido no header/sidebar
    - [ ] Refresh do cookie de sessão funciona (sessão dura 30 dias, etc.)
  - **O que validar (automatizado):**
    - [ ] Teste E2E (Playwright) que mocka o OAuth callback e valida que a sessão é criada (issue 7.5)
  - **Como testar manualmente:**
    1. Configurar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env`
    2. Adicionar callback URL no Google Cloud Console
    3. Rodar `pnpm dev`, acessar `/auth/sign-in`
    4. Clicar em "Continuar com Google" → completar OAuth
    5. Verificar Network tab: callback redireciona pra `/dashboard` com cookie de sessão
  - **Notas:** documentar qualquer inconsistência encontrada como issue separada; capturar screenshot do user criado no DB pra evidência.

- [ ] [1.5] Remover Auth0 não configurado
  - **Arquivo(s):** `src/server/auth/config.ts`, `package.json` (checar dep `@auth0/nextjs-auth0`), `.env.example`
  - **Tipo:** tech-debt
  - **Severidade:** baixa
  - **Contexto:** pode haver resíduo de configuração do Auth0 (provider, import, variável de ambiente) que nunca foi usado nesse projeto. Remover pra evitar confusão e reduzir superfície de ataque.
  - **O que fazer:**
    - [ ] Procurar `auth0` no codebase: `grep -ri auth0 src/`
    - [ ] Remover import/provider de `auth.config.ts` se existir
    - [ ] Remover dependência `@auth0/nextjs-auth0` do `package.json` se estiver lá
    - [ ] Remover variáveis `AUTH0_*` do `.env.example`
    - [ ] Rodar `pnpm install` pra atualizar lockfile
    - [ ] Garantir que o build (`pnpm build`) continua passando
  - **Critérios de aceite:**
    - [ ] Nenhuma referência a `auth0` no código (case-insensitive)
    - [ ] `package.json` sem dependências Auth0
    - [ ] Build e sign-in com Credentials e GitHub continuam funcionando
  - **Como testar:** rodar sign-in flow completo (Credentials + GitHub) após a remoção; nada deve quebrar.
  - **Notas:** se houver dúvida se algo é Auth0 ou NextAuth, perguntar antes de remover; este repo usa NextAuth v5, não Auth0 diretamente.
