<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Qurban extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'qurban';

    protected $fillable = [
        'nama_peserta', 'jenis_hewan', 'jumlah_hewan', 'tahun', 'keterangan', 'created_by',
    ];

    protected $casts = [
        'jumlah_hewan' => 'integer',
        'tahun'        => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeTahunIni($query)
    {
        return $query->where('tahun', now()->year);
    }

    public function scopeTahun($query, int $tahun)
    {
        return $query->where('tahun', $tahun);
    }

    // Ringkasan per jenis hewan untuk tahun ini
    public static function ringkasanTahunIni(): array
    {
        return self::tahunIni()
            ->selectRaw('jenis_hewan, SUM(jumlah_hewan) as total')
            ->groupBy('jenis_hewan')
            ->pluck('total', 'jenis_hewan')
            ->toArray();
    }
}
