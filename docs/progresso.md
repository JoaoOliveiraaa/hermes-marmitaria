# Progresso & Roadmap — Hermes Marmitaria

Documento vivo do estado da refatoração. Atualizar ao fim de cada incremento.
Última atualização: **2026-07-20**.

## Falhas críticas de segurança (baseline V0)
| # | Falha | Fecha em | Status |
|---|-------|----------|--------|
| 1 | Auth admin falsa (credenciais hardcoded, "sessão" no localStorage) | módulo `auth` | ✅ fechada |
| 2 | Banco acessado do browser; mutations de admin no cliente | módulo `menu` (guards) | ✅ fechada |
| 3 | Preço calculado no browser e inserido no banco | módulo `orders` (cálculo server-side) | ⬜ pendente |
| 4 | Rastreio baixa tabela inteira de pedidos e filtra em JS | módulo `orders`/`customers` (filtro no banco) | ⬜ pendente |

## Fases
- [x] **Fase 0** — Higiene do repo (rename, lockfile único, cruft removido, ESLint+Prettier, type-check no build).
- [x] **Fase 1** — Docs + 8 ADRs (`docs/adr/0001`–`0008`).
- [x] **Fase 2** — Monorepo pnpm+Turbo; `apps/web` movido; `apps/api` (Nest+Swagger) scaffold; packages `config/tsconfig/eslint-config`.
- [ ] **Fase 3** — Backend NestJS + segurança
  - [x] 3.1 — Postgres em Docker + schema Prisma completo (11 modelos, 6 enums) + migration `init` + seed do admin.
  - [x] 3.2 — `auth` (JWT access+refresh, guards, roles). → fecha #1. Commit `cc7b158`.
  - [x] 3.3 — `menu` (CRUD pratos/adicionais, leitura pública, mutações protegidas). → fecha #2. Commit `f7825e9`.
  - [ ] **3.4 — `orders` ← PRÓXIMO.** → fecha #3 e #4.
  - [ ] 3.5 — `customers` (rastreio por telefone filtrado no banco, se não coberto pelo orders).
  - [ ] 3.6 — `delivery` (fretes por região, horários), `uploads` (Supabase Storage via service-role server-side), `notifications` (WhatsApp/n8n).
  - [ ] 3.7 — Gerar `packages/api-client` a partir do OpenAPI/Swagger.
- [ ] **Fase 4** — Frontend consome a API (TanStack Query, RHF+Zod, quebrar God component `app/admin/page.tsx`, remover acesso Supabase do web, trocar polling 2s por Realtime/SSE).
- [ ] **Fase 5** — Redesign/UX premium (design system em `packages/ui`, dark mode, skeletons/empty/error states). **Maior ROI para fechar a venda.**
- [ ] **Fase 6** — Testes, CI/CD, deploy (web→Vercel, api→Railway/Render, db→Supabase), observabilidade, rate limit/helmet.

## PRÓXIMO PASSO — Fase 3.4: módulo `orders`

Objetivo: criar pedido com **preço calculado no servidor** e rastreio seguro. Fecha #3 e #4.

### Endpoints
```
POST  /orders                cria pedido. Body traz só referências + quantidades, NUNCA preço.
GET   /orders?telefone=XXX   rastreio público — filtrado NO BANCO por telefone (fecha #4).
GET   /orders                🔒 lista para o admin (fila de pedidos).
GET   /orders/:id            detalhe.
PATCH /orders/:id/status     🔒 avança status (máquina de estados).
```

### Regras (não negociáveis)
1. **Preço server-side (ADR-0006):** o body do `POST /orders` aceita apenas
   `{ cliente:{nome,telefone}, itens:[{ pratoId, tamanhoId?, quantidade, adicionaisIds[], observacoes? }], tipoEntrega, formaPagamento, freteRegiao?, enderecoEntrega?, observacoes? }`.
   O servidor busca `Prato`/`Tamanho`/`Adicional`/`Frete` no banco, calcula `precoUnitario`, `subtotal`, `valorFrete` e `total`. Qualquer preço vindo do cliente é **ignorado** (DTO com `forbidNonWhitelisted` já rejeita campos extras).
2. **Snapshots:** gravar em `PedidoItem` (`nomePrato`, `tamanhoNome`, `precoUnitario`) e `PedidoItemAdicional` (`nome`, `preco`) o valor no momento da compra — para o histórico não mudar se o cardápio mudar.
3. **Cliente:** upsert por `telefone` normalizado (só dígitos) — modelo `Cliente` tem `telefone @unique`.
4. **Código do pedido:** gerar `codigo` legível único (ex. `PED-2026-0001`). Simplest: contador/sequência ou timestamp+random. `ponytail:` começar simples.
5. **Máquina de estados** (`StatusPedido`): `PENDENTE → PREPARANDO → PRONTO → SAIU_ENTREGA → ENTREGUE`, e `CANCELADO` a partir de qualquer não-final. Validar transições no service (rejeitar pulo inválido com 400/409).
6. **Transação:** criar pedido + itens + adicionais dentro de `prisma.$transaction`.
7. **`GET /orders?telefone=`** usa `where: { cliente: { telefone } }` — retorna só os pedidos daquele telefone. Nunca baixar tudo.

### Verificação (curl, execução real)
- Enviar `total`/`preço` adulterado no payload → servidor **recalcula** e ignora; conferir `total` no banco.
- Criar 2 pedidos com telefones diferentes; `GET /orders?telefone=A` retorna só os de A.
- `POST` sem token deve funcionar (cliente final faz pedido); `PATCH /orders/:id/status` sem token → 401.
- Transição de status inválida (ex. `PENDENTE → ENTREGUE`) → erro.
- Após: build/typecheck/lint verdes; commit `feat(api/orders): ...`.

## Como retomar (checklist ao ligar o PC)
1. `docker compose up -d db`
2. `pnpm install` (se necessário)
3. Conferir `apps/api/.env` existe (não é versionado). Se não, `cp apps/api/.env.example apps/api/.env` e preencher segredos.
4. `pnpm --filter @hermes/api db:deploy` (garante migrations) — o banco Docker é volume persistente, mas se recriar do zero, rodar `db:seed` também.
5. `pnpm dev` → api em `:3333/api` (Swagger `/api/docs`), web em `:3000`.
6. Retomar em **Fase 3.4 (`orders`)** — spec acima.

## Referências
- Plano aprovado: `~/.claude/plans/arquiteto-de-software-federated-lemur.md`
- Modelo de domínio + máquina de estados: `docs/domain-model.md`
- Contrato de API alvo: `docs/api-contract.md`
- ADR do preço server-side: `docs/adr/0006-preco-server-side.md`
- Convenções (commits, branches): `docs/conventions.md`
