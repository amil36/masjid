import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── helpers ─────────────────────────────────────────────────── */
const fmtTgl = (str) => {
    if (!str) return "-";
    const d = new Date(str);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtWaktu = (str) => str?.slice(0, 5) ?? "-";

/* ── Modal Tambah/Edit Jadwal ────────────────────────────────── */
function JadwalModal({ show, onClose, anggotaList, editData = null }) {
    const isEdit = !!editData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        anggota_id: "",
        tanggal:    "",
        tempat:     "Masjid",
        waktu:      "20:00",
        keterangan: "",
        is_selesai: false,
    });

    useEffect(() => {
        if (show) {
            if (editData) {
                setData({
                    anggota_id: String(editData.anggota_id ?? ""),
                    tanggal:    editData.tanggal?.slice(0, 10) ?? "",
                    tempat:     editData.tempat   ?? "Masjid",
                    waktu:      editData.waktu?.slice(0, 5)    ?? "20:00",
                    keterangan: editData.keterangan ?? "",
                    is_selesai: editData.is_selesai ?? false,
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
            put(`/admin/pengajian/${editData.id}`, { onSuccess: () => { reset(); onClose(); } });
        } else {
            post("/admin/pengajian", { onSuccess: () => { reset(); onClose(); } });
        }
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-[#003527]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-[#003527] px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">{isEdit ? "Edit Jadwal" : "Tambah Jadwal"}</h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Anggota */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Anggota</label>
                        <select value={data.anggota_id} onChange={e => setData("anggota_id", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all">
                            <option value="">Pilih anggota</option>
                            {anggotaList?.map(a => (
                                <option key={a.id} value={a.id}>{a.nama} ({a.gender})</option>
                            ))}
                        </select>
                        {errors.anggota_id && <p className="text-red-500 text-xs">{errors.anggota_id}</p>}
                    </div>
                    {/* Tanggal + Waktu */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Tanggal</label>
                            <input type="date" value={data.tanggal} onChange={e => setData("tanggal", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                            {errors.tanggal && <p className="text-red-500 text-xs">{errors.tanggal}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#404944]">Waktu</label>
                            <input type="time" value={data.waktu} onChange={e => setData("waktu", e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                        </div>
                    </div>
                    {/* Tempat */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Tempat</label>
                        <input type="text" value={data.tempat} onChange={e => setData("tempat", e.target.value)}
                            placeholder="Masjid / Nama & Alamat Rumah"
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                        {errors.tempat && <p className="text-red-500 text-xs">{errors.tempat}</p>}
                    </div>
                    {/* Keterangan */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#404944]">Keterangan <span className="text-[#707974] font-normal">(opsional)</span></label>
                        <input type="text" value={data.keterangan} onChange={e => setData("keterangan", e.target.value)}
                            placeholder="Catatan tambahan..."
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                    </div>
                    {/* Status selesai (edit only) */}
                    {isEdit && (
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setData("is_selesai", !data.is_selesai)}
                                className={`relative w-10 h-6 rounded-full transition-colors ${data.is_selesai ? "bg-[#003527]" : "bg-gray-200"}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_selesai ? "left-5" : "left-1"}`} />
                            </button>
                            <span className="text-sm text-[#404944]">Tandai sudah selesai</span>
                        </div>
                    )}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-emerald-200 text-[#52625c] text-sm font-medium hover:bg-emerald-50 transition-colors">Batal</button>
                        <button type="submit" disabled={processing}
                            className="flex-1 py-3 rounded-xl bg-[#003527] text-white text-sm font-semibold hover:bg-[#0b513d] disabled:opacity-50 transition-colors">
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm ──────────────────────────────────────────── */
function DeleteConfirm({ show, onClose, onConfirm, processing }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-red-600">delete</span>
                </div>
                <h3 className="font-bold text-[#003527] text-lg mb-1">Hapus Jadwal?</h3>
                <p className="text-[#52625c] text-sm mb-5">Jadwal ini akan dihapus permanen.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-[#52625c] hover:bg-gray-50 transition-colors">Batal</button>
                    <button onClick={onConfirm} disabled={processing}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Jadwal Table ────────────────────────────────────────────── */
function JadwalTable({ jadwal, gender, onEdit, onDelete, showAll, onToggleAll }) {
    const isLaki   = gender === "laki-laki";
    const displayed = showAll ? jadwal : jadwal.slice(0, 6);

    return (
        <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-sm">
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 ${isLaki ? "bg-[#003527]" : "bg-[#4a2400]"}`}>
                <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-xl">{isLaki ? "man" : "woman"}</span>
                    <h3 className="font-bold text-base">{isLaki ? "Men's Session" : "Women's Session"}</h3>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    isLaki
                        ? "bg-emerald-600/60 text-emerald-100 border border-emerald-500/40"
                        : "bg-[#6a3700]/70 text-[#ffdcc3] border border-[#8b4500]/40"
                }`}>
                    {isLaki ? "Every Thursday Night" : "Every Friday Afternoon"}
                </span>
            </div>

            {/* Column headers */}
            <div className={`grid gap-4 px-5 py-3 text-xs font-bold text-[#003527] border-b border-emerald-100 ${
                isLaki ? "bg-emerald-50/80" : "bg-amber-50/60"
            }`} style={{ gridTemplateColumns: "100px 1fr 1fr 80px" }}>
                <span>Rotation</span>
                <span>Host Name</span>
                <span>Location</span>
                <span>Actions</span>
            </div>

            {/* Rows */}
            {jadwal.length === 0 ? (
                <div className="bg-white py-12 text-center text-[#52625c] text-sm">
                    <span className="material-symbols-outlined text-4xl text-emerald-200 block mb-2">calendar_month</span>
                    Belum ada jadwal.
                </div>
            ) : (
                <div className="bg-white divide-y divide-emerald-50/80">
                    {displayed.map((j, i) => {
                        const tgl = j.tanggal ? new Date(j.tanggal) : null;
                        const day = tgl
                            ? tgl.toLocaleDateString("en-US", { day: "2-digit", month: "short" })
                            : "—";
                        const year = tgl ? tgl.getFullYear() : "";

                        return (
                            <div
                                key={`${j.id}-${i}`}
                                className={`grid gap-4 px-5 py-4 items-center hover:bg-emerald-50/40 transition-colors ${
                                    i === 0 ? "bg-emerald-50/30" : ""
                                }`}
                                style={{ gridTemplateColumns: "100px 1fr 1fr 80px" }}
                            >
                                {/* Rotation date */}
                                <div>
                                    <p className="text-sm font-bold text-[#003527]">{day}</p>
                                    <p className="text-xs text-[#52625c]">{year}</p>
                                </div>

                                {/* Host name */}
                                <p className="text-sm font-medium text-[#151c27]">
                                    {j.anggota?.nama ?? "—"}
                                </p>

                                {/* Location */}
                                <p className="text-sm text-[#707974]">{j.tempat}</p>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(j)}
                                        className="p-1.5 hover:bg-emerald-100 rounded-lg text-[#003527] transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[17px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(j)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[17px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View more */}
            {jadwal.length > 6 && (
                <button
                    onClick={onToggleAll}
                    className={`w-full py-3 text-xs font-semibold flex items-center justify-center gap-1 border-t transition-colors ${
                        isLaki
                            ? "text-[#003527] hover:bg-emerald-50 border-emerald-100"
                            : "text-[#4a2400] hover:bg-amber-50 border-amber-100"
                    }`}
                >
                    <span className="material-symbols-outlined text-sm">
                        {showAll ? "expand_less" : "expand_more"}
                    </span>
                    {showAll ? "Sembunyikan" : `Lihat Semua (${jadwal.length} Jadwal)`}
                </button>
            )}
        </div>
    );
}

/* ── Drag & Drop Reorder ─────────────────────────────────────── */
function ReorderList({ anggota, gender, onSave }) {
    const [list, setList] = useState([]);
    const [saving, setSaving] = useState(false);
    const [dragIdx, setDragIdx] = useState(null);

    useEffect(() => {
        setList(anggota?.filter(a => a.gender === gender).sort((a, b) => a.urutan - b.urutan) ?? []);
    }, [anggota, gender]);

    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver  = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const newList = [...list];
        const [moved] = newList.splice(dragIdx, 1);
        newList.splice(i, 0, moved);
        setList(newList);
        setDragIdx(i);
    };
    const handleDrop = () => setDragIdx(null);

    const handleSave = () => {
        setSaving(true);
        router.post("/admin/anggota/reorder", {
            gender,
            ordered: list.map(a => a.id),
        }, { onFinish: () => { setSaving(false); onSave?.(); } });
    };

    return (
        <div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {list.map((a, i) => (
                    <div key={a.id}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={handleDrop}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing select-none transition-all ${
                            dragIdx === i ? "border-[#003527] bg-emerald-50 shadow-md" : "border-emerald-100 bg-[#f9f9ff] hover:border-emerald-300"
                        }`}>
                        <span className="material-symbols-outlined text-[#bfc9c3] text-lg">drag_indicator</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#151c27] truncate">{a.nama}</p>
                            {i === 0 && <p className="text-[10px] text-[#52625c]">Primary Host</p>}
                        </div>
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#003527] text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    </div>
                ))}
            </div>
            <button onClick={handleSave} disabled={saving}
                className="w-full mt-4 py-3 border-2 border-[#003527] text-[#003527] font-bold rounded-xl hover:bg-[#003527] hover:text-white transition-all text-sm disabled:opacity-50">
                {saving ? "Menyimpan..." : "Save New Sequence"}
            </button>
        </div>
    );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function Pengajian({
    jadwalLaki, jadwalPerempuan,
    anggotaLaki, anggotaPerempuan,
    bulan,
}) {
    const [showModal, setShowModal]   = useState(false);
    const [editData, setEditData]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]     = useState(false);
    const [showAllLaki, setShowAllLaki]     = useState(false);
    const [showAllWanita, setShowAllWanita] = useState(false);
    const [reorderGender, setReorderGender] = useState("laki-laki");

    // Settings form
    const { data: cfg, setData: setCfg, post: saveCfg, processing: savingCfg } = useForm({
        waktu_laki:    "19:30",
        waktu_wanita:  "15:30",
        hari_laki:     "Kamis",
        hari_wanita:   "Jumat",
    });

    const allAnggota = [...(anggotaLaki ?? []), ...(anggotaPerempuan ?? [])];

    // Next session (soonest upcoming)
    const now = new Date();
    const allJadwal = [...(jadwalLaki ?? []), ...(jadwalPerempuan ?? [])];
    const upcoming  = allJadwal
        .filter(j => new Date(j.tanggal) >= now)
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    const nextSession = upcoming[0] ?? null;

    const totalAnggota = (anggotaLaki?.length ?? 0) + (anggotaPerempuan?.length ?? 0);

    const handleEdit  = (j) => { setEditData(j); setShowModal(true); };
    const handleClose = () => { setShowModal(false); setEditData(null); };
    const handleDelete = (j) => setDeleteTarget(j);
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/pengajian/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const handleGenerate = (jenis) => {
        const bulanNow = new Date().toISOString().slice(0, 7);
        router.post("/admin/pengajian/generate", { jenis, bulan: bulanNow });
    };

    const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    return (
        <AdminLayout title="Pengajian Schedules">
            <Head title="Pengajian" />

            <JadwalModal show={showModal} onClose={handleClose}
                anggotaList={allAnggota} editData={editData} />
            <DeleteConfirm show={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete} processing={deleting} />

            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[#003527]">Pengajian Schedules</h2>
                        <p className="text-sm text-[#52625c]">Manage rotations for Men's and Women's weekly religious studies.</p>
                    </div>
                    <button onClick={() => { setEditData(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-[#003527] hover:bg-[#0b513d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                        <span className="material-symbols-outlined text-base">add</span>
                        New Session
                    </button>
                </div>

                {/* ── Info Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Next Session */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-5 hover:-translate-y-0.5 transition-all shadow-sm">
                        <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-2">Next Session</p>
                        <p className="text-xl font-extrabold text-[#003527] leading-tight">
                            {nextSession
                                ? new Date(nextSession.tanggal).toLocaleDateString("id-ID", { weekday: "long" })
                                : "—"}
                        </p>
                        <p className="text-sm font-semibold text-[#003527]">
                            {nextSession ? new Date(nextSession.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "Belum ada"}
                        </p>
                        <p className="text-xs text-[#52625c] mt-1">
                            {nextSession?.jenis === "laki-laki" ? "Men's Rotation" : nextSession?.jenis === "perempuan" ? "Women's Rotation" : "—"}
                            {nextSession?.waktu ? ` • ${fmtWaktu(nextSession.waktu)} WIB` : ""}
                        </p>
                    </div>
                    {/* Current Host */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-5 hover:-translate-y-0.5 transition-all shadow-sm">
                        <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-2">Current Host</p>
                        <p className="text-xl font-extrabold text-[#003527] leading-tight break-words">
                            {nextSession?.anggota?.nama ?? "—"}
                        </p>
                        <p className="text-xs text-[#52625c] mt-1">{nextSession?.tempat ?? ""}</p>
                    </div>
                    {/* Total Members */}
                    <div className="bg-white border border-emerald-100 rounded-xl p-5 hover:-translate-y-0.5 transition-all shadow-sm">
                        <p className="text-[10px] font-bold text-[#52625c] uppercase tracking-wider mb-2">Total Members</p>
                        <p className="text-3xl font-extrabold text-[#003527]">{totalAnggota}</p>
                        <p className="text-xs text-[#52625c] mt-1">Combined Sessions</p>
                    </div>
                    {/* Print / Generate */}
                    <div className="bg-white border-2 border-dashed border-emerald-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#003527] transition-all cursor-pointer group"
                        onClick={() => handleGenerate("laki-laki")}>
                        <span className="material-symbols-outlined text-[#bfc9c3] group-hover:text-[#003527] text-3xl transition-colors">auto_schedule</span>
                        <p className="text-xs font-semibold text-[#52625c] group-hover:text-[#003527] text-center transition-colors">Generate Jadwal Bulan Ini</p>
                    </div>
                </div>

                {/* ── Schedule Tables ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <JadwalTable
                        jadwal={jadwalLaki ?? []}
                        gender="laki-laki"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showAll={showAllLaki}
                        onToggleAll={() => setShowAllLaki(!showAllLaki)}
                    />
                    <JadwalTable
                        jadwal={jadwalPerempuan ?? []}
                        gender="perempuan"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showAll={showAllWanita}
                        onToggleAll={() => setShowAllWanita(!showAllWanita)}
                    />
                </div>

                {/* ── Bottom Row: Reorder + Settings ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Reorder (col 2) */}
                    <div className="lg:col-span-2 bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-[#003527] mb-1">Edit Session Order</h4>
                        <p className="text-sm text-[#52625c] mb-4">Drag and drop members to reorder the hosting sequence.</p>
                        {/* Gender toggle */}
                        <div className="flex bg-[#f0f3ff] rounded-xl p-1 mb-4">
                            {[{ val: "laki-laki", label: "Bapak-Bapak" }, { val: "perempuan", label: "Ibu-Ibu" }].map(g => (
                                <button key={g.val} onClick={() => setReorderGender(g.val)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        reorderGender === g.val ? "bg-[#003527] text-white shadow-sm" : "text-[#52625c] hover:text-[#003527]"
                                    }`}>
                                    {g.label}
                                </button>
                            ))}
                        </div>
                        <ReorderList
                            anggota={[...(anggotaLaki ?? []), ...(anggotaPerempuan ?? [])]}
                            gender={reorderGender}
                        />
                    </div>

                    {/* Global Settings (col 3) */}
                    <div className="lg:col-span-3 bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-[#003527] mb-5">Global Schedule Settings</h4>
                        <div className="grid grid-cols-2 gap-5">
                            {/* Waktu Laki */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#52625c]">Default Starting Time (Men)</label>
                                <input type="time" value={cfg.waktu_laki}
                                    onChange={e => setCfg("waktu_laki", e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                            </div>
                            {/* Waktu Wanita */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#52625c]">Default Starting Time (Women)</label>
                                <input type="time" value={cfg.waktu_wanita}
                                    onChange={e => setCfg("waktu_wanita", e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all" />
                            </div>
                            {/* Hari Laki */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#52625c]">Default Day (Men)</label>
                                <select value={cfg.hari_laki} onChange={e => setCfg("hari_laki", e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all">
                                    {HARI_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                            {/* Hari Wanita */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#52625c]">Default Day (Women)</label>
                                <select value={cfg.hari_wanita} onChange={e => setCfg("hari_wanita", e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all">
                                    {HARI_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                            {/* Info */}
                            <div className="col-span-2">
                                <div className="flex items-start gap-3 p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                                    <span className="material-symbols-outlined text-[#003527] text-base mt-0.5 shrink-0">info</span>
                                    <p className="text-xs text-[#52625c] leading-relaxed">
                                        Changing global settings will reset any manual overrides for future weeks. Proceed with caution.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => { setCfg("waktu_laki", "19:30"); setCfg("waktu_wanita", "15:30"); setCfg("hari_laki", "Kamis"); setCfg("hari_wanita", "Jumat"); }}
                                className="px-5 py-2.5 border border-[#bfc9c3] text-[#52625c] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                Discard Changes
                            </button>
                            <button
                                onClick={() => handleGenerate("laki-laki")}
                                className="px-5 py-2.5 bg-[#003527] hover:bg-[#0b513d] text-white rounded-xl text-sm font-semibold transition-colors">
                                Apply Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}