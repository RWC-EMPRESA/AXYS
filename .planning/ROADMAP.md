# ROADMAP.md — OS Manager (RWC Digital)

**Milestone:** v1.0 — Fullstack MVP (Next.js + Supabase)
**Granularity:** Fine (Fases divididas em Backend e Frontend)
**Team:** 3 desenvolvedores (Wellison + 2)

---

## Mapa de Fases

| # | Recurso / Fase | Backend (API/Infra) | Frontend (UI/UX) |
|---|----------------|-------------------|-----------------|
| **1** | **Setup & Auth** | Setup Supabase, Middleware, Auth API | Tela de Login, Layout Base, Auth Guards |
| **2** | **Infra de Dados** | Migrations, Triggers, RLS | (Apoio em tipos e conexões) |
| **3** | **Módulo OS** | API CRUD de Ordens de Serviço | Listagem de OS, Filtros, Modal de Criação |
| **4** | **Workflow de Campo**| Máquina de Estados, Validação de Status | Botões de Ação (Check-in), Status Timeline |
| **5** | **Gestão de Técnicos**| API CRUD de Técnicos e Status | Lista de Equipe, Cards de Status |
| **6** | **Dashboard** | Endpoints de Métricas e Gráficos | Stat Cards, Gráfico de Volume (7 dias) |
| **7** | **Real-time Feed** | Triggers de Activity Log, Realtime | Sidebar de Atividades, Auto-update |
| **8** | **Notificações** | Lógica de Notificações Unread | Badge no Header, Lista de Notificações |
| **9** | **Busca Global** | Endpoint de Busca Full-text | Barra de Busca, Resultados Agrupados |
| **10**| **Hardening** | Rate Limit, CORS, Auditoria RLS | Feedback de Erro Global, Performance |
| **11**| **Entrega** | Documentação API e Guia Mobile | Walkthrough Final, Deploy |

---

## Fase 1 — Setup & Auth

**Objetivo:** Projeto inicializado e sistema de login funcional para Admin e Técnico.

**[BACKEND] Tarefas:**
- Inicializar projeto Next.js e Supabase.
- Configurar `src/middleware.ts` para proteção de rotas.
- Criar endpoints `/api/v1/auth/login` e `/logout`.
- Definir roles (Admin/Technician) na tabela `profiles`.

**[FRONTEND] Tarefas:**
- Criar a página de Login (UI Premium Dark).
- Implementar Layout Global (Sidebar/Navbar base).
- Lógica de persistência de sessão no cliente.

---

## Fase 3 — Módulo OS

**Objetivo:** Gestão centralizada das Ordens de Serviço.

**[BACKEND] Tarefas:**
- CRUD de OS (`GET`, `POST`, `PATCH`).
- Paginação e filtros no banco.
- Endpoint de "OS Recentes".

**[FRONTEND] Tarefas:**
- Tabela/Lista de OS com filtros.
- Formulário de criação de OS.
- Visualização de detalhes da OS.

---

## Fase 5 — Gestão de Técnicos

**Objetivo:** Controle de quem está em campo e disponibilidade.

**[BACKEND] Tarefas:**
- API de Técnicos e atualização de status.
- Endpoint de técnicos ativos/em campo.

**[FRONTEND] Tarefas:**
- Tela de listagem de técnicos.
- Indicadores visuais de status (Available, Busy, In Route).

*(Fases 4, 6-11 seguem a mesma lógica de separação... detalharei no planejamento de cada uma)*

---
*Roadmap atualizado em: 2026-04-27 — Visão Front/Back dividida.*
