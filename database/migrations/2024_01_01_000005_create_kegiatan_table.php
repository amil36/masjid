<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('tempat');
            $table->date('tanggal');
            $table->string('hari')->nullable();
            $table->time('waktu')->nullable();
            $table->text('deskripsi')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('auto_delete_at')->nullable()->comment('H+3 dari hari H');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
