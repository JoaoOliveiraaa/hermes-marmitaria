# Convenções — Hermes Marmitaria

## Commits — Conventional Commits

```
<tipo>(<escopo>): <descrição no imperativo>
```

- **Tipos:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `style`, `ci`.
- **Escopo:** app ou package afetado — `web`, `api`, `ui`, `api-client`, `repo`, ou um
  módulo (`api/orders`, `web/checkout`). Ex.: `feat(api/auth): login com JWT`.
- Descrição curta, minúscula, sem ponto final. Corpo explica o **porquê** quando não é óbvio.

## Branches

- `main` — protegida, sempre verde (CI passando).
- `feat/*`, `fix/*`, `refactor/*`, `chore/*` — trabalho em branch, integra por PR.
- Nada de push direto em `main`.

## Pull Requests

- Título no padrão de commit. Descrição: o quê, por quê, como testar.
- **CI obrigatório verde**: `install → lint → typecheck → build → test`.
- PRs pequenos e focados. Um PR = uma mudança lógica.

## Código

- **TypeScript strict** em todo o monorepo (`packages/tsconfig`). Sem `any` novo — o
  legado marcado como `warn` será eliminado nas Fases 4/5.
- **Sem lógica de negócio em componente React.** Fetch via `packages/api-client` +
  TanStack Query; regra fica no backend.
- **Validação na borda:** DTOs (`class-validator`) na API; Zod + React Hook Form nos
  formulários do web.
- **Arquitetura por feature:** no `apps/api`, um módulo Nest por feature
  (`controller → service → repository`). No `apps/web`, agrupar por feature em
  `features/<nome>` (componentes + hooks + schema).
- Nomes de domínio em português; código (variáveis, tipos) segue o existente.
- Formatação por **Prettier** (`.prettierrc.json`); lint por **ESLint**
  (`packages/eslint-config`). Rodar `pnpm format` antes de commitar.

## Estrutura de pastas (alvo do web, Fase 4)

```
apps/web/
  app/                 # rotas (App Router) — finas, delegam para features
  features/
    orders/            # componentes, hooks, schemas de pedidos
    menu/
    finance/
  components/ui/        # → migrar para packages/ui
  lib/                 # utils, providers (query client)
```

## Documentação

- Toda decisão arquitetural relevante vira um **ADR** em `docs/adr/` (template no
  `docs/adr/README.md`). ADR aceito é imutável; mudança = novo ADR que o supersede.
- Toda mudança de contrato de API atualiza os DTOs (fonte do OpenAPI) e, se necessário,
  `docs/api-contract.md`.
- Regenerar `packages/api-client` quando o contrato mudar.

## Ambiente / segredos

- `.env` **nunca** é commitado (está no `.gitignore`). Cada app tem seu `.env`.
- Manter um `.env.example` por app com os **nomes** das variáveis (sem valores).
- Segredos server-side (`SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, strings de conexão)
  vivem só no `apps/api`; o `apps/web` só recebe `NEXT_PUBLIC_*` e a URL da API.
