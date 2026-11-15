import React, { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';
import { clubService } from '../services/api';

export function CriarClubePage() {
  const { navigate, addClub, currentUser } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rankingType, setRankingType] = useState('Mais Páginas Lidas');
  const [decisionType, setDecisionType] = useState('Votação Democrática');
  const [memberLimit, setMemberLimit] = useState('50');
  const [isPublic, setIsPublic] = useState('Público');
  const [selectedAvatar, setSelectedAvatar] = useState('/img/NormalPeople.jpg');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) {
      setError('Por favor preencha o nome do clube.');
      return;
    }

    try {
      setLoading(true);
      const newClubObj = {
        id: 'clube-' + Date.now(),
        name: name.startsWith('bw/') ? name.trim() : `bw/${name.trim()}`,
        description: description.trim(),
        rankingType,
        decisionType,
        memberLimit,
        isPublic: isPublic === 'Público',
        memberCount: 1,
        avatar: selectedAvatar
      };

      if (currentUser?.id) {
        try {
          await clubService.createClub(currentUser.id, newClubObj.name, description, newClubObj.isPublic);
        } catch {
          // segue com estado local
        }
      }

      addClub(newClubObj);
      setMessage(`Clube "${newClubObj.name}" criado com sucesso!`);
      setTimeout(() => {
        navigate('entrar-clube');
      }, 1200);
    } catch (err) {
      setError('Erro ao registrar o clube.');
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
            <h2 className="form-title">Criação de Clube</h2>

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

            <form onSubmit={handleSubmit}>
              <div className="form-top">
                <div className="form-top-fields">
                  <div className="form-field">
                    <label className="form-label">Nome do Clube</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Distopias & Ficção"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Quais livros e temas vocês discutirão juntos?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div
                  className="form-avatar-upload"
                  title="Clique para alternar o avatar do clube"
                  style={{
                    backgroundImage: `url(${selectedAvatar})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => {
                    const avatars = ['/img/NormalPeople.jpg', '/img/SenhorDosAneis.jpg', '/img/memoriasPostumas.jpg', '/img/logo.jpeg'];
                    const nextIndex = (avatars.indexOf(selectedAvatar) + 1) % avatars.length;
                    setSelectedAvatar(avatars[nextIndex]);
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">
                    Tipos de Rankings <span className="chevron-inline">⌄</span>
                  </label>
                  <select
                    className="form-input"
                    value={rankingType}
                    onChange={(e) => setRankingType(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Mais Páginas Lidas">Mais Páginas Lidas</option>
                    <option value="Tempo Lido no Cronômetro">Tempo Lido no Cronômetro</option>
                    <option value="Mais Livros Concluídos">Mais Livros Concluídos</option>
                    <option value="Mais Metas Atingidas">Mais Metas Atingidas</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Decisão de Leituras <span className="chevron-inline">⌄</span>
                  </label>
                  <select
                    className="form-input"
                    value={decisionType}
                    onChange={(e) => setDecisionType(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Votação Democrática">Votação Democrática</option>
                    <option value="Escolha do Líder">Escolha do Líder</option>
                    <option value="Sorteio Aleatório">Sorteio Aleatório</option>
                    <option value="Ordem Cronológica">Ordem Cronológica</option>
                  </select>
                </div>
              </div>

              <div className="form-field form-field--center">
                <label className="form-label">Quantidade de Membros</label>
                <input
                  type="number"
                  className="form-input"
                  min="2"
                  max="500"
                  value={memberLimit}
                  onChange={(e) => setMemberLimit(e.target.value)}
                  placeholder="Ex: 50"
                />
              </div>

              <div className="form-field form-field--center">
                <label className="form-label">Visibilidade do Clube</label>
                <select
                  className="form-input"
                  value={isPublic}
                  onChange={(e) => setIsPublic(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Público">Público (Qualquer leitor pode encontrar e entrar)</option>
                  <option value="Privado">Privado (Apenas por convite/código)</option>
                </select>
              </div>

              <hr className="form-divider" />

              <button
                type="submit"
                className="btn-criar-clube"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Clube'}
              </button>
            </form>
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default CriarClubePage;
