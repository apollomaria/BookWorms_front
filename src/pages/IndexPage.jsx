import React from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { Feed } from '../components/Feed';
import { SidebarRight } from '../components/SidebarRight';

export function IndexPage() {
  return (
    <>
      {/* Topbar sem barra de busca para fidelidade exata ao index.html legado */}
      <Topbar showSearch={false} />
      <div className="layout">
        <SidebarLeft />
        <Feed />
        <SidebarRight />
      </div>
    </>
  );
}

export default IndexPage;
