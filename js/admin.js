/* Crystal Holidays admin: edit tours, excursions, hotels; see bookings and inquiries */
(() => {
  const KEY = 'ch_admin', STAT = ['reserved', 'awaiting_payment', 'deposit_paid', 'paid', 'payment_failed', 'confirmed', 'cancelled'];
  const SCHEMA = {
    packages: [
      { k: 'title', l: 'Title', t: 'text', req: 1 },
      { k: 'type', l: 'Type', t: 'select', o: [['tour', 'Tour / package'], ['excursion', 'Excursion']] },
      { k: 'themes', l: 'Themes (used for filters)', t: 'themes' },
      { k: 'duration', l: 'Duration', t: 'text', h: 'e.g. 8 days, Half day' },
      { k: 'price', l: 'Price per person (set 0 for "on request")', t: 'number' },
      { k: 'short', l: 'Short description (card text)', t: 'text' },
      { k: 'description', l: 'Full description', t: 'area' },
      { k: 'highlights', l: 'Highlights (one per line)', t: 'lines' },
      { k: 'itinerary', l: 'Itinerary (one per line, like "Day 1: Arrive in Colombo")', t: 'lines' },
      { k: 'included', l: 'Included (one per line)', t: 'lines' },
      { k: 'image', l: 'Main photo', t: 'image' },
      { k: 'slug', l: 'Web address name (leave blank to create from title)', t: 'text' },
      { k: 'featured', l: 'Show on the home page', t: 'check' },
      { k: 'published', l: 'Visible on the website', t: 'check' },
    ],
    hotels: [
      { k: 'title', l: 'Name', t: 'text', req: 1 },
      { k: 'group', l: 'Section', t: 'select', o: [['accommodation', 'Accommodation'], ['maldives', 'Maldives']] },
      { k: 'category', l: 'Category', t: 'select', o: [] },
      { k: 'location', l: 'Location', t: 'text' },
      { k: 'stars', l: 'Stars (0 to 5)', t: 'number' },
      { k: 'price', l: 'From price per night (0 = on request)', t: 'number' },
      { k: 'short', l: 'Short description', t: 'area' },
      { k: 'image', l: 'Photo', t: 'image' },
      { k: 'sample', l: 'Show "Sample" badge (untick for real hotels)', t: 'check' },
      { k: 'published', l: 'Visible on the website', t: 'check' },
    ],
  };
  const CATS = { accommodation: [['beach', 'Beach Hotels'], ['boutique', 'Boutique Hotels'], ['colombo-city', 'Colombo City Hotels'], ['round-tour', 'Round Tour Hotels']], maldives: [['exclusive', 'Exclusive Resorts'], ['other', 'Other Resorts']] };
  const THEME_LIST = [['beach', 'Beach & Coast'], ['sky', 'Hills & Sky'], ['wildlife', 'Wildlife'], ['wellness', 'Ayurveda & Wellness'], ['culture', 'Culture & Heritage']];
  let tab = 'tours', data = {}, token = sessionStorage.getItem(KEY);

  const call = async (method, url, body) => {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 && token) { logout(); throw new Error('Session ended. Please log in again.'); }
    if (!r.ok) throw new Error(j.error || 'Something went wrong');
    return j;
  };
  function logout() { sessionStorage.removeItem(KEY); token = null; $('#panel').hidden = true; $('#login').hidden = false; }

  $('#lf').addEventListener('submit', async e => {
    e.preventDefault();
    try { const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: $('#pw').value }) }); const j = await r.json(); if (!r.ok) throw new Error(j.error); token = j.token; sessionStorage.setItem(KEY, token); start(); }
    catch (err) { $('#lmsg').innerHTML = `<div class="msg err">${esc(err.message)}</div>`; }
  });
  $('#logout').onclick = logout;

  const TABS = [['tours', 'Tours & packages'], ['excursions', 'Excursions'], ['hotels', 'Hotels & resorts'], ['bookings', 'Bookings'], ['inquiries', 'Inquiries']];
  function start() {
    $('#login').hidden = true; $('#panel').hidden = false;
    $('#tabs').innerHTML = TABS.map(([k, v]) => `<button class="chip" data-t="${k}">${v}</button>`).join('');
    $('#tabs').onclick = e => { const b = e.target.closest('.chip'); if (b) { tab = b.dataset.t; render(); } };
    render();
  }
  if (token) start();

  async function render() {
    $$('#tabs .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.t === tab));
    const view = $('#view'), bar = $('#toolbar'); view.innerHTML = '<p>Loading...</p>'; bar.innerHTML = '';
    try {
      if (tab === 'tours' || tab === 'excursions') {
        const type = tab === 'tours' ? 'tour' : 'excursion'; data.packages = await call('GET', '/api/admin/packages');
        bar.innerHTML = `<button class="btn small" id="add">+ Add ${type === 'tour' ? 'tour / package' : 'excursion'}</button>`; $('#add').onclick = () => edit('packages', { type, published: true, themes: [], highlights: [], itinerary: [], included: [] });
        table(data.packages.filter(p => p.type === type), 'packages', [['image', p => `<img src="${esc(p.image)}" alt="">`], ['Title', p => `<b>${esc(p.title)}</b><br><small>${esc(p.duration)}</small>`], ['Price', p => p.price ? '$' + p.price : 'On request'], ['Status', p => (p.published ? '<span class="pill">Live</span>' : '<span class="pill">Hidden</span>') + (p.featured ? ' <span class="pill">Home</span>' : '')]]);
      } else if (tab === 'hotels') {
        data.hotels = await call('GET', '/api/admin/hotels');
        bar.innerHTML = '<button class="btn small" id="add">+ Add hotel / resort</button>'; $('#add').onclick = () => edit('hotels', { group: 'accommodation', category: 'beach', published: true, stars: 4 });
        table(data.hotels, 'hotels', [['image', h => `<img src="${esc(h.image)}" alt="">`], ['Name', h => `<b>${esc(h.title)}</b><br><small>${esc(h.location)}</small>`], ['Section', h => esc(h.group + ' / ' + h.category)], ['Status', h => (h.published ? '<span class="pill">Live</span>' : '<span class="pill">Hidden</span>') + (h.sample ? ' <span class="pill">Sample</span>' : '')]]);
      } else if (tab === 'bookings') {
        const l = await call('GET', '/api/admin/bookings');
        view.innerHTML = l.length ? `<table class="tbl"><tr><th>Ref</th><th>Guest</th><th>Trip</th><th>Amounts</th><th>Status</th></tr>${l.map(o => `<tr><td><b>${esc(o.id)}</b><br><small>${esc(o.at.slice(0, 10))}</small></td><td>${esc(o.name)}<br><small><a href="mailto:${esc(o.email)}">${esc(o.email)}</a><br>${esc(o.phone)} ${esc(o.country)}</small></td><td>${esc(o.packageTitle)}<br><small>${esc(o.date)} - ${o.adults} adults, ${o.children} children</small>${o.notes ? `<br><small>${esc(o.notes)}</small>` : ''}</td><td>Total ${o.total} ${o.currency}<br><small>Due now ${o.payNow} (${esc(o.gateway)})</small></td><td><select data-id="${esc(o.id)}">${STAT.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</table>` : '<p>No bookings yet.</p>';
        view.onchange = async e => { if (e.target.dataset.id) await call('PATCH', '/api/admin/bookings/' + e.target.dataset.id, { status: e.target.value }); };
      } else {
        const l = await call('GET', '/api/admin/inquiries');
        view.innerHTML = l.length ? `<table class="tbl"><tr><th>Date</th><th>From</th><th>Message</th><th></th></tr>${l.map(i => `<tr><td>${esc(i.at.slice(0, 10))}</td><td><b>${esc(i.name)}</b><br><small><a href="mailto:${esc(i.email)}">${esc(i.email)}</a><br>${esc(i.phone)} ${esc(i.country)}</small></td><td><b>${esc(i.subject)}</b><br>${esc(i.message)}</td><td><button class="btn small ghost" style="color:var(--ink)" data-del="${esc(i.id)}">Delete</button></td></tr>`).join('')}</table>` : '<p>No inquiries yet.</p>';
        view.onclick = async e => { const id = e.target.dataset.del; if (id && confirm('Delete this inquiry?')) { await call('DELETE', '/api/admin/inquiries/' + id); render(); } };
      }
    } catch (err) { view.innerHTML = `<div class="msg err">${esc(err.message)}</div>`; }
  }

  function table(list, col, cols) {
    const view = $('#view'); view.onclick = null; view.onchange = null;
    view.innerHTML = list.length ? `<table class="tbl"><tr>${cols.map(c => `<th>${c[0] === 'image' ? '' : c[0]}</th>`).join('')}<th></th></tr>${list.map(x => `<tr>${cols.map(c => `<td>${c[1](x)}</td>`).join('')}<td style="white-space:nowrap"><button class="btn small dark" data-edit="${esc(x.id)}">Edit</button> <button class="btn small ghost" style="color:var(--ink)" data-del="${esc(x.id)}">Delete</button></td></tr>`).join('')}</table>` : '<p>Nothing here yet. Use the Add button.</p>';
    view.onclick = async e => {
      const ed = e.target.dataset.edit, del = e.target.dataset.del;
      if (ed) edit(col, data[col].find(x => x.id === ed));
      if (del && confirm('Delete this item? This cannot be undone.')) { await call('DELETE', `/api/admin/${col}/${del}`); render(); }
    };
  }

  function edit(col, item) {
    const f = $('#ef'), fields = SCHEMA[col], isNew = !item.id;
    f.innerHTML = `<h2>${isNew ? 'Add' : 'Edit'}</h2>` + fields.map(x => {
      const v = item[x.k], id = 'f_' + x.k, lab = `<label for="${id}">${x.l}</label>`, help = x.h ? `<div class="help">${x.h}</div>` : '';
      if (x.t === 'text') return lab + `<input id="${id}" name="${x.k}" value="${esc(v ?? '')}" ${x.req ? 'required' : ''}>` + help;
      if (x.t === 'number') return lab + `<input id="${id}" name="${x.k}" type="number" min="0" step="1" value="${esc(v ?? 0)}">`;
      if (x.t === 'area') return lab + `<textarea id="${id}" name="${x.k}">${esc(v ?? '')}</textarea>`;
      if (x.t === 'lines') return lab + `<textarea id="${id}" name="${x.k}" style="min-height:130px">${esc((v || []).join('\n'))}</textarea>`;
      if (x.t === 'select') return lab + `<select id="${id}" name="${x.k}">${(x.k === 'category' ? CATS[item.group || 'accommodation'] : x.o).map(([a, b]) => `<option value="${a}" ${a === v ? 'selected' : ''}>${b}</option>`).join('')}</select>`;
      if (x.t === 'themes') return `<label>${x.l}</label><div class="checks">${THEME_LIST.map(([a, b]) => `<label><input type="checkbox" name="themes" value="${a}" ${(v || []).includes(a) ? 'checked' : ''}> ${b}</label>`).join('')}</div>`;
      if (x.t === 'check') return `<label class="radio" style="margin-top:14px"><input type="checkbox" name="${x.k}" ${v ? 'checked' : ''}> ${x.l}</label>`;
      if (x.t === 'image') return lab + `<div class="imgrow"><img id="prev" src="${esc(v || '')}" alt=""><div style="flex:1"><input id="${id}" name="${x.k}" value="${esc(v ?? '')}" placeholder="/images/tours/example.jpg"><input type="file" id="file" accept="image/jpeg,image/png,image/webp" style="margin-top:8px"></div></div><div class="help">Upload a photo (JPG, PNG or WebP). Large photos are resized automatically.</div>`;
    }).join('') + `<div id="emsg" role="alert"></div><div style="display:flex;gap:10px;margin-top:20px"><button class="btn">Save</button><button type="button" class="btn ghost" id="cancel" style="color:var(--ink)">Cancel</button></div>`;
    $('#modal').classList.add('on'); $('#cancel').onclick = () => $('#modal').classList.remove('on');
    const grp = f.elements.group; if (grp) grp.onchange = () => { f.elements.category.innerHTML = CATS[grp.value].map(([a, b]) => `<option value="${a}">${b}</option>`).join(''); };
    const file = $('#file');
    if (file) file.onchange = async () => {
      const fl = file.files[0]; if (!fl) return; $('#emsg').innerHTML = '<div class="msg ok">Uploading...</div>';
      try {
        const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('That file is not a readable image.')); i.src = URL.createObjectURL(fl); });
        const s = Math.min(1, 1600 / img.width), c = document.createElement('canvas'); c.width = img.width * s; c.height = img.height * s; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const r = await call('POST', '/api/admin/upload', { data: c.toDataURL('image/jpeg', .86) });
        f.elements.image.value = r.path; $('#prev').src = r.path; $('#emsg').innerHTML = '<div class="msg ok">Photo uploaded. Press Save to keep it.</div>';
      } catch (err) { $('#emsg').innerHTML = `<div class="msg err">${esc(err.message)}</div>`; }
    };
    f.elements.image?.addEventListener('change', () => { $('#prev').src = f.elements.image.value; });
    f.onsubmit = async e => {
      e.preventDefault(); const body = {};
      fields.forEach(x => {
        if (x.t === 'check') body[x.k] = f.elements[x.k].checked;
        else if (x.t === 'themes') body.themes = [...f.querySelectorAll('input[name=themes]:checked')].map(i => i.value);
        else if (x.t === 'number') body[x.k] = +f.elements[x.k].value || 0;
        else body[x.k] = f.elements[x.k].value;
      });
      try { await call(isNew ? 'POST' : 'PUT', `/api/admin/${col}${isNew ? '' : '/' + item.id}`, body); $('#modal').classList.remove('on'); render(); }
      catch (err) { $('#emsg').innerHTML = `<div class="msg err">${esc(err.message)}</div>`; }
    };
  }
})();
