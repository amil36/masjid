import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ─────────────────────────────────────────────────── */
const fmtTgl = (str) => {
    if (!str) return "-";
    return new Date(str).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

const ICONS = [
    "celebration", "child_care", "volunteer_activism", "mosque",
    "groups", "menu_book", "favorite", "star", "event", "campaign",
];

const EVENT_ICON_MAP = {
    "khajatan":     { icon: "celebration",        bg: "bg-[#d3e3dc]", color: "text-[#003527]" },
    "tasyakuran":   { icon: "celebration",        bg: "bg-[#d3e3dc]", color: "text-[#003527]" },
    "aqiqah":       { icon: "child_care",         bg: "bg-[#ffdcc3]", color: "text-[#4a2400]" },
    "pengajian":    { icon: "menu_book",          bg: "bg-[#dce2f3]", color: "text-[#003527]" },
    "sedekah":      { icon: "volunteer_activism", bg: "bg-[#d3e3dc]", color: "text-[#003527]" },
    "default":      { icon: "event",             bg: "bg-[#e2e8f8]", color: "text-[#003527]" },
};

const getEventIcon = (judul = "") => {
    const j = judul.toLowerCase();
    for (const [key, val] of Object.entries(EVENT_ICON_MAP)) {
        if (j.includes(key)) return val;
    }
    return EVENT_ICON_MAP.default;
};

/* ── Modal Tambah/Edit ───────────────────────────────────────── */
function Modal({ show, onClose, editData = null }) {
    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        judul:      "",
        tempat:     "",
        tanggal:    "",
        waktu:      "",
        deskripsi:  "",
    });

    useEffect(() => {
        if (show) {
            if (editData) {
                setData({
                    judul:     editData.judul     ?? "",
                    tempat:    editData.tempat    ?? "",
                    tanggal:   editData.tanggal?.slice(0, 10) ?? "",
                    waktu:     editData.waktu?.slice(0, 5)    ?? "",
                    deskripsi: editData.deskripsi ?? "",
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [show, editData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/kegiatan/${editData.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post("/admin/kegiatan", {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-[#003527]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-[#003527] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                        {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
                    </h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Judul */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Judul Kegiatan</label>
                        <input
                            type="text" value={data.judul}
                            onChange={e => setData("judul", e.target.value)}
                            placeholder="Contoh: Khajatan Syukuran Haji"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                        {errors.judul && <p className="text-red-500 text-xs">{errors.judul}</p>}
                    </div>

                    {/* Tempat */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Tempat</label>
                        <input
                            type="text" value={data.tempat}
                            onChange={e => setData("tempat", e.target.value)}
                            placeholder="Contoh: Aula Utama Lantai 1"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                        {errors.tempat && <p className="text-red-500 text-xs">{errors.tempat}</p>}
                    </div>

                    {/* Tanggal + Waktu */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Tanggal</label>
                            <input
                                type="date" value={data.tanggal}
                                onChange={e => setData("tanggal", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            />
                            {errors.tanggal && <p className="text-red-500 text-xs">{errors.tanggal}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">
                                Waktu <span className="text-[#707974] font-normal">(opsional)</span>
                            </label>
                            <input
                                type="time" value={data.waktu}
                                onChange={e => setData("waktu", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Deskripsi <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData("deskripsi", e.target.value)}
                            placeholder="Keterangan tambahan tentang kegiatan..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-emerald-200 text-[#52625c] text-sm font-medium hover:bg-emerald-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit" disabled={processing}
                            className="flex-1 py-3 rounded-xl bg-[#003527] text-white text-sm font-semibold hover:bg-[#0b513d] disabled:opacity-50 transition-colors"
                        >
                            {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kegiatan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm ──────────────────────────────────────────── */
function DeleteConfirm({ show, onClose, onConfirm, processing, judul }) {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-red-600">delete</span>
                </div>
                <h3 className="font-bold text-[#003527] text-lg mb-1">Hapus Kegiatan?</h3>
                <p className="text-[#52625c] text-sm mb-5">
                    Kegiatan <span className="font-semibold text-[#003527]">"{judul}"</span> akan dihapus permanen.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-[#52625c] hover:bg-gray-50 transition-colors">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={processing}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Status Badge ────────────────────────────────────────────── */
function StatusBadge({ tanggal }) {
    const now  = new Date();
    const tgl  = new Date(tanggal);
    const diff = Math.ceil((tgl - now) / (1000 * 60 * 60 * 24));

    if (diff < 0)  return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">Selesai</span>;
    if (diff === 0) return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Hari Ini</span>;
    if (diff <= 3) return <span className="px-3 py-1 bg-[#fef3c7] text-[#92400e] rounded-full text-xs font-bold">Confirmed</span>;
    return <span className="px-3 py-1 bg-[#b0f0d6] text-[#0b513d] rounded-full text-xs font-bold">Published</span>;
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function Kegiatan({ kegiatan }) {
    const [showModal, setShowModal]       = useState(false);
    const [editData, setEditData]         = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [search, setSearch]             = useState("");
    const [page, setPage]                 = useState(1);
    const PER_PAGE = 8;

    const now = new Date();

    const allKegiatan = kegiatan?.data ?? kegiatan ?? [];

    // Filter + search
    const filtered = allKegiatan.filter(k =>
        k.judul?.toLowerCase().includes(search.toLowerCase()) ||
        k.tempat?.toLowerCase().includes(search.toLowerCase()) ||
        k.deskripsi?.toLowerCase().includes(search.toLowerCase())
    );

    const upcoming  = filtered.filter(k => new Date(k.tanggal) >= now);
    const archived  = filtered.filter(k => new Date(k.tanggal) < now);

    // Pagination on upcoming
    const totalPages = Math.ceil(upcoming.length / PER_PAGE);
    const paginated  = upcoming.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (val) => { setSearch(val); setPage(1); };
    const handleEdit   = (k)   => { setEditData(k); setShowModal(true); };
    const handleClose  = ()    => { setShowModal(false); setEditData(null); };
    const handleDelete = (k)   => setDeleteTarget(k);
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/kegiatan/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    // This-month archived
    const archivedThisMonth = allKegiatan.filter(k => {
        const d = new Date(k.tanggal);
        return d < now && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <AdminLayout title="Manajemen Kegiatan">
            <Head title="Kegiatan" />

            <Modal show={showModal} onClose={handleClose} editData={editData} />
            <DeleteConfirm
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                judul={deleteTarget?.judul}
            />

            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[#003527]">Manajemen Kegiatan</h2>
                        <p className="text-sm text-[#52625c]">Manage mosque schedules and special events.</p>
                    </div>
                    <button
                        onClick={() => { setEditData(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-[#003527] hover:bg-[#0b513d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Tambah Kegiatan
                    </button>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "calendar_month",
                            bg: "bg-[#d3e3dc]",
                            color: "text-[#003527]",
                            label: "Upcoming Events",
                            value: String(upcoming.length).padStart(2, "0"),
                        },
                        {
                            icon: "history",
                            bg: "bg-[#ffdcc3]",
                            color: "text-[#4a2400]",
                            label: "Archived (This Month)",
                            value: String(archivedThisMonth).padStart(2, "0"),
                        },
                        {
                            icon: "assignment_ind",
                            bg: "bg-[#003527]",
                            color: "text-white",
                            label: "Total RSVPs",
                            value: String(allKegiatan.length * 8 + 5),  // placeholder
                        },
                    ].map((s) => (
                        <div key={s.label}
                            className="bg-white border border-emerald-100 rounded-xl p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-all shadow-sm">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                                <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-3xl font-extrabold text-[#003527]">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Table Card ── */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    {/* Table header */}
                    <div className="px-6 py-4 border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-[#003527]">Jadwal Mendatang</h3>
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-base">search</span>
                                <input
                                    type="text" value={search}
                                    onChange={e => handleSearch(e.target.value)}
                                    placeholder="Search events..."
                                    className="pl-9 pr-4 py-2 bg-[#f0f3ff] border border-[#bfc9c3] rounded-xl text-sm focus:ring-1 focus:ring-[#003527] focus:border-[#003527] outline-none w-56 transition-all"
                                />
                            </div>
                            <button className="p-2 border border-[#bfc9c3] rounded-xl hover:bg-[#f0f3ff] transition-colors">
                                <span className="material-symbols-outlined text-[#52625c] text-base">filter_list</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#003527] text-white text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Event Details</th>
                                    <th className="px-6 py-4 font-semibold">Location</th>
                                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-[#52625c]">
                                            <span className="material-symbols-outlined text-5xl text-emerald-200 block mb-2">event_busy</span>
                                            <p className="text-sm">
                                                {search ? `Tidak ada kegiatan dengan kata kunci "${search}".` : "Belum ada kegiatan mendatang."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((k, i) => {
                                        const { icon, bg, color } = getEventIcon(k.judul);
                                        return (
                                            <tr key={`${k.id}-${i}`}
                                                className={`hover:bg-emerald-50/60 transition-colors group ${i % 2 !== 0 ? "bg-[#F0FDF4]" : "bg-white"}`}>
                                                {/* Event Details */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${bg}`}>
                                                            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#003527] text-base leading-tight">{k.judul}</p>
                                                            {k.deskripsi && (
                                                                <p className="text-sm text-[#52625c] mt-0.5 line-clamp-1">{k.deskripsi}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Location */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5 text-[#52625c] text-sm">
                                                        <span className="material-symbols-outlined text-[16px] text-[#707974]">location_on</span>
                                                        {k.tempat}
                                                    </div>
                                                </td>
                                                {/* Date & Time */}
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-[#151c27] text-sm">
                                                        {new Date(k.tanggal).toLocaleDateString("id-ID", {
                                                            day: "2-digit", month: "short", year: "numeric",
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-[#52625c] mt-0.5">
                                                        {k.waktu ? k.waktu.slice(0, 5) + " WIB" : k.hari ?? ""}
                                                    </p>
                                                </td>
                                                {/* Status */}
                                                <td className="px-6 py-5">
                                                    <StatusBadge tanggal={k.tanggal} />
                                                </td>
                                                {/* Actions */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => handleEdit(k)}
                                                            className="p-2 text-[#003527] hover:bg-[#003527]/10 rounded-lg transition-colors"
                                                            title="Edit">
                                                            <span className="material-symbols-outlined text-base">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(k)}
                                                            className="p-2 text-red-600 hover:bg-red-600/10 rounded-lg transition-colors"
                                                            title="Hapus">
                                                            <span className="material-symbols-outlined text-base">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <div className="px-6 py-4 bg-[#f0f3ff] flex justify-between items-center border-t border-emerald-100">
                        <p className="text-xs text-[#52625c]">
                            Showing {paginated.length} of {upcoming.length} upcoming events
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white border border-[#bfc9c3] rounded-xl text-sm hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-4 py-2 bg-white border border-[#bfc9c3] rounded-xl text-sm hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── System Information Notice ── */}
                <div className="bg-[#e7eefe] border-l-4 border-[#003527] p-5 rounded-r-xl flex items-start gap-4">
                    <span className="material-symbols-outlined text-[#003527] text-xl mt-0.5 flex-shrink-0">info</span>
                    <div>
                        <h4 className="font-bold text-[#003527] text-sm mb-1">System Information</h4>
                        <p className="text-sm text-[#52625c] leading-relaxed">
                            Policy Reminder: All events are automatically moved to the{" "}
                            <span className="font-bold underline cursor-pointer hover:text-[#003527]">History/Archive</span>{" "}
                            exactly 3 days after their completion date. You can still access these records from the "Activity Log" in settings.
                        </p>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}