<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('masjid_profile', function (Blueprint $table) {
            $table->id();
            $table->string('nama_masjid');
            $table->text('alamat')->nullable();
            $table->string('kota')->nullable();
            $table->string('provinsi')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('logo')->nullable();
            $table->string('foto_masjid')->nullable();
            $table->string('tahun_berdiri')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        Schema::create('pengurus', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jabatan');
            $table->string('foto')->nullable();
            $table->string('telepon')->nullable();
            $table->integer('urutan')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('masjid_profile');
        Schema::dropIfExists('pengurus');
    }
};
