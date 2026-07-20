# Contrato de API (alvo) — NestJS

Endpoints alvo do backend, por módulo. Fonte da verdade final será o **Swagger/OpenAPI**
gerado pelo Nest (ADR-0004); este documento é o esboço que guia a implementação.

Convenções: prefixo `/api`, JSON, autenticação via `Authorization: Bearer <access>`.
🔒 = exige JWT. 🔒owner = exige papel `owner`. Sem cadeado = público.

## auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | login (email + senha) → access token + set-cookie refresh |
| POST | `/auth/refresh` | troca refresh (cookie httpOnly) por novo access |
| POST | `/auth/logout` 🔒 | revoga refresh |
| GET | `/auth/me` 🔒 | dados do usuário logado |

## menu
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/menu/pratos` | lista pratos (filtro `?categoria=`, `?dia=`) |
| GET | `/menu/pratos/:id` | detalhe do prato |
| POST | `/menu/pratos` 🔒 | cria prato |
| PATCH | `/menu/pratos/:id` 🔒 | atualiza prato |
| DELETE | `/menu/pratos/:id` 🔒 | remove prato |
| GET | `/menu/adicionais` | lista adicionais |
| POST | `/menu/adicionais` 🔒 | cria adicional |
| GET | `/menu/prato-dia?dia=` | pratos do dia |
| PUT | `/menu/prato-dia/:pratoId` 🔒 | define dias do prato |

## orders
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/orders` | cria pedido (**preço server-side**, ADR-0006) |
| GET | `/orders` 🔒 | lista pedidos (admin; filtros período/pagamento/status) |
| GET | `/orders/rastreio?telefone=` | pedidos de **um** telefone (filtrado no banco) |
| GET | `/orders/:id` 🔒 | detalhe |
| PATCH | `/orders/:id/status` 🔒 | transição de status (valida máquina de estados) |

## customers
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/customers` 🔒 | lista clientes |
| GET | `/customers/:telefone` 🔒 | busca por telefone |

## delivery
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/delivery/fretes` | regiões e valores de frete |
| PATCH | `/delivery/fretes/:id` 🔒owner | atualiza valor |
| GET | `/delivery/horarios` | horários de funcionamento |
| PATCH | `/delivery/horarios/:id` 🔒owner | atualiza horário |

## uploads
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/uploads/imagem` 🔒 | upload de imagem (≤5MB, image/*) → Supabase Storage |

## notifications
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/notifications/whatsapp` | dispara/encaminha mensagem (interno, ao criar pedido) |

## Financeiro
Não é um módulo próprio: a aba financeira do admin é servida por
`GET /orders` com agregações. Endpoint dedicado `GET /orders/summary` 🔒owner pode ser
adicionado na Fase 5 se a agregação no cliente pesar.

## Padrões transversais
- **Validação** de todo body/query com DTOs (`class-validator`); erro → 400 com detalhe.
- **Erros** padronizados (Nest exception filters): 401 (sem/JWT inválido), 403 (sem
  papel), 404, 409 (transição de status inválida), 422 (regra de negócio).
- **Paginação** em listas que crescem (`?page`, `?limit`) — pedidos e clientes.
