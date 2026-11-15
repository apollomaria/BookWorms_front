import React, { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';

export function TestesPage() {
  const [bookQuery, setBookQuery] = useState('');
  const [showPublicTests, setShowPublicTests] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  const availableQuizzes = [
    {
      id: 1,
      bookTitle: 'Pessoas Normais',
      author: 'Sally Rooney',
      questionCount: 5,
      questions: [
        {
          q: 'Em qual universidade Connell e Marianne estudam em Dublin?',
          options: ['Trinity College', 'University College Dublin', 'Oxford', 'Kings College'],
          correct: 0
        }
      ]
    },
    {
      id: 2,
      bookTitle: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      questionCount: 8,
      questions: [
        {
          q: 'Qual é o nome do pônei que acompanha a comitiva até os portões de Moria?',
          options: ['Bill', 'Shadowfax', 'Boba', 'Pippin'],
          correct: 0
        }
      ]
    },
    {
      id: 3,
      bookTitle: 'Memórias Póstumas de Brás Cubas',
      author: 'Machado de Assis',
      questionCount: 6,
      questions: [
        {
          q: 'A quem Brás Cubas dedica suas memórias póstumas?',
          options: [
            'Ao verme que primeiro roeu as frias carnes de seu cadáver',
            'À sua amada Virgília',
            'Ao filósofo Quincas Borba',
            'Ao povo brasileiro'
          ],
          correct: 0
        }
      ]
    }
  ];

  const filtered = availableQuizzes.filter(t =>
    !bookQuery || t.bookTitle.toLowerCase().includes(bookQuery.toLowerCase())
  );

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswer(null);
    setQuizScore(null);
  };

  const handleAnswerSubmit = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === activeQuiz.questions[0].correct;
    setQuizScore(isCorrect ? 'correto' : 'incorreto');
  };

  return (
    <>
      <Topbar showSearch={true} />

      <div className="layout">
        <SidebarLeft />

        <main className="feed feed--center">
          <div className="form-card entrar-card">
            <h2 className="form-title">Encontrar Testes</h2>

            <div className="form-field form-field--center">
              <label className="form-label">Nome do Livro</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Pessoas Normais, Senhor dos Anéis..."
                value={bookQuery}
                onChange={(e) => setBookQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-criar-clube btn-entrar"
              onClick={() => setShowPublicTests(true)}
            >
              Procurar
            </button>

            <div className="or-divider">
              <span />
              <p>ou</p>
              <span />
            </div>

            <h3 className="form-subtitle">Lista de Testes Públicos</h3>
            <button
              type="button"
              className="btn-criar-clube"
              onClick={() => setShowPublicTests(prev => !prev)}
            >
              {showPublicTests ? 'Ocultar' : 'Ver'}
            </button>

            {/* Modal / Card de Quiz Ativo */}
            {activeQuiz && (
              <div style={{
                marginTop: '28px',
                background: 'rgba(238, 79, 158, 0.08)',
                border: '1px solid var(--pink)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--pink-2)', fontFamily: 'Baloo 2', fontSize: '1.15rem' }}>
                    Quiz: {activeQuiz.bookTitle}
                  </h4>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    ✕ Fechar
                  </button>
                </div>

                <p style={{ margin: '14px 0 16px', fontWeight: 600 }}>
                  {activeQuiz.questions[0].q}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeQuiz.questions[0].options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswerSubmit(idx)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--divider)',
                        background: selectedAnswer === idx
                          ? (quizScore === 'correto' ? 'rgba(52, 195, 123, 0.3)' : 'rgba(230, 72, 62, 0.3)')
                          : 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizScore && (
                  <div style={{
                    marginTop: '14px',
                    fontWeight: 700,
                    color: quizScore === 'correto' ? 'var(--green)' : 'var(--red)'
                  }}>
                    {quizScore === 'correto'
                      ? '🎉 Resposta Exata! Você faturou +50 EXP para o seu clube!'
                      : '❌ Não foi dessa vez! Tente reler o capítulo correspondente.'}
                  </div>
                )}
              </div>
            )}

            {/* Listagem de Testes */}
            {showPublicTests && !activeQuiz && (
              <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                {filtered.map(test => (
                  <div
                    key={test.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1px solid var(--divider)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--pink-2)', fontSize: '0.95rem' }}>{test.bookTitle}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Autor: {test.author} • {test.questionCount} questões
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartQuiz(test)}
                      className="btn-criar-clube"
                      style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                    >
                      Fazer Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default TestesPage;
