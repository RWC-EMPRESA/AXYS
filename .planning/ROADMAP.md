# ROADMAP.md — OS Manager (RWC Digital)

**Milestone:** v1.0 — Backend API + Supabase
**Granularity:** Fine (11 fases independentes)
**Mode:** Interactive — cada fase requer aprovação antes de avançar
**Team:** 3 desenvolvedores — módulos projetados para trabalho independente

---

## Mapa de Fases

| # | Fase | Dev Responsável | Requisitos | Critérios de Sucesso |
|---|------|----------------|------------|---------------------|
| 1 | Auth & Foundation | **Wellison** (Arquitetura/Backend) | AUTH-01..07 | 7 critérios |
| 2 | Schema & Migrations | **Wellison** (Arquitetura/Backend) | DB-01..06 | 6 critérios |
| 3 | CRUD de Ordens de Serviço | Dev 2 (a definir) | OS-01..07 | 7 critérios |
| 4 | Máquina de Estado de OS | Dev 2 (a definir) | SM-01..08 | 8 critérios |
| 5 | Gestão de Técnicos | Dev 3 (a definir) | TECH-01..06 | 6 critérios |
| 6 | Dashboard & Métricas | Dev 3 (a definir) | DASH-01..06 | 6 critérios |
| 7 | Feed de Atividades | Dev 2 ou Dev 3 | ACT-01..05 | 5 critérios |
| 8 | Notificações | Dev 2 ou Dev 3 | NOTF-01..04 | 4 critérios |
| 9 | Busca Global | Dev 2 ou Dev 3 | SRCH-01..04 | 4 critérios |
| 10 | Segurança & Hardening | **Wellison** + revisão geral | SEC-01..04 | 4 critérios |
| 11 | Documentação Final | Todos | DOC-01..05 | 5 critérios |

---

## Fase 1 — Auth & Foundation

**Goal:** Sistema de autenticação funcional com roles e middleware protetor de rotas
**Owner:** Wellison (Arquitetura & Backend)
**Dependencies:** Nenhuma — é a fase raiz
**UI hint:** no

**Requisitos:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07

**Success criteria:**
1. Admin consegue fazer login com email/senha e recebe sessão válida
2. Requisição autenticada a `/api/v1/protected` retorna 200; sem token retorna 401
3. Logout invalida a sessão — próxima requisição retorna 401
4. Usuário com role `technician` não acessa endpoints restritos a admin
5. RLS habilitado — query direta ao banco (anon key) não retorna dados protegidos
6. Middleware intercepta todas as rotas `/api/v1/*` e redireciona não-autenticados
7. Variáveis de ambiente documentadas e `.env.example` commitado

**Deliverables:**
- `src/middleware.ts` — auth guard
- `src/lib/supabase/server.ts` — client server-side
- `src/lib/supabase/client.ts` — client browser
- `src/lib/supabase/admin.ts` — client com service_role
- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/logout/route.ts`
- `src/app/api/v1/auth/me/route.ts`
- `.env.example`
- RLS policies para tabela `profiles`

---

## Fase 2 — Schema & Migrations

**Goal:** Banco de dados estruturado com todas as tabelas, relacionamentos, índices e triggers
**Owner:** Wellison (Arquitetura & Backend)
**Dependencies:** Fase 1 (projeto Supabase configurado)
**UI hint:** no

**Requisitos:** DB-01, DB-02, DB-03, DB-04, DB-05, DB-06

**Success criteria:**
1. Todas as 5 tabelas criadas: profiles, technicians, service_orders, activity_logs, notifications
2. Foreign keys e constraints criados corretamente (sem erros ao testar relacionamentos)
3. Índices criados em: status, technician_id, created_at de service_orders
4. Migrations versionadas na pasta `supabase/migrations/` e commitadas
5. Trigger de activity_log dispara corretamente ao mudar status de uma OS (testado via SQL)
6. README com instruções de como rodar migrations localmente e em produção

**Deliverables:**
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_technicians.sql`
- `supabase/migrations/003_service_orders.sql`
- `supabase/migrations/004_activity_logs.sql`
- `supabase/migrations/005_notifications.sql`
- `supabase/migrations/006_indexes.sql`
- `supabase/migrations/007_triggers.sql`
- `supabase/migrations/008_rls_policies.sql`
- `docs/DATABASE.md` — ERD e descrição de cada tabela/campo

---

## Fase 3 — CRUD de Ordens de Serviço

**Goal:** API REST completa para criação, leitura, edição e listagem de OS
**Owner:** Dev 2 (a definir)
**Dependencies:** Fase 1 (auth middleware), Fase 2 (schema)
**UI hint:** no

**Requisitos:** OS-01, OS-02, OS-03, OS-04, OS-05, OS-06, OS-07

**Success criteria:**
1. `POST /api/v1/orders` cria OS e retorna objeto criado com ID
2. `GET /api/v1/orders` retorna lista paginada com filtros funcionais (status, technician_id, data)
3. `GET /api/v1/orders/:id` retorna OS com técnico vinculado via JOIN (sem N+1)
4. `PATCH /api/v1/orders/:id` atualiza campos permitidos e retorna OS atualizada
5. `GET /api/v1/orders/recent` retorna últimas OS (padrão: limit=10)
6. Input inválido (ex: client_name vazio) retorna 422 com mensagem de erro clara
7. Endpoint sem token retorna 401

**Deliverables:**
- `src/app/api/v1/orders/route.ts` (GET, POST)
- `src/app/api/v1/orders/recent/route.ts` (GET)
- `src/app/api/v1/orders/[id]/route.ts` (GET, PATCH, DELETE)
- `src/lib/validations/orders.ts` — schemas Zod
- `src/lib/services/orders.ts` — lógica de negócio
- `docs/api/orders.md` — documentação dos endpoints

---

## Fase 4 — Máquina de Estado de OS

**Goal:** Transições de status controladas, atômicas e com efeitos colaterais corretos
**Owner:** Dev 2 (a definir)
**Dependencies:** Fase 3 (CRUD de OS)
**UI hint:** no

**Requisitos:** SM-01, SM-02, SM-03, SM-04, SM-05, SM-06, SM-07, SM-08

**Success criteria:**
1. `PATCH /api/v1/orders/:id/status` aceita transição válida e persiste
2. Transição inválida (ex: COMPLETED → IN_PROGRESS) retorna 422 com erro descritivo
3. Transição para IN_PROGRESS sem technician_id retorna 422
4. Transição para RETURNED sem return_reason retorna 422
5. Ao mudar para IN_PROGRESS, técnico vinculado tem status atualizado para IN_SERVICE
6. Ao concluir OS, técnico volta para AVAILABLE e completed_at é registrado
7. Ao retornar OS, técnico volta para AVAILABLE e return_reason é salvo
8. Activity log é criado automaticamente para cada mudança de status (via trigger DB)

**Deliverables:**
- `src/app/api/v1/orders/[id]/status/route.ts`
- `src/lib/services/orderStateMachine.ts` — validação de transições
- `src/lib/validations/orderStatus.ts`
- Testes: `src/tests/orderStateMachine.test.ts`
- `docs/api/order-status.md`

---

## Fase 5 — Gestão de Técnicos

**Goal:** API CRUD de técnicos com controle de status e listagem em campo
**Owner:** Dev 3 (a definir)
**Dependencies:** Fase 1 (auth), Fase 2 (schema)
**UI hint:** no

**Requisitos:** TECH-01, TECH-02, TECH-03, TECH-04, TECH-05, TECH-06

**Success criteria:**
1. `POST /api/v1/technicians` cadastra técnico e retorna objeto criado
2. `GET /api/v1/technicians` retorna lista de técnicos ativos com status
3. `GET /api/v1/technicians/active` retorna técnicos EN_ROUTE ou IN_SERVICE
4. `PATCH /api/v1/technicians/:id` atualiza dados e retorna técnico atualizado
5. `DELETE /api/v1/technicians/:id` faz soft delete (is_active = false), não apaga registro
6. Status do técnico é atualizado automaticamente pelas transições de OS (SM-07/SM-08)

**Deliverables:**
- `src/app/api/v1/technicians/route.ts` (GET, POST)
- `src/app/api/v1/technicians/active/route.ts` (GET)
- `src/app/api/v1/technicians/[id]/route.ts` (GET, PATCH, DELETE)
- `src/lib/validations/technicians.ts`
- `src/lib/services/technicians.ts`
- `docs/api/technicians.md`

---

## Fase 6 — Dashboard & Métricas

**Goal:** Endpoints agregados que alimentam o dashboard com dados e gráficos
**Owner:** Dev 3 (a definir)
**Dependencies:** Fase 3 (OS), Fase 5 (Técnicos)
**UI hint:** no

**Requisitos:** DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06

**Success criteria:**
1. `GET /api/v1/dashboard/metrics` retorna objeto com totais por status e por técnico
2. Metrics aceitam `?from=` e `?to=` como filtros de data ISO 8601
3. `GET /api/v1/dashboard/chart-data` retorna array de 7 itens `{day, count}`
4. Tempo médio de conclusão calculado corretamente (null quando não há OS concluídas)
5. Indicador de tendência retorna delta de OS hoje vs ontem
6. Todas as queries usam índices — sem full table scan em tabelas grandes

**Deliverables:**
- `src/app/api/v1/dashboard/metrics/route.ts`
- `src/app/api/v1/dashboard/chart-data/route.ts`
- `src/lib/services/dashboard.ts`
- `docs/api/dashboard.md`

---

## Fase 7 — Feed de Atividades

**Goal:** Feed cronológico de eventos com suporte a real-time via Supabase Realtime
**Owner:** Dev 2 ou Dev 3 (a definir)
**Dependencies:** Fase 2 (schema/triggers), Fase 3 e Fase 5
**UI hint:** no

**Requisitos:** ACT-01, ACT-02, ACT-03, ACT-04, ACT-05

**Success criteria:**
1. `GET /api/v1/activities` retorna feed paginado por cursor, mais recente primeiro
2. Cada item contém todos os campos: type, title, description, color, is_message, created_at, links
3. Todos os 5 tipos de evento são retornados corretamente
4. Supabase Realtime canal `activities_realtime` emite INSERT de activity_logs em tempo real
5. Frontend conectado recebe novo evento em menos de 2 segundos após ação no banco

**Deliverables:**
- `src/app/api/v1/activities/route.ts`
- `src/lib/services/activities.ts`
- `docs/api/activities.md`
- `docs/realtime-setup.md` — guia de subscrição no frontend

---

## Fase 8 — Notificações

**Goal:** Sistema de notificações persistido com contagem não lida e real-time
**Owner:** Dev 2 ou Dev 3 (a definir)
**Dependencies:** Fase 2 (schema), Fase 3 (OS triggers)
**UI hint:** no

**Requisitos:** NOTF-01, NOTF-02, NOTF-03, NOTF-04

**Success criteria:**
1. `GET /api/v1/notifications/count` retorna `{ unread: N }` para usuário autenticado
2. `PATCH /api/v1/notifications/read-all` marca todas como lidas e retorna `{ updated: N }`
3. Nova OS criada gera notificação para todos os admins automaticamente
4. OS retornada gera notificação de retorno para admins
5. Supabase Realtime emite nova notificação em tempo real para o cliente conectado

**Deliverables:**
- `src/app/api/v1/notifications/count/route.ts`
- `src/app/api/v1/notifications/route.ts` (GET lista)
- `src/app/api/v1/notifications/read-all/route.ts` (PATCH)
- `src/lib/services/notifications.ts`
- `docs/api/notifications.md`

---

## Fase 9 — Busca Global

**Goal:** Endpoint de busca full-text que cobre OS, clientes e técnicos
**Owner:** Dev 2 ou Dev 3 (a definir)
**Dependencies:** Fase 3 (OS), Fase 5 (Técnicos)
**UI hint:** no

**Requisitos:** SRCH-01, SRCH-02, SRCH-03, SRCH-04

**Success criteria:**
1. `GET /api/v1/search?q=joão` retorna resultados agrupados: `{ orders: [...], technicians: [...] }`
2. Busca por nome de cliente retorna OS correspondentes (case-insensitive)
3. Busca por nome de técnico retorna técnicos correspondentes
4. Máximo 5 resultados por categoria
5. Query com menos de 2 caracteres retorna 400 com mensagem de validação
6. Input do usuário nunca é interpolado diretamente em SQL (sem injection)

**Deliverables:**
- `src/app/api/v1/search/route.ts`
- `src/lib/services/search.ts`
- `docs/api/search.md`

---

## Fase 10 — Segurança & Hardening

**Goal:** Auditoria e reforço de segurança em toda a API antes do lançamento
**Owner:** Wellison (liderado) + revisão cruzada do time
**Dependencies:** Todas as fases anteriores
**UI hint:** no

**Requisitos:** SEC-01, SEC-02, SEC-03, SEC-04

**Success criteria:**
1. Rate limiting ativo no endpoint de login — máx. 5 tentativas por minuto por IP
2. Headers de segurança verificados via `curl -I` ou ferramenta equivalente
3. Auditoria confirma que `service_role` key não aparece em nenhum arquivo frontend
4. CORS configurado para aceitar apenas os domínios do dashboard (não `*`)
5. Teste de penetração básico: nenhum endpoint retorna dados sem autenticação válida
6. RLS verificado — query com anon key não vaza dados sensíveis

**Deliverables:**
- `src/middleware.ts` atualizado com rate limiting
- `next.config.ts` com headers de segurança
- `docs/SECURITY.md` — checklist de segurança e resultados da auditoria

---

## Fase 11 — Documentação Final

**Goal:** Documentação completa para onboarding de novos devs e para criação do app mobile
**Owner:** Todos (liderado por Wellison — visão de arquitetura)
**Dependencies:** Todas as fases anteriores
**UI hint:** no

**Requisitos:** DOC-01, DOC-02, DOC-03, DOC-04, DOC-05

**Success criteria:**
1. `README.md` permite que um novo dev configure o ambiente do zero em menos de 30 minutos
2. Cada endpoint tem documentação: método, URL, params/body, resposta de sucesso, erros possíveis
3. `docs/DATABASE.md` inclui ERD textual e descrição de cada campo de cada tabela
4. `docs/MOBILE-API-GUIDE.md` descreve os contratos de API para uso pelo app mobile
5. Guia de migrations explica como criar, aplicar e resolver conflitos entre os 3 devs

**Deliverables:**
- `README.md` completo
- `docs/api/` — um arquivo por módulo (orders, technicians, dashboard, activities, notifications, search)
- `docs/DATABASE.md`
- `docs/MOBILE-API-GUIDE.md`
- `docs/MIGRATIONS.md`
- `docs/CONTRIBUTING.md` — guia para os 3 devs

---

## Ordem de Build Recomendada para Time de 3 Devs

```
Semana 1:
  Wellison: Fase 1 (Auth & Foundation) → Fase 2 (Schema & Migrations)
  Dev 2:    Aguarda Fase 1 → Planeja Fase 3 com o GSD
  Dev 3:    Aguarda Fase 1 → Planeja Fase 5 com o GSD

Semana 2:
  Wellison: Suporte técnico + revisão de código
  Dev 2:    Fase 3 (CRUD OS) → Fase 4 (State Machine)
  Dev 3:    Fase 5 (Técnicos) → Fase 6 (Dashboard)

Semana 3:
  Dev 2:    Fase 7 (Feed) ou Fase 9 (Busca)
  Dev 3:    Fase 8 (Notificações) ou Fase 7 (Feed)
  Wellison: Fase 10 (Segurança & Hardening) — conduz a revisão

Semana 4:
  Wellison: Lidera Fase 11 (Documentação Final — visão de arquitetura)
  Todos:    Testes integrados e review final
```

---
*Roadmap criado: 2026-04-25*
*11 fases | 51 requisitos | Todos mapeados ✓*
