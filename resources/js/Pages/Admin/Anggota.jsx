import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ─────────────────────────────────────────────────── */
const getInitials = (nama) =>
    nama?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() ?? "??";

const AVATAR_COLORS = [
    { bg: "bg-[#b0f0d6]", text: "text-[#003527]" },
    { bg: "bg-[#ffdcc3]", text: "text-[#4a2400]" },
    { bg: "bg-[#d3e3dc]", text: "text-[#003527]" },
    { bg: "bg-[#dce2f3]", text: "text-[#003527]" },
    { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
];
const avatarColor = (id) => AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];

/* ── Modal Tambah/Edit ───────────────────────────────────────── */
function Modal({ show, onClose, editData = null }) {
    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama:      "",
        gender:    "laki-laki",
        telepon:   "",
        alamat:    "",
        is_active: true,
    });

    useEffect(() => {
        if (show) {
            if (editData) {
                setData({
                    nama:      editData.nama      ?? "",
                    gender:    editData.gender    ?? "laki-laki",
                    telepon:   editData.telepon   ?? "",
                    alamat:    editData.alamat    ?? "",
                    is_active: editData.is_active ?? true,
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
            put(`/admin/anggota/${editData.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post("/admin/anggota", {
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
                        {isEdit ? "Edit Anggota" : "Tambah Anggota Baru"}
                    </h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nama */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Nama Lengkap</label>
                        <input
                            type="text" value={data.nama}
                            onChange={e => setData("nama", e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                        {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Jenis Kelamin</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { val: "laki-laki",  label: "Laki-laki", icon: "man"    },
                                { val: "perempuan",  label: "Perempuan", icon: "woman"  },
                            ].map(g => (
                                <label
                                    key={g.val}
                                    className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                                        data.gender === g.val
                                            ? "border-[#003527] bg-emerald-50 text-[#003527] font-semibold"
                                            : "border-emerald-100 text-[#52625c] hover:border-emerald-300"
                                    }`}
                                >
                                    <input type="radio" className="hidden" name="gender" value={g.val}
                                        checked={data.gender === g.val}
                                        onChange={() => setData("gender", g.val)} />
                                    <span className="material-symbols-outlined text-base">{g.icon}</span>
                                    <span className="text-sm">{g.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                    </div>

                    {/* Telepon */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Telepon <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text" value={data.telepon}
                            onChange={e => setData("telepon", e.target.value)}
                            placeholder="Contoh: 0812-3456-7890"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Alamat */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Alamat <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text" value={data.alamat}
                            onChange={e => setData("alamat", e.target.value)}
                            placeholder="Contoh: Jl. Raya No. 1, RT 01/RW 01"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Status (edit only) */}
                    {isEdit && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Status</label>
                            <button
                                type="button"
                                onClick={() => setData("is_active", !data.is_active)}
                                className="flex items-center gap-3"
                            >
                                <div className={`relative w-10 h-6 rounded-full transition-colors ${data.is_active ? "bg-[#003527]" : "bg-gray-200"}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_active ? "left-5" : "left-1"}`} />
                                </div>
                                <span className="text-sm text-[#404944]">{data.is_active ? "Aktif" : "Nonaktif"}</span>
                            </button>
                        </div>
                    )}

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
                            {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Anggota"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm ──────────────────────────────────────────── */
function DeleteConfirm({ show, onClose, onConfirm, processing, nama }) {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-red-600">person_remove</span>
                </div>
                <h3 className="text-center font-bold text-[#003527] text-lg mb-1">Hapus Anggota?</h3>
                <p className="text-center text-[#52625c] text-sm mb-6">
                    Anggota <span className="font-semibold text-[#003527]">{nama}</span> akan dihapus permanen beserta semua jadwal pengajiannya.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-[#52625c] hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm} disabled={processing}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Pagination ──────────────────────────────────────────────── */
function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page, from, to, total } = meta;

    const pages = [];
    if (last_page <= 7) {
        for (let i = 1; i <= last_page; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current_page > 3) pages.push("...");
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
            pages.push(i);
        }
        if (current_page < last_page - 2) pages.push("...");
        pages.push(last_page);
    }

    return (
        <div className="px-6 py-4 bg-white border-t border-emerald-100 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-[#52625c]">
                Showing {from ?? 0} to {to ?? 0} of {total?.toLocaleString("id-ID") ?? 0} members
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className="p-2 border border-[#bfc9c3] rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-40"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-[#52625c] text-sm">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                                p === current_page
                                    ? "bg-[#003527] text-white"
                                    : "hover:bg-emerald-50 text-[#404944]"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className="p-2 border border-[#bfc9c3] rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-40"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function Anggota({ lakiLaki, perempuan }) {
    const [search, setSearch]           = useState("");
    const [showModal, setShowModal]     = useState(false);
    const [editData, setEditData]       = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]       = useState(false);
    const [page, setPage]               = useState(1);
    const PER_PAGE = 10;

    // Gabungkan semua anggota
    const allAnggota = [
        ...(lakiLaki ?? []),
        ...(perempuan ?? []),
    ].sort((a, b) => a.nama.localeCompare(b.nama));

    // Filter + search
    const filtered = allAnggota.filter(a =>
        a.nama?.toLowerCase().includes(search.toLowerCase()) ||
        a.telepon?.includes(search) ||
        a.alamat?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination manual (karena data sudah di-load semua)
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const paginationMeta = {
        current_page: page,
        last_page:    totalPages,
        from:         filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1,
        to:           Math.min(page * PER_PAGE, filtered.length),
        total:        filtered.length,
    };

    const handleSearch = (val) => { setSearch(val); setPage(1); };

    const handleEdit = (a) => { setEditData(a); setShowModal(true); };

    const handleCloseModal = () => { setShowModal(false); setEditData(null); };

    const handleDelete = (a) => setDeleteTarget(a);

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/anggota/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    // Stats
    const totalLaki     = lakiLaki?.length  ?? 0;
    const totalPerempuan = perempuan?.length ?? 0;
    const totalAll      = totalLaki + totalPerempuan;
    const totalAktif    = allAnggota.filter(a => a.is_active).length;
    const pctAktif      = totalAll > 0 ? Math.round((totalAktif / totalAll) * 100) : 0;

    return (
        <AdminLayout title="Manajemen Anggota">
            <Head title="Anggota" />

            <Modal show={showModal} onClose={handleCloseModal} editData={editData} />
            <DeleteConfirm
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                nama={deleteTarget?.nama}
            />

            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#003527]">Manajemen Anggota</h2>
                        <p className="text-sm text-[#52625c]">Monitor and manage your mosque community records.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707974]">
                                <span className="material-symbols-outlined text-base">search</span>
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Search members..."
                                className="pl-9 pr-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm w-56 transition-all bg-white"
                            />
                        </div>
                        {/* Tambah */}
                        <button
                            onClick={() => { setEditData(null); setShowModal(true); }}
                            className="flex items-center gap-2 bg-[#D97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">person_add</span>
                            Tambah
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            icon: "groups",
                            iconBg: "bg-[#d3e3dc]",
                            iconColor: "text-[#003527]",
                            badge: "+12%",
                            badgeColor: "text-emerald-600 text-xs font-bold",
                            label: "TOTAL MEMBERS",
                            value: totalAll.toLocaleString("id-ID"),
                        },
                        {
                            icon: "man",
                            iconBg: "bg-[#dce2f3]",
                            iconColor: "text-[#003527]",
                            label: "MALE MEMBERS",
                            value: totalLaki.toLocaleString("id-ID"),
                        },
                        {
                            icon: "woman",
                            iconBg: "bg-[#ffdcc3]",
                            iconColor: "text-[#6a3700]",
                            label: "FEMALE MEMBERS",
                            value: totalPerempuan.toLocaleString("id-ID"),
                        },
                        {
                            icon: "event_available",
                            iconBg: "bg-[#fef3c7]",
                            iconColor: "text-[#92400e]",
                            label: "ACTIVE THIS MONTH",
                            value: `${pctAktif}%`,
                        },
                    ].map((s, i) => (
                        <div
                            key={s.label}
                            className="bg-white border border-emerald-100 p-5 rounded-xl hover:border-[#003527] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                                    <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
                                </div>
                                {s.badge && <span className={s.badgeColor}>{s.badge}</span>}
                            </div>
                            <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-1">{s.label}</p>
                            <p className="text-2xl font-bold text-[#003527]">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Table ── */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#003527] text-white text-sm">
                                    <th className="px-6 py-4 font-semibold">Member Profile</th>
                                    <th className="px-6 py-4 font-semibold">Gender</th>
                                    <th className="px-6 py-4 font-semibold">Join Date</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-[#52625c]">
                                            <span className="material-symbols-outlined text-5xl text-emerald-200 block mb-2">group_off</span>
                                            <p className="text-sm">
                                                {search ? `Tidak ada anggota dengan nama "${search}".` : "Belum ada data anggota."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((a, i) => {
                                        const initials = getInitials(a.nama);
                                        const clr      = avatarColor(a.id);
                                        const isLaki   = a.gender === "laki-laki";

                                        return (
                                            <tr
                                                key={a.id}
                                                className={`hover:bg-[#f0f3ff]/50 transition-colors group ${i % 2 !== 0 ? "bg-[#f0f3ff]/20" : "bg-white"}`}
                                            >
                                                {/* Profile */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${clr.bg} ${clr.text}`}>
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[#151c27] text-sm">{a.nama}</p>
                                                            <p className="text-xs text-[#52625c]">
                                                                {a.telepon || a.alamat || `Urutan #${a.urutan}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Gender */}
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        isLaki
                                                            ? "bg-[#d3e3dc] text-[#003527]"
                                                            : "bg-[#ffdcc3] text-[#4a2400]"
                                                    }`}>
                                                        {isLaki ? "Male" : "Female"}
                                                    </span>
                                                </td>

                                                {/* Join Date */}
                                                <td className="px-6 py-4 text-sm text-[#404944]">
                                                    {a.created_at
                                                        ? new Date(a.created_at).toLocaleDateString("en-US", {
                                                            month: "short", day: "2-digit", year: "numeric",
                                                          })
                                                        : "-"}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                        a.is_active
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-orange-50 text-orange-700"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${a.is_active ? "bg-emerald-600" : "bg-orange-500"}`} />
                                                        {a.is_active ? "Active" : "Pending"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleEdit(a)}
                                                            className="p-2 hover:bg-[#d3e3dc] rounded-lg text-[#003527] transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(a)}
                                                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
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

                    {/* Pagination */}
                    <Pagination meta={paginationMeta} onPageChange={setPage} />
                </div>

            </div>
        </AdminLayout>
    );
}