import { Head, useForm, Link, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

// ── Animated geometric canvas ────────────────────────────────────────────────
function GeometricCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf, t = 0;

        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener("resize", resize);

        const drawStar = (cx, cy, r, points, angle, alpha) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = "#95d3ba";
            ctx.lineWidth = 0.5;
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const rad = i % 2 === 0 ? r : r * 0.45;
                const a = (Math.PI / points) * i;
                i === 0 ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad)
                    : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };

        const loop = () => {
            t++;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            const size = 60;
            const cols = Math.ceil(W / size) + 2;
            const rows = Math.ceil(H / size) + 2;
            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const x = col * size + (row % 2 === 0 ? 0 : size / 2);
                    const y = row * size * 0.866;
                    const wave = Math.sin(t * 0.008 + x * 0.015 + y * 0.012) * 0.5 + 0.5;
                    drawStar(x, y, size * 0.38, 6, t * 0.003 + row * 0.2, wave * 0.18 + 0.04);
                }
            }
            const cx = W * 0.5, cy = H * 0.5;
            for (let i = 0; i < 12; i++) {
                const a = (Math.PI * 2 / 12) * i + t * 0.001;
                const len = Math.min(W, H) * 0.42;
                const alpha = (Math.sin(t * 0.005 + i) * 0.5 + 0.5) * 0.06;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = "#b0f0d6";
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
                ctx.stroke();
                ctx.restore();
            }
            raf = requestAnimationFrame(loop);
        };
        loop();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Ornament SVG ─────────────────────────────────────────────────────────────
function Ornament({ className = "" }) {
    return (
        <svg viewBox="0 0 120 120" className={className} fill="none">
            <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="0.3" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                return <line key={i} x1={60 + Math.cos(a) * 42} y1={60 + Math.sin(a) * 42} x2={60 + Math.cos(a) * 55} y2={60 + Math.sin(a) * 55} stroke="currentColor" strokeWidth="0.8" />;
            })}
            <path d="M60 18 L67 42 L90 42 L72 56 L79 80 L60 66 L41 80 L48 56 L30 42 L53 42 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
        </svg>
    );
}

// ── Login Page ───────────────────────────────────────────────────────────────
export default function Login({ status }) {
    const [focused, setFocused] = useState(null);
    const [reveal, setReveal] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        login: "", password: "", remember: false,
    });

    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <>
            <Head title="Login — Admin Masjid" />
            <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

                {/* ── LEFT: Dekoratif ── */}
                <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #001a0f 0%, #003527 40%, #065f46 100%)" }}>
                    <GeometricCanvas />
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,21,13,0.7) 100%)" }} />

                    <div className={`relative z-10 text-center px-16 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <Ornament className="w-32 h-32 text-emerald-400/40 mx-auto mb-8" style={{ animation: "spin 30s linear infinite" }} />
                        <div className="text-emerald-300/30 text-5xl font-light mb-2">بِسْمِ اللّٰهِ</div>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent mx-auto my-6" />
                        <h1 className="text-white/90 text-4xl font-light tracking-widest mb-3" style={{ letterSpacing: "0.2em" }}>MASJID</h1>
                        <p className="text-emerald-300/60 text-sm tracking-widest uppercase font-light">Sistem Informasi & Manajemen</p>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent mx-auto my-6" />
                        <div className="flex justify-center gap-10 mt-8">
                            {["Transparan", "Amanah", "Berkah"].map((w, i) => (
                                <div key={w} className="flex flex-col items-center gap-2">
                                    <div className="w-px h-8 bg-gradient-to-b from-emerald-400/60 to-transparent" />
                                    <span className="text-emerald-300/50 text-xs tracking-widest uppercase">{w}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`absolute bottom-10 left-0 right-0 text-center px-16 transition-all duration-1000 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
                        <p className="text-emerald-400/30 text-xs italic">"Sesungguhnya yang memakmurkan masjid Allah hanyalah orang-orang yang beriman"</p>
                        <p className="text-emerald-500/20 text-xs mt-1">— QS. At-Taubah: 18</p>
                    </div>
                </div>

                {/* ── RIGHT: Form ── */}
                <div className="w-full lg:w-[45%] flex items-center justify-center relative" style={{ background: "#f9f9ff" }}>
                    <div className="absolute inset-0 opacity-[0.025]"
                        style={{ backgroundImage: "radial-gradient(#003527 0.5px, transparent 0.5px), radial-gradient(#003527 0.5px, #f9f9ff 0.5px)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }} />
                    <Ornament className="absolute top-6 right-6 w-24 h-24 text-emerald-200/50 pointer-events-none" />
                    <Ornament className="absolute bottom-6 left-6 w-16 h-16 text-emerald-200/30 pointer-events-none" />

                    <div className={`relative z-10 w-full max-w-sm px-8 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        {/* Header */}
                        <div className="mb-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[#003527] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7l-8 4-8-4v-7l8-4.32z" />
                                    </svg>
                                </div>
                                <div className="h-px w-8 bg-emerald-200" />
                                <span className="text-[#003527]/40 text-xs tracking-widest uppercase font-light">Admin</span>
                            </div>
                            <h2 className="text-3xl text-[#001a0f] mb-2" style={{ fontWeight: 300, letterSpacing: "0.05em" }}>
                                Selamat<br /><span className="font-semibold">Datang Kembali</span>
                            </h2>
                            <p className="text-[#52625c] text-sm">Masuk ke panel pengelola masjid</p>
                        </div>

                        {status && (
                            <div className="mb-6 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">{status}</div>
                        )}

                        <form onSubmit={submit} className="space-y-7">

                            {/* Username */}
                            <div className="relative pt-5">
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "login" || data.login ? "top-0 text-xs text-[#2b6954] tracking-wider" : "top-5 text-sm text-[#707974]"
                                    }`}>Username atau Email</label>
                                <input type="text" value={data.login} onChange={e => setData("login", e.target.value)}
                                    onFocus={() => setFocused("login")} onBlur={() => setFocused(null)}
                                    className="w-full bg-transparent border-0 border-b-2 py-2 text-[#151c27] text-sm focus:outline-none transition-colors duration-300"
                                    style={{ borderBottomColor: focused === "login" ? "#2b6954" : errors.login ? "#ef4444" : "#d1d5db" }}
                                    autoComplete="username" />
                                {errors.login && <p className="mt-1.5 text-red-500 text-xs">{errors.login}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative pt-5">
                                <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === "password" || data.password ? "top-0 text-xs text-[#2b6954] tracking-wider" : "top-5 text-sm text-[#707974]"
                                    }`}>Password</label>
                                <input type={reveal ? "text" : "password"} value={data.password}
                                    onChange={e => setData("password", e.target.value)}
                                    onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                                    className="w-full bg-transparent border-0 border-b-2 py-2 pr-8 text-[#151c27] text-sm focus:outline-none transition-colors duration-300"
                                    style={{ borderBottomColor: focused === "password" ? "#2b6954" : errors.password ? "#ef4444" : "#d1d5db" }}
                                    autoComplete="current-password" />
                                <button type="button" onClick={() => setReveal(!reveal)} tabIndex={-1}
                                    className="absolute right-0 top-5 text-[#707974] hover:text-[#003527] transition-colors">
                                    {reveal ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                                {errors.password && <p className="mt-1.5 text-red-500 text-xs">{errors.password}</p>}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setData("remember", !data.remember)}>
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${data.remember ? "bg-[#003527] border-[#003527]" : "border-gray-300 group-hover:border-[#2b6954]"}`}>
                                        {data.remember && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className="text-xs text-[#52625c]">Ingat saya</span>
                                </label>
                                <a href="#" className="text-xs text-[#2b6954] hover:text-[#003527] transition-colors">Lupa password?</a>
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <button type="submit" disabled={processing}
                                    className="group relative w-full overflow-hidden rounded-xl">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#003527] via-[#065f46] to-[#003527] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-[#003527] rounded-xl text-white text-sm tracking-widest uppercase font-light transition-colors duration-300">
                                        {processing ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            <>
                                                Masuk
                                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                            <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#52625c] hover:text-[#003527] transition-colors tracking-wide">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}