
# PITFALLS.md — OS Manager

## 1. RLS — Políticas Mal Configuradas

### Armadilha: RLS Desabilitado em Tabelas Sensíveis
**Sintoma:** Usuário anônimo consegue ler service_orders pelo client Supabase.
**Causa:** Esqueceu de executar `ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY`.
**Prevenção:** Sempre habilitar RLS antes de criar policies. Sem policies + RLS habilitado = nenhum acesso (seguro). Sem RLS = acesso total (perigoso).
**Fase crítica:** Fase 1 (setup do banco)

### Armadilha: Policy que Funciona para Admin mas Vaza Dados do Técnico
**Sintoma:** Técnico consegue ver OS de outros técnicos.
**Causa:** Policy admin usa `USING (true)` mas a policy do técnico não existe ou está errada.
**Prevenção:** Testar com JWT de técnico real — não só com service_role. Criar testes RLS automatizados.
**Fase crítica:** Fase 1 e Fase 2 (OS)

### Armadilha: Performance Degradada por Policy Complexa
**Sintoma:** Queries lentas em tabelas com muitos registros.
**Causa:** Policy com subquery não indexada (ex: `EXISTS (SELECT 1 FROM profiles WHERE...)`).
**Prevenção:** Usar `auth.uid()` direto quando possível. Evitar JOINs dentro de policies. Verificar `EXPLAIN ANALYZE` nas queries.
**Fase crítica:** Fases de performance/otimização

---

## 2. Realtime — Vazamentos e Limites

### Armadilha: Memory Leak por Não Remover Subscriptions
**Sintoma:** Browser fica lento após navegar entre páginas; erros de "too many connections".
**Causa:** `supabase.channel().subscribe()` chamado mas nunca `supabase.removeChannel()`.
**Prevenção:** Sempre usar o padrão cleanup em React:
```ts
useEffect(() => {
  const channel = supabase.channel('...').subscribe()
  return () => { supabase.removeChannel(channel) } // OBRIGATÓRIO
}, [])
```
**Fase crítica:** Qualquer fase que implemente Realtime no frontend

### Armadilha: Limite de Conexões Simultâneas
**Sintoma:** Usuários não recebem updates em tempo real.
**Causa:** Supabase free tier tem limite de conexões Realtime (~200 simultâneas).
**Prevenção:** Multiplexar um único canal por tabela, não criar canal por usuário. Monitorar conexões no Supabase Dashboard.
**Fase crítica:** Lançamento / escala

### Armadilha: Realtime não Funciona com RLS sem Permissão de SELECT
**Sintoma:** Cliente subscrito mas nunca recebe eventos.
**Causa:** RLS bloqueia o SELECT subjacente — o Realtime só envia eventos de linhas que o usuário tem permissão de ler.
**Prevenção:** Garantir que a policy SELECT está correta antes de testar Realtime.

---

## 3. Schema & Migrations

### Armadilha: UUID vs BIGSERIAL para IDs
**Sintoma:** Performance ruim em JOINs; conflitos ao criar dados de teste.
**Causa:** Usar `BIGSERIAL` torna IDs previsíveis e cria problemas em ambientes multi-tenant.
**Prevenção:** Sempre usar `UUID DEFAULT gen_random_uuid()` para IDs. O Supabase já usa UUID nativamente.

### Armadilha: Missing Indexes em Colunas Filtradas
**Sintoma:** Queries de listagem de OS ficam lentas com 1.000+ registros.
**Causa:** `status`, `technician_id`, `created_at` sem índice.
**Prevenção:** Criar índices desde o início nas colunas que aparecem em filtros:
```sql
CREATE INDEX idx_orders_status ON service_orders(status);
CREATE INDEX idx_orders_technician ON service_orders(technician_id);
CREATE INDEX idx_orders_created_at ON service_orders(created_at DESC);
```
**Fase crítica:** Fase 1 (schema)

### Armadilha: Conflito de Migrations entre Devs
**Sintoma:** `supabase db push` falha com conflito de timestamps idênticos.
**Causa:** Dois devs criaram migrations no mesmo segundo.
**Prevenção:** Nunca editar migrations já commitadas. Usar `supabase migration new [nome-descritivo]` que gera timestamp único. Comunicar no chat ao criar nova migration.

---

## 4. Autenticação

### Armadilha: `service_role` Key Exposta no Frontend
**Sintoma:** Qualquer usuário consegue acessar dados sem passar pelo RLS.
**Causa:** `SUPABASE_SERVICE_ROLE_KEY` usada em código do cliente ou exposta em variáveis `NEXT_PUBLIC_`.
**Prevenção:** `service_role` key NUNCA em variáveis `NEXT_PUBLIC_*`. Apenas em API Routes server-side. Auditar `.env.local` e código antes de qualquer commit.
**Fase crítica:** Fase 1 (crítico de segurança)

### Armadilha: JWT Expirado Não Tratado
**Sintoma:** Usuário recebe erro 401 sem ser redirecionado para login.
**Causa:** Não implementar refresh automático de token.
**Prevenção:** Usar `@supabase/ssr` que gerencia refresh automaticamente. Implementar handler global de 401.

### Armadilha: `anon` Key com Permissões Demais
**Sintoma:** Usuário não autenticado acessa dados.
**Causa:** RLS não habilitado ou policies mal configuradas.
**Prevenção:** Testar sempre com `anon` key (sem login) e verificar que não há acesso indevido.

---

## 5. Performance — N+1 Queries

### Armadilha: Buscar Técnico Separadamente para Cada OS
**Sintoma:** 20 OS = 21 queries ao banco.
**Causa:** Loop em JS fazendo `supabase.from('technicians').select().eq('id', order.technician_id)`.
**Prevenção:** Usar JOIN do Supabase via `select` com relacionamentos:
```ts
supabase.from('service_orders')
  .select('*, technicians(id, name, status)')
  .limit(20)
```
**Fase crítica:** Fase de OS (CRUD + listagem)

---

## 6. Máquina de Estado — Transições Inválidas

### Armadilha: Status Pulando Etapas
**Sintoma:** OS vai de PENDING direto para COMPLETED sem passar por IN_PROGRESS.
**Causa:** Nenhuma validação de transição na API.
**Prevenção:** Validar transições explicitamente:
```ts
const VALID_TRANSITIONS = {
  PENDING: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED', 'RETURNED'],
  RETURNED: ['PENDING'],
  COMPLETED: [],  // estado final
}
```

### Armadilha: Race Condition em Atribuição Simultânea
**Sintoma:** Dois admins atribuem o mesmo técnico a OS diferentes ao mesmo tempo — técnico fica com duas OS IN_PROGRESS.
**Causa:** Sem lock otimista ou verificação de status do técnico.
**Prevenção:** Verificar `technician.status === 'AVAILABLE'` dentro de uma transaction antes de mudar ambos os status.

---

## 7. Mobile API — Future-Proofing

### Armadilha: Remover ou Renomear Campos de Resposta
**Sintoma:** App mobile quebra após update do backend.
**Causa:** API removeu campo que o mobile usava.
**Prevenção:** Nunca remover campos — apenas deprecar com aviso. Usar versionamento de API (`/api/v1/`, `/api/v2/`).

### Armadilha: Resposta sem Paginação
**Sintoma:** App mobile recebe 10.000 OS em uma única chamada → crash por memória.
**Causa:** API sem limite padrão de registros.
**Prevenção:** Sempre aplicar `limit` padrão (ex: 20) em listagens. Nunca retornar todos os registros sem paginação.

---

## 8. Segurança Geral

### Armadilha: CORS Aberto Demais
**Sintoma:** Qualquer site pode fazer requests para a API.
**Causa:** `Access-Control-Allow-Origin: *` em API routes.
**Prevenção:** Restringir CORS aos domínios do dashboard e do app. Em Next.js, isso é controlado via `next.config.ts`.

### Armadilha: Sem Validação de Input — SQL Injection via `ilike`
**Sintoma:** Busca global vulnerável a SQL injection.
**Causa:** Interpolar string do usuário diretamente: `ilike('%' + userInput + '%')`.
**Prevenção:** Usar sempre o cliente Supabase (parameterizado automaticamente). Nunca usar `supabase.rpc()` com SQL dinâmico sem sanitização. Validar input com Zod antes de usar na query.

---

*Pesquisa realizada: 2026-04-25*
