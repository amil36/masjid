<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnggotaPengajian;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnggotaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Anggota', [
            'lakiLaki'  => AnggotaPengajian::lakiLaki()->orderBy('urutan')->get(),
            'perempuan' => AnggotaPengajian::perempuan()->orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'    => 'required|string|max:255',
            'gender'  => 'required|in:laki-laki,perempuan',
            'telepon' => 'nullable|string|max:20',
            'alamat'  => 'nullable|string|max:500',
        ]);

        // Urutan otomatis: terakhir+1 di gender yang sama
        $urutan = AnggotaPengajian::where('gender', $request->gender)->max('urutan') + 1;

        $anggota = AnggotaPengajian::create([
            'nama'    => $request->nama,
            'gender'  => $request->gender,
            'telepon' => $request->telepon,
            'alamat'  => $request->alamat,
            'urutan'  => $urutan,
        ]);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'create',
            'modul'      => 'pengajian',
            'deskripsi'  => "Tambah anggota pengajian: {$anggota->nama} ({$anggota->gender})",
            'model_type' => AnggotaPengajian::class,
            'model_id'   => $anggota->id,
            'data_baru'  => $anggota->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function update(Request $request, AnggotaPengajian $anggota)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'gender'    => 'required|in:laki-laki,perempuan',
            'telepon'   => 'nullable|string|max:20',
            'alamat'    => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $dataLama = $anggota->toArray();
        $anggota->update($request->only('nama', 'gender', 'telepon', 'alamat', 'is_active'));

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'pengajian',
            'deskripsi'  => "Edit anggota: {$anggota->nama}",
            'model_type' => AnggotaPengajian::class,
            'model_id'   => $anggota->id,
            'data_lama'  => $dataLama,
            'data_baru'  => $anggota->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Anggota berhasil diperbarui.');
    }

    public function destroy(Request $request, AnggotaPengajian $anggota)
    {
        $nama = $anggota->nama;
        $anggota->delete();

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'delete',
            'modul'      => 'pengajian',
            'deskripsi'  => "Hapus anggota: {$nama}",
            'model_type' => AnggotaPengajian::class,
            'model_id'   => $anggota->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Anggota berhasil dihapus.');
    }

    // Atur ulang urutan pengajian (drag & drop)
    public function reorder(Request $request)
    {
        $request->validate([
            'gender'  => 'required|in:laki-laki,perempuan',
            'ordered' => 'required|array',
            'ordered.*' => 'exists:anggota_pengajian,id',
        ]);

        foreach ($request->ordered as $urutan => $id) {
            AnggotaPengajian::where('id', $id)->update(['urutan' => $urutan + 1]);
        }

        return back()->with('success', 'Urutan anggota berhasil diperbarui.');
    }
}
