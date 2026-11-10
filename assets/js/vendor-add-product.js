/* ============ VENDOR ADD PRODUCT SCRIPT ============ */

// Image upload preview
const imgInput = document.getElementById('ap-images');
const imgGrid = document.getElementById('imageGrid');
let images = [];

imgInput?.addEventListener('change', (e) => {
  const files = [...e.target.files].slice(0, 5);
  files.forEach(file => {
    if (images.length >= 5) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const id = Date.now() + Math.random();
      images.push({ id, src: ev.target.result });
      renderImages();
    };
    reader.readAsDataURL(file);
  });
  imgInput.value = '';
});

function renderImages() {
  imgGrid.innerHTML = images.map(img => `
    <div class="image-thumb">
      <img src="${img.src}" alt="" />
      <button type="button" data-id="${img.id}">✕</button>
    </div>
  `).join('');
  imgGrid.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      images = images.filter(i => i.id != b.dataset.id);
      renderImages();
    });
  });
}

// Variants
const variantList = document.getElementById('variantList');
document.getElementById('addVariantBtn')?.addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'variant-row';
  row.innerHTML = `
    <input type="text" placeholder="Size (e.g. Large)" />
    <input type="text" placeholder="Color (e.g. Black)" />
    <input type="number" placeholder="Stock" min="0" />
    <button type="button" class="variant-remove">✕</button>
  `;
  row.querySelector('.variant-remove').addEventListener('click', () => row.remove());
  variantList.appendChild(row);
});

// Validation
function setErr(id, msg) {
  const f = document.getElementById('f-' + id);
  if (!f) return;
  f.classList.add('error');
  const e = f.querySelector('.field__error');
  if (e) e.textContent = msg;
}
function clearErr(id) {
  const f = document.getElementById('f-' + id);
  if (f) f.classList.remove('error');
}
['ap-name|name', 'ap-desc|desc', 'ap-price|price', 'ap-stock|stock'].forEach(pair => {
  const [i, f] = pair.split('|');
  document.getElementById(i)?.addEventListener('input', () => clearErr(f));
});
document.getElementById('ap-cat')?.addEventListener('change', () => clearErr('cat'));

// Submit
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('ap-name').value.trim();
  if (!name) { setErr('name', 'Product name required'); valid = false; }

  const cat = document.getElementById('ap-cat').value;
  if (!cat) { setErr('cat', 'Category required'); valid = false; }

  const desc = document.getElementById('ap-desc').value.trim();
  if (!desc) { setErr('desc', 'Description required'); valid = false; }

  const price = document.getElementById('ap-price').value;
  if (!price || parseFloat(price) <= 0) { setErr('price', 'Valid price required'); valid = false; }

  const stock = document.getElementById('ap-stock').value;
  if (stock === '' || parseInt(stock) < 0) { setErr('stock', 'Stock required'); valid = false; }

  if (!valid) {
    showVToast('Please fix errors before publishing');
    return;
  }

  const btn = document.getElementById('publishBtn');
  btn.textContent = 'Publishing...';
  btn.disabled = true;

  setTimeout(() => {
    showVToast('Product published successfully');
    setTimeout(() => window.location.href = 'products.html', 800);
  }, 900);
});

// Save draft
document.getElementById('saveDraftBtn')?.addEventListener('click', () => {
  showVToast('Saved as draft');
});