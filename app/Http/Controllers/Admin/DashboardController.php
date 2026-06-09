<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnggotaPengajian;
use App\Models\JadwalPengajian;
use App\Models\Kegiatan;
use App\Models\Qurban;
use App\Models\Sedekah;
use App\Models\TransaksiKas;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tahunIni = now()->year;

        // Jadwal pengajian minggu ini & depan
        $jadwalMingguIni = JadwalPengajian::with('anggota')
            ->mingguIni()
            ->orderBy('tanggal')
            ->get()
            ->groupBy('jenis');

        $jadwalMingguDepan = JadwalPengajian::with('anggota')
            ->mingguDepan()
            ->orderBy('tanggal')
            ->get()
            ->groupBy('jenis');

        // Grafik pemasukan & pengeluaran 6 bulan terakhir
        $grafikData = $this->getGrafikData();

        // Statistik
        $stats = [
            'total_kas'            => TransaksiKas::totalKas(),
            'total_anggota_laki'   => AnggotaPengajian::lakiLaki()->aktif()->count(),
            'total_anggota_wanita' => AnggotaPengajian::perempuan()->aktif()->count(),
            'kegiatan_mendatang'   => Kegiatan::belumTerlaksana()->count(),
            'qurban_tahun_ini'     => Qurban::tahunIni()->count(),
            'sedekah_pending'      => Sedekah::pending()->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'jadwalMingguIni'   => $jadwalMingguIni,
            'jadwalMingguDepan' => $jadwalMingguDepan,
            'grafikData'        => $grafikData,
            'stats'             => $stats,
        ]);
    }

    private function getGrafikData(): array
    {
        $bulan = [];
        for ($i = 5; $i >= 0; $i--) {
            $date    = Carbon::now()->subMonths($i);
            $masuk   = TransaksiKas::pemasukan()
                ->whereYear('tanggal', $date->year)
                ->whereMonth('tanggal', $date->month)
                ->sum('nominal');
            $keluar  = TransaksiKas::pengeluaran()
                ->whereYear('tanggal', $date->year)
                ->whereMonth('tanggal', $date->month)
                ->sum('nominal');

            $bulan[] = [
                'bulan'   => $date->translatedFormat('M Y'),
                'masuk'   => (float) $masuk,
                'keluar'  => (float) $keluar,
                'saldo'   => (float) ($masuk - $keluar),
            ];
        }
        return $bulan;
    }
}
