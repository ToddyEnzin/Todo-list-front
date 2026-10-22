# TODOLIST

Gerenciador de tarefas com backend **Fastify + MySQL** e frontend **React + Vite**.

## Como rodar

### 1. Banco de dados
Execute `backend/schema.sql` no MySQL (cria o banco `todolist` e a tabela `tasks`).

### 2. Backend (porta 3333)
```bash
cd backend
npm install
npm run dev
```
Ajuste usuário/senha do MySQL em `backend/.env` se necessário.

### 3. Frontend (porta 5173)
```bash
cd frontend
npm install
npm run dev
```
Abra http://localhost:5173

> Se o backend estiver em outro endereço, copie `frontend/.env.example` para `frontend/.env` e altere `VITE_API_URL`.

## Funcionalidades do frontend

- Lista de tarefas com contadores de **Total** e **Concluídas**
- Criar tarefa em modal (“Criar Tarefa”) com data limite opcional
- Editar tarefa em modal (“Editar Tarefa”) pelo botão de lápis
- Excluir tarefa
- Marcar/desmarcar como concluída (checkbox com gradiente)
- Busca em tempo real com **debounce** de 350 ms
- Ordenação: data limite mais próxima primeiro; sem data vão para o fim
- Tarefa pendente com data vencida: título vermelho + selo **“Em atraso”**
- Botões de editar/excluir aparecem ao passar o mouse
- Estado vazio: “Você não tem tarefas pendentes.”
- Botão flutuante “+” no canto inferior direito
- Filtros Todas / Pendentes / Concluídas, botão “Limpar concluídas”
- Tema escuro e claro (botão de sol/lua), layout inspirado no mockup em azul e vermelho

## Estrutura do frontend

```
frontend/src
├── api.js               # chamadas HTTP ao backend
├── App.jsx              # estado, busca, contadores, lista
├── components/          # TaskItem, TaskModal, Icons
├── hooks/               # useDebounce, useTheme
├── utils/date.js        # atraso, formatação e ordenação
└── styles.css
```
