<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransaksiKas extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'transaksi_kas';

    protected $fillable = [
        'kategori_id', 'jenis', 'nominal', 'keterangan',
        'sumber_nama', 'is_anonim', 'bukti', 'tanggal',
        'reference_type', 'reference_id', 'created_by',
    ];

    protected $casts = [
        'nominal'    => 'decimal:2',
        'is_anonim'  => 'boolean',
        'tanggal'    => 'date',
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriTransaksi::class, 'kategori_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Morph: bisa dari sedekah atau qurban
    public function reference()
    {
        return $this->morphTo('reference');
    }

    // Scope
    public function scopePemasukan($query)
    {
        return $query->where('jenis', 'pemasukan');
    }

    public function scopePengeluaran($query)
    {
        return $query->where('jenis', 'pengeluaran');
    }

    public function scopeTahunIni($query)
    {
        return $query->whereYear('tanggal', now()->year);
    }

    public function scopeBulanIni($query)
    {
        return $query->whereYear('tanggal', now()->year)
                     ->whereMonth('tanggal', now()->month);
    }

    // Helper: total kas saat ini
    public static function totalKas(): float
    {
        $masuk  = self::pemasukan()->sum('nominal');
        $keluar = self::pengeluaran()->sum('nominal');
        return $masuk - $keluar;
    }

    // Accessor: nama sumber yang ditampilkan
    public function getNamaTampilAttribute(): string
    {
        if ($this->is_anonim) {
            return 'Hamba Allah';
        }
        return $this->sumber_nama ?? '-';
    }

    public function getBuktUrlAttribute(): ?string
    {
        return $this->bukti ? asset('storage/' . $this->bukti) : null;
    }
}
