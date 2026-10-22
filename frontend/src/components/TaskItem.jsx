import { CalendarIcon, CheckIcon, PencilIcon, TrashIcon } from './Icons.jsx';
import { formatDate, isOverdue } from '../utils/date.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const completed = Boolean(task.completed);

  return (
    <li className={`task ${completed ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={completed ? `Marcar "${task.title}" como pendente` : `Marcar "${task.title}" como concluída`}
        className="check"
        onClick={() => onToggle(task)}
      >
        <CheckIcon />
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        {(task.due_date || overdue) && (
          <span className="task-meta">
            {task.due_date && (
              <span className="due">
                <CalendarIcon />
                {formatDate(task.due_date)}
              </span>
            )}
            {overdue && <span className="badge-overdue">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Editar "${task.title}"`}
          title="Editar"
          onClick={() => onEdit(task)}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          className="icon-btn danger"
          aria-label={`Excluir "${task.title}"`}
          title="Excluir"
          onClick={() => onDelete(task)}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
