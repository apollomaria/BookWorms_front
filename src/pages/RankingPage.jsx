import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  { key: 'EXP',     label: '⚡ Por Experiência',    unit: 'EXP',      icon: '⚡' },
  { key: 'PAGINAS', label: '📄 Por Páginas Lidas',   unit: 'páginas',  icon: '📄' },
  { key: 'LIVROS',  label: '📚 Por Livros Concluídos', unit: 'livros', icon: '📚' },
];

const MEDAL_COLORS = {
  1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', text: '#7a5400', emoji: '🥇' },
  2: { bg: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', text: '#4a4a4a', emoji: '🥈' },
  3: { bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', text: '#5a2a00', emoji: '🥉' },
};

function getInitial(username) {
  return (username || '?')[0].toUpperCase();
}

function UserAvatar({ username, size = 40 }) {
  const colors = ['#ee4f9e', '#34c37b', '#6b7bff', '#f5a623', '#50e3c2'];
  const colorIndex = (username || '').charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: colors[colorIndex],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Baloo 2', fontWeight: 900,
      fontSize: size * 0.4, color: '#fff',
      flexShrink: 0,
    }}>
      {getInitial(username)}
    </div>
  );
}

function PodiumCard({ entry, rank }) {
  const medal = MEDAL_COLORS[rank];
  const catInfo = CATEGORIES.find(c => c.key === (entry.category || 'EXP')) || CATEGORIES[0];
  const heights = { 1: '120px', 2: '90px', 3: '70px' };
  const orders = { 1: 2, 2: 1, 3: 3 };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      order: orders[rank], flex: 1,
    }}>
      {/* Avatar + medalha */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <UserAvatar username={entry.username} size={rank === 1 ? 60 : 48} />
        <span style={{
          position: 'absolute', bottom: '-4px', right: '-4px',
          fontSize: rank === 1 ? '1.4rem' : '1.1rem',
        }}>{medal.emoji}</span>
      </div>

      <div style={{
        fontSize: rank === 1 ? '0.9rem' : '0.8rem',
        fontWeight: 700, color: 'var(--text)',
        marginBottom: '4px', textAlign: 'center',
        maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {entry.username}
      </div>

      {entry.isSupporter && (
        <span style={{
          fontSize: '0.65rem', background: 'rgba(238,79,158,0.2)',
          color: 'var(--pink-2)', padding: '1px 6px', borderRadius: '999px',
          marginBottom: '4px', fontWeight: 700,
        }}>⭐ Apoiador</span>
      )}

      <div style={{
        fontSize: '0.85rem', fontWeight: 900, color: 'var(--green)',
        marginBottom: '6px',
      }}>
        {(entry.value || 0).toLocaleString()} {catInfo.unit}
      </div>

      {/* Coluna do pódio */}
      <div style={{
        width: '100%', height: heights[rank],
        background: medal.bg,
        borderRadius: '10px 10px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontFamily: 'Baloo 2', fontWeight: 900, color: medal.text,
      }}>
        {rank}
      </div>
    </div>
  );
}

function RankingRow({ entry, rank }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 14px',
      background: rank % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
      borderRadius: '10px',
      transition: 'background 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = rank % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'}
    >
      <div style={{
        width: '32px', textAlign: 'center', fontWeight: 900,
        fontSize: '0.9rem',
        color: rank <= 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][rank - 1] : 'var(--text-muted)',
        flexShrink: 0,
      }}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
      </div>

      <UserAvatar username={entry.username} size={34} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: '0.88rem',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{entry.username}</span>
          {entry.isSupporter && (
            <span style={{
              fontSize: '0.6rem', background: 'rgba(238,79,158,0.2)',
              color: 'var(--pink-2)', padding: '1px 5px', borderRadius: '999px',
              fontWeight: 700, flexShrink: 0,
            }}>⭐</span>
          )}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Nível {entry.level || 1}
        </div>
      </div>

      <div style={{
        fontWeight: 900, fontSize: '0.9rem', color: 'var(--green)',
        textAlign: 'right', flexShrink: 0,
      }}>
        {(entry.value || 0).toLocaleString()}
      </div>
    </div>
  );
}

// Dados mockados para exibição quando backend offline
function getMockRanking(category) {
  const names = ['Leitora_Ana', 'BookNerd42', 'TolkienFan', 'Machado_Cia', 'OrwellRules',
                  'Sally_Reader', 'LivrosLife', 'PageTurner', 'ReadMore99', 'BiblioFan'];
  return names.map((username, i) => ({
    userId: `user-${i + 1}`,
    username,
    level: Math.max(1, 10 - i),
    isSupporter: i < 2,
    value: Math.round((10 - i) * (category === 'PAGINAS' ? 800 : category === 'LIVROS' ? 12 : 2500) * (1 + Math.random() * 0.2)),
    category,
  })).sort((a, b) => b.value - a.value);
}

export function RankingPage() {
  const { rankings, rankingLoading, syncRanking } = useApp();
  const [activeCategory, setActiveCategory] = useState('EXP');

  useEffect(() => {
    syncRanking(activeCategory);
  }, [activeCategory]);

  const catInfo = CATEGORIES.find(c => c.key === activeCategory) || CATEGORIES[0];

  // Usa dados reais ou mock se estiver vazio
  let rankingData = (rankings[activeCategory] || []).map((entry, i) => ({
    ...entry,
    value: entry[activeCategory === 'EXP' ? 'totalExp' : activeCategory === 'PAGINAS' ? 'totalPages' : 'totalBooks'] || entry.value || 0,
    category: activeCategory,
  }));

  if (rankingData.length === 0 && !rankingLoading) {
    rankingData = getMockRanking(activeCategory);
  }

  const top3 = rankingData.slice(0, 3);
  const rest = rankingData.slice(3, 100);

  return (
    <>
      <Topbar showSearch={false} />
      <div className="layout">
        <SidebarLeft />

        <main className="feed">
          <div style={{ paddingBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Baloo 2', fontSize: '1.5rem', margin: '0 0 8px', color: 'var(--pink-2)' }}>
              🏆 Ranking Global
            </h2>
            <p style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Top leitores da plataforma BookWorms
            </p>

            {/* Seletor de categoria */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '8px 18px', borderRadius: '999px', border: 'none',
                    cursor: 'pointer', fontFamily: 'Baloo 2', fontWeight: 700, fontSize: '0.82rem',
                    background: activeCategory === cat.key
                      ? 'linear-gradient(135deg, var(--pink-2), var(--pink))'
                      : 'rgba(255,255,255,0.08)',
                    color: activeCategory === cat.key ? '#1a0d15' : 'var(--text)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {rankingLoading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                Carregando ranking...
              </p>
            ) : (
              <>
                {/* Pódio TOP 3 */}
                {top3.length >= 3 && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--divider)',
                    borderRadius: '20px',
                    padding: '24px 16px 0',
                    marginBottom: '24px',
                  }}>
                    <h3 style={{
                      textAlign: 'center', margin: '0 0 24px',
                      fontFamily: 'Baloo 2', color: 'var(--text)',
                      fontSize: '1rem',
                    }}>
                      {catInfo.icon} Top 3 — {catInfo.label.replace(`${catInfo.icon} `, '')}
                    </h3>
                    <div style={{
                      display: 'flex', alignItems: 'flex-end',
                      gap: '8px', justifyContent: 'center',
                    }}>
                      {top3.map((entry, i) => (
                        <PodiumCard key={entry.userId || i} entry={entry} rank={i + 1} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista completa */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--divider)',
                  borderRadius: '16px',
                  padding: '12px',
                }}>
                  <h3 style={{
                    margin: '0 0 12px 4px', fontFamily: 'Baloo 2',
                    fontSize: '0.9rem', color: 'var(--text-muted)',
                  }}>
                    Classificação Completa
                  </h3>

                  {/* Cabeçalho */}
                  <div style={{
                    display: 'flex', gap: '12px', padding: '4px 14px 8px',
                    borderBottom: '1px solid var(--divider)', marginBottom: '6px',
                    fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700,
                  }}>
                    <span style={{ width: '32px' }}>#</span>
                    <span style={{ width: '34px' }}></span>
                    <span style={{ flex: 1 }}>Usuário</span>
                    <span>{catInfo.unit}</span>
                  </div>

                  {rankingData.map((entry, i) => (
                    <RankingRow key={entry.userId || i} entry={entry} rank={i + 1} />
                  ))}

                  {rankingData.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                      Nenhum dado disponível ainda.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default RankingPage;
