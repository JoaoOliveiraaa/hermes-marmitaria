# ADR-0003: Prisma + migrations versionadas

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

O schema do banco atual não existe no repositório: as tabelas foram criadas pelo
dashboard do Supabase e evoluídas por "scripts SQL" avulsos não versionados. Isso torna
o schema impossível de reproduzir e propenso a drift (o código já convive com colunas
que "podem ou não existir").

## Decisão

Usaremos **Prisma** como ORM na API NestJS, com **migrations versionadas** no repositório.

Bootstrap: `prisma db pull` (introspect) do banco atual gera o `schema.prisma` inicial;
a partir daí, uma migration baseline e todas as mudanças futuras via `prisma migrate`.
Conexões: `POSTGRES_URL_NON_POOLING` para migrations, pooler (`POSTGRES_PRISMA_URL`)
para runtime.

## Consequências

**Positivas**
- Schema versionado, reproduzível e revisável em PR.
- Tipos do banco gerados automaticamente (type-safety ponta a ponta no backend).
- Fim do drift silencioso.

**Negativas / trade-offs**
- Prisma adiciona uma camada de abstração e um passo de `generate` no build.
- Migrations exigem disciplina (nunca editar migration aplicada; sempre criar nova).

**Alternativas consideradas**
- **Drizzle**: mais leve e SQL-first; ótimo, mas Prisma tem DX mais madura para o nível
  do time e melhor tooling de migration/introspect.
- **SQL puro + migrations manuais**: máximo controle, muito boilerplate e sem type-safety.
