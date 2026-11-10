/* ============ CATEGORY PAGE SCRIPT ============ */

// ----- Subcategory chips -----
document.querySelectorAll('.subcat-chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.subcat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ----- Filter sidebar drawer (mobile) -----
const filterToggle = document.getElementById('filterToggle');
const sidebar = document.getElementById('filterSidebar');
const overlay = document.getElementById('overlay');

filterToggle?.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
});
overlay?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

// ----- Filter group collapse -----
document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.classList.toggle('collapsed');
  });
});

// ----- View toggle (grid / list) -----
const grid = document.getElementById('productGrid');
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.view === 'list') {
      grid.classList.add('list-view');
    } else {
      grid.classList.remove('list-view');
    }
  });
});

// ----- Chip remove -----
document.querySelectorAll('.chip button').forEach(b => {
  b.addEventListener('click', () => b.parentElement.remove());
});

// ----- Clear all chips -----
document.querySelector('.chips__clear')?.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(c => c.remove());
});

// ----- Clear all filters -----
document.querySelector('.filter-clear')?.addEventListener('click', () => {
  // Reset checkboxes
  document.querySelectorAll('.check input, .radio input').forEach(i => { i.checked = false; });
  document.querySelectorAll('.radio input')[3].checked = true; // All ratings

  // Reset range
  const range = document.querySelector('.range');
  if (range) range.value = 800;

  // Clear chips
  document.querySelectorAll('.chip').forEach(c => c.remove());

  showToast('Filters cleared');
});

// ----- Toast helper -----
function showToast(msg) {
  let toast = document.getElementById('catToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'catToast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: var(--text); color: #fff;
      padding: 12px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      box-shadow: var(--shadow-lg); z-index: 500;
      transform: translateY(120%); transition: transform .3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.transform = 'translateY(120%)';
  }, 2200);
}

// ----- URL param support -----
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');
if (slug) {
  // Real app: fetch category data by slug, update hero title, products, etc.
  const heroTitle = document.querySelector('.category-hero h1');
  if (heroTitle) {
    heroTitle.textContent = slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  document.title = `${heroTitle.textContent} — ShopHub`;
}