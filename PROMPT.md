# Prompt usado para gerar o frontend

**Contexto enviado à IA:** código do backend (`routes/tasks.js`, `schema.sql`, `rotas.http`) e a imagem de referência do layout.

> Crie o frontend do sistema TODOLIST usando **React + Vite** (JavaScript, sem TypeScript).
>
> **Backend (já pronto, Fastify + MySQL, `http://localhost:3333`):**
> - `GET /api/tasks?search=` → `{ tasks: [{ id, title, completed, due_date, created_at }], total, completed }`
> - `POST /api/tasks` `{ title, dueDate? }` → 201 com a tarefa
> - `PATCH /api/tasks/:id` `{ completed?, title?, dueDate? }` (`dueDate: null` remove a data)
> - `DELETE /api/tasks/:id` → 204
> - `due_date` chega como string `YYYY-MM-DD`; erros vêm como `{ message }`.
>
> **Layout:** siga a imagem anexada (cores, espaçamento, cards, tipografia).
>
> **Funcionalidades obrigatórias:**
> 1. Lista com contadores de total e concluídas (usar `total` e `completed` da API).
> 2. Modal "Create Task" com título e data limite opcional.
> 3. Modal "Edit Task" aberto pelo botão de lápis de cada item, já preenchido.
> 4. Excluir tarefa.
> 5. Checkbox com gradiente para concluir/desconcluir.
> 6. Busca em tempo real com debounce (350 ms), enviando `?search=` à API.
> 7. Ordenar pela data limite mais próxima primeiro; sem data por último.
> 8. Se `due_date` < hoje e a tarefa está pendente: título vermelho e selo "Em atraso".
> 9. Botões de editar/excluir só aparecem no hover do item.
> 10. Estado vazio com o texto exato "You have no pending tasks.".
> 11. Botão flutuante "+" no canto inferior direito que abre o modal de criação.
>
> **Requisitos técnicos:** componentes separados (`TaskItem`, `TaskModal`), hook `useDebounce`, camada `api.js` com `fetch`, URL da API configurável por `VITE_API_URL`, tratamento de erro quando o backend estiver offline, comparar datas como string (evitar bug de fuso horário), responsivo e acessível (foco visível, `aria-label` nos botões, Esc fecha o modal).
> Entregue todos os arquivos completos e as instruções para rodar.
