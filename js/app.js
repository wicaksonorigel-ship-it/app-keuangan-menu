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
  var daftarResep = $('daftar-resep');
  var tableProdukBody = $('#tabel-produk tbody');
  var chartMonthly = $('chart-monthly');
  var chartCategory = $('chart-category');
  var menuPop = $('menu-pop');
  var productPop = $('product-pop');
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

  var SOURCES = APP_DATA.sources || [];
  var PRODUCTS = APP_DATA.products || [];

  function loadLedger() { try { return JSON.parse(localStorage.getItem('starhermes_ledger')) || []; } catch (e) { return []; } }
  function saveLedger() { localStorage.setItem('starhermes_ledger', JSON.stringify(ledger)); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function rupiah(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(iso) { if (!iso) return ''; var d = new Date(iso + 'T00:00:00'); if (isNaN(d)) return iso; return d.toLocaleDateString('id-ID'); }

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
    ledger.forEach(function (l) {
      if (l.jenis === 'pemasukan') { APP_DATA.menu.forEach(function (m) { if (m.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[m.nama] = (counts[m.nama] || 0) + 1; }); }
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  }
  function productSales() {
    var counts = {};
    ledger.forEach(function (l) {
      if (l.jenis === 'pemasukan') { PRODUCTS.forEach(function (p) { if (p.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[p.nama] = (counts[p.nama] || 0) + 1; }); }
    });
    return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  }

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

  function renderMenu() {
    tabelMenuBody.innerHTML = '';
    APP_DATA.menu.forEach(function (m) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(m.nama) + '</td><td>' + rupiah(m.harga) + '</td><td>' + esc(m.kategori) + '</td><td>' + esc(m.deskripsi) + '</td>';
      tabelMenuBody.appendChild(tr);
    });
  }

  function renderResep() {
    daftarResep.innerHTML = '';
    APP_DATA.recipes.forEach(function (r) {
      var card = document.createElement('div'); card.className = 'resep-card';
      card.innerHTML = '<h3>' + esc(r.nama) + ' <span class="tag">' + esc(r.tag) + '</span></h3><p><strong>Bahan:</strong> ' + esc(r.bahan) + '</p><p><strong>Langkah:</strong> ' + esc(r.langkah) + '</p>';
      daftarResep.appendChild(card);
    });
  }

  function renderProduk() {
    tableProdukBody.innerHTML = '';
    PRODUCTS.forEach(function (p) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(p.nama) + '</td><td>' + esc(p.sku) + '</td><td>' + rupiah(p.harga) + '</td><td>' + esc(p.stok) + '</td><td>' + esc(p.kategori) + '</td><td>' + esc(p.deskripsi) + '</td>';
      tableProdukBody.appendChild(tr);
    });
  }

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
      if (ledger) { ledger.forEach(function (l) { if (l.tanggal && l.tanggal.slice(0, 7) === k) { if (l.jenis === 'pemasukan') v.pemasukan += l.nominal; else v.pengeluaran += l.nominal; } }); }
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
    ledger.forEach(function (l) {
      if (l.jenis === 'pemasukan') { APP_DATA.menu.forEach(function (m) { if (m.nama.toLowerCase().indexOf(l.deskripsi.toLowerCase()) >= 0) counts[m.nama] = (counts[m.nama] || 0) + 1; }); }
    });
    var el = menuPop;
    if (!Object.keys(counts).length) { el.innerHTML = '<p class="empty">Belum ada penjualan yang kaitannya.</p>'; return; }
    var sorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    el.innerHTML = sorted.map(function (nm) { return '<div class="menu-pop-item"><div class="nm">' + esc(nm) + '</div><span class="st">' + counts[nm] + ' transaksi</span></div>'; }).join('');
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

  function fetchExternalSource(kind, q) {
    var sec = document.createElement('div'); sec.className = 'search-result-group';
    sec.innerHTML = '<div class="src">⏳ Memuat...</div><div class="meta">loading...</div>';
    searchResults.appendChild(sec);
    if (kind === 'wiki') {
      var wikiUrl = 'https://id.wikipedia.org/w/api.php?action=opensearch&search=' + encodeURIComponent(q) + '&limit=6&format=json';
      fetch(wikiUrl).then(function (r) { return r.json(); }).then(function (d) {
        var results = (d[1] || []).map(function (t, i) { return { name: t, url: 'https://id.wikipedia.org/wiki/' + encodeURIComponent(t), meta: 'Wikipedia' }; });
        renderFetchResults(results, 'Wikipedia');
      }).catch(function (e) { renderFetchError('Gagal mengambil Wikipedia: ' + e.message); });
    } else if (kind === 'off') {
      var offUrl = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(q) + '&search_simple=1&json=1&page_size=6';
      fetch(offUrl).then(function (r) { return r.json(); }).then(function (d) {
        var results = (d.products || []).slice(0, 6).map(function (p) { return { name: p.product_name, url: p.url || '#', meta: (p.brands || 'OpenFoodFacts') }; });
        renderFetchResults(results, 'OpenFoodFacts');
      }).catch(function (e) { renderFetchError('Gagal mengambil OpenFoodFacts: ' + e.message); });
    } else if (kind === 'weather') {
      var lat = 6.2088, lon = 106.8456;
      var weathUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FJakarta';
      fetch(weathUrl).then(function (r) { return r.json(); }).then(function (d) {
        var cur = d.current || {};
        var res = { name: APP_DATA.weatherSample.city, meta: 'Cuaca hari ini', temp: cur.temperature_2m ? '😐 ' + cur.temperature_2m + '°C' : '', wind: cur.wind_speed_10m ? 'Angin ' + cur.wind_speed_10m + ' km/j' : '', hum: cur.relative_humidity_2m ? 'Kelembapan ' + cur.relative_humidity_2m + '%' : '' };
        renderFetchResults([res], 'Open-Meteo');
      }).catch(function (e) { renderFetchError('Gagal cuaca: ' + e.message); });
    } else if (kind === 'news') {
      var sample = [{ name: 'Berita: Lapangan dagang makanan sehat naik', meta: 'Sample (butuh API key di produksi)', url: '#' }];
      renderFetchResults(sample, 'News (demo)');
    }
  }

  function renderFetchResults(results, title) {
    var sec = document.querySelector('#fetch-output');
    if (!sec) return;
    sec.innerHTML = '<div class="card"><h3>' + esc(title) + '</h3><div class="source-list">' + results.map(function (r) {
      return '<div class="source-item"><span class="badge ok">🔍</span><div><div class="name">' + esc(r.name) + '</div><div class="note">' + esc(r.meta) + '</div></div></div>';
    }).join('') + '</div></div>';
  }

  function renderFetchError(msg) {
    var sec = document.querySelector('#fetch-output');
    if (!sec) return;
    sec.innerHTML = '<div class="muted"><span class="empty">' + esc(msg) + '</span></div>';
  }

  function searchLocal(q) {
    var res = { menu: [], resep: [], keuangan: [], produk: [], total: 0 };
    APP_DATA.menu.forEach(function (m) { if (m.nama.toLowerCase().indexOf(q.toLowerCase()) >= 0 || m.deskripsi.toLowerCase().indexOf(q.toLowerCase()) >= 0) { res.menu.push(m); res.total++; } });
    APP_DATA.recipes.forEach(function (r) { if (r.nama.toLowerCase().indexOf(q.toLowerCase()) >= 0 || r.bahan.toLowerCase().indexOf(q.toLowerCase()) >= 0 || r.langkah.toLowerCase().indexOf(q.toLowerCase()) >= 0) { res.resep.push(r); res.total++; } });
    PRODUCTS.forEach(function (p) { if (p.nama.toLowerCase().indexOf(q.toLowerCase()) >= 0 || p.deskripsi.toLowerCase().indexOf(q.toLowerCase()) >= 0) { res.produk.push(p); res.total++; } });
    var keu = ledger.filter(function (l) { return l.deskripsi.toLowerCase().indexOf(q.toLowerCase()) >= 0 || l.kategori.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
    keu.forEach(function (l) { res.keuangan.push(l); res.total++; });
    return res;
  }

  function renderSearch() {
    var q = searchInput.value.trim();
    var res = searchLocal(q);
    var html = '<div class="search-result-group"><div class="src">🔍 Hasil Temuan</div></div>';
    var groups = [
      ['📋 Menu', res.menu, 'menu'],
      ['👩‍🍳 Resep', res.resep, 'resep'],
      ['📦 Produk', res.produk, 'menu'],
      ['💰 Keuangan', res.keuangan, 'keuangan']
    ];
    var hasLocal = false;
    groups.forEach(function (g) {
      if (g[1].length) { hasLocal = true; html += '<div class="search-result-group" data-tab="' + g[2] + '"><div class="src">' + g[0] + '</div>';
        g[1].forEach(function (item) {
          var nm = item.nama || item.deskripsi || '';
          html += '<div class="name">' + esc(nm) + '</div><div class="meta">' + esc((item.kategori || item.jenis || '') + ' · ' + esc(item.sku || '')) + '</div></div>';
        });
      }
    });
    if (q) {
      html += '<div class="search-hint">atau cari di sumber eksternal: <button id="btn-wiki" class="btn-sm">Wikipedia</button> <button id="btn-of" class="btn-sm">OpenFoodFacts</button> <button id="btn-weather" class="btn-sm">Cuaca</button></div>';
    }
    searchResults.innerHTML = html;
    ['btn-wiki', 'btn-of', 'btn-weather'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) { b.addEventListener('click', function () { fetchExternalSource(b.id === 'btn-wiki' ? 'wiki' : b.id === 'btn-of' ? 'off' : 'weather', q); }); }
    });
  }

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
    else if (type === 'menu') { rows.push(['Nama', 'Harga', 'Kategori', 'Deskripsi']); APP_DATA.menu.forEach(function (m) { rows.push([m.nama, m.harga, m.kategori, m.deskripsi]); }); }
    else if (type === 'resep') { rows.push(['Nama', 'Bahan', 'Langkah', 'Tag']); APP_DATA.recipes.forEach(function (r) { rows.push([r.nama, r.bahan, r.langkah, r.tag]); }); }
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
    var kategori = document.getElementById('kategori-menu').value.trim() || 'Umum';
    var deskripsi = document.getElementById('deskripsi-menu').value.trim();
    if (!nama || !harga) return;
    APP_DATA.menu.push({ id: menuId || 100, nama: nama, harga: harga, kategori: kategori, deskripsi: deskripsi });
    renderMenu();
    formMenu.reset();
  });

  formResep.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = document.getElementById('nama-resep').value.trim();
    var bahan = document.getElementById('bahan-resep').value.trim();
    var langkah = document.getElementById('langkah-resep').value.trim();
    var tag = document.getElementById('tag-resep').value.trim() || 'Umum';
    if (!nama || !bahan || !langkah) return;
    APP_DATA.recipes.push({ id: resepId || 200, nama: nama, bahan: bahan, langkah: langkah, tag: tag });
    renderResep();
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

  document.getElementById('btn-export').addEventListener('click', function () { exportCSV('keuangan'); });
  document.getElementById('btn-export-menu').addEventListener('click', function () { exportCSV('menu'); });
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
