/* ============ SHARED SCRIPT ============ */

// Wishlist toggle (♡ <-> ♥)
document.querySelectorAll('.wish').forEach(w => {
  w.addEventListener('click', (e) => {
    e.preventDefault();
    w.classList.toggle('liked');
    w.textContent = w.classList.contains('liked') ? '♥' : '♡';
  });
});

// Newsletter / forms demo
document.querySelectorAll('form').forEach(f => {
  f.addEventListener('submit', (e) => {
    // Uncomment for real validation:
    // e.preventDefault();
  });
});

// Homepage navigation menu
const homeHeader = document.querySelector('.header--home');
const homeMenuToggle = homeHeader?.querySelector('.hamburger');
const homeNavigation = homeHeader?.querySelector('#homeNavigation');

if (homeMenuToggle && homeNavigation) {
  const closeHomeMenu = () => {
    homeMenuToggle.setAttribute('aria-expanded', 'false');
    homeMenuToggle.setAttribute('aria-label', 'Open navigation menu');
    homeNavigation.classList.remove('is-open');
  };

  homeMenuToggle.addEventListener('click', () => {
    const isExpanded = homeMenuToggle.getAttribute('aria-expanded') === 'true';
    homeMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
    homeMenuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
    homeNavigation.classList.toggle('is-open', !isExpanded);
  });

  homeNavigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeHomeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeHomeMenu();
  });
}