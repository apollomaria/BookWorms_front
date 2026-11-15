import React, { useState, useEffect, useCallback } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';

const GENRES = ['all', 'Romance', 'Fantasia', 'Literatura Brasileira', 'Distopia', 'Ficção Científica'];
const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'LIDO', label: 'Já Li' },
  { key: 'QUERO_LER', label: 'Quero Ler' },
  { key: 'LENDO', label: 'Lendo' },
  { key: 'FAVORITO', label: '❤️ Favoritos' },
];

function StarRating({ value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            fontSize: readOnly ? '0.85rem' : '1.1rem',
            color: star <= (hover || value) ? '#f5c518' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.15s ease',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ExpBadge({ exp }) {
  return (
    <span style={{
      background: 'linear-gradient(135deg, #34c37b, #2aa86a)',
      color: '#fff',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '0.72rem',
      fontWeight: 700,
      fontFamily: 'Baloo 2',
    }}>
      +{exp} EXP
    </span>
  );
}

function BookCard({ book, shelfItem, onShelfAction, onRate, currentUser }) {
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(shelfItem?.rating || 0);
  const [reviewText, setReviewText] = useState(shelfItem?.review || '');
  const [expFeedback, setExpFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const avgRating = book.averageRating ? Number(book.averageRating).toFixed(1) : '—';
  const ratingsCount = book.ratingsCount || 0;

  const handleShelfAction = async (status, isFavorite) => {
    if (!currentUser) return;
    setLoading(true);
    const res = await onShelfAction(currentUser.id, book.id, status, isFavorite);
    if (res?.success && status === 'LIDO') {
      const exp = res.data?.expBonus || 50;
      setExpFeedback(exp);
      setTimeout(() => setExpFeedback(null), 3000);
    }
    setLoading(false);
  };

  const handleRate = async () => {
    if (!currentUser || !ratingValue) return;
    setLoading(true);
    await onRate(currentUser.id, book.id, ratingValue, reviewText);
    setShowRateModal(false);
    setLoading(false);
  };

  const isFav = shelfItem?.isFavorite;
  const currentStatus = shelfItem?.status;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--divider)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* EXP Feedback badge */}
      {expFeedback && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          animation: 'riseIn 0.4s ease',
        }}>
          <ExpBadge exp={expFeedback} />
        </div>
      )}

      {/* Capa */}
      <div style={{ position: 'relative', paddingTop: '140%', background: '#0f2a1a', overflow: 'hidden' }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover'
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '2.5rem', opacity: 0.4
          }}>📚</div>
        )}

        {/* Status badge */}
        {currentStatus && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: currentStatus === 'LIDO' ? 'var(--green)' :
                        currentStatus === 'LENDO' ? 'var(--pink)' : '#6b7bff',
            color: '#fff', fontSize: '0.65rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '999px', fontFamily: 'Baloo 2',
          }}>
            {currentStatus === 'LIDO' ? '✓ Lido' :
             currentStatus === 'LENDO' ? '▶ Lendo' : '📖 Quero Ler'}
          </div>
        )}

        {/* Favorito */}
        <button
          onClick={() => handleShelfAction(currentStatus || 'QUERO_LER', !isFav)}
          title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: isFav ? 'rgba(238,79,158,0.9)' : 'rgba(0,0,0,0.5)',
            border: 'none', borderRadius: '50%',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease',
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>
          {book.title}
        </div>
        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>{book.author}</div>

        {book.genre && (
          <span style={{
            display: 'inline-block', fontSize: '0.68rem', color: 'var(--pink-2)',
            background: 'rgba(238,79,158,0.12)', padding: '2px 6px', borderRadius: '999px',
            width: 'fit-content',
          }}>{book.genre}</span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <StarRating value={Math.round(book.averageRating || 0)} readOnly />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {avgRating} ({ratingsCount})
          </span>
        </div>

        {/* Ações da estante */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleShelfAction('LIDO', isFav)}
            disabled={loading || !currentUser}
            style={{
              flex: 1, fontSize: '0.7rem', padding: '5px 4px',
              background: currentStatus === 'LIDO' ? 'var(--green)' : 'rgba(52,195,123,0.15)',
              color: currentStatus === 'LIDO' ? '#fff' : 'var(--green)',
              border: '1px solid var(--green)', borderRadius: '8px',
              cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            ✓ Já Li
          </button>
          <button
            onClick={() => handleShelfAction('LENDO', isFav)}
            disabled={loading || !currentUser}
            style={{
              flex: 1, fontSize: '0.7rem', padding: '5px 4px',
              background: currentStatus === 'LENDO' ? 'var(--pink)' : 'rgba(238,79,158,0.12)',
              color: currentStatus === 'LENDO' ? '#fff' : 'var(--pink-2)',
              border: '1px solid var(--pink)', borderRadius: '8px',
              cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            ▶ Lendo
          </button>
          <button
            onClick={() => handleShelfAction('QUERO_LER', isFav)}
            disabled={loading || !currentUser}
            style={{
              flex: 1, fontSize: '0.7rem', padding: '5px 4px',
              background: currentStatus === 'QUERO_LER' ? '#6b7bff' : 'rgba(107,123,255,0.12)',
              color: currentStatus === 'QUERO_LER' ? '#fff' : '#a0aaff',
              border: '1px solid #6b7bff', borderRadius: '8px',
              cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s',
            }}
          >
            📖 Quero
          </button>
        </div>

        <button
          onClick={() => setShowRateModal(true)}
          disabled={!currentUser}
          style={{
            width: '100%', marginTop: '4px', fontSize: '0.72rem', padding: '5px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--divider)',
            color: 'var(--text-muted)', borderRadius: '8px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          ⭐ Avaliar
        </button>
      </div>

      {/* Modal de Avaliação */}
      {showRateModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowRateModal(false); }}
        >
          <div style={{
            background: '#0f331f', borderRadius: '18px', padding: '28px',
            width: '100%', maxWidth: '380px', border: '1px solid var(--divider)',
          }}>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'Baloo 2', color: 'var(--pink-2)' }}>
              Avaliar Livro
            </h3>
            <p style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {book.title}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Sua nota
              </label>
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Escreva uma resenha (opcional)..."
              rows={3}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid var(--divider)', borderRadius: '10px',
                color: 'var(--text)', padding: '10px', resize: 'vertical',
                fontFamily: 'Nunito Sans', fontSize: '0.85rem', marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRate}
                disabled={!ratingValue || loading}
                className="btn-criar-clube"
                style={{ flex: 1 }}
              >
                Salvar
              </button>
              <button
                onClick={() => setShowRateModal(false)}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--divider)',
                  color: 'var(--text)', borderRadius: '999px', padding: '10px',
                  cursor: 'pointer', fontFamily: 'Baloo 2', fontWeight: 700,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LivrosPage({ shelfOnly = false }) {
  const { currentUser, books, userShelf, booksLoading, syncBooks, syncUserShelf, updateBookShelf, rateBook } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [activeTab, setActiveTab] = useState(shelfOnly ? 'LIDO' : 'all');

  useEffect(() => {
    syncBooks({ query: searchQuery, genre: selectedGenre, minRating: minRating || undefined });
  }, [searchQuery, selectedGenre, minRating]);

  useEffect(() => {
    if (currentUser?.id) syncUserShelf(currentUser.id);
  }, [currentUser]);

  const shelfMap = {};
  userShelf.forEach(item => { shelfMap[item.bookId] = item; });

  const filteredBooks = books.filter(book => {
    if (activeTab === 'FAVORITO') return shelfMap[book.id]?.isFavorite;
    if (activeTab !== 'all') return shelfMap[book.id]?.status === activeTab;
    return true;
  });

  return (
    <>
      <Topbar showSearch={false} />
      <div className="layout">
        <SidebarLeft />

        <main className="feed">
          <div style={{ padding: '0 0 32px' }}>
            <h2 style={{ fontFamily: 'Baloo 2', fontSize: '1.5rem', margin: '0 0 20px', color: 'var(--pink-2)' }}>
              {shelfOnly ? '📚 Minha Estante' : '📖 Livros'}
            </h2>

            {/* Barra de Busca */}
            {!shelfOnly && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Buscar por título, autor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: '200px' }}
                />

                <select
                  value={selectedGenre}
                  onChange={e => setSelectedGenre(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid var(--divider)',
                    color: 'var(--text)', borderRadius: '10px', padding: '8px 12px',
                    fontFamily: 'Nunito Sans', cursor: 'pointer',
                  }}
                >
                  {GENRES.map(g => (
                    <option key={g} value={g} style={{ background: '#0c2b1a' }}>
                      {g === 'all' ? 'Todos os gêneros' : g}
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    Nota mín:
                  </span>
                  <StarRating value={minRating} onChange={setMinRating} />
                  {minRating > 0 && (
                    <button
                      onClick={() => setMinRating(0)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >×</button>
                  )}
                </div>
              </div>
            )}

            {/* Abas */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '6px 14px', borderRadius: '999px', border: 'none',
                    cursor: 'pointer', fontFamily: 'Baloo 2', fontWeight: 700, fontSize: '0.8rem',
                    background: activeTab === tab.key
                      ? 'linear-gradient(135deg, var(--pink-2), var(--pink))'
                      : 'rgba(255,255,255,0.08)',
                    color: activeTab === tab.key ? '#1a0d15' : 'var(--text)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid de Livros */}
            {booksLoading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                Carregando livros...
              </p>
            ) : filteredBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📚</div>
                <p>{activeTab !== 'all' ? 'Nenhum livro nesta categoria ainda.' : 'Nenhum livro encontrado.'}</p>
                {!currentUser && <p style={{ fontSize: '0.85rem' }}>Faça login para gerenciar sua estante.</p>}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
              }}>
                {filteredBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    shelfItem={shelfMap[book.id]}
                    onShelfAction={updateBookShelf}
                    onRate={rateBook}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default LivrosPage;
