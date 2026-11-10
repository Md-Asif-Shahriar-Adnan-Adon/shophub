/* ============ VENDOR SHARED SCRIPT ============ */

// Sidebar toggle (mobile)
const vSidebar = document.getElementById('vSidebar');
const vOverlay = document.getElementById('vOverlay');
const vMenuToggle = document.getElementById('vMenuToggle');

function openVSidebar() {
  vSidebar?.classList.add('open');
  vOverlay?.classList.add('show');
}
function closeVSidebar() {
  vSidebar?.classList.remove('open');
  vOverlay?.classList.remove('show');
}
vMenuToggle?.addEventListener('click', () => {
  if (vSidebar?.classList.contains('open')) closeVSidebar();
  else openVSidebar();
});
vOverlay?.addEventListener('click', closeVSidebar);

// Logout
document.getElementById('vLogout')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Logout from Seller Center?')) {
    window.location.href = 'login.html';
  }
});

// Toast helper
window.showVToast = function (msg) {
  let t = document.getElementById('vToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vToast';
    t.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: var(--text); color: #fff;
      padding: 12px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 500;
      box-shadow: var(--shadow-lg); z-index: 500;
      transform: translateY(120%); transition: transform .3s ease;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.style.transform = 'translateY(0)');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.transform = 'translateY(120%)', 2200);
};