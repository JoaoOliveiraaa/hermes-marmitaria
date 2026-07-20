# Hermes Marmitaria

Sistema de pedidos para marmitaria (cardápio, carrinho, checkout, rastreio de pedido e painel administrativo).

## Monorepo

Gerenciado com **pnpm workspaces** + **Turborepo**.

```
apps/
  web/        # Next.js 16 (App Router) — interface do cliente e admin
  api/        # NestJS — backend (em construção)
packages/
  tsconfig/       # configs TypeScript compartilhadas
  eslint-config/  # config ESLint compartilhada
docs/         # arquitetura, ADRs e convenções
```

## Requisitos

- Node.js >= 20
- pnpm 11

## Comandos

```bash
pnpm install       # instala tudo
pnpm dev           # sobe os apps em modo dev
pnpm build         # builda todos os apps/packages
pnpm typecheck     # type-check em todo o monorepo
pnpm lint          # lint em todo o monorepo
```

## Documentação

Veja [`docs/`](./docs) para arquitetura, ADRs e o roadmap de evolução.
