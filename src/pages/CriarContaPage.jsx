import React, { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { useApp } from '../context/AppContext';
import { authService } from '../services/api';

export function CriarContaPage() {
  const { navigate, loginUser } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !email.trim() || !birthDate || !password || !confirmPassword) {
      setError('Por favor preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Os campos Senha e Confirmar Senha devem ser idênticos.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve possuir no mínimo 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      // O backend valida tudo (RN-002 faixa etária, nome único, etc.) e grava no
      // PostgreSQL. Se ele recusar ou estiver fora do ar, mostramos o motivo: não
      // existe mais "conta local" de contingência.
      const res = await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        birthDate,
      });
      if (res.success && res.user) {
        setSuccess('Conta criada com sucesso! Redirecionando...');
        loginUser(res.user); // passo 5 do UC001: já entra logado
        setTimeout(() => {
          navigate('index');
        }, 1200);
      } else {
        setError(res.message || 'Não foi possível criar a conta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar showSearch={true} />

      <div className="layout">
        {/* SIDEBAR ESQUERDA (vazia antes do login, mantendo proporção de grid) */}
        <aside className="sidebar sidebar--left" />

        {/* FEED CENTRAL: FORMULÁRIO DE CRIAÇÃO DE CONTA */}
        <main className="feed feed--center">
          <div className="form-card">
            <h2 className="form-title">Criação de Conta</h2>

            {error && (
              <div style={{
                background: 'rgba(230, 72, 62, 0.15)',
                border: '1px solid var(--red)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '18px',
                color: 'var(--text)',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: 'rgba(52, 195, 123, 0.18)',
                border: '1px solid var(--green)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '18px',
                color: 'var(--text)',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-field form-field--center">
                <label className="form-label">Nome de Usuário</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Seu nome ou apelido"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
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

              {/* Campo de Data de Nascimento (RN-002 é validada pelo backend) */}
              <div className="form-field form-field--center">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-input"
                  value={birthDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field form-field--center">
                <label className="form-label">Senha</label>
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

              <button
                type="submit"
                className="btn-criar-clube"
                disabled={loading}
              >
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </button>
            </form>
          </div>
        </main>

        {/* SIDEBAR DIREITA (vazia antes do login) */}
        <aside className="sidebar sidebar--right" />
      </div>
    </>
  );
}

export default CriarContaPage;
