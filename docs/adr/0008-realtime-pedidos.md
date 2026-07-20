# ADR-0008: Realtime da fila de pedidos do admin

- Status: Proposto (decidir na Fase 4)
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

Hoje o painel admin simula "tempo real" com `setInterval(carregarDados, 2000)` — um poll
de 2 s que rebusca pratos, pedidos, fretes, horários e associações inteiras, para sempre,
enquanto a aba está aberta. Desperdício de banco/rede e latência de até 2 s para novos
pedidos. Precisamos de atualização em tempo real da fila de pedidos.

## Decisão (proposta)

Substituir o polling por push. Duas opções em avaliação, a decidir quando o backend
existir (Fase 4):

- **A) SSE (Server-Sent Events) do NestJS** — a API emite eventos de novo pedido / troca
  de status por um endpoint SSE. Mantém tudo no backend próprio, sem dependência extra.
- **B) Supabase Realtime** — assinar mudanças da tabela `pedidos`. Menos código, mas
  reintroduz acoplamento ao Supabase e acesso de realtime a partir do cliente.

Inclinação atual: **A (SSE)**, coerente com ADR-0002 (backend próprio). WebSocket é
alternativa se precisarmos de canal bidirecional (não é o caso hoje).

## Consequências

**Positivas**
- Fim do poll de 2 s; atualização instantânea e barata.
- SSE mantém a fronteira de backend única (ADR-0002).

**Negativas / trade-offs**
- SSE exige gerenciar conexões e reconexão no cliente.
- Supabase Realtime seria mais rápido de implementar, mas contra ADR-0002.

## Pendências

Confirmar na Fase 4 a escolha e registrar como "Aceito".
