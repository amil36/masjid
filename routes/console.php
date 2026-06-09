<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Hapus kegiatan kadaluarsa setiap hari tengah malam
Schedule::command('kegiatan:hapus-kadaluarsa')->dailyAt('00:05');
