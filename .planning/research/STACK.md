# STACK.md — OS Manager API

## Recommended Stack

### Core Platform
| Componente | Escolha | Versão | Confiança |
|---|---|---|---|
| Banco de Dados | Supabase (PostgreSQL 15) | latest | ★★★★★ |
| Auth | Supabase Auth (GoTrue) | nativo | ★★★★★ |
| Real-time | Supabase Realtime (Postgres Changes) | nativo | ★★★★☆ |
| Camada de API | Next.js API Routes (App Router) | 15+ | ★★★★☆ |
| Validação | Zod | ^3.23 | ★★★★★ |
| ORM / Client | @supabase/supabase-js | ^2.x | ★★★★★ |
| Tipagem | TypeScript | ^5.4 | ★★★★★ |
| Testes de API | Vitest + Supertest | latest | ★★★★☆ |
| Documentação | OpenAPI 3.1 (swagger-jsdoc) | latest | ★★★★☆ |

---

## Decisão Arquitetural: Onde Hospedar a Lógica de API

### Escolha Recomendada: Next.js API Routes (App Router)

**Motivo:** O frontend já é Next.js. Usar API Routes elimina a necessidade de um servidor separado, reduz latência (mesmo processo), e simplifica o deploy. Cada rota fica em `src/app/api/[recurso]/route.ts`.

**Estrutura de pastas recomendada:**
```
src/
  app/
    api/
      auth/           → login, logout, refresh
      dashboard/      → metrics, chart-data
      orders/         → CRUD de OS
      technicians/    → CRUD de técnicos
      activities/     → feed de atividades
      notifications/  → contagem, marcar como lido
      search/         → busca global
  lib/
    supabase/
      client.ts       → client-side (anon key)
      server.ts       → server-side (service_role ou cookies)
      admin.ts        → operações admin (service_role)
    validations/      → schemas Zod por domínio
    middleware/       → auth guard, rate limit
```

**Quando usar Supabase Edge Functions (alternativa):**
- Triggers assíncronos (ex: envio de e-mail ao criar OS)
- Webhooks externos
- Processamento pesado fora do ciclo request/response

---

## Estratégia de Auth & RLS

### Auth
- **Supabase Auth** com email/senha (já configurado)
- Tokens JWT armazenados em cookies HttpOnly (Next.js `@supabase/ssr`)
- Middleware Next.js intercepta rotas e valida sessão

```ts
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
// Intercepta todas as rotas /api/* e páginas protegidas
```

### RLS — Roles
```sql
-- Roles via custom claim no JWT
-- auth.users → user_metadata.role = 'admin' | 'technician'

-- Policy padrão para admins:
CREATE POLICY "admin_full_access" ON service_orders
  USING (auth.jwt()->>'role' = 'admin');

-- Policy para técnicos (só veem ordens deles):
CREATE POLICY "technician_own_orders" ON service_orders
  USING (
    auth.jwt()->>'role' = 'technician'
    AND technician_id = auth.uid()
  );
```

**Regra crítica:** Nunca usar `service_role` key no cliente. Apenas no servidor (API Routes com variáveis de ambiente).

---

## Estratégia Real-Time

### Escolha: Supabase Realtime — Postgres Changes

```ts
// Cliente frontend se inscreve em mudanças da tabela
const channel = supabase
  .channel('service_orders_changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'service_orders' },
    (payload) => { /* atualizar UI */ }
  )
  .subscribe()

// CRÍTICO: sempre fazer cleanup
return () => { supabase.removeChannel(channel) }
```

**Canais necessários:**
| Canal | Tabela | Eventos |
|---|---|---|
| `orders_realtime` | service_orders | INSERT, UPDATE |
| `technicians_realtime` | technicians | UPDATE (status) |
| `activities_realtime` | activity_logs | INSERT |
| `notifications_realtime` | notifications | INSERT |

**Limitação:** RLS se aplica ao Realtime — o cliente só recebe eventos de linhas que tem permissão de ler.

---

## Validação & Segurança

### Zod (validação de schema)
```ts
// Exemplo — schema de criação de OS
const CreateOrderSchema = z.object({
  client_name: z.string().min(2).max(100),
  service_type: z.string().min(2).max(50),
  description: z.string().max(1000).optional(),
  technician_id: z.string().uuid().optional(),
  scheduled_at: z.string().datetime().optional(),
})
```

### Rate Limiting
- **Upstash Redis** (serverless, funciona com Vercel/Next.js) — ★★★★☆
- Alternativa simples: middleware com IP-based counter em memória (não persiste entre instâncias)
- Para MVP: `next-rate-limit` ou implementação manual com Upstash

### Headers de Segurança
```ts
// next.config.ts
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]
```

---

## Design de API para Multi-Cliente (Web + Mobile)

### Versionamento
```
/api/v1/orders        → versão atual
/api/v1/technicians
/api/v2/orders        → futura, sem quebrar v1
```

**Regra:** Nunca remover campos de resposta — apenas adicionar. Mobile pode depender de campos que web não usa.

### Formato de Resposta Padronizado
```ts
// Sucesso
{ data: T, meta?: { total, page, limit } }

// Erro
{ error: { code: string, message: string, details?: unknown } }
```

### Paginação
- Cursor-based para mobile (melhor performance)
- Offset-based para web dashboard (mais simples)
- Suportar ambos via query params: `?limit=20&cursor=xyz` ou `?page=1&limit=20`

---

## O Que NÃO Usar

| Opção | Por quê Evitar |
|---|---|
| Prisma com Supabase | Prisma não suporta RLS nativamente — bypass de segurança crítico |
| GraphQL (Apollo) | Overhead desnecessário para equipe de 3 devs; REST é suficiente e mais fácil de documentar para mobile |
| Supabase Edge Functions como camada principal | Cold start, limite de tamanho, difícil de testar localmente |
| JWT armazenado em localStorage | Vulnerável a XSS — usar cookies HttpOnly |
| `service_role` no cliente | Bypassa toda RLS — risco crítico de segurança |
| Sem paginação desde o início | Impossível de retrofitar em produção sem breaking changes |

---

*Pesquisa realizada: 2026-04-25*
*Confiança geral: Alta — padrões bem estabelecidos no ecossistema Supabase/Next.js 2025*
