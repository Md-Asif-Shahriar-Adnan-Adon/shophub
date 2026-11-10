/* ============ MY ORDERS PAGE SCRIPT ============ */

// Elements
const ordersList = document.getElementById('ordersList');
const ordersEmpty = document.getElementById('ordersEmpty');
const pagination = document.getElementById('ordersPagination');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('orderSearch');
const clearFiltersBtn = document.getElementById('clearFilters');

const allOrders = [...document.querySelectorAll('.order-card')];

let currentFilter = 'all';
let currentSearch = '';

// ----- Filter + search function -----
function applyFilters() {
  let visibleCount = 0;

  allOrders.forEach(card => {
    const status = card.dataset.status;
    const id = (card.dataset.id || '').toLowerCase();
    const product = (card.dataset.product || '').toLowerCase();
    const searchTerm = currentSearch.toLowerCase();

    const matchesStatus = currentFilter === 'all' || status === currentFilter;
    const matchesSearch = !searchTerm || id.includes(searchTerm) || product.includes(searchTerm);

    if (matchesStatus && matchesSearch) {
      card.hidden = false;
      visibleCount++;
    } else {
      card.hidden = true;
    }
  });

  // Empty state
  if (visibleCount === 0) {
    ordersEmpty.hidden = false;
    ordersList.hidden = true;
    pagination.hidden = true;
  } else {
    ordersEmpty.hidden = true;
    ordersList.hidden = false;
    pagination.hidden = false;
  }
}

// ----- Filter tabs -----
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    applyFilters();
  });
});

// ----- Search -----
let searchTimeout;
searchInput?.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value.trim();
    applyFilters();
  }, 200); // debounce
});

// ----- Clear filters -----
clearFiltersBtn?.addEventListener('click', () => {
  currentFilter = 'all';
  currentSearch = '';
  searchInput.value = '';
  filterTabs.forEach(t => t.classList.remove('active'));
  filterTabs[0].classList.add('active');
  applyFilters();
});

// ----- Reorder button -----
document.querySelectorAll('.reorder-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = 'Adding...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Added ✓';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);
    }, 700);
  });
});

// ----- Sidebar toggle (mobile) -----
const accountSidebar = document.getElementById('accountSidebar');
const hamburger = document.querySelector('.hamburger');

const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  z-index: 150; display: none;
`;
document.body.appendChild(overlay);

function openSidebar() {
  accountSidebar.classList.add('open');
  overlay.style.display = 'block';
}
function closeSidebar() {
  accountSidebar.classList.remove('open');
  overlay.style.display = 'none';
}

hamburger?.addEventListener('click', () => {
  if (accountSidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
});
overlay.addEventListener('click', closeSidebar);

accountSidebar?.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
});

// ----- Init -----
applyFilters();