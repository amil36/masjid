<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\JadwalPengajian;
use App\Models\Kegiatan;
use App\Models\MasjidProfile;
use App\Models\Pengurus;
use App\Models\Qurban;
use App\Models\TransaksiKas;
use Carbon\Carbon;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $profil   = MasjidProfile::first();
        $pengurus = Pengurus::where('is_active', true)->orderBy('urutan')->get();

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

        // Kegiatan mendatang
        $kegiatan = Kegiatan::mendatang()->limit(6)->get();

        // Transaksi pengeluaran (publik)
        $pengeluaran = TransaksiKas::with('kategori')
            ->pengeluaran()
            ->orderBy('tanggal', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'keterangan'  => $t->keterangan,
                'nominal'     => $t->nominal,
                'tanggal'     => $t->tanggal,
                'kategori'    => $t->kategori?->nama,
            ]);

        // Grafik pengeluaran 6 bulan terakhir
        $grafikPengeluaran = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $grafikPengeluaran[] = [
                'bulan'  => $date->translatedFormat('M Y'),
                'keluar' => (float) TransaksiKas::pengeluaran()
                    ->whereYear('tanggal', $date->year)
                    ->whereMonth('tanggal', $date->month)
                    ->sum('nominal'),
            ];
        }

        // Qurban tahun ini
        $qurban = Qurban::tahunIni()->orderBy('created_at', 'desc')->get();

        return Inertia::render('Landing', [
            'profil'             => $profil,
            'pengurus'           => $pengurus,
            'jadwalMingguIni'    => $jadwalMingguIni,
            'jadwalMingguDepan'  => $jadwalMingguDepan,
            'kegiatan'           => $kegiatan,
            'pengeluaran'        => $pengeluaran,
            'grafikPengeluaran'  => $grafikPengeluaran,
            'qurban'             => $qurban,
            'totalKas'           => (float) TransaksiKas::totalKas(),
        ]);
    }
}
