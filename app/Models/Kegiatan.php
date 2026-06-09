<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Kegiatan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kegiatan';

    protected $fillable = [
        'judul', 'tempat', 'tanggal', 'hari', 'waktu',
        'deskripsi', 'auto_delete_at', 'created_by',
    ];

    protected $casts = [
        'tanggal'        => 'date',
        'auto_delete_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope: kegiatan yang belum terlaksana
    public function scopeBelumTerlaksana($query)
    {
        return $query->where('tanggal', '>=', now()->toDateString())
                     ->whereNull('deleted_at');
    }

    // Scope: kegiatan mendatang
    public function scopeMendatang($query)
    {
        return $query->where('tanggal', '>=', now()->toDateString())
                     ->orderBy('tanggal', 'asc');
    }

    // Boot: set auto_delete_at saat create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kegiatan) {
            if ($kegiatan->tanggal) {
                $kegiatan->auto_delete_at = Carbon::parse($kegiatan->tanggal)->addDays(3)->endOfDay();
                $kegiatan->hari           = JadwalPengajian::getNamaHari($kegiatan->tanggal);
            }
        });

        static::updating(function ($kegiatan) {
            if ($kegiatan->isDirty('tanggal')) {
                $kegiatan->auto_delete_at = Carbon::parse($kegiatan->tanggal)->addDays(3)->endOfDay();
                $kegiatan->hari           = JadwalPengajian::getNamaHari($kegiatan->tanggal);
            }
        });
    }
}
