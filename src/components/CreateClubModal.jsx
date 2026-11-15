import React, { useState } from 'react';
import { clubService } from '../services/api';

export function CreateClubModal({ isOpen, onClose, currentUserId, onClubCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setLoading(true);
      const res = await clubService.createClub(currentUserId, name, description, isPublic);
      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao criar o clube.');
        return;
      }
      onClubCreated(res.club);
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
      <div className="form-card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', background: 'transparent',
            border: 'none', color: '#f4f2ea', fontSize: '1.2rem', cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 className="form-title">Criação de Clube</h2>

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
            <label className="form-label">Nome do Clube</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Leitores de Sci-Fi"
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Descrição do Clube</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Regras, tópicos e objetivos das leituras..."
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Visibilidade</label>
            <select
              className="form-input"
              value={isPublic ? 'true' : 'false'}
              onChange={(e) => setIsPublic(e.target.value === 'true')}
            >
              <option value="true">Público (Qualquer leitor pode entrar)</option>
              <option value="false">Privado (Apenas convidados)</option>
            </select>
          </div>

          <hr className="form-divider" />

          <button type="submit" className="btn-criar-clube" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Criando Clube...' : 'Criar Clube'}
          </button>
        </form>
      </div>
    </div>
  );
}
