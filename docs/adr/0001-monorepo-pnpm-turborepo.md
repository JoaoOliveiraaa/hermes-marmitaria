# ADR-0001: Monorepo com pnpm workspaces + Turborepo

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

O projeto separará frontend (Next.js) e backend (NestJS) em aplicações independentes,
compartilhando tipos, configs e um design system. Precisamos de uma estrutura que
permita compartilhar código sem publicar pacotes, com build incremental e cacheável.

## Decisão

Usaremos um **monorepo** com **pnpm workspaces** para gerenciamento de dependências e
**Turborepo** para orquestração de tasks (`build`, `dev`, `lint`, `typecheck`) com cache.

Estrutura:

```
apps/       web (Next.js), api (NestJS)
packages/   tsconfig, eslint-config, config, ui, api-client
```

## Consequências

**Positivas**
- Código compartilhado via `workspace:*` sem versionar/publicar pacotes.
- Cache de build do Turborepo acelera CI e desenvolvimento local.
- pnpm é rápido e usa disco com content-addressable store (links, não cópias).
- Um único `pnpm install` e um lockfile para todo o repositório.

**Negativas / trade-offs**
- Curva inicial: `workspace:*`, `--filter`, hoisting do pnpm.
- Ferramentas que assumem raiz única às vezes precisam de config extra (ex.: Vercel
  precisa apontar o root do app).

**Alternativas consideradas**
- **Nx**: mais poderoso (generators, graph, plugins), porém mais pesado e opinativo —
  exagero para 2 apps + poucos packages.
- **Dois repositórios separados**: perde compartilhamento de tipos e força versionar
  contratos; mais atrito para um time pequeno.
