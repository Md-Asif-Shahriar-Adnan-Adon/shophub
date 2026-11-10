/* ============ FORGOT PASSWORD PAGE SCRIPT ============ */

// ----- DOM -----
const form = document.getElementById('forgotForm');
const emailInput = document.getElementById('email');
const fieldEmail = document.getElementById('fieldEmail');
const sendBtn = document.getElementById('sendBtn');

const stateForm = document.getElementById('stateForm');
const stateSuccess = document.getElementById('stateSuccess');
const sentEmailEl = document.getElementById('sentEmail');

const resendBtn = document.getElementById('resendBtn');
const resendTimerEl = document.getElementById('resendTimer');
const changeEmailBtn = document.getElementById('changeEmailBtn');

let resendInterval = null;

// ----- Helpers -----
function setError(msg) {
  fieldEmail.classList.add('error');
  const err = fieldEmail.querySelector('.field__error');
  if (err) err.textContent = msg;
}
function clearError() {
  fieldEmail.classList.remove('error');
  const err = fieldEmail.querySelector('.field__error');
  if (err) err.textContent = '';
}

emailInput?.addEventListener('input', clearError);

// ----- Show success state -----
function showSuccess(email) {
  sentEmailEl.textContent = email;
  stateForm.classList.remove('active');
  stateSuccess.classList.add('active');
  startResendCooldown(60);
}

// ----- Back to form state -----
function showForm() {
  stateSuccess.classList.remove('active');
  stateForm.classList.add('active');
  // stop timer
  if (resendInterval) {
    clearInterval(resendInterval);
    resendInterval = null;
  }
  emailInput.focus();
}

// ----- Resend cooldown timer -----
function startResendCooldown(seconds) {
  resendBtn.disabled = true;
  resendTimerEl.textContent = seconds;

  if (resendInterval) clearInterval(resendInterval);

  resendInterval = setInterval(() => {
    seconds--;
    resendTimerEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(resendInterval);
      resendInterval = null;
      resendBtn.disabled = false;
      resendBtn.innerHTML = 'Resend email';
    }
  }, 1000);
}

// ----- Submit form -----
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  // Validation
  if (!email) {
    setError('Email is required');
    emailInput.focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('Enter a valid email address');
    emailInput.focus();
    return;
  }
  clearError();

  // Loading state
  sendBtn.textContent = 'Sending...';
  sendBtn.disabled = true;
  sendBtn.style.opacity = '0.7';

  // Demo delay — replace with real API call
  setTimeout(() => {
    showSuccess(email);
    sendBtn.textContent = 'Send Reset Link';
    sendBtn.disabled = false;
    sendBtn.style.opacity = '';
  }, 900);
});

// ----- Resend -----
resendBtn?.addEventListener('click', () => {
  if (resendBtn.disabled) return;
  resendBtn.textContent = 'Sending...';
  setTimeout(() => {
    resendBtn.innerHTML = 'Resend email (<span id="resendTimer">60</span>s)';
    // Rebind the timer span
    window.location; // no-op
    startResendCooldown(60);
  }, 700);
});

// ----- Change email (back to form) -----
changeEmailBtn?.addEventListener('click', showForm);