# ADR-0007: DDD leve, módulos por feature (sem CQRS/event-sourcing/filas por ora)

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

O domínio (marmitaria de um restaurante) é pequeno: cardápio, carrinho, pedido, rastreio
e notificação. Há tentação de aplicar Clean Architecture completa, CQRS, event-sourcing
e filas "porque é profissional". Isso seria over-engineering: custo alto, valor baixo
para o tamanho do problema.

## Decisão

Adotaremos **DDD leve** e **arquitetura modular por feature** no NestJS:

- Um **módulo por feature**: `auth`, `menu`, `orders`, `customers`, `delivery`,
  `uploads`, `notifications`.
- Dentro de cada módulo: `Controller` (HTTP + Swagger) → `Service` (regra de negócio) →
  `Repository` (Prisma). DTOs validados com `class-validator`/Zod na borda.
- **Sem** CQRS, event-sourcing, ou barramento de eventos por enquanto.
- **Filas (BullMQ)** só quando houver caso de uso real (ex.: reprocessar notificação
  WhatsApp com retry). Até lá, chamadas diretas.

Essas decisões pesadas, se necessárias, entram como novos ADRs quando um gatilho real
aparecer (volume, segundo consumidor, requisito de auditoria).

## Consequências

**Positivas**
- Código simples, navegável e testável, alinhado ao tamanho do domínio.
- Fronteiras por feature facilitam evolução e extração futura.

**Negativas / trade-offs**
- Se o domínio crescer muito, pode ser preciso introduzir camadas/eventos depois
  (custo de refatoração assumido conscientemente — YAGNI).

**Alternativas consideradas**
- **Clean Architecture completa + CQRS + eventos**: preparada para escala que não
  temos; adia entrega e adiciona complexidade sem retorno atual.
