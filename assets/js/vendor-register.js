/* ============ VENDOR REGISTER SCRIPT ============ */

let currentStep = 1;

// ---------- Step navigation ----------
function goToStep(n) {
  if (n > 3) return;
  currentStep = n;
  document.querySelectorAll('.reg-panel').forEach(p => p.classList.remove('active'));
  if (n === 'success') {
    document.getElementById('rp-success').classList.add('active');
    document.querySelectorAll('.reg-step').forEach(s => s.classList.add('done'));
    document.querySelectorAll('.reg-line').forEach(l => l.classList.add('done'));
    return;
  }
  document.getElementById(`rp-${n}`).classList.add('active');
  document.querySelectorAll('.reg-step').forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done', sn < n);
  });
  document.querySelectorAll('.reg-line').forEach((l, i) => {
    l.classList.toggle('done', i + 1 < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.back)));
});

// ---------- Validation helpers ----------
function setError(id, msg) {
  const field = document.getElementById('f-' + id);
  if (!field) return;
  field.classList.add('error');
  const err = field.querySelector('.field__error');
  if (err) err.textContent = msg;
}
function clearError(id) {
  const field = document.getElementById('f-' + id);
  if (!field) return;
  field.classList.remove('error');
}
function bindClear(inputId, fieldId) {
  document.getElementById(inputId)?.addEventListener('input', () => clearError(fieldId));
}

['r-owner|owner', 'r-phone|phone', 'r-email|email', 'r-pass|pass', 'r-conf|conf',
 'r-shopname|shopname', 'r-desc|desc'].forEach(pair => {
  const [inp, fld] = pair.split('|');
  bindClear(inp, fld);
});
document.getElementById('r-cat')?.addEventListener('change', () => clearError('cat'));

// ---------- Step 1 submit ----------
document.getElementById('stepForm1')?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const owner = document.getElementById('r-owner').value.trim();
  if (!owner) { setError('owner', 'Name required'); valid = false; }

  const phone = document.getElementById('r-phone').value.trim();
  if (!phone) { setError('phone', 'Phone required'); valid = false; }
  else if (phone.replace(/\D/g, '').length < 10) { setError('phone', 'Invalid phone'); valid = false; }

  const email = document.getElementById('r-email').value.trim();
  if (!email) { setError('email', 'Email required'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Invalid email'); valid = false; }

  const pass = document.getElementById('r-pass').value;
  if (!pass) { setError('pass', 'Password required'); valid = false; }
  else if (pass.length < 6) { setError('pass', 'Min 6 characters'); valid = false; }

  const conf = document.getElementById('r-conf').value;
  if (!conf) { setError('conf', 'Confirm password'); valid = false; }
  else if (conf !== pass) { setError('conf', 'Passwords do not match'); valid = false; }

  if (!valid) return;
  goToStep(2);
});

// ---------- Step 2 submit ----------
document.getElementById('stepForm2')?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const shopname = document.getElementById('r-shopname').value.trim();
  if (!shopname) { setError('shopname', 'Shop name required'); valid = false; }

  const cat = document.getElementById('r-cat').value;
  if (!cat) { setError('cat', 'Please select category'); valid = false; }

  const desc = document.getElementById('r-desc').value.trim();
  if (!desc) { setError('desc', 'Description required'); valid = false; }

  if (!valid) return;
  goToStep(3);
});

// ---------- Upload feedback ----------
['r-nid', 'r-license'].forEach(id => {
  const inp = document.getElementById(id);
  const statusId = id === 'r-nid' ? 'status-nid' : 'status-license';
  inp?.addEventListener('change', () => {
    const f = inp.files[0];
    const el = document.getElementById(statusId);
    if (!el) return;
    el.textContent = f ? `✓ ${f.name} (${(f.size / 1024).toFixed(0)} KB)` : '';
  });
});

// ---------- Step 3 submit ----------
document.getElementById('stepForm3')?.addEventListener('submit', e => {
  e.preventDefault();
  const agree = document.getElementById('r-agree');
  const errAgree = document.getElementById('err-agree');

  if (!agree.checked) {
    errAgree.textContent = 'You must accept the terms';
    errAgree.style.display = 'block';
    return;
  }
  errAgree.style.display = 'none';

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  setTimeout(() => {
    const email = document.getElementById('r-email').value;
    document.getElementById('successEmail').textContent = email;
    goToStep('success');
  }, 1200);
});

document.getElementById('r-agree')?.addEventListener('change', () => {
  document.getElementById('err-agree').style.display = 'none';
});