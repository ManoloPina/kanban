# Epic 2 — Boards (CRUD)

> **Milestone:** `Epic 2 — Boards`
> **Label pai:** `epic-2-boards`
> **GitHub Project:** #6

## Issues

- [x] [2.1] Corrigir `handleSubmit` que sempre chama `create` mesmo em modo edição
  - **Arquivo:** `src/app/_components/board-dialog/board-form.tsx`
  - **Severidade:** alta
  - **Tipo:** bug
  - **Nota:** Resolvido em `board-form.tsx` — agora `handleSubmit` verifica `isEditing` e chama `update.mutate` ou `create.mutate` conforme o caso.
- [x] [2.2] Popular `defaultValues` com dados do board ao editar
  - **Arquivo:** `src/app/_components/board-dialog/board-form.tsx`
  - **Tipo:** bug
  - **Nota:** `defaultValues` já preenche `id`, `name` e `columns` a partir do board carregado via `api.board.getBoardById`.
- [x] [2.3] Wire-up do item "Edit Board" no dropdown do header
  - **Arquivo:** `src/app/_components/dashboard-header.tsx`
  - **Tipo:** feature
  - **Nota:** Dropdown já chama `openEditBoardDialog(boardId)` e o diálogo renderiza `Edit Board` via `useBoardDialog`.
- [x] [2.4] Renomear arquivo `borad-form.tsx` → `board-form.tsx`
  - **Tipo:** tech-debt
  - **Nota:** Arquivo renomeado para `board-form.tsx` e import em `src/app/_components/board-dialog/index.tsx` atualizado.
- [x] [2.5] Trocar label do botão de submit quando estiver editando
  - **Arquivo:** `src/app/_components/board-dialog/board-form.tsx`
  - **Tipo:** ui
  - **Nota:** Botão exibe `'Save Changes'` no modo edição e `'Create New Board'` no modo criação.

## Cleanup pós-revisão

- [ ] Remover `debugger;` e `console.log` de debug deixados em `board-form.tsx` (`handleSubmit` e `onInvalid`).
- [ ] (Opcional) Revisar o controle do `BoardDialog` no `app-sidebar.tsx`: `onOpenChange` sempre dispara `openCreateBoardDialog()`, o que pode conflitar com a abertura de edição via query params.
