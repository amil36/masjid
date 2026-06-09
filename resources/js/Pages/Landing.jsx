import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { NextPrayerBadge, PrayerSchedule } from "@/Components/PrayerTimes";

/* ─── helpers ─────────────────────────────────────────────── */
const rp = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(n ?? 0);

const ICON = {
    calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
    ),
    heart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    clock: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
    ),
    people: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
    ),
    pin: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" />
        </svg>
    ),
    arrow: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    ),
    man: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a5 5 0 110 10A5 5 0 0112 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
        </svg>
    ),
    woman: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a5 5 0 110 10A5 5 0 0112 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
        </svg>
    ),
    upload: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    book: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
};

/* ─── Navbar ───────────────────────────────────────────────── */
function Navbar({ masjid, scrolled }) {
    const [open, setOpen] = useState(false);
    const links = [
        { href: "#beranda", label: "Home" },
        { href: "#sedekah", label: "Sedekah" },
        { href: "#pengajian", label: "Jadwal" },
        { href: "#kegiatan", label: "Kegiatan" },
        { href: "#qurban", label: "Qurban" },
    ];
    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 bg-white shadow-sm border-b border-gray-100 ${scrolled
                ? "bg-white shadow-sm border-b border-gray-100"
                : "bg-surface border-b border-white/10"
                }`}
        >
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {masjid?.logo_url && (
                        <img
                            src={masjid.logo_url}
                            alt="Logo Masjid"
                            className="w-9 h-9 object-contain rounded-full"
                        />
                    )}
                    <span className={`font-bold text-lg ${scrolled ? "text-[#003527]" : "text-[#003527]"}`}>
                        {masjid?.nama_masjid || "Al-Hikmah Mosque"}
                    </span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((l, i) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className={`text-sm font-medium transition-colors ${i === 0
                                ? "text-[#003527] font-bold border-b-2 border-[#003527] pb-0.5"
                                : "text-[#404944] hover:text-[#003527]"
                                }`}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
                <Link
                    href="/login"
                    className="hidden md:inline-flex bg-[#003527] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#0b513d] transition-colors"
                >
                    Login
                </Link>
                <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[#003527]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>
            {open && (
                <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-[#003527] font-medium">
                            {l.label}
                        </a>
                    ))}
                    <Link href="/login" className="block text-center bg-[#003527] text-white py-2 rounded-lg text-sm font-semibold">Login</Link>
                </div>
            )}
        </header>
    );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function Hero({ masjid }) {
    return (
        <section
            id="beranda"
            className="relative min-h-[820px] flex items-center overflow-hidden"
            style={
                masjid?.foto_masjid_url
                    ? {
                        backgroundImage: `url(${masjid.foto_masjid_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }
                    : {}
            }
        >
            {/* Fallback gradient when no foto */}
            {!masjid?.foto_masjid_url && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#001a12] via-[#003527] to-[#065f46]" />
            )}
            {/* gradient overlay — darker at left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#001a12]/90 via-[#003527]/65 to-[#003527]/20" />

            <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pt-24 pb-32">
                <div className="max-w-xl text-white">
                    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
                        {masjid?.nama_masjid || "Al-Hikmah Mosque"}
                    </h1>
                    <p className="text-white/80 text-base leading-relaxed mb-9 max-w-sm">
                        {masjid?.deskripsi ||
                            "A sanctuary of peace, knowledge, and community devotion. Join us in our journey to foster spiritual growth and social responsibility in the heart of our neighborhood."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#pengajian"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D97706] hover:bg-[#b45309] text-white font-semibold rounded-xl transition-all text-sm"
                        >
                            {ICON.calendar} Jadwal Pengajian
                        </a>
                        <a
                            href="#sedekah"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl backdrop-blur-sm transition-all text-sm"
                        >
                            Donasi Sekarang
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick info overlay bottom-right */}
            <div className="absolute bottom-0 right-0 p-8 hidden lg:block">
                <NextPrayerBadge lat={-6.8015} lng={110.9213} timezone={7} />
            </div>
        </section>
    );
}

/* ─── Pengurus ─────────────────────────────────────────────── */
function PengurusSection({ pengurus }) {
    return (
        <section className="py-20 bg-[#f9f9ff] relative overflow-hidden">
            {/* subtle dot pattern */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: "radial-gradient(#2b6954 0.5px, transparent 0.5px), radial-gradient(#2b6954 0.5px, #f9f9ff 0.5px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                }}
            />
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold text-[#003527] mb-3">Pengurus Masjid</h2>
                    <p className="text-[#404944] max-w-md mx-auto text-sm leading-relaxed">
                        Dedicated individuals committed to managing the mosque and serving the community with integrity and transparency.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(pengurus?.length
                        ? pengurus
                        : [
                            { id: 1, nama: "H. Ahmad Fauzi", jabatan: "Ketua DKM" },
                            { id: 2, nama: "Drs. M. Ridwan", jabatan: "Sekretaris" },
                            { id: 3, nama: "Ir. Bambang S.", jabatan: "Bendahara" },
                        ]
                    ).map((p) => (
                        <div
                            key={p.id}
                            className="bg-white p-8 rounded-2xl border border-emerald-100 text-center hover:border-[#2b6954] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-50"
                        >
                            <div className="w-24 h-24 bg-[#b0f0d6] rounded-full mx-auto mb-5 flex items-center justify-center overflow-hidden">
                                {p.foto_url ? (
                                    <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-[#003527]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="font-bold text-xl text-[#003527] mb-1">{p.nama}</h3>
                            <p className="text-[#52625c] text-sm font-medium mb-4">{p.jabatan}</p>
                            <p className="text-[#404944]/70 text-sm italic">
                                {p.jabatan === "Ketua DKM" || p.jabatan === "Ketua Takmir"
                                    ? '"Serving the Ummah with sincerity and excellence."'
                                    : p.jabatan === "Sekretaris"
                                        ? '"Ensuring transparency and effective communication."'
                                        : '"Managing trust through financial accountability."'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Pengajian ────────────────────────────────────────────── */
function PengajianSection({ jadwalMingguIni, jadwalMingguDepan }) {
    const [minggu, setMinggu] = useState("ini");
    const jadwal = minggu === "ini" ? jadwalMingguIni : jadwalMingguDepan;

    const GenderBlock = ({ gender }) => {
        const isLaki = gender === "laki-laki";
        const list = jadwal?.[gender] || [];
        return (
            <div className="space-y-5">
                <div
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl ${isLaki ? "bg-[#003527] text-white" : "bg-[#064e3b] text-[#80bea6]"
                        }`}
                >
                    <span>{isLaki ? ICON.man : ICON.woman}</span>
                    <h3 className="font-bold text-lg">{isLaki ? "Khusus Bapak-Bapak" : "Khusus Ibu-Ibu"}</h3>
                </div>
                <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
                    {list.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-sm">
                            Belum ada jadwal untuk minggu {minggu === "ini" ? "ini" : "depan"}.
                        </p>
                    ) : (
                        list.map((j, i) => (
                            <div
                                key={`${j.id}-${i}`}
                                className="px-6 py-5 border-b border-emerald-50 last:border-0 flex justify-between items-center hover:bg-emerald-50/50 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-[#003527] text-sm">{j.anggota?.nama}</p>
                                    <p className="text-[#52625c] text-xs mt-0.5">
                                        {j.hari}
                                        {j.hari_pasaran ? ` (${j.hari_pasaran})` : ""} • {j.waktu?.slice(0, 5)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#003527] text-sm">{j.tempat}</p>
                                    <p className="text-[#D97706] text-xs font-semibold mt-0.5">Weekly</p>
                                </div>
                            </div>
                        ))
                    )}
                    {/* Fallback demo rows if no data */}
                    {list.length === 0 && (
                        <>
                            {[
                                isLaki
                                    ? { title: "Kajian Kitab Fathul Qorib", sub: "Malam Jumat (Bada Isya)", place: "Masjid Utama" }
                                    : { title: "Fiqh Wanita & Parenting", sub: "Jumat Pagi (09:00 - 11:00)", place: "Aula Utama" },
                                isLaki
                                    ? { title: "Talaqqi Al-Quran", sub: "Senin & Rabu (19:30)", place: "Ruang Kelas A" }
                                    : { title: "Tahsin & Hafalan", sub: "Selasa (16:00)", place: isLaki ? "" : "Ruang Sholat Wanita" },
                            ].map((r, i) => (
                                <div key={`demo-${i}`} className="px-6 py-5 border-b border-emerald-50 last:border-0 flex justify-between items-center hover:bg-emerald-50/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-[#003527] text-sm">{r.title}</p>
                                        <p className="text-[#52625c] text-xs mt-0.5">{r.sub}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#003527] text-sm">{r.place}</p>
                                        <p className="text-[#D97706] text-xs font-semibold mt-0.5">Weekly</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section id="pengajian" className="py-20 bg-[#f0f3ff]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-[#003527] mb-2">Jadwal Pengajian</h2>
                        <p className="text-[#52625c] text-sm">Ongoing religious studies for all community members.</p>
                    </div>
                    <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                        {["ini", "depan"].map((v) => (
                            <button
                                key={v}
                                onClick={() => setMinggu(v)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${minggu === v ? "bg-[#003527] text-white" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Minggu {v === "ini" ? "Ini" : "Depan"}
                            </button>
                        ))}
                    </div>
                    <span className="hidden lg:block text-[#95d3ba]">{ICON.book}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GenderBlock gender="laki-laki" />
                    <GenderBlock gender="perempuan" />
                </div>
            </div>
        </section>
    );
}

/* ─── Kas ──────────────────────────────────────────────────── */
function KasSection({ pengeluaran, grafikPengeluaran, totalKas }) {
    const totalMasuk = pengeluaran ? 0 : 45200000;
    const totalKeluar = pengeluaran ? 0 : 28150000;
    const saldo = totalKas ?? totalMasuk - totalKeluar;
    const maxVal = Math.max(...(grafikPengeluaran?.map((d) => d.keluar) || [1, 1]), 1);

    // Donut chart degrees
    const pct = totalMasuk > 0 ? (totalKeluar / totalMasuk) * 100 : 62;
    const deg = (pct / 100) * 360;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-10 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <span className="inline-block px-4 py-1 bg-[#b0f0d6] text-[#002117] rounded-full text-xs font-bold mb-5">
                                Financial Transparency
                            </span>
                            <h2 className="text-3xl font-bold text-[#003527] mb-4">Laporan Transparansi Kas</h2>
                            <p className="text-[#404944] text-sm leading-relaxed mb-8">
                                Kami berkomitmen untuk menjaga amanah donatur melalui pelaporan keuangan yang terbuka dan dapat diakses oleh seluruh jamaah.
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-5 py-4 bg-[#f0f3ff] rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-[#003527]" />
                                        <span className="text-sm font-medium text-[#151c27]">Pemasukan (Income)</span>
                                    </div>
                                    <span className="font-bold text-[#003527]">{rp(totalMasuk)}</span>
                                </div>
                                <div className="flex justify-between items-center px-5 py-4 bg-[#f0f3ff] rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-[#D97706]" />
                                        <span className="text-sm font-medium text-[#151c27]">Pengeluaran (Expenses)</span>
                                    </div>
                                    <span className="font-bold text-[#4a2400]">{rp(totalKeluar)}</span>
                                </div>
                                <div className="flex justify-between items-center px-5 py-4 bg-[#003527] text-white rounded-xl">
                                    <span className="text-sm font-medium">Saldo Akhir</span>
                                    <span className="font-bold">{rp(saldo)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Right – donut chart */}
                        <div className="flex justify-center items-center">
                            <div className="relative w-56 h-56">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f8" strokeWidth="16" />
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        stroke="#003527" strokeWidth="16"
                                        strokeDasharray={`${(100 - pct) * 2.51} ${pct * 2.51}`}
                                        strokeLinecap="butt"
                                    />
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        stroke="#D97706" strokeWidth="16"
                                        strokeDasharray={`${pct * 2.51} ${(100 - pct) * 2.51}`}
                                        strokeDashoffset={`${-(100 - pct) * 2.51}`}
                                        strokeLinecap="butt"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-xs text-gray-400 font-medium">Status</p>
                                    <p className="text-xl font-bold text-[#003527]">Surplus</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pengeluaran terbaru */}
                    {pengeluaran?.length > 0 && (
                        <div className="mt-10 border-t border-emerald-50 pt-8">
                            <h3 className="font-bold text-[#003527] mb-4 text-sm">Pengeluaran Terbaru</h3>
                            <div className="space-y-2">
                                {pengeluaran.slice(0, 5).map((t, i) => (
                                    <div key={`${t.id}-${i}`} className="flex justify-between items-center py-2 text-sm border-b border-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-700">{t.keterangan || t.kategori}</p>
                                            <p className="text-slate-400 text-xs">
                                                {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                        <span className="text-red-500 font-semibold">- {rp(t.nominal)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─── Kegiatan ─────────────────────────────────────────────── */
function KegiatanSection({ kegiatan }) {
    const demoKegiatan = [
        { id: 1, judul: "Bakti Sosial Ramadhan", tempat: "Halaman Masjid", tanggal: "2025-03-25", deskripsi: "Pembagian paket sembako untuk 200 keluarga di lingkungan sekitar masjid Al-Hikmah." },
        { id: 2, judul: "Pelatihan IT untuk Remaja", tempat: "Ruang Multimedia", tanggal: "2025-04-02", deskripsi: "Memberikan bekal keterampilan digital bagi generasi muda untuk masa depan yang lebih baik." },
        { id: 3, judul: "Nuzulul Quran Night", tempat: "Ruang Sholat Utama", tanggal: "2025-04-15", deskripsi: "Peringatan malam Nuzulul Quran bersama KH. Ahmad Dahlan dan khataman bersama." },
    ];
    const items = kegiatan?.length ? kegiatan : demoKegiatan;

    return (
        <section id="kegiatan" className="py-20 bg-[#f0f3ff]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-baseline mb-12">
                    <h2 className="text-3xl font-bold text-[#003527]">Kegiatan Mendatang</h2>
                    <a href="#" className="text-[#003527] text-sm font-medium hover:underline flex items-center gap-1">
                        Lihat Semua Kegiatan {ICON.arrow}
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((k, i) => {
                        const tgl = new Date(k.tanggal);
                        const bulan = tgl.toLocaleString("id-ID", { month: "short" }).toUpperCase();
                        const hari = tgl.getDate();
                        return (
                            <div
                                key={`${k.id}-${i}`}
                                className="group bg-white rounded-2xl overflow-hidden border border-emerald-100 hover:border-[#2b6954] transition-all duration-300 hover:shadow-xl hover:shadow-emerald-50"
                            >
                                {/* Image placeholder */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#003527] to-[#065f46]">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[#003527] font-bold text-xs">
                                        {hari} {bulan}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-[#003527] text-base mb-2 group-hover:text-[#2b6954] transition-colors">{k.judul}</h3>
                                    <div className="flex items-center gap-1.5 text-[#52625c] text-xs mb-3">
                                        {ICON.pin} {k.tempat}
                                    </div>
                                    {k.deskripsi && (
                                        <p className="text-[#404944]/70 text-sm leading-relaxed line-clamp-2">{k.deskripsi}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ─── Qurban ───────────────────────────────────────────────── */
function QurbanSection({ qurban }) {
    const demoQurban = [
        { id: 1, nama_peserta: "Keluarga H. Abdullah", jenis_hewan: "sapi", jumlah_hewan: 1, tipe: "Tipe A (Besar)" },
        { id: 2, nama_peserta: "Bpk. Supriadi & Kel.", jenis_hewan: "sapi", jumlah_hewan: 1, tipe: "Tipe B (Sedang)" },
        { id: 3, nama_peserta: "Ibu Siti Aminah", jenis_hewan: "kambing", jumlah_hewan: 1, tipe: "Tipe Reguler" },
        { id: 4, nama_peserta: "Remaja Masjid Al-Hikmah", jenis_hewan: "kambing", jumlah_hewan: 1, tipe: "Tipe Reguler" },
    ];
    const items = qurban?.length ? qurban : demoQurban;

    return (
        <section id="qurban" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#003527] mb-3">
                        Pendaftaran Qurban {new Date().getFullYear()}H
                    </h2>
                    <p className="text-[#52625c] text-sm">Data pendaftaran hewan qurban tahun ini secara real-time.</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-emerald-100">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-[#003527] text-white">
                                <th className="px-5 py-4 font-semibold text-xs">No</th>
                                <th className="px-5 py-4 font-semibold text-xs">Nama Mudhohi</th>
                                <th className="px-5 py-4 font-semibold text-xs">Jenis Hewan</th>
                                <th className="px-5 py-4 font-semibold text-xs hidden sm:table-cell">Tipe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {items.map((q, i) => (
                                <tr key={`${q.id}-${i}`} className={`${i % 2 === 0 ? "bg-white" : "bg-emerald-50/30"} hover:bg-[#f0f3ff] transition-colors`}>
                                    <td className="px-5 py-4 text-[#52625c]">{String(i + 1).padStart(2, "0")}</td>
                                    <td className="px-5 py-4 font-bold text-[#003527]">{q.nama_peserta}</td>
                                    <td className="px-5 py-4 capitalize text-[#404944]">{q.jenis_hewan}</td>
                                    <td className="px-5 py-4 text-[#404944] hidden sm:table-cell">
                                        {q.tipe || `${q.jumlah_hewan} ekor`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

/* ─── Sedekah ──────────────────────────────────────────── */
function SedekahSection() {
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef(null);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        nama: "",
        is_anonim: false,
        nominal: "",
        bukti: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sedekah.store"), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleShowForm = () => {
        setShowForm(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    };

    const nominals = [10000, 20000, 50000, 100000, 200000, 500000];

    return (
        <section id="sedekah" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#001a12] via-[#003527] to-[#065f46]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "28px 28px" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-8">
                {/* CTA */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">Investasi Akhirat Anda</h2>
                    <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Setiap rupiah yang Anda infakkan akan menjadi aliran pahala jariyah untuk pembangunan fasilitas pendidikan dan kenyamanan ibadah di masjid kita.
                    </p>
                    {!showForm && (
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <button
                                onClick={handleShowForm}
                                className="px-10 py-4 bg-white text-[#003527] font-bold rounded-xl hover:bg-[#b0f0d6] transition-all text-sm"
                            >
                                Sedekah Sekarang
                            </button>
                            <button className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm">
                                Hubungi Admin
                            </button>
                        </div>
                    )}
                </div>

                {/* Form — muncul setelah klik */}
                {showForm && (
                    <div ref={formRef} className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl p-8">
                            {wasSuccessful ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-[#003527] text-xl mb-2">Jazakallah Khairan!</h3>
                                    <p className="text-[#52625c] text-sm">Sedekah Anda sedang menunggu verifikasi admin.</p>
                                    <button onClick={() => { setShowForm(false); reset(); }} className="mt-6 px-6 py-2 bg-[#003527] text-white rounded-xl text-sm font-semibold hover:bg-[#0b513d] transition-colors">
                                        Tutup
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-extrabold text-[#003527] text-xl">Form Sedekah</h3>
                                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Anonim toggle */}
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setData("is_anonim", !data.is_anonim)}>
                                        <div className={`relative w-10 h-6 rounded-full transition-colors ${data.is_anonim ? "bg-[#003527]" : "bg-gray-200"}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_anonim ? "left-5" : "left-1"}`} />
                                        </div>
                                        <span className="text-sm text-[#404944] font-medium select-none">Sedekah sebagai Hamba Allah (Anonim)</span>
                                    </div>

                                    {/* Nama */}
                                    {!data.is_anonim && (
                                        <div>
                                            <label className="block text-sm font-semibold text-[#151c27] mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.nama}
                                                onChange={(e) => setData("nama", e.target.value)}
                                                placeholder="Masukkan nama Anda"
                                                className="w-full border border-[#bfc9c3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b6954] focus:border-transparent transition"
                                            />
                                            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                                        </div>
                                    )}

                                    {/* Nominal */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#151c27] mb-2">Nominal Sedekah</label>
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {nominals.map((n) => (
                                                <button key={n} type="button" onClick={() => setData("nominal", String(n))}
                                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${data.nominal === String(n) ? "bg-[#003527] text-white border-[#003527]" : "bg-white text-[#404944] border-[#bfc9c3] hover:border-[#2b6954]"}`}>
                                                    {rp(n)}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="number"
                                            value={data.nominal}
                                            onChange={(e) => setData("nominal", e.target.value)}
                                            placeholder="Atau masukkan nominal lain…"
                                            min="1000"
                                            className="w-full border border-[#bfc9c3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b6954] focus:border-transparent transition"
                                        />
                                        {errors.nominal && <p className="text-red-500 text-xs mt-1">{errors.nominal}</p>}
                                    </div>

                                    {/* Upload bukti */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[#151c27] mb-2">Bukti Transfer</label>
                                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#bfc9c3] rounded-xl p-6 cursor-pointer hover:border-[#2b6954] transition-colors bg-[#f9f9ff]">
                                            {data.bukti ? (
                                                <span className="text-[#003527] font-semibold text-sm">✓ {data.bukti.name}</span>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 text-[#707974]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-[#52625c] text-xs text-center">
                                                        Klik untuk upload bukti transfer<br />
                                                        <span className="text-[#707974]">JPG, PNG, JPEG • Maks 2MB</span>
                                                    </span>
                                                </>
                                            )}
                                            <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setData("bukti", e.target.files[0])} className="hidden" />
                                        </label>
                                        {errors.bukti && <p className="text-red-500 text-xs mt-1">{errors.bukti}</p>}
                                    </div>

                                    <button type="submit" disabled={processing}
                                        className="w-full py-3.5 bg-[#003527] hover:bg-[#0b513d] disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm">
                                        {processing ? "Mengirim…" : "Kirim Sedekah 🤲"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─── Footer ───────────────────────────────────────────────── */
function Footer({ masjid }) {
    return (
        <footer className="bg-[#dce2f3] border-t border-[#bfc9c3]">
            <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="max-w-xs">
                    <h3 className="font-bold text-lg text-[#003527] mb-3">{masjid?.nama_masjid || "Al-Hikmah Mosque"}</h3>
                    <p className="text-[#404944] text-sm leading-relaxed">
                        {masjid?.deskripsi || "Membangun peradaban Islam yang ramah, moderat, dan berdaya guna bagi lingkungan sekitar."}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-12 text-sm">
                    <div>
                        <h4 className="font-semibold text-[#151c27] mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-[#404944]">
                            <li>{masjid?.alamat || "Address: Jl. Raya No. 123"}</li>
                            <li><a href="#" className="hover:text-[#003527] transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-[#003527] transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#151c27] mb-3">Follow Us</h4>
                        <ul className="space-y-2 text-[#404944]">
                            {["Facebook", "Instagram", "YouTube"].map((s) => (
                                <li key={s}><a href="#" className="hover:text-[#003527] transition-colors">{s}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 py-5 border-t border-[#bfc9c3] flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-[#52625c] text-xs">
                    © {new Date().getFullYear()} {masjid?.nama_masjid || "Al-Hikmah Mosque"} Management. All rights reserved.
                </p>
                <div className="flex gap-4 text-[#52625c]">
                    {["verified", "diversity_1", "volunteer_activism"].map((ic) => (
                        <span key={ic} className="material-symbols-outlined text-lg hover:text-[#003527] cursor-pointer transition-colors">{ic}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function Landing({
    profil, pengurus, jadwalMingguIni, jadwalMingguDepan,
    kegiatan, pengeluaran, grafikPengeluaran, qurban, totalKas,
}) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <Head title={`${profil?.nama_masjid || "Al-Hikmah Mosque"} | Community & Devotion`} />
            <div className="min-h-screen antialiased text-[#151c27]">
                <Navbar masjid={profil} scrolled={scrolled} />
                <Hero masjid={profil} />
                <PengurusSection pengurus={pengurus} />
                <PengajianSection jadwalMingguIni={jadwalMingguIni} jadwalMingguDepan={jadwalMingguDepan} />
                <KasSection pengeluaran={pengeluaran} grafikPengeluaran={grafikPengeluaran} totalKas={totalKas} />
                <KegiatanSection kegiatan={kegiatan} />
                <QurbanSection qurban={qurban} />
                <SedekahSection />
                <Footer masjid={profil} />
            </div>
        </>
    );
}