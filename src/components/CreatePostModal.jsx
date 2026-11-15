import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function CreatePostModal() {
  const { isCreatePostModalOpen, setIsCreatePostModalOpen, addPost, navigate } = useApp();

  const [forum, setForum] = useState('bw/NormalPeople');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mediaImage, setMediaImage] = useState('/img/post-quote.png');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [error, setError] = useState('');

  if (!isCreatePostModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError('Por favor preencha o título e o conteúdo da postagem.');
      return;
    }

    addPost({
      forum,
      title: title.trim(),
      text: text.trim(),
      mediaImage: mediaImage || null,
      spoiler: isSpoiler
    });

    setTitle('');
    setText('');
    setError('');
    setIsCreatePostModalOpen(false);
    navigate('index');
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
      <div className="form-card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(false)}
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

        <h2 className="form-title" style={{ marginTop: 0 }}>Criar Nova Postagem</h2>

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
            <label className="form-label">Selecionar Fórum / Clube</label>
            <select
              className="form-input"
              value={forum}
              onChange={(e) => setForum(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="bw/NormalPeople">bw/NormalPeople</option>
              <option value="bw/SenhorDosAneis">bw/SenhorDosAneis</option>
              <option value="bw/MemoriasPostumas">bw/MemoriasPostumas</option>
              <option value="bw/Geral">bw/Geral (Discussão Livre)</option>
            </select>
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Título do Post</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Minha teoria sobre o final..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Conteúdo do Post</label>
            <textarea
              className="form-textarea"
              placeholder="O que você achou desta leitura? Sem medo de opinar..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-field form-field--center">
            <label className="form-label">Imagem ou Citação (Opcional)</label>
            <select
              className="form-input"
              value={mediaImage}
              onChange={(e) => setMediaImage(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="/img/post-quote.png">Citação ilustrada (Pessoas Normais)</option>
              <option value="/img/sequencia_livro.jpg">Cronologia Ilustrada (Senhor dos Anéis)</option>
              <option value="">Sem anexo de imagem</option>
            </select>
          </div>

          <div className="form-field form-field--center" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="spoilerCheck"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--pink)' }}
            />
            <label htmlFor="spoilerCheck" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Contém spoiler da trama!
            </label>
          </div>

          <hr className="form-divider" />

          <button type="submit" className="btn-criar-clube">
            Publicar no Fórum
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
