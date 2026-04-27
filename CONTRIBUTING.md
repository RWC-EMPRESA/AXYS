# Guia de Contribuição — AXYS

Bem-vindo ao time de desenvolvimento do OS Manager! Para mantermos a organização de uma empresa de alto nível, utilizamos o sistema **GSD (Get Shit Done)** integrado à IA.

## 🚀 Como começar sua tarefa

Sempre que você for iniciar uma fase ou tarefa do Roadmap, chame o Agente de IA no chat e diga:

> "GSD, sou o [Seu Nome] e vou iniciar a **Fase X - [Frontend ou Backend]**. Pode me ajudar com o planejamento e execução?"

O Agente lerá os documentos em `.planning/` e guiará você passo a passo, criando os arquivos e sugerindo o código.

## 🌿 Regras de Git (Branching)

1. **Nunca** faça commits direto na `main`.
2. Crie uma branch para sua tarefa:
   - Padrão: `feat/fase-X-descricao`
   - Exemplo: `git checkout -b feat/fase-1-login-ui`
3. Quando terminar, suba sua branch e abra um **Pull Request (PR)** para a `main`.

## 📂 Onde encontrar as orientações

- **ROADMAP.md**: O que estamos fazendo agora e o que vem depois.
- **REQUIREMENTS.md**: O que cada funcionalidade PRECISA ter para ser considerada pronta.
- **STATE.md**: O status atual de cada desenvolvedor.

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15+ (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **Banco/Auth:** Supabase
- **Validação:** Zod

Vamos manter o código limpo e os commits organizados! Qualquer dúvida, fale com o **Wellison** (Arquiteto/Lead).
