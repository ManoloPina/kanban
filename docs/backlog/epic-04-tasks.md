# Epic 4 — Tasks

## Issues

- [ ] [4.1] Drag-and-drop de tasks entre colunas (`@dnd-kit/core`)
  - **Arquivos:** `src/app/_components/board-client.tsx`,
    `src/app/_components/column.tsx`, `src/app/_components/task.tsx`
  - **Tipo:** feature
- [ ] [4.2] Campo `position` no schema + endpoint `reorderTasks`
  - **Arquivo:** `src/server/db/schema.ts`
  - **Tipo:** feature
- [ ] [4.3] Drag-and-drop de colunas
  - **Arquivo:** `src/app/_components/board-client.tsx`
  - **Tipo:** feature
- [ ] [4.4] Optimistic update ao trocar status via Select
  - **Arquivo:** `src/app/_components/task-dialog/view-task.tsx`
  - **Tipo:** feature
- [ ] [4.5] Remover spread `...task` em `<TaskDialog>` colidindo com prop `task`
  - **Arquivo:** `src/app/_components/column.tsx`
  - **Tipo:** bug
- [ ] [4.6] Endpoint `moveTask({ id, columnId, position })`
  - **Tipo:** feature
