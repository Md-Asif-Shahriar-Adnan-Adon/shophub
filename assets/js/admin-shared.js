/* ============ ADMIN SHARED SCRIPT ============ */

const aSidebar = document.getElementById('aSidebar');
const aOverlay = document.getElementById('aOverlay');
const aMenuToggle = document.getElementById('aMenuToggle');

function openASidebar() {
  aSidebar?.classList.add('open');
  aOverlay?.classList.add('show');
}
function closeASidebar() {
  aSidebar?.classList.remove('open');
  aOverlay?.classList.remove('show');
}
aMenuToggle?.addEventListener('click', () => {
  if (aSidebar?.classList.contains('open')) closeASidebar();
  else openASidebar();
});
aOverlay?.addEventListener('click', closeASidebar);

document.getElementById('aLogout')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Logout from Admin Panel?')) {
    window.location.href = 'login.html';
  }
});

window.showAToast = function (msg, type = 'success') {
  let t = document.getElementById('aToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'aToast';
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
  if (type === 'error') t.style.background = 'var(--danger)';
  else if (type === 'success') t.style.background = 'var(--success)';
  else t.style.background = 'var(--text)';
  requestAnimationFrame(() => t.style.transform = 'translateY(0)');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.transform = 'translateY(120%)', 2200);
};