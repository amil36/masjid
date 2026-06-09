import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ────────────────────────────────────────────────── */
const rp = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(n ?? 0);

const CAT_COLOR = {
    "Sedekah / Donasi":      "bg-emerald-100 text-emerald-800",
    "Kas Jumat":             "bg-emerald-100 text-emerald-800",
    "Infak":                 "bg-blue-100 text-blue-800",
    "Qurban":                "bg-amber-100 text-amber-800",
    "Lainnya (Pemasukan)":   "bg-purple-100 text-purple-800",
    "Operasional Masjid":    "bg-orange-100 text-orange-800",
    "Listrik & Air":         "bg-orange-100 text-orange-800",
    "Perbaikan & Renovasi":  "bg-purple-100 text-purple-800",
    "Kegiatan":              "bg-blue-100 text-blue-800",
    "Lainnya (Pengeluaran)": "bg-slate-100 text-slate-700",
};
const catColor = (nama) => CAT_COLOR[nama] ?? "bg-slate-100 text-slate-700";

/* ── Modal ──────────────────────────────────────────────────── */
function Modal({ show, onClose, kategoris, editData = null }) {
    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        jenis:       "pemasukan",
        kategori_id: "",
        sumber_nama: "",
        is_anonim:   false,
        nominal:     "",
        keterangan:  "",
        tanggal:     new Date().toISOString().slice(0, 10),
    });

    // Sync form ketika editData berubah
    useEffect(() => {
        if (editData) {
            setData({
                jenis:       editData.jenis        ?? "pemasukan",
                kategori_id: String(editData.kategori_id ?? ""),
                sumber_nama: editData.sumber_nama  ?? "",
                is_anonim:   editData.is_anonim    ?? false,
                nominal:     editData.nominal      ?? "",
                keterangan:  editData.keterangan   ?? "",
                tanggal:     editData.tanggal?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
            });
        } else {
            reset();
        }
        clearErrors();
    }, [editData, show]);

    const filteredKat = kategoris?.filter(k => k.jenis === data.jenis) ?? [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/kas/${editData.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post("/admin/kas", {
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
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-[#003527] px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold">{isEdit ? "Edit Transaksi" : "Tambah Transaksi Baru"}</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Jenis */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Jenis Transaksi</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["pemasukan", "pengeluaran"].map((j) => (
                                <label
                                    key={j}
                                    className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                                        data.jenis === j
                                            ? "border-[#003527] bg-emerald-50 text-[#003527] font-semibold"
                                            : "border-emerald-100 text-[#52625c] hover:border-emerald-300"
                                    }`}
                                >
                                    <input
                                        type="radio" className="hidden" name="jenis" value={j}
                                        checked={data.jenis === j}
                                        onChange={() => { setData("jenis", j); setData("kategori_id", ""); }}
                                    />
                                    <span className="material-symbols-outlined text-base">
                                        {j === "pemasukan" ? "trending_up" : "trending_down"}
                                    </span>
                                    <span className="text-sm">{j === "pemasukan" ? "Pendapatan" : "Pengeluaran"}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sumber / Tujuan */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            {data.jenis === "pemasukan" ? "Nama Sumber" : "Tujuan Pengeluaran"}
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text" value={data.sumber_nama}
                                onChange={e => setData("sumber_nama", e.target.value)}
                                placeholder={data.jenis === "pemasukan" ? "Contoh: Hamba Allah / Bpk. Ahmad" : "Contoh: PLN / Toko Bangunan"}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            />
                            {data.jenis === "pemasukan" && (
                                <button
                                    type="button"
                                    onClick={() => setData("is_anonim", !data.is_anonim)}
                                    className="flex items-center gap-1.5 shrink-0"
                                >
                                    <div className={`w-8 h-5 rounded-full transition-colors relative ${data.is_anonim ? "bg-[#003527]" : "bg-gray-200"}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_anonim ? "left-3.5" : "left-0.5"}`} />
                                    </div>
                                    <span className="text-xs text-[#52625c]">Anonim</span>
                                </button>
                            )}
                        </div>
                        {errors.sumber_nama && <p className="text-red-500 text-xs">{errors.sumber_nama}</p>}
                    </div>

                    {/* Kategori + Tanggal */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Kategori</label>
                            <select
                                value={data.kategori_id}
                                onChange={e => setData("kategori_id", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            >
                                <option value="">Pilih kategori</option>
                                {filteredKat.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama}</option>
                                ))}
                            </select>
                            {errors.kategori_id && <p className="text-red-500 text-xs">{errors.kategori_id}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Tanggal</label>
                            <input
                                type="date" value={data.tanggal}
                                onChange={e => setData("tanggal", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
                            />
                            {errors.tanggal && <p className="text-red-500 text-xs">{errors.tanggal}</p>}
                        </div>
                    </div>

                    {/* Nominal */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Nominal (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52625c] text-sm font-medium">Rp</span>
                            <input
                                type="number" value={data.nominal}
                                onChange={e => setData("nominal", e.target.value)}
                                placeholder="0" min="1000"
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm font-bold transition-all"
                            />
                        </div>
                        {errors.nominal && <p className="text-red-500 text-xs">{errors.nominal}</p>}
                    </div>

                    {/* Keterangan */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">
                            Keterangan <span className="text-[#707974] font-normal">(opsional)</span>
                        </label>
                        <input
                            type="text" value={data.keterangan}
                            onChange={e => setData("keterangan", e.target.value)}
                            placeholder="Catatan tambahan..."
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all"
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
                            {processing ? "Menyimpan..." : "Simpan Transaksi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm ─────────────────────────────────────────── */
function DeleteConfirm({ show, onClose, onConfirm, processing }) {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-red-600">delete</span>
                </div>
                <h3 className="text-center font-bold text-[#003527] text-lg mb-2">Hapus Transaksi?</h3>
                <p className="text-center text-[#52625c] text-sm mb-6">
                    Tindakan ini tidak dapat dibatalkan. Data transaksi akan dihapus permanen.
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

/* ── Table ──────────────────────────────────────────────────── */
function KasTable({ data, jenis, onEdit, onDelete }) {
    const colLabel = jenis === "pemasukan" ? "Sumber" : "Tujuan";
    const items = data?.filter(t => t.jenis === jenis) ?? [];

    if (items.length === 0) {
        return (
            <div className="py-16 text-center text-[#52625c]">
                <span className="material-symbols-outlined text-5xl text-emerald-200 block mb-2">
                    {jenis === "pemasukan" ? "savings" : "receipt_long"}
                </span>
                <p className="text-sm">Belum ada data {jenis === "pemasukan" ? "pendapatan" : "pengeluaran"}.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#003527] text-white text-sm">
                        <th className="px-6 py-4 font-semibold">{colLabel}</th>
                        <th className="px-6 py-4 font-semibold">Kategori</th>
                        <th className="px-6 py-4 font-semibold text-right">Jumlah</th>
                        <th className="px-6 py-4 font-semibold">Tanggal</th>
                        <th className="px-6 py-4 font-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                    {items.map((t, i) => (
                        <tr
                            key={`${t.id}-${i}`}
                            className={`hover:bg-[#f0f3ff]/50 transition-colors ${i % 2 !== 0 ? "bg-emerald-50/30" : "bg-white"}`}
                        >
                            <td className="px-6 py-4 text-sm text-[#151c27]">
                                {t.is_anonim ? "Hamba Allah" : (t.sumber_nama || t.keterangan || "-")}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catColor(t.kategori?.nama)}`}>
                                    {t.kategori?.nama ?? "Lainnya"}
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-bold text-sm ${jenis === "pemasukan" ? "text-emerald-600" : "text-red-600"}`}>
                                {jenis === "pengeluaran" && "- "}{rp(t.nominal)}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#52625c]">
                                {new Date(t.tanggal).toLocaleDateString("id-ID", {
                                    day: "numeric", month: "short", year: "numeric",
                                })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="p-2 text-[#003527] hover:bg-emerald-100 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">edit</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(t)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function Kas({ transaksi, kategoris, totalMasuk, totalKeluar, totalKas }) {
    const [tab, setTab]                   = useState("pemasukan");
    const [showModal, setShowModal]       = useState(false);
    const [editData, setEditData]         = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);

    const allTrx = transaksi?.data ?? transaksi ?? [];

    const handleEdit = (trx) => {
        setEditData(trx);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData(null);
    };

    const handleDelete = (trx) => setDeleteTarget(trx);

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/kas/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    return (
        <AdminLayout title="Manajemen Kas">
            <Head title="Kas" />

            <Modal
                show={showModal}
                onClose={handleCloseModal}
                kategoris={kategoris}
                editData={editData}
            />
            <DeleteConfirm
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
            />

            <div className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#003527]">Manajemen Kas</h2>
                        <p className="text-sm text-[#52625c]">Pantau pemasukan dan pengeluaran operasional masjid.</p>
                    </div>
                    <button
                        onClick={() => { setEditData(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-[#D97706] hover:bg-[#b45309] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Tambah Transaksi
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: "account_balance_wallet", iconBg: "bg-[#064e3b]/10", iconColor: "text-[#003527]",    label: "TOTAL SALDO",            value: rp(totalKas),    valueColor: "text-[#003527]"   },
                        { icon: "trending_up",            iconBg: "bg-emerald-50",    iconColor: "text-emerald-600", label: "PENDAPATAN BULAN INI",   value: rp(totalMasuk),  valueColor: "text-emerald-700" },
                        { icon: "trending_down",          iconBg: "bg-red-50",        iconColor: "text-red-600",     label: "PENGELUARAN BULAN INI",  value: rp(totalKeluar), valueColor: "text-red-700"     },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white border border-emerald-100 p-6 rounded-xl flex items-center gap-4 hover:border-[#003527] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                                <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider">{s.label}</p>
                                <p className={`text-xl font-bold mt-0.5 ${s.valueColor}`}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs + Table */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="flex border-b border-emerald-100">
                        {[
                            { key: "pemasukan",  label: "Pendapatan (Income)"   },
                            { key: "pengeluaran", label: "Pengeluaran (Expenses)" },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                                    tab === t.key
                                        ? "text-[#003527] border-b-2 border-[#003527] bg-[#f0f3ff]"
                                        : "text-[#52625c] hover:text-[#003527] hover:bg-emerald-50/50"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <KasTable data={allTrx} jenis={tab} onEdit={handleEdit} onDelete={handleDelete} />
                </div>

            </div>
        </AdminLayout>
    );
}