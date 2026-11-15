// Bookworms - animações da página home

document.addEventListener('DOMContentLoaded', () => {
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
  } else {
    // Fallback: navegadores sem suporte a IntersectionObserver mostram tudo direto
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
});
