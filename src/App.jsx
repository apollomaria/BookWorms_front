import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/HomePage';
import CriarContaPage from './pages/CriarContaPage';
import CriarClubePage from './pages/CriarClubePage';
import EntrarClubePage from './pages/EntrarClubePage';
import CriarRegistroPage from './pages/CriarRegistroPage';
import MetasPage from './pages/MetasPage';
import TestesPage from './pages/TestesPage';
import LivrosPage from './pages/LivrosPage';
import RankingPage from './pages/RankingPage';
import CreatePostModal from './components/CreatePostModal';
import LoginModal from './components/LoginModal';

function AppRoutes() {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'criar-conta':
        return <CriarContaPage />;
      case 'criar-clube':
        return <CriarClubePage />;
      case 'entrar-clube':
        return <EntrarClubePage />;
      case 'criar-registro':
        return <CriarRegistroPage />;
      case 'metas':
        return <MetasPage />;
      case 'testes':
        return <TestesPage />;
      case 'livros':
        return <LivrosPage />;
      case 'minha-estante':
        return <LivrosPage shelfOnly />;
      case 'rankings':
        return <RankingPage />;
      case 'index':
      default:
        return <IndexPage />;
    }
  };

  return (
    <>
      {renderCurrentPage()}
      <CreatePostModal />
      <LoginModal />
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
