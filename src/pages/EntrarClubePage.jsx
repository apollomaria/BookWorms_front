import React, { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';

export function EntrarClubePage() {
  const { clubs, navigate, setSelectedForumFilter } = useApp();

  const [clubCode, setClubCode] = useState('');
  const [showPublicClubs, setShowPublicClubs] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [joinedClubs, setJoinedClubs] = useState({});

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!clubCode.trim()) {
      setFeedback('Digite um código de clube válido.');
      return;
    }
    const found = clubs.find(c => c.name.toLowerCase().includes(clubCode.toLowerCase()) || c.id === clubCode.trim());
    if (found) {
      setJoinedClubs(prev => ({ ...prev, [found.id]: true }));
      setFeedback(`Você entrou com sucesso no clube "${found.name}"!`);
      setTimeout(() => {
        setSelectedForumFilter(found.name);
        navigate('index');
      }, 1200);
    } else {
      setFeedback(`Clube com código "${clubCode}" encontrado! Convite aceito com sucesso.`);
    }
  };

  const handleJoinClub = (club) => {
    setJoinedClubs(prev => ({ ...prev, [club.id]: true }));
    setFeedback(`Parabéns! Você agora é membro do clube "${club.name}".`);
    setTimeout(() => {
      setSelectedForumFilter(club.name);
      navigate('index');
    }, 1200);
  };

  return (
    <>
      <Topbar showSearch={true} />

      <div className="layout">
        <SidebarLeft />

        <main className="feed feed--center">
          <div className="form-card entrar-card">
            <h2 className="form-title">Entrar em Clubes</h2>

            {feedback && (
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
                {feedback}
              </div>
            )}

            <form onSubmit={handleJoinByCode}>
              <div className="form-field form-field--center">
                <label className="form-label">Código de Clube</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: BW-7892 ou nome do clube"
                  value={clubCode}
                  onChange={(e) => setClubCode(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-criar-clube btn-entrar">
                Entrar
              </button>
            </form>

            <div className="or-divider">
              <span />
              <p>ou</p>
              <span />
            </div>

            <h3 className="form-subtitle">Lista de Clubes Públicos</h3>
            <button
              type="button"
              className="btn-criar-clube"
              onClick={() => setShowPublicClubs(prev => !prev)}
            >
              {showPublicClubs ? 'Ocultar' : 'Ver'}
            </button>

            {showPublicClubs && (
              <div style={{
                marginTop: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'left'
              }}>
                {clubs.map((club) => {
                  const isJoined = joinedClubs[club.id];

                  return (
                    <div
                      key={club.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--divider)',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={club.avatar || '/img/logo.jpeg'}
                          alt={club.name}
                          className="avatar avatar--md forum-avatar-img"
                        />
                        <div>
                          <h4 style={{ margin: 0, color: 'var(--pink-2)', fontFamily: 'Baloo 2', fontSize: '1.05rem' }}>
                            {club.name}
                          </h4>
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            👥 {club.memberCount || 1} membro(s) • {club.rankingType || 'Ranking Geral'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleJoinClub(club)}
                        className="btn-criar-clube"
                        style={{
                          padding: '8px 20px',
                          fontSize: '0.85rem',
                          background: isJoined ? 'rgba(52, 195, 123, 0.25)' : undefined,
                          color: isJoined ? 'var(--green)' : undefined,
                          border: isJoined ? '1px solid var(--green)' : undefined,
                          boxShadow: isJoined ? 'none' : undefined
                        }}
                      >
                        {isJoined ? '✓ Membro' : 'Participar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default EntrarClubePage;
