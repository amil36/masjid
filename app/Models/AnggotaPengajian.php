<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnggotaPengajian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'anggota_pengajian';

    protected $fillable = [
        'nama', 'gender', 'telepon', 'alamat', 'is_active', 'urutan',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function jadwalPengajian()
    {
        return $this->hasMany(JadwalPengajian::class, 'anggota_id');
    }

    public function jadwalMendatang()
    {
        return $this->hasMany(JadwalPengajian::class, 'anggota_id')
            ->where('tanggal', '>=', now()->toDateString())
            ->orderBy('tanggal');
    }

    // Scope by gender
    public function scopeLakiLaki($query)
    {
        return $query->where('gender', 'laki-laki');
    }

    public function scopePerempuan($query)
    {
        return $query->where('gender', 'perempuan');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_active', true);
    }
}
