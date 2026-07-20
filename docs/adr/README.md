# Architecture Decision Records

Registro das decisões arquiteturais e seus trade-offs. Cada ADR é imutável depois de
aceito; mudanças de rumo entram como um novo ADR que **supersede** o anterior.

## Template

```markdown
# ADR-XXXX: Título curto

- Status: Proposto | Aceito | Superseded por ADR-YYYY
- Data: AAAA-MM-DD
- Decisores: ...

## Contexto
O problema e as forças em jogo.

## Decisão
O que foi decidido, no imperativo ("Usaremos ...").

## Consequências
Positivas, negativas/trade-offs e alternativas consideradas.
```

## Índice

| ADR | Decisão | Status |
|-----|---------|--------|
| [0001](./0001-monorepo-pnpm-turborepo.md) | Monorepo com pnpm workspaces + Turborepo | Aceito |
| [0002](./0002-nestjs-backend-supabase-postgres.md) | NestJS como backend; Supabase reduzido a Postgres | Aceito |
| [0003](./0003-prisma-migrations.md) | Prisma + migrations versionadas | Aceito |
| [0004](./0004-contratos-openapi.md) | Contratos via OpenAPI → client TS gerado | Aceito |
| [0005](./0005-auth-jwt.md) | Autenticação JWT própria (access + refresh) | Aceito |
| [0006](./0006-preco-server-side.md) | Preço/total do pedido calculados no servidor | Aceito |
| [0007](./0007-ddd-leve-modular.md) | DDD leve, módulos por feature | Aceito |
| [0008](./0008-realtime-pedidos.md) | Realtime da fila de pedidos | Proposto |
