# Documentação — Hermes Marmitaria

Documentação técnica da reestruturação do projeto para arquitetura profissional (monorepo + NestJS).

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [architecture.md](./architecture.md) | Visão geral, diagrama de containers, fluxo de pedido |
| [domain-model.md](./domain-model.md) | Entidades, relações e máquina de estados do pedido |
| [api-contract.md](./api-contract.md) | Endpoints alvo do backend NestJS, por módulo |
| [conventions.md](./conventions.md) | Convenções de código, commits, branches e PRs |
| [adr/](./adr) | Architecture Decision Records (decisões e trade-offs) |

## Roadmap

O plano de evolução em fases vive fora do repositório (arquivo de plano do time). Resumo:

- **Fase 0** — higiene do repositório ✅
- **Fase 1** — auditoria + documentação (este diretório) 🔄
- **Fase 2** — monorepo pnpm + Turborepo 🔄 (esqueleto pronto; `apps/api` pendente)
- **Fase 3** — backend NestJS + segurança (auth, orders com preço server-side)
- **Fase 4** — frontend consumindo a API (TanStack Query, RHF+Zod, quebrar God component)
- **Fase 5** — redesign visual / UX premium
- **Fase 6** — testes, CI/CD, deploy, observabilidade

## Estado atual (baseline)

App gerado no V0: Next.js 16 + Supabase acessado direto do browser. Sem backend próprio,
sem ORM, autenticação de admin falsa (credenciais hardcoded + flag em `localStorage`),
preço do pedido calculado no cliente. Ver [architecture.md](./architecture.md) para o
diagnóstico completo.
