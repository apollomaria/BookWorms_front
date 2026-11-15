// Endereço do backend: vem do arquivo .env do frontend (VITE_API_URL). Sem ele,
// usa o endereço padrão do backend local. É o ÚNICO lugar com a URL da API.
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

/**
 * Faz a chamada HTTP e padroniza o resultado para as telas:
 *   sucesso -> { success: true,  status, ...corpoDaResposta }
 *   erro    -> { success: false, status, message }          (backend respondeu erro)
 *   rede    -> { success: false, networkError: true, message } (backend inacessível)
 * O Nest devolve `message` como TEXTO ou como LISTA (erros de validação); aqui a lista
 * vira um texto único.
 */
async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return {
      success: false,
      networkError: true,
      message: 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
    };
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // resposta sem corpo JSON
  }

  if (!response.ok) {
    const raw = data && data.message;
    const message = Array.isArray(raw) ? raw.join(' ') : raw || `Erro ${response.status} ao falar com o servidor.`;
    return { success: false, status: response.status, message };
  }
  return { success: true, status: response.status, ...data };
}

// O backend responde com os nomes das colunas (nome_usuario...). As telas usam
// { id, username, email }; esta função faz a tradução em um só lugar.
function toUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    username: u.nome_usuario,
    email: u.email,
    birthDate: u.data_nascimento,
    level: u.nivel,
    exp: u.exp,
    createdAt: u.criado_em,
  };
}

function toReadingLog(r) {
  return {
    id: r.id,
    bookTitle: r.titulo_livro,
    totalPages: r.total_paginas,
    pagesRead: r.paginas_lidas,
    date: r.data_leitura,
    timerMinutes: r.minutos_lidos,
    notes: r.anotacoes,
  };
}

// ─── UC 001 - Conta ──────────────────────────────────────────────────────────
export const authService = {
  // RF 001. birthDate no formato AAAA-MM-DD.
  async register({ username, email, password, confirmPassword, birthDate }) {
    const res = await request('/users/cadastro', {
      method: 'POST',
      body: {
        nome: username,
        email,
        dataNascimento: birthDate,
        senha: password,
        confirmarSenha: confirmPassword,
      },
    });
    return res.success ? { ...res, user: toUser(res.usuario) } : res;
  },

  // RF 006. Aceita e-mail ou nome de usuário.
  async login(emailOrUsername, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { login: emailOrUsername, senha: password },
    });
    return res.success ? { ...res, user: toUser(res.usuario) } : res;
  },

  // RF 002.
  async getAccount(userId) {
    const res = await request(`/users/${userId}`);
    return res.success ? { ...res, user: toUser(res.usuario) } : res;
  },
};

export const clubService = {
  async createClub(userId, name, description, isPublic = true) {
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, description, isPublic }),
    });
    return response.json();
  },

  async joinClub(userId, clubId) {
    const response = await fetch(`${API_BASE_URL}/clubs/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, clubId }),
    });
    return response.json();
  },

  async listPublicClubs() {
    const response = await fetch(`${API_BASE_URL}/clubs`);
    return response.json();
  },
};

// ─── UC 002 - Registros de Leitura ───────────────────────────────────────────
export const readingLogService = {
  // RF 010. totalPages é opcional (o catálogo mínimo só conhece o total se alguém informou).
  async createLog(userId, bookTitle, pagesRead, totalPages, readDate, timerDurationSeconds, notes) {
    const body = {
      usuarioId: userId,
      tituloLivro: bookTitle,
      paginasLidas: Number(pagesRead),
      dataLeitura: readDate,
      minutosLidos: Math.round((Number(timerDurationSeconds) || 0) / 60),
    };
    if (Number(totalPages) > 0) body.totalPaginas = Number(totalPages);
    if (notes) body.anotacoes = notes;
    const res = await request('/reading-logs', { method: 'POST', body });
    return res.success ? { ...res, readingLog: toReadingLog(res.registro) } : res;
  },

  // RF 011
  async getUserLogs(userId) {
    const res = await request(`/reading-logs/user/${userId}`);
    return res.success ? { ...res, logs: res.registros.map(toReadingLog) } : res;
  },

  // RF 012: só os campos informados em `changes` são alterados.
  async updateLog(userId, logId, changes = {}) {
    const body = { usuarioId: userId };
    if (changes.bookTitle !== undefined) body.tituloLivro = changes.bookTitle;
    if (changes.pagesRead !== undefined) body.paginasLidas = Number(changes.pagesRead);
    if (changes.totalPages !== undefined) body.totalPaginas = Number(changes.totalPages);
    if (changes.readDate !== undefined) body.dataLeitura = changes.readDate;
    if (changes.timerMinutes !== undefined) body.minutosLidos = Number(changes.timerMinutes);
    if (changes.notes !== undefined) body.anotacoes = changes.notes;
    const res = await request(`/reading-logs/${logId}`, { method: 'PUT', body });
    return res.success ? { ...res, readingLog: toReadingLog(res.registro) } : res;
  },

  // RF 013
  async deleteLog(userId, logId) {
    return request(`/reading-logs/${logId}?usuarioId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
  },
};

// ─── UC 004 - Metas Pessoais ────────────────────────────────────────────────
export const goalService = {
  async createGoal(userId, type, targetValue, unit, deadline) {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type, targetValue: Number(targetValue), unit, deadline }),
    });
    return response.json();
  },

  async getUserGoals(userId) {
    const response = await fetch(`${API_BASE_URL}/goals/user/${userId}`);
    return response.json();
  },

  async updateGoal(userId, goalId, targetValue, deadline) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetValue: Number(targetValue), deadline }),
    });
    return response.json();
  },

  async deleteGoal(userId, goalId) {
    const response = await fetch(`${API_BASE_URL}/goals/${userId}/${goalId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// ─── UC 005 - Livros ─────────────────────────────────────────────────────────
export const bookService = {
  async searchBooks({ query, genre, minRating, userId } = {}) {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (genre && genre !== 'all') params.set('genre', genre);
    if (minRating) params.set('minRating', String(minRating));
    if (userId) params.set('userId', userId);
    const response = await fetch(`${API_BASE_URL}/books?${params.toString()}`);
    return response.json();
  },

  async updateShelf(userId, bookId, status, isFavorite) {
    const body = { userId, bookId };
    if (status !== undefined) body.status = status;
    if (isFavorite !== undefined) body.isFavorite = isFavorite;
    const response = await fetch(`${API_BASE_URL}/books/shelf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  },

  async getUserShelf(userId) {
    const response = await fetch(`${API_BASE_URL}/books/shelf/${userId}`);
    return response.json();
  },

  async rateBook(userId, bookId, rating, review) {
    const response = await fetch(`${API_BASE_URL}/books/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bookId, rating: Number(rating), review }),
    });
    return response.json();
  },

  async removeRating(userId, bookId) {
    const response = await fetch(`${API_BASE_URL}/books/ratings/${userId}/${bookId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// ─── UC 006 - Ranking ─────────────────────────────────────────────────────────
export const rankingService = {
  async getRanking(category = 'EXP') {
    const response = await fetch(`${API_BASE_URL}/rankings?category=${category}`);
    return response.json();
  },
};
