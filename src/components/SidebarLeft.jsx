import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function SidebarLeft() {
  const { currentPage, navigate, setSelectedForumFilter } = useApp();
  const [forunsExpanded, setForunsExpanded] = useState(true);

  const handleNav = (e, page, forumFilter = null) => {
    e.preventDefault();
    if (forumFilter !== null) {
      setSelectedForumFilter(forumFilter);
    }
    navigate(page);
  };

  return (
    <aside className="sidebar sidebar--left">
      <nav className="nav-group">
        <a
          href="#/home"
          className="nav-link"
          onClick={(e) => handleNav(e, 'home')}
          title="Ver página de apresentação do BookWorms"
        >
          Dar Apoio
        </a>
        <a
          href="#/index"
          className={`nav-link nav-link--strong ${currentPage === 'index' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'index', 'all')}
        >
          Página Inicial
        </a>
        <a
          href="#/criar-clube"
          className={`nav-link nav-link--strong ${currentPage === 'criar-clube' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'criar-clube')}
        >
          Criar Clube
        </a>
        <a
          href="#/entrar-clube"
          className={`nav-link nav-link--strong ${currentPage === 'entrar-clube' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'entrar-clube')}
        >
          Entrar em Clube
        </a>
      </nav>

      <hr className="divider" />

      <nav className="nav-group">
        <a
          href="#/criar-registro"
          className={`nav-link nav-link--strong ${currentPage === 'criar-registro' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'criar-registro')}
        >
          Criar Registro de Leitura
        </a>
        <a
          href="#/metas"
          className={`nav-link nav-link--strong ${currentPage === 'metas' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'metas')}
        >
          Estatísticas
        </a>
        <a
          href="#/metas"
          className={`nav-link nav-link--strong ${currentPage === 'metas' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'metas')}
        >
          Metas
        </a>
        <a
          href="#/livros"
          className={`nav-link nav-link--strong ${currentPage === 'livros' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'livros')}
        >
          Livros
        </a>
        <a
          href="#/minha-estante"
          className={`nav-link nav-link--strong ${currentPage === 'minha-estante' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'minha-estante')}
        >
          Minha Estante
        </a>
        <a
          href="#/rankings"
          className={`nav-link nav-link--strong ${currentPage === 'rankings' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'rankings')}
        >
          Rankings 🏆
        </a>
        <a
          href="#/testes"
          className={`nav-link nav-link--strong ${currentPage === 'testes' ? 'active-link' : ''}`}
          onClick={(e) => handleNav(e, 'testes')}
        >
          Testes
        </a>
      </nav>

      <hr className="divider" />

      <div className="nav-group">
        <button
          className="nav-collapse"
          type="button"
          aria-expanded={forunsExpanded ? 'true' : 'false'}
          aria-controls="forunsList"
          onClick={() => setForunsExpanded(prev => !prev)}
        >
          <span className="nav-link--strong">Fóruns</span>
          <span className="chevron">⌄</span>
        </button>
        <div className={`foruns-list${forunsExpanded ? '' : ' collapsed'}`} id="forunsList">
          <a
            href="#/index"
            className="forum-link"
            onClick={(e) => handleNav(e, 'index', 'bw/NormalPeople')}
            title="Filtrar posts de Pessoas Normais"
          >
            <img src="/img/NormalPeople.jpg" alt="bw/NormalPeople" className="avatar avatar--sm forum-avatar-img" />
            bw/NormalPeople
          </a>
          <a
            href="#/index"
            className="forum-link"
            onClick={(e) => handleNav(e, 'index', 'bw/SenhorDosAneis')}
            title="Filtrar posts de O Senhor dos Anéis"
          >
            <img src="/img/SenhorDosAneis.jpg" alt="bw/SenhorDosAneis" className="avatar avatar--sm forum-avatar-img" />
            bw/SenhorDosAneis
          </a>
          <a
            href="#/index"
            className="forum-link"
            onClick={(e) => handleNav(e, 'index', 'bw/MemoriasPostumas')}
            title="Filtrar posts de Memórias Póstumas"
          >
            <img src="/img/memoriasPostumas.jpg" alt="bw/MemoriasPostumas" className="avatar avatar--sm forum-avatar-img" />
            bw/MemoriasPostumas
          </a>
        </div>
      </div>

      <hr className="divider" />

      <a
        href="#/criar-conta"
        className="nav-link nav-link--bottom"
        onClick={(e) => handleNav(e, 'criar-conta')}
      >
        Configurações
      </a>
    </aside>
  );
}

export default SidebarLeft;
