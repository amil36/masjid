import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ─────────────────────────────────────────────────── */
const rp = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(n ?? 0);

const fmtTgl = (str) => {
    if (!str) return "-";
    return new Date(str).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

/* ── Verify Modal ────────────────────────────────────────────── */
function VerifyModal({ show, onClose, sedekah }) {
    const [status, setStatus]   = useState("verified");
    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);

    if (!show || !sedekah) return null;

    const handleSubmit = () => {
        setLoading(true);
        router.post(`/admin/sedekah/${sedekah.id}/verify`, {
            status,
            catatan_admin: catatan,
        }, {
            onFinish: () => { setLoading(false); onClose(); setCatatan(""); },
        });
    };

    return (
        <div className="fixed inset-0 bg-[#003527]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-[#003527] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Verifikasi Sedekah</h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    {/* Info donatur */}
                    <div className="bg-[#f0f3ff] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#52625c]">Nama</span>
                            <span className="font-semibold text-[#003527]">
                                {sedekah.is_anonim ? "Hamba Allah" : (sedekah.nama ?? "—")}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#52625c]">Nominal</span>
                            <span className="font-bold text-emerald-700">{rp(sedekah.nominal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#52625c]">Tanggal</span>
                            <span className="text-[#404944]">{fmtTgl(sedekah.created_at)}</span>
                        </div>
                    </div>

                    {/* Bukti transfer */}
                    {sedekah.bukti_url && (
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-[#404944]">Bukti Transfer</p>
                            <a href={sedekah.bukti_url} target="_blank" rel="noopener noreferrer"
                                className="block rounded-xl overflow-hidden border border-emerald-100 hover:border-[#003527] transition-colors">
                                <img src={sedekah.bukti_url} alt="Bukti transfer" className="w-full max-h-48 object-contain bg-gray-50" />
                            </a>
                            <p className="text-xs text-[#52625c] text-center">Klik gambar untuk memperbesar</p>
                        </div>
                    )}

                    {/* Keputusan */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-[#404944]">Keputusan</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { val: "verified", label: "Verifikasi",    icon: "check_circle", color: "border-emerald-500 bg-emerald-50 text-emerald-700" },
                                { val: "rejected", label: "Tolak",         icon: "cancel",       color: "border-red-400 bg-red-50 text-red-700" },
                            ].map(s => (
                                <label key={s.val}
                                    className={`cursor-pointer border-2 rounded-xl p-3 flex items-center gap-2 transition-all ${
                                        status === s.val ? s.color : "border-[#bfc9c3] text-[#52625c] hover:border-gray-400"
                                    }`}>
                                    <input type="radio" className="hidden" value={s.val}
                                        checked={status === s.val} onChange={() => setStatus(s.val)} />
                                    <span className="material-symbols-outlined text-base">{s.icon}</span>
                                    <span className="text-sm font-semibold">{s.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Catatan admin */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Catatan Admin <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <textarea value={catatan} onChange={e => setCatatan(e.target.value)}
                            placeholder="Contoh: Nominal tidak sesuai, bukti blur, dll..."
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm resize-none transition-all" />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-emerald-200 text-[#52625c] text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Batal
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className={`flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-colors ${
                                status === "verified" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                            }`}>
                            {loading ? "Memproses..." : status === "verified" ? "Verifikasi & Masukkan Kas" : "Tolak Sedekah"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Status Badge ────────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        pending:  { label: "Pending",    cls: "bg-[#fef3c7] text-[#92400e]",   icon: "schedule"      },
        verified: { label: "Verified",   cls: "bg-emerald-100 text-emerald-800", icon: "check_circle"  },
        rejected: { label: "Rejected",   cls: "bg-red-100 text-red-700",         icon: "cancel"        },
    };
    const s = map[status] ?? map.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.cls}`}>
            <span className="material-symbols-outlined text-[13px]">{s.icon}</span>
            {s.label}
        </span>
    );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function Sedekah({ sedekah, stats }) {
    const [verifyTarget, setVerifyTarget] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [search, setSearch]             = useState("");
    const [page, setPage]                 = useState(1);
    const PER_PAGE = 10;

    const allSedekah = sedekah?.data ?? sedekah ?? [];

    // Filter
    const filtered = allSedekah.filter(s => {
        const matchStatus = filterStatus === "all" || s.status === filterStatus;
        const nama        = s.is_anonim ? "Hamba Allah" : (s.nama ?? "");
        const matchSearch = nama.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (v) => { setSearch(v); setPage(1); };
    const handleFilter = (v) => { setFilterStatus(v); setPage(1); };

    // Computed stats
    const totalPending  = allSedekah.filter(s => s.status === "pending").length;
    const totalVerified = allSedekah.filter(s => s.status === "verified").reduce((a, s) => a + parseFloat(s.nominal), 0);
    const totalRejected = allSedekah.filter(s => s.status === "rejected").length;
    const totalNominal  = allSedekah.reduce((a, s) => a + parseFloat(s.nominal), 0);

    return (
        <AdminLayout title="Manajemen Sedekah">
            <Head title="Sedekah" />

            <VerifyModal
                show={!!verifyTarget}
                onClose={() => setVerifyTarget(null)}
                sedekah={verifyTarget}
            />

            <div className="space-y-6">

                {/* ── Header ── */}
                <div>
                    <h2 className="text-2xl font-bold text-[#003527]">Manajemen Sedekah</h2>
                    <p className="text-sm text-[#52625c]">Verifikasi dan kelola donasi dari jamaah.</p>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            icon: "schedule",
                            bg: "bg-[#fef3c7]", color: "text-[#92400e]",
                            label: "Menunggu Verifikasi",
                            value: totalPending,
                            sub: "Perlu ditinjau",
                            alert: totalPending > 0,
                        },
                        {
                            icon: "check_circle",
                            bg: "bg-emerald-100", color: "text-emerald-700",
                            label: "Total Terverifikasi",
                            value: rp(totalVerified),
                            sub: `${allSedekah.filter(s => s.status === "verified").length} transaksi`,
                        },
                        {
                            icon: "cancel",
                            bg: "bg-red-100", color: "text-red-600",
                            label: "Ditolak",
                            value: totalRejected,
                            sub: "Transaksi ditolak",
                        },
                        {
                            icon: "volunteer_activism",
                            bg: "bg-[#003527]", color: "text-white",
                            label: "Total Masuk",
                            value: rp(totalNominal),
                            sub: `${allSedekah.length} donatur`,
                            dark: true,
                        },
                    ].map((s) => (
                        <div key={s.label}
                            className={`border rounded-xl p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-all shadow-sm ${
                                s.dark ? "bg-[#003527] border-[#003527]" : "bg-white border-emerald-100"
                            }`}>
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative ${s.bg}`}>
                                <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                                {s.alert && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${s.dark ? "text-emerald-300" : "text-[#52625c]"}`}>
                                    {s.label}
                                </p>
                                <p className={`text-lg font-extrabold leading-tight truncate ${s.dark ? "text-white" : "text-[#003527]"}`}>
                                    {s.value}
                                </p>
                                <p className={`text-[11px] mt-0.5 ${s.dark ? "text-emerald-400" : "text-[#707974]"}`}>{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Table ── */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-base font-bold text-[#003527]">Daftar Donatur</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Filter status */}
                            <div className="flex bg-[#f0f3ff] rounded-xl p-1 gap-0.5">
                                {[
                                    { val: "all",      label: "Semua"    },
                                    { val: "pending",  label: "Pending"  },
                                    { val: "verified", label: "Verified" },
                                    { val: "rejected", label: "Rejected" },
                                ].map(f => (
                                    <button key={f.val} onClick={() => handleFilter(f.val)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            filterStatus === f.val
                                                ? "bg-[#003527] text-white shadow-sm"
                                                : "text-[#52625c] hover:text-[#003527]"
                                        }`}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            {/* Search */}
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-base">search</span>
                                <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
                                    placeholder="Cari nama..."
                                    className="pl-9 pr-4 py-2 bg-[#f0f3ff] border border-[#bfc9c3] rounded-xl text-sm focus:ring-1 focus:ring-[#003527] focus:border-[#003527] outline-none w-44 transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#003527] text-white text-xs uppercase tracking-wider">
                                    <th className="px-5 py-4 font-semibold">Donatur</th>
                                    <th className="px-5 py-4 font-semibold text-right">Nominal</th>
                                    <th className="px-5 py-4 font-semibold">Tanggal</th>
                                    <th className="px-5 py-4 font-semibold text-center">Bukti</th>
                                    <th className="px-5 py-4 font-semibold text-center">Status</th>
                                    <th className="px-5 py-4 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-[#52625c]">
                                            <span className="material-symbols-outlined text-5xl text-emerald-200 block mb-2">volunteer_activism</span>
                                            <p className="text-sm">Tidak ada data sedekah.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((s, i) => {
                                        const nama = s.is_anonim ? "Hamba Allah" : (s.nama ?? "—");
                                        const isPending = s.status === "pending";
                                        return (
                                            <tr key={`${s.id}-${i}`}
                                                className={`hover:bg-emerald-50/40 transition-colors ${i % 2 !== 0 ? "bg-[#f0f3ff]/20" : "bg-white"}`}>
                                                {/* Donatur */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                                            s.is_anonim ? "bg-[#e2e8f8] text-[#52625c]" : "bg-[#b0f0d6] text-[#003527]"
                                                        }`}>
                                                            {s.is_anonim ? "?" : nama.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[#151c27] text-sm">{nama}</p>
                                                            {s.is_anonim && (
                                                                <p className="text-[10px] text-[#707974]">Anonim</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Nominal */}
                                                <td className="px-5 py-4 text-right">
                                                    <span className="font-bold text-emerald-700 text-sm">{rp(s.nominal)}</span>
                                                </td>
                                                {/* Tanggal */}
                                                <td className="px-5 py-4 text-sm text-[#52625c]">
                                                    {fmtTgl(s.created_at)}
                                                </td>
                                                {/* Bukti */}
                                                <td className="px-5 py-4 text-center">
                                                    {s.bukti_url ? (
                                                        <a href={s.bukti_url} target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#f0f3ff] hover:bg-[#dce2f3] text-[#003527] rounded-lg text-xs font-medium transition-colors">
                                                            <span className="material-symbols-outlined text-[14px]">image</span>
                                                            Lihat
                                                        </a>
                                                    ) : (
                                                        <span className="text-[#bfc9c3] text-xs">—</span>
                                                    )}
                                                </td>
                                                {/* Status */}
                                                <td className="px-5 py-4 text-center">
                                                    <StatusBadge status={s.status} />
                                                    {s.catatan_admin && (
                                                        <p className="text-[10px] text-[#707974] mt-1 max-w-[120px] mx-auto truncate" title={s.catatan_admin}>
                                                            {s.catatan_admin}
                                                        </p>
                                                    )}
                                                </td>
                                                {/* Aksi */}
                                                <td className="px-5 py-4 text-center">
                                                    {isPending ? (
                                                        <button onClick={() => setVerifyTarget(s)}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003527] hover:bg-[#0b513d] text-white rounded-xl text-xs font-semibold transition-all active:scale-95">
                                                            <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                                                            Verifikasi
                                                        </button>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                            s.status === "verified" ? "text-emerald-600" : "text-red-500"
                                                        }`}>
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                {s.status === "verified" ? "check_circle" : "cancel"}
                                                            </span>
                                                            {s.status === "verified" ? "Sudah Diverifikasi" : "Ditolak"}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <div className="px-6 py-4 bg-[#f9f9ff] border-t border-emerald-100 flex justify-between items-center">
                        <p className="text-xs text-[#52625c]">
                            Showing {paginated.length} of {filtered.length} donatur
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-4 py-2 bg-white border border-[#bfc9c3] rounded-xl text-sm hover:bg-emerald-50 disabled:opacity-40 transition-colors">
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                Math.max(0, page - 2), Math.min(totalPages, page + 1)
                            ).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                                        p === page
                                            ? "bg-[#003527] text-white"
                                            : "bg-white border border-[#bfc9c3] text-[#404944] hover:bg-emerald-50"
                                    }`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                                className="px-4 py-2 bg-white border border-[#bfc9c3] rounded-xl text-sm hover:bg-emerald-50 disabled:opacity-40 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Info Notice ── */}
                <div className="bg-[#e7eefe] border-l-4 border-[#003527] p-4 rounded-r-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#003527] text-lg mt-0.5 flex-shrink-0">info</span>
                    <p className="text-sm text-[#52625c] leading-relaxed">
                        Sedekah yang diverifikasi akan <span className="font-bold text-[#003527]">otomatis masuk ke kas masjid</span> sebagai pemasukan.
                        Pastikan bukti transfer valid sebelum melakukan verifikasi.
                    </p>
                </div>

            </div>
        </AdminLayout>
    );
}