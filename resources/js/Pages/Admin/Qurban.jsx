import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ─────────────────────────────────────────────────── */
const HEWAN_STYLE = {
    kambing: { label: "Goat",         bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
    sapi:    { label: "Cow (Whole)",  bg: "bg-[#d3e3dc]", text: "text-[#003527]" },
    kerbau:  { label: "Buffalo",      bg: "bg-[#dce2f3]", text: "text-[#003527]" },
};

const hewanStyle = (jenis) => HEWAN_STYLE[jenis] ?? { label: jenis, bg: "bg-slate-100", text: "text-slate-700" };

/* ── Modal ───────────────────────────────────────────────────── */
function Modal({ show, onClose, editData = null, tahunAktif }) {
    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama_peserta: "",
        jenis_hewan:  "kambing",
        jumlah_hewan: 1,
        tahun:        tahunAktif ?? new Date().getFullYear(),
        keterangan:   "",
    });

    useEffect(() => {
        if (show) {
            if (editData) {
                setData({
                    nama_peserta: editData.nama_peserta ?? "",
                    jenis_hewan:  editData.jenis_hewan  ?? "kambing",
                    jumlah_hewan: editData.jumlah_hewan ?? 1,
                    tahun:        editData.tahun        ?? tahunAktif,
                    keterangan:   editData.keterangan   ?? "",
                });
            } else {
                reset();
                setData("tahun", tahunAktif ?? new Date().getFullYear());
            }
            clearErrors();
        }
    }, [show, editData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/qurban/${editData.id}`, { onSuccess: () => { reset(); onClose(); } });
        } else {
            post("/admin/qurban", { onSuccess: () => { reset(); onClose(); } });
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-[#003527]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-[#003527] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">
                        {isEdit ? "Edit Data Qurban" : "Tambah Peserta Qurban"}
                    </h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nama Peserta */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Nama Peserta (Muqorrib)</label>
                        <input
                            type="text" value={data.nama_peserta}
                            onChange={e => setData("nama_peserta", e.target.value)}
                            placeholder="Contoh: Keluarga H. Ahmad"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                        {errors.nama_peserta && <p className="text-red-500 text-xs">{errors.nama_peserta}</p>}
                    </div>

                    {/* Jenis Hewan */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Jenis Hewan</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: "kambing", label: "Kambing", icon: "🐑" },
                                { val: "sapi",    label: "Sapi",    icon: "🐄" },
                                { val: "kerbau",  label: "Kerbau",  icon: "🦬" },
                            ].map(h => (
                                <label key={h.val}
                                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-1 transition-all ${
                                        data.jenis_hewan === h.val
                                            ? "border-[#003527] bg-emerald-50"
                                            : "border-emerald-100 hover:border-emerald-300"
                                    }`}>
                                    <input type="radio" className="hidden" name="jenis_hewan" value={h.val}
                                        checked={data.jenis_hewan === h.val}
                                        onChange={() => setData("jenis_hewan", h.val)} />
                                    <span className="text-2xl">{h.icon}</span>
                                    <span className={`text-xs font-semibold ${data.jenis_hewan === h.val ? "text-[#003527]" : "text-[#52625c]"}`}>
                                        {h.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.jenis_hewan && <p className="text-red-500 text-xs">{errors.jenis_hewan}</p>}
                    </div>

                    {/* Jumlah + Tahun */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Jumlah Hewan</label>
                            <div className="flex items-center gap-2">
                                <button type="button"
                                    onClick={() => setData("jumlah_hewan", Math.max(1, data.jumlah_hewan - 1))}
                                    className="w-9 h-9 rounded-xl border border-emerald-200 text-[#003527] font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center">
                                    −
                                </button>
                                <input
                                    type="number" value={data.jumlah_hewan} min={1} max={100}
                                    onChange={e => setData("jumlah_hewan", parseInt(e.target.value) || 1)}
                                    className="flex-1 text-center px-2 py-2 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm font-bold transition-all"
                                />
                                <button type="button"
                                    onClick={() => setData("jumlah_hewan", Math.min(100, data.jumlah_hewan + 1))}
                                    className="w-9 h-9 rounded-xl border border-emerald-200 text-[#003527] font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center">
                                    +
                                </button>
                            </div>
                            {errors.jumlah_hewan && <p className="text-red-500 text-xs">{errors.jumlah_hewan}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Tahun</label>
                            <input
                                type="number" value={data.tahun} min={2000} max={2100}
                                onChange={e => setData("tahun", parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            />
                            {errors.tahun && <p className="text-red-500 text-xs">{errors.tahun}</p>}
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Keterangan <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text" value={data.keterangan}
                            onChange={e => setData("keterangan", e.target.value)}
                            placeholder="Contoh: Sapi 1/7 Share, atas nama almarhum"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-emerald-200 text-[#52625c] text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 py-3 rounded-xl bg-[#003527] text-white text-sm font-semibold hover:bg-[#0b513d] disabled:opacity-50 transition-colors">
                            {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Daftarkan"}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-red-600">delete</span>
                </div>
                <h3 className="font-bold text-[#003527] text-lg mb-1">Hapus Data Qurban?</h3>
                <p className="text-[#52625c] text-sm mb-5">
                    Data qurban <span className="font-semibold text-[#003527]">"{nama}"</span> akan dihapus permanen.
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

/* ── Main Page ───────────────────────────────────────────────── */
export default function Qurban({ qurban, ringkasan, tahun, tahunList }) {
    const [showModal, setShowModal]       = useState(false);
    const [editData, setEditData]         = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [tahunAktif, setTahunAktif]     = useState(tahun ?? new Date().getFullYear());
    const [page, setPage]                 = useState(1);
    const PER_PAGE = 10;

    const allQurban = qurban?.data ?? qurban ?? [];

    // Pagination
    const totalPages = Math.ceil(allQurban.length / PER_PAGE);
    const paginated  = allQurban.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleEdit   = (q) => { setEditData(q); setShowModal(true); };
    const handleClose  = ()  => { setShowModal(false); setEditData(null); };
    const handleDelete = (q) => setDeleteTarget(q);
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/qurban/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const handleTahunChange = (t) => {
        setTahunAktif(t);
        setPage(1);
        router.get("/admin/qurban", { tahun: t }, { preserveState: true, replace: true });
    };

    // Stats
    const totalDonors  = allQurban.length;
    const totalHewan   = allQurban.reduce((a, q) => a + (q.jumlah_hewan ?? 0), 0);
    const totalSapi    = ringkasan?.find?.(r => r.jenis_hewan === "sapi")?.total    ?? allQurban.filter(q => q.jenis_hewan === "sapi").reduce((a, q) => a + q.jumlah_hewan, 0);
    const totalKambing = ringkasan?.find?.(r => r.jenis_hewan === "kambing")?.total ?? allQurban.filter(q => q.jenis_hewan === "kambing").reduce((a, q) => a + q.jumlah_hewan, 0);
    const totalKerbau  = ringkasan?.find?.(r => r.jenis_hewan === "kerbau")?.total  ?? allQurban.filter(q => q.jenis_hewan === "kerbau").reduce((a, q) => a + q.jumlah_hewan, 0);

    // Pages list for pagination
    const pageList = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pageList.push(i);
    } else {
        pageList.push(1);
        if (page > 3) pageList.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pageList.push(i);
        if (page < totalPages - 2) pageList.push("...");
        pageList.push(totalPages);
    }

    return (
        <AdminLayout title="Qurban Registration">
            <Head title="Qurban" />

            <Modal show={showModal} onClose={handleClose} editData={editData} tahunAktif={tahunAktif} />
            <DeleteConfirm
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                nama={deleteTarget?.nama_peserta}
            />

            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[#003527]">Qurban Registration</h2>
                        <p className="text-sm text-[#52625c]">Welcome back, Admin Al-Hikmah</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Filter Tahun */}
                        <select
                            value={tahunAktif}
                            onChange={e => handleTahunChange(parseInt(e.target.value))}
                            className="px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm bg-white transition-all"
                        >
                            {(tahunList?.length ? tahunList : [new Date().getFullYear()]).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => { setEditData(null); setShowModal(true); }}
                            className="flex items-center gap-2 bg-[#003527] hover:bg-[#0b513d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            Tambah Peserta
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total Donors */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-all shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-[#d3e3dc] flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[#003527] text-2xl">calendar_month</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-1">Total Donors</p>
                            <p className="text-3xl font-extrabold text-[#003527]">{totalDonors}</p>
                        </div>
                    </div>

                    {/* Animals Collected */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-all shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-[#ffdcc3] flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[#4a2400] text-2xl">pets</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-1">Animals Collected</p>
                            <p className="text-3xl font-extrabold text-[#003527]">{totalHewan}</p>
                            <p className="text-xs text-[#52625c] mt-0.5">
                                {[
                                    totalSapi    > 0 && `${totalSapi} Sapi`,
                                    totalKambing > 0 && `${totalKambing} Kambing`,
                                    totalKerbau  > 0 && `${totalKerbau} Kerbau`,
                                ].filter(Boolean).join(", ") || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#003527] text-white text-sm">
                                    <th className="px-6 py-4 font-semibold">No.</th>
                                    <th className="px-6 py-4 font-semibold">Muqorrib (Donor Name)</th>
                                    <th className="px-6 py-4 font-semibold">Animal Type</th>
                                    <th className="px-6 py-4 font-semibold">Quantity</th>
                                    <th className="px-6 py-4 font-semibold">Registration Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-[#52625c]">
                                            <span className="text-5xl block mb-3">🐑</span>
                                            <p className="text-sm font-medium">Belum ada pendaftaran qurban untuk tahun {tahunAktif}.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((q, i) => {
                                        const no    = (page - 1) * PER_PAGE + i + 1;
                                        const style = hewanStyle(q.jenis_hewan);
                                        const label = q.keterangan
                                            ? `${style.label} ${q.keterangan.includes("1/7") || q.keterangan.includes("share") ? "(1/7 Share)" : ""}`
                                            : style.label;

                                        return (
                                            <tr key={`${q.id}-${i}`}
                                                className={`hover:bg-emerald-50/50 transition-colors ${i % 2 !== 0 ? "bg-[#f0f3ff]/30" : "bg-white"}`}>
                                                {/* No */}
                                                <td className="px-6 py-5 text-[#52625c] font-medium text-sm">{no}</td>
                                                {/* Nama */}
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-[#003527] text-base">{q.nama_peserta}</p>
                                                    {q.keterangan && (
                                                        <p className="text-xs text-[#52625c] mt-0.5">{q.keterangan}</p>
                                                    )}
                                                </td>
                                                {/* Jenis */}
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${style.bg} ${style.text}`}>
                                                        {q.jenis_hewan === "sapi" && q.keterangan?.toLowerCase().includes("share")
                                                            ? "Cow (1/7 Share)"
                                                            : q.jenis_hewan === "sapi"
                                                            ? "Cow (Whole)"
                                                            : style.label}
                                                    </span>
                                                </td>
                                                {/* Jumlah */}
                                                <td className="px-6 py-5 font-bold text-[#151c27] text-base">{q.jumlah_hewan}</td>
                                                {/* Tanggal */}
                                                <td className="px-6 py-5 text-[#52625c] text-sm">
                                                    {q.created_at
                                                        ? new Date(q.created_at).toLocaleDateString("en-US", {
                                                            month: "short", day: "2-digit", year: "numeric",
                                                          })
                                                        : "-"}
                                                </td>
                                                {/* Actions */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button onClick={() => handleEdit(q)}
                                                            className="p-2 text-[#003527] hover:bg-emerald-100 rounded-lg transition-colors">
                                                            <span className="material-symbols-outlined text-base">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(q)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                    <div className="px-6 py-4 bg-[#f9f9ff] border-t border-emerald-100 flex justify-between items-center">
                        <p className="text-xs text-[#52625c]">
                            Showing {paginated.length} of {allQurban.length} Muqorrib
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white border border-[#bfc9c3] rounded-xl text-sm hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                            >
                                Previous
                            </button>
                            {pageList.map((p, i) =>
                                p === "..." ? (
                                    <span key={`dots-${i}`} className="px-1.5 text-[#52625c] text-sm">...</span>
                                ) : (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                                            p === page
                                                ? "bg-[#003527] text-white shadow-sm"
                                                : "bg-white border border-[#bfc9c3] text-[#404944] hover:bg-emerald-50"
                                        }`}>
                                        {p}
                                    </button>
                                )
                            )}
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

            </div>
        </AdminLayout>
    );
}