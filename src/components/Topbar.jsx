import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Topbar({ showSearch = true }) {
  const {
    navigate,
    currentUser,
    logout,
    searchQuery,
    setSearchQuery,
    setIsCreatePostModalOpen,
    setIsLoginModalOpen
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('index');
  };

  const handleCreatePostClick = () => {
    setIsCreatePostModalOpen(true);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <a href="#/index" onClick={handleLogoClick} className="topbar-logo-link">
          <img src="/img/logo.jpeg" alt="Bookworms" className="logo-img" />
          <span className="logo">Bookworms</span>
        </a>
      </div>

      {showSearch && (
        <div className="topbar-search">
          <span className="avatar avatar--sm"></span>
          <input
            type="text"
            className="search-input"
            placeholder="Procurar no BookWorms"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="topbar-right" style={{ position: 'relative' }}>
        {currentUser ? (
          <>
            <button
              className="btn-criar-post"
              type="button"
              onClick={handleCreatePostClick}
            >
              Criar Post
            </button>
            <div style={{ position: 'relative' }}>
              <img
                src="/img/avatar.jpg"
                alt={`Perfil de ${currentUser.username || 'usuário'}`}
                className="avatar avatar--md profile-avatar-img"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                title={`Logado como @${currentUser.username || 'Leitor'}`}
              />
              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '50px',
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--divider)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  minWidth: '180px',
                  boxShadow: 'var(--shadow-card-hover)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pink-2)' }}>
                    @{currentUser.username || 'Leitor'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {currentUser.email || 'Conta BookWorms'}
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--divider)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setIsUserMenuOpen(false); navigate('criar-registro'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: 0
                    }}
                  >
                    📖 Meus Registros
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); logout(); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--red)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: 0
                    }}
                  >
                    🚪 Sair da Conta
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="btn-login"
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
            <button
              className="btn-criar-post"
              type="button"
              onClick={() => navigate('criar-conta')}
            >
              Fazer Conta
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
