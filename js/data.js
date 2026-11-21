/* ============================================================
   DATA EDITABLE — ganti sesuai menu & resep kamu.
   /!\ JANGAN hapus baris "window.APP_DATA = APP_DATA;". /!\
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
};

window.APP_DATA = APP_DATA;
