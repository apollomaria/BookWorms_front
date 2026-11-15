import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { clubService, goalService, bookService, rankingService, readingLogService } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Roteamento SPA
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const validPages = ['home', 'index', 'criar-conta', 'login', 'criar-clube', 'entrar-clube', 'criar-registro', 'metas', 'testes', 'livros', 'minha-estante', 'rankings'];
    return validPages.includes(hash) ? hash : 'index';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bw_user');
      const user = saved ? JSON.parse(saved) : null;
      // Sessões antigas "simuladas" (id texto, ex.: 'user-local-123') não existem no
      // banco. Só aceitamos usuários reais, cujo id é um número devolvido pelo backend.
      if (user && !Number.isInteger(user.id)) {
        localStorage.removeItem('bw_user');
        return null;
      }
      return user;
    } catch {
      return null;
    }
  });

  // Filtros do Feed
  const [selectedForumFilter, setSelectedForumFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Posts do Fórum (com estados de votos reativos)
  const [posts, setPosts] = useState([
    {
      id: 1,
      forum: 'bw/NormalPeople',
      forumAvatar: '/img/NormalPeople.jpg',
      time: 'há 4 dias',
      spoiler: true,
      title: 'Povo besta',
      text: 'Não entendi o porquê deles esconderem o relacionamento no começo do livro',
      mediaImage: '/img/post-quote.png',
      mediaAlt: 'Trecho do livro: Às vezes, o nosso vazio só se preenche com um pouco mais de nós mesmos.',
      userVote: null,
      upvotesCount: 14,
    },
    {
      id: 2,
      forum: 'bw/SenhorDosAneis',
      forumAvatar: '/img/SenhorDosAneis.jpg',
      time: 'há 6 dias',
      spoiler: false,
      title: 'Ordem cronológica dos livros',
      text: 'Aqui está um exemplo de como é a sequência dos livros de o Senhor dos Anéis',
      mediaImage: '/img/sequencia_livro.jpg',
      mediaAlt: 'Ordem cronológica de leitura dos livros de O Senhor dos Anéis',
      userVote: null,
      upvotesCount: 28,
    }
  ]);

  // Lista de Clubes
  const [clubs, setClubs] = useState([
    {
      id: 'clube-1',
      name: 'bw/NormalPeople',
      description: 'Discussões aprofundadas sobre Pessoas Normais e Sally Rooney.',
      isPublic: true,
      memberCount: 42,
      rankingType: 'Mais Páginas Lidas',
      decisionType: 'Votação Democrática',
      avatar: '/img/NormalPeople.jpg'
    },
    {
      id: 'clube-2',
      name: 'bw/SenhorDosAneis',
      description: 'Terra Média, lore de Tolkien, leituras conjuntas e cronologias.',
      isPublic: true,
      memberCount: 89,
      rankingType: 'Tempo Lido no Cronômetro',
      decisionType: 'Escolha do Líder',
      avatar: '/img/SenhorDosAneis.jpg'
    },
    {
      id: 'clube-3',
      name: 'bw/MemoriasPostumas',
      description: 'Clássicos da literatura brasileira e ironia machadiana.',
      isPublic: true,
      memberCount: 31,
      rankingType: 'Mais Livros Concluídos',
      decisionType: 'Votação Democrática',
      avatar: '/img/memoriasPostumas.jpg'
    }
  ]);

  // ─── UC 004 - Metas ──────────────────────────────────────────────────────────
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState('');

  // ─── UC 005 - Livros ─────────────────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [userShelf, setUserShelf] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // ─── UC 006 - Ranking ────────────────────────────────────────────────────────
  const [rankings, setRankings] = useState({ EXP: [], PAGINAS: [], LIVROS: [] });
  const [rankingLoading, setRankingLoading] = useState(false);

  // ─── UC 002 - Registros de Leitura (vêm do backend) ─────────────────────────
  const [readingLogs, setReadingLogs] = useState([]);
  const [readingLogsError, setReadingLogsError] = useState('');

  // Sincronizar hash da URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // Carregar clubes do backend se disponível
  useEffect(() => {
    clubService.listPublicClubs().then(res => {
      if (res && res.success && Array.isArray(res.clubs) && res.clubs.length > 0) {
        setClubs(prev => {
          const ids = new Set(prev.map(c => c.id));
          const newOnes = res.clubs.filter(c => !ids.has(c.id));
          return [...prev, ...newOnes];
        });
      }
    }).catch(() => {
      // Backend offline, mantém os clubes locais padrão
    });
  }, []);

  // Carregar livros do backend ao iniciar
  useEffect(() => {
    syncBooks();
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('bw_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bw_user');
    } catch (e) {
      console.error(e);
    }
    navigate('index');
  };

  const addPost = ({ forum, title, text, mediaImage, spoiler }) => {
    const newPost = {
      id: Date.now(),
      forum: forum || 'bw/Geral',
      forumAvatar: forum === 'bw/NormalPeople' ? '/img/NormalPeople.jpg' :
                   forum === 'bw/SenhorDosAneis' ? '/img/SenhorDosAneis.jpg' :
                   forum === 'bw/MemoriasPostumas' ? '/img/memoriasPostumas.jpg' : '/img/logo.jpeg',
      time: 'agora mesmo',
      spoiler: !!spoiler,
      title,
      text,
      mediaImage: mediaImage || null,
      mediaAlt: title,
      userVote: 'up',
      upvotesCount: 1
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const votePost = (postId, direction) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      if (direction === 'neutral') {
        return { ...p, userVote: null };
      }
      return {
        ...p,
        userVote: p.userVote === direction ? null : direction
      };
    }));
  };

  const addClub = (newClub) => {
    setClubs(prev => [newClub, ...prev]);
  };

  // ─── UC 004 - Funções de Metas ───────────────────────────────────────────────

  const syncGoals = useCallback(async (userId) => {
    if (!userId) return;
    setGoalsLoading(true);
    setGoalsError('');
    try {
      const res = await goalService.getUserGoals(userId);
      if (res && res.success && Array.isArray(res.goals)) {
        setGoals(res.goals);
      }
    } catch {
      setGoalsError('Não foi possível carregar as metas. Backend offline?');
    } finally {
      setGoalsLoading(false);
    }
  }, []);

  const createGoal = async ({ userId, type, targetValue, unit, deadline }) => {
    const res = await goalService.createGoal(userId, type, targetValue, unit, deadline);
    if (res && res.success) {
      await syncGoals(userId);
    }
    return res;
  };

  const updateGoal = async ({ userId, goalId, targetValue, deadline }) => {
    const res = await goalService.updateGoal(userId, goalId, targetValue, deadline);
    if (res && res.success) {
      await syncGoals(userId);
    }
    return res;
  };

  const deleteGoal = async (userId, goalId) => {
    const res = await goalService.deleteGoal(userId, goalId);
    if (res && res.success) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
    return res;
  };

  // Mantém retrocompatibilidade com código legado (chamado como addGoal)
  const addGoal = (type, duration) => {
    const newGoal = {
      id: Date.now(),
      type,
      duration,
      targetValue: 20,
      unit: 'pages',
      progress: 0,
      active: true
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  // ─── UC 005 - Funções de Livros ──────────────────────────────────────────────

  const syncBooks = useCallback(async (filters = {}) => {
    setBooksLoading(true);
    try {
      const res = await bookService.searchBooks(filters);
      if (res && res.success && Array.isArray(res.books)) {
        setBooks(res.books);
      }
    } catch {
      // Backend offline
    } finally {
      setBooksLoading(false);
    }
  }, []);

  const syncUserShelf = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await bookService.getUserShelf(userId);
      if (res && res.success && Array.isArray(res.shelf)) {
        setUserShelf(res.shelf);
      }
    } catch {
      // Backend offline
    }
  }, []);

  const updateBookShelf = async (userId, bookId, status, isFavorite) => {
    const res = await bookService.updateShelf(userId, bookId, status, isFavorite);
    if (res && res.success) {
      await syncBooks();
      await syncUserShelf(userId);
    }
    return res;
  };

  const rateBook = async (userId, bookId, rating, review) => {
    const res = await bookService.rateBook(userId, bookId, rating, review);
    if (res && res.success) {
      await syncBooks();
      await syncUserShelf(userId);
    }
    return res;
  };

  const removeBookRating = async (userId, bookId) => {
    const res = await bookService.removeRating(userId, bookId);
    if (res && res.success) {
      await syncBooks();
      await syncUserShelf(userId);
    }
    return res;
  };

  // ─── UC 006 - Funções de Ranking ─────────────────────────────────────────────

  const syncRanking = useCallback(async (category = 'EXP') => {
    setRankingLoading(true);
    try {
      const res = await rankingService.getRanking(category);
      if (res && res.success && Array.isArray(res.ranking)) {
        setRankings(prev => ({ ...prev, [category]: res.ranking }));
      }
    } catch {
      // Backend offline
    } finally {
      setRankingLoading(false);
    }
  }, []);

  // ─── UC 002 - Funções de Registros de Leitura ────────────────────────────────

  const syncReadingLogs = useCallback(async (userId) => {
    if (!userId) {
      setReadingLogs([]);
      return;
    }
    const res = await readingLogService.getUserLogs(userId);
    if (res.success) {
      setReadingLogs(res.logs);
      setReadingLogsError('');
    } else {
      setReadingLogsError(res.message);
    }
  }, []);

  // Cria o registro no backend e, se deu certo, recarrega a lista do banco
  // (a lista exibida é sempre o que está persistido, não uma cópia local).
  const createReadingLog = async ({ userId, bookTitle, pagesRead, readDate, timerMinutes, notes }) => {
    const res = await readingLogService.createLog(
      userId, bookTitle, pagesRead, null, readDate, (Number(timerMinutes) || 0) * 60, notes
    );
    if (res.success) {
      await syncReadingLogs(userId);
    }
    return res;
  };

  // Ao entrar/sair de uma conta, a lista de registros acompanha o usuário logado.
  useEffect(() => {
    syncReadingLogs(currentUser?.id);
  }, [currentUser?.id, syncReadingLogs]);

  return (
    <AppContext.Provider value={{
      currentPage,
      navigate,
      currentUser,
      loginUser,
      logout,
      posts,
      addPost,
      votePost,
      clubs,
      addClub,
      // UC 004 - Metas
      goals,
      goalsLoading,
      goalsError,
      addGoal,
      createGoal,
      updateGoal,
      deleteGoal,
      syncGoals,
      // UC 005 - Livros
      books,
      userShelf,
      booksLoading,
      syncBooks,
      syncUserShelf,
      updateBookShelf,
      rateBook,
      removeBookRating,
      // UC 006 - Ranking
      rankings,
      rankingLoading,
      syncRanking,
      // Outros
      readingLogs,
      readingLogsError,
      syncReadingLogs,
      createReadingLog,
      selectedForumFilter,
      setSelectedForumFilter,
      searchQuery,
      setSearchQuery,
      isCreatePostModalOpen,
      setIsCreatePostModalOpen,
      isLoginModalOpen,
      setIsLoginModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
