<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sedekah', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->nullable()->comment('Null jika anonim');
            $table->boolean('is_anonim')->default(false);
            $table->decimal('nominal', 15, 2);
            $table->string('bukti')->nullable()->comment('Path file bukti transfer');
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('qurban', function (Blueprint $table) {
            $table->id();
            $table->string('nama_peserta');
            $table->enum('jenis_hewan', ['kambing', 'sapi', 'kerbau']);
            $table->integer('jumlah_hewan')->default(1);
            $table->integer('tahun');
            $table->text('keterangan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('tahun');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sedekah');
        Schema::dropIfExists('qurban');
    }
};
