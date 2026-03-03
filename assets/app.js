/* =========================
   Data (products + images)
========================= */
const PRODUCTS = [
  {
    id: "p1",
    name: "2x4 SPF Stud (8ft)",
    price: 4.99,
    rating: 4.6,
    category: "framing",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Stacked_wood.jpg",
    deal: false,
    desc: "Standard SPF stud for framing projects. Contractor-ready stock.",
    specs: ["Size: 2x4", "Length: 8ft", "Grade: SPF", "Use: Framing"],
  },
  {
    id: "p2",   
    name: "2x6 SPF Stud (10ft)",
    price: 9.49,
    rating: 4.5,
    category: "framing",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Timber%20stack.jpg",
    deal: true,
    off: 10,
    desc: "2x6 framing lumber for structural and wall builds.",
    specs: ["Size: 2x6", "Length: 10ft", "Grade: SPF", "Use: Framing"],
  },
  {
    id: "p3",
    name: "Pressure Treated 2x4 (8ft)",
    price: 8.25,
    rating: 4.7,
    category: "treated",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Wooden%20planks%20stacked%20closeup.jpg",
    deal: true,
    off: 15,
    desc: "Pressure treated lumber for outdoor projects and ground contact use.",
    specs: ["Size: 2x4", "Length: 8ft", "Treatment: PT", "Use: Outdoor"],
  },
  {
    id: "p4",
    name: "3/4\" Plywood Sheet",
    price: 39.99,
    rating: 4.4,
    category: "plywood",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Plywood%20sheet.jpg",
    deal: false,
    desc: "Strong plywood sheet for subfloor, sheathing, and general builds.",
    specs: ["Thickness: 3/4\"", "Size: 4x8", "Type: Plywood", "Use: Sheathing"],
  },
  {
    id: "p5",
    name: "OSB Sheathing (7/16\")",
    price: 19.95,
    rating: 4.3,
    category: "plywood",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Oriented_strand_board.jpg",
    deal: true,
    off: 12,
    desc: "OSB panel for walls/roofs, cost effective and dependable.",
    specs: ["Thickness: 7/16\"", "Size: 4x8", "Type: OSB", "Use: Sheathing"],
  },
  {
    id: "p6",
    name: "2x8 SPF (12ft)",
    price: 18.75,
    rating: 4.5,
    category: "framing",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Stacked%20timber%20boards.jpg",
    deal: false,
    desc: "2x8 lumber for joists, beams, and heavier framing applications.",
    specs: ["Size: 2x8", "Length: 12ft", "Grade: SPF", "Use: Structural"],
  },
  {
    id: "p7",
    name: "Deck Board Treated (12ft)",
    price: 14.50,
    rating: 4.6,
    category: "treated",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Wood%20decking%20boards.jpg",
    deal: true,
    off: 8,
    desc: "Treated decking board for durable outdoor decks and steps.",
    specs: ["Length: 12ft", "Treatment: PT", "Use: Decking"],
  },
  {
    id: "p8",
    name: "2x10 SPF (12ft)",
    price: 24.99,
    rating: 4.4,
    category: "framing",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Wood%20boards%20stacked%20(Unsplash).jpg",
    deal: false,
    desc: "2x10 for joists and longer span framing needs.",
    specs: ["Size: 2x10", "Length: 12ft", "Grade: SPF", "Use: Structural"],
  },
];

const FEATURED_IDS = ["p1", "p2", "p3", "p4"];

/* =========================
   Helpers
========================= */
const money = (n) => `$${n.toFixed(2)}`;
const stars = (r) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

function getCart() {
  try { return JSON.parse(localStorage.getItem("lumber_cart") || "[]"); }
  catch { return []; }
}
function setCart(items) {
  localStorage.setItem("lumber_cart", JSON.stringify(items));
  updateCartBadge();
}
function cartCount(items = getCart()) {
  return items.reduce((sum, it) => sum + it.qty, 0);
}
function cartSubtotal(items = getCart()) {
  return items.reduce((sum, it) => {
    const p = PRODUCTS.find(x => x.id === it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
}

function updateCartBadge() {
  const el = qs("#cartCount");
  if (!el) return;
  el.textContent = String(cartCount());
}

function addToCart(id, qty = 1) {
  const items = getCart();
  const found = items.find(x => x.id === id);
  if (found) found.qty += qty;
  else items.push({ id, qty });
  setCart(items);
  renderCartDrawer(); // keep drawer synced
}

function changeQty(id, delta) {
  let items = getCart();
  const it = items.find(x => x.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) items = items.filter(x => x.id !== id);
  setCart(items);
  renderCartDrawer();
}

function removeItem(id) {
  const items = getCart().filter(x => x.id !== id);
  setCart(items);
  renderCartDrawer();
}

/* =========================
   Cart Drawer UI
========================= */
function openDrawer() {
  const d = qs("#cartDrawer");
  if (!d) return;
  d.classList.add("is-open");
  d.setAttribute("aria-hidden", "false");
  renderCartDrawer();
}
function closeDrawer() {
  const d = qs("#cartDrawer");
  if (!d) return;
  d.classList.remove("is-open");
  d.setAttribute("aria-hidden", "true");
}

function wireDrawer() {
  const openBtn = qs("#openCartBtn");
  const navCart = qs("#navCartLink");
  const closeBtn = qs("#closeCartBtn");
  const backdrop = qs("#drawerBackdrop");

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (navCart) navCart.addEventListener("click", (e) => { e.preventDefault(); openDrawer(); });
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

function renderCartDrawer() {
  const holder = qs("#cartItems");
  const subtotalEl = qs("#cartSubtotal");
  if (!holder || !subtotalEl) return;

  const items = getCart();
  holder.innerHTML = "";

  if (items.length === 0) {
    holder.innerHTML = `<div class="muted" style="padding:10px 0;">Cart is empty</div>`;
    subtotalEl.textContent = money(0);
    return;
  }

  for (const it of items) {
    const p = PRODUCTS.find(x => x.id === it.id);
    if (!p) continue;

    const row = document.createElement("div");
    row.className = "cartItem";
    row.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.name)}" />
      <div>
        <div class="cartItem__name">${escapeHtml(p.name)}</div>
        <div class="cartItem__meta">
          <div class="qty">
            <button data-act="dec" aria-label="Decrease">−</button>
            <span>${it.qty}</span>
            <button data-act="inc" aria-label="Increase">+</button>
          </div>
          <div style="font-weight:900;">${money(p.price * it.qty)}</div>
        </div>
        <button class="remove" data-act="rm">Remove</button>
      </div>
    `;
    row.querySelector('[data-act="dec"]').addEventListener("click", () => changeQty(p.id, -1));
    row.querySelector('[data-act="inc"]').addEventListener("click", () => changeQty(p.id, +1));
    row.querySelector('[data-act="rm"]').addEventListener("click", () => removeItem(p.id));

    holder.appendChild(row);
  }

  subtotalEl.textContent = money(cartSubtotal(items));
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   Product Card UI
========================= */
function productCard(p) {
  const dealBadge = p.deal ? `<span class="badge badge--deal">${p.off || 10}% OFF</span>` : "";
  return `
    <div class="productCard">
      <a class="productCard__img" href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" loading="lazy" />
      </a>
      <div class="productCard__body">
        <div class="productCard__name">${escapeHtml(p.name)} ${dealBadge}</div>
        <div class="productCard__meta">
          <span class="price">${money(p.price)}</span>
          <span class="stars" title="${p.rating}">${stars(p.rating)}</span>
        </div>
        <div class="actions">
          <button class="btn btn--blue" data-add="${p.id}">Add to Cart</button>
          <button class="btn btn--red" data-buy="${p.id}">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

function bindCardButtons(scope = document) {
  scope.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add, 1));
  });
  scope.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.buy, 1);
      window.location.href = "checkout.html";
    });
  });
}

/* =========================
   Home
========================= */
function renderFeatured() {
  bootCommon();

  const grid = qs("#featuredGrid");
  if (!grid) return;

  const featured = FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = featured.map(productCard).join("");
  bindCardButtons(grid);
}

/* =========================
   Products (paging + filters)
========================= */
let PAGE = 1;
const PER_PAGE = 12;

function initProductsPage(showDealsOnly) {
  bootCommon();

  const grid = qs("#productsGrid");
  const countLbl = qs("#countLbl");
  const pageLbl = qs("#pageLbl");
  const prev = qs("#prevPage");
  const next = qs("#nextPage");
  const catSelect = qs("#catSelect");
  const sortSelect = qs("#sortSelect");

  if (!grid) return;

  function getFiltered() {
    let list = PRODUCTS.slice();
    if (showDealsOnly) list = list.filter(p => p.deal);

    const cat = catSelect ? catSelect.value : "all";
    if (cat && cat !== "all") list = list.filter(p => p.category === cat);

    const q = (qs("#searchInput")?.value || "").trim().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    const s = sortSelect ? sortSelect.value : "featured";
    if (s === "low") list.sort((a,b) => a.price - b.price);
    if (s === "high") list.sort((a,b) => b.price - a.price);

    return list;
  }

  function render() {
    const list = getFiltered();
    if (countLbl) countLbl.textContent = String(list.length);

    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    PAGE = Math.min(PAGE, totalPages);

    const start = (PAGE - 1) * PER_PAGE;
    const slice = list.slice(start, start + PER_PAGE);

    grid.innerHTML = slice.map(productCard).join("");
    bindCardButtons(grid);

    if (pageLbl) pageLbl.textContent = `${PAGE} / ${totalPages}`;
    if (prev) prev.disabled = PAGE <= 1;
    if (next) next.disabled = PAGE >= totalPages;
  }

  if (prev) prev.addEventListener("click", () => { PAGE = Math.max(1, PAGE - 1); render(); });
  if (next) next.addEventListener("click", () => { PAGE = PAGE + 1; render(); });

  if (catSelect) catSelect.addEventListener("change", () => { PAGE = 1; render(); });
  if (sortSelect) sortSelect.addEventListener("change", () => { PAGE = 1; render(); });

  const searchBtn = qs("#searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", () => { PAGE = 1; render(); });

  render();
}

function renderDeals() {
  bootCommon();
  const grid = qs("#dealsGrid");
  if (!grid) return;

  const deals = PRODUCTS.filter(p => p.deal);
  grid.innerHTML = deals.map(productCard).join("");
  bindCardButtons(grid);
}

/* =========================
   Product detail
========================= */
function renderProductDetail() {
  bootCommon();

  const wrap = qs("#productView");
  if (!wrap) return;

  const id = new URLSearchParams(location.search).get("id") || "p1";
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  wrap.innerHTML = `
    <div class="pImg"><img src="${p.img}" alt="${escapeHtml(p.name)}" /></div>
    <div class="pInfo">
      <h2>${escapeHtml(p.name)}</h2>
      <div class="pRow">
        <span class="price">${money(p.price)}</span>
        <span class="stars">${stars(p.rating)}</span>
      </div>
      <div class="qtySel">
        <span class="muted" style="font-weight:900;">Qty</span>
        <input id="pdQty" type="number" min="1" value="1" />
      </div>
      <div class="pBtns">
        <button class="btn btn--blue" id="pdAdd">Add to Cart</button>
        <button class="btn btn--brown" id="pdBuy">Buy Now</button>
      </div>
      <div class="muted" style="margin-top:10px;line-height:1.5;">${escapeHtml(p.desc)}</div>
    </div>
  `;

  qs("#pdAdd")?.addEventListener("click", () => {
    const qty = Math.max(1, parseInt(qs("#pdQty")?.value || "1", 10));
    addToCart(p.id, qty);
  });

  qs("#pdBuy")?.addEventListener("click", () => {
    const qty = Math.max(1, parseInt(qs("#pdQty")?.value || "1", 10));
    addToCart(p.id, qty);
    location.href = "checkout.html";
  });

  // Tabs
  qs("#tab-desc").innerHTML = `<div style="line-height:1.6;">${escapeHtml(p.desc)}</div>`;
  qs("#tab-specs").innerHTML = `<ul class="bullets">${p.specs.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`;
  qs("#tab-reviews").innerHTML = `
    <div class="muted" style="line-height:1.6;">
      ★★★★★ Great quality • ★★★★ Fast delivery • ★★★★ Good pricing
    </div>
  `;

  qsa(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      qsa(".tab").forEach(x => x.classList.remove("is-active"));
      qsa(".tabPanel").forEach(x => x.classList.remove("is-active"));
      btn.classList.add("is-active");
      qs(`#tab-${btn.dataset.tab}`)?.classList.add("is-active");
    });
  });
}

/* =========================
   Checkout
========================= */
function renderCheckout() {
  bootCommon();

  const items = getCart();
  const holder = qs("#summaryItems");
  const total = qs("#summaryTotal");
  if (!holder || !total) return;

  if (items.length === 0) {
    holder.innerHTML = `<div class="muted">No items in cart.</div>`;
    total.textContent = money(0);
    return;
  }

  holder.innerHTML = items.map(it => {
    const p = PRODUCTS.find(x => x.id === it.id);
    if (!p) return "";
    return `
      <div class="sumRow">
        <div class="sumRow__left">
          <img src="${p.img}" alt="${escapeHtml(p.name)}" />
          <div>
            <div class="sumRow__name">${escapeHtml(p.name)}</div>
            <div class="muted">Qty: ${it.qty}</div>
          </div>
        </div>
        <div style="font-weight:900;">${money(p.price * it.qty)}</div>
      </div>
    `;
  }).join("");

  total.textContent = money(cartSubtotal(items));

  qs("#placeOrderBtn")?.addEventListener("click", () => {
    localStorage.removeItem("lumber_cart");
    updateCartBadge();
    alert("Order placed (demo).");
    location.href = "index.html";
  });

  qs("#checkoutPayBtn")?.addEventListener("click", () => {
    alert("Continue (demo).");
  });
}

/* =========================
   Common boot
========================= */
function bootCommon() {
  // year
  const y = qs("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // drawer
  wireDrawer();

  // badge
  updateCartBadge();

  // search enter key
  const si = qs("#searchInput");
  if (si) {
    si.addEventListener("keydown", (e) => {
      if (e.key === "Enter") qs("#searchBtn")?.click();
    });
  }
}

// expose functions used inline in HTML
window.renderFeatured = renderFeatured;
window.initProductsPage = initProductsPage;
window.renderDeals = renderDeals;
window.renderProductDetail = renderProductDetail;
window.renderCheckout = renderCheckout;

// auto sync cart UI on load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
