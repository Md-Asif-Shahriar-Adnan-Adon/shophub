/* ============ WISHLIST PAGE SCRIPT ============ */

const wishGrid   = document.getElementById('wishlistGrid');
const wishEmpty  = document.getElementById('wishEmpty');
const wishToolbar = document.getElementById('wishToolbar');
const wishCount  = document.getElementById('wishCount');
const toast      = document.getElementById('toast');

// ----- Toast helper -----
let toastTimer;
function showToast(msg) {
  toast.querySelector('.toast__msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ----- Update count + empty state -----
function refreshState() {
  const cards = [...document.querySelectorAll('.wish-card')];
  const count = cards.length;
  wishCount.textContent = count;

  if (count === 0) {
    wishGrid.hidden = true;
    wishToolbar.hidden = true;
    wishEmpty.hidden = false;
  } else {
    wishGrid.hidden = false;
    wishToolbar.hidden = false;
    wishEmpty.hidden = true;
  }

  // Header wishlist badge (optional sync)
  const headerBadge = document.querySelector('.header__actions .icon-btn.active .badge');
  if (headerBadge) headerBadge.textContent = count;
}

// ----- Remove item -----
document.querySelectorAll('.wish-remove').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.wish-card');
    card.classList.add('removing');
    setTimeout(() => {
      card.remove();
      refreshState();
      showToast('Removed from wishlist');
    }, 300);
  });
});

// ----- Add to cart -----
document.querySelectorAll('.wish-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.innerHTML;
    btn.innerHTML = 'Adding...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Added to Cart';
      btn.style.background = 'var(--success)';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);

      showToast('Added to cart');
    }, 500);
  });
});

// ----- Add All to Cart -----
document.getElementById('addAllBtn')?.addEventListener('click', function () {
  const btn = this;
  const original = btn.innerHTML;
  const count = document.querySelectorAll('.wish-card').length;

  btn.innerHTML = 'Adding all...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = `✓ ${count} items added`;
    btn.style.background = 'var(--success)';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1800);

    showToast(`${count} items added to cart`);
  }, 900);
});

// ----- Clear All -----
document.getElementById('clearAllBtn')?.addEventListener('click', () => {
  const count = document.querySelectorAll('.wish-card').length;
  if (!count) return;
  if (!confirm(`Remove all ${count} items from your wishlist?`)) return;

  const cards = [...document.querySelectorAll('.wish-card')];
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('removing');
      setTimeout(() => {
        card.remove();
        if (i === cards.length - 1) {
          refreshState();
          showToast('Wishlist cleared');
        }
      }, 300);
    }, i * 80);
  });
});

// ----- Share wishlist -----
document.getElementById('shareBtn')?.addEventListener('click', async () => {
  const shareData = {
    title: 'My ShopHub Wishlist',
    text: 'Check out the products on my wishlist!',
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link copied to clipboard');
    } else {
      showToast('Share not supported');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      showToast('Share cancelled');
    }
  }
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
refreshState();