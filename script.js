const PRODUCTS = [
  {id:1, title:'Wireless Headphones', price:79.99, category:'electronics', img:'image.png', desc:'Comfortable over-ear wireless headphones.'},
  {id:2, title:'Smartphone Stand', price:14.50, category:'electronics', img:'WhatsApp Image 2025-11-07 at 02.05.36_0c3a6861 copy.jpg', desc:'Adjustable, compact phone stand.'},
  {id:3, title:'Classic T-Shirt', price:19.99, category:'fashion', img:'WhatsApp Image 2025-11-07 at 02.05.36_5bf7d553.jpg', desc:'Soft cotton t-shirt.'},
  {id:4, title:'Running Shoes', price:59.95, category:'fashion', img:'WhatsApp Image 2025-11-07 at 02.05.35_1f2262a5.jpg', desc:'Lightweight running shoes.'},
  {id:5, title:'Moisturizing Cream', price:24.00, category:'skincare', img:'WhatsApp Image 2025-11-07 at 02.05.34_eabe752f.jpg', desc:'Daily moisturizing cream.'},
  {id:6, title:'Scented Candle', price:12.00, category:'homedecor', img:'WhatsApp Image 2025-11-07 at 10.46.24_ae239d1a.jpg', desc:'Vanilla scented candle.'},
  {id:7, title:'Desk Lamp', price:39.99, category:'homedecor', img:'WhatsApp Image 2025-11-07 at 02.05.35_1b0718d8.jpg', desc:'Adjustable LED desk lamp.'},
  {id:8, title:'Facial Serum', price:29.99, category:'skincare', img:'WhatsApp Image 2025-11-07 at 02.05.35_87e1cb5d.jpg', desc:'Brightening facial serum.'}
];

/* --- Cart helpers --- */
function getCart(){
  try { return JSON.parse(localStorage.getItem('alpha_cart') || '[]') }
  catch(e){ return [] }
}
function saveCart(cart){ localStorage.setItem('alpha_cart', JSON.stringify(cart)); updateCartCount(); }
function addToCart(productId, qty=1){
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found){ found.qty += qty } else { cart.push({id:productId, qty}) }
  saveCart(cart);
}
function removeFromCart(productId){
  const cart = getCart().filter(i=>i.id!==productId);
  saveCart(cart);
}
function setQty(productId, qty){
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found){ found.qty = Math.max(1, qty); saveCart(cart); }
}
function clearCart(){
  localStorage.removeItem('alpha_cart');
  updateCartCount();
}

/* --- Theme functions --- */
function getTheme(){ return localStorage.getItem('alpha_theme') || 'light' }
function applyTheme(){
  const t = getTheme();
  if(t==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
}
function toggleTheme(){
  const next = getTheme()==='dark' ? 'light' : 'dark';
  localStorage.setItem('alpha_theme', next);
  applyTheme();
}

/* --- UI updates --- */
function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cart-count').forEach(el=>el.textContent = count);
}
function updateYears(){
  const y = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = y;
  });
}

/* --- Featured products on homepage --- */
function renderFeatured(){
  const container = document.getElementById('featured-grid');
  if(!container) return;
  const featured = PRODUCTS.slice(0,4);
  container.innerHTML = '';
  for(const p of featured){
    const el = document.createElement('div');
    el.className = 'product-card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc}</p>
      <p><strong>₹${p.price.toFixed(2)}</strong></p>
      <button class="btn" data-id="${p.id}">Add to Cart</button>
    `;
    container.appendChild(el);
  }
}

/* --- All products on products.html --- */
function renderProducts(filter='all', sort='default'){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  let list = PRODUCTS.slice();
  if(filter!=='all') list = list.filter(p=>p.category===filter);
  if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = '';
  for(const p of list){
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc}</p>
      <p><strong>₹${p.price.toFixed(2)}</strong></p>
      <button class="btn add-btn" data-id="${p.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  }
}

/* --- Cart page --- */
function renderCartPage(){
  const el = document.getElementById('cart-items');
  if(!el) return;
  const cart = getCart();
  if(cart.length===0){
    el.innerHTML = '<p>Your cart is empty. <a href="products.html">Browse products</a>.</p>';
    document.getElementById('cart-summary').innerHTML='';
    return;
  }
  el.innerHTML = '';
  let total = 0;
  for(const item of cart){
    const prod = PRODUCTS.find(p=>p.id===item.id);
    if(!prod) continue;
    const subtotal = prod.price * item.qty;
    total += subtotal;
    const node = document.createElement('div');
    node.className = 'cart-item';
    node.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}">
      <div style="flex:1">
        <h3>${prod.title}</h3>
        <p class="muted">₹${prod.price.toFixed(2)} each</p>
        <label>Qty <input type="number" min="1" value="${item.qty}" data-id="${prod.id}" style="width:70px"></label>
      </div>
      <div style="text-align:right">
        <p><strong>₹${subtotal.toFixed(2)}</strong></p>
        <button class="btn" data-remove="${prod.id}">Remove</button>
      </div>
    `;
    el.appendChild(node);
  }
  document.getElementById('cart-summary').innerHTML = `
    <p><strong>Subtotal:</strong> ₹${total.toFixed(2)}</p>
    <p class="muted">Taxes and shipping calculated at checkout.</p>
  `;
}

/* --- Event handlers --- */
function attachGlobalListeners(){
  document.body.addEventListener('click', e=>{
    if(e.target.matches('.btn[data-id]')){
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
      alert('Added to cart!');
    }
    if(e.target.dataset.remove){
      removeFromCart(parseInt(e.target.dataset.remove));
      renderCartPage();
    }
  });

  document.body.addEventListener('change', e=>{
    if(e.target.matches('.cart-item input[type="number"]')){
      const id = parseInt(e.target.dataset.id);
      const val = parseInt(e.target.value);
      setQty(id, val);
      renderCartPage();
    }
  });

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('clear-cart')?.addEventListener('click', ()=>{ clearCart(); renderCartPage(); });
  document.getElementById('checkout')?.addEventListener('click', ()=>alert('Checkout not implemented yet'));
}

/* --- Initialization --- */
function initSite(){
  applyTheme();
  updateCartCount();
  updateYears();
  attachGlobalListeners();
  renderFeatured();
  renderProducts();
  renderCartPage();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initSite);
else initSite();

