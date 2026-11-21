/* ============================================================
   DATA EDITABLE — ganti sesuai menu, resep & produk kamu.
   /!\\ JANGAN hapus baris "window.APP_DATA = APP_DATA;" /!\\
   ============================================================ */

const APP_DATA = {
  menu: [
    { id: 1, nama: 'Nasi Goreng Spesial', harga: 18000, kategori: 'Makanan', deskripsi: 'Nasi beras premium, sayur, telur, sosis, teh manis.' },
    { id: 2, nama: 'Mie Ayam Bareng Kakak', harga: 15000, kategori: 'Makanan', deskripsi: 'Mie kocak, ayam irit, telur, kuah kaldu kaya.' },
    { id: 3, nama: 'Ayam Goreng Krupuk', harga: 20000, kategori: 'Makanan', deskripsi: 'Ayam goreng renyah, disajai dengan ketan & keripik.' },
    { id: 4, nama: 'Es Teh Tarik', harga: 8000, kategori: 'Minuman', deskripsi: 'Teh tawar, air susu, gula, direntangkan.' },
    { id: 5, nama: 'Es Pelay', harga: 12000, kategori: 'Minuman', deskripsi: 'Es batu, susu cair, sirup, es campur.' },
  ],

  recipes: [
    { id: 1, nama: 'Bumbu Ayam Goreng', bahan: '1 kg ayam, 3 sdm bumbu halus, 1 sdm minyak goreng, garam & merica sesuai rasa', langkah: '1. Cukur & kukus ayam. 2. Aduk bumbu halus dengan minyak goreng. 3. Goreng ayam hingga kalis.', tag: 'Ayam' },
    { id: 2, nama: 'Bumbu Mie Ayam', bahan: '100 g mi, 60 g bumbu halus, 200 ml kaldu, 1 butir telur', langkah: '1. Rebus mi. 2. Rebus kaldu + bumbu. 3. Rebus mi dalam kaldu. 4. Olesi telur di atas mi.', tag: 'Mie' },
    { id: 3, nama: 'Adonan Pekak Ringan', bahan: '200 g tepung terigu, 1/2 sdt baking powder, 1 sdm minyak, 3 sdt air', langkah: '1. Aduk tepung + baking powder. 2. Tambah minyak & air, aduk adonan. 3. Kukus 20 menit.', tag: 'Pekak' },
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
