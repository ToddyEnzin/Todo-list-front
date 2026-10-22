import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { normalizeDate } from '../utils/date.js';

// Serve para criar (task = null) e editar (task = objeto).
export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(normalizeDate(task?.due_date) ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give your task a name.');
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onSubmit={handleSubmit} noValidate>
        <div className="modal-head">
          <h2 id="modal-title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <label className="field">
          <span>Task name</span>
          <input
            ref={titleRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="What needs to get done?"
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
          />
        </label>

        <label className="field">
          <span>
            Due date <em>optional</em>
          </span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-foot">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
}
