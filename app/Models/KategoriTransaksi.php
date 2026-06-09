<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KategoriTransaksi extends Model
{
    use HasFactory;

    protected $table = 'kategori_transaksi';

    protected $fillable = ['nama', 'jenis', 'warna', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function transaksi()
    {
        return $this->hasMany(TransaksiKas::class, 'kategori_id');
    }

    public function scopePemasukan($query)
    {
        return $query->where('jenis', 'pemasukan');
    }

    public function scopePengeluaran($query)
    {
        return $query->where('jenis', 'pengeluaran');
    }

    public function scopeAktif($query)
    {
        return $query->where('is_active', true);
    }
}
