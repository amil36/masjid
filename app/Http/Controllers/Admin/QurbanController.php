<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Qurban;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QurbanController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->get('tahun', now()->year);
        $query = Qurban::where('tahun', $tahun)->orderBy('created_at', 'desc');

        $ringkasan = Qurban::tahun($tahun)
            ->selectRaw('jenis_hewan, SUM(jumlah_hewan) as total, COUNT(*) as jumlah_peserta')
            ->groupBy('jenis_hewan')
            ->get();

        $tahunList = Qurban::selectRaw('DISTINCT tahun')->orderBy('tahun', 'desc')->pluck('tahun');

        return Inertia::render('Admin/Qurban', [
            'qurban'    => $query->paginate(20)->withQueryString(),
            'ringkasan' => $ringkasan,
            'tahun'     => (int) $tahun,
            'tahunList' => $tahunList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_peserta' => 'required|string|max:255',
            'jenis_hewan'  => 'required|in:kambing,sapi,kerbau',
            'jumlah_hewan' => 'required|integer|min:1|max:100',
            'tahun'        => 'required|integer|min:2000|max:2100',
            'keterangan'   => 'nullable|string|max:500',
        ]);

        $qurban = Qurban::create(array_merge(
            $request->all(),
            ['created_by' => Auth::id()]
        ));

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'create',
            'modul'      => 'qurban',
            'deskripsi'  => "Tambah qurban: {$qurban->nama_peserta} ({$qurban->jenis_hewan} x{$qurban->jumlah_hewan})",
            'model_type' => Qurban::class,
            'model_id'   => $qurban->id,
            'data_baru'  => $qurban->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Data qurban berhasil ditambahkan.');
    }

    public function update(Request $request, Qurban $qurban)
    {
        $request->validate([
            'nama_peserta' => 'required|string|max:255',
            'jenis_hewan'  => 'required|in:kambing,sapi,kerbau',
            'jumlah_hewan' => 'required|integer|min:1|max:100',
            'tahun'        => 'required|integer|min:2000|max:2100',
            'keterangan'   => 'nullable|string|max:500',
        ]);

        $dataLama = $qurban->toArray();
        $qurban->update($request->all());

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'qurban',
            'deskripsi'  => "Edit qurban: {$qurban->nama_peserta}",
            'model_type' => Qurban::class,
            'model_id'   => $qurban->id,
            'data_lama'  => $dataLama,
            'data_baru'  => $qurban->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Data qurban berhasil diperbarui.');
    }

    public function destroy(Request $request, Qurban $qurban)
    {
        $nama = $qurban->nama_peserta;
        $qurban->delete();

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'delete',
            'modul'      => 'qurban',
            'deskripsi'  => "Hapus qurban: {$nama}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Data qurban berhasil dihapus.');
    }
}
