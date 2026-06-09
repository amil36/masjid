<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    public function index(Request $request)
    {
        $query = Kegiatan::orderBy('tanggal', 'desc');

        if ($request->filled('filter')) {
            if ($request->filter === 'mendatang') {
                $query->where('tanggal', '>=', now()->toDateString());
            } elseif ($request->filter === 'selesai') {
                $query->where('tanggal', '<', now()->toDateString());
            }
        }

        return Inertia::render('Admin/Kegiatan', [
            'kegiatan' => $query->paginate(15)->withQueryString(),
            'filters'  => $request->only('filter'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'      => 'required|string|max:255',
            'tempat'     => 'required|string|max:255',
            'tanggal'    => 'required|date|after_or_equal:today',
            'waktu'      => 'nullable|date_format:H:i',
            'deskripsi'  => 'nullable|string|max:1000',
        ]);

        $data               = $request->all();
        $data['created_by'] = Auth::id();
        if ($data['waktu'] ?? null) {
            $data['waktu'] = $data['waktu'] . ':00';
        }

        $kegiatan = Kegiatan::create($data);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'create',
            'modul'      => 'kegiatan',
            'deskripsi'  => "Tambah kegiatan: {$kegiatan->judul}",
            'model_type' => Kegiatan::class,
            'model_id'   => $kegiatan->id,
            'data_baru'  => $kegiatan->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    public function update(Request $request, Kegiatan $kegiatan)
    {
        $request->validate([
            'judul'     => 'required|string|max:255',
            'tempat'    => 'required|string|max:255',
            'tanggal'   => 'required|date',
            'waktu'     => 'nullable|date_format:H:i',
            'deskripsi' => 'nullable|string|max:1000',
        ]);

        $dataLama = $kegiatan->toArray();
        $data     = $request->all();
        if ($data['waktu'] ?? null) {
            $data['waktu'] = $data['waktu'] . ':00';
        }

        $kegiatan->update($data);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'kegiatan',
            'deskripsi'  => "Edit kegiatan: {$kegiatan->judul}",
            'model_type' => Kegiatan::class,
            'model_id'   => $kegiatan->id,
            'data_lama'  => $dataLama,
            'data_baru'  => $kegiatan->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(Request $request, Kegiatan $kegiatan)
    {
        $judul = $kegiatan->judul;
        $kegiatan->delete();

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'delete',
            'modul'      => 'kegiatan',
            'deskripsi'  => "Hapus kegiatan: {$judul}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Kegiatan berhasil dihapus.');
    }
}
