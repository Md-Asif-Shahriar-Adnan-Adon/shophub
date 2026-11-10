/* ============ PROFILE SETTINGS SCRIPT ============ */

const toast = document.getElementById('toast');

// ----- Toast -----
let toastTimer;
function showToast(msg) {
  toast.querySelector('.toast__msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ================= PROFILE PHOTO =================
const photoInput = document.getElementById('photoInput');
const avatarPreview = document.getElementById('avatarPreview');

photoInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('Image must be under 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.src = ev.target.result;
    showToast('Photo updated');
  };
  reader.readAsDataURL(file);
});

function removePhoto() {
  avatarPreview.src = 'https://i.pravatar.cc/200?img=12';
  photoInput.value = '';
  showToast('Photo removed');
}
document.getElementById('removePhotoBtn')?.addEventListener('click', removePhoto);
document.getElementById('removePhoto')?.addEventListener('click', removePhoto);

// ================= PERSONAL INFO EDIT TOGGLE =================
const personalForm = document.getElementById('personalForm');
const personalActions = document.getElementById('personalActions');
const editBtn = document.getElementById('editPersonalBtn');
const cancelBtn = document.getElementById('cancelPersonal');

const personalInputs = () => personalForm.querySelectorAll(
  'input:not([type="radio"]), textarea, input[type="radio"]'
);

function setFormDisabled(disabled) {
  personalInputs().forEach(el => { el.disabled = disabled; });
}

// Initially disabled
setFormDisabled(true);

editBtn?.addEventListener('click', () => {
  setFormDisabled(false);
  personalActions.hidden = false;
  editBtn.style.display = 'none';
  document.getElementById('p-name').focus();
});

cancelBtn?.addEventListener('click', () => {
  setFormDisabled(true);
  personalActions.hidden = true;
  editBtn.style.display = '';
});

// ================= VALIDATION HELPERS =================
function setError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('error');
  const err = field.querySelector('.field__error');
  if (err) err.textContent = msg;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove('error');
  const err = field.querySelector('.field__error');
  if (err) err.textContent = '';
}

// Clear on input
['pf-name', 'pf-email', 'pf-phone'].forEach(id => {
  const inp = document.getElementById(id.replace('pf-', 'p-'));
  inp?.addEventListener('input', () => clearError(id));
});

// ================= SAVE PERSONAL INFO =================
personalForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('p-name').value.trim();
  if (!name) { setError('pf-name', 'Name is required'); valid = false; }

  const email = document.getElementById('p-email').value.trim();
  if (!email) { setError('pf-email', 'Email is required'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('pf-email', 'Invalid email'); valid = false;
  }

  const phone = document.getElementById('p-phone').value.trim();
  if (phone && phone.replace(/\D/g, '').length < 10) {
    setError('pf-phone', 'Invalid phone number'); valid = false;
  }

  if (!valid) return;

  // Simulate save
  const submitBtn = personalForm.querySelector('button[type="submit"]');
  const original = submitBtn.textContent;
  submitBtn.textContent = 'Saving...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = original;
    submitBtn.disabled = false;

    setFormDisabled(true);
    personalActions.hidden = true;
    editBtn.style.display = '';

    showToast('Profile updated');
  }, 700);
});

// ================= PASSWORD TOGGLES =================
document.querySelectorAll('.pwd-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.style.color = hidden ? 'var(--primary)' : '';
  });
});

// ================= PASSWORD STRENGTH =================
const newPwdInput = document.getElementById('p-new');
const strengthEl = document.getElementById('pwStrength');
const strengthLabel = document.getElementById('pwStrengthLabel');

function scorePassword(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4);
}

newPwdInput?.addEventListener('input', () => {
  const pwd = newPwdInput.value;
  if (!pwd) {
    strengthEl.removeAttribute('data-level');
    strengthLabel.textContent = 'Password strength';
    return;
  }
  const score = scorePassword(pwd);
  const labels = ['Too weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
  strengthEl.setAttribute('data-level', score);
  strengthLabel.textContent = labels[score] || 'Too weak';
});

// Clear on input
['pw-current', 'pw-new', 'pw-confirm'].forEach(id => {
  const inp = document.getElementById(id.replace('pw-', 'p-'));
  inp?.addEventListener('input', () => clearError(id));
});

// ================= UPDATE PASSWORD =================
const passwordForm = document.getElementById('passwordForm');
passwordForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const current = document.getElementById('p-current').value;
  if (!current) { setError('pw-current', 'Current password is required'); valid = false; }

  const newPwd = document.getElementById('p-new').value;
  if (!newPwd) { setError('pw-new', 'New password is required'); valid = false; }
  else if (newPwd.length < 6) { setError('pw-new', 'Min 6 characters'); valid = false; }
  else if (scorePassword(newPwd) < 2) {
    setError('pw-new', 'Password is too weak'); valid = false;
  } else if (newPwd === current) {
    setError('pw-new', 'New password must be different'); valid = false;
  }

  const confirm = document.getElementById('p-confirm').value;
  if (!confirm) { setError('pw-confirm', 'Please confirm'); valid = false; }
  else if (confirm !== newPwd) {
    setError('pw-confirm', 'Passwords do not match'); valid = false;
  }

  if (!valid) return;

  const btn = passwordForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Updating...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    passwordForm.reset();
    strengthEl.removeAttribute('data-level');
    strengthLabel.textContent = 'Password strength';
    showToast('Password updated');
  }, 800);
});

// ================= CONFIRM MODAL =================
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmField = document.getElementById('confirmField');
const confirmInput = document.getElementById('confirmInput');
const confirmWord = document.getElementById('confirmWord');
const confirmProceed = document.getElementById('confirmProceed');

let confirmCallback = null;
let requiresTyping = false;

function openConfirm({ title, message, type, onConfirm }) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  requiresTyping = type === 'typed';
  confirmField.hidden = !requiresTyping;
  confirmInput.value = '';
  confirmProceed.disabled = requiresTyping;
  confirmCallback = onConfirm;
  confirmModal.classList.add('show');
}
function closeConfirm() {
  confirmModal.classList.remove('show');
  confirmCallback = null;
}

confirmInput?.addEventListener('input', () => {
  if (!requiresTyping) return;
  confirmProceed.disabled = confirmInput.value.trim() !== confirmWord.textContent;
});

document.getElementById('confirmClose')?.addEventListener('click', closeConfirm);
document.getElementById('confirmCancel')?.addEventListener('click', closeConfirm);
confirmModal?.addEventListener('click', (e) => {
  if (e.target === confirmModal) closeConfirm();
});

confirmProceed?.addEventListener('click', () => {
  if (confirmCallback) confirmCallback();
  closeConfirm();
});

// ================= DEACTIVATE =================
document.getElementById('deactivateBtn')?.addEventListener('click', () => {
  openConfirm({
    title: 'Deactivate account?',
    message: 'Your account will be temporarily disabled. You can reactivate it anytime by logging back in.',
    type: 'simple',
    onConfirm: () => showToast('Account deactivated'),
  });
});

// ================= DELETE =================
document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
  confirmWord.textContent = 'DELETE';
  openConfirm({
    title: 'Delete account permanently?',
    message: 'This will permanently delete your account and all associated data. This action cannot be undone.',
    type: 'typed',
    onConfirm: () => {
      showToast('Account deleted');
      setTimeout(() => window.location.href = '../index.html', 1200);
    },
  });
});

// ================= SIDEBAR TOGGLE =================
const accountSidebar = document.getElementById('accountSidebar');
const hamburger = document.querySelector('.hamburger');

const overlay = document.createElement('div');
overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:150;display:none;`;
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