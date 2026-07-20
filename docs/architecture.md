# Arquitetura — Hermes Marmitaria

## Visão

Sistema de pedidos de marmitaria com duas superfícies: **loja do cliente** (cardápio →
carrinho → checkout → rastreio) e **painel administrativo** (pedidos, cardápio,
financeiro). O objetivo da reestruturação é sair de um app V0 client-side para uma
arquitetura com backend próprio, segura e escalável.

## Estado atual (baseline) — diagnóstico

```mermaid
flowchart LR
    Browser["Browser (Next.js, tudo client-side)"]
    Supa[("Supabase Postgres\n(anon key)")]
    Blob["Supabase Storage"]
    N8N["n8n / WhatsApp"]
    Browser -->|"SQL direto, anon key"| Supa
    Browser -->|"/api/upload"| Blob
    Browser -->|"/api/webhook/whatsapp"| N8N
```

Problemas críticos (ver ADRs 0002, 0005, 0006):
1. Auth admin falsa (credenciais hardcoded + flag em `localStorage`).
2. Banco acessado do browser com anon key; autorização só via RLS não versionada.
3. Preço do pedido calculado no cliente e inserido direto no banco.
4. Rastreio baixa a tabela inteira de pedidos e filtra no cliente (vazamento).

## Arquitetura alvo — containers

```mermaid
flowchart TB
    subgraph client["apps/web — Next.js 16 (Vercel)"]
        UI["UI cliente + admin"]
        RQ["TanStack Query + api-client gerado"]
    end
    subgraph api["apps/api — NestJS (Railway/Render)"]
        Auth["auth"]
        Menu["menu"]
        Orders["orders"]
        Cust["customers"]
        Deliv["delivery"]
        Up["uploads"]
        Notif["notifications"]
    end
    DB[("Supabase Postgres\n(via Prisma, server-side)")]
    Store["Supabase Storage"]
    Wh["n8n / WhatsApp"]

    UI --> RQ
    RQ -->|"HTTPS + JWT"| api
    Auth --> DB
    Menu --> DB
    Orders --> DB
    Cust --> DB
    Deliv --> DB
    Up -->|"service-role"| Store
    Notif --> Wh
```

Princípios:
- O **browser nunca fala com o banco**; só com a API do Nest (HTTPS + JWT).
- **Contratos** gerados do OpenAPI do Nest (`packages/api-client`) — ADR-0004.
- Segredos e regra de negócio **apenas no servidor**.

## Fluxo de criação de pedido (alvo)

```mermaid
sequenceDiagram
    participant C as Cliente (web)
    participant A as API (orders)
    participant DB as Postgres
    participant N as notifications

    C->>A: POST /orders { itens[pratoId,qtd], entrega, cliente }
    A->>DB: busca preços atuais, frete, disponibilidade
    A->>A: calcula subtotal + frete + total (server-side)
    A->>DB: cria cliente (find-or-create) e pedido (status=pendente)
    A-->>C: 201 { pedidoId, total calculado }
    A->>N: dispara notificação WhatsApp (assíncrona)
    N-->>C: mensagem de confirmação
```

O total exibido no cliente é uma **estimativa**; o valor oficial é o retornado pela API.

## Deploy (alvo)

| Camada | Plataforma |
|--------|-----------|
| `apps/web` | Vercel |
| `apps/api` | Railway / Render / VPS |
| Postgres | Supabase |
| Storage | Supabase Storage |

Deploys independentes (ADR-0001/0002). Ver Fase 6 do roadmap.
