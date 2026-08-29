# Epic 3 — Columns

> **Milestone:** `Epic 3 — Columns`
> **Label pai:** `epic-3-columns`
> **GitHub Project:** #6

## Issues

- [x] [3.1] Endpoints `createColumn`, `updateColumn`, `deleteColumn` (soft delete)
  - **Arquivo(s):** `src/server/api/routers/column.ts`, `src/model/column.ts`, `src/server/db/schema.ts`
  - **Tipo:** feature
  - **Severidade:** alta
  - **Contexto:** hoje o router de colunas (`src/server/api/routers/column.ts`) expõe apenas `getColumnsByBoardId`. Não é possível criar, renomear ou excluir uma coluna isoladamente; toda a gestão de colunas acontece apenas indiretamente via criação/edição do board. Isso bloqueia as funcionalidades de "Add New Column" no header e na home vazia.
  - **Comportamento atual:** não existem procedures `createColumn`, `updateColumn` nem `deleteColumn` no `columnRouter`. O `columnInsertSchema` em `src/model/column.ts` importa `z` de `zod/v4`, divergindo do restante do projeto que usa `zod`, e não possui schema de update.
  - **Comportamento esperado:** o `columnRouter` expõe três mutations protegidas que permitem gerenciar colunas de forma independente, respeitando a propriedade do board (`createdBy`).
  - **Status da implementação:** implementado em `src/server/api/routers/column.ts`. `createColumn`, `updateColumn`, `deleteColumn`, `getColumnsByBoardId` e `reorderColumns` estão operacionais. Soft delete em cascata de tasks/subtasks foi aplicado no `deleteColumn`.
  - **Routers a criar/atualizar:**
    - `createColumn({ name, boardId })`: insere uma nova coluna no board. Deve validar que o board existe, não está soft-deletado e pertence ao usuário logado. O nome deve ser trimado e ter pelo menos 1 caractere. Retorna a coluna criada.
    - `updateColumn({ id, name })`: atualiza o nome da coluna. Deve verificar se a coluna pertence a um board do usuário logado. Nome trimado, não vazio. Retorna a coluna atualizada.
    - `deleteColumn({ id })`: soft delete — preenche `deletedAt` com a data atual. Deve verificar propriedade do board. Também soft-deletar em cascata as tarefas e subtarefas da coluna (mesmo padrão usado em `deleteBoard`). Retorna a coluna marcada como deletada.
  - **Schema necessário:**
    - Corrigir `src/model/column.ts` para usar `zod` (não `zod/v4`) e remover o import conflitante de `_z`.
    - Criar `columnUpdateSchema` com `id` obrigatório e `name` validado.
    - Garantir que `columnInsertSchema` não inclua campos gerados pelo banco (`id`, `createdAt`, `updatedAt`, `deletedAt`) e não force `boardId` em schemas de formulário quando não aplicável.
  - **Critérios de aceite:**
    - [x] `createColumn`, `updateColumn` e `deleteColumn` existem em `src/server/api/routers/column.ts`
    - [x] Todas as procedures usam `protectedProcedure` e validam ownership do board via `createdBy`
    - [x] `deleteColumn` faz soft delete em cascata de tasks e subtasks
    - [ ] `src/model/column.ts` usa `zod` consistentemente e exporta schemas de insert/update — parcial; ainda importa `z` de `zod/v4`, embora funcione
    - [ ] Build (`pnpm check` / `next build`) passa sem erros de tipo — ainda não validado
  - **Como testar:**
    1. Criar um board via UI
    2. Chamar `createColumn` com um nome e `boardId` — deve aparecer no board
    3. Chamar `updateColumn` com novo nome — deve refletir na UI após refresh
    4. Chamar `deleteColumn` — coluna deve sumir, tasks e subtasks também devem ser soft-deletadas
    5. Tentar operação em coluna de outro usuário → erro `FORBIDDEN`/`NOT_FOUND`
  - **Notas:** considerar adicionar campo `position` já neste schema (ver [3.4]) para evitar segunda migration. Se optar por adiar, `position` pode ser nulo/default 0 temporariamente.

- [ ] [3.2] Botão "+ Add New Column" funcional na home vazia
  - **Arquivo(s):** `src/app/(dashboard)/page.tsx`, `src/app/_components/dashboard-header.tsx`, `src/hooks/useBoardDialog.ts`
  - **Tipo:** feature
  - **Severidade:** média
  - **Contexto:** em `src/app/(dashboard)/page.tsx`, quando não há boards, o usuário vê um botão "+ Add New Column" que hoje não faz nada. O label também é confuso: se não existe board, não faz sentido "adicionar coluna" — o fluxo deveria criar um board primeiro ou abrir o diálogo de criação de board.
  - **Comportamento atual:** o botão é renderizado sem `onClick`, não abre diálogo nem navega.
  - **Comportamento esperado:** o botão abre o diálogo de criação de board (`BoardDialog` no modo `Create`), permitindo ao usuário criar o primeiro board (que já solicita colunas no formulário). Alternativamente, pode-se renomear o botão para "+ Create New Board" para refletir a ação real.
  - **Critérios de aceite:**
    - [ ] Clique no botão abre o `BoardDialog` em modo `Create`
    - [ ] Após criar o board, o usuário é redirecionado para `/board/{id}`
    - [ ] O texto do botão reflete a ação (ex.: "+ Create New Board" ou "+ Add New Column" se mantiver o label atual por decisão de produto)
    - [ ] O botão continua visível apenas quando não há boards
  - **Como testar:**
    1. Logar com usuário sem boards
    2. Clicar no botão da home vazia
    3. Preencher nome do board e colunas
    4. Salvar → deve redirecionar para o novo board
  - **Notas:** discutir com produto se o label deve ser "Add New Column" (fiel ao Figma) ou "Create New Board" (mais preciso semanticamente). A ação técnica é a mesma.

- [x] [3.3] Adicionar coluna a partir do board ("+ New Column")
  - **Arquivo(s):** `src/app/(dashboard)/board/_components/new-column-input.tsx`, `src/app/(dashboard)/board/_components/board-client.tsx`, `src/app/(dashboard)/board/_components/column.tsx`, `src/app/_components/dashboard-header.tsx`, `src/server/api/routers/column.ts`
  - **Tipo:** feature
  - **Severidade:** média
  - **Contexto:** no protótipo do Figma, o controle para adicionar uma nova coluna é um **elemento grande posicionado ao final do board**, com aparência similar a uma coluna vazia e label "+ New Column" — não um botão pequeno no header. A documentação anterior descrevia a ação apenas no `DashboardHeader`, o que não refletia o design. Hoje a única forma de adicionar coluna é editar o board inteiro via `BoardDialog`. Decisão de UX: não utilizar `AlertDialog` para confirmação, pois a criação de coluna é não-destrutiva e reversível.
  - **Decisões tomadas:**
    - Não foi criado `ColumnDialog`; a criação de coluna utiliza um **input inline** (`NewColumnInput`) ao final do board, mantendo o layout próximo ao protótipo do Figma.
    - O gradiente customizado do estado inativo (`bg-new-column-gradient`) foi removido; o componente passou a usar cores/gradiente hardcoded (`from-[#2B2C37]`) para o estado inativo e tema padrão (`bg-background`) quando focado.
  - **Comportamento esperado:** renderizar um botão/coluna de adição fixa ao final da lista de colunas no `BoardClient`. Ao clicar, o próprio elemento vira um `input` inline, mantendo o layout e a aparência próximas ao protótipo. `Enter` confirma a criação, `Escape` ou `blur` com campo vazio cancelam. Ao salvar, chamar `createColumn` via tRPC e invalidar `getBoardById`. O `DashboardHeader` pode manter a mesma ação como item secundário no dropdown do board (não como botão primário ao lado de "+ Add New Task") — fora do escopo desta issue.
  - **UI a criar/atualizar:**
    - Refatorar `ColumnDialog` em `NewColumnInput` (input inline controlado por estado) para capturar o nome da coluna. Remover dependências de `Dialog`, já que não haverá modal.
    - Atualizar `BoardClient` para renderizar, após a última coluna, o `NewColumnInput` estilizado como coluna vazia (`+ New Column`).
    - Garantir que a largura e altura mínimas do `NewColumnInput` acompanhem o grid de colunas existentes (`w-[280px]`).
    - Adicionar estilos no `globals.css` para o gradiente do estado inativo do "+ New Column", respeitando tema claro/escuro.
  - **Critérios de aceite:**
    - [x] Botão/coluna "+ New Column" visível ao final das colunas quando um board está aberto
    - [x] Ao clicar, o elemento vira um input inline sem abrir dialog
    - [x] `Enter` submete e chama `api.column.createColumn.mutate({ name, boardId })`
    - [x] `Escape` ou `blur` com valor vazio cancela e volta ao estado de botão
    - [x] Após sucesso, `utils.board.getBoardById.invalidate(boardId)` é chamado e a nova coluna aparece no board
    - [x] Nome vazio validado no client e no server
    - [x] Limite de 50 caracteres validado no client (`maxLength` + `columnNameSchema`) — **server ainda valida 255 caracteres; deve ser alinhado para 50**
    - [x] Estado de loading desabilita o input e previne double submit
    - [x] Layout responsivo: em telas pequenas o botão acompanha o scroll horizontal do board (`shrink-0` + `overflow-x-auto` no container)
    - [x] Não utilizar `AlertDialog` para confirmação de criação
    - [x] Manter padrão tRPC consistente com o restante do projeto (não introduzir server action para este fluxo)
  - **Como testar:**
    1. Abrir um board existente
    2. Clicar no botão/coluna "+ New Column" ao final do board
    3. Preencher nome e pressionar `Enter`
    4. Verificar que a coluna aparece ao lado das demais sem refresh manual
    5. Clicar no "+ New Column", digitar algo, pressionar `Escape` e verificar que o input é fechado sem criar coluna
    6. Testar em largura de mobile e verificar scroll horizontal
  - **Notas:**
    - A refatoração de `ColumnDialog` para `NewColumnInput` foi concluída; não há dependências de `Dialog*`.
    - [3.4] (`position`) já está implementado; `createColumn` insere a nova coluna com `position = MAX(position) + 1` das colunas ativas do board.
    - O atalho no dropdown do `DashboardHeader` pode ser tratado em issue separada para não bloquear esta entrega.
    - **Pendência técnica:** alinhar o limite de caracteres do servidor (`columnInsertSchema`/`columnUpdateSchema`) para 50, igual ao client.

- [ ] [3.4] Campo `position` no schema + endpoint para reordenar colunas
  - **Arquivo(s):** `src/server/db/schema.ts`, `src/server/api/routers/column.ts`, `src/app/_components/board-client.tsx`
  - **Tipo:** feature
  - **Severidade:** média
  - **Contexto:** atualmente as colunas não possuem ordem explícita; a ordem de exibição depende da ordem de inserção ou do retorno do banco, o que é frágil. Para suportar drag-and-drop futuro e garantir consistência visual, é necessário um campo `position`.
  - **Schema necessário:** adicionar coluna `position integer not null default 0` à tabela `columns` (migration Drizzle). Criar índice em `(board_id, position)` para ordenação eficiente.
  - **Routers a criar/atualizar:**
    - Atualizar `createColumn` para inserir a nova coluna com `position = (SELECT COALESCE(MAX(position), 0) + 1 FROM columns WHERE board_id = ... AND deleted_at IS NULL)`.
    - Criar `reorderColumns({ boardId, orderedColumnIds: string[] })`: valida que todos os IDs pertencem ao board, não estão deletados, e atualiza `position` de cada coluna para refletir a nova ordem. Executar dentro de transação.
  - **UI a atualizar:**
    - `BoardClient` deve renderizar colunas ordenadas por `position` (back-end já pode fazer isso via query).
    - Futuramente (fora do escopo desta issue) o drag-and-drop usará este endpoint.
  - **Critérios de aceite:**
    - [ ] Coluna `position` existe em `src/server/db/schema.ts`
    - [ ] Migration Drizzle gerada e aplicada
    - [ ] `createColumn` define `position` automaticamente no final
    - [ ] `reorderColumns` atualiza a ordem de todas as colunas do board em uma transação
    - [ ] Validação: IDs enviados devem corresponder exatamente às colunas ativas do board
    - [ ] Queries de board retornam colunas ordenadas por `position`
  - **Como testar:**
    1. Criar board com 3 colunas
    2. Verificar ordem padrão (TODO, DOING, DONE ou conforme inserido)
    3. Chamar `reorderColumns` com IDs em ordem invertida
    4. Recarregar o board e verificar que a ordem refletiu a mudança
    5. Tentar enviar ID inexistente/deletado → erro `BAD_REQUEST`
  - **Notas:** usar um intervalo de posições (ex.: múltiplos de 1000) pode facilitar reordering sem recalcular tudo no futuro, mas para este escopo `position` sequencial é suficiente. Considerar impacto no `createDemo` — as colunas de demo devem ter positions 0, 1, 2.
