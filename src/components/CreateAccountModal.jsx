import React, { useState } from 'react';
import { authService } from '../services/api';

export function CreateAccountModal({ isOpen, onClose, onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum < 13 || ageNum > 150) {
      setErrorMessage('A idade deve estar entre 13 e 150 anos para criar uma conta.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Os campos Senha e Confirmar Senha devem ser idênticos.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('A senha deve possuir no mínimo 8 caracteres.');
      return;
    }

    // Calcula data de nascimento correspondente para a entidade de domínio
    const birthDateObj = new Date();
    birthDateObj.setFullYear(birthDateObj.getFullYear() - ageNum);
    const birthDateStr = birthDateObj.toISOString().split('T')[0];

    try {
      setLoading(true);
      const res = await authService.register({ username, email, password, confirmPassword, birthDate: birthDateStr });
      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao realizar o cadastro.');
        return;
      }
      onRegisterSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMessage('Erro de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="form-card" style={{ maxWidth: '440px', width: '90%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', background: 'transparent',
            border: 'none', color: '#f4f2ea', fontSize: '1.2rem', cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 className="form-title">Criação de Conta</h2>

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
            <label className="form-label">Nome de Usuário</label>
            <input
              type="text"
              className="form-input"
              placeholder="Seu apelido no BookWorms"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="leitor@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo de Idade */}
          <div className="form-field form-field--center">
            <label className="form-label">Idade</label>
            <input
              type="number"
              min="13"
              max="150"
              className="form-input"
              placeholder="Sua idade"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Senha (mínimo 8 caracteres)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Confirmar Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="Repita a mesma senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <hr className="form-divider" />

          <button type="submit" className="btn-criar-clube" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountModal;
