# 🕌 Sistem Informasi Manajemen Masjid

Sistem Informasi Manajemen Masjid merupakan aplikasi berbasis web yang dikembangkan menggunakan Laravel untuk membantu pengelolaan kegiatan administrasi masjid secara lebih efektif, terstruktur, dan transparan.

Aplikasi ini menyediakan berbagai fitur mulai dari pengelolaan kas masjid, anggota pengajian, jadwal pengajian, kegiatan masjid, data qurban, hingga verifikasi sedekah dari masyarakat.

---

## ✨ Fitur Utama

### 🌐 Halaman Publik
- Landing page informasi masjid.
- Formulir sedekah online.
- Penyimpanan data sedekah dari jamaah.

### 🔐 Sistem Autentikasi
- Login administrator.
- Logout.
- Update profil.
- Ubah password akun.

### 📊 Dashboard Admin
- Ringkasan data masjid.
- Statistik informasi administrasi.

### 💰 Manajemen Kas
- Menambah transaksi kas.
- Mengubah transaksi kas.
- Menghapus transaksi kas.
- Pengelolaan kategori kas.

### 👥 Manajemen Anggota Pengajian
- Menambah anggota.
- Mengubah data anggota.
- Menghapus anggota.
- Mengatur ulang urutan anggota.

### 📅 Jadwal Pengajian
- Menambah jadwal pengajian.
- Mengubah jadwal.
- Menghapus jadwal.
- Generate jadwal otomatis.

### 🎉 Manajemen Kegiatan
- Menambah kegiatan masjid.
- Mengubah kegiatan.
- Menghapus kegiatan.

### 🐄 Manajemen Qurban
- Pendataan peserta qurban.
- Mengubah data qurban.
- Menghapus data qurban.

### 🤲 Verifikasi Sedekah
- Melihat daftar sedekah masuk.
- Memverifikasi sedekah dari jamaah.

### ⚙️ Pengaturan Masjid
- Mengelola informasi masjid.
- Memperbarui data profil masjid.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| PHP 8.3+ | Bahasa pemrograman utama |
| Laravel 13 | Framework backend |
| Blade | Template engine |
| MySQL | Database |
| Inertia.js | Integrasi frontend |
| Ziggy | Routing JavaScript |
| Vite | Build tools frontend |
| Composer | Dependency manager PHP |
| NPM | Package manager JavaScript |

---

## 📂 Struktur Fitur

```
Public
├── Landing Page
└── Sedekah Online

Authentication
├── Login
├── Logout
├── Update Profil
└── Ubah Password

Admin
├── Dashboard
├── Kas
├── Anggota Pengajian
├── Jadwal Pengajian
├── Kegiatan
├── Qurban
├── Verifikasi Sedekah
└── Pengaturan Masjid
```

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/nama-project.git
cd nama-project
```

### 2. Install Dependency PHP

```bash
composer install
```

### 3. Install Dependency Frontend

```bash
npm install
```

### 4. Salin File Environment

```bash
cp .env.example .env
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Atur Konfigurasi Database

Edit file `.env`.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

### 7. Jalankan Migrasi Database

```bash
php artisan migrate
```

Jika tersedia seeder:

```bash
php artisan db:seed
```

## 🔐 Akun Default

Setelah menjalankan seeder, gunakan kredensial berikut untuk login ke sistem:

| Field | Value |
|---------|---------|
| **Username** | `superadmin` |
| **Email** | `superadmin@masjid.com` |
| **Password** | `password` |

> ⚠️ **Penting:** Demi keamanan, segera ubah password default setelah berhasil login pertama kali.

### 8. Jalankan Server

```bash
php artisan serve
```

Aplikasi dapat diakses melalui:

```
http://127.0.0.1:8000
```

---

## 💻 Menjalankan Mode Development

Backend Laravel:

```bash
php artisan serve
```

Frontend Vite:

```bash
npm run dev
```

Atau menggunakan perintah bawaan Composer:

```bash
composer run dev
```

---

## 🔒 Hak Akses

### Administrator
Memiliki akses penuh terhadap seluruh fitur sistem, meliputi:

- Dashboard
- Pengelolaan kas
- Data anggota
- Jadwal pengajian
- Data kegiatan
- Data qurban
- Verifikasi sedekah
- Pengaturan masjid

### Pengunjung
Dapat mengakses:

- Landing page
- Formulir sedekah online

---

## 📸 Modul Sistem

- Dashboard Administrasi
- Kas Masjid
- Anggota Pengajian
- Jadwal Pengajian
- Kegiatan Masjid
- Qurban
- Verifikasi Sedekah
- Pengaturan Masjid

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT License**.

---

## 👨‍💻 Pengembang

Sistem Informasi Manajemen Masjid dikembangkan sebagai solusi digital untuk meningkatkan efisiensi administrasi serta transparansi pengelolaan kegiatan dan keuangan masjid.

Semoga aplikasi ini dapat memberikan manfaat bagi pengurus masjid maupun jamaah dalam mendukung pelayanan yang lebih baik.
