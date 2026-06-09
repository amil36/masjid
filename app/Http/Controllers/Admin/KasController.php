<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriTransaksi;
use App\Models\TransaksiKas;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KasController extends Controller
{
    public function index(Request $request)
    {
        $query = TransaksiKas::with('kategori')
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }
        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }
        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', date('m', strtotime($request->bulan)))
                  ->whereYear('tanggal', date('Y', strtotime($request->bulan)));
        }

        $transaksi   = $query->paginate(20)->withQueryString();
        $kategoris   = KategoriTransaksi::aktif()->orderBy('jenis')->orderBy('nama')->get();
        $totalMasuk  = TransaksiKas::pemasukan()->sum('nominal');
        $totalKeluar = TransaksiKas::pengeluaran()->sum('nominal');

        return Inertia::render('Admin/Kas', [
            'transaksi'   => $transaksi,
            'kategoris'   => $kategoris,
            'totalMasuk'  => (float) $totalMasuk,
            'totalKeluar' => (float) $totalKeluar,
            'totalKas'    => (float) ($totalMasuk - $totalKeluar),
            'filters'     => $request->only(['jenis', 'kategori_id', 'bulan']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori_transaksi,id',
            'nominal'     => 'required|numeric|min:1000',
            'keterangan'  => 'nullable|string|max:500',
            'sumber_nama' => 'nullable|string|max:255',
            'is_anonim'   => 'boolean',
            'tanggal'     => 'required|date',
            'bukti'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $kategori = KategoriTransaksi::findOrFail($request->kategori_id);
        $data     = $request->except('bukti');
        $data['jenis']      = $kategori->jenis;
        $data['created_by'] = Auth::id();

        if ($request->hasFile('bukti')) {
            $data['bukti'] = $request->file('bukti')->store('bukti/kas', 'public');
        }

        $transaksi = TransaksiKas::create($data);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'create',
            'modul'      => 'kas',
            'deskripsi'  => "Tambah transaksi {$kategori->jenis} Rp " . number_format($transaksi->nominal),
            'model_type' => TransaksiKas::class,
            'model_id'   => $transaksi->id,
            'data_baru'  => $transaksi->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function update(Request $request, TransaksiKas $transaksi)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori_transaksi,id',
            'nominal'     => 'required|numeric|min:1000',
            'keterangan'  => 'nullable|string|max:500',
            'sumber_nama' => 'nullable|string|max:255',
            'is_anonim'   => 'boolean',
            'tanggal'     => 'required|date',
            'bukti'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $kategori = KategoriTransaksi::findOrFail($request->kategori_id);
        $dataLama = $transaksi->toArray();
        $data     = $request->except('bukti');
        $data['jenis'] = $kategori->jenis;

        if ($request->hasFile('bukti')) {
            if ($transaksi->bukti) {
                \Storage::disk('public')->delete($transaksi->bukti);
            }
            $data['bukti'] = $request->file('bukti')->store('bukti/kas', 'public');
        }

        $transaksi->update($data);

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'update',
            'modul'      => 'kas',
            'deskripsi'  => "Edit transaksi kas ID #{$transaksi->id}",
            'model_type' => TransaksiKas::class,
            'model_id'   => $transaksi->id,
            'data_lama'  => $dataLama,
            'data_baru'  => $transaksi->fresh()->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Request $request, TransaksiKas $transaksi)
    {
        $dataLama = $transaksi->toArray();
        $transaksi->delete();

        LogAktivitas::create([
            'user_id'    => Auth::id(),
            'aksi'       => 'delete',
            'modul'      => 'kas',
            'deskripsi'  => "Hapus transaksi kas ID #{$transaksi->id}",
            'model_type' => TransaksiKas::class,
            'model_id'   => $transaksi->id,
            'data_lama'  => $dataLama,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Transaksi berhasil dihapus.');
    }

    public function kategori()
    {
        return response()->json(KategoriTransaksi::aktif()->orderBy('jenis')->get());
    }
}
