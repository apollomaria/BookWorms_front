import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';

export function CriarRegistroPage() {
  const { clubs, currentUser, readingLogs, readingLogsError, createReadingLog } = useApp();

  const [bookTitle, setBookTitle] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [readDate, setReadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timerMinutes, setTimerMinutes] = useState('0');
  const [selectedClub, setSelectedClub] = useState('bw/NormalPeople');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cronômetro interativo em tempo real
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => {
          const next = prev + 1;
          const mins = Math.floor(next / 60);
          setTimerMinutes(String(mins));
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!bookTitle.trim() || !pagesRead) {
      setError('Por favor informe o livro lido e a quantidade de páginas.');
      return;
    }

    // Pré-condição do RF 010: usuário autenticado.
    if (!currentUser?.id) {
      setError('Faça login para registrar sua leitura.');
      return;
    }

    try {
      setLoading(true);
      // O registro só aparece na tela depois que o backend o gravou no PostgreSQL
      // (a lista abaixo é recarregada do banco). Vínculo com clube: pendente (UC003/UC024).
      const res = await createReadingLog({
        userId: currentUser.id,
        bookTitle: bookTitle.trim(),
        pagesRead,
        readDate,
        timerMinutes
      });

      if (!res.success) {
        setError(res.message || 'Erro ao salvar o registro de leitura.');
        return;
      }

      setMessage(`Registro de "${res.readingLog.bookTitle}" salvo com sucesso!`);
      setBookTitle('');
      setPagesRead('');
      setSecondsElapsed(0);
      setIsTimerRunning(false);
      setTimerMinutes('0');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar showSearch={true} />

      <div className="layout">
        <SidebarLeft />

        <main className="feed feed--center">
          <div className="form-card">
            <h2 className="form-title">Criação de Registro</h2>

            {message && (
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
                {message}
              </div>
            )}

            {(error || readingLogsError) && (
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
                {error || readingLogsError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-field form-field--center">
                <label className="form-label">Livro lido</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: O Hobbit, Memórias Póstumas..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Páginas lidas</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    placeholder="Ex: 25"
                    value={pagesRead}
                    onChange={(e) => setPagesRead(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Data Lida</label>
                  <input
                    type="date"
                    className="form-input"
                    value={readDate}
                    onChange={(e) => setReadDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Cronômetro interativo */}
              <div className="form-field form-field--center">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Vincular Cronômetro</label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--pink-2)', fontWeight: 700 }}>
                    ⏱️ {formatTimer(secondsElapsed)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Minutos lidos"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(prev => !prev)}
                    className="btn-login"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.85rem',
                      background: isTimerRunning ? 'rgba(230, 72, 62, 0.3)' : 'rgba(52, 195, 123, 0.3)'
                    }}
                  >
                    {isTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsTimerRunning(false); setSecondsElapsed(0); setTimerMinutes('0'); }}
                    className="btn-login"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    title="Zerar cronômetro"
                  >
                    🔄
                  </button>
                </div>
              </div>

              <div className="form-field form-field--center">
                <label className="form-label">Selecionar Clube(s)</label>
                <select
                  className="form-input"
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {clubs.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Leitura Individual">Leitura Individual (Sem clube)</option>
                </select>
              </div>

              <hr className="form-divider" />

              <button
                type="submit"
                className="btn-criar-clube"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Registrar'}
              </button>
            </form>

            {/* Histórico recente de leituras */}
            {readingLogs.length > 0 && (
              <div style={{ marginTop: '30px', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 12px', color: 'var(--pink-2)', fontFamily: 'Baloo 2' }}>
                  Histórico de Registros
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {readingLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--divider)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem'
                      }}
                    >
                      <div>
                        <strong>{log.bookTitle}</strong> — {log.pagesRead} págs{log.club ? ` (${log.club})` : ''}
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {log.timerMinutes > 0 ? `⏱️ ${log.timerMinutes} min • ` : ''}{log.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default CriarRegistroPage;
