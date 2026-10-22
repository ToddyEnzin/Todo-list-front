import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { brToISO, formatDate, maskBR } from '../utils/date.js';

// Serve para criar (task = null) e editar (task = objeto).
export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(formatDate(task?.due_date));
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
      setError('Dê um nome para a tarefa.');
      titleRef.current?.focus();
      return;
    }
    const isoDate = dueDate ? brToISO(dueDate) : null;
    if (dueDate && !isoDate) {
      setError('Data inválida. Use o formato dd/mm/aaaa.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), dueDate: isoDate });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onSubmit={handleSubmit} noValidate>
        <div className="modal-head">
          <h2 id="modal-title">{isEdit ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </button>
        </div>

        <label className="field">
          <span>Nome da tarefa</span>
          <input
            ref={titleRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="O que você precisa fazer?"
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
          />
        </label>

        <label className="field">
          <span>
            Data limite <em>opcional</em>
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder="dd/mm/aaaa"
            value={dueDate}
            onChange={(e) => {
              setDueDate(maskBR(e.target.value));
              if (error) setError('');
            }}
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-foot">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
}
