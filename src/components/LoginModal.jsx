import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/api';

export function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser, navigate } = useApp();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrUsername.trim() || !password.trim()) {
      setError('Preencha todos os campos para entrar.');
      return;
    }

    try {
      setLoading(true);
      // Só entra quem o backend autenticar (RF 006). Credenciais inválidas, conta
      // desativada ou servidor fora do ar mostram a mensagem de erro, sem "login demo".
      const res = await authService.login(emailOrUsername.trim(), password);
      if (res.success && res.user) {
        loginUser(res.user);
        setPassword('');
        setEmailOrUsername('');
        setIsLoginModalOpen(false);
        navigate('index'); // passo 4 do UC001/RF 006: redireciona para a página principal
      } else {
        setError(res.message || 'Não foi possível entrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="form-card" style={{ maxWidth: '420px', width: '100%', position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.4rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <h2 className="form-title" style={{ marginTop: 0 }}>Entrar no Bookworms</h2>

        {error && (
          <div style={{
            background: 'rgba(230, 72, 62, 0.15)',
            border: '1px solid var(--red)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            color: 'var(--text)',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field form-field--center">
            <label className="form-label">Nome de Usuário ou E-mail</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: apollo_leitor"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <hr className="form-divider" />

          <button
            type="submit"
            className="btn-criar-clube"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Ainda não tem conta?{' '}
            <span
              onClick={() => { setIsLoginModalOpen(false); navigate('criar-conta'); }}
              style={{ color: 'var(--pink-2)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Crie uma agora mesmo!
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
