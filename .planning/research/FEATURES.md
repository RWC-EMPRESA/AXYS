# FEATURES.md — OS Manager

## Categoria: Gestão de Ordens de Serviço (OS)

### Table Stakes (v1 obrigatório)
- Criar OS com campos: cliente, tipo de serviço, descrição, status inicial PENDING
- Listar OS com filtros por status, data, técnico
- Visualizar detalhes de uma OS específica
- Editar OS (alterar descrição, tipo, técnico designado)
- Atribuir técnico a uma OS
- Transições de status controladas: PENDING → IN_PROGRESS → COMPLETED
- Retorno de OS (status RETURNED) com motivo
- Paginação na listagem de OS

### Differentiators (v2)
- Anexar fotos/arquivos à OS
- Assinatura digital do cliente ao concluir
- Histórico completo de mudanças por OS (change log detalhado)
- Template de OS por tipo de serviço
- OS recorrentes (agendamento periódico)
- SLA por tipo de serviço (alerta se ultrapassar)

### Anti-Features (evitar)
- Editor rich-text para descrição na v1 (complexidade desnecessária)
- Integração com ERP/faturamento (escopo completamente diferente)
- Workflow de aprovação multi-nível (overengineering para equipe pequena)

---

## Categoria: Gestão de Técnicos

### Table Stakes (v1 obrigatório)
- Cadastrar técnico (nome, contato, status inicial)
- Listar técnicos ativos com status atual (AVAILABLE, EN_ROUTE, IN_SERVICE)
- Atualizar status do técnico manualmente
- Vincular técnico a uma OS (atribuição)
- Visualizar OS em andamento de um técnico

### Differentiators (v2)
- Geolocalização em tempo real do técnico
- Rastreamento de rota e tempo de deslocamento
- Avaliação de performance por técnico
- Disponibilidade por agenda/horário
- App mobile para técnicos checarem entrada/saída

### Anti-Features
- GPS tracking sem consentimento explícito do técnico (legal risk)
- Gamificação de performance (pode gerar conflito)

---

## Categoria: Dashboard & Métricas

### Table Stakes (v1 obrigatório)
- Total de OS por status (Pendentes, Em Andamento, Concluídas, Retornadas)
- Tendência diária (quantas novas OS vs concluídas hoje)
- Tempo médio de atendimento (conclusão - criação)
- Volume de atendimentos nos últimos 7 dias (gráfico)
- Número de técnicos por status (quantos disponíveis agora)

### Differentiators (v2)
- Taxa de primeiro atendimento (resolução sem retorno)
- Heat map de OS por região/bairro
- Comparativo semana/mês anterior
- Exportação de relatórios (PDF/Excel)
- Metas e alertas de KPI

### Anti-Features
- Business Intelligence complexo em v1 (ferramentas dedicadas fazem melhor)

---

## Categoria: Feed de Atividades (Activity Log)

### Table Stakes (v1 obrigatório)
- Registrar automaticamente eventos: criação de OS, mudança de status, atribuição de técnico
- Feed cronológico reverso (mais recente primeiro)
- Tipos de evento distintos com ícone/cor própria
- Vínculo com OS e/ou técnico relacionado
- Atualização em tempo real no dashboard

### Differentiators (v2)
- Comentários/notas em eventos de atividade
- Filtro de feed por tipo de evento ou técnico
- Exportação do log de atividades para auditoria

### Anti-Features
- Feed como chat em tempo real (ferramenta separada resolve melhor — Slack, Teams)

---

## Categoria: Notificações

### Table Stakes (v1 obrigatório)
- Contagem de notificações não lidas no header
- Marcar notificação como lida
- Notificação gerada automaticamente por eventos críticos (nova OS, retorno)

### Differentiators (v2)
- Push notifications (PWA ou app mobile)
- Notificações por e-mail configuráveis
- Configuração de preferências de notificação por usuário

---

## Categoria: Busca Global

### Table Stakes (v1 obrigatório)
- Buscar por nome de cliente, ID de OS, nome de técnico
- Resultados agrupados por tipo (OS, Técnicos)
- Retorno rápido (full-text search Supabase com `ilike` ou `pg_trgm`)

### Differentiators (v2)
- Busca por conteúdo da descrição
- Filtros avançados combinados
- Histórico de buscas recentes

---

## Categoria: Autenticação & Acesso

### Table Stakes (v1 obrigatório)
- Login com email/senha (Admin)
- Sessão persistente entre refreshes
- Logout seguro
- Rotas protegidas — redirect para login se não autenticado
- Roles: Admin (acesso total) vs Técnico (acesso restrito às próprias OS)

### Differentiators (v2)
- Magic link login
- 2FA
- Convite de novos usuários por e-mail
- Log de acessos/sessões

---

## Categoria: Real-Time

### Deve ser real-time (v1)
- Status de técnicos em campo
- Feed de atividades
- Contagem de notificações não lidas
- Status de OS recentes no dashboard

### Pode ser polling (v1 aceitável)
- Métricas do dashboard (atualizar a cada 30s é suficiente)
- Lista completa de OS (usuário pode fazer refresh manual)

---

*Pesquisa realizada: 2026-04-25*
