/* ============ VENDOR PRODUCTS SCRIPT ============ */

// Filter tabs
const rows = [...document.querySelectorAll('#prodBody tr')];

document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    rows.forEach(r => {
      if (filter === 'all') r.style.display = '';
      else r.style.display = r.dataset.status === filter ? '' : 'none';
    });
  });
});

// Search
document.getElementById('prodSearch')?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  rows.forEach(r => {
    const name = (r.dataset.name || '').toLowerCase();
    r.style.display = name.includes(q) ? '' : 'none';
  });
});

// Select all
const selectAll = document.getElementById('selectAll');
const rowChecks = [...document.querySelectorAll('.row-check')];
const bulkBar = document.getElementById('bulkBar');
const bulkCount = document.getElementById('bulkCount');

function updateBulk() {
  const checked = rowChecks.filter(c => c.checked).length;
  bulkCount.textContent = checked;
  bulkBar.hidden = checked === 0;
  if (selectAll) selectAll.checked = checked === rowChecks.length && checked > 0;
}

selectAll?.addEventListener('change', () => {
  rowChecks.forEach(c => c.checked = selectAll.checked);
  updateBulk();
});
rowChecks.forEach(c => c.addEventListener('change', updateBulk));

// Delete
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const name = row.dataset.name;
    if (!confirm(`Delete "${name}"?`)) return;
    row.style.opacity = '.4';
    row.style.pointerEvents = 'none';
    setTimeout(() => {
      row.remove();
      showVToast('Product deleted');
    }, 300);
  });
});

// Bulk actions
document.getElementById('bulkDelete')?.addEventListener('click', () => {
  const toDelete = rowChecks.filter(c => c.checked);
  if (!confirm(`Delete ${toDelete.length} products?`)) return;
  toDelete.forEach(c => c.closest('tr').remove());
  updateBulk();
  showVToast(`${toDelete.length} products deleted`);
});
document.getElementById('bulkActivate')?.addEventListener('click', () => {
  rowChecks.filter(c => c.checked).forEach(c => {
    const row = c.closest('tr');
    row.dataset.status = 'active';
    row.querySelector('.st').className = 'st st--active';
    row.querySelector('.st').textContent = 'Active';
  });
  updateBulk();
  showVToast('Products activated');
});
document.getElementById('bulkDraft')?.addEventListener('click', () => {
  rowChecks.filter(c => c.checked).forEach(c => {
    const row = c.closest('tr');
    row.dataset.status = 'draft';
    row.querySelector('.st').className = 'st st--draft';
    row.querySelector('.st').textContent = 'Draft';
  });
  updateBulk();
  showVToast('Products moved to draft');
});