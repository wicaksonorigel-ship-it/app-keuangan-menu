# Dapur Herkes — Aplikasi Pemasukan, Menu & Resep

Aplikasi web sederhana untuk bisnis produk Anda. Berisi 3 halaman utama:

1. **💰 Keuangan** — catat pemasukan & pengeluaran produk (dengan kategori), otomatis hitung total + laba.
2. **🍽️ Menu Jual** — daftar menu yang dijual (nama, harga, kategori, deskripsi).
3. **👩‍🍳 Resep Adonan** — daftar resep dengan bahan & langkah pembuatan.

## Cara menjalankan (tanpa server)

Buka `index.html` langsung di browser. 
> Untuk akses dari jaringan/online, deploy ke GitHub Pages, Netlify, atau Vercel.

## Cara mengisi data asli

Semua data masuk di `js/data.js`:
- **menu** → ganti dengan menu yang Anda jual (nama, harga, kategori, deskripsi).
- **recipes** → ganti dengan resep adonan Anda (bahan & langkah).
- **ledger (keuangan)** → yang tersimpan otomatis di `localStorage` browser; `js/app.js` inisialisasi contoh pertama.

## Fitur

- Catat transaksi (pemasukan/pengeluaran), filter per jenis, lihat ringkasan (pemasukan, pengeluaran, laba).
- Tambah menu baru via form.
- Tambah resep baru via form.
- Responsive (mobile & desktop).

## Deploy ke GitHub Pages (opsional)

1. Push folder ini ke branch `main`.
2. Settings → Pages → Source: Deploy from a branch → `main`.
3. Akses URL Pages yang dihasilkan.

## Catatan data

- Data keuangan disimpan di `localStorage` (per browser). Untuk backup / data bersama, salin isi `localStorage` secara manual atau bedakan per pengguna.
