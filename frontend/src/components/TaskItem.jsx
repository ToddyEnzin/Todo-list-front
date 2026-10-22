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
        aria-label={completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as done`}
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
          aria-label={`Edit "${task.title}"`}
          title="Edit"
          onClick={() => onEdit(task)}
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          className="icon-btn danger"
          aria-label={`Delete "${task.title}"`}
          title="Delete"
          onClick={() => onDelete(task)}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
