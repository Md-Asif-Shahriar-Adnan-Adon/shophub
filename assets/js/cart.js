/* ============ CART PAGE SCRIPT ============ */

// Config
const SHIPPING_THRESHOLD = 50;   // free shipping over $50
const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.05;

// Coupons (demo)
const COUPONS = {
  'SAVE10':  { type: 'percent', value: 10, label: '10% off' },
  'SAVE20':  { type: 'percent', value: 20, label: '20% off' },
  'FLAT5':   { type: 'flat',    value: 5,  label: '$5 off' },
};

// State
let appliedCoupon = null;

// Elements
const cartItemsEl = document.getElementById('cartItems');
const summaryEl    = document.getElementById('summary');
const emptyEl      = document.getElementById('emptyCart');
const subtotalEl   = document.getElementById('subtotal');
const shippingEl   = document.getElementById('shipping');
const taxEl        = document.getElementById('tax');
const totalEl      = document.getElementById('total');
const subCountEl   = document.getElementById('subCount');
const itemCountEl  = document.getElementById('itemCount');
const discountRow  = document.getElementById('discountRow');
const discountEl   = document.getElementById('discount');
const couponInput  = document.getElementById('couponCode');
const couponBtn    = document.getElementById('applyCoupon');
const couponMsg    = document.getElementById('couponMsg');

// ----- Helpers -----
const formatMoney = n => '$' + n.toFixed(2);

function getCartItems() {
  return [...document.querySelectorAll('.cart-item')];
}

function getItemData(item) {
  const price = parseFloat(item.dataset.price) || 0;
  const qtyInput = item.querySelector('[data-qty-input]');
  const qty = parseInt(qtyInput.value) || 1;
  return { item, price, qty, lineTotal: price * qty };
}

// ----- Recalculate totals -----
function recalculate() {
  const items = getCartItems();
  const itemCount = items.length;

  if (itemCount === 0) {
    cartItemsEl.hidden = true;
    summaryEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  cartItemsEl.hidden = false;
  summaryEl.hidden = false;
  emptyEl.hidden = true;

  let subtotal = 0;
  let totalQty = 0;

  items.forEach(item => {
    const { lineTotal, qty } = getItemData(item);
    subtotal += lineTotal;
    totalQty += qty;

    const lineTotalEl = item.querySelector('[data-line-total]');
    if (lineTotalEl) lineTotalEl.textContent = formatMoney(lineTotal);
  });

  // Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'flat') {
      discount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Shipping
  const shipping = (subtotal - discount) >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // Tax
  const taxable = Math.max(subtotal - discount, 0);
  const tax = taxable * TAX_RATE;

  // Total
  const total = taxable + shipping + tax;

  // Update UI
  subtotalEl.textContent  = formatMoney(subtotal);
  shippingEl.textContent  = shipping === 0 ? 'Free' : formatMoney(shipping);
  taxEl.textContent       = formatMoney(tax);
  totalEl.textContent     = formatMoney(total);
  subCountEl.textContent  = totalQty;
  itemCountEl.textContent = itemCount;

  if (discount > 0) {
    discountRow.hidden = false;
    discountEl.textContent = '-' + formatMoney(discount);
  } else {
    discountRow.hidden = true;
  }
}

// ----- Qty buttons -----
document.querySelectorAll('.cart-item').forEach(item => {
  const qtyInput = item.querySelector('[data-qty-input]');
  item.querySelectorAll('.qty__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let v = parseInt(qtyInput.value) || 1;
      v += parseInt(btn.dataset.qty);
      if (v < 1) v = 1;
      if (v > 10) v = 10;
      qtyInput.value = v;
      recalculate();
    });
  });

  // Manual input change
  qtyInput.addEventListener('input', () => {
    let v = parseInt(qtyInput.value) || 1;
    if (v < 1) v = 1;
    if (v > 10) v = 10;
    qtyInput.value = v;
    recalculate();
  });

  // Remove
  const removeBtn = item.querySelector('.cart-item__remove');
  removeBtn?.addEventListener('click', () => {
    item.classList.add('removing');
    setTimeout(() => {
      item.remove();
      recalculate();
    }, 300);
  });
});

// ----- Coupon -----
couponBtn?.addEventListener('click', () => {
  const code = (couponInput.value || '').trim().toUpperCase();
  couponMsg.className = 'coupon__msg';

  if (!code) {
    couponMsg.textContent = 'Please enter a coupon code';
    couponMsg.classList.add('error');
    return;
  }

  if (COUPONS[code]) {
    appliedCoupon = COUPONS[code];
    couponMsg.textContent = `✓ Coupon applied: ${appliedCoupon.label}`;
    couponMsg.classList.add('success');
    couponInput.disabled = true;
    couponBtn.textContent = 'Remove';
    couponBtn.dataset.applied = 'true';
    recalculate();
  } else {
    couponMsg.textContent = 'Invalid coupon code';
    couponMsg.classList.add('error');
  }
});

// Toggle apply/remove
couponBtn?.addEventListener('click', (e) => {
  if (couponBtn.dataset.applied === 'true') {
    e.stopImmediatePropagation();
    appliedCoupon = null;
    couponInput.disabled = false;
    couponInput.value = '';
    couponBtn.textContent = 'Apply';
    delete couponBtn.dataset.applied;
    couponMsg.textContent = '';
    couponMsg.className = 'coupon__msg';
    recalculate();
  }
}, true);

// ----- Init -----
recalculate();