<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_pengajian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anggota_id')->constrained('anggota_pengajian')->onDelete('cascade');
            $table->enum('jenis', ['laki-laki', 'perempuan']);
            $table->date('tanggal');
            $table->string('hari')->comment('Nama hari (Senin, Selasa, ...)');
            $table->string('hari_pasaran')->nullable()->comment('Hari pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon)');
            $table->string('tempat')->default('Masjid')->comment('Masjid atau nama rumah anggota');
            $table->time('waktu')->default('19:30:00');
            $table->text('keterangan')->nullable();
            $table->boolean('is_selesai')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_pengajian');
    }
};
