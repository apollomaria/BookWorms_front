// Bookworms - interações visuais simples da interface

document.addEventListener('DOMContentLoaded', () => {
  const forunsToggle = document.getElementById('forunsToggle');
  const forunsList = document.getElementById('forunsList');

  forunsToggle.addEventListener('click', () => {
    const isExpanded = forunsToggle.getAttribute('aria-expanded') === 'true';
    forunsToggle.setAttribute('aria-expanded', String(!isExpanded));
    forunsList.classList.toggle('collapsed');
  });
});
