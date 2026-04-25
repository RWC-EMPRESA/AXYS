# OS Manager — AXYS (RWC Digital)

## What This Is

Sistema de gestão de Ordens de Serviço (OS) para a empresa RWC Digital. O produto é um backend API escalável e seguro (construído sobre Supabase) que serve um frontend Next.js já existente — o **OS Manager Dashboard**. Permite que gestores acompanhem em tempo real o status de ordens de serviço, técnicos em campo, métricas de performance e feed de atividades da equipe.

## Core Value

Técnicos e gestores precisam saber exatamente o que está acontecendo em campo agora — o sistema deve garantir dados precisos e em tempo real sobre ordens abertas, técnicos disponíveis e gargalos operacionais.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(Nenhum ainda — em construção)

### Active

<!-- Escopo atual. Construindo em direção a esses. -->

#### Autenticação & Autorização
- [ ] Usuário Admin pode fazer login com email/senha via Supabase Auth
- [ ] Sessão persiste entre refreshes de página
- [ ] Rotas de API protegidas por JWT/RLS do Supabase
- [ ] Controle de acesso por role (Admin, Técnico)

#### Dashboard / Métricas
- [ ] API retorna métricas agregadas: total pendentes, em andamento, concluídas, tempo médio
- [ ] Métricas filtráveis por intervalo de data
- [ ] API retorna dados para gráfico de volume de atendimentos (últimos 7 dias)

#### Técnicos
- [ ] CRUD completo de técnicos (cadastro, edição, desativação)
- [ ] API retorna lista de técnicos ativos com status (AVAILABLE, EN_ROUTE, IN_SERVICE)
- [ ] Status do técnico atualiza em tempo real via Supabase Realtime

#### Ordens de Serviço (OS)
- [ ] CRUD completo de Ordens de Serviço
- [ ] OS tem campos: id, client_name, service_type, description, status, technician_id, scheduled_at, completed_at
- [ ] Status possíveis: PENDING, IN_PROGRESS, COMPLETED, RETURNED
- [ ] API de OS recentes com suporte a paginação e filtros
- [ ] Atribuição de técnico a uma OS
- [ ] Retorno de OS gera evento de ActivityLog
- [ ] Contagem de retornos pendentes disponível via API

#### Feed de Atividades
- [ ] API retorna feed cronológico de eventos (ActivityLog)
- [ ] Tipos de evento: STATUS_CHANGE, CHECK_IN, NEW_ORDER, MESSAGE
- [ ] Feed atualiza em tempo real via Supabase Realtime
- [ ] Eventos vinculados a OS e/ou técnico relacionado

#### Notificações
- [ ] API retorna contagem de notificações não lidas por usuário
- [ ] Integração em tempo real para push de novas notificações

#### Busca Global
- [ ] Endpoint de busca global filtrando OS, Clientes e Técnicos por termo

#### Segurança
- [ ] Row Level Security (RLS) habilitado em todas as tabelas sensíveis
- [ ] Validação e sanitização de inputs em todos os endpoints
- [ ] Rate limiting nos endpoints públicos
- [ ] Variáveis de ambiente para credenciais (nunca hardcoded)

#### Documentação
- [ ] Documentação completa de cada endpoint (contrato de API)
- [ ] Guia de ambiente (setup local, variáveis necessárias)
- [ ] Documentação de schema do banco de dados (para futura criação do app mobile)

### Out of Scope

- App mobile — Previsto para fase futura; a API será construída para suportar, mas o app não entra neste escopo
- Chat em tempo real complexo (WebSocket dedicado) — ActivityLog cobre o necessário por ora
- Pagamentos / faturamento — Fora do escopo operacional deste sistema
- OAuth (Google, GitHub) — Email/senha via Supabase Auth é suficiente para v1

## Context

- **Frontend existente:** Next.js 16.2.4 (App Router) + React 19.2.4 + Tailwind CSS v4, com dashboard já implementado visualmente. O backend deve servir exatamente os formatos de dados que o frontend consome.
- **Time:** 3 desenvolvedores trabalhando em paralelo em partes independentes do sistema — exige arquitetura modular com contratos de API claros e documentação suficiente para cada dev saber exatamente onde está e o que é seu.
- **Banco de dados:** Supabase (PostgreSQL gerenciado) — inclui Auth, Realtime e Row Level Security (RLS) nativos.
- **Futuro:** Após o backend funcional, será criado um app mobile que deve consumir a mesma API sem quebras — cada endpoint deve ser versionável e bem documentado.
- **Design de segurança:** Cada etapa deve ser testada (pelo agente e pelo usuário) antes de avançar — abordagem iterativa e validada.

## Constraints

- **Tech Stack:** Supabase (PostgreSQL + Auth + Realtime + RLS) — não negociável
- **Compatibilidade Frontend:** Os contratos de resposta da API devem ser 100% compatíveis com o frontend Next.js descrito no documento de design
- **Time Multi-Dev:** Cada fase/módulo deve ser construída de forma independente e não gerar conflito de merge entre os 3 desenvolvedores
- **Segurança:** RLS obrigatório em tabelas sensíveis; validação obrigatória em todos os endpoints
- **Documentação:** Toda fase deve gerar documentação de API atualizada antes de ser considerada concluída
- **Testes por Etapa:** Cada fase deve ser testada (agente + usuário) antes de avançar para a próxima

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase como banco | PostgreSQL gerenciado + Auth + Realtime nativos, elimina necessidade de backend server separado | — Pending |
| RLS em todas as tabelas | Segurança em camada de banco, não apenas na API | — Pending |
| API REST (não GraphQL) | Mais simples de documentar e consumir pelo app mobile futuro | — Pending |
| Arquitetura modular por domínio | 3 devs trabalhando em paralelo sem conflitos — cada módulo é independente | — Pending |
| Versionamento de API | Garante que o app mobile futuro possa ser criado sem breaking changes | — Pending |
| Documentação como entregável de fase | Cada fase só é concluída com documentação atualizada | — Pending |

## Evolution

Este documento evolui a cada transição de fase e marco de milestone.

**Após cada transição de fase** (via `/gsd-transition`):
1. Requisitos invalidados? → Mover para Out of Scope com motivo
2. Requisitos validados? → Mover para Validated com referência da fase
3. Novos requisitos surgiram? → Adicionar em Active
4. Decisões a registrar? → Adicionar em Key Decisions
5. "What This Is" ainda é preciso? → Atualizar se tiver divergido

**Após cada milestone** (via `/gsd-complete-milestone`):
1. Revisão completa de todas as seções
2. Verificação do Core Value — ainda é a prioridade certa?
3. Auditoria do Out of Scope — motivos ainda válidos?
4. Atualizar Context com estado atual

---
*Last updated: 2026-04-25 após inicialização do projeto*
