<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori_transaksi', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('jenis', ['pemasukan', 'pengeluaran']);
            $table->string('warna')->default('#3B82F6')->comment('Warna hex untuk tampilan');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('transaksi_kas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->constrained('kategori_transaksi')->onDelete('restrict');
            $table->enum('jenis', ['pemasukan', 'pengeluaran']);
            $table->decimal('nominal', 15, 2);
            $table->string('keterangan')->nullable();
            $table->string('sumber_nama')->nullable()->comment('Nama donatur (bisa anonim)');
            $table->boolean('is_anonim')->default(false);
            $table->string('bukti')->nullable()->comment('Path file bukti transfer');
            $table->date('tanggal');
            $table->string('reference_type')->nullable()->comment('Morphable: sedekah, qurban, manual');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['jenis', 'tanggal']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_kas');
        Schema::dropIfExists('kategori_transaksi');
    }
};
