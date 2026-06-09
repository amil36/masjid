<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriTransaksiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            // Pemasukan
            ['nama' => 'Sedekah / Donasi', 'jenis' => 'pemasukan', 'warna' => '#10B981'],
            ['nama' => 'Kas Jumat', 'jenis' => 'pemasukan', 'warna' => '#3B82F6'],
            ['nama' => 'Infak', 'jenis' => 'pemasukan', 'warna' => '#6366F1'],
            ['nama' => 'Qurban', 'jenis' => 'pemasukan', 'warna' => '#F59E0B'],
            ['nama' => 'Lainnya (Pemasukan)', 'jenis' => 'pemasukan', 'warna' => '#8B5CF6'],
            // Pengeluaran
            ['nama' => 'Operasional Masjid', 'jenis' => 'pengeluaran', 'warna' => '#EF4444'],
            ['nama' => 'Listrik & Air', 'jenis' => 'pengeluaran', 'warna' => '#F97316'],
            ['nama' => 'Perbaikan & Renovasi', 'jenis' => 'pengeluaran', 'warna' => '#EC4899'],
            ['nama' => 'Kegiatan', 'jenis' => 'pengeluaran', 'warna' => '#14B8A6'],
            ['nama' => 'Lainnya (Pengeluaran)', 'jenis' => 'pengeluaran', 'warna' => '#6B7280'],
        ];

        foreach ($data as $item) {
            DB::table('kategori_transaksi')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
