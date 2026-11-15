import React, { useState } from 'react';
import { readingLogService } from '../services/api';

export function CreateReadingLogModal({ isOpen, onClose, currentUserId, onLogCreated }) {
  const [bookTitle, setBookTitle] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [readDate, setReadDate] = useState(new Date().toISOString().split('T')[0]);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setLoading(true);
      const timerDurationSeconds = Number(timerMinutes) * 60;
      const res = await readingLogService.createLog(
        currentUserId,
        bookTitle,
        pagesRead,
        totalPages,
        readDate,
        timerDurationSeconds,
        notes
      );

      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao registrar leitura.');
        return;
      }

      onLogCreated(res.readingLog);
      onClose();
    } catch (err) {
      setErrorMessage('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="form-card" style={{ maxWidth: '480px', width: '90%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', background: 'transparent',
            border: 'none', color: '#f4f2ea', fontSize: '1.2rem', cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 className="form-title">Registro de Leitura</h2>

        {errorMessage && (
          <div style={{
            background: 'rgba(230, 72, 62, 0.2)', border: '1px solid #e6483e',
            color: '#f4f2ea', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field form-field--center">
            <label className="form-label">Título do Livro</label>
            <input
              type="text"
              className="form-input"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Ex: Memórias Póstumas de Brás Cubas"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Páginas Lidas</label>
              <input
                type="number"
                className="form-input"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Total de Páginas</label>
              <input
                type="number"
                className="form-input"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Data da Leitura</label>
              <input
                type="date"
                className="form-input"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tempo Lido (Minutos)</label>
              <input
                type="number"
                className="form-input"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Anotações / Reflexões</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que achou deste trecho?"
            />
          </div>

          <hr className="form-divider" />

          <button type="submit" className="btn-criar-clube" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}
