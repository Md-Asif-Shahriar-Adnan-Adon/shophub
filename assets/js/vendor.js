/* ============ VENDOR PUBLIC PAGE SCRIPT ============ */

// ================= VENDOR TABS =================
const vtabs = document.querySelectorAll('.vtab');
const vpanels = document.querySelectorAll('.vpanel');

vtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    vtabs.forEach(t => t.classList.remove('active'));
    vpanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`vpanel-${target}`)?.classList.add('active');
  });
});

// ================= FOLLOW BUTTON =================
const followBtn = document.getElementById('followBtn');
let following = false;

followBtn?.addEventListener('click', function () {
  following = !following;
  if (following) {
    this.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Following
    `;
    this.style.background = 'var(--success)';
    this.style.borderColor = 'var(--success)';
    showToast('Now following TechZone');
  } else {
    this.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
      Follow
    `;
    this.style.background = '';
    this.style.borderColor = '';
    showToast('Unfollowed TechZone');
  }
});

// ================= CONTACT BUTTONS =================
function handleContact() {
  showToast('Contact form coming soon');
  // Real app: open modal or redirect to contact form
}
document.getElementById('contactBtn')?.addEventListener('click', handleContact);
document.getElementById('aboutContactBtn')?.addEventListener('click', handleContact);

// ================= FILTER CHIPS (products) =================
document.querySelectorAll('.fchip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    // Real app: filter products by category
  });
});

// ================= REVIEW FILTERS =================
document.querySelectorAll('.rf').forEach(rf => {
  rf.addEventListener('click', () => {
    document.querySelectorAll('.rf').forEach(r => r.classList.remove('active'));
    rf.classList.add('active');
    // Real app: filter reviews
  });
});

// ================= REVIEW "HELPFUL" TOGGLE =================
document.querySelectorAll('.vreview__foot span').forEach(span => {
  span.addEventListener('click', function () {
    const match = this.textContent.match(/\d+/);
    if (!match) return;
    const current = parseInt(match[0]);
    const isClicked = this.dataset.clicked === 'true';
    const next = isClicked ? current - 1 : current + 1;
    this.textContent = `👍 ${next} helpful`;
    this.dataset.clicked = isClicked ? 'false' : 'true';
    this.style.color = isClicked ? '' : 'var(--primary)';
  });
});

// ================= WISHLIST TOGGLE =================
document.querySelectorAll('.wish').forEach(w => {
  w.addEventListener('click', () => {
    w.classList.toggle('liked');
    w.textContent = w.classList.contains('liked') ? '♥' : '♡';
  });
});

// ================= LOAD MORE REVIEWS =================
document.querySelector('#vpanel-reviews .view-more-wrap .btn')?.addEventListener('click', function () {
  const original = this.textContent;
  this.textContent = 'Loading...';
  this.disabled = true;

  setTimeout(() => {
    // Real app: fetch next page of reviews
    this.textContent = original;
    this.disabled = false;
    showToast('No more reviews to load');
  }, 600);
});

// ================= TOAST HELPER =================
let toast;
let toastTimer;
function showToast(msg) {
  if (!toast) {
    toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: var(--text); color: #fff;
      padding: 12px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      box-shadow: var(--shadow-lg); z-index: 500;
      transform: translateY(120%); transition: transform .3s ease;
      max-width: 320px;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(120%)';
  }, 2200);
}

// ================= URL PARAM SUPPORT =================
const params = new URLSearchParams(window.location.search);
const shopSlug = params.get('shop');
if (shopSlug) {
  // Real app: fetch vendor by slug
  const h1 = document.querySelector('.shop-title-row h1');
  if (h1) h1.textContent = shopSlug.charAt(0).toUpperCase() + shopSlug.slice(1);
  document.title = `${h1.textContent} Store — ShopHub`;
}