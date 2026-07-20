# ADR-0005: Autenticação JWT própria (access + refresh)

- Status: Aceito
- Data: 2026-07-20
- Decisores: João Oliveira (Tech Lead), Claude

## Contexto

A "autenticação" atual do admin é falsa: credenciais hardcoded em texto puro no código
(`app/admin/page.tsx`), senha exibida na UI e sessão como flag em `localStorage` —
bypassável em segundos pelo DevTools. É a falha de segurança #1.

## Decisão

Implementaremos autenticação **própria no NestJS**:

- Tabela `users` com senha em **bcrypt** (nunca em texto puro).
- **Access token** JWT curto (~15 min) + **refresh token** de vida longa.
- Refresh token entregue em **cookie httpOnly, Secure, SameSite** (não acessível a JS),
  mitigando XSS. Access token em memória no cliente.
- **Guards** do Nest: `JwtAuthGuard` (autenticação) + `RolesGuard` (autorização por
  papel `owner` | `staff`). Endpoints de escrita exigem papel adequado.

Clientes finais (quem faz pedido) **não** têm login; o rastreio de pedido é por telefone
(ver ADR-0006 e domain-model).

## Consequências

**Positivas**
- Controle total do fluxo de auth; sem dependência do Supabase Auth.
- Refresh em cookie httpOnly reduz superfície de XSS.
- Autorização real por papel, enforced no servidor.

**Negativas / trade-offs**
- Precisamos implementar e manter rotação de refresh, logout e revogação.
- Gerir segredos (`JWT_SECRET`) e expiração com cuidado.

**Alternativas consideradas**
- **Supabase Auth**: menos código, mas contradiz ADR-0002 e acopla auth ao Supabase.
- **Sessão server-side (cookie + store)**: válido; JWT foi escolhido pela simplicidade
  de escalar sem store de sessão compartilhado e pelo aprendizado.
