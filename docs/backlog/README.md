# Kanban Project — Backlog (Project #6)

Este diretório descreve as issues que alimentam o GitHub Project #6
do repositório `ManoloPina/kanban`.

## Como usar

1. Revise os épicos abaixo.
2. Crie as issues executando `bash scripts/create-issues.sh` (na raiz do repo).
3. Cada issue referencia o arquivo Markdown correspondente neste diretório.
4. Após criar no GitHub, rode `bash scripts/backfill-epics.sh` para garantir
   que **milestone + label pai** estão atachados em cada issue.

## Colunas (Project #6)

- Backlog
- In Progress
- In Review
- Done

> **Dica:** adicione o campo `Milestone` como coluna no Project #6
> e agrupe por ele para ver o progresso de cada epic (barra de %).

## Milestones

Cada epic tem um milestone correspondente. Ao criar/atachar issues, sempre
vincule ao milestone e à label pai do epic — isso permite filtrar e agrupar
no Project #6.

| Milestone            | Arquivo                                          | Label pai            | Foco                                   |
| -------------------- | ------------------------------------------------ | -------------------- | -------------------------------------- |
| `Epic 1 — Auth`      | [epic-01-auth.md](epic-01-auth.md)              | `epic-1-auth`        | Cadastro, login, verificação de e-mail |
| `Epic 2 — Boards`    | [epic-02-boards.md](epic-02-boards.md)          | `epic-2-boards`      | CRUD de boards                         |
| `Epic 3 — Columns`   | [epic-03-columns.md](epic-03-columns.md)        | `epic-3-columns`     | CRUD de colunas                        |
| `Epic 4 — Tasks`     | [epic-04-tasks.md](epic-04-tasks.md)            | `epic-4-tasks`       | CRUD + drag-and-drop de tasks          |
| `Epic 5 — Subtasks`  | [epic-05-subtasks.md](epic-05-subtasks.md)      | `epic-5-subtasks`    | CRUD de subtasks                       |
| `Epic 6 — UI/UX`     | [epic-06-ui.md](epic-06-ui.md)                  | `epic-6-ui`          | UI/UX e refinamentos visuais           |
| `Epic 7 — Qualidade` | [epic-07-quality.md](epic-07-quality.md)        | `epic-7-quality`     | Testes, lint, types                    |
| `Epic 8 — DevOps`    | [epic-08-devops.md](epic-08-devops.md)          | `epic-8-devops`      | CI, Docker, deploy                     |
| `Epic 9 — Segurança` | [epic-09-security.md](epic-09-security.md)      | `epic-9-seguranca`   | Segurança e observabilidade            |

## Labels

Três grupos convivem na mesma issue:

### Labels de área (1 por issue filha)

`auth`, `boards`, `columns`, `tasks`, `subtasks`, `ui`, `quality`, `devops`,
`security`.

### Labels de tipo (1+ por issue filha)

`bug`, `feature`, `tech-debt`, `ui`, `devops`, `security`.

### Labels de agrupamento por epic (1 por issue filha)

`epic-1-auth`, `epic-2-boards`, `epic-3-columns`, `epic-4-tasks`,
`epic-5-subtasks`, `epic-6-ui`, `epic-7-quality`, `epic-8-devops`,
`epic-9-seguranca` — além da label genérica `epic` (marcador opcional).

## Épicos

| Epic | Arquivo                                          | Foco                                   |
| ---- | ------------------------------------------------ | -------------------------------------- |
| 1    | [epic-01-auth.md](epic-01-auth.md)              | Cadastro, login, verificação de e-mail |
| 2    | [epic-02-boards.md](epic-02-boards.md)          | CRUD de boards                         |
| 3    | [epic-03-columns.md](epic-03-columns.md)        | CRUD de colunas                        |
| 4    | [epic-04-tasks.md](epic-04-tasks.md)            | CRUD + drag-and-drop de tasks          |
| 5    | [epic-05-subtasks.md](epic-05-subtasks.md)      | CRUD de subtasks                       |
| 6    | [epic-06-ui.md](epic-06-ui.md)                  | UI/UX e refinamentos visuais           |
| 7    | [epic-07-quality.md](epic-07-quality.md)        | Testes, lint, types                    |
| 8    | [epic-08-devops.md](epic-08-devops.md)          | CI, Docker, deploy                     |
| 9    | [epic-09-security.md](epic-09-security.md)      | Segurança e observabilidade            |
