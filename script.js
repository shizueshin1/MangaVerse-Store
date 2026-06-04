/* ============================================================
   MangaVerse — script.js
   All store logic: products, cart, filters, modals, reviews
   ============================================================ */

// ── SVG MANGA COVER GENERATOR ─────────────────────────────────
/**
 * Generates a rich SVG manga book cover with:
 * - Dark gradient background with decorative halftone pattern
 * - Colored side spine stripe
 * - Large icon/symbol centrepiece
 * - Bold title lettering
 * - Author and genre label
 */
function makeCover(icon, bgDark, accent, highlight, title, author, genreLabel) {
  const lines = title.split('\n');
  const titleY = lines.length === 1 ? 195 : 185;
  const titleRows = lines.map((l, i) =>
    `<text x="100" y="${titleY + i * 28}" text-anchor="middle"
      font-family="'Cinzel','Georgia',serif" font-size="22"
      font-weight="900" fill="${highlight}"
      stroke="${bgDark}" stroke-width="3" paint-order="stroke">${l}</text>`
  ).join('');

  // Decorative halftone circles in background
  let dots = '';
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 5; c++) {
      dots += `<circle cx="${15 + c * 45}" cy="${10 + r * 45}" r="3" fill="${accent}" opacity="0.12"/>`;
    }
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 290" width="200" height="290">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bgDark}"/>
      <stop offset="60%" stop-color="${bgDark}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="spine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${highlight}"/>
    </linearGradient>
    <linearGradient id="iconGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${highlight}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="200" height="290" fill="url(#bg)"/>
  ${dots}

  <!-- Corner decorative lines -->
  <line x1="8" y1="8" x2="30" y2="8" stroke="${accent}" stroke-width="2"/>
  <line x1="8" y1="8" x2="8" y2="30" stroke="${accent}" stroke-width="2"/>
  <line x1="192" y1="8" x2="170" y2="8" stroke="${accent}" stroke-width="2"/>
  <line x1="192" y1="8" x2="192" y2="30" stroke="${accent}" stroke-width="2"/>
  <line x1="8" y1="282" x2="30" y2="282" stroke="${accent}" stroke-width="2"/>
  <line x1="8" y1="282" x2="8" y2="260" stroke="${accent}" stroke-width="2"/>
  <line x1="192" y1="282" x2="170" y2="282" stroke="${accent}" stroke-width="2"/>
  <line x1="192" y1="282" x2="192" y2="260" stroke="${accent}" stroke-width="2"/>

  <!-- Left spine stripe -->
  <rect x="0" y="0" width="6" height="290" fill="url(#spine)"/>

  <!-- Genre badge top -->
  <rect x="14" y="14" width="70" height="18" rx="9" fill="${accent}" opacity="0.9"/>
  <text x="49" y="26.5" text-anchor="middle" font-family="'Rajdhani','Arial',sans-serif"
    font-size="9" font-weight="700" fill="#000" letter-spacing="1.5">${genreLabel}</text>

  <!-- Icon glow circle -->
  <circle cx="100" cy="125" r="62" fill="url(#iconGlow)"/>
  <circle cx="100" cy="125" r="58" fill="none" stroke="${accent}" stroke-width="1" opacity="0.4"/>
  <circle cx="100" cy="125" r="50" fill="none" stroke="${highlight}" stroke-width="0.5" opacity="0.3"/>

  <!-- Central icon -->
  <text x="100" y="148" text-anchor="middle" font-size="72" filter="url(#glow)">${icon}</text>

  <!-- Divider line -->
  <line x1="20" y1="168" x2="180" y2="168" stroke="${accent}" stroke-width="1" opacity="0.6"/>

  <!-- Title -->
  ${titleRows}

  <!-- Author byline -->
  <text x="100" y="${titleY + lines.length * 28 + 12}" text-anchor="middle"
    font-family="'Rajdhani','Arial',sans-serif" font-size="10" fill="${accent}" letter-spacing="1.5"
    opacity="0.85">${author.toUpperCase()}</text>

  <!-- Bottom bar -->
  <rect x="0" y="278" width="200" height="12" fill="${accent}" opacity="0.7"/>
  <text x="100" y="287" text-anchor="middle" font-family="'Rajdhani','Arial',sans-serif"
    font-size="7" fill="${bgDark}" font-weight="700" letter-spacing="2">MANGAVERSE • VOL. 1</text>
</svg>`)}` ;
}

// ── PRODUCT DATA ──────────────────────────────────────────────
// localImage: AI-generated cover art (local file).
// image: Wikipedia/Wikimedia Commons fallback URL.
// coverArt: SVG-based manga cover shown if both images fail.
const PRODUCTS = [
  {
    id: 1,
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    genre: 'shonen',
    localImage: 'images/demon_slayer.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg',
    coverArt: makeCover('⚔️','#1a0a2e','#ff6b35','#ffd700','DEMON\nSLAYER','Koyoharu Gotouge','SHŌNEN'),
    price: 299,
    desc: 'Tanjiro Kamado sets off on a perilous journey to find a cure for his sister, who was turned into a demon after a brutal attack.',
    rating: 4.9,
    reviews: [
      { name: 'Rico',  stars: 5, text: 'Absolute masterpiece. The art is stunning.' },
      { name: 'Mika',  stars: 5, text: 'Cried at the end of every arc. 10/10.' }
    ]
  },
  {
    id: 2,
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    genre: 'seinen',
    localImage: 'images/attack_on_titan.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_kyojin_manga_volume_1.jpg',
    coverArt: makeCover('🏰','#0d1b2a','#8b0000','#c0c0c0','ATTACK\nON TITAN','Hajime Isayama','SEINEN'),
    price: 349,
    desc: 'Humanity lives inside enormous walled cities to protect themselves from the Titans — gigantic humanoid beings who devour humans for no apparent reason.',
    rating: 4.8,
    reviews: [
      { name: 'Alex', stars: 5, text: 'The best manga ever written. Period.' },
      { name: 'Jo',   stars: 4, text: 'Complex and brutal. A true masterpiece.' }
    ]
  },
  {
    id: 3,
    title: 'Fruits Basket',
    author: 'Natsuki Takaya',
    genre: 'shojo',
    localImage: 'images/fruits_basket.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Fruits_basket_vol1_tokyopop.jpg',
    coverArt: makeCover('🌸','#2d0028','#ff85b3','#ffe0f0','FRUITS\nBASKET','Natsuki Takaya','SHŌJO'),
    price: 279,
    desc: 'Tohru Honda discovers that her new friends are possessed by the Chinese Zodiac animals — and a family secret that changes everything.',
    rating: 4.7,
    reviews: [
      { name: 'Claire', stars: 5, text: 'So emotional and beautifully written.' }
    ]
  },
  {
    id: 4,
    title: 'Re:Zero',
    author: 'Tappei Nagatsuki',
    genre: 'isekai',
    localImage: 'images/rezero.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/94/ReZero_kara_Hajimeru_Isekai_Seikatsu_volume_1_cover.jpg',
    coverArt: makeCover('🌀','#050a30','#5b8af0','#a0c4ff','RE:ZERO','Tappei Nagatsuki','ISEKAI'),
    price: 319,
    desc: 'Subaru Natsuki is suddenly summoned to another world with the ability to return from death. But with each death comes suffering and heartbreak.',
    rating: 4.6,
    reviews: [
      { name: 'Karl', stars: 4, text: 'Dark and gripping. Cannot put it down.' }
    ]
  },
  {
    id: 5,
    title: 'Junji Ito Collection',
    author: 'Junji Ito',
    genre: 'horror',
    localImage: 'images/junji_ito_collection.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Junji_Ito%27s_Cat_Diary_cover.jpg',
    coverArt: makeCover('👁️','#0a0008','#3d0000','#ff2020','JUNJI ITO\nCOLLECTION','Junji Ito','HORROR'),
    price: 399,
    desc: 'A compilation of the most terrifying tales from the master of horror manga. Not for the faint of heart.',
    rating: 4.9,
    reviews: [
      { name: 'Sam', stars: 5, text: 'Hauntingly beautiful and deeply disturbing.' }
    ]
  },
  {
    id: 6,
    title: 'Haikyuu!!',
    author: 'Haruichi Furudate',
    genre: 'sports',
    localImage: 'images/haikyuu.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/6/60/Haikyu%21%21_Volume_1.jpg',
    coverArt: makeCover('🏐','#1a0d00','#ff6600','#ffcc00','HAIKYUU!!','Haruichi Furudate','SPORTS'),
    price: 289,
    desc: 'Hinata Shoyo, inspired by a legendary volleyball player, joins his high school team and aims to become the best despite his short stature.',
    rating: 4.8,
    reviews: [
      { name: 'Yuki', stars: 5, text: 'Makes you want to play volleyball immediately!' }
    ]
  },
  {
    id: 7,
    title: 'Berserk',
    author: 'Kentaro Miura',
    genre: 'seinen',
    localImage: 'images/berserk.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/98/Berserk_v1.jpg',
    coverArt: makeCover('🗡️','#080808','#1a1a1a','#b22222','BERSERK','Kentaro Miura','SEINEN'),
    price: 449,
    desc: 'Guts, a lone mercenary, joins the Band of the Hawk led by the charismatic Griffith in a dark medieval fantasy world of war and supernatural forces.',
    rating: 5.0,
    reviews: [
      { name: 'Leon', stars: 5, text: 'The greatest manga ever drawn. Legendary art.' }
    ]
  },
  {
    id: 8,
    title: 'Sword Art Online',
    author: 'Reki Kawahara',
    genre: 'isekai',
    localImage: 'images/sword_art_online.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Sword_Art_Online_manga_vol_1.jpg',
    coverArt: makeCover('🎮','#000820','#00ccff','#0066ff','SWORD ART\nONLINE','Reki Kawahara','ISEKAI'),
    price: 309,
    desc: 'Kirito and thousands of players are trapped inside a virtual reality MMORPG where dying in the game means dying in real life.',
    rating: 4.4,
    reviews: [
      { name: 'Aria', stars: 4, text: 'Great concept and action sequences!' }
    ]
  },
  {
    id: 9,
    title: 'Cardcaptor Sakura',
    author: 'CLAMP',
    genre: 'shojo',
    localImage: 'images/cardcaptor_sakura.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/5/57/CCS_manga_vol1.jpg',
    coverArt: makeCover('🃏','#1a0033','#cc66ff','#ffccff','CARDCAPTOR\nSAKURA','CLAMP','SHŌJO'),
    price: 269,
    desc: 'Sakura accidentally releases magical cards and must recapture them all before disaster strikes — with the help of her guardian Keroberos.',
    rating: 4.7,
    reviews: [
      { name: 'Lena', stars: 5, text: 'Timeless and charming. A classic shōjo.' }
    ]
  },
  {
    id: 10,
    title: 'Chainsaw Man',
    author: 'Tatsuki Fujimoto',
    genre: 'shonen',
    localImage: 'images/chainsaw_man.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Chainsawman_vol01.jpg',
    coverArt: makeCover('🪚','#1a0000','#cc0000','#ff8800','CHAINSAW\nMAN','Tatsuki Fujimoto','SHŌNEN'),
    price: 329,
    desc: 'Denji, a broke young man with a chainsaw devil as his companion, becomes a devil hunter after merging with his partner Pochita.',
    rating: 4.8,
    reviews: [
      { name: 'Nico', stars: 5, text: 'Wildly creative and unpredictably good.' }
    ]
  },
  {
    id: 11,
    title: 'Uzumaki',
    author: 'Junji Ito',
    genre: 'horror',
    localImage: 'images/uzumaki.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Uzumaki_volume_1.jpg',
    coverArt: makeCover('🌀','#050505','#1a1a1a','#888888','UZUMAKI','Junji Ito','HORROR'),
    price: 379,
    desc: 'A small town is gradually overtaken by a supernatural obsession with spirals, driving its inhabitants to madness and gruesome fates.',
    rating: 4.9,
    reviews: [
      { name: 'Dana', stars: 5, text: 'The most unsettling manga I have ever read.' }
    ]
  },
  {
    id: 12,
    title: 'Yona of the Dawn',
    author: 'Mizuho Kusanagi',
    genre: 'fantasy',
    localImage: 'images/yona_of_the_dawn.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Akatsuki_no_Yona_volume_1_cover.jpg',
    coverArt: makeCover('👑','#1a0a00','#cc6600','#ffaa00','YONA OF\nTHE DAWN','Mizuho Kusanagi','FANTASY'),
    price: 289,
    desc: 'Princess Yona is forced to flee her kingdom after a traumatic betrayal and embarks on a journey to reclaim her throne and her destiny.',
    rating: 4.6,
    reviews: [
      { name: 'Petra', stars: 5, text: 'Strong female lead and beautiful art.' }
    ]
  },
  {
    id: 13,
    title: 'Blue Period',
    author: 'Tsubasa Yamaguchi',
    genre: 'seinen',
    localImage: 'images/blue_period.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/7/77/Blue_Period_volume_1_cover.jpg',
    coverArt: makeCover('🎨','#000d1a','#0055cc','#66aaff','BLUE\nPERIOD','Tsubasa Yamaguchi','SEINEN'),
    price: 299,
    desc: 'A delinquent student discovers a passion for art and dedicates himself to the grueling path of entering Japan\'s most prestigious art university.',
    rating: 4.7,
    reviews: []
  },
  {
    id: 14,
    title: 'Ao Haru Ride',
    author: 'Io Sakisaka',
    genre: 'romance',
    localImage: 'images/ao_haru_ride.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4e/AoHaruRide_volume1_cover.jpg',
    coverArt: makeCover('💙','#001a33','#3399ff','#99ccff','AO HARU\nRIDE','Io Sakisaka','ROMANCE'),
    price: 259,
    desc: 'Futaba reunites with her first love after years apart, only to find he has changed completely — yet feelings from the past refuse to stay buried.',
    rating: 4.5,
    reviews: [
      { name: 'Mia', stars: 5, text: 'A perfect, heartfelt romance manga.' }
    ]
  },
  {
    id: 15,
    title: 'The Promised Neverland',
    author: 'Kaiu Shirai',
    genre: 'shonen',
    localImage: 'images/the_promised_neverland.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/6/6d/ThePromisedNeverland_vol1.jpg',
    coverArt: makeCover('🌿','#001a00','#006600','#99ff99','THE PROMISED\nNEVERLAND','Kaiu Shirai','SHŌNEN'),
    price: 309,
    desc: 'Orphans at an idyllic orphanage discover a horrifying truth about their home and must plan an escape before it is too late.',
    rating: 4.8,
    reviews: [
      { name: 'Tom', stars: 5, text: 'Thrilling from the very first chapter.' }
    ]
  },
  {
    id: 16,
    title: "Frieren: Beyond Journey's End",
    author: 'Kanehito Yamada',
    genre: 'fantasy',
    localImage: 'images/frieren.png',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Frieren_-_Beyond_Journey%27s_End_Volume_1.jpg',
    coverArt: makeCover('🌟','#0a0a1a','#9966cc','#ddccff',"FRIEREN:\nJOURNEY'S END",'Kanehito Yamada','FANTASY'),
    price: 339,
    desc: 'An elven mage who barely knew her companions in their lifetime now walks the world to understand what it means to be human — decades after their deaths.',
    rating: 5.0,
    reviews: [
      { name: 'Ella', stars: 5, text: 'Emotionally beautiful. Unlike anything else.' }
    ]
  }
];


// ── STATE ─────────────────────────────────────────────────────
let cart           = JSON.parse(localStorage.getItem('mv_cart')    || '[]');
let productReviews = JSON.parse(localStorage.getItem('mv_reviews') || '{}');
let users          = JSON.parse(localStorage.getItem('mv_users')    || '[]');
let session        = JSON.parse(localStorage.getItem('mv_session')  || 'null');
let orders         = JSON.parse(localStorage.getItem('mv_orders')   || '[]');
let currentFilter  = 'all';
let currentSearch  = '';
let currentProductId = null;
let reviewStar     = 0;


// ── PERSISTENCE ───────────────────────────────────────────────
function saveCart()    { localStorage.setItem('mv_cart',    JSON.stringify(cart)); }
function saveReviews() { localStorage.setItem('mv_reviews', JSON.stringify(productReviews)); }
function saveUsers()   { localStorage.setItem('mv_users',   JSON.stringify(users)); }
function saveSession() { localStorage.setItem('mv_session', JSON.stringify(session)); }
function saveOrders()  { localStorage.setItem('mv_orders',   JSON.stringify(orders)); }


// ── COVER IMAGE HELPERS ───────────────────────────────────────
/**
 * Global fallback handler for manga covers.
 * First try: Local image is loaded.
 * Second try (if fails): Falls back to remote Wikipedia URL.
 * Third try (if Wikipedia fails or blocks): Hides the img tag completely,
 * allowing the procedurally generated SVG cover positioned behind it to show.
 */
function handleImageError(img, fallbackSrc) {
  if (fallbackSrc && img.src !== fallbackSrc && !img.src.endsWith(fallbackSrc)) {
    img.src = fallbackSrc;
  } else {
    img.style.display = 'none';
  }
}

function coverHTML(p, cssClass = '') {
  if (!p.localImage && !p.image) {
    return `<div class="cover-fallback svg-cover" style="display:flex; background-image:url('${p.coverArt}')"></div>`;
  }
  const localImg = p.localImage || p.image;
  return `
    <img
      src="${localImg}"
      alt="${p.title}"
      class="cover-img ${cssClass}"
      loading="lazy"
      onerror="handleImageError(this, '${p.image}')"
    >
    <div class="cover-fallback svg-cover" style="background-image:url('${p.coverArt}')"></div>
  `;
}


// ── FILTER & SEARCH ───────────────────────────────────────────
function filterProducts() {
  currentSearch = document.getElementById('searchInput').value.toLowerCase();
  renderGrid();
}

function setFilter(genre, btn) {
  currentFilter = genre;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const labels = {
    all: 'All Titles', shonen: 'Shōnen', shojo: 'Shōjo',
    seinen: 'Seinen', isekai: 'Isekai', horror: 'Horror',
    sports: 'Sports', romance: 'Romance', fantasy: 'Fantasy'
  };
  document.getElementById('sectionTitle').textContent = labels[genre] || 'All Titles';
  renderGrid();
}


// ── RENDER PRODUCT GRID ───────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('productGrid');

  const filtered = PRODUCTS.filter(p => {
    const matchGenre  = currentFilter === 'all' || p.genre === currentFilter;
    const matchSearch = !currentSearch
      || p.title.toLowerCase().includes(currentSearch)
      || p.author.toLowerCase().includes(currentSearch)
      || p.genre.toLowerCase().includes(currentSearch);
    return matchGenre && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results">No titles found. Try a different search or filter.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const allRevs  = [...p.reviews, ...(productReviews[p.id] || [])];
    const avgRating = allRevs.length
      ? (allRevs.reduce((s, r) => s + r.stars, 0) / allRevs.length).toFixed(1)
      : p.rating.toFixed(1);

    return `
      <div class="product-card" onclick="openModal(${p.id})">
        <div class="product-cover">
          ${coverHTML(p)}
          <div class="genre-badge">${p.genre}</div>
          <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWish(this)">♡</button>
        </div>
        <div class="product-info">
          <div class="product-title">${p.title}</div>
          <div class="product-author">${p.author}</div>
          <div class="product-rating">
            <span class="stars">${renderStars(parseFloat(avgRating))}</span>
            <span class="rating-count">(${allRevs.length})</span>
          </div>
          <div class="product-footer">
            <span class="product-price">₱${p.price}</span>
            <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">+ Cart</button>
          </div>
        </div>
      </div>`;
  }).join('');
}


// ── UTILITY: STAR RENDERER ────────────────────────────────────
function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? '★' : '☆').join('');
}


// ── WISHLIST ──────────────────────────────────────────────────
function toggleWish(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
}


// ── CART ──────────────────────────────────────────────────────
function addToCart(id, closeModalAfter = false) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });

  saveCart();
  updateCartBadge();
  showToast(`${p.title} added to cart!`);
  if (closeModalAfter) closeModal();
}

function addFromModal() {
  if (currentProductId) addToCart(currentProductId, true);
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function changeQty(id, delta) {
  const idx = cart.findIndex(x => x.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}


// ── PRODUCT DETAIL MODAL ──────────────────────────────────────
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentProductId = id;
  reviewStar = 0;

  // Populate cover
  const coverEl = document.getElementById('modalCover');
  if (!p.localImage && !p.image) {
    coverEl.innerHTML = `<div class="cover-fallback svg-cover" style="display:flex; width:100%; height:100%; background-image:url('${p.coverArt}')"></div>`;
  } else {
    const modalImgSrc = p.localImage || p.image;
    coverEl.innerHTML = `
      <img
        src="${modalImgSrc}"
        alt="${p.title}"
        style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"
        onerror="handleImageError(this, '${p.image}')"
      >
      <div class="cover-fallback svg-cover" style="background-image:url('${p.coverArt}')"></div>
    `;
  }

  // Populate text fields
  document.getElementById('modalGenre').textContent  = p.genre.toUpperCase();
  document.getElementById('modalTitle').textContent  = p.title;
  document.getElementById('modalAuthor').textContent = 'by ' + p.author;
  document.getElementById('modalDesc').textContent   = p.desc;
  document.getElementById('modalPrice').textContent  = '₱' + p.price;

  // Rating
  const allRevs = [...p.reviews, ...(productReviews[p.id] || [])];
  const avg = allRevs.length
    ? (allRevs.reduce((s, r) => s + r.stars, 0) / allRevs.length).toFixed(1)
    : p.rating.toFixed(1);

  document.getElementById('modalStars').textContent       = renderStars(parseFloat(avg));
  document.getElementById('modalRatingCount').textContent = `${avg} (${allRevs.length} reviews)`;

  // Reviews
  renderReviews(id);
  updateStarUI();
  document.getElementById('reviewName').value = '';
  updateReviewsPreFill();
  document.getElementById('reviewText').value = '';

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentProductId = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}


// ── REVIEWS ───────────────────────────────────────────────────
function renderReviews(id) {
  const p    = PRODUCTS.find(x => x.id === id);
  const all  = [...(p.reviews || []), ...(productReviews[id] || [])];
  const list = document.getElementById('reviewList');

  if (!all.length) {
    list.innerHTML = '<div style="color:var(--text-muted);font-size:0.82rem;font-family:var(--font-heading);letter-spacing:1px">No reviews yet. Be the first!</div>';
    return;
  }

  list.innerHTML = all.slice().reverse().map(r => `
    <div class="review-item">
      <div class="review-header">
        <span class="reviewer-name">${r.name}</span>
        <span class="review-stars">${renderStars(r.stars)}</span>
      </div>
      <div class="review-text">${r.text}</div>
    </div>`).join('');
}

function setReviewStar(n) {
  reviewStar = n;
  updateStarUI();
}

function updateStarUI() {
  document.querySelectorAll('#starSelect span').forEach((s, i) => {
    s.classList.toggle('lit', i < reviewStar);
  });
}

function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name || !text || !reviewStar) {
    showToast('Please fill all fields and select a star rating.');
    return;
  }

  if (!productReviews[currentProductId]) productReviews[currentProductId] = [];
  productReviews[currentProductId].push({ name, stars: reviewStar, text });
  saveReviews();

  document.getElementById('reviewName').value = '';
  document.getElementById('reviewText').value = '';
  reviewStar = 0;
  updateStarUI();
  renderReviews(currentProductId);
  renderGrid();
  showToast('Review posted! ⭐');
}


// ── CART DRAWER ───────────────────────────────────────────────
function openCart() {
  renderCartDrawer();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const container = document.getElementById('cartItems');
  const footer    = document.getElementById('cartFooter');

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">📦</div><div>Your cart is empty</div></div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'flex';
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    const thumbHTML = (!p.localImage && !p.image)
      ? `<div class="thumb-fallback svg-cover" style="display:flex; width:100%; height:100%; background-image:url('${p.coverArt}')"></div>`
      : `
        <img
          src="${p.localImage || p.image}"
          alt="${p.title}"
          onerror="handleImageError(this, '${p.image}')"
        >
        <div class="thumb-fallback svg-cover" style="background-image:url('${p.coverArt}')"></div>
      `;
    return `
      <div class="cart-item">
        <div class="cart-item-thumb">
          ${thumbHTML}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${p.title}</div>
          <div class="cart-item-price">₱${(p.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},  1)">+</button>
        </div>
      </div>`;
  }).join('');


  const total = getCartTotal();
  document.getElementById('cartTotal').textContent = '₱' + total.toLocaleString();
  document.getElementById('ckTotal').textContent   = '₱' + total.toLocaleString();
}

function getCartTotal() {
  return cart.reduce((s, i) => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}


// ── CHECKOUT ──────────────────────────────────────────────────
function openCheckout() {
  // Require login before checkout
  if (!session) {
    closeCart();
    openAuthModal();
    showToast('Please log in to proceed to checkout. 🔐');
    return;
  }
  closeCart();
  document.getElementById('checkoutForm').style.display  = 'block';
  document.getElementById('orderSuccess').style.display  = 'none';
  document.getElementById('ckTotal').textContent = '₱' + getCartTotal().toLocaleString();
  updateCheckoutPreFill();
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleCheckoutOverlay(e) {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
}

function placeOrder() {
  const name     = document.getElementById('ckName').value.trim();
  const email    = document.getElementById('ckEmail').value.trim();
  const address  = document.getElementById('ckAddress').value.trim();
  const province = document.getElementById('ckProvince') ? document.getElementById('ckProvince').value.trim() : '';
  const zip      = document.getElementById('ckZip') ? document.getElementById('ckZip').value.trim() : '';
  const payment  = document.getElementById('ckPayment').value;

  if (!name || !email || !address || !payment) {
    showToast('Please fill in all fields.');
    return;
  }

  // Create order items array
  const orderItems = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return {
      id: item.id,
      qty: item.qty,
      price: p.price,
      title: p.title,
      localImage: p.localImage,
      image: p.image,
      coverArt: p.coverArt
    };
  });

  const fullAddress = [address, province, zip].filter(Boolean).join(', ');

  const newOrder = {
    id: 'MV-' + Math.floor(100000 + Math.random() * 900000),
    userEmail: session ? session.email.toLowerCase() : email.toLowerCase(),
    name,
    email: email.toLowerCase(),
    address: fullAddress,
    payment,
    date: new Date().toISOString(),
    items: orderItems,
    total: getCartTotal(),
    status: 'Processing'
  };

  orders.push(newOrder);
  saveOrders();

  cart = [];
  saveCart();
  updateCartBadge();

  document.getElementById('checkoutForm').style.display = 'none';
  document.getElementById('orderSuccess').style.display = 'block';
  renderGrid();
}



// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}


// ── AUTHENTICATION ────────────────────────────────────────────
function openAuthModal() {
  document.getElementById('authOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchAuthTab('login');
}

function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleAuthOverlay(e) {
  if (e.target === document.getElementById('authOverlay')) closeAuthModal();
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const formLogin = document.getElementById('loginForm');
  const formRegister = document.getElementById('registerForm');
  
  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    formLogin.style.display = 'none';
    formRegister.style.display = 'block';
  }
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  if (!session) {
    openAuthModal();
    return;
  }
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('open');
}

window.addEventListener('click', function(e) {
  const dropdown = document.getElementById('userDropdown');
  const navUser = document.getElementById('navUserContainer');
  if (dropdown && dropdown.classList.contains('open') && navUser && !navUser.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

function updateAuthNav() {
  const btnAuth = document.getElementById('btnAuth');
  const dropdownHeader = document.getElementById('dropdownHeader');
  if (session) {
    btnAuth.textContent = `👤 ${session.name.split(' ')[0]}`;
    dropdownHeader.textContent = `Hi, ${session.name}`;
  } else {
    btnAuth.textContent = '👤 Login';
    dropdownHeader.textContent = 'Hi, Guest';
  }
}

function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  if (!name || !email || !password || !confirmPassword) {
    showToast('Please fill out all fields.');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Passwords do not match.');
    return;
  }
  if (users.some(u => u.email === email)) {
    showToast('This email is already registered.');
    return;
  }
  
  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers();
  
  // Log in immediately
  session = { name, email };
  saveSession();
  
  // Reset form
  document.getElementById('registerForm').reset();
  closeAuthModal();
  updateAuthNav();
  
  // Dynamic pre-fills
  updateReviewsPreFill();
  updateCheckoutPreFill();
  
  showToast(`Welcome to MangaVerse, ${name}! 🎉`);
}

function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showToast('Please fill out all fields.');
    return;
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showToast('Invalid email or password.');
    return;
  }
  
  session = { name: user.name, email: user.email };
  saveSession();
  
  // Reset form
  document.getElementById('loginForm').reset();
  closeAuthModal();
  updateAuthNav();
  
  // Dynamic pre-fills
  updateReviewsPreFill();
  updateCheckoutPreFill();
  
  showToast(`Welcome back, ${user.name}! 👋`);
}

function logout() {
  session = null;
  saveSession();
  
  document.getElementById('userDropdown').classList.remove('open');
  updateAuthNav();
  
  // Reset pre-fills
  const reviewNameInput = document.getElementById('reviewName');
  if (reviewNameInput) {
    reviewNameInput.value = '';
    reviewNameInput.removeAttribute('readonly');
  }
  
  const ckName = document.getElementById('ckName');
  const ckEmail = document.getElementById('ckEmail');
  if (ckName) ckName.value = '';
  if (ckEmail) ckEmail.value = '';
  
  showToast('Logged out successfully.');
}

function updateReviewsPreFill() {
  const reviewNameInput = document.getElementById('reviewName');
  if (reviewNameInput) {
    if (session) {
      reviewNameInput.value = session.name;
      reviewNameInput.setAttribute('readonly', 'true');
    } else {
      reviewNameInput.removeAttribute('readonly');
    }
  }
}

function updateCheckoutPreFill() {
  const ckName = document.getElementById('ckName');
  const ckEmail = document.getElementById('ckEmail');
  if (ckName && ckEmail) {
    if (session) {
      ckName.value = session.name;
      ckEmail.value = session.email;
    }
  }
}


// ── PURCHASES HISTORY ─────────────────────────────────────────
function openPurchasesModal() {
  document.getElementById('userDropdown').classList.remove('open');
  if (!session) {
    openAuthModal();
    showToast('Please log in to view your purchases. 🔐');
    return;
  }
  renderPurchases();
  document.getElementById('purchasesOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePurchasesModal() {
  document.getElementById('purchasesOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handlePurchasesOverlay(e) {
  if (e.target === document.getElementById('purchasesOverlay')) closePurchasesModal();
}

function renderPurchases() {
  const container = document.getElementById('purchasesList');
  if (!container) return;

  if (!session) {
    container.innerHTML = '<div class="purchase-empty">Please log in to view purchases.</div>';
    return;
  }

  const userOrders = orders.filter(o => o.userEmail === session.email.toLowerCase());

  if (!userOrders.length) {
    container.innerHTML = '<div class="purchase-empty">No purchases found. Time to buy some manga! 📚</div>';
    return;
  }

  container.innerHTML = userOrders.slice().reverse().map(order => {
    const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHTML = order.items.map(item => {
      const thumbHTML = (!item.localImage && !item.image)
        ? `<div class="purchase-item-thumb"><div class="thumb-fallback svg-cover" style="display:flex; width:100%; height:100%; background-image:url('${item.coverArt}')"></div></div>`
        : `<div class="purchase-item-thumb">
            <img src="${item.localImage || item.image}" alt="${item.title}" onerror="handleImageError(this, '${item.image}')">
            <div class="thumb-fallback svg-cover" style="background-image:url('${item.coverArt}')"></div>
           </div>`;

      return `
        <div class="purchase-item">
          ${thumbHTML}
          <div class="purchase-item-details">
            <div class="purchase-item-title">${item.title}</div>
            <div class="purchase-item-meta">Qty: ${item.qty} • ₱${item.price.toLocaleString()} each</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="purchase-card">
        <div class="purchase-header">
          <div>
            <div class="purchase-id">${order.id}</div>
            <div class="purchase-date">${formattedDate}</div>
          </div>
          <span class="purchase-status">${order.status || 'Processing'}</span>
        </div>
        <div class="purchase-items">
          ${itemsHTML}
        </div>
        <div class="purchase-footer">
          <span>Payment: <strong>${order.payment}</strong></span>
          <span class="purchase-total">Total: ₱${order.total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');
}


// ── INIT ──────────────────────────────────────────────────────
updateAuthNav();
renderGrid();
updateCartBadge();