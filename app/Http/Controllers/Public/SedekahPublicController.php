<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Sedekah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SedekahPublicController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nama'      => 'nullable|string|max:255',
            'is_anonim' => 'required|boolean',
            'nominal'   => 'required|numeric|min:1000',
            'bukti'     => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'nominal.min'  => 'Minimal sedekah adalah Rp 1.000.',
            'bukti.required' => 'Bukti transfer wajib diunggah.',
            'bukti.max'    => 'Ukuran file maksimal 2 MB.',
        ]);

        // Validasi: jika tidak anonim, nama wajib ada
        if (!$request->boolean('is_anonim') && empty($request->nama)) {
            return back()->withErrors(['nama' => 'Nama wajib diisi jika tidak anonim.']);
        }

        $buktiPath = $request->file('bukti')->store('bukti/sedekah', 'public');

        $sedekah = Sedekah::create([
            'nama'      => $request->boolean('is_anonim') ? null : $request->nama,
            'is_anonim' => $request->boolean('is_anonim'),
            'nominal'   => $request->nominal,
            'bukti'     => $buktiPath,
            'status'    => 'pending',
        ]);

        return back()->with('success', 'Terima kasih! Sedekah Anda sedang menunggu verifikasi admin.');
    }
}
