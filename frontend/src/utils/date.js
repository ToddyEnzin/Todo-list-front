// O backend devolve due_date como 'YYYY-MM-DD' (dateStrings: true).
// Trabalhamos com strings para evitar o deslocamento de fuso horário do objeto Date.

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Garante 'YYYY-MM-DD' mesmo que a API devolva '2026-09-20T00:00:00.000Z'.
export function normalizeDate(value) {
  return value ? String(value).slice(0, 10) : null;
}

export function isOverdue(task) {
  const due = normalizeDate(task.due_date);
  return Boolean(due) && !task.completed && due < todayISO();
}

export function formatDate(value) {
  const iso = normalizeDate(value);
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Data mais próxima primeiro; sem data vai para o fim; empate: mais recente primeiro.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const da = normalizeDate(a.due_date);
    const db = normalizeDate(b.due_date);
    if (da && db && da !== db) return da < db ? -1 : 1;
    if (da && !db) return -1;
    if (!da && db) return 1;
    return b.id - a.id;
  });
}
