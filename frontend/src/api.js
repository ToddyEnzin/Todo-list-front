// Camada de acesso ao backend (Fastify + MySQL).
// Rotas: GET /api/tasks?search=  |  POST /api/tasks  |  PATCH /api/tasks/:id  |  DELETE /api/tasks/:id
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '');
const TASKS_URL = `${BASE_URL}/api/tasks`;

async function request(url, options = {}) {
  // Só envia Content-Type quando há corpo: o Fastify devolve erro em um DELETE
  // com "application/json" e corpo vazio.
  const headers = options.body ? { 'Content-Type': 'application/json' } : {};

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Não foi possível conectar ao servidor. O backend está rodando na porta 3333?');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.message || '';
    } catch {
      /* resposta sem corpo JSON */
    }
    if (response.status >= 500) {
      throw new Error(
        `Erro no servidor (${response.status})${detail ? `: ${detail}` : ''}. ` +
          'Verifique se o MySQL está ligado e se o schema.sql e o backend/.env estão corretos.'
      );
    }
    throw new Error(detail || `Falha na requisição (${response.status}).`);
  }

  return response.status === 204 ? null : response.json();
}

export function fetchTasks(search = '', signal) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`${TASKS_URL}${query}`, { signal });
}

export function createTask({ title, dueDate }) {
  return request(TASKS_URL, {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });
}

export function updateTask(id, changes) {
  return request(`${TASKS_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export function deleteTask(id) {
  return request(`${TASKS_URL}/${id}`, { method: 'DELETE' });
}
