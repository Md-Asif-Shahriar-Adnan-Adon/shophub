/* ============ ORDER SUCCESS PAGE SCRIPT ============ */

/**
 * Ei page real API theke data niye dynamic hobe.
 * Ekhon demo data (hard-coded HTML).
 *
 * Real integration:
 *   /api/orders/:id -> { orderId, total, deliveryDate, items, address }
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Read order id from URL -----
  const params = new URLSearchParams(window.location.search);
  const orderIdFromUrl = params.get('id');

  if (orderIdFromUrl) {
    // Format: SH-2026-xxxxx
    const orderIdEl = document.getElementById('orderId');
    if (orderIdEl) orderIdEl.textContent = '#SH-' + orderIdFromUrl;
  }

  // ----- Generate delivery date (5–7 days from now) -----
  const deliveryEl = document.getElementById('deliveryDate');
  if (deliveryEl && !deliveryEl.dataset.fixed) {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() + 5);
    const to = new Date(now);
    to.setDate(to.getDate() + 7);

    deliveryEl.textContent = formatRange(from, to);
  }
});

// Format "Nov 8 – Nov 10, 2026"
function formatRange(a, b) {
  const opts = { month: 'short', day: 'numeric' };
  const year = a.getFullYear();
  return `${a.toLocaleDateString('en-US', opts)} – ${b.toLocaleDateString('en-US', opts)}, ${year}`;
}

// Confetti-lite effect (optional)
// Uncomment and add confetti lib if you want that extra flair
/*
window.addEventListener('load', () => {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B']
    });
  }
});
*/