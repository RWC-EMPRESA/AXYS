# Phase 1 Context — Setup & Auth (Backend)

**Status:** Decided
**Owner:** Wellison (Backend/Architecture)

---

## 🎯 Objetivo da Fase
Configurar a base técnica do projeto AXYS, incluindo a estrutura de pastas profissional, o client do Supabase e o sistema de autenticação via Middleware para garantir segurança desde o dia 1.

---

## 🛠️ Decisões Técnicas

### 1. Arquitetura de Pastas
- Padrão **Modular/Clean Architecture** em `src/`.
- Grupos de rotas no App Router: `(auth)` e `(dashboard)`.
- Lógica de banco isolada em `lib/supabase` e `services/`.

### 2. Autenticação & Sessão
- **Provider:** Supabase Auth (Email/Senha).
- **Client Strategy:** `@supabase/ssr` com Cookies HttpOnly para persistência segura.
- **Implementation:** Route Handlers (`/api/v1/auth/...`) para login/logout/me.

### 3. Autorização & Segurança
- **Role Management:** Coluna `role` (enum: 'admin', 'technician') na tabela `profiles`.
- **Middleware Scope:** Proteção total por padrão. Todas as rotas `/api/v1/*` e rotas de dashboard exigem autenticação, exceto `/api/v1/auth/login`.

### 4. Integração com Frontend
- Desenvolvimento paralelo. O backend deve fornecer contratos de API estáveis para que os devs de frontend possam trabalhar em suas respectivas branches (`feat/fase-1-login-ui` e `feat/fase-1-layout-base`).

---

## 📝 Gray Areas Resolvidas
- **Estrutura:** Definida como modular para evitar conflitos de Git entre 3 devs.
- **Fluxo de Trabalho:** Uso de branches por feature e PRs obrigatórios.

## ⚠️ Riscos Identificados
- **Chaves do Supabase:** Precisam ser configuradas no `.env.local` assim que o Wellison criar o projeto.
- **Sincronização de Roles:** Garantir que o `profiles` seja criado automaticamente via trigger no Supabase Auth (será planejado detalhadamente na Fase 2, mas a estrutura começa aqui).
