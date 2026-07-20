# ADR-0004: Contratos via OpenAPI → client TS gerado

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

Com web e api separados, precisamos manter os contratos (formatos de request/response)
sincronizados sem duplicar tipos à mão — a principal fonte de bugs em arquiteturas
cliente/servidor.

## Decisão

O NestJS exporá seu contrato via **Swagger/OpenAPI** (decorators nos DTOs e controllers).
A partir do documento OpenAPI, geraremos um **client TypeScript** em
`packages/api-client` (via `openapi-typescript` + fetch tipado, ou equivalente), que o
`apps/web` consome. O OpenAPI é a **fonte única da verdade** dos contratos.

Fluxo: DTOs no Nest → `/api/docs-json` → `pnpm generate:api-client` → tipos + client no web.

## Consequências

**Positivas**
- Zero duplicação manual de tipos; divergência vira erro de compilação no web.
- Swagger UI serve como documentação viva e playground.
- Regenerar o client é um passo de build/CI.

**Negativas / trade-offs**
- Passo de geração a manter (e rodar quando o contrato muda).
- Qualidade do client depende de DTOs bem anotados no Nest.

**Alternativas consideradas**
- **packages/types manual**: simples, mas exige disciplina e diverge com o tempo.
- **ts-rest / tRPC / Zod compartilhado**: type-safety end-to-end excelente, porém acopla
  web e api mais fortemente e/ou assume um runtime específico; preferimos o padrão
  aberto (OpenAPI), que também documenta a API para terceiros (ex.: n8n, mobile futuro).
