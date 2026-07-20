# ADR-0006: Preço e total do pedido calculados no servidor

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

Hoje o total do pedido é calculado no browser e inserido direto no banco
(`context/cart-context.tsx`). Um cliente malicioso pode adulterar o payload e pagar o
valor que quiser. Regra de negócio de dinheiro no cliente é a falha crítica #3.

## Decisão

O endpoint `POST /orders` receberá do cliente **apenas referências e quantidades**:

```jsonc
{
  "itens": [{ "pratoId": "...", "tamanhoId": "...", "quantidade": 2,
              "adicionaisIds": ["..."], "observacoes": "..." }],
  "tipoEntrega": "entrega" | "retirada",
  "regiaoFreteId": "...",        // quando entrega
  "formaPagamento": "...",
  "cliente": { "nome": "...", "telefone": "..." }
}
```

O **servidor** busca os preços atuais no banco, calcula subtotal, frete e total, valida
disponibilidade (prato do dia, horário) e persiste o pedido com o total **por ele
calculado**. O cliente nunca envia preços.

## Consequências

**Positivas**
- Impossível adulterar preços; o banco é a fonte da verdade.
- Consistência: um único lugar calcula valores (o `OrdersService`).

**Negativas / trade-offs**
- O cliente precisa exibir uma estimativa e reconciliar com o total retornado pela API
  (pequena divergência se um preço mudou entre carregar o cardápio e finalizar).

**Alternativas consideradas**
- **Confiar no total do cliente e validar no servidor**: ainda exige recálculo no
  servidor; enviar o total do cliente é ruído sem ganho.
