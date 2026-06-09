import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

const NAV = [
    { href: "admin.dashboard", label: "Dashboard",  icon: "dashboard" },
    { href: "admin.kas.index",      label: "Kas",        icon: "payments" },
    { href: "admin.anggota.index",  label: "Anggota",    icon: "group" },
    { href: "admin.pengajian.index",label: "Pengajian",  icon: "menu_book" },
    { href: "admin.kegiatan.index", label: "Kegiatan",   icon: "event" },
    { href: "admin.qurban.index",   label: "Qurban",     icon: "cruelty_free" },
    { href: "admin.sedekah.index",  label: "Sedekah",    icon: "volunteer_activism" },
];

export default function AdminLayout({ children, title = "Dashboard" }) {
    const { auth, masjid, flash } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentRoute = route().current();

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const isActive = (href) => {
        try { return route().current(href.replace(".index", ".*")) || route().current(href); }
        catch { return false; }
    };

    const Sidebar = () => (
        <aside className="flex flex-col h-full bg-[#f0f3ff] border-r border-[#bfc9c3] p-4">
            {/* Brand */}
            <div className="mb-8 px-3">
                <h1 className="text-lg font-extrabold text-[#003527] leading-tight">Admin Panel</h1>
                <p className="text-xs text-[#52625c] mt-0.5">{masjid?.nama_masjid || "Al-Hikmah Mosque"}</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                active
                                    ? "bg-[#064e3b] text-[#80bea6] translate-x-1 shadow-sm"
                                    : "text-[#404944] hover:bg-[#d3e3dc]/50 hover:text-[#003527]"
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="pt-4 border-t border-[#bfc9c3] space-y-1">
                <Link
                    href={route("admin.admin.settings")} // Updated
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#404944] hover:bg-[#d3e3dc]/50 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">settings</span>
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 bg-[#003527] hover:bg-[#0b513d] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen flex font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-full w-[240px] z-50">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="w-[240px] h-full shadow-xl">
                        <Sidebar />
                    </div>
                    <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* Main */}
            <main className="lg:ml-[240px] flex-1 flex flex-col min-h-screen"
                style={{
                    backgroundColor: "#ECFDF5",
                    backgroundImage: "radial-gradient(circle, rgba(43,105,84,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}>

                {/* Topbar */}
                <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-[#52625c] hover:bg-emerald-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-[#003527]">{title}</h2>
                            <p className="text-xs text-[#52625c]">
                                Welcome back, {auth?.user?.name || "Admin"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-emerald-50 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined text-[#52625c] text-xl">notifications</span>
                        </button>
                        <div className="flex items-center gap-2.5 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100">
                            <div className="w-8 h-8 rounded-full bg-[#003527] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                {auth?.user?.avatar_url ? (
                                    <img src={auth.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    auth?.user?.name?.charAt(0) || "A"
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-[#003527] leading-tight">{auth?.user?.name || "Admin"}</p>
                                <p className="text-[10px] text-[#52625c]">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {flash.error}
                    </div>
                )}

                {/* Page content */}
                <div className="flex-1 p-6">
                    {children}
                </div>

                {/* Footer */}
                <footer className="border-t border-[#bfc9c3] bg-[#e7eefe] py-4 px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div>
                            <p className="text-sm font-bold text-[#003527]">{masjid?.nama_masjid || "Al-Hikmah Mosque"}</p>
                            <p className="text-xs text-[#52625c]">© {new Date().getFullYear()} Mosque Management. All rights reserved.</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-xs text-[#52625c] hover:text-[#003527] transition-colors">Facebook</a>
                            <a href="#" className="text-xs text-[#52625c] hover:text-[#003527] transition-colors">Instagram</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}