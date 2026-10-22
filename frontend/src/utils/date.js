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

// 'YYYY-MM-DD' -> 'dd/mm/aaaa'
export function formatDate(value) {
  const iso = normalizeDate(value);
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Máscara enquanto digita: '25122026' -> '25/12/2026'
export function maskBR(text) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// 'dd/mm/aaaa' -> 'YYYY-MM-DD' (ou null se a data não existir, ex.: 31/02/2026)
export function brToISO(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const valid =
    date.getFullYear() === Number(yyyy) && date.getMonth() === Number(mm) - 1 && date.getDate() === Number(dd);
  return valid ? `${yyyy}-${mm}-${dd}` : null;
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
