# Modelo de Domínio — Hermes Marmitaria

Modelo alvo do backend NestJS + Prisma. Nomes de entidade em português (domínio), campos
em `snake_case` no banco (padrão Postgres/Supabase existente).

## Entidades e relações

```mermaid
erDiagram
    users ||--o{ pedidos : "atende (staff)"
    clientes ||--o{ pedidos : faz
    pedidos ||--|{ pedido_itens : contem
    pratos ||--o{ pedido_itens : "referencia"
    pratos ||--o{ prato_dia : "disponivel em"
    adicionais ||--o{ pedido_item_adicionais : "adiciona"
    fretes ||--o{ pedidos : "aplica regiao"

    users {
        uuid id PK
        string email UK
        string senha_hash "bcrypt"
        enum role "owner | staff"
    }
    clientes {
        uuid id PK
        string nome
        string telefone "normalizado (digits)"
    }
    pratos {
        uuid id PK
        string nome
        string descricao
        string imagem_url
        enum categoria "prato | bebida | doce"
        jsonb tamanhos "[{id,nome,preco}]"
        decimal preco "padrao"
    }
    adicionais {
        uuid id PK
        string nome
        decimal preco
    }
    prato_dia {
        uuid id PK
        uuid prato_id FK
        string dia_semana
        bool ativo
    }
    fretes {
        uuid id PK
        string regiao
        decimal valor
    }
    horarios {
        uuid id PK
        string dia_semana
        time abertura
        time fechamento
        bool aberto
    }
    pedidos {
        uuid id PK
        string pedido_id "codigo legivel"
        uuid cliente_id FK
        enum status
        enum tipo_entrega "entrega | retirada"
        decimal valor_frete
        decimal total "CALCULADO NO SERVIDOR"
        string forma_pagamento
        jsonb endereco_entrega
        timestamptz created_at
    }
    pedido_itens {
        uuid id PK
        uuid pedido_id FK
        uuid prato_id FK
        string tamanho_nome
        decimal preco_unitario "snapshot"
        int quantidade
        string observacoes
    }
```

## Nota de modelagem: itens do pedido

Hoje `pedidos.itens` é um blob JSON denormalizado (nomes e preços copiados). Para o alvo,
propomos **normalizar** em `pedido_itens` (+ `pedido_item_adicionais`), guardando um
**snapshot** de `preco_unitario` no momento do pedido (o preço do cardápio pode mudar
depois). Isso habilita relatórios financeiros confiáveis (Fase 5/6). Decisão a confirmar
na Fase 3 ao rodar `prisma db pull` e ver o schema real.

## Máquina de estados do pedido

```mermaid
stateDiagram-v2
    [*] --> pendente
    pendente --> preparando
    pendente --> cancelado
    preparando --> pronto
    preparando --> cancelado
    pronto --> saiu_entrega : tipo_entrega = entrega
    pronto --> entregue : tipo_entrega = retirada
    saiu_entrega --> entregue
    saiu_entrega --> cancelado
    entregue --> [*]
    cancelado --> [*]
```

Regras:
- Transições de status são **operações do admin** (guard `RolesGuard`), exceto a criação
  (`pendente`), feita pelo cliente.
- `saiu_entrega` (hoje `"entrega"` no código) só se aplica a `tipo_entrega = entrega`.
- `cancelado` e `entregue` são estados finais.
- Cada transição registra `updated_at`; considerar histórico de status na Fase 6 se
  houver requisito de auditoria (não agora — ADR-0007).
