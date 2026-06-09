<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasjidProfile;
use App\Models\Pengurus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'masjid'   => MasjidProfile::first(),
            'pengurus' => Pengurus::orderBy('urutan')->get(),
        ]);
    }

    public function updateMosque(Request $request)
    {
        $request->validate([
            'nama_masjid' => 'required|string|max:255',
            'logo'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_masjid' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $masjid = MasjidProfile::firstOrCreate([]);
        $data   = $request->except(['logo', 'foto_masjid']);

        if ($request->hasFile('logo')) {
            if ($masjid->logo) \Storage::disk('public')->delete($masjid->logo);
            $data['logo'] = $request->file('logo')->store('masjid', 'public');
        }
        if ($request->hasFile('foto_masjid')) {
            if ($masjid->foto_masjid) \Storage::disk('public')->delete($masjid->foto_masjid);
            $data['foto_masjid'] = $request->file('foto_masjid')->store('masjid', 'public');
        }

        $masjid->update($data);

        // Reset cache profil masjid
        cache()->forget('masjid_profile');

        return back()->with('success', 'Profil masjid berhasil diperbarui.');
    }
}