/* MOACH sample storefront: plain JS, no dependencies, no network calls.
   Cart and promo state persist in localStorage only. */
(() => {
  'use strict';

  /* ---------- Data ---------- */

  const C = {
    ink: { name: 'Ink', hex: '#131D29' },
    cream: { name: 'Cream', hex: '#F4EFDF' },
    coral: { name: 'Coral', hex: '#EF5A49' },
    lime: { name: 'Chartreuse', hex: '#DAEF66' },
    sand: { name: 'Sand', hex: '#D9CFB4' },
  };
  const APPAREL = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const CATEGORIES = {
    hat: { label: 'Hats & visors', one: 'headwear piece', many: 'headwear pieces' },
    tank: { label: 'Tanks', one: 'tank', many: 'tanks' },
    crop: { label: 'Crop tops', one: 'crop top', many: 'crop tops' },
    hoodie: { label: 'Hoodies', one: 'hoodie', many: 'hoodies' },
    crewneck: { label: 'Sweatshirts', one: 'sweatshirt', many: 'sweatshirts' },
    sticker: { label: 'Stickers', one: 'sticker', many: 'stickers' },
    gear: { label: 'Game-day gear', one: 'gear item', many: 'gear items' },
  };

  // Prices are whole cents to avoid float drift.
  // The first color in each list is the one the card shows on load.
  const PRODUCTS = [
    {
      id: 'sideline-crew', name: 'Coaching From The Sideline Crew', category: 'crewneck', price: 5800,
      tone: 'sand', feature: true,
      print: 'Coaching From The Sideline',
      colors: [C.coral, C.ink, C.cream, C.sand], sizes: APPAREL,
      desc: 'The flagship crew. Ribbed hem, wordmark up front, the whole thesis across the back. Made for cold bleachers, early warm-ups and late innings.',
    },
    {
      id: 'sideline-cap', name: 'The Sideline Cap', category: 'hat', price: 3400,
      tone: 'lime',
      colors: [C.ink, C.coral, C.cream, C.sand], sizes: ['One size'],
      desc: 'Six panels, a curved brim and the folded-M emblem up front. Adjustable back for ponytails and bad-hair tournaments.',
    },
    {
      id: 'not-yelling-tank', name: 'I’m Not Yelling Tank', category: 'tank', price: 3800,
      tone: 'coral',
      print: 'I’m Not Yelling. I’m Coaching.',
      colors: [C.ink, C.cream, C.sand], sizes: APPAREL,
      desc: 'A racerback for the volume you prefer to call “feedback.” Clean wordmark front, the disclaimer on the back.',
    },
    {
      id: 'main-character-crop', name: 'Main-Character Crop', category: 'crop', price: 3600,
      tone: 'ink',
      print: 'Sideline Strategy. Main-Character Energy.',
      colors: [C.cream, C.coral, C.sand], sizes: APPAREL,
      desc: 'The Moach script on a cropped tee. Pairs with high-rise anything and a folding chair at the meet.',
    },
    {
      id: 'ask-the-moach-hoodie', name: 'Ask The MOACH Hoodie', category: 'hoodie', price: 7200,
      tone: 'pattern',
      print: 'Ask Your Coach. Then Ask The MOACH.',
      colors: [C.ink, C.sand, C.cream], sizes: APPAREL,
      desc: 'Pullover hood, kangaroo pocket and a chain of command printed on the back. For anyone who needs reminding.',
    },
    {
      id: 'game-day-tank', name: 'Game Day Racerback', category: 'tank', price: 3600,
      tone: 'sand',
      print: 'Built For Game Day',
      colors: [C.coral, C.ink, C.cream], sizes: APPAREL,
      desc: 'The everyday tank. Wordmark front, Built For Game Day across the shoulders. Warm-ups to the post-game snack run.',
    },
    {
      id: 'car-decal', name: 'MOACH Car Decal', category: 'sticker', price: 800,
      tone: 'ink',
      colors: [C.coral, C.cream, C.ink, C.lime], sizes: ['4 in', '6 in'],
      desc: 'Emblem and wordmark in one decal. Goes on the rear window, the cooler or the clipboard you swear isn’t yours.',
    },
    {
      id: 'mvp-crop', name: 'Real MVP Crop', category: 'crop', price: 3600,
      tone: 'coral',
      print: 'The Real MVP Is On The Sideline',
      colors: [C.sand, C.cream, C.ink], sizes: APPAREL,
      desc: 'Same cropped cut, different headline. Says the quiet part on the back so nobody has to say it out loud.',
    },
    {
      id: 'game-day-hoodie', name: 'Sideline Hoodie', category: 'hoodie', price: 6800,
      tone: 'lime',
      colors: [C.coral, C.ink, C.sand], sizes: APPAREL,
      desc: 'Just the mark, front and center. The hoodie for night games, rainouts, cold gyms and the drive home.',
    },
    {
      id: 'coffee-chaos-crew', name: 'Coffee & Chaos Crew', category: 'crewneck', price: 5800,
      tone: 'ink',
      print: 'Fueled By Coffee & Game-Day Chaos',
      colors: [C.cream, C.coral, C.sand], sizes: APPAREL,
      desc: 'The crew for 7 a.m. meets and doubleheaders. Wordmark front, an honest fuel report on the back.',
    },
    {
      id: 'halftime-cap', name: 'Halftime Cap', category: 'hat', price: 3200,
      tone: 'coral',
      print: 'Side: Coaching From The Sideline',
      colors: [C.sand, C.ink, C.cream], sizes: ['One size'],
      desc: 'Our cap with a little extra: the brand line stitched along the side. Adjustable back.',
    },
    {
      id: 'emblem-sticker-trio', name: 'Emblem Sticker Trio', category: 'sticker', price: 1200,
      tone: 'sand',
      colors: [C.lime, C.coral, C.ink], sizes: ['3 in set'],
      desc: 'Three stickers for the water bottle, the laptop and the team tote. Color choice sets the lead sticker in the pack.',
    },
    {
      id: 'court-side-visor', name: 'Court-Side Visor', category: 'hat', imageKey: 'visor', price: 3000,
      tone: 'coral',
      colors: [C.ink, C.coral, C.cream], sizes: ['One size'],
      desc: 'A lightweight performance visor for sunny fields, tennis courts, golf days and tournament weekends. The folded-M emblem sits front and center.',
    },
    {
      id: 'game-day-headband', name: 'Women’s Game-Day Headband', category: 'gear', imageKey: 'headband', price: 1800,
      tone: 'ink',
      colors: [C.ink, C.coral, C.cream], sizes: ['One size'],
      desc: 'A moisture-managing tie headband that keeps hair back through warmups, workouts, coaching and every humid doubleheader.',
    },
    {
      id: 'sideline-can-cooler', name: 'Sideline Can Cooler', category: 'gear', imageKey: 'cooler', price: 1000,
      tone: 'lime',
      colors: [C.ink, C.coral, C.cream, C.sand], sizes: ['12 oz'],
      desc: 'A collapsible insulated can sleeve for the tailgate, team barbecue or post-game parking-lot recap. Branded, useful and easy to toss in a tote.',
    },
    {
      id: 'all-day-tumbler', name: 'All-Day Insulated Tumbler', category: 'gear', imageKey: 'tumbler', price: 4200,
      tone: 'sand',
      colors: [C.ink, C.coral, C.cream, C.sand], sizes: ['40 oz'],
      desc: 'A large handled stainless travel tumbler with lid and straw. Built for hydration from the school run through the final whistle—no protected drinkware branding.',
    },
    {
      id: 'stadium-cup', name: 'MOACH Stadium Cup', category: 'gear', imageKey: 'stadium', price: 1200,
      tone: 'coral',
      colors: [C.ink, C.coral, C.cream, C.lime], sizes: ['16 oz'],
      desc: 'A reusable game-day cup for cookouts, tournaments and team parties. Stackable, lightweight and easy to spot in the cooler.',
    },
    {
      id: 'team-tote', name: 'Everything Team Tote', category: 'gear', imageKey: 'tote', price: 3800,
      tone: 'pattern',
      colors: [C.ink, C.coral, C.cream, C.sand], sizes: ['One size'],
      desc: 'A heavy canvas carryall for snacks, sunscreen, towels, extra uniforms, chargers and the five things everyone else forgot.',
    },
    {
      id: 'sideline-sling', name: 'Sideline Sling', category: 'gear', imageKey: 'sling', price: 3600,
      tone: 'ink',
      colors: [C.ink, C.coral, C.cream, C.sand], sizes: ['One size'],
      desc: 'A compact crossbody satchel for phones, keys, wallets, tickets and coaching notes. Neutral enough for dads, useful enough for everyone.',
    },
  ];
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

  /* ---------- Product photography: deterministic color -> file map ----------
     Plain relative paths only, so the photographed mockups swap with index.html
     opened via file:// as well as from a server. */

  const IMG_DIR = 'assets/photoreal/products/';
  // Selector color name -> file suffix. Chartreuse files are named "lime".
  const COLOR_FILE = { Ink: 'ink', Coral: 'coral', Cream: 'cream', Sand: 'sand', Chartreuse: 'lime' };
  // Files that actually exist per category, with the first entry as the category default.
  const VARIANTS = {
    hat: ['ink', 'coral', 'cream', 'sand'],
    visor: ['ink', 'coral', 'cream'],
    tank: ['ink', 'coral', 'cream', 'sand'],
    crop: ['cream', 'coral', 'ink', 'sand'],
    hoodie: ['ink', 'coral', 'cream', 'sand'],
    crewneck: ['coral', 'ink', 'cream', 'sand'],
    sticker: ['coral', 'cream', 'ink', 'lime'],
    headband: ['ink', 'coral', 'cream'],
    cooler: ['ink', 'coral', 'cream', 'sand'],
    tumbler: ['ink', 'coral', 'cream', 'sand'],
    stadium: ['ink', 'coral', 'cream', 'lime'],
    tote: ['ink', 'coral', 'cream', 'sand'],
    sling: ['ink', 'coral', 'cream', 'sand'],
  };

  // Resolve a color for a product: the requested color if it has art, otherwise the
  // product's first color that has art, otherwise the category default.
  function variantFor(p, colorName) {
    const key = p.imageKey || p.category;
    const files = VARIANTS[key] || [];
    const want = COLOR_FILE[colorName];
    if (want && files.includes(want)) return want;
    const firstListed = p.colors.map((c) => COLOR_FILE[c.name]).find((f) => files.includes(f));
    return firstListed || files[0] || null;
  }

  function productImage(p, colorName) {
    const v = variantFor(p, colorName);
    const key = p.imageKey || p.category;
    return v ? `${IMG_DIR}product-${key}-${v}.png` : 'assets/moach-emblem.svg';
  }

  const SHADE = { ink: 'Deep-navy', coral: 'Coral', cream: 'Cream', sand: 'Sand', lime: 'Chartreuse' };
  // Decoration color per variant, matching the art: cream marks on dark/coral grounds,
  // ink marks on light grounds, and the cream crop keeps its coral script.
  const markColor = (category, v) => {
    if (category === 'crop' && v === 'cream') return 'coral';
    return v === 'ink' || v === 'coral' ? 'cream' : 'ink';
  };
  const DESCRIBE = {
    hat: (m) => `six-panel cap with the ${m} folded-M emblem embroidered on the front`,
    visor: (m) => `performance visor with the ${m} folded-M emblem on the front band`,
    tank: (m) => `rib tank photographed with the ${m} MOACH wordmark and folded-M emblem on the chest`,
    crop: (m) => `cropped tee with the flowing ${m} Moach script across the chest`,
    hoodie: (m) => `pullover hoodie with the ${m} MOACH wordmark and emblem, drawstrings and kangaroo pocket`,
    crewneck: (m) => `crewneck sweatshirt with the ${m} MOACH wordmark and folded-M emblem on the chest`,
    sticker: (m) => `MOACH vinyl window decal in ${m}, photographed on auto glass`,
    headband: (m) => `women’s tie headband with the ${m} folded-M emblem centered on the front band`,
    cooler: (m) => `insulated can cooler with the ${m} MOACH emblem and wordmark`,
    tumbler: (m) => `handled insulated tumbler with the ${m} MOACH emblem and wordmark`,
    stadium: (m) => `reusable stadium cup with the ${m} MOACH emblem and wordmark`,
    tote: (m) => `canvas team tote with the ${m} MOACH emblem and wordmark`,
    sling: (m) => `crossbody sling bag with the ${m} MOACH emblem and wordmark`,
  };

  function productAlt(p, colorName) {
    const v = variantFor(p, colorName);
    const key = p.imageKey || p.category;
    const describe = DESCRIBE[key];
    if (!v || !describe) return p.name;
    return `${SHADE[v]} ${describe(markColor(key, v), v)}.`;
  }

  // Valid color name for a product (falls back to its first color).
  const colorOf = (p, colorName) => (p.colors.some((c) => c.name === colorName) ? colorName : p.colors[0].name);

  const PROMO_CODE = 'SIDELINE10';
  const PROMO_RATE = 0.1;
  const STORE_KEY = 'moach.sample.bag.v1';

  /* ---------- Helpers ---------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const fmt = (cents) => money.format(cents / 100);
  // "Side: Coaching..." -> { where: 'Side', line: 'Coaching...' }; default placement is the back.
  const printParts = (print) => {
    const m = /^(Side|Back|Front):\s*(.+)$/.exec(print);
    return m ? { where: m[1], line: m[2] } : { where: 'Back', line: print };
  };
  const fmtShort =(cents) => (cents % 100 === 0 ? `$${cents / 100}` : fmt(cents));
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') node.textContent = v;
      else if (k === 'className') node.className = v;
      else if (k === 'style') Object.entries(v).forEach(([prop, val]) => node.style.setProperty(prop, val));
      else node.setAttribute(k, v === true ? '' : v);
    });
    [].concat(children).forEach((c) => c != null && node.append(c));
    return node;
  };

  /* ---------- State + persistence ---------- */

  // cardColor: product id -> color name currently shown on that card (survives filtering).
  const state = { filter: 'all', items: [], promo: null, cardColor: {} };
  const cardColor = (p) => colorOf(p, state.cardColor[p.id]);

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.items)) {
        state.items = data.items
          .filter((i) => i && byId.has(i.id) && Number.isInteger(i.qty) && i.qty > 0)
          .map((i) => ({ ...i, qty: Math.min(i.qty, 99), key: `${i.id}|${i.color}|${i.size}` }));
      }
      state.promo = data.promo === PROMO_CODE ? PROMO_CODE : null;
    } catch (_) { /* storage blocked or corrupt: start empty */ }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        items: state.items.map(({ id, color, size, qty }) => ({ id, color, size, qty })),
        promo: state.promo,
      }));
    } catch (_) { /* private mode etc. Cart still works for this visit. */ }
  }

  /* ---------- Products ---------- */

  const grid = $('[data-product-grid]');
  const filterStatus = $('[data-filter-status]');

  function productCard(p, index) {
    const showFeature = p.feature && state.filter === 'all';
    const no = String(PRODUCTS.indexOf(p) + 1).padStart(2, '0');
    const color = cardColor(p);
    const media = el('div', { className: 'card-media', 'data-quickview': p.id }, [
      el('span', { className: 'card-no', 'aria-hidden': 'true', text: `No. ${no}` }),
      el('div', { className: 'card-frame' }, el('img', {
        src: productImage(p, color), alt: productAlt(p, color), width: 1200, height: 1400,
        loading: index < 3 ? 'eager' : 'lazy', decoding: 'async', 'data-card-img': '',
      })),
      p.print ? el('p', { className: 'card-print' }, [
        el('span', { text: printParts(p.print).where }), printParts(p.print).line,
      ]) : null,
    ]);
    // Real toggle buttons: each one swaps the garment art on this card.
    const swatches = el('div', { className: 'card-swatches', role: 'group', 'aria-label': `Color for ${p.name}` },
      p.colors.map((c) => el('button', {
        type: 'button', className: 'card-swatch', title: c.name,
        'data-swatch': c.name, 'data-id': p.id, 'aria-pressed': String(c.name === color),
        style: { '--sw': c.hex },
      }, el('span', { className: 'visually-hidden', text: c.name }))));
    const info = el('div', { className: 'card-info' }, [
      el('h3', { className: 'card-name', text: p.name }),
      el('p', { className: 'card-price', text: fmtShort(p.price) }),
      swatches,
      el('p', { className: 'card-color' }, [
        el('span', { className: 'visually-hidden', text: 'Showing ' }),
        el('span', { 'data-card-color': '', text: color }),
      ]),
      el('p', { className: 'card-meta', text: p.sizes.length > 1 && p.sizes[0] === 'XS' ? 'XS–3XL' : p.sizes.join(' / ') }),
      el('button', { type: 'button', className: 'btn card-qv', 'data-quickview': p.id }, [
        'Quick view', el('span', { className: 'visually-hidden', text: `: ${p.name}` }),
      ]),
    ]);
    return el('li', { className: `card tone-${p.tone}${showFeature ? ' is-feature' : ''}`, 'data-card': p.id }, [media, info]);
  }

  // Update one card in place (keeps keyboard focus on the swatch that was pressed).
  function showCardColor(p, colorName) {
    const color = colorOf(p, colorName);
    state.cardColor[p.id] = color;
    const card = grid.querySelector(`[data-card="${CSS.escape(p.id)}"]`);
    if (!card) return;
    const img = $('[data-card-img]', card);
    img.src = productImage(p, color);
    img.alt = productAlt(p, color);
    $$('[data-swatch]', card).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.swatch === color)));
    $('[data-card-color]', card).textContent = color;
  }

  const swatchLive = $('[data-swatch-live]');
  grid.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-swatch]');
    if (!sw) return;
    const p = byId.get(sw.dataset.id);
    if (!p) return;
    showCardColor(p, sw.dataset.swatch);
    swatchLive.textContent = `${p.name} now shown in ${cardColor(p)}.`;
  });

  function renderProducts() {
    const list = state.filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === state.filter);
    grid.replaceChildren(...list.map(productCard));
    $$('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === state.filter)));
    const cat = CATEGORIES[state.filter];
    filterStatus.textContent = cat
      ? `Showing ${list.length} ${list.length === 1 ? cat.one : cat.many}`
      : `Showing all ${list.length} pieces`;
  }

  function setFilter(f) {
    state.filter = CATEGORIES[f] ? f : 'all';
    renderProducts();
  }

  /* ---------- Dialog plumbing (focus trap, Esc, backdrop, restore) ---------- */

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const returnFocus = new WeakMap();

  function visibleFocusables(root) {
    return $$(FOCUSABLE, root).filter((n) => n.getClientRects().length && !n.closest('[hidden]'));
  }

  function openDialog(dlg, opener, focusTarget) {
    if (!dlg.open) {
      returnFocus.set(dlg, opener && opener.isConnected ? opener : document.activeElement);
      dlg.showModal();
    }
    document.body.classList.add('has-dialog');
    const target = focusTarget || visibleFocusables(dlg)[0];
    if (target) target.focus();
  }

  function closeDialog(dlg) { if (dlg.open) dlg.close(); }

  $$('dialog').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      if (!$$('dialog').some((d) => d.open)) document.body.classList.remove('has-dialog');
      const back = returnFocus.get(dlg);
      returnFocus.delete(dlg);
      if (back && back.isConnected && !dlg.dataset.keepFocus) back.focus();
      delete dlg.dataset.keepFocus;
    });
    // Backdrop click: the dialog element itself only receives clicks outside its inner wrapper.
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(dlg); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = visibleFocusables(dlg);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('[data-close-dialog]', dlg).forEach((b) => b.addEventListener('click', () => closeDialog(dlg)));
  });

  /* ---------- Quick view ---------- */

  const qv = $('#quickview');
  const qvForm = $('[data-qv-form]');
  let qvProduct = null;

  function optionChoice({ name, value, label, checked, swatch }) {
    const id = `opt-${name}-${value.replace(/\W+/g, '-').toLowerCase()}`;
    const input = el('input', { type: 'radio', name, value, id, checked: checked || null });
    const face = swatch
      ? el('span', { className: 'swatch', style: { '--sw': swatch }, 'aria-hidden': 'true' })
      : el('span', { className: 'size-pill', 'aria-hidden': 'true', text: label });
    const lbl = el('label', { className: 'opt-choice', for: id }, [input, face, el('span', { className: 'visually-hidden', text: label })]);
    return lbl;
  }

  const qvImg = $('[data-qv-img]');

  function showQvColor(colorName) {
    if (!qvProduct) return;
    qvImg.src = productImage(qvProduct, colorName);
    qvImg.alt = productAlt(qvProduct, colorName);
  }

  function syncQvLegends() {
    const color = qvForm.elements.color && qvForm.elements.color.value;
    const size = qvForm.elements.size && qvForm.elements.size.value;
    $('[data-qv-color-name]').textContent = color || '';
    $('[data-qv-size-name]').textContent = size || '';
  }

  function openQuickView(id, opener) {
    const p = byId.get(id);
    if (!p) return;
    qvProduct = p;
    // Open on whatever color the shopper last chose for this product on its card.
    const color = cardColor(p);
    const media = $('[data-qv-media]');
    media.className = `qv-media tone-${p.tone}`;
    showQvColor(color);
    const print = $('[data-qv-print]');
    print.hidden = !p.print;
    print.textContent = p.print ? `${printParts(p.print).where}: ${printParts(p.print).line}` : '';
    $('[data-qv-cat]').textContent = CATEGORIES[p.category].label;
    $('[data-qv-name]').textContent = p.name;
    $('[data-qv-price]').textContent = fmt(p.price);
    $('[data-qv-btn-price]').textContent = fmt(p.price);
    $('[data-qv-desc]').textContent = p.desc;
    $('[data-qv-colors]').replaceChildren(...p.colors.map((c) =>
      optionChoice({ name: 'color', value: c.name, label: c.name, checked: c.name === color, swatch: c.hex })));
    const defaultSize = p.sizes.includes('M') ? 'M' : p.sizes[0];
    $('[data-qv-sizes]').replaceChildren(...p.sizes.map((s) =>
      optionChoice({ name: 'size', value: s, label: s, checked: s === defaultSize })));
    syncQvLegends();
    qv.scrollTop = 0;
    openDialog(qv, opener, $('.qv-close', qv));
  }

  qvForm.addEventListener('change', (e) => {
    syncQvLegends();
    if (e.target.name === 'color' && qvProduct) {
      // Swap the large art immediately and keep the product card in step.
      showQvColor(e.target.value);
      showCardColor(qvProduct, e.target.value);
    }
  });
  qvForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!qvProduct) return;
    const color = qvForm.elements.color.value;
    const size = qvForm.elements.size.value;
    addToCart(qvProduct.id, color, size);
    const opener = returnFocus.get(qv);
    qv.dataset.keepFocus = '1';
    closeDialog(qv);
    openCart(opener, `Added ${qvProduct.name} (${color}, ${size}) to your bag.`);
  });

  /* ---------- Cart ---------- */

  const drawer = $('#cart');
  const cartList = $('[data-cart-list]');
  const cartLive = $('[data-cart-live]');
  const promoMsg = $('[data-promo-msg]');
  const checkoutMsg = $('[data-checkout-msg]');

  const count = () => state.items.reduce((n, i) => n + i.qty, 0);
  const subtotal = () => state.items.reduce((s, i) => s + byId.get(i.id).price * i.qty, 0);

  function addToCart(id, color, size) {
    const key = `${id}|${color}|${size}`;
    const found = state.items.find((i) => i.key === key);
    if (found) found.qty = Math.min(found.qty + 1, 99);
    else state.items.push({ key, id, color, size, qty: 1 });
    save();
    renderCart();
  }

  function cartRow(item) {
    const p = byId.get(item.id);
    const label = `${p.name}, ${item.color}, ${item.size}`;
    return el('li', { className: 'cart-item' }, [
      el('img', { className: 'cart-thumb', src: productImage(p, item.color), alt: '', width: 84, height: 98, 'data-cart-thumb': item.color }),
      el('div', {}, [
        el('p', { className: 'cart-name', text: p.name }),
        el('p', { className: 'cart-variant', text: `${item.color} · ${item.size} · ${fmt(p.price)} each` }),
        el('div', { className: 'cart-row' }, [
          el('div', { className: 'qty', role: 'group', 'aria-label': `Quantity for ${label}` }, [
            el('button', { type: 'button', 'data-action': 'dec', 'data-key': item.key, 'aria-label': `Decrease quantity of ${label}`, disabled: item.qty <= 1 || null, text: '−' }),
            el('output', { 'aria-label': 'Quantity', text: String(item.qty) }),
            el('button', { type: 'button', 'data-action': 'inc', 'data-key': item.key, 'aria-label': `Increase quantity of ${label}`, disabled: item.qty >= 99 || null, text: '+' }),
          ]),
          el('p', { className: 'cart-line-price', text: fmt(p.price * item.qty) }),
        ]),
        el('button', { type: 'button', className: 'text-btn', 'data-action': 'remove', 'data-key': item.key }, [
          'Remove', el('span', { className: 'visually-hidden', text: ` ${label}` }),
        ]),
      ]),
    ]);
  }

  function renderCart() {
    const n = count();
    const sub = subtotal();
    const discount = state.promo ? Math.round(sub * PROMO_RATE) : 0;

    $$('[data-cart-count]').forEach((c) => { c.textContent = String(n); });
    $('[data-open-cart]').setAttribute('aria-label', `Open bag, ${n} ${n === 1 ? 'item' : 'items'}`);
    $('[data-cart-count-text]').textContent = `(${n})`;

    cartList.replaceChildren(...state.items.map(cartRow));
    $('[data-cart-empty]').hidden = n > 0;
    cartList.hidden = n === 0;
    $('[data-cart-foot]').hidden = n === 0;

    $('[data-subtotal]').textContent = fmt(sub);
    $('[data-discount-row]').hidden = !state.promo;
    $('[data-discount]').textContent = `−${fmt(discount)}`;
    $('[data-total]').textContent = fmt(sub - discount);
  }

  function announce(msg) {
    cartLive.textContent = '';
    // Re-set on next frame so repeated identical messages are still announced.
    requestAnimationFrame(() => { cartLive.textContent = msg; });
  }

  function openCart(opener, message) {
    checkoutMsg.textContent = '';
    renderCart();
    openDialog(drawer, opener, $('[data-close-dialog]', drawer));
    if (message) announce(message);
  }

  cartList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, key } = btn.dataset;
    const item = state.items.find((i) => i.key === key);
    if (!item) return;
    const name = byId.get(item.id).name;
    if (action === 'inc') item.qty = Math.min(item.qty + 1, 99);
    if (action === 'dec') item.qty = Math.max(item.qty - 1, 1);
    if (action === 'remove') state.items = state.items.filter((i) => i.key !== key);
    save();
    renderCart();
    checkoutMsg.textContent = '';

    if (action === 'remove') {
      announce(`Removed ${name}.`);
      const next = $('button[data-action="remove"]', cartList) || $('[data-close-cart-link]', drawer);
      if (next && next.getClientRects().length) next.focus();
      else $('[data-close-dialog]', drawer).focus();
    } else {
      announce(`${name} quantity ${item.qty}.`);
      const same = $(`button[data-action="${action}"][data-key="${CSS.escape(key)}"]`, cartList);
      const other = $(`button[data-action="${action === 'inc' ? 'dec' : 'inc'}"][data-key="${CSS.escape(key)}"]`, cartList);
      (same && !same.disabled ? same : other).focus();
    }
  });

  $('[data-promo-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#promo-code');
    const code = input.value.trim().toUpperCase();
    promoMsg.classList.remove('is-error', 'is-success');
    if (!code) {
      promoMsg.textContent = 'Enter a code first. Hint: SIDELINE10.';
      promoMsg.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
    } else if (code === PROMO_CODE) {
      state.promo = PROMO_CODE;
      promoMsg.textContent = 'SIDELINE10 applied: 10% off the sample subtotal.';
      promoMsg.classList.add('is-success');
      input.removeAttribute('aria-invalid');
      input.value = '';
    } else {
      promoMsg.textContent = `“${code}” isn’t in the playbook. Try SIDELINE10.`;
      promoMsg.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
    }
    save();
    renderCart();
  });

  $('[data-remove-promo]').addEventListener('click', () => {
    state.promo = null;
    save();
    renderCart();
    promoMsg.classList.remove('is-error', 'is-success');
    promoMsg.textContent = 'Promo code removed.';
    $('#promo-code').focus();
  });

  $('[data-checkout]').addEventListener('click', () => {
    checkoutMsg.textContent = 'Checkout is switched off in this sample store. Nothing was charged and no order was placed.';
  });

  $('[data-open-cart]').addEventListener('click', (e) => openCart(e.currentTarget));

  $('[data-close-cart-link]').addEventListener('click', () => {
    drawer.dataset.keepFocus = '1';
    closeDialog(drawer);
    setFilter('all');
    // Let the anchor scroll to #shop, then land focus on the first filter.
    requestAnimationFrame(() => { const f = $('.filter'); if (f) f.focus({ preventScroll: true }); });
  });

  /* ---------- Global delegation: quick view + filter links ---------- */

  document.addEventListener('click', (e) => {
    const qvTrigger = e.target.closest('[data-quickview]');
    if (qvTrigger) {
      // Image area is a mouse convenience; the visible button is the keyboard path.
      const opener = qvTrigger.matches('button') ? qvTrigger : qvTrigger.closest('.card')?.querySelector('.card-qv') || qvTrigger;
      openQuickView(qvTrigger.dataset.quickview, opener);
      return;
    }
    const filterBtn = e.target.closest('.filter');
    if (filterBtn) { setFilter(filterBtn.dataset.filter); return; }
    const filterLink = e.target.closest('[data-filter-link]');
    if (filterLink) { setFilter(filterLink.dataset.filterLink); closeNav(); }
  });

  /* ---------- Youth Sports Playbook (tabs) ----------
     Football 5-on-5 is the default and is already in the HTML, so the panel
     reads correctly before (or without) this script. */

  const SPORTS = {
    football: {
      img: 'assets/sports/football-5v5.svg',
      venue: 'On the field',
      title: '5-on-5 football',
      line: 'Five routes off one snap. She saw the open receiver before the coach did.',
      alt: '5-on-5 youth football play: five coral offensive players on the dashed line of scrimmage, five cream defenders marked X, and chartreuse passing routes breaking downfield.',
    },
    basketball: {
      img: 'assets/sports/basketball.svg',
      venue: 'On the court',
      title: 'Basketball, half court',
      line: 'Pass, cut, screen. She called the backdoor from row three.',
      alt: 'Youth basketball half-court set: five coral players around the key, dashed chartreuse passes, solid cuts to the basket and a screen beside the lane.',
    },
    baseball: {
      img: 'assets/sports/baseball.svg',
      venue: 'On the diamond',
      title: 'Baseball, rounding first',
      line: 'Eyes up, take the turn. She was waving him on before the base coach was.',
      alt: 'Youth baseball diamond: coral fielders around the bases, a chartreuse runner rounding first toward second, the coaching box and the dugout on the right.',
    },
    volleyball: {
      img: 'assets/sports/volleyball.svg',
      venue: 'In the gym',
      title: 'Volleyball, serve receive',
      line: 'Six on the floor, one ball in the air, and one voice in the bleachers calling it first.',
      alt: 'Youth volleyball serve receive: six coral players in two rows behind the net, a dashed chartreuse serve arcing over, and short arrows for each player’s adjustment.',
    },
  };

  const pbTabs = $$('[data-sport-tab]');
  const pbPanel = $('[data-sport-panel]');

  function selectSport(tab, moveFocus) {
    const s = SPORTS[tab.dataset.sportTab];
    if (!s) return;
    pbTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const img = $('[data-sport-img]', pbPanel);
    img.src = s.img;
    img.alt = s.alt;
    $('[data-sport-venue]', pbPanel).textContent = s.venue;
    $('[data-sport-title]', pbPanel).textContent = s.title;
    $('[data-sport-line]', pbPanel).textContent = s.line;
    pbPanel.setAttribute('aria-labelledby', tab.id);
    pbPanel.dataset.sport = tab.dataset.sportTab;
    if (moveFocus) tab.focus();
  }

  pbTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectSport(tab, false));
    tab.addEventListener('keydown', (e) => {
      const last = pbTabs.length - 1;
      let next = null;
      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next === null) return;
      e.preventDefault();
      selectSport(pbTabs[next], true);
    });
  });

  /* ---------- Mobile nav ---------- */

  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');

  function closeNav(returnToToggle) {
    if (navToggle.getAttribute('aria-expanded') !== 'true') return;
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    if (returnToToggle) navToggle.focus();
  }

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (open) { const first = $('a', nav); if (first) first.focus(); }
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav(true);
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !e.target.closest('#site-nav, .nav-toggle')) closeNav();
  });
  window.matchMedia('(min-width: 921px)').addEventListener('change', (m) => { if (m.matches) closeNav(); });

  /* ---------- Signup (local only) ---------- */

  const signup = $('[data-signup]');
  const signupMsg = $('[data-signup-msg]');
  signup.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#signup-email');
    const value = input.value.trim();
    input.value = value;
    signupMsg.classList.remove('is-error', 'is-success');
    if (!value || !input.checkValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      input.setAttribute('aria-invalid', 'true');
      signupMsg.textContent = value ? 'That email looks off. Check it and try again.' : 'Add your email to join the roster.';
      signupMsg.classList.add('is-error');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    signupMsg.textContent = `You’re on the roster, ${value}. (Sample only: nothing was sent anywhere.)`;
    signupMsg.classList.add('is-success');
    signup.reset();
  });

  /* ---------- Boot ---------- */

  load();
  renderProducts();
  renderCart();

  // Keep tabs in sync if the bag changes in another window.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORE_KEY) return;
    state.items = [];
    state.promo = null;
    load();
    renderCart();
  });
})();
