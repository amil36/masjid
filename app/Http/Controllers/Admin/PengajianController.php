<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnggotaPengajian;
use App\Models\JadwalPengajian;
use App\Models\LogAktivitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengajianController extends Controller
{
    public function index(Request $request)
    {
        $bulan  = $request->get('bulan', now()->format('Y-m'));
        [$year, $month] = explode('-', $bulan);

        $jadwalLaki = JadwalPengajian::with('anggota')
            ->lakiLaki()
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal')
            ->get();

        $jadwalPerempuan = JadwalPengajian::with('anggota')
            ->perempuan()
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal')
            ->get();

        $anggotaLaki     = AnggotaPengajian::lakiLaki()->aktif()->orderBy('urutan')->get();
        $anggotaPerempuan = AnggotaPengajian::perempuan()->aktif()->orderBy('urutan')->get();

        return Inertia::render('Admin/Pengajian', [
            'jadwalLaki'       => $jadwalLaki,
            'jadwalPerempuan'  => $jadwalPerempuan,
            'anggotaLaki'      => $anggotaLaki,
            'anggotaPerempuan' => $anggotaPerempuan,
            'bulan'            => $bulan,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'anggota_id' => 'required|exists:anggota_pengajian,id',
            'tanggal'    => 'required|date',
            'tempat'     => 'required|string|max:255',
            'waktu'      => 'required|date_format:H:i',
            'keterangan' => 'nullable|string|max:500',
        ]);

        $anggota = AnggotaPengajian::findOrFail($request->anggota_id);

        $jadwal = JadwalPengajian::create([
            'anggota_id'   => $anggota->id,
            'jenis'        => $anggota->gender,
            'tanggal'      => $request->tanggal,
            'hari'         => JadwalPengajian::getNamaHari($request->tanggal),
            'hari_pasaran' => JadwalPengajian::getHariPasaran($request->tanggal),
            'tempat'       => $request->tempat,
            'waktu'        => $request->waktu . ':00',
            'keterangan'   => $request->keterangan,
        ]);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'create',
            'modul'      => 'pengajian',
            'deskripsi'  => "Tambah jadwal pengajian {$anggota->gender} - {$anggota->nama}",
            'model_type' => JadwalPengajian::class,
            'model_id'   => $jadwal->id,
            'data_baru'  => $jadwal->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Jadwal pengajian berhasil ditambahkan.');
    }

    public function update(Request $request, JadwalPengajian $jadwal)
    {
        $request->validate([
            'anggota_id' => 'required|exists:anggota_pengajian,id',
            'tanggal'    => 'required|date',
            'tempat'     => 'required|string|max:255',
            'waktu'      => 'required|date_format:H:i',
            'keterangan' => 'nullable|string|max:500',
            'is_selesai' => 'boolean',
        ]);

        $dataLama = $jadwal->toArray();
        $anggota  = AnggotaPengajian::findOrFail($request->anggota_id);

        $jadwal->update([
            'anggota_id'   => $anggota->id,
            'jenis'        => $anggota->gender,
            'tanggal'      => $request->tanggal,
            'hari'         => JadwalPengajian::getNamaHari($request->tanggal),
            'hari_pasaran' => JadwalPengajian::getHariPasaran($request->tanggal),
            'tempat'       => $request->tempat,
            'waktu'        => $request->waktu . ':00',
            'keterangan'   => $request->keterangan,
            'is_selesai'   => $request->boolean('is_selesai'),
        ]);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'pengajian',
            'deskripsi'  => "Edit jadwal pengajian ID #{$jadwal->id}",
            'model_type' => JadwalPengajian::class,
            'model_id'   => $jadwal->id,
            'data_lama'  => $dataLama,
            'data_baru'  => $jadwal->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Jadwal pengajian berhasil diperbarui.');
    }

    public function destroy(Request $request, JadwalPengajian $jadwal)
    {
        $jadwal->delete();

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'delete',
            'modul'      => 'pengajian',
            'deskripsi'  => "Hapus jadwal pengajian ID #{$jadwal->id}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }

    /**
     * Generate jadwal otomatis untuk sebulan ke depan
     * berdasarkan urutan anggota yang tersisa
     */
    public function generateJadwal(Request $request)
    {
        $request->validate([
            'jenis'  => 'required|in:laki-laki,perempuan',
            'bulan'  => 'required|date_format:Y-m',
        ]);

        [$year, $month] = explode('-', $request->bulan);

        // Tentukan hari default: laki-laki = Kamis malam (hari Jumat), perempuan = Jumat
        $targetDayOfWeek = $request->jenis === 'laki-laki' ? Carbon::THURSDAY : Carbon::FRIDAY;
        $defaultWaktu    = $request->jenis === 'laki-laki' ? '20:00:00' : '09:00:00';

        // Anggota aktif urut
        $anggota = AnggotaPengajian::where('gender', $request->jenis)
            ->aktif()
            ->orderBy('urutan')
            ->get();

        if ($anggota->isEmpty()) {
            return back()->withErrors(['msg' => 'Tidak ada anggota aktif.']);
        }

        // Cari hari-hari yang sesuai di bulan itu
        $dates = [];
        $date  = Carbon::create($year, $month, 1)->startOfMonth();
        $end   = $date->copy()->endOfMonth();

        while ($date <= $end) {
            if ($date->dayOfWeek === $targetDayOfWeek) {
                $dates[] = $date->copy();
            }
            $date->addDay();
        }

        // Cari anggota yang belum punya jadwal di bulan ini
        $sudahDijadwal = JadwalPengajian::where('jenis', $request->jenis)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->pluck('anggota_id')
            ->toArray();

        $anggotaBelum = $anggota->whereNotIn('id', $sudahDijadwal)->values();
        $created      = 0;

        foreach ($dates as $i => $tgl) {
            if (!isset($anggotaBelum[$i])) break;

            $a = $anggotaBelum[$i];
            JadwalPengajian::create([
                'anggota_id'   => $a->id,
                'jenis'        => $a->gender,
                'tanggal'      => $tgl->toDateString(),
                'hari'         => JadwalPengajian::getNamaHari($tgl),
                'hari_pasaran' => JadwalPengajian::getHariPasaran($tgl),
                'tempat'       => 'Masjid',
                'waktu'        => $defaultWaktu,
            ]);
            $created++;
        }

        return back()->with('success', "{$created} jadwal pengajian berhasil digenerate.");
    }
}
