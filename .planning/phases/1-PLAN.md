# Plan: Fase 1 — Setup & Auth (Backend)

Este plano foca na estruturação inicial do projeto e na implementação da base de autenticação para o time.

---

## 🏗️ 1. Estrutura de Pastas Profissional
Criação dos diretórios raiz para garantir a arquitetura modular decidida.

- [ ] Criar diretórios:
  - `src/app/(auth)`
  - `src/app/(dashboard)`
  - `src/app/api/v1/auth`
  - `src/components/ui`
  - `src/components/shared`
  - `src/components/features`
  - `lib/supabase`
  - `services`
  - `validations`
  - `types`

---

## 🔑 2. Configuração Supabase (Backend)
Configurar a comunicação segura com o banco.

- [ ] Instalar dependências: `npm install @supabase/supabase-js @supabase/ssr zod`
- [ ] Criar `.env.example` com placeholders para URL e Anon Key.
- [ ] Criar `src/lib/supabase/client.ts` (Client para o navegador).
- [ ] Criar `src/lib/supabase/server.ts` (Client para Server Components).
- [ ] Criar `src/lib/supabase/middleware.ts` (Client para o Middleware).

---

## 🛡️ 3. Middleware & Segurança
Implementar o "Guarda" das rotas.

- [ ] Criar `src/middleware.ts`:
  - Lógica para atualizar a sessão via cookies.
  - Bloqueio de acesso a `/dashboard/*` se não estiver logado.
  - Bloqueio de acesso a `/api/v1/*` (exceto `/auth/login`) sem token.
  - Redirecionamento inteligente.

---

## 📡 4. Route Handlers (Auth API)
Endpoints para o frontend consumir.

- [ ] `src/app/api/v1/auth/login/route.ts`:
  - Receber email/senha.
  - Chamar Supabase Auth.
  - Retornar sucesso ou erro 401.
- [ ] `src/app/api/v1/auth/logout/route.ts`:
  - Encerrar sessão e limpar cookies.
- [ ] `src/app/api/v1/auth/me/route.ts`:
  - Retornar dados do usuário logado (perfil + role).

---

## ✅ Verificação
- [ ] Testar se o Middleware redireciona corretamente ao acessar `/dashboard` sem estar logado.
- [ ] Validar que a API de Login retorna o erro correto com credenciais inválidas.
- [ ] Confirmar que o `.env.example` está completo para os outros devs.
