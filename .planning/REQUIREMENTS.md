# Requirements: OS Manager — RWC Digital

**Defined:** 2026-04-25
**Core Value:** Gestores e técnicos precisam saber em tempo real o que está acontecendo em campo — ordens abertas, técnicos disponíveis e gargalos operacionais, de forma segura e acessível de qualquer dispositivo.

---

## v1 Requirements

### Autenticação & Autorização (AUTH)

- [ ] **AUTH-UI-01**: Página de Login responsiva com tema escuro premium
- [ ] **AUTH-UI-02**: Feedback visual de erro (Login inválido)
- [ ] **AUTH-01**: Admin pode fazer login com email e senha via Supabase Auth
- [ ] **AUTH-02**: Sessão persiste entre refreshes de página (cookies HttpOnly via @supabase/ssr)
- [ ] **AUTH-03**: Admin pode fazer logout de qualquer página
- [ ] **AUTH-04**: Rotas de API retornam 401 quando chamadas sem token válido
- [ ] **AUTH-05**: Sistema diferencia roles: Admin (acesso total) e Técnico (acesso restrito)
- [ ] **AUTH-06**: Técnico autenticado só visualiza e edita suas próprias OS
- [ ] **AUTH-07**: RLS habilitado e configurado em todas as tabelas sensíveis

### Foundation & Banco de Dados (DB)

- [ ] **DB-01**: Schema do banco implementado com tabelas: profiles, technicians, service_orders, activity_logs, notifications
- [ ] **DB-02**: Todas as tabelas usam UUID como chave primária
- [ ] **DB-03**: Índices criados nas colunas mais consultadas (status, technician_id, created_at)
- [ ] **DB-04**: Migrations versionadas na pasta `supabase/migrations/` e commitadas no git
- [ ] **DB-05**: Triggers PostgreSQL registram automaticamente mudanças de status de OS no activity_log
- [ ] **DB-06**: Variáveis de ambiente documentadas (.env.example) sem valores reais commitados

### Ordens de Serviço — CRUD (OS)

- [ ] **OS-UI-01**: Dashboard com listagem de OS e filtros (Status, Técnico, Data)
- [ ] **OS-UI-02**: Modal/Página para criação de nova OS
- [ ] **OS-UI-03**: Visualização detalhada da OS com histórico de atividades
- [ ] **OS-01**: Admin pode criar uma nova OS com: client_name, service_type, description, technician_id (opcional), scheduled_at (opcional)
- [ ] **OS-02**: Admin pode listar OS com filtros por: status, technician_id, intervalo de data
- [ ] **OS-03**: API de listagem de OS suporta paginação (limit + cursor ou page)
- [ ] **OS-04**: Admin pode visualizar detalhes completos de uma OS (incluindo técnico vinculado)
- [ ] **OS-05**: Admin pode editar campos de uma OS (cliente, serviço, descrição, técnico, agendamento)
- [ ] **OS-06**: API retorna as últimas OS criadas (endpoint "recentes") com limite configurável
- [ ] **OS-07**: Todos os inputs de OS são validados com Zod antes de persistir

### Ordens de Serviço — Máquina de Estado (SM)

- [ ] **SM-01**: OS inicia sempre com status PENDING
- [ ] **SM-02**: Transição PENDING → IN_PROGRESS requer technician_id associado
- [ ] **SM-03**: Transição IN_PROGRESS → COMPLETED registra completed_at automaticamente
- [ ] **SM-04**: Transição IN_PROGRESS → RETURNED requer return_reason
- [ ] **SM-05**: Transição RETURNED → PENDING permite reabrir a OS
- [ ] **SM-06**: API rejeita transições de status inválidas com erro 422 e mensagem clara
- [ ] **SM-07**: Ao iniciar OS (IN_PROGRESS), status do técnico é atualizado para IN_SERVICE
- [ ] **SM-08**: Ao concluir ou retornar OS, status do técnico é atualizado para AVAILABLE

### Técnicos (TECH)

- [ ] **TECH-01**: Admin pode cadastrar um técnico com: name, phone, email
- [ ] **TECH-02**: Admin pode listar técnicos ativos com seus status atuais
- [ ] **TECH-03**: Admin pode editar dados de um técnico
- [ ] **TECH-04**: Admin pode desativar um técnico (soft delete via is_active = false)
- [ ] **TECH-05**: API retorna lista de técnicos em campo (status EN_ROUTE ou IN_SERVICE)
- [ ] **TECH-06**: Status de técnico é atualizado automaticamente via mudanças de OS (SM-07 e SM-08)

### Dashboard & Métricas (DASH)

- [ ] **DASH-01**: API retorna: total de OS por status (PENDING, IN_PROGRESS, COMPLETED, RETURNED)
- [ ] **DASH-02**: API retorna: quantidade de técnicos por status (AVAILABLE, EN_ROUTE, IN_SERVICE)
- [ ] **DASH-03**: API retorna: tempo médio de conclusão das OS (completed_at - created_at)
- [ ] **DASH-04**: Métricas são filtráveis por intervalo de data
- [ ] **DASH-05**: API retorna dados para gráfico de volume: array de {dia, quantidade} dos últimos 7 dias
- [ ] **DASH-06**: API retorna indicador de tendência diária (novas OS hoje vs ontem)

### Feed de Atividades (ACT)

- [ ] **ACT-01**: API retorna feed de atividades em ordem cronológica decrescente
- [ ] **ACT-02**: Feed suporta paginação por cursor
- [ ] **ACT-03**: Cada evento de atividade contém: type, title, description, color, is_message, created_at, related_order_id, related_tech_id
- [ ] **ACT-04**: Tipos de evento suportados: STATUS_CHANGE, CHECK_IN, NEW_ORDER, MESSAGE, ASSIGNMENT
- [ ] **ACT-05**: Supabase Realtime emite eventos do feed para clientes conectados em tempo real

### Notificações (NOTF)

- [ ] **NOTF-01**: API retorna contagem de notificações não lidas para o usuário autenticado
- [ ] **NOTF-02**: Admin pode marcar notificações como lidas (individual e em lote)
- [ ] **NOTF-03**: Notificações são geradas automaticamente para: nova OS criada, OS retornada
- [ ] **NOTF-04**: Supabase Realtime emite nova notificação para o cliente em tempo real

### Busca Global (SRCH)

- [ ] **SRCH-01**: API aceita um termo de busca e retorna resultados agrupados por tipo
- [ ] **SRCH-02**: Busca cobre: nome de cliente (service_orders), nome de técnico (technicians)
- [ ] **SRCH-03**: Busca retorna no máximo 5 resultados por tipo para performance
- [ ] **SRCH-04**: Input de busca é sanitizado — sem SQL injection possível

### Segurança & Qualidade (SEC)

- [ ] **SEC-01**: Rate limiting aplicado nos endpoints de autenticação
- [ ] **SEC-02**: Headers de segurança configurados no Next.js (HSTS, X-Frame-Options, etc.)
- [ ] **SEC-03**: `service_role` key nunca exposta em variáveis NEXT_PUBLIC_ ou no cliente
- [ ] **SEC-04**: CORS configurado para aceitar apenas domínios autorizados

### Documentação (DOC)

- [ ] **DOC-01**: Cada endpoint documentado com: método, URL, params, body, resposta de sucesso, erros possíveis
- [ ] **DOC-02**: Arquivo `.env.example` com todas as variáveis necessárias e descrição
- [ ] **DOC-03**: Schema do banco documentado (ERD textual ou diagrama)
- [ ] **DOC-04**: Guia de setup local para novos desenvolvedores (README.md)
- [ ] **DOC-05**: Guia de contribuição de migrations para o time de 3 devs

---

## v2 Requirements

### Técnicos Avançado
- **TECH-V2-01**: Geolocalização em tempo real do técnico em campo
- **TECH-V2-02**: Avaliação de performance por técnico (taxa de conclusão, tempo médio)
- **TECH-V2-03**: Agenda e disponibilidade por horário

### OS Avançado
- **OS-V2-01**: Anexar fotos/arquivos a uma OS
- **OS-V2-02**: Assinatura digital do cliente ao concluir OS
- **OS-V2-03**: Templates de OS por tipo de serviço
- **OS-V2-04**: OS recorrentes (agendamento periódico)
- **OS-V2-05**: SLA por tipo de serviço com alertas de violação

### Dashboard Avançado
- **DASH-V2-01**: Comparativo semana/mês anterior
- **DASH-V2-02**: Taxa de primeiro atendimento (sem retorno)
- **DASH-V2-03**: Exportação de relatórios (PDF/Excel)

### Auth Avançado
- **AUTH-V2-01**: Convite de novos usuários por e-mail
- **AUTH-V2-02**: 2FA para Admin
- **AUTH-V2-03**: Log de sessões e acessos

### App Mobile
- **MOB-V2-01**: App mobile consumindo a mesma API v1 (iOS/Android)
- **MOB-V2-02**: Push notifications via FCM/APNs
- **MOB-V2-03**: Fluxo de check-in/check-out pelo técnico via mobile

---

## Out of Scope

| Feature | Motivo |
|---------|--------|
| App mobile (construção) | Fase futura — API será compatível mas o app não entra neste milestone |
| Chat em tempo real (WebSocket dedicado) | ActivityLog + mensagens básicas cobrem a necessidade de v1 |
| Integração com ERP/faturamento | Escopo completamente diferente — ferramenta dedicada |
| Pagamentos | Fora do contexto operacional deste sistema |
| OAuth (Google, GitHub) | Email/senha via Supabase Auth é suficiente para v1 |
| Gamificação de performance | Pode gerar conflito entre técnicos — decidido não implementar |
| GPS tracking em tempo real | Requer consentimento legal explícito — deferir com framework legal |
| Business Intelligence avançado | Ferramentas dedicadas (Metabase, Looker) fazem melhor |

---

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| AUTH-01 a AUTH-07 | Fase 1 — Auth & Foundation | Pending |
| DB-01 a DB-06 | Fase 2 — Schema & Migrations | Pending |
| OS-01 a OS-07 | Fase 3 — CRUD de OS | Pending |
| SM-01 a SM-08 | Fase 4 — Máquina de Estado de OS | Pending |
| TECH-01 a TECH-06 | Fase 5 — Gestão de Técnicos | Pending |
| DASH-01 a DASH-06 | Fase 6 — Dashboard & Métricas | Pending |
| ACT-01 a ACT-05 | Fase 7 — Feed de Atividades | Pending |
| NOTF-01 a NOTF-04 | Fase 8 — Notificações | Pending |
| SRCH-01 a SRCH-04 | Fase 9 — Busca Global | Pending |
| SEC-01 a SEC-04 | Fase 10 — Segurança & Hardening | Pending |
| DOC-01 a DOC-05 | Fase 11 — Documentação Final | Pending |

**Coverage:**
- v1 requirements: 51 total
- Mapped to phases: 51
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-25*
*Last updated: 2026-04-25 após pesquisa inicial*
