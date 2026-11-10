/* ============ ACCOUNT PAGE SCRIPT ============ */

// ----- Sidebar toggle (mobile) -----
// Hamburger button (header) + sidebar er relation
const accountSidebar = document.getElementById('accountSidebar');
const hamburger = document.querySelector('.hamburger');

// Create overlay dynamically
const overlay = document.createElement('div');
overlay.className = 'account-overlay';
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

// Sidebar link click e close (mobile)
accountSidebar?.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// ----- Logout (demo) -----
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    // Real app: clear token, call /api/logout
    window.location.href = 'login.html';
  }
});

// ----- Active link highlight -----
// Optionally auto-detect current page
// (already handled in HTML with .active class per page)