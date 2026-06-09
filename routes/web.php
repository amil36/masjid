<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KasController;
use App\Http\Controllers\Admin\AnggotaController;
use App\Http\Controllers\Admin\PengajianController;
use App\Http\Controllers\Admin\KegiatanController;
use App\Http\Controllers\Admin\QurbanController;
use App\Http\Controllers\Admin\SedekahController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Public\LandingController;
use App\Http\Controllers\Public\SedekahPublicController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::post('/sedekah', [SedekahPublicController::class, 'store'])->name('sedekah.store');

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [AuthController::class, 'updatePassword'])->name('profile.password');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Kas
    Route::prefix('kas')->name('kas.')->group(function () {
        Route::get('/', [KasController::class, 'index'])->name('index');
        Route::post('/', [KasController::class, 'store'])->name('store');
        Route::put('/{transaksi}', [KasController::class, 'update'])->name('update');
        Route::delete('/{transaksi}', [KasController::class, 'destroy'])->name('destroy');
        Route::get('/kategori', [KasController::class, 'kategori'])->name('kategori');
    });

    // Anggota Pengajian
    Route::prefix('anggota')->name('anggota.')->group(function () {
        Route::get('/', [AnggotaController::class, 'index'])->name('index');
        Route::post('/', [AnggotaController::class, 'store'])->name('store');
        Route::put('/{anggota}', [AnggotaController::class, 'update'])->name('update');
        Route::delete('/{anggota}', [AnggotaController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [AnggotaController::class, 'reorder'])->name('reorder');
    });

    // Jadwal Pengajian
    Route::prefix('pengajian')->name('pengajian.')->group(function () {
        Route::get('/', [PengajianController::class, 'index'])->name('index');
        Route::post('/', [PengajianController::class, 'store'])->name('store');
        Route::put('/{jadwal}', [PengajianController::class, 'update'])->name('update');
        Route::delete('/{jadwal}', [PengajianController::class, 'destroy'])->name('destroy');
        Route::post('/generate', [PengajianController::class, 'generateJadwal'])->name('generate');
    });

    // Kegiatan
    Route::prefix('kegiatan')->name('kegiatan.')->group(function () {
        Route::get('/', [KegiatanController::class, 'index'])->name('index');
        Route::post('/', [KegiatanController::class, 'store'])->name('store');
        Route::put('/{kegiatan}', [KegiatanController::class, 'update'])->name('update');
        Route::delete('/{kegiatan}', [KegiatanController::class, 'destroy'])->name('destroy');
    });

    // Qurban
    Route::prefix('qurban')->name('qurban.')->group(function () {
        Route::get('/', [QurbanController::class, 'index'])->name('index');
        Route::post('/', [QurbanController::class, 'store'])->name('store');
        Route::put('/{qurban}', [QurbanController::class, 'update'])->name('update');
        Route::delete('/{qurban}', [QurbanController::class, 'destroy'])->name('destroy');
    });

    // Sedekah (verifikasi)
    Route::prefix('sedekah')->name('sedekah.')->group(function () {
        Route::get('/', [SedekahController::class, 'index'])->name('index');
        Route::post('/{sedekah}/verify', [SedekahController::class, 'verify'])->name('verify');
    });

    Route::get('/settings', [SettingsController::class, 'index'])->name('admin.settings');
    Route::put('/settings/mosque', [SettingsController::class, 'updateMosque'])->name('admin.settings.mosque');
});
