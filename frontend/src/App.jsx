import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from './api.js';
import useDebounce from './hooks/useDebounce.js';
import { sortTasks } from './utils/date.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';
import { PlusIcon, SearchIcon } from './components/Icons.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { task: null | Task }

  // Busca em tempo real: só consulta a API depois que a digitação pausa.
  const debouncedSearch = useDebounce(search.trim(), 350);
  const abortRef = useRef(null);

  const load = useCallback(async (term) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await api.fetchTasks(term, controller.signal);
      setTasks(data.tasks ?? []);
      setTotals({ total: data.total ?? 0, completed: data.completed ?? 0 });
      setError('');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(debouncedSearch);
  }, [debouncedSearch, load]);

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);

  async function handleToggle(task) {
    const next = !task.completed;
    // Atualização otimista: a tela responde na hora e a API confirma em seguida.
    setTasks((list) => list.map((t) => (t.id === task.id ? { ...t, completed: next ? 1 : 0 } : t)));
    setTotals((t) => ({ ...t, completed: t.completed + (next ? 1 : -1) }));
    try {
      await api.updateTask(task.id, { completed: next });
    } catch (err) {
      setError(err.message);
      load(debouncedSearch);
    }
  }

  async function handleDelete(task) {
    try {
      await api.deleteTask(task.id);
      await load(debouncedSearch);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(values) {
    if (modal.task) {
      await api.updateTask(modal.task.id, values);
    } else {
      await api.createTask(values);
    }
    setModal(null);
    await load(debouncedSearch);
  }

  const closeModal = useCallback(() => setModal(null), []);
  const isSearching = debouncedSearch.length > 0;

  return (
    <div className="app">
      <header className="top">
        <h1>Minhas Tarefas</h1>
        <dl className="counters">
          <div>
            <dt>Total</dt>
            <dd data-testid="total">{totals.total}</dd>
          </div>
          <div>
            <dt>Concluídas</dt>
            <dd data-testid="completed">{totals.completed}</dd>
          </div>
        </dl>
      </header>

      <div className="search">
        <SearchIcon />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tarefas"
          aria-label="Buscar tarefas"
        />
      </div>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => load(debouncedSearch)}>
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <p className="status">Carregando tarefas…</p>
      ) : sorted.length === 0 ? (
        !error && (
          <div className="empty">
            <div className="empty-art" aria-hidden="true" />
            <p>{isSearching ? `Nenhuma tarefa encontrada para “${debouncedSearch}”.` : 'Você não tem tarefas pendentes.'}</p>
          </div>
        )
      ) : (
        <ul className="list">
          {sorted.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={(t) => setModal({ task: t })}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <button type="button" className="fab" aria-label="Criar tarefa" onClick={() => setModal({ task: null })}>
        <PlusIcon width={26} height={26} />
      </button>

      {modal && <TaskModal task={modal.task} onClose={closeModal} onSubmit={handleSave} />}
    </div>
  );
}
