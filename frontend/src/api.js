// Camada de acesso ao backend (Fastify + MySQL).
// Rotas: GET /api/tasks?search=  |  POST /api/tasks  |  PATCH /api/tasks/:id  |  DELETE /api/tasks/:id
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '');
const TASKS_URL = `${BASE_URL}/api/tasks`;

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Could not reach the server. Is the backend running on port 3333?');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(message);
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
