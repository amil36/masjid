<?php

namespace App\Console\Commands;

use App\Models\Kegiatan;
use App\Models\LogAktivitas;
use Illuminate\Console\Command;

class HapusKegiatanKadaluarsa extends Command
{
    protected $signature   = 'kegiatan:hapus-kadaluarsa';
    protected $description = 'Hapus otomatis kegiatan yang sudah melewati H+3';

    public function handle(): void
    {
        $kegiatan = Kegiatan::whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now())
            ->whereNull('deleted_at')
            ->get();

        $total = $kegiatan->count();

        foreach ($kegiatan as $k) {
            LogAktivitas::create([
                'user_id'    => null,
                'aksi'       => 'delete',
                'modul'      => 'kegiatan',
                'deskripsi'  => "Auto-hapus kegiatan: {$k->judul} (H+3 dari {$k->tanggal->format('d/m/Y')})",
                'model_type' => Kegiatan::class,
                'model_id'   => $k->id,
                'data_lama'  => $k->toArray(),
            ]);

            $k->delete();
        }

        $this->info("Berhasil menghapus {$total} kegiatan kadaluarsa.");
    }
}
