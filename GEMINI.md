<!-- GSD:project-start source:PROJECT.md -->
## Project

**OS Manager — AXYS (RWC Digital)**

Sistema de gestão de Ordens de Serviço (OS) para a empresa RWC Digital. O produto é um backend API escalável e seguro (construído sobre Supabase) que serve um frontend Next.js já existente — o **OS Manager Dashboard**. Permite que gestores acompanhem em tempo real o status de ordens de serviço, técnicos em campo, métricas de performance e feed de atividades da equipe.

**Core Value:** Técnicos e gestores precisam saber exatamente o que está acontecendo em campo agora — o sistema deve garantir dados precisos e em tempo real sobre ordens abertas, técnicos disponíveis e gargalos operacionais.

### Constraints

- **Tech Stack:** Supabase (PostgreSQL + Auth + Realtime + RLS) — não negociável
- **Compatibilidade Frontend:** Os contratos de resposta da API devem ser 100% compatíveis com o frontend Next.js descrito no documento de design
- **Time Multi-Dev:** Cada fase/módulo deve ser construída de forma independente e não gerar conflito de merge entre os 3 desenvolvedores
- **Segurança:** RLS obrigatório em tabelas sensíveis; validação obrigatória em todos os endpoints
- **Documentação:** Toda fase deve gerar documentação de API atualizada antes de ser considerada concluída
- **Testes por Etapa:** Cada fase deve ser testada (agente + usuário) antes de avançar para a próxima
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
## Decisão Arquitetural: Onde Hospedar a Lógica de API
### Escolha Recomendada: Next.js API Routes (App Router)
- Triggers assíncronos (ex: envio de e-mail ao criar OS)
- Webhooks externos
- Processamento pesado fora do ciclo request/response
## Estratégia de Auth & RLS
### Auth
- **Supabase Auth** com email/senha (já configurado)
- Tokens JWT armazenados em cookies HttpOnly (Next.js `@supabase/ssr`)
- Middleware Next.js intercepta rotas e valida sessão
### RLS — Roles
## Estratégia Real-Time
### Escolha: Supabase Realtime — Postgres Changes
| Canal | Tabela | Eventos |
|---|---|---|
| `orders_realtime` | service_orders | INSERT, UPDATE |
| `technicians_realtime` | technicians | UPDATE (status) |
| `activities_realtime` | activity_logs | INSERT |
| `notifications_realtime` | notifications | INSERT |
## Validação & Segurança
### Zod (validação de schema)
### Rate Limiting
- **Upstash Redis** (serverless, funciona com Vercel/Next.js) — ★★★★☆
- Alternativa simples: middleware com IP-based counter em memória (não persiste entre instâncias)
- Para MVP: `next-rate-limit` ou implementação manual com Upstash
### Headers de Segurança
## Design de API para Multi-Cliente (Web + Mobile)
### Versionamento
### Formato de Resposta Padronizado
### Paginação
- Cursor-based para mobile (melhor performance)
- Offset-based para web dashboard (mais simples)
- Suportar ambos via query params: `?limit=20&cursor=xyz` ou `?page=1&limit=20`
## O Que NÃO Usar
| Opção | Por quê Evitar |
|---|---|
| Prisma com Supabase | Prisma não suporta RLS nativamente — bypass de segurança crítico |
| GraphQL (Apollo) | Overhead desnecessário para equipe de 3 devs; REST é suficiente e mais fácil de documentar para mobile |
| Supabase Edge Functions como camada principal | Cold start, limite de tamanho, difícil de testar localmente |
| JWT armazenado em localStorage | Vulnerável a XSS — usar cookies HttpOnly |
| `service_role` no cliente | Bypassa toda RLS — risco crítico de segurança |
| Sem paginação desde o início | Impossível de retrofitar em produção sem breaking changes |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
