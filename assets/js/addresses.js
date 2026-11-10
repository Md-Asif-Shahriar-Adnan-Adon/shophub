/* ============ ADDRESSES PAGE SCRIPT ============ */

const addressGrid  = document.getElementById('addressGrid');
const addressEmpty = document.getElementById('addressEmpty');
const modal        = document.getElementById('addressModal');
const modalTitle   = document.getElementById('modalTitle');
const form         = document.getElementById('addressForm');
const toast        = document.getElementById('toast');

let editingId = null;

// ----- Toast -----
let toastTimer;
function showToast(msg) {
  toast.querySelector('.toast__msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ----- Refresh empty state -----
function refreshState() {
  const count = document.querySelectorAll('.address-item').length;
  if (count === 0) {
    addressGrid.hidden = true;
    addressEmpty.hidden = false;
    document.getElementById('addNewCard').hidden = true;
  } else {
    addressGrid.hidden = false;
    addressEmpty.hidden = true;
    document.getElementById('addNewCard').hidden = false;
  }
}

// ----- Open modal (add) -----
function openModalForAdd() {
  editingId = null;
  modalTitle.textContent = 'Add New Address';
  form.reset();
  document.querySelector('input[name="addrType"][value="Home"]').checked = true;
  clearAllErrors();
  modal.classList.add('show');
  setTimeout(() => document.getElementById('m-name').focus(), 100);
}

// ----- Open modal (edit) -----
function openModalForEdit(id) {
  const card = document.querySelector(`.address-item[data-id="${id}"]`);
  if (!card) return;

  editingId = id;
  modalTitle.textContent = 'Edit Address';

  // Prefill
  const name = card.querySelector('.address-label-row strong').textContent;
  const phoneText = card.querySelector('.phone')?.textContent || '';
  const phone = phoneText.replace('📞', '').trim();
  const paragraphs = card.querySelectorAll('.address-body p');
  const street = paragraphs[0]?.textContent || '';
  const cityPostal = (paragraphs[1]?.textContent || '').split(',').map(s => s.trim());
  const city = cityPostal[0] || '';
  const postal = (cityPostal[1] || '').replace(/\D/g, '');
  const type = card.querySelector('.address-type')?.textContent || 'Home';
  const isDefault = card.dataset.default === 'true';

  document.getElementById('m-name').value = name;
  document.getElementById('m-phone').value = phone;
  document.getElementById('m-address').value = street;
  document.getElementById('m-city').value = city;
  document.getElementById('m-postal').value = postal;
  document.getElementById('m-default').checked = isDefault;

  const typeInput = document.querySelector(`input[name="addrType"][value="${type}"]`);
  if (typeInput) typeInput.checked = true;

  clearAllErrors();
  modal.classList.add('show');
}

// ----- Close modal -----
function closeModal() {
  modal.classList.remove('show');
  editingId = null;
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

// ----- Validation -----
function setError(id, msg) {
  const field = document.getElementById(id);
  if (!field) return;
  field.classList.add('error');
  const err = field.querySelector('.field__error');
  if (err) err.textContent = msg;
}
function clearError(id) {
  const field = document.getElementById(id);
  if (!field) return;
  field.classList.remove('error');
}
function clearAllErrors() {
  ['f-name', 'f-phone', 'f-address', 'f-city', 'f-postal'].forEach(clearError);
}

['m-name', 'm-phone', 'm-address', 'm-city', 'm-postal'].forEach(id => {
  const inp = document.getElementById(id);
  inp?.addEventListener('input', () => {
    const fieldId = 'f-' + id.replace('m-', '');
    clearError(fieldId);
  });
});

// ----- Save address -----
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('m-name').value.trim();
  if (!name) { setError('f-name', 'Name is required'); valid = false; }

  const phone = document.getElementById('m-phone').value.trim();
  if (!phone) { setError('f-phone', 'Phone is required'); valid = false; }
  else if (phone.replace(/\D/g, '').length < 10) {
    setError('f-phone', 'Enter a valid phone'); valid = false;
  }

  const street = document.getElementById('m-address').value.trim();
  if (!street) { setError('f-address', 'Address is required'); valid = false; }

  const city = document.getElementById('m-city').value.trim();
  if (!city) { setError('f-city', 'City is required'); valid = false; }

  const postal = document.getElementById('m-postal').value.trim();
  if (!postal) { setError('f-postal', 'Postal code is required'); valid = false; }

  if (!valid) return;

  // Check max limit (only for add)
  if (!editingId && document.querySelectorAll('.address-item').length >= 5) {
    showToast('Maximum 5 addresses allowed');
    return;
  }

  const type = document.querySelector('input[name="addrType"]:checked').value;
  const isDefault = document.getElementById('m-default').checked;

  if (editingId) {
    updateAddress(editingId, { name, phone, street, city, postal, type, isDefault });
    showToast('Address updated');
  } else {
    addAddress({ name, phone, street, city, postal, type, isDefault });
    showToast('Address added');
  }

  closeModal();
  refreshState();
});

// ----- Add -----
function addAddress(data) {
  const id = Date.now();
  const icon = data.type === 'Office' ? '🏢' : data.type === 'Home' ? '🏠' : '📍';

  if (data.isDefault) {
    document.querySelectorAll('.address-item').forEach(a => {
      a.dataset.default = 'false';
      const badge = a.querySelector('.default-badge');
      if (badge) badge.remove();
      const dbtn = a.querySelector('.default-btn');
      if (dbtn) { dbtn.disabled = false; dbtn.textContent = 'Set as Default'; }
    });
  }

  const card = document.createElement('article');
  card.className = 'address-item';
  card.dataset.id = id;
  card.dataset.default = data.isDefault ? 'true' : 'false';

  card.innerHTML = `
    <div class="address-item__head">
      <div class="address-icon">${icon}</div>
      <div>
        <div class="address-label-row">
          <strong>${escapeHtml(data.name)}</strong>
          ${data.isDefault ? '<span class="default-badge">Default</span>' : ''}
        </div>
        <span class="address-type">${data.type}</span>
      </div>
    </div>
    <div class="address-body">
      <p>${escapeHtml(data.street)}</p>
      <p>${escapeHtml(data.city)}, ${escapeHtml(data.postal)}, Bangladesh</p>
      <p class="phone">📞 ${escapeHtml(data.phone)}</p>
    </div>
    <div class="address-actions">
      <button class="address-btn edit-btn" data-id="${id}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>
        </svg>
        Edit
      </button>
      <button class="address-btn default-btn" data-id="${id}" ${data.isDefault ? 'disabled' : ''}>${data.isDefault ? '✓ Default' : 'Set as Default'}</button>
      <button class="address-btn delete-btn" data-id="${id}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        </svg>
        Delete
      </button>
    </div>
  `;

  addressGrid.appendChild(card);
  bindCardEvents(card);
}

// ----- Update -----
function updateAddress(id, data) {
  const card = document.querySelector(`.address-item[data-id="${id}"]`);
  if (!card) return;

  if (data.isDefault) {
    document.querySelectorAll('.address-item').forEach(a => {
      a.dataset.default = 'false';
      const badge = a.querySelector('.default-badge');
      if (badge) badge.remove();
      const dbtn = a.querySelector('.default-btn');
      if (dbtn) { dbtn.disabled = false; dbtn.textContent = 'Set as Default'; }
    });
  }

  const icon = data.type === 'Office' ? '🏢' : data.type === 'Home' ? '🏠' : '📍';
  card.dataset.default = data.isDefault ? 'true' : 'false';

  card.innerHTML = `
    <div class="address-item__head">
      <div class="address-icon">${icon}</div>
      <div>
        <div class="address-label-row">
          <strong>${escapeHtml(data.name)}</strong>
          ${data.isDefault ? '<span class="default-badge">Default</span>' : ''}
        </div>
        <span class="address-type">${data.type}</span>
      </div>
    </div>
    <div class="address-body">
      <p>${escapeHtml(data.street)}</p>
      <p>${escapeHtml(data.city)}, ${escapeHtml(data.postal)}, Bangladesh</p>
      <p class="phone">📞 ${escapeHtml(data.phone)}</p>
    </div>
    <div class="address-actions">
      <button class="address-btn edit-btn" data-id="${id}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>
        </svg>
        Edit
      </button>
      <button class="address-btn default-btn" data-id="${id}" ${data.isDefault ? 'disabled' : ''}>${data.isDefault ? '✓ Default' : 'Set as Default'}</button>
      <button class="address-btn delete-btn" data-id="${id}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        </svg>
        Delete
      </button>
    </div>
  `;

  bindCardEvents(card);
}

// ----- Bind events -----
function bindCardEvents(card) {
  const id = card.dataset.id;

  card.querySelector('.edit-btn')?.addEventListener('click', () => openModalForEdit(id));
  card.querySelector('.delete-btn')?.addEventListener('click', () => deleteAddress(card));
  card.querySelector('.default-btn')?.addEventListener('click', () => setDefault(card));
}

// ----- Delete -----
function deleteAddress(card) {
  if (card.dataset.default === 'true' && document.querySelectorAll('.address-item').length === 1) {
    showToast('Cannot delete your only address');
    return;
  }
  if (!confirm('Delete this address?')) return;

  card.classList.add('removing');
  setTimeout(() => {
    card.remove();
    refreshState();
    showToast('Address deleted');
  }, 300);
}

// ----- Set default -----
function setDefault(card) {
  document.querySelectorAll('.address-item').forEach(a => {
    a.dataset.default = 'false';
    const badge = a.querySelector('.default-badge');
    if (badge) badge.remove();
    const dbtn = a.querySelector('.default-btn');
    if (dbtn) {
      dbtn.disabled = false;
      dbtn.textContent = 'Set as Default';
    }
  });

  card.dataset.default = 'true';
  const labelRow = card.querySelector('.address-label-row');
  if (!labelRow.querySelector('.default-badge')) {
    const badge = document.createElement('span');
    badge.className = 'default-badge';
    badge.textContent = 'Default';
    labelRow.appendChild(badge);
  }
  const dbtn = card.querySelector('.default-btn');
  if (dbtn) {
    dbtn.disabled = true;
    dbtn.textContent = '✓ Default';
  }

  showToast('Default address updated');
}

// ----- Helper -----
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// ----- Open modal triggers -----
document.getElementById('addAddressBtn')?.addEventListener('click', openModalForAdd);
document.getElementById('addNewCard')?.addEventListener('click', openModalForAdd);
document.getElementById('emptyAddBtn')?.addEventListener('click', openModalForAdd);

// Bind existing cards
document.querySelectorAll('.address-item').forEach(bindCardEvents);

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