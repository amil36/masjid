<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengurus extends Model
{
    protected $table    = 'pengurus';
    protected $fillable = ['nama', 'jabatan', 'foto', 'telepon', 'urutan', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getFotoUrlAttribute(): string
    {
        if ($this->foto) {
            return asset('storage/' . $this->foto);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->nama) . '&background=1e3a5f&color=fff';
    }
}
