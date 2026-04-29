# CONVENTIONS.md — OS Manager

## 1. Arquitetura de API (Next.js App Router)

A camada de API é construída utilizando o Next.js App Router (`src/app/api/...`).
Todas as rotas devem seguir os princípios RESTful e estar localizadas sob o path `/api/v1/`.

### 1.1. Handlers
Cada rota deve exportar funções assíncronas nomeadas de acordo com o método HTTP:
```typescript
export async function GET(request: Request) { ... }
export async function POST(request: Request) { ... }
export async function PUT(request: Request) { ... }
export async function DELETE(request: Request) { ... }
```

### 1.2. Respostas Padronizadas
Todas as respostas devem utilizar `NextResponse.json`:
- **Sucesso (200/201):** Retornar o payload de dados. `NextResponse.json({ data: ... })` (ou o objeto diretamente se for simples, como `{ user: data.user }`).
- **Erro:** Sempre retornar um objeto contendo a propriedade `error`.
  ```typescript
  return NextResponse.json({ error: 'Mensagem de erro' }, { status: 400 });
  ```

## 2. Validação de Dados

Utilizamos a biblioteca **Zod** para validar dados de entrada.
- Todo `POST` ou `PUT` deve possuir um schema associado para validar o `request.json()`.
- O parsing deve ser feito usando `schema.parse(body)`.

### 2.1. Tratamento de Erros Zod
Capture `z.ZodError` no bloco `catch` e retorne status `422 Unprocessable Entity`:
```typescript
catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.issues[0].message },
      { status: 422 }
    )
  }
  // ... tratamento de erro genérico (500)
}
```

## 3. Autenticação e Supabase

- A integração com Supabase usa `@supabase/ssr` exclusivamente no server-side.
- **Client Side / Server Actions / Route Handlers:** Use o helper `createClient()` de `src/lib/supabase/server.ts`.
- **Validação de Sessão:** Toda a proteção de rotas deve ser assegurada em `src/middleware.ts` com o guard de sessão. A autorização granular deve ser imposta pelo Row Level Security (RLS) no Supabase.

Exemplo de chamada segura em um route handler:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('minha_tabela').select('*')
  // RLS vai garantir automaticamente que o usuário só veja seus próprios dados
}
```

## 4. Tratamento de Exceções

Todo route handler deve estar envolto em um bloco `try...catch`.
Qualquer exceção não prevista deve logar no console e retornar um `500 Internal Server Error` mascarando os detalhes internos:

```typescript
console.error('Nome do Erro:', error)
return NextResponse.json(
  { error: 'Erro interno do servidor' },
  { status: 500 }
)
```
