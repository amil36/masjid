import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const rp = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0);

const rpShort = (n) => {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
    return rp(n);
};

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, iconColor, badge, badgeColor, label, value, sub }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-emerald-100 flex flex-col justify-between hover:border-[#003527] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-lg ${iconBg}`}>
                    <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
                </div>
                {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badge}</span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-xs text-[#52625c] font-medium">{label}</p>
                <p className="text-2xl font-bold text-[#003527] mt-0.5">{value}</p>
                {sub && <p className="text-xs text-[#52625c] mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ── Kas Card (dark) ──────────────────────────────────────────────────────────
function KasCard({ total }) {
    return (
        <div className="bg-[#003527] p-5 rounded-xl text-white flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-center">
                <span className="text-xs text-[#95d3ba] font-medium">Total Mosque Kas</span>
                <span className="material-symbols-outlined text-[#95d3ba] text-xl">account_balance_wallet</span>
            </div>
            <div className="mt-3">
                <p className="text-2xl font-bold leading-tight">{rp(total ?? 154200000)}</p>
                <div className="mt-3 h-1.5 w-full bg-[#064e3b] rounded-full overflow-hidden">
                    <div className="h-full bg-[#95d3ba] rounded-full" style={{ width: "70%" }} />
                </div>
                <p className="mt-1.5 text-[10px] text-[#95d3ba]">70% Monthly Target Reached</p>
            </div>
        </div>
    );
}

// ── Jadwal Pengajian ─────────────────────────────────────────────────────────
function JadwalCard({ label, color, sessions, items, opacity = false }) {
    const HARI_SHORT = { Senin: "Mon", Selasa: "Tue", Rabu: "Wed", Kamis: "Thu", Jumat: "Fri", Sabtu: "Sat", Minggu: "Sun" };
    return (
        <div className={`bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-xl border-l-4`}
            style={{ borderLeftColor: color }}>
            <div className="flex justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: color + "20", color }}>
                    {label}
                </span>
                <span className="text-[#52625c] text-[10px]">{sessions} Sessions</span>
            </div>
            <div className={`space-y-4 ${opacity ? "opacity-75" : ""}`}>
                {items.length === 0 && (
                    <p className="text-xs text-[#52625c] italic">Tidak ada jadwal.</p>
                )}
                {items.slice(0, 3).map((j, i) => {
                    const tgl = j.tanggal ? new Date(j.tanggal) : null;
                    const hariShort = HARI_SHORT[j.hari] || j.hari?.slice(0, 3).toUpperCase() || "---";
                    return (
                        <div key={i} className="flex gap-3">
                            <div className="text-center bg-[#e2e8f8] px-2 py-1 rounded w-12 shrink-0">
                                <p className="text-[10px] font-bold uppercase text-[#52625c]">{hariShort}</p>
                                <p className="text-lg font-bold text-[#003527]">{tgl ? tgl.getDate() : "--"}</p>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#003527] truncate">
                                    {j.anggota?.nama || "Kajian Rutin"}
                                </p>
                                <p className="text-xs text-[#52625c]">
                                    {j.tempat} • {j.waktu?.slice(0, 5)} WIB
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Bar Chart (Kas Flow) ─────────────────────────────────────────────────────
function KasFlowChart({ data }) {
    const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const vals = data?.map(d => d.masuk + d.keluar) || [40, 65, 50, 90, 30, 75, 85];
    const max = Math.max(...vals, 1);
    const totalMasuk  = data?.reduce((a, d) => a + d.masuk, 0) ?? 8400000;
    const totalKeluar = data?.reduce((a, d) => a + d.keluar, 0) ?? 2100000;

    return (
        <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden flex flex-col shadow-sm">
            <div className="px-5 py-4 border-b border-emerald-50">
                <h3 className="text-[10px] font-bold text-[#003527] uppercase tracking-wider">Kas Flow (Last 7 Days)</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
                {/* Bars */}
                <div className="flex items-end justify-between gap-1.5 h-24 mb-2">
                    {(data?.slice(-7) || Array(7).fill(null)).map((d, i) => {
                        const h = d ? ((d.masuk + d.keluar) / max) * 100 : vals[i];
                        const isToday = i === 6;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className={`w-full rounded-t transition-all duration-500 ${isToday ? "bg-emerald-600" : "bg-emerald-400"}`}
                                    style={{ height: `${h}%`, minHeight: 4 }}
                                />
                            </div>
                        );
                    })}
                </div>
                {/* Day labels */}
                <div className="flex justify-between text-[10px] text-[#52625c] mb-4">
                    {DAYS.map(d => <span key={d}>{d}</span>)}
                </div>
                {/* Legend */}
                <div className="space-y-2 pt-3 border-t border-emerald-50">
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[#404944]">Income (Donations)</span>
                        </div>
                        <span className="font-bold text-[#003527]">+ {rpShort(totalMasuk)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#4a2400]" />
                            <span className="text-[#404944]">Expense (Utility)</span>
                        </div>
                        <span className="font-bold text-red-600">- {rpShort(totalKeluar)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Transaction Row ──────────────────────────────────────────────────────────
const CAT_COLOR = {
    "Sedekah / Donasi": "bg-emerald-100 text-emerald-800",
    "Kas Jumat":        "bg-emerald-100 text-emerald-800",
    "Infak":            "bg-emerald-100 text-emerald-800",
    "Listrik & Air":    "bg-orange-100 text-orange-800",
    "Operasional Masjid": "bg-orange-100 text-orange-800",
    "Perbaikan & Renovasi": "bg-blue-100 text-blue-800",
    "default":          "bg-slate-100 text-slate-700",
};

function TrxRow({ trx, idx }) {
    const catColor = CAT_COLOR[trx.kategori?.nama] ?? CAT_COLOR.default;
    const isMasuk  = trx.jenis === "pemasukan";
    const tgl      = new Date(trx.tanggal);
    return (
        <tr className={`hover:bg-emerald-50/50 transition-colors ${idx % 2 !== 0 ? "bg-[#f0f3ff]/40" : "bg-white"}`}>
            <td className="px-5 py-4 text-[10px] font-bold text-[#52625c]">
                TRX-{String(trx.id).padStart(4, "0")}
            </td>
            <td className="px-5 py-4 text-xs text-[#404944]">
                {tgl.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </td>
            <td className="px-5 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${catColor}`}>
                    {trx.kategori?.nama ?? "Lainnya"}
                </span>
            </td>
            <td className="px-5 py-4 text-sm text-[#151c27]">
                {trx.keterangan || (isMasuk ? trx.nama_tampil : "-")}
            </td>
            <td className={`px-5 py-4 font-bold text-sm ${isMasuk ? "text-[#003527]" : "text-red-600"}`}>
                {isMasuk ? "" : "- "}{rp(trx.nominal)}
            </td>
            <td className="px-5 py-4">
                <div className={`flex items-center gap-1 text-[10px] font-bold ${
                    trx.status === "verified" || !trx.status
                        ? "text-emerald-600"
                        : "text-orange-500"
                }`}>
                    <span className="material-symbols-outlined text-sm">
                        {trx.status === "pending" ? "schedule" : "check_circle"}
                    </span>
                    {trx.status === "pending" ? "Pending" : "Verified"}
                </div>
            </td>
        </tr>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({
    stats,
    jadwalMingguIni,
    jadwalMingguDepan,
    grafikData,
    transaksiTerbaru,
}) {
    const totalAnggota = (stats?.total_anggota_laki ?? 0) + (stats?.total_anggota_wanita ?? 0);

    // Demo data jika kosong
    const demoTrx = [
        { id: 9821, jenis: "pemasukan", tanggal: "2024-10-24", kategori: { nama: "Kas Jumat" }, keterangan: "Friday Prayer Collection", nominal: 4250000, nama_tampil: "Jamaah" },
        { id: 9818, jenis: "pengeluaran", tanggal: "2024-10-23", kategori: { nama: "Listrik & Air" }, keterangan: "Electricity Bill - Oct", nominal: 1120000 },
        { id: 9815, jenis: "pengeluaran", tanggal: "2024-10-22", kategori: { nama: "Perbaikan & Renovasi" }, keterangan: "Wudhu Area Maintenance", nominal: 2500000, status: "pending" },
        { id: 9812, jenis: "pemasukan", tanggal: "2024-10-21", kategori: { nama: "Infak" }, keterangan: "Building Expansion Fund", nominal: 15000000 },
    ];
    const trxList = transaksiTerbaru?.data?.length ? transaksiTerbaru.data : demoTrx;

    const demoMingguIni = {
        "laki-laki": [
            { tanggal: "2024-10-14", hari: "Senin", tempat: "Masjid Utama", waktu: "18:30", anggota: { nama: "Tafsir Al-Qur'an" } },
            { tanggal: "2024-10-16", hari: "Rabu",  tempat: "Ruang Kelas A", waktu: "16:00", anggota: { nama: "Fiqh Ibadah" } },
        ],
        "perempuan": [],
    };
    const demoMingguDepan = {
        "laki-laki": [
            { tanggal: "2024-10-21", hari: "Senin", tempat: "Masjid", waktu: "19:30", anggota: { nama: "Adab & Akhlaq" } },
        ],
        "perempuan": [
            { tanggal: "2024-10-25", hari: "Jumat", tempat: "Aula Utama", waktu: "09:00", anggota: { nama: "Kajian Muslimah" } },
        ],
    };

    const mingguIni   = jadwalMingguIni   ?? demoMingguIni;
    const mingguDepan = jadwalMingguDepan ?? demoMingguDepan;
    const allMingguIni   = [...(mingguIni["laki-laki"] || []), ...(mingguIni["perempuan"] || [])];
    const allMingguDepan = [...(mingguDepan["laki-laki"] || []), ...(mingguDepan["perempuan"] || [])];

    return (
        <AdminLayout title="Overview Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon="group"
                        iconBg="bg-[#d3e3dc]"
                        iconColor="text-[#003527]"
                        badge="+4% this month"
                        badgeColor="text-emerald-600 text-[10px]"
                        label="Total Members"
                        value={totalAnggota.toLocaleString("id-ID") || "1,279"}
                    />
                    <StatCard
                        icon="event"
                        iconBg="bg-[#ffdcc3]"
                        iconColor="text-[#6a3700]"
                        badge="SOON"
                        badgeColor="bg-[#6a3700] text-white px-2 py-0.5 rounded text-[10px]"
                        label="Upcoming Activities"
                        value={stats?.kegiatan_mendatang ?? 12}
                    />
                    <StatCard
                        icon="cruelty_free"
                        iconBg="bg-[#b0f0d6]"
                        iconColor="text-[#0b513d]"
                        badge="Idul Adha"
                        badgeColor="text-[#52625c] text-[10px]"
                        label="Registered Qurban"
                        value={stats?.qurban_tahun_ini ?? 85}
                        sub="Animals"
                    />
                    <KasCard total={stats?.total_kas} />
                </div>

                {/* ── Middle Row: Jadwal + Chart ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Jadwal Pengajian (col-span-2) */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#003527] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#52625c]">menu_book</span>
                                Jadwal Pengajian
                            </h3>
                            <Link href={route("admin.pengajian.index")} className="text-xs text-[#003527] font-medium hover:underline">
                                View Calendar
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <JadwalCard
                                label="THIS WEEK"
                                color="#16a34a"
                                sessions={allMingguIni.length}
                                items={allMingguIni}
                            />
                            <JadwalCard
                                label="NEXT WEEK"
                                color="#D97706"
                                sessions={allMingguDepan.length}
                                items={allMingguDepan}
                                opacity
                            />
                        </div>
                    </div>

                    {/* Kas Flow Chart */}
                    <KasFlowChart data={grafikData} />
                </div>

                {/* ── Recent Transactions ── */}
                <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/30">
                        <div>
                            <h3 className="text-lg font-bold text-[#003527]">Recent Treasury Transactions</h3>
                            <p className="text-xs text-[#52625c]">Live updates from the mosque treasury accounts</p>
                        </div>
                        <Link
                            href={route("admin.kas.index")}
                            className="flex items-center gap-1.5 bg-[#D97706] hover:bg-[#b45309] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            New Transaction
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#003527] text-white text-xs">
                                    <th className="px-5 py-3.5 font-semibold">Transaction ID</th>
                                    <th className="px-5 py-3.5 font-semibold">Date</th>
                                    <th className="px-5 py-3.5 font-semibold">Category</th>
                                    <th className="px-5 py-3.5 font-semibold">Description</th>
                                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                                    <th className="px-5 py-3.5 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {trxList.map((trx, i) => (
                                    <TrxRow key={`${trx.id}-${i}`} trx={trx} idx={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-white flex justify-end border-t border-emerald-50">
                        <button className="flex items-center gap-1 text-xs text-[#52625c] hover:text-[#003527] transition-colors font-medium">
                            Download Report
                            <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}