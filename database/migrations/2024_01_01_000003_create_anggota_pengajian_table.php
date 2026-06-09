<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anggota_pengajian', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('gender', ['laki-laki', 'perempuan']);
            $table->string('telepon')->nullable();
            $table->string('alamat')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('urutan')->default(0)->comment('Urutan giliran pengajian');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_pengajian');
    }
};
