<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasjidProfile extends Model
{
    protected $table    = 'masjid_profile';
    protected $fillable = [
        'nama_masjid', 'alamat', 'kota', 'provinsi', 'deskripsi',
        'logo', 'foto_masjid', 'tahun_berdiri', 'telepon', 'email',
    ];

    protected $appends = ['logo_url', 'foto_masjid_url'];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }

    public function getFotoMasjidUrlAttribute(): ?string
    {
        return $this->foto_masjid ? asset('storage/' . $this->foto_masjid) : null;
    }
}