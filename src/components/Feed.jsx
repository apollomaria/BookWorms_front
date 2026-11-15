import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Feed() {
  const { posts, votePost, selectedForumFilter, setSelectedForumFilter, searchQuery } = useApp();
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesForum = selectedForumFilter === 'all' || post.forum === selectedForumFilter;
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.forum.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesForum && matchesSearch;
  });

  return (
    <main className="feed">
      {selectedForumFilter !== 'all' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-panel)',
          padding: '12px 18px',
          borderRadius: '14px',
          border: '1px solid var(--divider)',
          marginBottom: '-20px'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--pink-2)', fontWeight: 700 }}>
            Filtrando por: {selectedForumFilter}
          </span>
          <button
            type="button"
            onClick={() => setSelectedForumFilter('all')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            ✕ Limpar filtro
          </button>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '0 0 16px' }}>
            Nenhum post encontrado para este filtro ou busca.
          </p>
          <button
            type="button"
            className="btn-criar-clube"
            onClick={() => setSelectedForumFilter('all')}
          >
            Ver todos os posts
          </button>
        </div>
      ) : (
        filteredPosts.map((post) => {
          const isSpoilerRevealed = revealedSpoilers[post.id];

          return (
            <article key={post.id} className="post">
              <div className="post-header">
                <img
                  src={post.forumAvatar}
                  alt={post.forum}
                  className="avatar avatar--sm forum-avatar-img"
                />
                <span className="post-forum">{post.forum}</span>
                <span className="post-time">• {post.time}</span>
                {post.spoiler && (
                  <span
                    className="spoiler-tag"
                    style={{
                      cursor: 'pointer',
                      background: isSpoilerRevealed ? 'transparent' : 'rgba(238, 79, 158, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}
                    onClick={() => toggleSpoiler(post.id)}
                    title="Clique para ocultar ou exibir spoiler"
                  >
                    !SPOILER! {isSpoilerRevealed ? '(visível)' : '(clique p/ ver)'}
                  </span>
                )}
              </div>

              <h2 className="post-title">{post.title}</h2>

              <p
                className="post-text"
                style={{
                  filter: post.spoiler && !isSpoilerRevealed ? 'blur(4px)' : 'none',
                  transition: 'filter 0.3s ease',
                  cursor: post.spoiler && !isSpoilerRevealed ? 'pointer' : 'default'
                }}
                onClick={() => post.spoiler && !isSpoilerRevealed && toggleSpoiler(post.id)}
              >
                {post.text}
              </p>

              {post.mediaImage && (
                <div
                  className="post-media post-media--image"
                  style={{
                    filter: post.spoiler && !isSpoilerRevealed ? 'blur(8px)' : 'none',
                    transition: 'filter 0.3s ease',
                    cursor: post.spoiler && !isSpoilerRevealed ? 'pointer' : 'default'
                  }}
                  onClick={() => post.spoiler && !isSpoilerRevealed && toggleSpoiler(post.id)}
                >
                  <img
                    src={post.mediaImage}
                    alt={post.mediaAlt}
                    className="post-media-img"
                  />
                </div>
              )}

              <div className="post-actions">
                <span
                  className="vote vote--up"
                  style={{
                    boxShadow: post.userVote === 'up' ? '0 0 0 5px rgba(52, 195, 123, 0.45)' : undefined,
                    transform: post.userVote === 'up' ? 'scale(1.2)' : undefined
                  }}
                  title="Gostei (Upvote)"
                  onClick={() => votePost(post.id, 'up')}
                />
                <span
                  className="vote vote--down"
                  style={{
                    boxShadow: post.userVote === 'down' ? '0 0 0 5px rgba(230, 72, 62, 0.45)' : undefined,
                    transform: post.userVote === 'down' ? 'scale(1.2)' : undefined
                  }}
                  title="Não gostei (Downvote)"
                  onClick={() => votePost(post.id, 'down')}
                />
                <span
                  className="vote vote--neutral"
                  style={{
                    boxShadow: post.userVote === null ? '0 0 0 3px rgba(199, 207, 218, 0.25)' : undefined
                  }}
                  title="Remover voto"
                  onClick={() => votePost(post.id, 'neutral')}
                />
              </div>
            </article>
          );
        })
      )}
    </main>
  );
}

export default Feed;
