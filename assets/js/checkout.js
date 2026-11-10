/* ============ CHECKOUT PAGE SCRIPT ============ */

// Config
const TAX_RATE = 0.05;
const SUBTOTAL = 283.99;
let shippingCost = 0;
let currentStep = 1;

// DOM
const steps = document.querySelectorAll('.step');
const lines = document.querySelectorAll('.step__line');
const panels = document.querySelectorAll('.step-panel');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');

const formatMoney = n => '$' + n.toFixed(2);

// ----- Navigation -----
function goToStep(n) {
  currentStep = n;

  // Stepper
  steps.forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.toggle('active', sn === n);
    s.classList.toggle('completed', sn < n);
  });
  lines.forEach((l, i) => {
    l.classList.toggle('completed', i + 1 < n);
  });

  // Panels
  panels.forEach(p => {
    p.classList.toggle('active', p.id === `panel-${n}`);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.goto)));
});

// ----- Update totals -----
function updateTotals() {
  const tax = (SUBTOTAL + shippingCost) * TAX_RATE;
  const total = SUBTOTAL + shippingCost + tax;

  shippingEl.textContent = shippingCost === 0 ? 'Free' : formatMoney(shippingCost);
  taxEl.textContent = formatMoney(tax);
  totalEl.textContent = formatMoney(total);
}

// ----- Shipping selection -----
document.querySelectorAll('input[name="shipping"]').forEach(r => {
  r.addEventListener('change', () => {
    shippingCost = parseFloat(r.dataset.price) || 0;
    updateTotals();
  });
});

// ----- Validation helpers -----
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
  const err = field.querySelector('.field__error');
  if (err) err.textContent = '';
}
function bindClearOnInput(fieldId, inputId) {
  const inp = document.getElementById(inputId);
  if (inp) inp.addEventListener('input', () => clearError(fieldId));
}

// Address field clears
[
  ['f-fullname', 'fullname'],
  ['f-phone', 'phone'],
  ['f-email', 'email'],
  ['f-address', 'address'],
  ['f-city', 'city'],
  ['f-postal', 'postal'],
].forEach(([f, i]) => bindClearOnInput(f, i));

// ----- Address form submit -----
document.getElementById('addressForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fullname = document.getElementById('fullname').value.trim();
  if (!fullname) { setError('f-fullname', 'Name is required'); valid = false; }

  const phone = document.getElementById('phone').value.trim();
  if (!phone) { setError('f-phone', 'Phone is required'); valid = false; }
  else if (phone.replace(/\D/g, '').length < 10) {
    setError('f-phone', 'Enter a valid phone number'); valid = false;
  }

  const email = document.getElementById('email').value.trim();
  if (!email) { setError('f-email', 'Email is required'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('f-email', 'Invalid email format'); valid = false;
  }

  const address = document.getElementById('address').value.trim();
  if (!address) { setError('f-address', 'Address is required'); valid = false; }

  const city = document.getElementById('city').value.trim();
  if (!city) { setError('f-city', 'City is required'); valid = false; }

  const postal = document.getElementById('postal').value.trim();
  if (!postal) { setError('f-postal', 'Postal code is required'); valid = false; }

  if (!valid) return;
  goToStep(2);
});

// ----- Card fields formatting -----
const cardNum = document.getElementById('cardnum');
cardNum?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});

const expiry = document.getElementById('expiry');
expiry?.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  e.target.value = v;
});

const cvv = document.getElementById('cvv');
cvv?.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Card field clears
['f-cardnum', 'f-cardname', 'f-expiry', 'f-cvv'].forEach(f => {
  const inp = document.getElementById(f)?.querySelector('input');
  inp?.addEventListener('input', () => clearError(f));
});

// ----- Place order -----
document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
  const method = document.querySelector('input[name="payment"]:checked')?.value;
  let valid = true;

  if (method === 'card') {
    const num = cardNum.value.replace(/\s/g, '');
    if (num.length !== 16) { setError('f-cardnum', 'Enter a 16-digit card number'); valid = false; }

    const name = document.getElementById('cardname').value.trim();
    if (!name) { setError('f-cardname', 'Name on card is required'); valid = false; }

    const exp = expiry.value;
    if (!/^\d{2}\/\d{2}$/.test(exp)) { setError('f-expiry', 'Use MM/YY format'); valid = false; }

    const cvvVal = cvv.value;
    if (cvvVal.length < 3) { setError('f-cvv', 'CVV must be 3–4 digits'); valid = false; }
  }

  if (!valid) return;

  // Loading
  const btn = document.getElementById('placeOrderBtn');
  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    window.location.href = 'order-success.html';
  }, 1200);
});

// ----- Init -----
updateTotals();