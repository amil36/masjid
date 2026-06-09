<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class JadwalPengajian extends Model
{
    use HasFactory;

    protected $table = 'jadwal_pengajian';

    protected $fillable = [
        'anggota_id', 'jenis', 'tanggal', 'hari', 'hari_pasaran',
        'tempat', 'waktu', 'keterangan', 'is_selesai',
    ];

    protected $casts = [
        'tanggal'    => 'date',
        'is_selesai' => 'boolean',
    ];

    // Hari pasaran Jawa
    const HARI_PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

    public function anggota()
    {
        return $this->belongsTo(AnggotaPengajian::class, 'anggota_id');
    }

    // Scope minggu ini
    public function scopeMingguIni($query)
    {
        $start = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $end   = Carbon::now()->endOfWeek(Carbon::SUNDAY);
        return $query->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()]);
    }

    // Scope minggu depan
    public function scopeMingguDepan($query)
    {
        $start = Carbon::now()->addWeek()->startOfWeek(Carbon::MONDAY);
        $end   = Carbon::now()->addWeek()->endOfWeek(Carbon::SUNDAY);
        return $query->whereBetween('tanggal', [$start->toDateString(), $end->toDateString()]);
    }

    public function scopeLakiLaki($query)
    {
        return $query->where('jenis', 'laki-laki');
    }

    public function scopePerempuan($query)
    {
        return $query->where('jenis', 'perempuan');
    }

    // Helper: hitung hari pasaran Jawa dari tanggal
    public static function getHariPasaran(\DateTime|Carbon|string $tanggal): string
    {
        $date      = Carbon::parse($tanggal);
        $baseDate  = Carbon::create(2000, 1, 1); // Legi
        $diff      = $baseDate->diffInDays($date, false);
        $index     = (($diff % 5) + 5) % 5;
        return self::HARI_PASARAN[$index];
    }

    // Helper: generate nama hari Indonesia
    public static function getNamaHari(string $tanggal): string
    {
        $hariMap = [
            'Monday'    => 'Senin',
            'Tuesday'   => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday'  => 'Kamis',
            'Friday'    => 'Jumat',
            'Saturday'  => 'Sabtu',
            'Sunday'    => 'Minggu',
        ];
        return $hariMap[Carbon::parse($tanggal)->format('l')] ?? '';
    }
}
