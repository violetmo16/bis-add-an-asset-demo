/* BIS Assets - Flow 1 demo. Screens: list > add asset > errors > leave dialog > created page > list with new card.
   Anything outside Flow 1 shows the "Sorry, not in this demo!" toast (default-deny, see the click handler at the bottom). */
(function () {
  'use strict';
  var D = window.DEMO;
  var app = document.getElementById('app');
  var overlay = document.getElementById('overlay');
  var toasts = document.getElementById('toasts');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- icons ---------- */
  function svg(inner, sz, sw, stroke, extra) {
    return '<svg aria-hidden="true" width="' + (sz || 16) + '" height="' + (sz || 16) + '" viewBox="0 0 24 24" fill="none" stroke="' + (stroke || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '>' + inner + '</svg>';
  }
  var P = {
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    clip: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 12h6M9 16h4"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15.5l2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'
  };
  function ico(name, sz, sw, stroke, extra) { return svg(P[name], sz, sw, stroke, extra); }
  function catIcon(cat, sz, sw) {
    var inner = cat === 'vehicles' ? '<path d="M2 6h12v10H2z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'
      : cat === 'heavy' ? '<path d="M3 18h18"/><path d="M5 18v-3a7 7 0 0 1 14 0v3"/><path d="M10 8V5h4v3"/>'
      : '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>';
    return svg(inner, sz, sw);
  }
  // Asset glyph: filled with the asset's real colour when it has one (D17)
  function assetIcon(cat, size, colour) {
    var f = colour ? D.PAL[colour] : 'none', s = colour ? '#191919' : 'currentColor', d = colour ? '#feffff' : 'none';
    var body = cat === 'vehicles' ? '<path d="M2 6h12v10H2z" fill="' + f + '"/><path d="M14 9h4l3 3v4h-7z" fill="' + f + '"/><circle cx="6.5" cy="17.5" r="1.8" fill="' + d + '"/><circle cx="17" cy="17.5" r="1.8" fill="' + d + '"/>'
      : cat === 'heavy' ? '<path d="M5 18v-3a7 7 0 0 1 14 0v3z" fill="' + f + '"/><path d="M3 18h18"/><path d="M10 8V5h4v3"/>'
      : '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" fill="' + f + '"/><path d="m9 12 2 2 4-4" stroke="' + d + '"/>';
    return svg(body, size, 1.6, s);
  }
  function stIcon(st, sz, sw) { return ico({ 'Active': 'check', 'Needs Inspection': 'clip', 'In Repair': 'wrench', 'Out of Service': 'ban' }[st], sz, sw); }
  function chip(st, lg) { return '<span class="chip-status ' + (lg ? 'chip-status--lg ' : '') + D.STATUS[st].cls + '">' + stIcon(st, lg ? 16 : 12, 2.6) + esc(st) + '</span>'; }
  function catLabel(id) { return D.CATS.filter(function (c) { return c.id === id; })[0].label; }

  /* ---------- state ---------- */
  var createdList = [], lastId = null, listCat = 'vehicles', nextNum = 27;   // assets created during this demo
  var BASE = { vehicles: D.VEHICLES, heavy: D.HEAVY, safety: D.SAFETY };
  function allIn(cat) { return BASE[cat].concat(createdList.filter(function (a) { return a.cat === cat; })); }
  function findCreated(id) { return createdList.filter(function (a) { return a.id === id; })[0]; }
  var form, ui;
  function blank(cat) { return { cat: cat || 'vehicles', name: '', type: '', status: '', manufacturer: '', model: '', serial: '', mileage: '', unit: 'km', hours: '', contact: '', phone: '', address: '', description: '', colour: '' }; }
  function resetForm(cat) { form = blank(cat); ui = { touched: {}, submitted: false, cleared: '', photo: null, photoErr: '', startCat: form.cat }; }
  resetForm('vehicles');
  var pendingLeave = null, leaveMode = 'add', vs = null;

  /* ---------- toast ---------- */
  var sorryEl = null, sorryTimer = null, okEl = null, okTimer = null;
  function dismiss(el) { if (!el) return; el.classList.add('is-leaving'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200); }
  function sorry() {
    if (!sorryEl || !sorryEl.isConnected) {
      sorryEl = document.createElement('div');
      sorryEl.className = 'feedback-toast feedback-toast--info'; sorryEl.setAttribute('role', 'status');
      sorryEl.innerHTML = ico('info', 20, 2.4, 'var(--color-surface-primary)', 'style="flex:0 0 20px;margin-top:1px"') + '<div style="flex:1"><strong>Sorry, not in this demo!</strong><div class="help">This part of the product isn\'t built yet.</div></div><button type="button" class="feedback-toast__close" aria-label="Dismiss" data-live data-act="close-toast">' + ico('x', 16, 2, '#666') + '</button>';
      toasts.appendChild(sorryEl);
    }
    sorryEl.classList.remove('is-leaving');
    clearTimeout(sorryTimer);
    sorryTimer = setTimeout(function () { dismiss(sorryEl); }, 3000);
  }
  function clearOk() { clearTimeout(okTimer); if (okEl && okEl.parentNode) okEl.parentNode.removeChild(okEl); okEl = null; }
  function okToast(html, actionsHtml) {
    clearOk();
    okEl = document.createElement('div');
    okEl.className = 'feedback-toast'; okEl.setAttribute('role', 'status');
    okEl.innerHTML = ico('check', 20, 2.4, 'var(--color-surface-success)', 'style="flex:0 0 20px;margin-top:1px"') +
      '<div style="flex:1;display:flex;flex-direction:column;gap:8px"><span>' + html + '</span>' + (actionsHtml ? '<div class="row" style="gap:4px">' + actionsHtml + '</div>' : '') + '</div>' +
      '<button type="button" class="feedback-toast__close" aria-label="Dismiss" data-live data-act="close-ok">' + ico('x', 16, 2, '#666') + '</button>';
    toasts.appendChild(okEl);
    var start = function () { clearTimeout(okTimer); okTimer = setTimeout(function () { dismiss(okEl); }, 10000); };   // toast-guide: 10 s, pauses on hover/focus
    okEl.addEventListener('mouseenter', function () { clearTimeout(okTimer); });
    okEl.addEventListener('mouseleave', start);
    okEl.addEventListener('focusin', function () { clearTimeout(okTimer); });
    okEl.addEventListener('focusout', start);
    start();
  }

  /* ---------- navigation ---------- */
  function isDirty() { return JSON.stringify(form) !== JSON.stringify(blank(ui.startCat)) || ui.photo; }
  function go(hash) {
    if (location.hash === '#/add' && isDirty() && hash !== '#/add') { openLeave(hash, 'add'); return; }
    if (viewDirty() && hash !== location.hash) { openLeave(hash, 'edit'); return; }
    if (location.hash === hash) route(); else location.hash = hash;
  }
  window.addEventListener('hashchange', route);
  function route() {
    var h = location.hash || '#/list';
    overlay.innerHTML = ''; pendingLeave = null; vs = null;
    clearOk();
    window.scrollTo(0, 0);
    var made = h.indexOf('#/asset/') === 0 ? findCreated(h.slice(8)) : null;
    if (h === '#/add') renderAdd();
    else if (made) renderView(made);
    else renderList(h === '#/list/new' ? lastId : null);
    var n = $('#nav-assets'); if (n) n.setAttribute('aria-current', 'page');
  }

  /* ---------- 1. Asset list ---------- */
  function renderList(tagId) {
    var items = allIn(listCat);
    var cl = catLabel(listCat);
    items.sort(function (a, b) { var d = D.ORDER[a.status] - D.ORDER[b.status]; return d || a.name.localeCompare(b.name); });
    var nv = items.length;
    var by = {}; items.forEach(function (a) { by[a.status] = (by[a.status] || 0) + 1; });
    var tabs = D.CATS.map(function (c) {
      return '<button type="button" role="tab" class="nav-tab' + (c.id === listCat ? ' is-selected' : '') + '" aria-selected="' + (c.id === listCat) + '" data-live data-act="tab" data-cat="' + c.id + '">' + catIcon(c.id, 16, 2) + '<span>' + c.label + '</span><span class="nav-tab__count">' + allIn(c.id).length + '</span></button>';
    }).join('');
    var sums = ['Active', 'Needs Inspection', 'In Repair', 'Out of Service'].map(function (s) {
      var c = { 'Active': '#167b00', 'Needs Inspection': '#a1851f', 'In Repair': '#a85200', 'Out of Service': '#cc2222' }[s];
      return '<button type="button" class="chip-summary" aria-pressed="false">' + stIcon(s, 16, 2.2).replace('currentColor', c) + '<span>' + s + '</span><b>' + (by[s] || 0) + '</b></button>';
    }).join('');
    var cards = items.map(function (a) {
      var st = D.STATUS[a.status], np = a.status === 'In Repair' || a.status === 'Out of Service';
      var isNew = a.id === tagId;
      var link = findCreated(a.id) ? '<a href="#/asset/' + a.id + '" data-live data-go="#/asset/' + a.id + '">' : '<a href="#">';
      return '<li class="card-asset' + (np ? ' card-asset--unusable' : '') + '" style="' + (np ? 'border-color:' + st.fg : '') + '"><div class="card-asset__strip" style="background:' + st.fg + '"></div><div class="card-asset__body">' +
        '<div class="row" style="gap:8px">' + chip(a.status, false) + (st.sub && a.status !== 'Needs Inspection' ? '<span style="font-size:12px;font-weight:700;color:' + st.fg + '">' + st.sub + '</span>' : '') + '</div>' +
        '<div class="row" style="gap:12px;flex-wrap:nowrap"><div class="card-asset__thumb" aria-hidden="true" style="background:' + st.bg + ';color:' + st.fg + ';border-color:' + st.fg + '33;overflow:hidden">' + (a.photo ? '<img src="' + a.photo.url + '" alt="" style="width:100%;height:100%;object-fit:cover">' : assetIcon(a.cat || 'vehicles', 28, a.colour)) + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:2px;min-width:0"><span style="font-size:12px;font-weight:700">' + esc(a.type) + (isNew ? '<span class="card-asset__new-tag">New</span>' : '') + '</span>' +
        '<h3>' + link + esc(a.name) + '</a></h3><span class="help">' + esc(a.make) + ' - ' + cl + '</span>' +
        (a.colour ? '<span class="help row" style="gap:6px"><span class="swatch" style="background:' + D.PAL[a.colour] + '"></span>' + a.colour + '</span>' : '') + '</div></div>' +
        '<div class="card-forms-line">' + ico('file', 16, 2, '#009acb', 'style="flex:0 0 16px;margin-top:2px"') + '<div style="display:flex;flex-direction:column;line-height:1.35"><span style="font-size:13px;font-weight:600">' + a.formsText + '</span><span class="help">' + a.formsMeta + '</span></div></div>' +
        '</div></li>';
    }).join('');
    app.innerHTML = '<main class="page"><div class="ph"><div><h1>Assets</h1><p class="muted">Vehicles, equipment and safety gear your team inspects. Status shows whether an asset can be used.</p></div>' +
      '<button type="button" class="button button--primary" data-live data-act="add">' + ico('plus', 16, 2.4) + 'Add asset</button></div>' +
      '<div class="tabbar"><div class="nav-tabs" role="tablist" aria-label="Asset category">' + tabs + '</div>' +
      '<div class="row" style="gap:8px;padding-bottom:8px"><span class="lbl muted">Showing</span><div class="nav-segmented"><button type="button" class="is-selected" aria-pressed="true">Active assets (' + nv + ')</button><button type="button" aria-pressed="false">Deactivated (' + D.DEACT[listCat] + ')</button></div></div></div>' +
      '<section class="row" aria-label="Status summary"><h2 class="lbl muted">Status in ' + cl + '</h2>' + sums + '</section>' +
      '<div class="toolbar"><div class="form-field" style="flex:1 1 360px;max-width:520px"><span class="lbl">Search assets</span><div class="form-search"><button type="button" style="border:0;border-right:1px solid #e2e2e3;background:#f8f8f9;padding:0 8px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:4px">Name ' + ico('chev', 12, 2.4) + '</button><div>' + ico('search', 16, 2, '#666') + '<input type="search" placeholder="Search by name, e.g. F-150" aria-label="Search assets" readonly data-nodemo></div></div></div>' +
      '<div class="form-field" style="width:200px"><span class="lbl">Type</span><button type="button" class="sel" style="display:flex;align-items:center;justify-content:space-between;text-align:left">All types ' + ico('chev', 14, 2.4) + '</button></div>' +
      '<div style="flex:1"></div><p class="muted" style="padding-bottom:6px" aria-live="polite">Showing <strong style="color:#191919">' + nv + '</strong> of ' + nv + ' vehicles</p></div>' +
      '<ul class="grid" aria-label="' + cl + '">' + cards + '</ul>' +
      '<nav class="nav-pagination" aria-label="Pagination"><span class="muted">Showing 1–' + nv + ' of ' + nv + ' - 25 per page</span><div class="row" style="gap:4px"><button type="button" class="is-disabled" disabled>Previous</button><button type="button" class="is-current" aria-current="page">1</button><button type="button" class="is-disabled" disabled>Next</button></div></nav></main>';

    var fa = tagId && findCreated(tagId);
    if (fa && fa.fresh) {
      fa.fresh = false;
      okToast('<strong>' + esc(fa.name) + '</strong> was added to ' + catLabel(fa.cat) + '.', '<button type="button" class="button button--tertiary button--sm" data-live data-act="another">Add another</button>');
    }
    if (fa) { var nl = document.querySelector('.card-asset a[href="#/asset/' + fa.id + '"]'); if (nl) nl.closest('.card-asset').scrollIntoView({ block: 'center' }); }
  }

  /* ---------- 2. Add asset ---------- */
  var HELP = { name: 'Use the name your crew will search for, like make, model and unit number.', type: '', status: 'Not inspected yet? Choose Needs Inspection.', mileage: 'Current odometer reading.', hours: 'Current hour meter reading.', phone: '10 digits, e.g. (780) 555-0123' };
  var LABEL = { name: 'Name', type: 'Type', status: 'Status', mileage: 'Mileage', hours: 'Operating hours', phone: 'Work phone' };
  function validateD(f, cat) {
    var e = {}, order = ['name', 'type', 'status', 'mileage', 'hours', 'phone'];
    if (!f.name.trim()) e.name = 'Enter a name so your team can find this asset.';
    if (!f.type) e.type = 'Choose a type so the right inspection forms can be assigned.';
    if (!f.status) e.status = 'Choose a status so your team knows if this asset can be used.';
    if (cat === 'vehicles' && f.mileage && !/^\d[\d,]*(\.\d+)?$/.test(f.mileage)) e.mileage = 'Enter mileage as a number, e.g. 12500.';
    if (cat === 'heavy' && f.hours && !/^\d[\d,]*(\.\d+)?$/.test(f.hours)) e.hours = 'Enter hours as a number, e.g. 1320.';
    if (f.phone && f.phone.replace(/\D/g, '').length !== 10) e.phone = 'Enter a 10-digit phone number, e.g. (780) 555-0123.';
    return { errors: e, keys: order.filter(function (k) { return e[k]; }) };
  }
  function validate() { return validateD(form, form.cat); }
  function field(k, label, opts) {
    opts = opts || {};
    var ph = opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '';
    var type = opts.type || 'text';
    return '<div class="form-field' + (opts.cls ? ' ' + opts.cls : '') + '"><label for="f-' + k + '">' + label + '</label><input class="form-input" id="f-' + k + '" data-k="' + k + '" type="' + type + '" value="' + esc(form[k]) + '"' + ph + (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : '') + ' aria-describedby="m-' + k + '"><span class="help" id="m-' + k + '" hidden></span></div>';
  }
  function colourRadios(sel, name, attr) {
    return ['None'].concat(Object.keys(D.PAL)).map(function (n) {
      var val = n === 'None' ? '' : n, on = (sel || '') === val;
      return '<label class="form-swatch' + (on ? ' is-selected' : '') + '"><input type="radio" name="' + name + '" value="' + val + '" ' + (attr || 'data-colour') + (on ? ' checked' : '') + '><i style="' + (val ? 'background:' + D.PAL[val] + (val === 'White' ? ';border-color:#b2b2b3' : '') : 'border-style:dashed;border-color:#b2b2b3;background:transparent') + '"></i>' + n + '</label>';
    }).join('');
  }
  function renderAdd() {
    var f = form, cat = D.CATS.filter(function (c) { return c.id === f.cat; })[0];
    var y = window.scrollY;
    var catCards = D.CATS.map(function (c) {
      var on = c.id === f.cat;
      return '<label class="card-radio' + (on ? ' is-selected' : '') + '"><input type="radio" name="category" value="' + c.id + '" data-cat' + (on ? ' checked' : '') + '><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="card-radio__icon" aria-hidden="true">' + catIcon(c.id, 22, 1.8) + '</span>' +
        (on ? '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#0078b3" stroke="#feffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke="none"/><path d="m8 12 3 3 5-6"/></svg>' : '') +
        '</div><span style="font-weight:600">' + c.label + '</span><span class="help" style="line-height:1.4">' + c.types.join(', ') + '</span></label>';
    }).join('');
    var typeOpts = '<option value="">Choose a type</option>' + cat.types.map(function (t) { return '<option' + (f.type === t ? ' selected' : '') + '>' + t + '</option>'; }).join('');
    var statusOpts = '<option value="">Choose a status</option>' + ['Needs Inspection', 'Active', 'In Repair', 'Out of Service'].map(function (s) { return '<option' + (f.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    var photo = ui.photo
      ? '<div class="row" style="gap:16px"><img src="' + ui.photo.url + '" alt="Selected photo preview" style="width:160px;aspect-ratio:4/3;object-fit:cover;border-radius:8px"><div style="display:flex;flex-direction:column;gap:4px;min-width:0"><strong style="font-size:13px;overflow-wrap:anywhere">' + esc(ui.photo.name) + '</strong><span class="help">' + fmtSize(ui.photo.size) + '</span><div class="row" style="gap:4px;margin-left:-8px"><button type="button" class="button button--tertiary button--sm" data-act="photo">Replace</button><button type="button" class="button button--tertiary button--sm" data-act="photo-remove">Remove</button></div></div></div>'
      : '<div class="form-photo-upload" id="dropzone"><span class="form-photo-upload__icon" aria-hidden="true">' + ico('photo', 24, 1.8) + '</span><div style="display:flex;flex-direction:column;flex:1 1 260px"><span>Drag a photo here or <button type="button" class="link-btn" data-act="photo">browse</button></span><span class="help">JPG, PNG or WebP, up to 10 MB. Without a photo, the card shows the type icon.</span></div></div>';
    photo += '<span class="help is-error" role="alert" id="m-photo"' + (ui.photoErr ? '' : ' hidden') + '>' + esc(ui.photoErr) + '</span>';
    var usage = f.cat === 'vehicles'
      ? '<div class="form-field span2"><label for="f-mileage">Mileage</label><div class="row" style="gap:8px;flex-wrap:nowrap"><input class="form-input" id="f-mileage" data-k="mileage" inputmode="numeric" value="' + esc(f.mileage) + '" aria-describedby="m-mileage"><select class="form-input" style="width:80px" aria-label="Mileage unit" data-k="unit"><option' + (f.unit === 'km' ? ' selected' : '') + '>km</option><option' + (f.unit === 'mi' ? ' selected' : '') + '>mi</option></select></div><span class="help" id="m-mileage" hidden></span></div>'
      : f.cat === 'heavy' ? field('hours', 'Operating hours', { inputmode: 'numeric' }) : '';
    var ph = f.cat === 'vehicles' ? ['e.g. Ford', 'e.g. F-150 XLT'] : f.cat === 'heavy' ? ['e.g. Caterpillar', 'e.g. 320 GC'] : ['e.g. MSA', 'e.g. Altair 4XR'];
    app.innerHTML = '<main class="page narrow" data-live id="addmain">' +
      '<nav aria-label="Breadcrumb"><ol class="nav-breadcrumb"><li><button type="button" data-go="#/list">Assets</button></li><li aria-hidden="true">›</li><li><button type="button" data-go="#/list">' + cat.label + '</button></li><li aria-hidden="true">›</li><li aria-current="page" style="color:#191919">Add asset</li></ol></nav>' +
      '<div style="display:flex;flex-direction:column;gap:6px"><h1 style="font-size:28px;font-weight:600;line-height:1.25">Add asset</h1><p class="muted">Register an asset so your team can start running inspections on it.</p><p class="muted" style="font-size:13px"><span class="req">*</span> Required</p></div>' +
      '<div id="sum"></div>' +
      '<section class="panel" aria-labelledby="s-basics"><div><h2 id="s-basics">Basics</h2><p class="help" style="font-size:13px">What your team needs to find this asset and start inspections.</p></div>' +
      '<fieldset style="border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:8px"><legend style="padding:0 0 8px;font-size:13px;font-weight:600">Category <span class="req">*</span></legend><div class="card-radio-group">' + catCards + '</div><span class="help">Pre-selected from the tab you came from. It decides which types, forms and fields this asset gets.</span></fieldset>' +
      '<div class="form-field"><label for="f-name">Name <span class="req">*</span></label><input class="form-input" id="f-name" data-k="name" type="text" maxlength="80" value="' + esc(f.name) + '" placeholder="e.g. Ford F-150 #14" aria-describedby="m-name"><span class="help" id="m-name"></span><div id="dup"></div></div>' +
      '<div class="g2"><div class="form-field"><label for="f-type">Type <span class="req">*</span></label><select class="form-input" id="f-type" data-k="type" aria-describedby="m-type">' + typeOpts + '</select><span class="help help--info" id="typenote" hidden></span><span class="help" id="m-type" hidden></span></div>' +
      '<div class="form-field"><label for="f-status">Status <span class="req">*</span> <span title="Status options are set by administrators with access to Assets settings (Admin › Assets › gear icon)." style="color:#009acb;vertical-align:-2px;margin-left:4px">' + ico('info', 14, 2.2) + '</span></label><div class="form-status-select"><span class="form-status-select__dot" id="sdot"></span><select class="form-input" id="f-status" data-k="status" aria-describedby="m-status">' + statusOpts + '</select></div><span class="help" id="m-status"></span></div></div></section>' +
      '<section class="panel" style="gap:12px" aria-labelledby="s-photo"><h2 id="s-photo">Photo <span style="font-size:14px;font-weight:400;color:#666">(optional)</span></h2>' + photo + '</section>' +
      '<section class="panel" aria-labelledby="s-det"><div><h2 id="s-det">Details <span style="font-size:14px;font-weight:400;color:#666">(optional)</span></h2><p class="help" style="font-size:13px">You can add or change these later on the asset\'s page.</p></div>' +
      '<div class="g3"><p class="grp-t">Identification</p>' + field('manufacturer', 'Manufacturer', { ph: ph[0] }) + field('model', 'Model', { ph: ph[1] }) +
      '<div class="form-field"><label for="f-serial">' + (f.cat === 'vehicles' ? 'Serial number / VIN' : 'Serial number') + '</label><input class="form-input" id="f-serial" data-k="serial" value="' + esc(f.serial) + '">' + (f.cat === 'safety' ? '<span class="help">Recommended: it\'s printed on the calibration certificate.</span>' : '') + '</div>' +
      '<div class="span-all form-field" role="radiogroup" aria-labelledby="g-col"><span class="form-field__label" id="g-col">Asset colour <span style="font-weight:400;color:#666">(optional)</span></span><div class="form-swatch-group">' + colourRadios(f.colour, 'colour') + '</div><span class="help">The asset\'s actual colour, like its paint. Shown on its card so crews can spot it on site. It never changes status.</span></div></div>' +
      (usage ? '<div class="g3 grp"><p class="grp-t">Usage</p>' + usage + '</div>' : '') +
      '<div class="g3 grp"><p class="grp-t">Contact</p>' + field('contact', 'Main contact') + field('phone', 'Work phone', { type: 'tel' }) + field('address', 'Address') + '</div>' +
      '<div class="grp form-field"><label for="f-description">Description</label><textarea class="form-input" id="f-description" data-k="description" rows="3" placeholder="e.g. Crew truck for the Westgate site. First aid kit under rear seat.">' + esc(f.description) + '</textarea></div></section>' +
      '<div class="note-info">' + ico('info', 18, 2, '#0078b3', 'style="flex:0 0 18px;margin-top:2px"') + '<p style="font-size:13px">Forms and notes appear on the asset\'s page after you create it. From there you can set up its inspections.</p></div></main>' +
      '<div class="feedback-sticky-bar" data-live><div><span class="muted" style="font-size:13px" id="fnote"></span><div class="sp"></div><button type="button" class="button button--tertiary" data-act="cancel">Cancel</button><button type="button" class="button button--primary" data-act="create">Create asset</button></div></div>';
    sync();
    window.scrollTo(0, y);
  }
  function sync() {
    if (location.hash !== '#/add') return;
    var v = validate(), f = form;
    ['name', 'type', 'status', 'mileage', 'hours', 'phone'].forEach(function (k) {
      var el = $('#f-' + k), m = $('#m-' + k); if (!el || !m) return;
      var bad = !!v.errors[k] && (ui.submitted || !!ui.touched[k]);
      el.classList.toggle('is-error', bad); el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      var t = bad ? v.errors[k] : HELP[k]; m.textContent = t || ''; m.hidden = !t; m.className = 'help' + (bad ? ' is-error' : '');
    });
    var sum = $('#sum');
    if (sum) sum.innerHTML = (ui.submitted && v.keys.length)
      ? '<div class="feedback-error-summary" role="alert">' + ico('info', 20, 2.4, '#cc2222', 'style="flex:0 0 20px;margin-top:2px"') + '<div><h2>Fix ' + v.keys.length + (v.keys.length === 1 ? ' field' : ' fields') + ' to create this asset</h2><ul>' + v.keys.map(function (k) { return '<li><a href="#" data-live data-focus="f-' + k + '">' + LABEL[k] + ': ' + v.errors[k] + '</a></li>'; }).join('') + '</ul></div></div>' : '';
    var key = f.name.trim().toLowerCase();
    var dupA = key ? allIn(f.cat).filter(function (a) { return a.name.toLowerCase() === key; })[0] : null;
    var dupLive = dupA && findCreated(dupA.id);
    $('#dup').innerHTML = dupA ? '<div class="dup" role="status" style="margin-top:4px">' + ico('warn', 16, 2.2, '#8a6d00', 'style="flex:0 0 16px;margin-top:2px"') + '<span>An asset named <strong>' + esc(f.name.trim()) + '</strong> is already in ' + catLabel(f.cat) + '. ' + (dupLive ? '<a href="#/asset/' + dupA.id + '" data-live data-go="#/asset/' + dupA.id + '">View it</a>' : '<a href="#">View it</a>') + '. You can still create this one.</span></div>' : '';
    var tn = $('#typenote'); tn.hidden = !ui.cleared;
    tn.innerHTML = ui.cleared ? ico('info', 14, 2.2, 'currentColor', 'style="flex:0 0 14px;margin-top:2px"') + 'Type cleared: ' + esc(ui.cleared) + ' isn\'t a ' + catLabel(f.cat) + ' type. Choose one from the list.' : '';
    var dot = $('#sdot'), col = f.status ? D.STATUS[f.status].fg : 'transparent';
    dot.style.background = col; dot.style.boxShadow = f.status ? 'none' : 'inset 0 0 0 1.5px #b2b2b3';
    $('#fnote').textContent = v.keys.length === 0 ? 'Ready to create in ' + catLabel(f.cat) + '.' : (ui.submitted ? v.keys.length + (v.keys.length === 1 ? ' field needs' : ' fields need') + ' attention.' : 'Fill in the required fields to create this asset.');
  }
  function fmtSize(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  function createAsset() {
    var f = form, mm = [f.manufacturer.trim(), f.model.trim()].filter(Boolean).join(' ');
    var a = { id: 'v' + (nextNum++), cat: f.cat, name: f.name.trim(), type: f.type, status: f.status, make: mm || f.type, colour: f.colour,
      formsText: 'No forms yet', formsMeta: 'No inspections on record', d: Object.assign({}, f), photo: ui.photo, fresh: true };
    createdList.push(a); lastId = a.id; listCat = a.cat;
    resetForm(f.cat);
    location.hash = '#/asset/' + a.id;
  }
  // Photo upload: real file picker or drag and drop; JPG, PNG or WebP up to 10 MB (plan 4.2)
  function takeFile(file) {
    var onAdd = location.hash === '#/add', A = curAsset();
    if (!file || (!onAdd && !A)) return;
    function err(m) { if (onAdd) { ui.photoErr = m; renderAdd(); } else { vs.photoErr = m; renderView(A, true); } }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { err('This file isn\'t a JPG, PNG or WebP image. Choose a photo in one of those formats.'); return; }
    if (file.size > 10 * 1048576) { err('This file is ' + fmtSize(file.size) + '. Choose a photo under 10 MB.'); return; }
    var r = new FileReader();
    r.onload = function () {
      var ph = { url: r.result, name: file.name, size: file.size };
      if (onAdd) { ui.photoErr = ''; ui.photo = ph; renderAdd(); }
      else { A.photo = ph; vs.photoErr = ''; renderView(A, true); okToast('Photo updated for <strong>' + esc(A.name) + '</strong>.'); }
    };
    r.readAsDataURL(file);
  }

  /* leave guard */
  function openLeave(target, mode) {
    pendingLeave = target; leaveMode = mode || 'add';
    var edit = leaveMode === 'edit';
    overlay.innerHTML = '<div class="feedback-dialog__overlay" data-live><div class="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="lt" aria-describedby="lb"><h2 id="lt">' + (edit ? 'Discard your changes?' : 'Discard this asset?') + '</h2><p id="lb">' + (edit ? 'Your changes to ' + esc(vs.d.name.trim() || 'this asset') + ' haven\'t been saved. If you leave now, they\'ll be lost.' : 'The details you entered for ' + esc(form.name.trim() || 'this asset') + ' haven\'t been saved. If you leave now, they\'ll be lost.') + '</p><div class="feedback-dialog__actions"><button type="button" class="button button--error-outline" data-act="discard">Discard</button><button type="button" class="button button--primary" data-act="stay" id="stay">Keep editing</button></div></div></div>';
    var s = $('#stay'); if (s) s.focus();
  }

  /* ---------- 3. Asset page for an asset created in the demo (edit details, change photo, add notes) ---------- */
  var TODAY = '2026/10/10';
  var DKEYS = ['name', 'type', 'status', 'manufacturer', 'model', 'serial', 'mileage', 'unit', 'hours', 'contact', 'phone', 'address', 'description', 'colour'];
  var DLABEL = { name: 'Name', type: 'Type', status: 'Status', manufacturer: 'Manufacturer', model: 'Model', serial: 'Serial number', mileage: 'Mileage', unit: 'Mileage unit', hours: 'Operating hours', contact: 'Main contact', phone: 'Work phone', address: 'Address', description: 'Description', colour: 'Asset colour' };
  function curAsset() { var h = location.hash; return h.indexOf('#/asset/') === 0 ? findCreated(h.slice(8)) : null; }
  function changedKeys() { var A = curAsset(); if (!A || !vs) return []; return DKEYS.filter(function (k) { return (vs.d[k] || '') !== (A.d[k] || ''); }); }
  function viewDirty() { return changedKeys().length > 0; }
  function renderView(A, keep) {
    if (!vs || vs.id !== A.id) vs = { id: A.id, d: Object.assign({}, A.d), touched: {}, tried: false, noteErr: false };
    var y = window.scrollY, d = A.d, cat = A.cat, e = vs.d, ct = D.CATS.filter(function (c) { return c.id === cat; })[0];
    var st = D.STATUS[d.status], notUsable = d.status === 'Out of Service' || d.status === 'In Repair';
    function ef(k, label, o) {
      o = o || {};
      return '<div class="form-field ' + (o.cls || '') + '"><label for="e-' + k + '">' + label + (o.req ? ' <span class="req">*</span>' : '') + '</label><input class="form-input" id="e-' + k + '" data-ek="' + k + '" type="' + (o.type || 'text') + '" value="' + esc(e[k]) + '"' + (o.ph ? ' placeholder="' + o.ph + '"' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + ' aria-describedby="em-' + k + '"><span class="help" id="em-' + k + '" hidden></span></div>';
    }
    var typeOpts = ct.types.map(function (t) { return '<option' + (e.type === t ? ' selected' : '') + '>' + t + '</option>'; }).join('');
    var statusOpts = ['Needs Inspection', 'Active', 'In Repair', 'Out of Service'].map(function (s) { return '<option' + (e.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    var usage = cat === 'vehicles'
      ? '<div class="g4 grp"><p class="grp-t" style="font-size:12px">Usage</p><div class="form-field span2"><label for="e-mileage">Mileage</label><div class="row" style="gap:8px;flex-wrap:nowrap"><input class="form-input" id="e-mileage" data-ek="mileage" inputmode="numeric" value="' + esc(e.mileage) + '" aria-describedby="em-mileage"><select class="form-input" style="width:80px" aria-label="Mileage unit" data-ek="unit"><option' + (e.unit === 'km' ? ' selected' : '') + '>km</option><option' + (e.unit === 'mi' ? ' selected' : '') + '>mi</option></select></div><span class="help" id="em-mileage" hidden></span></div></div>'
      : cat === 'heavy' ? '<div class="g4 grp"><p class="grp-t" style="font-size:12px">Usage</p>' + ef('hours', 'Operating hours', { inputmode: 'numeric' }) + '</div>' : '';
    var photo = A.photo
      ? '<img class="photo" src="' + A.photo.url + '" alt="Photo of ' + esc(d.name) + '"><div class="row" style="gap:4px"><button type="button" class="button button--tertiary button--sm" data-act="vphoto">Replace</button><button type="button" class="button button--tertiary button--sm" data-act="vphoto-remove">Remove</button></div>'
      : '<div class="phph" id="dropzone">' + assetIcon(cat, 40, '') + '<span style="font-size:13px">Drag a photo here or <button type="button" class="link-btn" data-act="vphoto">browse</button></span><span class="help">JPG, PNG or WebP, up to 10 MB</span></div>';
    photo += '<span class="help is-error" role="alert" id="m-photo"' + (vs.photoErr ? '' : ' hidden') + '>' + esc(vs.photoErr || '') + '</span>';
    var notes = (A.notes || []).map(function (n) { return '<li style="padding:12px 0;border-top:1px solid #e2e2e3;display:flex;flex-direction:column;gap:4px"><span class="help"><strong style="color:#191919">' + n.by + '</strong> - ' + n.date + '</span><span style="white-space:pre-wrap;overflow-wrap:anywhere">' + esc(n.text) + '</span></li>'; }).join('');
    app.innerHTML = '<main class="page view" data-live>' +
      '<nav aria-label="Breadcrumb"><ol class="nav-breadcrumb"><li><a href="#/list" data-go="#/list">Assets</a></li><li aria-hidden="true">›</li><li><a href="#/list" data-go="#/list">' + ct.label + '</a></li><li aria-hidden="true">›</li><li aria-current="page" style="color:#191919">' + esc(d.name) + '</li></ol></nav>' +
      '<div class="dh"><div class="row" style="gap:16px;flex-wrap:nowrap"><div class="ico" aria-hidden="true">' + assetIcon(cat, 32, '') + '</div><div style="display:flex;flex-direction:column;gap:8px"><h1 style="overflow-wrap:anywhere">' + esc(d.name) + '</h1><div class="row">' + chip(d.status, true) + (d.status === 'Needs Inspection' ? '<span class="help" style="font-size:13px">Inspect before use</span>' : '') + '<span class="help" style="font-size:13px">' + esc(d.type) + ' - ' + ct.label + ' - Created today</span></div></div></div>' +
      '<button type="button" class="button button--secondary" aria-haspopup="menu" data-nolive>More ' + ico('chev', 16, 2.2) + '</button></div>' +
      (notUsable ? '<div role="alert" style="display:flex;gap:12px;padding:14px 16px;border-radius:8px;background:' + st.bg + ';border:2px solid ' + st.fg + ';color:' + st.fg + '"><strong>' + d.status + ': ' + (d.status === 'Out of Service' ? 'do not use this asset.' : 'not usable until it\'s back in service.') + '</strong></div>' : '') +
      '<section class="next" aria-labelledby="nx"><div aria-hidden="true" style="width:40px;height:40px;flex:0 0 40px;border-radius:999px;background:#feffff;display:flex;align-items:center;justify-content:center">' + ico('cal', 20, 2, '#0078b3') + '</div><div style="display:flex;flex-direction:column;gap:4px;flex:1 1 420px"><p style="font-size:12px;font-weight:600;color:#0078b3">Next step</p><h2 id="nx" style="font-size:18px;font-weight:600">Set up inspections for ' + esc(d.name) + '</h2><p>Assign the forms your team will run on it, like a pre-trip or a monthly inspection. Keep it as Needs Inspection until its first inspection is completed.</p></div><div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start"><button type="button" class="button button--secondary" data-nolive>Go to Scheduled Forms</button><span class="help">Opens Scheduled Forms (outside this redesign)</span></div></section>' +
      '<div class="cols"><div class="colmain"><section class="panel tight" aria-labelledby="forms-t"><div class="row" style="padding-bottom:14px"><h2 id="forms-t" style="font-size:18px;font-weight:600">Forms</h2></div><div class="feedback-empty-state">' + ico('file', 32, 1.6, '#009acb') + '<strong>No forms yet</strong><span class="help" style="max-width:420px">When forms are sent for this asset, you\'ll see what\'s in progress and what\'s been completed here.</span></div></section>' +
      '<section class="panel" aria-labelledby="det-t"><div class="row" style="justify-content:space-between;align-items:baseline"><h2 id="det-t">Details</h2><span class="help">Edit any field. <span class="req">*</span> Required</span></div>' +
      '<div class="g4"><p class="grp-t" style="font-size:12px">Basics</p>' + ef('name', 'Name', { req: true, max: 80 }).replace('</span></div>', '</span><span class="help" id="eh-name">Use the name your crew will search for.</span></div>') +
      '<div class="form-field"><span class="form-field__label">Category</span><div class="form-input is-readonly">' + ct.label + '</div><span class="help">To change it, use More › Move to category.</span></div>' +
      '<div class="form-field"><label for="e-type">Type <span class="req">*</span></label><select class="form-input" id="e-type" data-ek="type">' + typeOpts + '</select></div>' +
      '<div class="form-field"><label for="e-status">Status <span class="req">*</span></label><div class="form-status-select"><span class="form-status-select__dot" id="esdot"></span><select class="form-input" id="e-status" data-ek="status">' + statusOpts + '</select></div><span class="help">Changing to In Repair or Out of Service? Add a note with the reason.</span></div></div>' +
      '<div class="g4 grp"><p class="grp-t" style="font-size:12px">Identification</p>' + ef('manufacturer', 'Manufacturer') + ef('model', 'Model') + ef('serial', cat === 'vehicles' ? 'Serial number / VIN' : 'Serial number', { cls: 'span2', ph: 'Not added yet' }) +
      '<div class="span-all form-field" role="radiogroup" aria-labelledby="g-ecol"><span class="form-field__label" id="g-ecol">Asset colour <span style="font-weight:400;color:#666">(optional)</span></span><div class="form-swatch-group">' + colourRadios(e.colour, 'ecolour', 'data-ecolour') + '</div><span class="help">The asset\'s actual colour, like its paint. Shown on its card so crews can spot it on site. It never changes status.</span></div></div>' + usage +
      '<div class="g4 grp"><p class="grp-t" style="font-size:12px">Contact</p>' + ef('contact', 'Main contact') + ef('phone', 'Work phone', { type: 'tel' }) + ef('address', 'Address', { cls: 'span2' }) + '</div>' +
      '<div class="grp form-field"><label for="e-description">Description</label><textarea class="form-input" id="e-description" data-ek="description" rows="3">' + esc(e.description) + '</textarea></div>' +
      '<div class="grp row help" style="gap:24px"><span>Asset ID: <strong style="color:#191919">' + A.id + '</strong> (auto-generated)</span><span>Created ' + TODAY + ' by Dana Whitfield</span></div></section></div>' +
      '<aside class="colside"><section class="panel" style="gap:12px" aria-labelledby="ph-t"><h2 id="ph-t">Photo</h2>' + photo + '</section>' +
      '<section class="panel" style="gap:12px" aria-labelledby="nt-t"><h2 id="nt-t">Notes</h2><div class="form-field"><label for="note-new">Add a note</label><textarea class="form-input" id="note-new" rows="3" placeholder="e.g. Front tires replaced, ready for pre-trip.">' + esc(vs.noteDraft || '') + '</textarea><span class="help is-error" id="note-err" hidden>Write a note before adding it.</span><span class="help" id="note-help">Visible to everyone who can open this asset.</span></div><button type="button" class="button button--secondary" style="align-self:flex-start" data-act="add-note">Add note</button>' +
      (notes ? '<ul style="list-style:none;margin:0;padding:0">' + notes + '</ul>' : '<p class="help" style="padding-top:12px;border-top:1px solid #e2e2e3;font-size:13px">No notes yet. Use notes for anything the crew should know, like damage or a booked repair.</p>') +
      '</section></aside></div></main><div class="feedback-sticky-bar" id="ubar" data-live hidden></div>';
    syncView();
    if (keep) window.scrollTo(0, y);
    if (A.fresh) { A.fresh = false; okToast('<strong>' + esc(d.name) + '</strong> was added to ' + ct.label + '.', '<button type="button" class="button button--secondary button--sm" data-live data-act="viewlist">View in list</button><button type="button" class="button button--tertiary button--sm" data-live data-act="another">Add another</button>'); }
  }
  function syncView() {
    var A = curAsset(); if (!A || !vs) return;
    var v = validateD(vs.d, A.cat), ch = changedKeys();
    ['name', 'type', 'status', 'mileage', 'hours', 'phone'].forEach(function (k) {
      var el = $('#e-' + k), m = $('#em-' + k); if (!el || !m) return;
      var bad = !!v.errors[k] && (vs.tried || !!vs.touched[k] || ch.indexOf(k) >= 0);
      el.classList.toggle('is-error', bad); el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      var t = bad ? v.errors[k] : (HELP[k] && k !== 'name' && k !== 'status' ? HELP[k] : ''); m.textContent = t; m.hidden = !t; m.className = 'help' + (bad ? ' is-error' : '');
    });
    var dot = $('#esdot'); if (dot) dot.style.background = vs.d.status ? D.STATUS[vs.d.status].fg : 'transparent';
    var ne = $('#note-err'); if (ne) ne.hidden = !vs.noteErr;
    var bar = $('#ubar'); if (!bar) return;
    bar.hidden = ch.length === 0;
    bar.innerHTML = ch.length ? '<div style="max-width:1376px"><div style="display:flex;align-items:center;gap:12px;width:100%">' + ico('clock', 18, 2.2, '#a1851f') + '<span style="font-weight:600">Unsaved changes</span><span class="muted" style="font-size:13px">' + (ch.length === 1 ? DLABEL[ch[0]] + ' changed' : ch.length + ' fields changed: ' + ch.map(function (k) { return DLABEL[k]; }).join(', ')) + '</span><div class="sp"></div><button type="button" class="button button--tertiary" data-act="discard-edit">Discard</button><button type="button" class="button button--primary" data-act="save-edit">Save changes</button></div></div>' : '';
  }
  function saveEdit() {
    var A = curAsset(); if (!A || !vs) return;
    var v = validateD(vs.d, A.cat);
    if (v.keys.length) { vs.tried = true; syncView(); var f = $('#e-' + v.keys[0]); if (f) f.focus(); return; }
    var d = vs.d; d.name = d.name.trim();
    A.d = Object.assign({}, d); A.name = d.name; A.type = d.type; A.status = d.status; A.colour = d.colour;
    A.make = [d.manufacturer.trim(), d.model.trim()].filter(Boolean).join(' ') || d.type;
    vs = { id: A.id, d: Object.assign({}, A.d), touched: {}, tried: false };
    renderView(A, true);
    okToast('Changes to <strong>' + esc(A.name) + '</strong> were saved.');
  }

  /* ---------- events ---------- */
  document.addEventListener('input', function (e) {
    var ek = e.target && e.target.dataset && e.target.dataset.ek;
    if (ek && vs) { vs.d[ek] = e.target.value; syncView(); return; }
    if (e.target.id === 'note-new' && vs) { vs.noteDraft = e.target.value; vs.noteErr = false; syncView(); return; }
    var k = e.target && e.target.dataset && e.target.dataset.k;
    if (!k || location.hash !== '#/add') return;
    form[k] = e.target.value;
    if (k === 'type') ui.cleared = '';
    sync();
  });
  document.addEventListener('focusout', function (e) {
    var ek = e.target && e.target.dataset && e.target.dataset.ek;
    if (ek && vs) { vs.touched[ek] = true; syncView(); return; }
    var k = e.target && e.target.dataset && e.target.dataset.k;
    if (!k || location.hash !== '#/add') return;
    ui.touched[k] = true; sync();
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('input[data-cat]')) {
      var c = D.CATS.filter(function (x) { return x.id === t.value; })[0];
      form.cat = c.id; ui.cleared = '';
      if (form.type && c.types.indexOf(form.type) === -1) { ui.cleared = form.type; form.type = ''; }
      renderAdd(); var r = $('input[data-cat]:checked'); if (r) r.focus();
    } else if (t.matches && t.matches('input[data-ecolour]') && vs) {
      vs.d.colour = t.value;
      document.querySelectorAll('.form-swatch').forEach(function (l) { l.classList.toggle('is-selected', l.contains(t)); });
      syncView();
    } else if (t.matches && t.matches('input[data-colour]')) {
      form.colour = t.value;
      document.querySelectorAll('.form-swatch').forEach(function (l) { l.classList.toggle('is-selected', l.contains(t)); });
    }
  });
  document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches('[data-nodemo]')) sorry(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.innerHTML) { overlay.innerHTML = ''; pendingLeave = null; } });

  // Default-deny: anything clickable that is not marked data-live (or inside a data-live area) says "Sorry, not in this demo!"
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, a, select, summary, [data-nodemo]');
    if (!el) return;
    var live = el.closest('[data-live]');
    if (el.matches('.card-radio input, .form-swatch input')) return;
    if (!live || el.hasAttribute('data-nolive') || (el.tagName === 'SELECT')) {
      if (el.tagName === 'SELECT' && live && !el.hasAttribute('data-nolive')) return;      // real form controls in the add form
      e.preventDefault(); e.stopPropagation(); sorry(); return;
    }
    var go_ = el.closest('[data-go]'), act = el.dataset.act, foc = el.dataset.focus;
    if (foc) { e.preventDefault(); var t = document.getElementById(foc); if (t) t.focus(); return; }
    if (go_ && !act) { e.preventDefault(); go(go_.dataset.go); return; }
    if (!act) { if (el.tagName === 'A') e.preventDefault(); return; }
    e.preventDefault();
    if (act === 'add') { resetForm(listCat); location.hash = '#/add'; }
    else if (act === 'tab') { listCat = el.dataset.cat; if (location.hash !== '#/list') location.hash = '#/list'; else renderList(null); }
    else if (act === 'cancel') { if (isDirty()) openLeave('#/list', 'add'); else go('#/list'); }
    else if (act === 'create') {
      ui.submitted = true; sync();
      var v = validate();
      if (v.keys.length) { var first = document.getElementById('f-' + v.keys[0]); if (first) first.focus(); } else createAsset();
    }
    else if (act === 'photo') { var fi = document.getElementById('file'); fi.value = ''; fi.click(); }
    else if (act === 'photo-remove') { ui.photo = null; ui.photoErr = ''; renderAdd(); }
    else if (act === 'stay') { overlay.innerHTML = ''; pendingLeave = null; }
    else if (act === 'discard') { var tgt = pendingLeave || '#/list'; overlay.innerHTML = ''; pendingLeave = null; if (leaveMode === 'edit') vs = null; else resetForm(listCat); location.hash = tgt; }
    else if (act === 'vphoto') { var fv = document.getElementById('file'); fv.value = ''; fv.click(); }
    else if (act === 'vphoto-remove') { var Ar = curAsset(); if (Ar) { Ar.photo = null; vs.photoErr = ''; renderView(Ar, true); } }
    else if (act === 'save-edit') saveEdit();
    else if (act === 'discard-edit') { var Ad = curAsset(); if (Ad) { vs = null; renderView(Ad, true); } }
    else if (act === 'add-note') {
      var An = curAsset(), ta = $('#note-new'), tx = ta ? ta.value.trim() : '';
      if (An && vs) {
        if (!tx) { vs.noteErr = true; syncView(); if (ta) ta.focus(); }
        else { An.notes = [{ by: 'Dana Whitfield', date: TODAY, text: tx }].concat(An.notes || []); vs.noteDraft = ''; vs.noteErr = false; renderView(An, true); }
      }
    }
    else if (act === 'viewlist') { var la = findCreated(lastId); if (la) listCat = la.cat; location.hash = '#/list/new'; }
    else if (act === 'another') { resetForm(listCat); location.hash = '#/add'; }
    else if (act === 'close-toast') dismiss(sorryEl);
    else if (act === 'close-ok') dismiss(okEl);
  }, true);

  document.getElementById('file').addEventListener('change', function (e) { takeFile(e.target.files[0]); });
  ['dragover', 'drop'].forEach(function (n) { document.addEventListener(n, function (e) {
    e.preventDefault();
    if (n === 'drop' && e.target.closest && e.target.closest('#dropzone') && e.dataTransfer.files.length) takeFile(e.dataTransfer.files[0]);
    var z = $('#dropzone'); if (z) z.style.borderColor = (n === 'dragover' && e.target.closest('#dropzone')) ? '#0078b3' : '';
  }); });

  route();
})();
