/* ============ REGISTER PAGE SCRIPT ============ */

// ----- Show/hide password (both fields) -----
function bindToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  if (!toggle || !input) return;
  toggle.addEventListener('click', () => {
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    toggle.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    toggle.style.color = hidden ? 'var(--primary)' : 'var(--text-muted)';
  });
}
bindToggle('togglePwd', 'password');
bindToggle('toggleConfirm', 'confirm');

// ----- Password strength -----
const strengthEl = document.getElementById('strength');
const strengthLabel = document.getElementById('strengthLabel');
const passInput = document.getElementById('password');

function scorePassword(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  // Cap at 4
  return Math.min(score, 4);
}

passInput?.addEventListener('input', () => {
  const pwd = passInput.value;
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

// ----- Form validation -----
const form = document.getElementById('registerForm');
const fields = {
  name: document.getElementById('fieldName'),
  email: document.getElementById('fieldEmail'),
  password: document.getElementById('fieldPassword'),
  confirm: document.getElementById('fieldConfirm'),
  terms: document.getElementById('fieldTerms'),
};
const inputs = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  terms: document.getElementById('terms'),
};

function setError(fieldEl, message) {
  fieldEl.classList.add('error');
  const err = fieldEl.querySelector('.field__error');
  if (err) err.textContent = message;
}
function clearError(fieldEl) {
  fieldEl.classList.remove('error');
  const err = fieldEl.querySelector('.field__error');
  if (err) err.textContent = '';
}

// Clear error on input
['name', 'email', 'password', 'confirm'].forEach(k => {
  inputs[k]?.addEventListener('input', () => clearError(fields[k]));
});
inputs.terms?.addEventListener('change', () => clearError(fields.terms));

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Full name
  const name = inputs.name.value.trim();
  if (!name) {
    setError(fields.name, 'Full name is required');
    valid = false;
  } else if (name.length < 2) {
    setError(fields.name, 'Name must be at least 2 characters');
    valid = false;
  }

  // Email
  const email = inputs.email.value.trim();
  if (!email) {
    setError(fields.email, 'Email is required');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError(fields.email, 'Enter a valid email address');
    valid = false;
  }

  // Password
  const pwd = inputs.password.value;
  if (!pwd) {
    setError(fields.password, 'Password is required');
    valid = false;
  } else if (pwd.length < 6) {
    setError(fields.password, 'Password must be at least 6 characters');
    valid = false;
  } else if (scorePassword(pwd) < 2) {
    setError(fields.password, 'Password is too weak. Add uppercase, numbers or symbols.');
    valid = false;
  }

  // Confirm
  const confirm = inputs.confirm.value;
  if (!confirm) {
    setError(fields.confirm, 'Please confirm your password');
    valid = false;
  } else if (confirm !== pwd) {
    setError(fields.confirm, 'Passwords do not match');
    valid = false;
  }

  // Terms
  if (!inputs.terms.checked) {
    setError(fields.terms, 'You must accept the Terms and Privacy Policy');
    valid = false;
  }

  if (!valid) return;

  // Demo submit
  const btn = document.getElementById('registerBtn');
  btn.textContent = 'Creating account...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    window.location.href = 'login.html'; // real e account.html
  }, 1000);
});