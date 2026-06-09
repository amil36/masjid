<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnggotaPengajianSeeder extends Seeder
{
    public function run(): void
    {
        $lakiLaki = [
            'Ahmad Fauzi', 'Budi Santoso', 'Cholid Anwar', 'Dedi Setiawan',
            'Eko Purnomo', 'Fajar Nugroho', 'Gunawan', 'Hadi Saputro',
        ];

        $perempuan = [
            'Siti Rahayu', 'Nurul Hidayah', 'Aminah', 'Dewi Lestari',
            'Eka Wulandari', 'Fatimah', 'Gita Puspita', 'Hafsah',
        ];

        $urutan = 1;
        foreach ($lakiLaki as $nama) {
            DB::table('anggota_pengajian')->insert([
                'nama'       => $nama,
                'gender'     => 'laki-laki',
                'urutan'     => $urutan++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $urutan = 1;
        foreach ($perempuan as $nama) {
            DB::table('anggota_pengajian')->insert([
                'nama'       => $nama,
                'gender'     => 'perempuan',
                'urutan'     => $urutan++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
