/* Crystal Holidays - shared site script: preloader, header, footer, data cards, booking */
const SITE = {
  name: 'Crystal Holidays Pvt Ltd',
  phone: '+94 77 735 6354', phoneRaw: '94777356354', phone2: '+94 11 272 5032 / 33',
  emails: ['crystalh@sltnet.lk', 'salescrystalh@sltnet.lk', 'crys.holiday@gmail.com'],
  address: 'No. 25A, De Seram Road, Mount Lavinia, Sri Lanka',
};
const THEMES = {
  beach: { label: 'Beach & Coast', blurb: 'Palm-lined bays, surf, whales and quiet east-coast sand.', img: '/images/tours/palm-beach.jpg' },
  sky: { label: 'Hills & Sky', blurb: 'Tea country, mountain trails, sunrise climbs and views from above.', img: '/images/tours/hill-sunset.jpg' },
  wildlife: { label: 'Wildlife', blurb: 'Elephants, leopards, rainforest birds and turtle beaches.', img: '/images/tours/wild-elephant.jpg' },
  wellness: { label: 'Ayurveda & Wellness', blurb: 'Doctor-guided treatments, yoga and slow days by the sea.', img: '/images/tours/ayurveda-massage.jpg' },
  culture: { label: 'Culture & Heritage', blurb: 'Ancient cities, temples, festivals and village life.', img: '/images/tours/perahera-elephant.jpg' },
};
const STAY_CATS = {
  accommodation: { beach: 'Beach Hotels', boutique: 'Boutique Hotels', 'colombo-city': 'Colombo City Hotels', 'round-tour': 'Round Tour Hotels' },
  maldives: { exclusive: 'Exclusive Resorts', other: 'Other Resorts' },
};
const GALLERY = ['gallery/sigiriya-group', 'gallery/tea-estate', 'tours/stilt-fishermen', 'gallery/bullock-carts', 'tours/palm-beach', 'gallery/lake-boats', 'tours/galle-lighthouse', 'gallery/arrival-3', 'tours/wild-elephant', 'gallery/crystal-van', 'tours/ayurveda-treatment', 'tours/perahera-elephant', 'gallery/group-sigiriya-2', 'tours/sunset-palms', 'gallery/van-guests', 'tours/helicopter', 'tours/palm-swing', 'gallery/arrival-1', 'tours/hill-sunset', 'gallery/arrival-2', 'tours/dancers', 'gallery/group-photo', 'tours/jet-ski'].map(x => `/images/${x}.jpg`);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cur = { code: 'USD' };
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: cur.code, maximumFractionDigits: 0 }).format(n);
const get = async url => { const r = await fetch(url); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Request failed'); return r.json(); };
const post = async (url, body) => { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Request failed'); return j; };

/* ---------- preloader ---------- */
(function preloader() {
  const pl = $('#preloader'); if (!pl) return;
  const t0 = performance.now(), MIN = 2300;
  const hide = () => { pl.classList.add('done'); try { sessionStorage.setItem('pl', '1'); } catch {} setTimeout(() => pl.remove(), 1100); };
  const go = () => setTimeout(hide, Math.max(0, MIN - (performance.now() - t0)));
  document.readyState === 'complete' ? go() : addEventListener('load', go);
  setTimeout(hide, 9000); // never trap the visitor
})();

/* ---------- header & footer ---------- */
function drop(group) { return `<ul class="drop">${Object.entries(STAY_CATS[group]).map(([k, v]) => `<li><a href="/${group}.html?cat=${k}">${v}</a></li>`).join('')}</ul>`; }
function buildChrome() {
  const here = location.pathname.replace(/\/$/, '') || '/';
  const cp = h => (here === h || (h !== '/' && here === h.replace('.html', ''))) ? ' aria-current="page"' : '';
  const header = $('#site-header');
  if (header) header.outerHTML = `<header class="site-header" id="hdr"><div class="wrap hd">
    <a class="brand" href="/" aria-label="Crystal Holidays home"><img class="light-logo" src="/images/brand/logo-white.png" alt="Crystal Holidays"><img class="dark-logo" src="/images/brand/logo.png" alt=""></a>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul class="nav">
      <li><a class="top" href="/"${cp('/')}>Home</a></li>
      <li><a class="top" href="/accommodation.html"${cp('/accommodation.html')}>Accommodation</a>${drop('accommodation')}</li>
      <li><a class="top" href="/maldives.html"${cp('/maldives.html')}>Maldives</a>${drop('maldives')}</li>
      <li><a class="top" href="/tours.html"${cp('/tours.html')}>Tours &amp; Packages</a></li>
      <li><a class="top" href="/excursion.html"${cp('/excursion.html')}>Excursion</a></li>
      <li><a class="top hd-phone" href="tel:+${SITE.phoneRaw}">${SITE.phone}</a></li>
      <li><a class="btn small" href="/contact.html">Inquiry</a></li>
    </ul></div></header>`;
  const footer = $('#site-footer');
  if (footer) footer.outerHTML = `<footer class="site-footer"><div class="wrap">
    <div class="ft">
      <div><img src="/images/brand/logo-white.png" alt="Crystal Holidays"><p>Travel agent and tour operator in Sri Lanka. Tailor-made journeys, planned by a team with more than 30 years in the industry.</p></div>
      <div><h4>Explore</h4><ul><li><a href="/tours.html">Tours &amp; Packages</a></li><li><a href="/excursion.html">Excursions</a></li><li><a href="/accommodation.html">Accommodation</a></li><li><a href="/maldives.html">Maldives</a></li><li><a href="/#about">About us</a></li></ul></div>
      <div><h4>Stay</h4><ul>${Object.entries(STAY_CATS.accommodation).map(([k, v]) => `<li><a href="/accommodation.html?cat=${k}">${v}</a></li>`).join('')}<li><a href="/maldives.html?cat=exclusive">Maldives Exclusive Resorts</a></li></ul></div>
      <div><h4>Contact</h4><ul><li>${SITE.address}</li><li><a href="tel:+${SITE.phoneRaw}">${SITE.phone}</a></li><li>${SITE.phone2}</li>${SITE.emails.map(e => `<li><a href="mailto:${e}">${e}</a></li>`).join('')}</ul></div>
    </div>
    <div class="copy"><span>&copy; ${new Date().getFullYear()} ${SITE.name}. Certified Safe &amp; Secure by the Sri Lanka Tourism Development Authority.</span><a href="/admin.html">Staff login</a></div>
  </div></footer>
  <a class="wa" href="https://wa.me/${SITE.phoneRaw}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32"><path d="M16 3.500C9.100 3.500 3.500 9 3.500 15.800c0 2.400.700 4.600 1.900 6.500L3.500 28.500l6.400-1.700c1.800 1 3.900 1.500 6.100 1.500 6.900 0 12.500-5.500 12.500-12.300S22.900 3.500 16 3.500zm5.800 16.800c-.3.800-1.500 1.500-2.100 1.600-.5.100-1.200.1-1.900-.1-.4-.1-1-.3-1.700-.6-3-1.300-4.900-4.300-5.100-4.500-.1-.2-1.200-1.600-1.200-3.100 0-1.500.8-2.200 1.100-2.500.3-.3.600-.4.800-.4h.6c.2 0 .5-.1.700.5.300.600.900 2.100 1 2.300.1.100.1.300 0 .5-.1.200-.2.300-.3.500l-.5.500c-.2.200-.3.300-.1.700.2.300.8 1.300 1.700 2.100 1.200 1 2.200 1.400 2.500 1.500.3.200.5.100.7-.1.200-.2.800-.9 1-1.200.2-.3.400-.2.700-.1l2 1c.3.100.5.200.6.300.1.200.1.800-.2 1.700z"/></svg></a>`;
  const hdr = $('#hdr');
  if (hdr) {
    const on = () => hdr.classList.toggle('solid', scrollY > 40 || document.body.dataset.solid === '1');
    on(); addEventListener('scroll', on, { passive: true });
    $('.burger', hdr).addEventListener('click', e => { const o = hdr.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });
  }
}

/* ---------- cards ---------- */
const themeTags = p => (p.themes || []).slice(0, 2).map(t => THEMES[t]?.label).filter(Boolean).join(' / ');
const tourCard = p => `<a class="card" href="/package.html?slug=${encodeURIComponent(p.slug)}">
  <div class="pic"><img loading="lazy" src="${esc(p.image)}" alt="${esc(p.title)}">${themeTags(p) ? `<span class="tag">${esc(themeTags(p))}</span>` : ''}</div>
  <div class="body"><div class="meta">${esc(p.duration)}</div><h3>${esc(p.title)}</h3><p class="sh">${esc(p.short)}</p>
  <div class="foot"><span class="price">${p.price ? `<small>from </small>${money(p.price)}<small> per person</small>` : '<small>Price on request</small>'}</span><span class="btn small dark">View</span></div></div></a>`;
const stars = n => n ? ' ' + '\u2605'.repeat(n) : '';
const hotelCard = h => `<article class="card"><div class="pic"><img loading="lazy" src="${esc(h.image)}" alt="${esc(h.title)}">${h.sample ? '<span class="tag sample">Sample</span>' : ''}</div>
  <div class="body"><div class="meta">${esc(h.location)}${stars(h.stars)}</div><h3>${esc(h.title)}</h3><p class="sh">${esc(h.short)}</p>
  <div class="foot"><span class="price">${h.price ? `<small>from </small>${money(h.price)}<small> per night</small>` : '<small>Rates on request</small>'}</span><a class="btn small dark" href="/contact.html?subject=${encodeURIComponent('Stay: ' + h.title)}">Enquire</a></div></div></article>`;
const skeletons = n => Array.from({ length: n }, () => '<div class="skel"></div>').join('');
const emptyMsg = t => `<div class="empty">${t}</div>`;

/* ---------- lightbox ---------- */
function lightbox(list) {
  const box = document.createElement('div'); box.id = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML = '<button class="x" aria-label="Close">&times;</button><button class="p" aria-label="Previous">&lsaquo;</button><img alt=""><button class="n" aria-label="Next">&rsaquo;</button>';
  document.body.append(box); let i = 0;
  const show = n => { i = (n + list.length) % list.length; $('img', box).src = list[i]; box.classList.add('on'); };
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('x')) box.classList.remove('on'); });
  $('.p', box).onclick = () => show(i - 1); $('.n', box).onclick = () => show(i + 1);
  addEventListener('keydown', e => { if (!box.classList.contains('on')) return; if (e.key === 'Escape') box.classList.remove('on'); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  return show;
}

/* ---------- pages ---------- */
const pages = {
  async home() {
    $('#arches').innerHTML = ['beach', 'sky', 'wildlife', 'wellness'].map(k => `<a class="arch" href="/tours.html?theme=${k}"><img loading="lazy" src="${THEMES[k].img}" alt=""><div><h3>${THEMES[k].label}</h3><p>${THEMES[k].blurb}</p></div></a>`).join('');
    const feat = $('#featured'); feat.innerHTML = skeletons(3);
    try { const l = await get('/api/packages?type=tour&featured=1&limit=6'); feat.innerHTML = l.length ? l.map(tourCard).join('') : emptyMsg('Tours are being updated. Send us an inquiry and we will plan your trip.'); } catch { feat.innerHTML = emptyMsg('Could not load tours right now.'); }
    const ex = $('#excursions'); ex.innerHTML = skeletons(3);
    try { const l = await get('/api/packages?type=excursion&featured=1&limit=3'); ex.innerHTML = l.length ? l.map(tourCard).join('') : emptyMsg('Excursions coming soon.'); } catch { ex.innerHTML = ''; }
    const show = lightbox(GALLERY);
    $('#gallery').innerHTML = GALLERY.map((s, i) => `<button data-i="${i}" aria-label="Open photo ${i + 1}"><img loading="lazy" src="${s}" alt="Travellers and places in Sri Lanka"></button>`).join('');
    $('#gallery').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  },

  async tours() {
    const type = document.body.dataset.type || 'tour', grid = $('#grid'), chips = $('#chips'), q = $('#q');
    let theme = new URLSearchParams(location.search).get('theme') || '', all = [];
    chips.innerHTML = `<button class="chip" data-t="">All</button>` + Object.entries(THEMES).map(([k, v]) => `<button class="chip" data-t="${k}">${v.label}</button>`).join('');
    const draw = () => {
      $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', c.dataset.t === theme));
      const term = q.value.toLowerCase(), l = all.filter(p => (!theme || p.themes.includes(theme)) && (p.title + p.short).toLowerCase().includes(term));
      grid.innerHTML = l.length ? l.map(tourCard).join('') : emptyMsg('Nothing matches yet. Tell us what you have in mind and we will build it for you. <br><a class="btn small" href="/contact.html">Send an inquiry</a>');
    };
    chips.onclick = e => { const c = e.target.closest('.chip'); if (c) { theme = c.dataset.t; draw(); } };
    q.oninput = draw; grid.innerHTML = skeletons(6);
    try { all = await get('/api/packages?type=' + type); draw(); } catch { grid.innerHTML = emptyMsg('Could not load the list. Please refresh.'); }
  },

  async stays() {
    const group = document.body.dataset.group, cats = STAY_CATS[group], chips = $('#chips'), grid = $('#grid');
    let cat = new URLSearchParams(location.search).get('cat') || '', all = [];
    chips.innerHTML = `<button class="chip" data-c="">All</button>` + Object.entries(cats).map(([k, v]) => `<button class="chip" data-c="${k}">${v}</button>`).join('');
    const draw = () => {
      $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed', c.dataset.c === cat));
      const l = all.filter(h => !cat || h.category === cat);
      grid.innerHTML = l.length ? l.map(hotelCard).join('') : emptyMsg('We are updating this list. Ask us for a shortlist and we will reply within a day. <br><a class="btn small" href="/contact.html?subject=' + encodeURIComponent((cats[cat] || 'Stays') + ' shortlist') + '">Ask for a shortlist</a>');
      if (cat && $('#cat-title')) $('#cat-title').textContent = cats[cat];
    };
    chips.onclick = e => { const c = e.target.closest('.chip'); if (c) { cat = c.dataset.c; history.replaceState(null, '', cat ? `?cat=${cat}` : location.pathname); draw(); } };
    grid.innerHTML = skeletons(3);
    try { all = await get('/api/hotels?group=' + group); draw(); } catch { grid.innerHTML = emptyMsg('Could not load the list. Please refresh.'); }
  },

  async package() {
    const slug = new URLSearchParams(location.search).get('slug'), root = $('#pkg');
    let p; try { p = await get('/api/packages/' + encodeURIComponent(slug)); } catch { root.innerHTML = emptyMsg('We could not find that package. <br><a class="btn small" href="/tours.html">See all tours</a>'); return; }
    const cfg = await get('/api/config').catch(() => ({ gateways: [], depositPercent: 30, currency: 'USD' })); cur.code = cfg.currency;
    document.title = p.title + ' | Crystal Holidays';
    const ban = $('.banner'); ban.style.backgroundImage = `url('${p.image}')`; $('h1', ban).textContent = p.title; $('p', ban).textContent = `${p.duration} \u00b7 ${themeTags(p) || (p.type === 'tour' ? 'Tour' : 'Excursion')}`;
    if (new URLSearchParams(location.search).get('cancelled')) $('#cancel').hidden = false;
    const gw = { payhere: 'Card or bank, via PayHere', stripe: 'International card, via Stripe', none: 'Reserve now, pay later' };
    const gateways = [...cfg.gateways, 'none'];
    root.innerHTML = `<div>
      <p class="muted" style="font-size:1.12rem">${esc(p.description || p.short)}</p>
      ${p.highlights.length ? `<h2>Highlights</h2><ul class="hl">${p.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
      ${p.itinerary.length ? `<h2>Itinerary</h2>${p.itinerary.map((d, i) => { const k = d.indexOf(': '), has = k > 0 && k < 24; return `<div class="day"><b>${esc(has ? d.slice(0, k) : 'Step ' + (i + 1))}</b><span>${esc(has ? d.slice(k + 2) : d)}</span></div>`; }).join('')}` : ''}
      ${p.included.length ? `<h2 style="margin-top:34px">What is included</h2><ul class="incl">${p.included.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
      <p class="muted" style="margin-top:28px">Everything can be adjusted: hotels, dates, pace and transport. <a href="/contact.html?subject=${encodeURIComponent('Custom plan: ' + p.title)}">Ask for a tailor-made version.</a></p></div>
    <aside class="book" id="book"><div class="price"><small>from </small>${p.price ? money(p.price) : 'On request'}<small> per person</small></div>
      <form id="bf" novalidate><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="two"><div><label for="date">Travel date</label><input id="date" name="date" type="date" required></div><div><label for="adults">Adults</label><input id="adults" name="adults" type="number" min="1" max="30" value="2"></div></div>
        <label for="children">Children 2-11 (half price)</label><input id="children" name="children" type="number" min="0" max="20" value="0">
        <label for="name">Full name</label><input id="name" name="name" autocomplete="name" required>
        <div class="two"><div><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" autocomplete="tel"></div></div>
        <label for="country">Country</label><input id="country" name="country" autocomplete="country-name">
        <label for="notes">Notes (optional)</label><textarea id="notes" name="notes" style="min-height:70px"></textarea>
        ${p.price ? `<label>Pay now</label><div class="radios"><label class="radio"><input type="radio" name="payment" value="deposit" checked> ${cfg.depositPercent}% deposit</label><label class="radio"><input type="radio" name="payment" value="full"> Full amount</label></div>
        <label>Payment method</label><div class="radios">${gateways.map((g, i) => `<label class="radio"><input type="radio" name="gateway" value="${g}" ${i === 0 ? 'checked' : ''}> ${gw[g]}</label>`).join('')}</div>
        <div class="total"><span>Trip total</span><span id="tot">-</span></div><div class="total big"><span>Due now</span><span id="due">-</span></div>` : '<p class="muted">This one is priced on request. Send us your dates and we will reply with a quote.</p>'}
        <div id="bmsg" role="alert"></div>
        <button class="btn" style="width:100%;justify-content:center;margin-top:14px" ${p.price ? '' : 'type="button" onclick="location.href=\'/contact.html?subject=' + encodeURIComponent('Quote: ' + p.title) + '\'"'}>${p.price ? 'Reserve my trip' : 'Request a quote'}</button>
      </form></aside>`;
    const f = $('#bf'), d = $('#date'); d.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    const calc = () => {
      const a = Math.max(1, +f.adults.value || 1), c = Math.max(0, +f.children.value || 0), t = a * p.price + c * p.price * .5, dep = f.payment?.value === 'deposit';
      if ($('#tot')) { $('#tot').textContent = money(t); $('#due').textContent = money(dep ? t * cfg.depositPercent / 100 : t); }
    };
    const label = () => { const g = f.gateway?.value; $('button', f).textContent = g && g !== 'none' ? 'Pay securely' : 'Reserve my trip'; };
    f.addEventListener('input', () => { calc(); label(); }); calc();
    if (!p.price) return;
    label();
    f.addEventListener('submit', async e => {
      e.preventDefault(); const btn = $('button', f), msg = $('#bmsg'); msg.innerHTML = '';
      if (f.website.value) return;
      const body = Object.fromEntries(new FormData(f)); body.packageId = p.id;
      if (!body.name.trim() || !/^\S+@\S+\.\S+$/.test(body.email) || !body.date) { msg.innerHTML = '<div class="msg err">Please add your name, email and travel date.</div>'; return; }
      btn.disabled = true; btn.textContent = 'Please wait...';
      try {
        const r = await post('/api/bookings', body);
        if (r.gateway === 'payhere') {
          const form = document.createElement('form'); form.method = 'POST'; form.action = r.action;
          Object.entries(r.fields).forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; form.append(i); });
          document.body.append(form); form.submit();
        } else if (r.gateway === 'stripe') location.href = r.url;
        else location.href = '/thanks.html?order=' + r.orderId;
      } catch (err) { msg.innerHTML = `<div class="msg err">${esc(err.message)}</div>`; btn.disabled = false; label(); }
    });
  },

  contact() {
    const sp = new URLSearchParams(location.search), f = $('#cf'), msg = $('#cmsg');
    if (sp.get('subject')) f.subject.value = sp.get('subject');
    f.addEventListener('submit', async e => {
      e.preventDefault(); const btn = $('button', f); msg.innerHTML = '';
      if (!f.checkValidity()) { f.reportValidity(); return; }
      btn.disabled = true;
      try { await post('/api/inquiries', Object.fromEntries(new FormData(f))); f.reset(); msg.innerHTML = '<div class="msg ok">Thank you. We have your message and will reply within one working day.</div>'; }
      catch (err) { msg.innerHTML = `<div class="msg err">${esc(err.message)}</div>`; }
      btn.disabled = false;
    });
  },

  async thanks() {
    const sp = new URLSearchParams(location.search), id = sp.get('order'), box = $('#result');
    if (!id) { box.innerHTML = '<p>No order found.</p>'; return; }
    if (sp.get('session_id')) await get(`/api/pay/stripe/confirm?order=${id}&session_id=${encodeURIComponent(sp.get('session_id'))}`).catch(() => {});
    try {
      let o = await get('/api/orders/' + id); cur.code = o.currency;
      if (o.status === 'awaiting_payment') { await new Promise(r => setTimeout(r, 3500)); o = await get('/api/orders/' + id); } // PayHere confirms a moment later
      const paid = ['paid', 'deposit_paid'].includes(o.status);
      const lines = { paid: 'Your payment was received. Thank you.', deposit_paid: 'Your deposit was received. Thank you.', reserved: 'Your reservation is noted. We will email you payment details.', awaiting_payment: 'We are still waiting for the bank to confirm your payment. You will get an email as soon as it arrives.', payment_failed: 'The payment did not go through. You can try again from the tour page, or send us an inquiry.' };
      box.innerHTML = `<h1>${paid ? 'Booking confirmed' : 'Thanks, ' + esc(o.name)}</h1><p class="lead">${lines[o.status] || ''}</p>
        <ul class="contact-list"><li><b>Reference:</b> ${esc(o.id)}</li><li><b>Trip:</b> ${esc(o.packageTitle)}</li><li><b>Travel date:</b> ${esc(o.date)}</li><li><b>Amount for this payment:</b> ${money(o.payNow)} of ${money(o.total)}</li></ul>
        <p>A member of our team will contact you to confirm hotels and details.</p><a class="btn" href="/">Back to home</a>`;
    } catch { box.innerHTML = '<p>We could not find that order. Please contact us with your reference.</p>'; }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  buildChrome();
  const fn = pages[document.body.dataset.page]; if (fn) fn();
});
