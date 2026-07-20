# ADR-0002: NestJS como backend; Supabase reduzido a Postgres gerenciado

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

Hoje o app fala direto com o Supabase a partir do browser (anon key), sem backend
próprio. Isso implica: regra de negócio no cliente, autorização inexistente (depende só
de RLS não versionada) e impossibilidade de esconder segredos. Queremos um backend real,
com fronteira servidor/cliente clara.

## Decisão

Todo o backend ficará centralizado em uma aplicação **NestJS** (`apps/api`). O
**Supabase passa a ser apenas o Postgres gerenciado** (banco). Deixaremos de usar:
Supabase Auth, acesso client-side ao banco e RLS como camada de autorização primária.

O Storage do Supabase pode ser mantido para uploads de imagem, mas acessado
**server-side** pela API (com service-role key), nunca pelo browser.

## Consequências

**Positivas**
- Regra de negócio, autorização e segredos ficam no servidor.
- API versionável, documentada (Swagger) e testável.
- Independência de fornecedor: trocar Supabase por outro Postgres é trivial.

**Negativas / trade-offs**
- Mais infraestrutura para operar e deployar (uma API a mais).
- Perde-se conveniências prontas do Supabase (auth, realtime, RLS) — reconstruídas
  onde agregarem valor.
- Mais latência que acesso direto ao banco (aceitável e mais seguro).

**Alternativas consideradas**
- **Manter Supabase como backend + RLS**: menos código, mas mantém regra no cliente e
  acopla o produto ao Supabase; contradiz o objetivo.
- **Next.js Route Handlers / Server Actions como backend**: válido e mais simples, mas
  o time optou por NestJS para separação total e aprendizado de arquitetura (ver plano).
