(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.panel');
  var sidebarItems = document.querySelectorAll('.sidebar-item');
  var formKeuangan = $('form-keuangan');
  var jenisInput = $('jenis');
  var deskripsiInput = $('deskripsi');
  var nominalInput = $('nominal');
  var tanggalInput = $('tanggal');
  var kategoriInput = $('kategori');
  var tabelKeuanganBody = $('#tabel-keuangan tbody');
  var totalPemasukanEl = $('total-pemasukan');
  var totalPengeluaranEl = $('total-pengeluaran');
  var totalLabaEl = $('total-laba');
  var dashPemasukanEl = $('dash-pemasukan');
  var dashPengeluaranEl = $('dash-pengeluaran');
  var dashLabaEl = $('dash-laba');
  var dashProdukEl = $('dash-produk');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var formMenu = $('form-menu');
  var tabelMenuBody = $('#tabel-menu tbody');
  var formResep = $('form-resep');
  var resepList = $('resep-list');
  var resepDetail = $('resep-detail');
  var tableProdukBody = $('#tabel-produk tbody');
  var chartMonthly = $('chart-monthly');
  var chartCategory = $('chart-category');
  var menuPop = $('menu-pop');
  var productPop = $('product-pop');
  var recipePop = $('recipe-pop');
  var sourceStatus = $('source-status');
  var searchInput = $('search-input');
  var searchResults = $('search-results');
  var sourceCountEl = $('source-count');
  var fetchQuery = $('fetch-query');
  var fetchKind = $('fetch-kind');
  var btnFetch = $('btn-fetch');
  var fetchOutput = $('fetch-output');
  var importInput = $('import-input');
  var importInputMenu = $('import-input-menu');
  var themeToggle = $('theme-toggle');
  var paketanCheck = $('paketan-check');

  var SOURCES = APP_DATA.sources || [];
  var PRODUCTS = APP_DATA.products || [];
  var scalerResep = 1;

  function loadLedger() { try { return JSON.parse(localStorage.getItem('starhermes_ledger')) || []; } catch (e) { return []; } }
  function saveLedger() { localStorage.setItem('starhermes_ledger', JSON.stringify(ledger)); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function rupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function youtubeId(url) { if (!url) return ''; var m = url.match(/[?&]v=([^&]+)/); return m ? m[1] : url; }
  function parseQty(qty, mult) {
    if (!qty) return '';
    if (qty === 'secukupnya' || qty === '' || qty === null) return 'secukupnya';
    var n = parseFloat(qty);
    if (isNaN(n)) return qty;
    var v = n * (mult || 1);
    return (v % 1 === 0 ? v : v.toFixed(2).replace(/(\.\d*?[1-9])0+$/, '$1')) + ' ' + satuanQty(qty);
  }
  function satuanQty(qty) { return (qty || '').toString().trim().match(/[a-zA-Z]+/); }

  var ledger = loadLedger();

  function monthlyChartData() {
    var m = {};
    ledger.forEach(function (l) { if (!l.tanggal) return; var k = l.tanggal.slice(0, 7); if (!m[k]) m[k] = { pemasukan: 0, pengeluaran: 0 }; if (l.jenis === 'pemasukan') m[k].pemasukan += l.nominal; else m[k].pengeluaran += l.nominal; });
    return Object.keys(m).sort();
  }
  function categoryData() {
    var map = {};
    ledger.forEach(function (l) { if (l.jenis === 'pengeluaran') { map[l.kategori] = (map[l.kategori] || 0) + l.nominal; } });
    return Object.keys(map).sort(function (a, b) { return map[b] - map[a]; });
  }
  function topMenu() {
    var counts = {};
    ledger.forEach(function (l) { if (l.jenis === 'pemasukan') { APP_DATA.menu.forEach(function (m) { if (m.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[m.nama] = (counts[m.nama] || 0) + 1; }); } });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  }
  function productSales() {
    var counts = {};
    ledger.forEach(function (l) { if (l.jenis === 'pemasukan') { PRODUCTS.forEach(function (p) { if (p.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[p.nama] = (counts[p.nama] || 0) + 1; }); } });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  }
  function recipeSales() {
    var counts = {};
    ledger.forEach(function (l) { if (l.jenis === 'pemasukan') { APP_DATA.recipes.forEach(function (r) { if (r.judul.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[r.judul] = (counts[r.judul] || 0) + 1; }); } });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  }

  // ===== render keuangan =====
  function renderKeuangan() {
    var tp = ledger.filter(function (l) { return l.jenis === 'pemasukan'; }).reduce(function (s, l) { return s + l.nominal; }, 0);
    var te = ledger.filter(function (l) { return l.jenis === 'pengeluaran'; }).reduce(function (s, l) { return s + l.nominal; }, 0);
    var laba = tp - te;
    totalPemasukanEl.textContent = rupiah(tp);
    totalPengeluaranEl.textContent = rupiah(te);
    totalLabaEl.textContent = rupiah(laba);
    var rows = ledger.slice().filter(function (l) { return filterJenis === 'semua' || l.jenis === filterJenis; });
    rows.sort(function (a, b) { return String(b.tanggal).localeCompare(String(a.tanggal)); });
    tabelKeuanganBody.innerHTML = '';
    if (!rows.length) { tabelKeuanganBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada transaksi.</td></tr>'; return; }
    rows.forEach(function (l) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(fmtDate(l.tanggal)) + '</td><td>' + esc(l.jenis) + '</td><td>' + esc(l.deskripsi) + '</td><td>' + rupiah(l.nominal) + '</td><td>' + esc(l.kategori) + '</td>';
      tabelKeuanganBody.appendChild(tr);
    });
  }

  // ===== render menu =====
  function renderMenu() {
    tabelMenuBody.innerHTML = '';
    APP_DATA.menu.forEach(function (m) {
      var tr = document.createElement('tr');
      var paket = m.paketan || false;
      tr.innerHTML = '<td><img src="' + (m.gambar || '') + '" alt="' + esc(m.nama) + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" /></td>' +
        '<td>' + esc(m.nama) + '</td><td>' + rupiah(m.harga) + '</td><td>' + esc(m.kategori) + '</td><td>' + esc(m.deskripsi) + '</td>' +
        '<td><span class="tag' + (paket ? ' tag-paket' : '') + '">' + (paket ? '📦 Paket' : 'Individu') + '</span></td>';
      tabelMenuBody.appendChild(tr);
    });
  }

  // ===== render resep (list) =====
  function renderResep() {
    resepList.innerHTML = '';
    APP_DATA.recipes.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'resep-card';
      var paket = r.paketan || false;
      card.innerHTML =
        '<img src="' + (r.gambar || '') + '" alt="' + esc(r.judul) + '" style="width:100%;height:130px;object-fit:cover;border-radius:8px;" />' +
        '<div class="resep-card-body">' +
          '<h3 class="resep-card-title">' + esc(r.judul) + ' <span class="tag">' + esc((paket ? '📦 ' : '') + (r.hasil || 1) + ' buah / adonan') + '</span></h3>' +
          (r.est_harga ? '<p class="resep-card-eh">Estimasi harga: Rp ' + rupiah(r.est_harga) + ' / buah</p>' : '') +
          '<p class="resep-card-deskripsi">' + esc(r.deskripsi || '') + '</p>' +
          '<div class="resep-card-actions"><button class="btn-ghost btn-sm" data-act="detail" data-id="' + r.id + '">Lihat Detail</button></div>' +
        '</div>';
      resepList.appendChild(card);
    });
  }

  // ===== render resep detail + batch scaler =====
  function renderResepDetail(id) {
    var r = APP_DATA.recipes.filter(function (x) { return x.id == id; })[0];
    if (!r) return;
    scalerResep = 1;
    var el = resepDetail;
    el.innerHTML = '';
    el.className = 'resep-detail';
    var paket = r.paketan || false;
    var card = document.createElement('div');
    card.className = 'resep-detail-card';
    var bahanPer = function (mult) {
      return r.bahan ? r.bahan.map(function (b) {
        var q = parseQty(b.qty, mult);
        return '<div class="bahan-row"><span class="bahan-nama">' + esc(b.nama) + '</span><span class="bahan-qty">' + esc(q) + '</span></div>';
      }).join('') : '';
    };
    card.innerHTML =
      '<img src="' + (r.gambar || '') + '" alt="' + esc(r.judul) + '" />' +
      '<div class="resep-detail-head">' +
        '<span class="tag">' + esc((paket ? '📦 ' : '') + (r.hasil || 1) + ' buah / adonan') + '</span>' +
        (r.est_harga ? '<span class="est-harga">Estimasi harga: Rp ' + rupiah(r.est_harga) + ' / buah</span>' : '') +
        (paket ? '<span class="tag tag-paket">📦 Paketan</span>' : '') +
      '</div>' +
      (r.deskripsi ? '<p class="resep-detail-deskripsi">' + esc(r.deskripsi) + '</p>' : '') +
      '<div class="resep-detail-scaler">' +
        '<label>Bahan (per <b>' + scalerResep + '</b> adonan)</label>' +
        '<div class="scaler">' +
          '<button class="scaler-btn" data-step="-1">−</button>' +
          '<input class="scaler-input" type="number" value="1" min="1" step="1" />' +
          '<button class="scaler-btn" data-step="1">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="resep-detail-section">' +
        '<h4>Bahan</h4>' +
        '<div class="bahan-list">' + (r.bahan ? bahanPer(scalerResep) : '') + '</div>' +
        '<p class="muted" style="margin:6px 0 0;"><small>per 1 adonan: <b>' + (r.bahan ? parseQty(r.bahan[0].qty, 1) : '') + '</b> · per 2 adonan: <b>' + (r.bahan ? parseQty(r.bahan[0].qty, 2) : '') + '</b></small></p>' +
      '</div>' +
      '<div class="resep-detail-section">' +
        '<h4>Cara membuat</h4>' +
        '<p class="resep-detail-langkah">' + esc(r.langkah || '') + '</p>' +
      '</div>' +
      (r.youtube ? '<div class="resep-detail-section resep-video">' +
        '<h4>📺 Video</h4>' +
        '<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/' + youtubeId(r.youtube) + '" frameborder="0" allowfullscreen></iframe></div>' +
      '</div>' : '') +
      '<div class="resep-detail-actions"><button class="btn-ghost" data-act="close">Tutup</button></div>';
    el.appendChild(card);
    el.querySelectorAll('.scaler-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        scalerResep = Math.max(1, parseInt(el.querySelector('.scaler-input').value, 10) + parseInt(b.getAttribute('data-step'), 10));
        el.querySelector('.scaler-input').value = scalerResep;
        renderResepDetail(r.id);
      });
    });
    el.querySelector('.scaler-input').addEventListener('change', function () {
      scalerResep = Math.max(1, parseInt(this.value, 10) || 1);
      renderResepDetail(r.id);
    });
    el.querySelector('[data-act="close"]').addEventListener('click', function () { resepDetail.className = 'resep-detail'; resepDetail.innerHTML = ''; });
    el.classList.add('is-active');
  }

  // ===== render produk =====
  function renderProduk() {
    tableProdukBody.innerHTML = '';
    PRODUCTS.forEach(function (p) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(p.nama) + '</td><td>' + esc(p.sku) + '</td><td>' + rupiah(p.harga) + '</td><td>' + esc(p.stok) + '</td><td>' + esc(p.kategori) + '</td><td>' + esc(p.deskripsi) + '</td>';
      tableProdukBody.appendChild(tr);
    });
  }

  // ===== dashboard =====
  function renderDashboard() {
    var tp = ledger.filter(function (l) { return l.jenis === 'pemasukan'; }).reduce(function (s, l) { return s + l.nominal; }, 0);
    var te = ledger.filter(function (l) { return l.jenis === 'pengeluaran'; }).reduce(function (s, l) { return s + l.nominal; }, 0);
    var laba = tp - te;
    dashPemasukanEl.textContent = rupiah(tp);
    dashPengeluaranEl.textContent = rupiah(te);
    dashLabaEl.textContent = rupiah(laba);
    dashProdukEl.textContent = PRODUCTS.length;
    renderMonthly();
    renderCategory();
    renderMenuPop();
    renderProductPop();
    renderRecipePop();
    renderSourceStatus();
  }

  function renderMonthly() {
    var data = monthlyChartData();
    var container = chartMonthly;
    if (!data.length) { container.innerHTML = '<p class="empty">Belum ada data bulanan.</p>'; return; }
    var recent = data.slice(-6).reverse();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    container.innerHTML = recent.map(function (k) {
      var v = { pemasukan: 0, pengeluaran: 0 };
      ledger.forEach(function (l) { if (l.tanggal && l.tanggal.slice(0, 7) === k) { if (l.jenis === 'pemasukan') v.pemasukan += l.nominal; else v.pengeluaran += l.nominal; } });
      var mIdx = parseInt(k.slice(5, 7), 10) - 1;
      var mName = months[mIdx] + ' ' + k.slice(0, 4);
      var mx = Math.max(v.pemasukan, v.pengeluaran, 1);
      return '<div class="chart-bar">' +
        '<div class="bar-label">' + mName + '</div>' +
        '<div class="bar-wrap">' +
          '<div class="bar"><div class="bar-inner" style="height:' + Math.max((v.pemasukan / mx) * 100, 2) + '%; background:#e07a3f;"></div><span class="bar-label-sm">' + rupiah(v.pemasukan) + '</span></div>' +
          '<div class="bar"><div class="bar-inner" style="height:' + Math.max((v.pengeluaran / mx) * 100, 2) + '%; background:#9a9086;"></div><span class="bar-label-sm">' + rupiah(v.pengeluaran) + '</span></div>' +
        '</div></div>';
    }).join('');
  }

  function renderCategory() {
    var data = categoryData().map(function (cat) { return { cat: cat, val: categoryData().reduce(function (s, c) { return c === cat ? s + 1 : s; }, 0) }; }).slice(0, 6);
    var container = chartCategory;
    var total = data.reduce(function (s, p) { return s + p.val; }, 0);
    if (!data.length) { container.innerHTML = '<p class="empty">Belum ada pengeluaran.</p>'; return; }
    container.innerHTML = data.map(function (item) {
      return '<div class="category-row"><span class="label">' + esc(item.cat) + '</span><div class="bar-track"><div class="bar" style="width:' + ((item.val / total) * 100) + '%"></div></div><span class="val">' + rupiah(item.val) + '</span></div>';
    }).join('');
  }

  function renderMenuPop() {
    var counts = {};
    ledger.forEach(function (l) { if (l.jenis === 'pemasukan') { APP_DATA.menu.forEach(function (m) { if (m.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[m.nama] = (counts[m.nama] || 0) + 1; }); } });
    var el = menuPop;
    if (!Object.keys(counts).length) { el.innerHTML = '<p class="empty">Belum ada penjualan yang kaitannya.</p>'; return; }
    var sorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    el.innerHTML = sorted.map(function (nm) { return '<div class="menu-pop-item"><div class="nm">' + esc(nm) + '</div><span class="st">' + counts[nm] + ' transaksi</span></div>'; }).join('');
  }

  function renderRecipePop() {
    var counts = recipeSales();
    var el = recipePop;
    if (!Object.keys(counts).length) { el.innerHTML = '<p class="empty">Belum ada penjualan resep.</p>'; return; }
    var sorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    el.innerHTML = sorted.map(function (nm) { return '<div class="menu-pop-item"><div class="nm">' + esc(nm) + '</div><span class="st">' + counts[nm] + ' terjual</span></div>'; }).join('');
  }

  function renderProductPop() {
    var counts = productSales();
    var el = productPop;
    if (!Object.keys(counts).length) { el.innerHTML = '<p class="empty">Belum ada penjualan produk.</p>'; return; }
    var sorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    el.innerHTML = sorted.map(function (nm) { return '<div class="menu-pop-item"><div class="nm">' + esc(nm) + '</div><span class="st">' + counts[nm] + ' terjual</span></div>'; }).join('');
  }

  function renderSourceStatus() {
    var el = sourceStatus;
    if (!SOURCES.length) { el.innerHTML = '<p class="empty">Belum ada sumber.</p>'; return; }
    el.innerHTML = SOURCES.map(function (s) {
      return '<div class="source-item"><span class="badge off">' + s.icon + '</span><div><div class="name">' + esc(s.name) + ' <span class="muted">(' + esc(s.type) + ')</span></div><div class="note">' + esc(s.note) + '</div></div></div>';
    }).join('');
    sourceCountEl.textContent = 'Sumber: ' + SOURCES.length;
  }

  // ===== export / import =====
  function downloadCSV(filename, rows) {
    var header = rows[0].map(function (h) { return '"' + String(h).replace(/"/g, '""') + '"'; }).join(',');
    var body = rows.slice(1).map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
    var bom = String.fromCharCode(0xFEFF);
    var nl = String.fromCharCode(10);
    var blob = new Blob([bom + header + nl + body], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function exportCSV(type) {
    var rows = [];
    if (type === 'keuangan') { rows.push(['Tanggal', 'Jenis', 'Deskripsi', 'Nominal', 'Kategori']); ledger.forEach(function (l) { rows.push([l.tanggal, l.jenis, l.deskripsi, l.nominal, l.kategori]); }); }
    else if (type === 'menu') { rows.push(['Nama', 'Harga', 'Kategori', 'Deskripsi', 'Tipe']); APP_DATA.menu.forEach(function (m) { rows.push([m.nama, m.harga, m.kategori, m.deskripsi, m.paketan ? 'Paketan' : 'Individu']); }); }
    else if (type === 'resep') { rows.push(['Judul', 'HASIL', 'Estimasi Harga', 'Bahan', 'Langkah', 'YouTube']); APP_DATA.recipes.forEach(function (r) { rows.push([r.judul, r.hasil, r.est_harga, r.bahan.map(function (b) { return b.nama + ' ' + b.qty + ' ' + b.satuan; }).join('; '), r.langkah, r.youtube]); }); }
    else if (type === 'produk') { rows.push(['Nama', 'SKU', 'Harga', 'Stok', 'Kategori', 'Deskripsi']); PRODUCTS.forEach(function (p) { rows.push([p.nama, p.sku, p.harga, p.stok, p.kategori, p.deskripsi]); }); }
    downloadCSV(type + '.csv', rows);
  }
  function exportAll() {
    var data = { ledger: ledger, menu: APP_DATA.menu, recipes: APP_DATA.recipes, products: PRODUCTS, sources: SOURCES, exportDate: new Date().toISOString() };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'dapur_herkes_backup_' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
  }
  function importLedgerFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try { var data = JSON.parse(reader.result); if (data.ledger && Array.isArray(data.ledger)) { if (confirm('Ganti data keuangan saat ini?')) { ledger = data.ledger; saveLedger(); renderKeuangan(); } } else { alert('Format tidak valid: tidak ada array ledger.'); } }
      catch (e) { alert('Format JSON salah: ' + e.message); }
    };
    reader.readAsText(file);
  }
  function importMenuFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try { var data = JSON.parse(reader.result); if (data.menu && Array.isArray(data.menu)) { if (confirm('Ganti menu?')) { APP_DATA.menu = data.menu; renderMenu(); } } else { alert('Format salah: array menu.'); } }
      catch (e) { alert('Format JSON salah: ' + e.message); }
    };
    reader.readAsText(file);
  }
  function resetLedger() { if (confirm('Hapus semua transaksi saat ini?')) { ledger = []; saveLedger(); renderKeuangan(); } }

  // ===== events =====
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });
      t.classList.add('is-active');
      var panel = document.getElementById(t.getAttribute('data-tab'));
      if (panel) panel.classList.add('is-active');
    });
  });
  sidebarItems.forEach(function (si) {
    si.addEventListener('click', function () {
      sidebarItems.forEach(function (x) { x.classList.remove('is-active'); });
      si.classList.add('is-active');
      var panel = document.getElementById(si.getAttribute('data-panel'));
      if (panel) panel.classList.add('is-active');
      panels.forEach(function (p) { p.classList.remove('is-active'); });
      var p2 = document.querySelector('.panel[data-panel="' + si.getAttribute('data-panel') + '"]');
      if (p2) p2.classList.add('is-active');
    });
  });

  formKeuangan.addEventListener('submit', function (e) {
    e.preventDefault();
    var jenis = jenisInput.value;
    var deskripsi = deskripsiInput.value.trim();
    var nominal = parseInt(nominalInput.value, 10);
    var tanggal = tanggalInput.value;
    var kategori = kategoriInput.value;
    if (!deskripsi || !nominal || !tanggal) return;
    ledger.push({ id: Date.now() + '', jenis: jenis, deskripsi: deskripsi, nominal: nominal, tanggal: tanggal, kategori: kategori });
    saveLedger();
    formKeuangan.reset();
    renderKeuangan();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
      btn.classList.add('is-active');
      filterJenis = btn.getAttribute('data-filter');
      renderKeuangan();
    });
  });

  formMenu.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = document.getElementById('nama-menu').value.trim();
    var harga = parseInt(document.getElementById('harga-menu').value, 10);
    var paketan = paketanCheck.checked;
    var hargaPaket = parseInt(document.getElementById('harga-paket').value, 10);
    var kategori = document.getElementById('kategori-menu').value.trim() || 'Umum';
    var deskripsi = document.getElementById('deskripsi-menu').value.trim();
    if (!nama || !harga) return;
    APP_DATA.menu.push({ id: menuId || 200, nama: nama, harga: paketan ? (hargaPaket || harga) : harga, paketan: paketan, kategori: kategori, deskripsi: deskripsi, detail_paket: paketan ? 'Lihat detail paket' : '' });
    renderMenu();
    formMenu.reset();
    paketanCheck.checked = false;
    document.getElementById('harga-paket').value = '';
  });

  formResep.addEventListener('submit', function (e) {
    e.preventDefault();
    var judul = document.getElementById('nama-resep').value.trim();
    var deskripsi = document.getElementById('deskripsi-resep').value.trim();
    var hasil = parseInt(document.getElementById('hasil-resep').value, 10) || 1;
    var est_harga = parseInt(document.getElementById('est-harga-resep').value, 10) || 0;
    var bahanText = document.getElementById('bahan-resep').value.trim();
    var bahan = [];
    if (bahanText) {
      bahanText.split('\n').forEach(function (line) {
        line = line.trim();
        if (!line) return;
        var parts = line.split('|');
        var nama = parts[0].trim();
        var qty = parts[1] ? parts[1].trim() : '';
        var satuan = parts[2] ? parts[2].trim() : '';
        if (nama) bahan.push({ nama: nama, qty: qty, satuan: satuan });
      });
    }
    var langkah = document.getElementById('langkah-resep').value.trim();
    var youtube = document.getElementById('youtube-resep').value.trim();
    if (!judul || !langkah) return;
    APP_DATA.recipes.push({ id: resepId || 300, judul: judul, deskripsi: deskripsi, hasil: hasil, est_harga: est_harga, bahan: bahan, langkah: langkah, youtube: youtube });
    renderResep();
    renderResepDetail(APP_DATA.recipes[APP_DATA.recipes.length - 1].id);
    formResep.reset();
  });

  searchInput.addEventListener('input', function () { renderSearch(); });

  searchResults.addEventListener('click', function (e) {
    var grp = e.target.closest('.search-result-group[data-tab]');
    if (grp) {
      var tabName = grp.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });
      var tb = document.querySelector('.tab[data-tab="' + tabName + '"]');
      if (tb) tb.classList.add('is-active');
      var panel = document.getElementById(tabName);
      if (panel) panel.classList.add('is-active');
    }
  });

  resepList.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act="detail"]');
    if (btn) { var id = parseInt(btn.getAttribute('data-id'), 10); renderResepDetail(id); }
  });

  document.getElementById('btn-export').addEventListener('click', function () { exportCSV('keuangan'); });
  document.getElementById('btn-export-menu').addEventListener('click', function () { exportCSV('menu'); });
  document.getElementById('btn-export-resep').addEventListener('click', function () { exportCSV('resep'); });
  document.getElementById('btn-export-produk').addEventListener('click', function () { exportCSV('produk'); });
  document.getElementById('btn-export-all').addEventListener('click', exportAll);
  document.getElementById('btn-reset').addEventListener('click', function () { resetLedger(); });
  document.getElementById('btn-import').addEventListener('click', function () { if (importInput) importInput.click(); });
  document.getElementById('btn-import-menu').addEventListener('click', function () { if (importInputMenu) importInputMenu.click(); });
  document.getElementById('btn-restore').addEventListener('click', function () { if (importInput) importInput.click(); });

  importInput.addEventListener('change', function (e) { if (importInput.files && importInput.files[0]) { importLedgerFile(importInput.files[0]); importInput.value = ''; } });
  importInputMenu.addEventListener('change', function (e) { if (importInputMenu.files && importInputMenu.files[0]) { importMenuFile(importInputMenu.files[0]); importInputMenu.value = ''; } });

  btnFetch.addEventListener('click', function () {
    fetchExternalSource(fetchKind.value, fetchQuery.value.trim());
  });

  themeToggle.addEventListener('change', function () {
    var d = themeToggle.checked;
    applyTheme(d);
    try { localStorage.setItem('starhermes_theme', d ? 'dark' : 'light'); } catch (e) {}
  });
  function applyTheme(dark) { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }
  try { var saved = localStorage.getItem('starhermes_theme'); if (saved === 'dark') themeToggle.checked = true; } catch (e) {}
  applyTheme(themeToggle.checked);

  // ===== init =====
  if (!ledger.length) {
    ledger = [
      { id: 'lite-1', jenis: 'pemasukan', deskripsi: 'Penjualan menu makanan', nominal: 450000, tanggal: '2026-11-20', kategori: 'umum' },
      { id: 'lite-2', jenis: 'pemasukan', deskripsi: 'Penjualan minuman', nominal: 230000, tanggal: '2026-11-21', kategori: 'umum' },
      { id: 'lite-3', jenis: 'pengeluaran', deskripsi: 'Bahan baku hidangan', nominal: 95000, tanggal: '2026-11-19', kategori: 'bahan-baku' },
      { id: 'lite-4', jenis: 'pengeluaran', deskripsi: 'Sementara', nominal: 15000, tanggal: '2026-11-22', kategori: 'operasional' },
    ];
  }
  renderKeuangan();
  renderMenu();
  renderResep();
  renderProduk();
  renderDashboard();
  renderSearch();
})();
