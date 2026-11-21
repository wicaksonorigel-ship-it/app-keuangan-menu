(function () {
  'use strict';

  // ===== state =====
  let ledger = loadLedger();
  let filterJenis = 'semua';
  let menuId = APP_DATA.menu.length + 1;
  let resepId = APP_DATA.recipes.length + 1;

  // ===== dom =====
  function $ (id) { return document.getElementById(id); }

  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  const formKeuangan = $('form-keuangan');
  const jenisInput = $('jenis');
  const deskripsiInput = $('deskripsi');
  const nominalInput = $('nominal');
  const tanggalInput = $('tanggal');
  const kategoriInput = $('kategori');
  const tabelKeuanganBody = document.querySelector('#tabel-keuangan tbody');
  const totalPemasukanEl = $('total-pemasukan');
  const totalPengeluaranEl = $('total-pengeluaran');
  const totalLabaEl = $('total-laba');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const formMenu = $('form-menu');
  const tabelMenuBody = document.querySelector('#tabel-menu tbody');
  const formResep = $('form-resep');
  const daftarResep = $('daftar-resep');

  // ===== helpers =====
  function loadLedger() {
    try { return JSON.parse(localStorage.getItem('starhermes_ledger')) || []; }
    catch (e) { return []; }
  }
  function saveLedger() {
    localStorage.setItem('starhermes_ledger', JSON.stringify(ledger));
  }
  function today() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function rupiah(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ===== render keuangan =====
  function renderKeuangan() {
    const totalPemasukan = ledger
      .filter(function (l) { return l.jenis === 'pemasukan'; })
      .reduce(function (s, l) { return s + l.nominal; }, 0);
    const totalPengeluaran = ledger
      .filter(function (l) { return l.jenis === 'pengeluaran'; })
      .reduce(function (s, l) { return s + l.nominal; }, 0);
    const totalLaba = totalPemasukan - totalPengeluaran;

    totalPemasukanEl.textContent = rupiah(totalPemasukan);
    totalPengeluaranEl.textContent = rupiah(totalPengeluaran);
    totalLabaEl.textContent = rupiah(totalLaba);

    const rows = ledger.slice().filter(function (l) {
      return filterJenis === 'semua' || l.jenis === filterJenis;
    });
    rows.sort(function (a, b) { return String(b.tanggal).localeCompare(String(a.tanggal)); });

    tabelKeuanganBody.innerHTML = '';
    if (rows.length === 0) {
      tabelKeuanganBody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada transaksi. Tambahkan di bawah.</td></tr>';
      return;
    }
    rows.forEach(function (l) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(l.tanggal) + '</td>' +
        '<td>' + esc(l.jenis) + '</td>' +
        '<td>' + esc(l.deskripsi) + '</td>' +
        '<td>' + rupiah(l.nominal) + '</td>' +
        '<td>' + esc(l.kategori) + '</td>';
      tabelKeuanganBody.appendChild(tr);
    });
  }

  // ===== render menu =====
  function renderMenu() {
    tabelMenuBody.innerHTML = '';
    APP_DATA.menu.forEach(function (m) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(m.nama) + '</td>' +
        '<td>' + rupiah(m.harga) + '</td>' +
        '<td>' + esc(m.kategori) + '</td>' +
        '<td>' + esc(m.deskripsi) + '</td>';
      tabelMenuBody.appendChild(tr);
    });
  }

  // ===== render resep =====
  function renderResep() {
    daftarResep.innerHTML = '';
    APP_DATA.recipes.forEach(function (r) {
      const card = document.createElement('div');
      card.className = 'resep-card';
      card.innerHTML =
        '<h3>' + esc(r.nama) + ' <span class="tag">' + esc(r.tag) + '</span></h3>' +
        '<p><strong>Bahan:</strong> ' + esc(r.bahan) + '</p>' +
        '<p><strong>Langkah:</strong> ' + esc(r.langkah) + '</p>';
      daftarResep.appendChild(card);
    });
  }

  // ===== events =====
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });
      t.classList.add('is-active');
      $('' + t.getAttribute('data-tab')).classList.add('is-active');
    });
  });

  formKeuangan.addEventListener('submit', function (e) {
    e.preventDefault();
    const jenis = jenisInput.value;
    const deskripsi = deskripsiInput.value.trim();
    const nominal = parseInt(nominalInput.value, 10);
    const tanggal = tanggalInput.value;
    const kategori = kategoriInput.value;
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
    const nama = document.getElementById('nama-menu').value.trim();
    const harga = parseInt(document.getElementById('harga-menu').value, 10);
    const kategori = document.getElementById('kategori-menu').value.trim() || 'Umum';
    const deskripsi = document.getElementById('deskripsi-menu').value.trim();
    if (!nama || !harga) return;
    APP_DATA.menu.push({ id: menuId++, nama: nama, harga: harga, kategori: kategori, deskripsi: deskripsi });
    renderMenu();
    formMenu.reset();
  });

  formResep.addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = document.getElementById('nama-resep').value.trim();
    const bahan = document.getElementById('bahan-resep').value.trim();
    const langkah = document.getElementById('langkah-resep').value.trim();
    const tag = document.getElementById('tag-resep').value.trim() || 'Umum';
    if (!nama || !bahan || !langkah) return;
    APP_DATA.recipes.push({ id: resepId++, nama: nama, bahan: bahan, langkah: langkah, tag: tag });
    renderResep();
    formResep.reset();
  });

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
})();
