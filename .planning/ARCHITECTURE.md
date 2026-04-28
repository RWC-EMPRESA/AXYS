# ARCHITECTURE.md — OS Manager

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                  CLIENTES                           │
│  Next.js Dashboard (Web)    App Mobile (Futuro)     │
└──────────────┬──────────────────────────────────────┘
               │ HTTP/REST + Realtime Subscriptions
┌──────────────▼──────────────────────────────────────┐
│              API LAYER (Next.js API Routes)         │
│  /api/v1/auth  /api/v1/orders  /api/v1/technicians  │
│  /api/v1/dashboard  /api/v1/activities              │
│  Middleware: Auth Guard → Rate Limit → Validation   │
└──────────────┬──────────────────────────────────────┘
               │ @supabase/supabase-js (server-side)
┌──────────────▼──────────────────────────────────────┐
│              SUPABASE                               │
│  PostgreSQL 15  │  Auth (GoTrue)  │  Realtime       │
│  RLS Policies   │  Storage        │  Edge Functions  │
└─────────────────────────────────────────────────────┘
```

---

## Schema do Banco de Dados

### Tabela: `users` (extensão de `auth.users`)
```sql
-- profiles (extensão da tabela auth.users do Supabase)
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'admin'  -- 'admin' | 'technician'
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabela: `technicians`
```sql
CREATE TABLE public.technicians (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID REFERENCES public.profiles(id),  -- NULL se não tem login
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  status      TEXT NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE | EN_ROUTE | IN_SERVICE
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabela: `service_orders`
```sql
CREATE TABLE public.service_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     TEXT NOT NULL,
  service_type    TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'PENDING',
  -- PENDING | IN_PROGRESS | COMPLETED | RETURNED
  technician_id   UUID REFERENCES public.technicians(id),
  created_by      UUID REFERENCES public.profiles(id),
  scheduled_at    TIMESTAMPTZ,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  return_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Índices críticos
CREATE INDEX idx_orders_status ON service_orders(status);
CREATE INDEX idx_orders_technician ON service_orders(technician_id);
CREATE INDEX idx_orders_created_at ON service_orders(created_at DESC);
CREATE INDEX idx_orders_status_created ON service_orders(status, created_at DESC);
```

### Tabela: `activity_logs`
```sql
CREATE TABLE public.activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL,
  -- STATUS_CHANGE | CHECK_IN | NEW_ORDER | MESSAGE | ASSIGNMENT
  title           TEXT NOT NULL,
  description     TEXT,
  color           TEXT,  -- para o frontend (emerald, blue, orange, purple)
  is_message      BOOLEAN DEFAULT false,
  related_order_id   UUID REFERENCES public.service_orders(id),
  related_tech_id    UUID REFERENCES public.technicians(id),
  created_by         UUID REFERENCES public.profiles(id),
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_order ON activity_logs(related_order_id);
```

### Tabela: `notifications`
```sql
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT NOT NULL,  -- NEW_ORDER | STATUS_CHANGE | RETURN | CHECK_IN
  is_read     BOOLEAN DEFAULT false,
  related_order_id  UUID REFERENCES public.service_orders(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

---

## Máquina de Estado — Service Order

```
              ┌──────────┐
   CRIAR  →   │ PENDING  │
              └────┬─────┘
                   │ atribuir técnico + iniciar
              ┌────▼────────┐
              │ IN_PROGRESS │
              └────┬───┬────┘
                   │   │
          concluir │   │ retornar (com motivo)
              ┌────▼─┐ ┌▼────────┐
              │COMPL.│ │RETURNED │
              └──────┘ └────┬────┘
                            │ reabrir
                       ┌────▼─────┐
                       │ PENDING  │ (nova OS ou mesmo ID)
                       └──────────┘
```

**Transições válidas (validar na API):**
- `PENDING` → `IN_PROGRESS` (requer technician_id)
- `IN_PROGRESS` → `COMPLETED` (seta completed_at)
- `IN_PROGRESS` → `RETURNED` (requer return_reason)
- `RETURNED` → `PENDING` (reabrir)

---

## Organização de Módulos (3 Devs)

### Módulo A — Auth & Foundation (Dev 1)
**Independente dos demais. Deve ser o primeiro a ser concluído.**
- Setup Supabase (projeto, variáveis de ambiente)
- Schema inicial do banco (migrations)
- RLS policies
- Middleware de autenticação (Next.js)
- Endpoints de auth (`/api/v1/auth/*`)
- Perfis de usuário

### Módulo B — Ordens de Serviço (Dev 2)
**Depende de: Módulo A (auth middleware)**
- CRUD completo de OS (`/api/v1/orders/*`)
- Máquina de estado de OS
- Activity logs automáticos em mudanças de OS
- Endpoint de OS recentes com paginação

### Módulo C — Técnicos & Dashboard (Dev 3)
**Depende de: Módulo A (auth middleware)**
- CRUD de técnicos (`/api/v1/technicians/*`)
- Status real-time de técnicos
- Métricas de dashboard (`/api/v1/dashboard/*`)
- Feed de atividades (`/api/v1/activities/*`)
- Notificações (`/api/v1/notifications/*`)
- Busca global (`/api/v1/search`)

---

## Padrão de Activity Log (Trigger-based)

Usar **PostgreSQL triggers** para garantir que events de auditoria nunca sejam esquecidos:

```sql
-- Trigger automático ao mudar status de OS
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO activity_logs (type, title, description, related_order_id)
    VALUES (
      'STATUS_CHANGE',
      'OS #' || NEW.id || ' mudou para ' || NEW.status,
      'Status anterior: ' || OLD.status,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER UPDATE ON service_orders
FOR EACH ROW EXECUTE FUNCTION log_order_status_change();
```

---

## Estratégia de Migrations

- Usar a CLI do Supabase: `supabase db diff` e `supabase migration new`
- Pasta: `supabase/migrations/` versionada no git
- Cada dev cria suas migrations com timestamp — sem conflitos
- Nunca editar uma migration já aplicada em produção — criar nova

---

## Fluxo de Dados — Requisição Típica

```
Frontend → GET /api/v1/orders?status=PENDING&limit=10
         → Middleware verifica JWT (Supabase Auth)
         → Handler valida query params com Zod
         → Chama supabase.from('service_orders').select()
         → RLS filtra automaticamente por role
         → Response { data: [...], meta: { total, page } }
```

---

*Pesquisa realizada: 2026-04-25*
