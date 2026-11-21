/* ============================================================
   DATA EDITABLE — ganti sesuai menu, resep & produk kamu.
   ============================================================ */

const APP_DATA = {
  menu: [
    { id: 1, nama: 'Nasi Goreng Spesial', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Nasi+Goreng', harga: 18000, paketan: false, kategori: 'Makanan', deskripsi: 'Nasi beras premium, sayur, telur, sosis, teh manis.' },
    { id: 2, nama: 'Mie Ayam Bareng Kakak', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Mie+Ayam', harga: 15000, paketan: false, kategori: 'Makanan', deskripsi: 'Mie kocak, ayam irit, telur, kuah kaldu kaya.' },
    { id: 3, nama: 'Ayam Goreng Krupuk', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Ayam+Goreng+Krupuk', harga: 20000, paketan: true, kategori: 'Makanan', deskripsi: 'Ayam goreng renyah, disajai dengan ketan & keripik.', detail_paket: '1 paket = 4 potong ayam + ketan' },
    { id: 4, nama: 'Es Teh Tarik', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Es+Teh+Tarik', harga: 8000, paketan: false, kategori: 'Minuman', deskripsi: 'Teh tawar, air susu, gula, direntangkan.' },
    { id: 5, nama: 'Es Pelay', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Es+Pelay', harga: 12000, paketan: false, kategori: 'Minuman', deskripsi: 'Es batu, susu cair, sirup, es campur.' },
    { id: 6, nama: 'Paket Risol Mayo', gambar: 'https://placehold.co/320x200/f5e6d3/e07a3f?text=Paket+Risol', harga: 25000, paketan: true, kategori: 'Paket', deskripsi: 'Hemat belanja.', detail_paket: 'Risol 4 buah + sambal 1 botol' },
  ],

  recipes: [
    { id: 1, judul: 'Risol Mayo', hasil: 4, gambar: 'https://placehold.co/640x400/f5e6d3/e07a3f?text=Risol+Mayo', est_harga: 5000, deskripsi: 'Risol saus mayonese kenyal, renyah, cocok hangat-hangat.', bahan: [ { nama: 'Tepung terigu', qty: 200, satuan: 'gram' }, { nama: 'Telur', qty: 2, satuan: 'buah' }, { nama: 'Mayones', qty: 100, satuan: 'gram' }, { nama: 'Minyak goreng', qty: 3, satuan: 'sdm' }, { nama: 'Garami', qty: 'secukupnya', satuan: '' } ], langkah: '1. Kocok telur, garam, merica, dan minyak panas sampai mengental. 2. Campur tepung terigu, aduk rata. 3. Rendam adonan, masukkan singkong, panggang hingga kering dan emas. 4. Campur mayones, susu, dan kaldu sebagai saus. 5. Sajikan panas.', youtube: 'https://www.youtube.com/watch?v=example1' },
    { id: 2, judul: 'Mie Nasi Goreng', hasil: 2, gambar: 'https://placehold.co/640x400/f5e6d3/e07a3f?text=Mie+Nasi+Goreng', est_harga: 20000, deskripsi: 'Nasi goreng gurih dengan telur dan ayam.', bahan: [ { nama: 'Nasi putih', qty: 300, satuan: 'gram' }, { nama: 'Telur', qty: 2, satuan: 'buah' }, { nama: 'Ayam irit', qty: 150, satuan: 'gram' }, { nama: 'Bawang goreng', qty: 30, satuan: 'gram' } ], langkah: '1. Panggang ayam, iris bawang goreng. 2. Tumis telur, kukus nasi. 3. Tumis bumbu, masukkan ayam, nasi, saus. 4. Aduk rata, sajikan.', youtube: 'https://www.youtube.com/watch?v=example2' },
    { id: 3, judul: 'Ayam Goreng Krupuk', hasil: 8, gambar: 'https://placehold.co/640x400/f5e6d3/e07a3f?text=Ayam+Goreng+Krupuk', est_harga: 10000, deskripsi: 'Ayam goreng dengan krupuk renyah.', bahan: [ { nama: 'Ayam', qty: 500, satuan: 'gram' }, { nama: 'Tepung terigu', qty: 100, satuan: 'gram' }, { nama: 'Minyak goreng', qty: 200, satuan: 'ml' }, { nama: 'Krupuk', qty: 50, satuan: 'lembar' } ], langkah: '1. Cukur ayam, masak kering. 2. Baluri tepung, goreng ayam. 3. Renyahkan krupuk, sajikan bersama.', youtube: 'https://www.youtube.com/watch?v=example3' },
  ],

  products: [
    { id: 101, nama: 'Bumbu Kering Oprek', sku: 'BGM-001', harga: 25000, stok: 120, kategori: 'Bahan Baku', deskripsi: 'Bumbu kering, berisi bawang gosong, kunyit, jinten.' },
    { id: 102, nama: 'Teh Botol My', sku: 'TBH-002', harga: 9000, stok: 80, kategori: 'Minuman', deskripsi: 'Teh manis botol rasa es kelapa.' },
    { id: 103, nama: 'Minyak Goreng Kamar', sku: 'MGY-003', harga: 18000, stok: 55, kategori: 'Bahan Baku', deskripsi: 'Minyak goreng bunga matahari, 1 liter.' },
    { id: 104, nama: 'Gula Pasir', sku: 'GS-004', harga: 12000, stok: 200, kategori: 'Bahan Baku', deskripsi: 'Gula pasir halus 5 kg.' },
  ],

  sources: [
    { id: 'wiki', name: 'Wikipedia', type: 'Ensiklopedia', icon: '📖', url: 'https://id.wikipedia.org', note: 'Artikel & definisi, bebas (tanpa API key).' },
    { id: 'off', name: 'OpenFoodFacts', type: 'Produk Makanan', icon: '🥣', url: 'https://world.openfoodfacts.org', note: 'Dokumen produk, bebas (tanpa API key).' },
    { id: 'weather', name: 'Open-Meteo', type: 'Cuaca', icon: '🌤️', url: 'https://open-meteo.com', note: 'Cuaca & iklim tanpa API key.' },
    { id: 'news', name: 'News (demo)', type: 'Berita', icon: '📰', url: 'https://newsapi.org', note: 'Sample berita, butuh API key di produksi.' },
  ],

  weatherSample: {
    city: 'Jakarta',
    temp: 30,
    condition: 'Cerah',
    humidity: 74,
    wind: 12,
    updated: new Date().toLocaleTimeString('id-ID'),
  },
};

window.APP_DATA = APP_DATA;
