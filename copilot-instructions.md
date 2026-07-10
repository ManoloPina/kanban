# Diretrizes para Assistente AI (Copilot) neste Repositório

## Objetivo

Definir expectativas e regras que a Assistente AI deve seguir ao sugerir código, refatorações, PRs ou alterações neste projeto.

## Escopo

Aplica-se a: sugestões de código, refatorações, criação/alteração de componentes, rotas Next.js, uso de design system, geração de testes e alterações de configuração.

## Requisitos obrigatórios

- **Next.js**: toda solução proposta deve seguir as melhores práticas e padrões recomendados pela documentação oficial do Next.js: https://nextjs.org/docs
  - Preferir o App Router e Server/Client Components quando apropriado.
  - Seguir as recomendações de data fetching do Next.js (server components, streaming, caching) e organização de rotas/pastas.

- **Design System — shadcn/ui**: priorizar soluções que utilizem o shadcn/ui e seu ecossistema: https://ui.shadcn.com/
  - Reutilizar componentes do shadcn/ui quando possível e extender com tokens/estilos do projeto.
  - Propor novos componentes com consistência visual e acessibilidade em mente.

- **TanStack Query / React Query pattern**: para consumo de serviços, use fábricas `queryOptions()`/`mutationOptions()` e mantenha `enabled`/callbacks/invalidation no ponto de uso (call-site).

## Tom e comportamento

- Seja conciso e direto nas propostas.
- Sempre que responder a uma pergunta, inclua pelo menos um exemplo prático ou trecho ilustrativo quando isso fizer sentido.
- Explique decisões importantes em 1–3 frases, citando referências quando relevante.
- Priorize soluções que preservem e respeitem a arquitetura existente do repositório.

## Convenções de código

- Linguagens principais: TypeScript + React (Next.js).
- Siga ESLint/Prettier/configurações do repositório.
- Nomenclatura: `camelCase` para variáveis, `PascalCase` para componentes.
- Hooks: não criar hooks que apenas encapsulam `useQuery`/`useMutation` sem adicionar valor lógico.

## Testes e QA

- Sugerir testes unitários para lógica não trivial e exemplos de uso para componentes complexos.

## Segurança e segredos

- Não adicionar chaves ou segredos no código. Usar variáveis de ambiente e instruir sobre como configurá-las.

## Restrições (o que NÃO fazer)

- Não propor grandes mudanças de arquitetura sem justificativa clara e alternativa incremental.
- Não modificar arquivos de configuração global sem consentimento explícito do mantenedor.

## Processo de alteração das diretrizes

- Alterações a este arquivo devem ser feitas via Pull Request e aprovadas por um maintainer.

## Exemplos de solicitações adequadas

- "Refatore a rota `app/dashboard/page.tsx` para usar Server Components e carregar dados via `getServerSideProps` ou equivalentes do App Router."
- "Crie `queryOptions()` para `api.board.getBoards` seguindo o padrão do projeto."

---

Arquivo criado para orientar sugestões automáticas da Assistente AI neste repositório.
