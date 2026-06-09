<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sedekah extends Model
{
    use HasFactory;

    protected $table = 'sedekah';

    protected $fillable = [
        'nama', 'is_anonim', 'nominal', 'bukti',
        'status', 'catatan_admin', 'verified_by', 'verified_at',
    ];

    protected $casts = [
        'nominal'     => 'decimal:2',
        'is_anonim'   => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function transaksiKas()
    {
        return $this->morphOne(TransaksiKas::class, 'reference');
    }

    // Scope
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function getNamaTampilAttribute(): string
    {
        return $this->is_anonim ? 'Hamba Allah' : ($this->nama ?? 'Hamba Allah');
    }

    public function getBuktiUrlAttribute(): ?string
    {
        return $this->bukti ? asset('storage/' . $this->bukti) : null;
    }
}
