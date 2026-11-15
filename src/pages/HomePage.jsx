import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/style_home.css';

export function HomePage() {
  const { navigate } = useApp();

  useEffect(() => {
    // Efeito suave de reveal ao rolar
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealEls.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }, []);

  return (
    <div className="home-container">
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="float-icon float-icon--1">📖</span>
          <span className="float-icon float-icon--2">✨</span>
          <span className="float-icon float-icon--3">📚</span>
          <span className="float-icon float-icon--4">🔖</span>
        </div>

        <nav className="hero-nav reveal" data-reveal>
          <div className="hero-logo" onClick={() => navigate('index')}>
            <img src="/img/logo.jpeg" alt="Bookworms" className="hero-logo-img" />
            <span>Bookworms</span>
          </div>
          <button type="button" onClick={() => navigate('index')} className="btn-ghost">
            Entrar no site
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-mascot-wrap reveal" data-reveal>
            <img src="/img/logo.jpeg" alt="Mascote Bookworms" className="hero-mascot" />
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line" style={{ '--d': 0 }}>Leia.</span>
            <span className="hero-title-line" style={{ '--d': 1 }}>Registre.</span>
            <span className="hero-title-line hero-title-line--pink" style={{ '--d': 2 }}>Compartilhe.</span>
          </h1>

          <p className="hero-tagline reveal" data-reveal>
            O clube de leitura onde cada página vira conversa. Crie clubes, registre o que você lê e descubra sua próxima leitura favorita com outros leitores.
          </p>

          <div className="hero-actions reveal" data-reveal>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('index')}
            >
              Começar a ler →
            </button>
            <a href="#recursos" className="btn-secondary">
              Ver como funciona
            </a>
          </div>
        </div>

        <a href="#recursos" className="scroll-cue" aria-label="Rolar para ver mais">
          <span className="scroll-cue-dot" />
        </a>
      </section>

      {/* ===================== RECURSOS ===================== */}
      <section className="recursos" id="recursos">
        <div className="section-head reveal" data-reveal>
          <p className="section-kicker">Como funciona</p>
          <h2 className="section-title">Tudo que seu hábito de leitura precisa</h2>
        </div>

        <div className="shelf">
          <article className="book-card reveal" data-reveal style={{ '--rot': '-3deg' }}>
            <div className="book-spine" style={{ '--spine': '#ee4f9e' }}>
              <span className="book-icon">👥</span>
            </div>
            <div className="book-card-body">
              <h3>Clubes de Leitura</h3>
              <p>Crie um clube do zero ou entre em um já existente. Defina rankings, decida as próximas leituras em grupo e discuta capítulo por capítulo.</p>
            </div>
          </article>

          <article className="book-card reveal" data-reveal style={{ '--rot': '1.5deg' }}>
            <div className="book-spine" style={{ '--spine': '#34c37b' }}>
              <span className="book-icon">📔</span>
            </div>
            <div className="book-card-body">
              <h3>Registro de Leitura</h3>
              <p>Marque páginas lidas, vincule um cronômetro de leitura e associe cada registro aos clubes que você participa. Seu progresso, sempre à mão.</p>
            </div>
          </article>

          <article className="book-card reveal" data-reveal style={{ '--rot': '-1.5deg' }}>
            <div className="book-spine" style={{ '--spine': '#ff8fc4' }}>
              <span className="book-icon">🎯</span>
            </div>
            <div className="book-card-body">
              <h3>Metas de Leitura</h3>
              <p>Defina tipos e duração das suas metas. Acompanhe estatísticas e mantenha o ritmo de leitura sem perder a motivação.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ===================== PREVIEW DO FORUM ===================== */}
      <section className="forum-preview">
        <div className="section-head reveal" data-reveal>
          <p className="section-kicker">Comunidade</p>
          <h2 className="section-title">Discussões, spoilers e opiniões sinceras</h2>
          <p className="section-sub">Um fórum por clube, pra você discutir cada detalhe sem medo de estragar a leitura de quem ainda não chegou lá.</p>
        </div>

        <div className="preview-frame reveal" data-reveal>
          <article className="preview-post">
            <div className="preview-post-header">
              <img src="/img/NormalPeople.jpg" alt="bw/NormalPeople" className="preview-avatar" />
              <span className="preview-forum">bw/NormalPeople</span>
              <span className="preview-time">• há 4 dias</span>
              <span className="preview-spoiler">!SPOILER!</span>
            </div>
            <h3 className="preview-post-title">Povo besta</h3>
            <p className="preview-post-text">Não entendi o porquê deles esconderem o relacionamento no começo do livro</p>
            <div className="preview-post-media">
              <img src="/img/post-quote.png" alt="Trecho de livro" className="preview-media-img" />
            </div>
          </article>

          <div className="preview-fade">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('index')}
            >
              Ver fórum completo →
            </button>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="final-cta">
        <img src="/img/logo.jpeg" alt="Mascote Bookworms" className="final-cta-mascot reveal" data-reveal />
        <h2 className="reveal" data-reveal>Pronto pra encontrar sua próxima leitura?</h2>
        <button
          type="button"
          className="btn-primary reveal"
          data-reveal
          onClick={() => navigate('index')}
        >
          Entrar no Bookworms →
        </button>
        <p className="final-cta-footer">Bookworms — feito por quem ama um bom livro (e uma boa discussão sobre ele).</p>
      </section>
    </div>
  );
}

export default HomePage;
