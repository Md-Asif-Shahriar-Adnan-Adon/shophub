/* ============ ORDER DETAIL PAGE SCRIPT ============ */

/**
 * Real app e order id URL theke niye API call korbe:
 *   /api/orders/:id
 *
 * Ekhon demo data (HTML e hard-coded).
 */

// ----- Read order id from URL -----
const params = new URLSearchParams(window.location.search);
const orderId = params.get('id') || 'SH-2026-48392';

// Update title + breadcrumb if URL param exists
if (params.get('id')) {
  document.title = `Order #${orderId} — ShopHub`;
  const crumb = document.querySelector('.breadcrumb strong');
  if (crumb) crumb.textContent = `#${orderId}`;
  const h1 = document.querySelector('.order-header h1');
  if (h1) h1.textContent = `Order #${orderId}`;
}

// ----- Download invoice (demo) -----
document.getElementById('invoiceBtn')?.addEventListener('click', function () {
  const original = this.innerHTML;
  this.innerHTML = 'Generating PDF...';
  this.disabled = true;

  setTimeout(() => {
    this.innerHTML = '✓ Downloaded';
    this.style.color = 'var(--success)';

    setTimeout(() => {
      this.innerHTML = original;
      this.style.color = '';
      this.disabled = false;
    }, 1400);

    // Real: trigger file download
    // window.location.href = `/api/orders/${orderId}/invoice.pdf`;
  }, 800);
});

// ----- Request return (demo) -----
document.getElementById('returnBtn')?.addEventListener('click', () => {
  const confirmed = confirm(
    'Request a return for this order?\n\n' +
    'You can return any item within 7 days of delivery. ' +
    'Our team will contact you within 24 hours.'
  );
  if (!confirmed) return;

  // Real app: redirect to return form
  // window.location.href = `return-request.html?id=${orderId}`;
  alert('Return request submitted! We\'ll email you shortly.');
});

// ----- Track package (demo) -----
document.querySelector('.tracking-info .btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Opening live tracking...\n\n(In real app, this opens carrier tracking page.)');
});