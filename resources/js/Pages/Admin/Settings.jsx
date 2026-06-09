import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

/* ── Section Wrapper ─────────────────────────────────────────── */
function Section({ icon, title, desc, children }) {
    return (
        <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-emerald-100 bg-emerald-50/40 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#003527] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-300 text-base">{icon}</span>
                </div>
                <div>
                    <h3 className="font-bold text-[#003527] text-base">{title}</h3>
                    {desc && <p className="text-xs text-[#52625c]">{desc}</p>}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

/* ── Input Field ─────────────────────────────────────────────── */
function Field({ label, optional, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#404944]">
                {label}{" "}
                {optional && <span className="text-[#707974] font-normal">(opsional)</span>}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-emerald-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm transition-all bg-white";

/* ── Success Toast ───────────────────────────────────────────── */
function Toast({ msg, onClose }) {
    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [msg]);
    if (!msg) return null;
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#003527] text-white px-5 py-3.5 rounded-xl shadow-xl animate-fade-in">
            <span className="material-symbols-outlined text-emerald-300">check_circle</span>
            <p className="text-sm font-semibold">{msg}</p>
            <button onClick={onClose} className="ml-2 text-emerald-300 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-base">close</span>
            </button>
        </div>
    );
}

/* ── Main Settings Page ──────────────────────────────────────── */
export default function Settings({ auth, masjid, pengurus: pengurusList }) {
    const [toast, setToast] = useState("");
    const [activeTab, setActiveTab] = useState("profil");
    const [avatarPreview, setAvatarPreview] = useState(auth?.user?.avatar_url ?? null);
    const [logoPreview, setLogoPreview] = useState(masjid?.logo_url ?? null);
    const [fotoPreview, setFotoPreview] = useState(masjid?.foto_masjid_url ?? null);

    // ── Form: Profil Admin ──
    const profil = useForm({
        name: auth?.user?.name ?? "",
        email: auth?.user?.email ?? "",
        avatar: null,
    });

    // ── Form: Password ──
    const password = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [showPw, setShowPw] = useState({ cur: false, new: false, cfm: false });

    // ── Form: Profil Masjid ──
    const mosque = useForm({
        nama_masjid: masjid?.nama_masjid ?? "",
        alamat: masjid?.alamat ?? "",
        kota: masjid?.kota ?? "",
        provinsi: masjid?.provinsi ?? "",
        deskripsi: masjid?.deskripsi ?? "",
        tahun_berdiri: masjid?.tahun_berdiri ?? "",
        telepon: masjid?.telepon ?? "",
        email: masjid?.email ?? "",
        logo: null,
        foto_masjid: null,
    });

    const handleProfilSubmit = (e) => {
        e.preventDefault();
        profil.post("/profile", {
            forceFormData: true,
            _method: "PUT",
            onSuccess: () => setToast("Profil admin berhasil diperbarui."),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        password.put("/profile/password", {
            onSuccess: () => {
                password.reset();
                setShowPw({ cur: false, new: false, cfm: false });
                setToast("Password berhasil diperbarui.");
            },
        });
    };

    const handleMosqueSubmit = (e) => {
        e.preventDefault();
        mosque.post("/admin/settings/mosque", {
            forceFormData: true,
            _method: "PUT",
            onSuccess: () => setToast("Profil masjid berhasil diperbarui."),
        });
    };

    const TABS = [
        { id: "profil", label: "Profil Admin", icon: "manage_accounts" },
        { id: "masjid", label: "Profil Masjid", icon: "mosque" },
        { id: "keamanan", label: "Keamanan", icon: "lock" },
    ];

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan" />
            <Toast msg={toast} onClose={() => setToast("")} />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-[#003527]">Pengaturan</h2>
                    <p className="text-sm text-[#52625c]">Kelola profil, masjid, dan keamanan akun.</p>
                </div>

                {/* Tab nav */}
                <div className="flex bg-white border border-emerald-100 rounded-xl p-1 gap-1 shadow-sm w-fit">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id
                                ? "bg-[#003527] text-white shadow-sm"
                                : "text-[#52625c] hover:text-[#003527] hover:bg-emerald-50"
                                }`}>
                            <span className="material-symbols-outlined text-base">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: Profil Admin ── */}
                {activeTab === "profil" && (
                    <form onSubmit={handleProfilSubmit}>
                        <Section icon="manage_accounts" title="Profil Admin"
                            desc="Informasi akun yang digunakan untuk login.">
                            <div className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-200 bg-[#b0f0d6] flex items-center justify-center">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-[#003527]">
                                                    {auth?.user?.name?.charAt(0) ?? "A"}
                                                </span>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#003527] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0b513d] transition-colors shadow-md">
                                            <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files[0];
                                                    if (f) {
                                                        profil.setData("avatar", f);
                                                        setAvatarPreview(URL.createObjectURL(f));
                                                    }
                                                }} />
                                        </label>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#003527]">{auth?.user?.name}</p>
                                        <p className="text-sm text-[#52625c]">Super Admin</p>
                                        <p className="text-xs text-[#707974] mt-0.5">JPG, PNG • Maks 2MB</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Nama Lengkap" error={profil.errors.name}>
                                        <input type="text" value={profil.data.name}
                                            onChange={e => profil.setData("name", e.target.value)}
                                            className={inputCls} placeholder="Nama lengkap" />
                                    </Field>
                                    <Field label="Email" error={profil.errors.email}>
                                        <input type="email" value={profil.data.email}
                                            onChange={e => profil.setData("email", e.target.value)}
                                            className={inputCls} placeholder="email@example.com" />
                                    </Field>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={profil.processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#003527] hover:bg-[#0b513d] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">
                                        <span className="material-symbols-outlined text-base">save</span>
                                        {profil.processing ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </div>
                        </Section>
                    </form>
                )}

                {/* ── TAB: Profil Masjid ── */}
                {activeTab === "masjid" && (
                    <form onSubmit={handleMosqueSubmit}>
                        <div className="space-y-5">
                            <Section icon="mosque" title="Identitas Masjid"
                                desc="Informasi dasar masjid yang ditampilkan di halaman publik.">
                                <div className="space-y-4">
                                    <Field label="Nama Masjid" error={mosque.errors.nama_masjid}>
                                        <input type="text" value={mosque.data.nama_masjid}
                                            onChange={e => mosque.setData("nama_masjid", e.target.value)}
                                            className={inputCls} placeholder="Contoh: Masjid Al-Ikhlas" />
                                    </Field>
                                    <Field label="Deskripsi" optional error={mosque.errors.deskripsi}>
                                        <textarea value={mosque.data.deskripsi}
                                            onChange={e => mosque.setData("deskripsi", e.target.value)}
                                            rows={3} className={`${inputCls} resize-none`}
                                            placeholder="Deskripsi singkat tentang masjid..." />
                                    </Field>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Alamat" optional error={mosque.errors.alamat}>
                                            <input type="text" value={mosque.data.alamat}
                                                onChange={e => mosque.setData("alamat", e.target.value)}
                                                className={inputCls} placeholder="Jl. Contoh No. 1" />
                                        </Field>
                                        <Field label="Tahun Berdiri" optional error={mosque.errors.tahun_berdiri}>
                                            <input type="text" value={mosque.data.tahun_berdiri}
                                                onChange={e => mosque.setData("tahun_berdiri", e.target.value)}
                                                className={inputCls} placeholder="Contoh: 1985" />
                                        </Field>
                                        <Field label="Kota" optional error={mosque.errors.kota}>
                                            <input type="text" value={mosque.data.kota}
                                                onChange={e => mosque.setData("kota", e.target.value)}
                                                className={inputCls} placeholder="Contoh: Kudus" />
                                        </Field>
                                        <Field label="Provinsi" optional error={mosque.errors.provinsi}>
                                            <input type="text" value={mosque.data.provinsi}
                                                onChange={e => mosque.setData("provinsi", e.target.value)}
                                                className={inputCls} placeholder="Contoh: Jawa Tengah" />
                                        </Field>
                                        <Field label="Telepon" optional error={mosque.errors.telepon}>
                                            <input type="text" value={mosque.data.telepon}
                                                onChange={e => mosque.setData("telepon", e.target.value)}
                                                className={inputCls} placeholder="0812-3456-7890" />
                                        </Field>
                                        <Field label="Email" optional error={mosque.errors.email}>
                                            <input type="email" value={mosque.data.email}
                                                onChange={e => mosque.setData("email", e.target.value)}
                                                className={inputCls} placeholder="masjid@example.com" />
                                        </Field>
                                    </div>
                                </div>
                            </Section>

                            <Section icon="image" title="Logo & Foto Masjid"
                                desc="Gambar yang ditampilkan di halaman publik.">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Logo */}
                                    <div>
                                        <p className="text-sm font-medium text-[#404944] mb-2">Logo Masjid</p>
                                        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-emerald-200 rounded-xl p-5 cursor-pointer hover:border-[#003527] transition-colors bg-[#f9f9ff]">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="h-24 object-contain rounded-lg" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-4xl text-emerald-300">add_photo_alternate</span>
                                                    <span className="text-xs text-[#52625c] text-center">Klik untuk upload logo<br /><span className="text-[#707974]">PNG, JPG • Maks 2MB</span></span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files[0];
                                                    if (f) { mosque.setData("logo", f); setLogoPreview(URL.createObjectURL(f)); }
                                                }} />
                                        </label>
                                        {logoPreview && (
                                            <button type="button" onClick={() => { mosque.setData("logo", null); setLogoPreview(null); }}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors w-full text-center">
                                                Hapus logo
                                            </button>
                                        )}
                                    </div>
                                    {/* Foto masjid */}
                                    <div>
                                        <p className="text-sm font-medium text-[#404944] mb-2">Foto Masjid (Hero)</p>
                                        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-emerald-200 rounded-xl p-5 cursor-pointer hover:border-[#003527] transition-colors bg-[#f9f9ff]">
                                            {fotoPreview ? (
                                                <img src={fotoPreview} alt="Foto" className="h-24 w-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-4xl text-emerald-300">add_photo_alternate</span>
                                                    <span className="text-xs text-[#52625c] text-center">Klik untuk upload foto<br /><span className="text-[#707974]">PNG, JPG • Maks 2MB</span></span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files[0];
                                                    if (f) { mosque.setData("foto_masjid", f); setFotoPreview(URL.createObjectURL(f)); }
                                                }} />
                                        </label>
                                        {fotoPreview && (
                                            <button type="button" onClick={() => { mosque.setData("foto_masjid", null); setFotoPreview(null); }}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors w-full text-center">
                                                Hapus foto
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Section>

                            <div className="flex justify-end">
                                <button type="submit" disabled={mosque.processing}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#003527] hover:bg-[#0b513d] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors">
                                    <span className="material-symbols-outlined text-base">save</span>
                                    {mosque.processing ? "Menyimpan..." : "Simpan Profil Masjid"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* ── TAB: Keamanan ── */}
                {activeTab === "keamanan" && (
                    <div className="space-y-5">
                        {/* Ubah Password + Informasi Akun — side by side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                            {/* Kolom kiri: Ubah Password */}
                            <form onSubmit={handlePasswordSubmit}>
                                <Section icon="lock" title="Ubah Password"
                                    desc="Gunakan password yang kuat dan unik.">
                                    <div className="space-y-4">
                                        {[
                                            { key: "cur", field: "current_password", label: "Password Saat Ini", show: showPw.cur },
                                            { key: "new", field: "password", label: "Password Baru", show: showPw.new },
                                            { key: "cfm", field: "password_confirmation", label: "Konfirmasi Password Baru", show: showPw.cfm },
                                        ].map(item => (
                                            <Field key={item.key} label={item.label} error={password.errors[item.field]}>
                                                <div className="relative">
                                                    <input
                                                        type={item.show ? "text" : "password"}
                                                        value={password.data[item.field]}
                                                        onChange={e => password.setData(item.field, e.target.value)}
                                                        className={`${inputCls} pr-10`}
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button"
                                                        onClick={() => setShowPw(p => ({ ...p, [item.key]: !p[item.key] }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#003527] transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {item.show ? "visibility_off" : "visibility"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </Field>
                                        ))}

                                        <button type="submit" disabled={password.processing}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#003527] hover:bg-[#0b513d] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors mt-2">
                                            <span className="material-symbols-outlined text-base">lock_reset</span>
                                            {password.processing ? "Memperbarui..." : "Perbarui Password"}
                                        </button>
                                    </div>
                                </Section>
                            </form>

                            {/* Kolom kanan: Informasi Akun */}
                            <Section icon="info" title="Informasi Akun"
                                desc="Detail akun yang sedang aktif.">
                                <div className="space-y-3">
                                    {[
                                        { label: "Username", value: auth?.user?.username ?? "-" },
                                        { label: "Email", value: auth?.user?.email ?? "-" },
                                        { label: "Role", value: "Super Admin" },
                                        { label: "Status", value: "Aktif", green: true },
                                    ].map(row => (
                                        <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-emerald-50 last:border-0">
                                            <span className="text-sm text-[#52625c]">{row.label}</span>
                                            <span className={`text-sm font-semibold ${row.green ? "text-emerald-600" : "text-[#151c27]"}`}>
                                                {row.green && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 mb-0.5" />}
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>

                        {/* Danger zone — full width di bawah */}
                        <Section icon="warning" title="Danger Zone"
                            desc="Tindakan yang tidak dapat dibatalkan.">
                            <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50/50 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-red-700">Logout dari semua sesi</p>
                                    <p className="text-xs text-red-500 mt-0.5">Keluar dari semua perangkat yang aktif.</p>
                                </div>
                                <button
                                    onClick={() => router.post("/logout")}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
                                    Logout
                                </button>
                            </div>
                        </Section>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease; }
            `}</style>
        </AdminLayout>
    );
}