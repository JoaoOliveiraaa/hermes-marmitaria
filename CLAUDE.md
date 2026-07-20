# Hermes Marmitaria — Guia do projeto (para o Claude e para você)

App de pedidos de marmitaria (Analândia/SP). Origem: gerado no V0. **Não está em
produção** — é peça de apresentação para fechar o dono do restaurante como cliente
e depois publicar. Sem dados reais a preservar → liberdade para reconstruir.
O que fecha a venda: **UI polida + demo funcionando**.

## Stack alvo
- **Monorepo:** pnpm workspaces + Turborepo.
- **apps/web:** Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui. Só UI + fetch via client gerado.
- **apps/api:** NestJS 11 + Swagger. **Todo o backend.** Prisma 6 → PostgreSQL 16.
- **DB:** Postgres local via Docker (dev); Supabase será **só Postgres** em prod (sem acesso client-side, sem Supabase Auth).
- **Auth:** JWT próprio no Nest (access 15m + refresh 7d em cookie httpOnly), bcryptjs, guards por role (OWNER/STAFF).

## Estrutura
```
apps/web/          Next.js (ainda fala com Supabase — será migrado na Fase 4)
apps/api/          NestJS: auth ✅ · menu ✅ · orders (próximo) · customers · delivery · uploads · notifications
packages/config/   env via zod (parseEnv)
packages/tsconfig/ packages/eslint-config/
docs/              architecture, domain-model, api-contract, conventions, adr/0001-0008, progresso.md
```

## Como subir o ambiente (dev)
```bash
docker compose up -d db          # Postgres (hermes/hermes @ 5432)
pnpm install
cp apps/api/.env.example apps/api/.env   # preencher segredos (ver abaixo)
pnpm --filter @hermes/api db:deploy      # aplica migrations
pnpm --filter @hermes/api db:seed        # cria admin (usa ADMIN_* do .env)
pnpm dev                                  # sobe web (3000) + api (3333)
```
- API: http://localhost:3333/api — Swagger em `/api/docs`.
- Admin do seed: `admin@hermesmarmitaria.com` / `hermes2025` (role OWNER) — troque em prod.
- Gerar segredo JWT: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Regras de trabalho (importante)
- **Segurança primeiro.** As 4 falhas críticas guiam a ordem (ver docs/progresso.md).
- **Preço/total do pedido = SEMPRE calculado no servidor** a partir do banco (ADR-0006). Nunca confiar em valor vindo do cliente.
- **`.env` NUNCA é commitado** — confirmar com `git check-ignore apps/api/.env` antes de cada commit.
- Segredos (JWT, connection string) só existem em `apps/api`. Web só recebe `NEXT_PUBLIC_*` + URL da API.
- **Sem overengineering.** DDD leve, módulos por feature (controller → service → prisma). Nada de CQRS/filas/event-sourcing até haver caso de uso real.
- Verificar cada incremento com **execução real** (HTTP/curl), não só compilação. Manter build/typecheck/lint verdes antes de commitar.
- **Commits:** Conventional Commits com escopo (`feat(api/orders): ...`). Trailer padrão já usado nos commits anteriores.
- Prisma trava a DLL do query engine no Windows: **matar o `pnpm dev` da api antes de rodar `build`/`prisma generate`**.

## Estado atual (2026-07-20)
Fases 0–2 ✅ · Fase 3.1 (schema+Docker) ✅ · 3.2 (auth) ✅ · 3.3 (menu) ✅.
**Próximo: Fase 3.4 — módulo `orders`** (fecha falhas #3 e #4). Detalhes e roadmap completo em **`docs/progresso.md`**.
Plano aprovado original: `~/.claude/plans/arquiteto-de-software-federated-lemur.md`.
