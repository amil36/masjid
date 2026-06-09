<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('aksi')->comment('create, update, delete, login, logout');
            $table->string('modul')->comment('kas, pengajian, kegiatan, qurban, sedekah, user');
            $table->text('deskripsi')->nullable();
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('data_lama')->nullable();
            $table->json('data_baru')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'created_at']);
            $table->index(['modul', 'aksi']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};
