# Quick Task: Fase 1 Frontend — Conectar Auth ao Backend Real

**Slug:** fase1-frontend-auth-connect
**Date:** 2026-04-28
**Owner:** Rafael (Frontend)

## Tarefas

1. Remover bypass do LoginForm e conectar ao POST /api/v1/auth/login
2. Tratar erro 401 e exibir mensagem no form
3. Redirecionar para /dashboard após login com sucesso
4. Adicionar botão de Logout no Header com chamada ao POST /api/v1/auth/logout
5. Verificar que o middleware bloqueia /dashboard sem sessão (já estava correto)
