# SUMMARY.md — Síntese de Pesquisa

## OS Manager — RWC Digital

**Domínio:** Field Service Order Management (FSOM)
**Stack decidida:** Next.js API Routes + Supabase + TypeScript + Zod
**Time:** 3 desenvolvedores, módulos independentes

---

## Stack Recomendada

| Camada | Tecnologia |
|--------|-----------|
| API Layer | Next.js 15+ API Routes (App Router) |
| Banco | Supabase PostgreSQL 15 |
| Auth | Supabase Auth + `@supabase/ssr` |
| Real-time | Supabase Realtime (Postgres Changes) |
| Validação | Zod ^3.23 |
| Tipagem | TypeScript 5.4+ |
| Documentação | OpenAPI 3.1 |
| Testes | Vitest + Supertest |

---

## Features — O Que É Table Stakes para v1

- ✅ CRUD completo de Ordens de Serviço com máquina de estado
- ✅ Gestão de técnicos com status em tempo real
- ✅ Dashboard com 4 métricas principais + gráfico 7 dias
- ✅ Feed de atividades em tempo real
- ✅ Notificações (contagem não lidas)
- ✅ Busca global (OS, clientes, técnicos)
- ✅ Auth com roles (Admin / Técnico)
- ✅ RLS em todas as tabelas
- ✅ Paginação em todas as listagens
- ✅ Documentação de API por módulo

---

## Arquitetura — Componentes e Ordem de Build

```
Fase 1 → Auth & Foundation (Dev 1) — TODOS dependem disso
  ↓
Fase 2 → Schema & Migrations (Dev 1 continua)
  ↓
Fases 3-4 → Módulo OS (Dev 2) — independente do Módulo Técnicos
Fases 5-6 → Módulo Técnicos/Dashboard (Dev 3) — independente do Módulo OS
  ↓
Fase 7 → Real-time (todos juntos)
  ↓
Fase 8 → Segurança & Rate Limiting
  ↓
Fase 9 → Documentação & Testes Finais
```

---

## Principais Riscos — Watch Out For

### 🔴 Críticos (podem comprometer segurança)
1. **`service_role` key exposta** — Nunca em variáveis NEXT_PUBLIC_
2. **RLS desabilitado** — Habilitar RLS em TODAS as tabelas desde o início
3. **CORS aberto** — Configurar desde a fase de auth

### 🟡 Moderados (podem comprometer qualidade)
4. **Falta de índices** — Criar desde o schema inicial (status, technician_id, created_at)
5. **Memory leak de subscriptions** — Sempre fazer cleanup no useEffect
6. **N+1 queries** — Usar JOINs do Supabase, não loops JS

### 🟢 Riscos de Produto (podem comprometer futuro)
7. **Sem paginação desde o início** — Impossível retrofitar sem breaking changes
8. **Remover campos de API** — Usar versionamento `/api/v1/` para proteger mobile futuro
9. **Sem validação de transição de estado** — Implementar na camada de API, não só no frontend

---

## Decisões-Chave Confirmadas pela Pesquisa

| Decisão | Confirmada? | Nota |
|---------|------------|------|
| Supabase como plataforma | ✅ | Padrão dominante para projetos Next.js em 2025 |
| RLS em todas as tabelas | ✅ | Crítico — sem isso, segurança inexiste |
| Next.js API Routes (não Edge Functions) | ✅ | Mais simples de testar e manter para time pequeno |
| REST (não GraphQL) | ✅ | Mais fácil de documentar e consumir por mobile |
| Zod para validação | ✅ | Padrão de mercado TypeScript — tipagem automática |
| UUIDs como IDs | ✅ | Compatível com Supabase Auth e seguro |
| Paginação desde o início | ✅ | Mobile exige; não retrofitar depois |

---

*Síntese gerada: 2026-04-25*
