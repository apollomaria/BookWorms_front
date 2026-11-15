import React from 'react';
import { useApp } from '../context/AppContext';

export function SidebarRight() {
  const { navigate, setSelectedForumFilter } = useApp();

  const handleRecentClick = (forum) => {
    setSelectedForumFilter(forum);
    navigate('index');
  };

  return (
    <aside className="sidebar sidebar--right">
      <div className="recent-box">
        <h3 className="recent-title">Posts Recentes</h3>

        <div
          className="recent-item"
          onClick={() => handleRecentClick('bw/NormalPeople')}
          title="Ver discussão sobre Normal People"
          style={{ cursor: 'pointer' }}
        >
          <div className="recent-item-text">
            <div className="recent-meta">
              <img src="/img/NormalPeople.jpg" alt="bw/NormalPeople" className="avatar avatar--sm forum-avatar-img" />
              <span className="post-forum post-forum--sm">bw/Normal...</span>
              <span className="post-time post-time--sm">• há 4 dias</span>
            </div>
            <p className="recent-post-title">Povo besta</p>
          </div>
          <img src="/img/gambaApollo.jpeg" alt="Foto do gamba Apollo" className="avatar avatar--md profile-avatar-img" />
        </div>

        <hr className="divider divider--recent" />

        <div
          className="recent-item"
          onClick={() => handleRecentClick('bw/SenhorDosAneis')}
          title="Ver discussão sobre O Senhor dos Anéis"
          style={{ cursor: 'pointer' }}
        >
          <div className="recent-item-text">
            <div className="recent-meta">
              <img src="/img/SenhorDosAneis.jpg" alt="bw/SenhorDosAneis" className="avatar avatar--sm forum-avatar-img" />
              <span className="post-forum post-forum--sm">bw/Senhor...</span>
              <span class="post-time post-time--sm">• há 6 dias</span>
            </div>
            <p className="recent-post-title">Ordem cronológica dos livros</p>
          </div>
          <img src="/img/gatoApollo.jpeg" alt="Foto do gato Apollo" className="avatar avatar--md profile-avatar-img" />
        </div>
      </div>
    </aside>
  );
}

export default SidebarRight;
