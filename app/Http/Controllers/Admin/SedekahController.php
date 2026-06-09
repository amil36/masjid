<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriTransaksi;
use App\Models\Sedekah;
use App\Models\TransaksiKas;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SedekahController extends Controller
{
    public function index(Request $request)
    {
        $query = Sedekah::orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Sedekah', [
            'sedekah' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('status'),
            'stats'   => [
                'total_pending'  => Sedekah::pending()->count(),
                'total_verified' => Sedekah::verified()->sum('nominal'),
            ],
        ]);
    }

    public function verify(Request $request, Sedekah $sedekah)
    {
        $request->validate([
            'status'         => 'required|in:verified,rejected',
            'catatan_admin'  => 'nullable|string|max:500',
        ]);

        if ($sedekah->status !== 'pending') {
            return back()->withErrors(['msg' => 'Sedekah ini sudah diverifikasi.']);
        }

        DB::transaction(function () use ($request, $sedekah) {
            $sedekah->update([
                'status'        => $request->status,
                'catatan_admin' => $request->catatan_admin,
                'verified_by'   => Auth::id(),
                'verified_at'   => now(),
            ]);

            // Jika verified, masukkan ke kas
            if ($request->status === 'verified') {
                $kategori = KategoriTransaksi::where('nama', 'like', '%Sedekah%')
                    ->where('jenis', 'pemasukan')
                    ->first();

                TransaksiKas::create([
                    'kategori_id'    => $kategori?->id ?? 1,
                    'jenis'          => 'pemasukan',
                    'nominal'        => $sedekah->nominal,
                    'keterangan'     => 'Sedekah dari ' . $sedekah->nama_tampil,
                    'sumber_nama'    => $sedekah->nama,
                    'is_anonim'      => $sedekah->is_anonim,
                    'bukti'          => $sedekah->bukti,
                    'tanggal'        => now()->toDateString(),
                    'reference_type' => 'sedekah',
                    'reference_id'   => $sedekah->id,
                    'created_by'     => Auth::id(),
                ]);
            }
        });

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'sedekah',
            'deskripsi'  => "Verifikasi sedekah ID #{$sedekah->id} - status: {$request->status}",
            'model_type' => Sedekah::class,
            'model_id'   => $sedekah->id,
            'ip_address' => $request->ip(),
        ]);

        $pesan = $request->status === 'verified'
            ? 'Sedekah berhasil diverifikasi dan masuk ke kas masjid.'
            : 'Sedekah telah ditolak.';

        return back()->with('success', $pesan);
    }
}
