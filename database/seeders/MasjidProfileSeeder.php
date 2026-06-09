<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasjidProfileSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('masjid_profile')->insert([
            'nama_masjid'   => 'Masjid Al-Ikhlas',
            'alamat'        => 'Jl. Contoh No. 1, RT 01/RW 01',
            'kota'          => 'Kudus',
            'provinsi'      => 'Jawa Tengah',
            'deskripsi'     => 'Masjid Al-Ikhlas adalah masjid yang berdiri di tengah masyarakat dengan tujuan menjadi pusat ibadah dan kegiatan keagamaan yang transparan dan amanah.',
            'tahun_berdiri' => '1985',
            'telepon'       => '0812-3456-7890',
            'email'         => 'masjid.alikhlas@gmail.com',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        DB::table('pengurus')->insert([
            ['nama' => 'H. Ahmad Fauzi', 'jabatan' => 'Ketua Takmir', 'urutan' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Budi Santoso', 'jabatan' => 'Sekretaris', 'urutan' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Siti Rahayu', 'jabatan' => 'Bendahara', 'urutan' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['nama' => 'Abdul Wahid', 'jabatan' => 'Bidang Dakwah', 'urutan' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
