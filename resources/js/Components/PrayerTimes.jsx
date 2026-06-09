import { useState, useEffect } from "react";

// ─── Algoritma Hisab Waktu Sholat ─────────────────────────────────────────────
// Referensi: Prayer Times Calculator (Praytimes.org) + KEMENAG Indonesia
// Metode: Kementerian Agama RI
//   Fajr: 20°, Isha: 18°, Ashar: Syafi'i (faktor 1)

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;
const fixAngle = (a) => a - 360 * Math.floor(a / 360);
const fixHour = (a) => a - 24 * Math.floor(a / 24);

function julianDate(year, month, day) {
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g)));
    const e = 23.439 - 0.00000036 * D;
    const RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15;
    const eqt = q / 15 - fixHour(RA);
    const decl = toDeg(Math.asin(Math.sin(toRad(e)) * Math.sin(toRad(L))));
    return { decl, eqt };
}

function computeTimes(date, lat, lng, timezone) {
    const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const { decl, eqt } = sunPosition(jd);

    const midday = fixHour(12 - eqt - (lng / 15 - timezone));

    const sunAngleTime = (angle, direction = 1) => {
        const cosVal = (-Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl))) /
            (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));
        if (Math.abs(cosVal) > 1) return NaN;
        return midday + direction * (toDeg(Math.acos(cosVal)) / 15);
    };

    // Ashar: faktor 1 = Syafi'i
    const asharAngle = toDeg(Math.atan(1 / (1 + Math.tan(toRad(Math.abs(lat - decl))))));

    const fajr    = sunAngleTime(20, -1);   // Kemenag: 20°
    const sunrise = sunAngleTime(0.833, -1);
    const dhuhr   = midday + 0.0167;         // +1 menit
    const ashar   = midday + toDeg(Math.acos(
        (Math.sin(toRad(asharAngle)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl))) /
        (Math.cos(toRad(lat)) * Math.cos(toRad(decl)))
    )) / 15;
    const maghrib = sunAngleTime(0.833);
    const isha    = sunAngleTime(18);        // Kemenag: 18°

    const fmt = (h) => {
        if (isNaN(h)) return "--:--";
        const total = fixHour(h);
        const hh = Math.floor(total);
        const mm = Math.round((total - hh) * 60);
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };

    return { fajr, sunrise, dhuhr, ashar, maghrib, isha, fmt };
}

// ─── Hook utama ───────────────────────────────────────────────────────────────
export function usePrayerTimes(lat = -6.8015, lng = 110.9213, timezone = 7) {
    // Default: Kudus, Jawa Tengah (WIB)
    const [times, setTimes]     = useState(null);
    const [next, setNext]       = useState(null);
    const [clock, setClock]     = useState("");

    useEffect(() => {
        const calculate = () => {
            const now  = new Date();
            const { fajr, sunrise, dhuhr, ashar, maghrib, isha, fmt } = computeTimes(now, lat, lng, timezone);

            const sholat = [
                { name: "Subuh",   time: fajr,    label: fmt(fajr) },
                { name: "Syuruq",  time: sunrise, label: fmt(sunrise) },
                { name: "Dzuhur",  time: dhuhr,   label: fmt(dhuhr) },
                { name: "Ashar",   time: ashar,   label: fmt(ashar) },
                { name: "Maghrib", time: maghrib, label: fmt(maghrib) },
                { name: "Isya",    time: isha,     label: fmt(isha) },
            ];

            // Jam sekarang dalam desimal (misal 13.5 = 13:30)
            const nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

            // Cari waktu sholat berikutnya
            let nextPrayer = sholat.find((s) => !isNaN(s.time) && s.time > nowH);
            if (!nextPrayer) nextPrayer = sholat[0]; // lewat Isya → besok Subuh

            setTimes(sholat);
            setNext(nextPrayer);
            setClock(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        };

        calculate();
        const id = setInterval(calculate, 1000);
        return () => clearInterval(id);
    }, [lat, lng, timezone]);

    return { times, next, clock };
}

// ─── Komponen QuickInfo (dipakai di Hero) ─────────────────────────────────────
export function NextPrayerBadge({ lat, lng, timezone }) {
    const { next, clock } = usePrayerTimes(lat, lng, timezone);

    return (
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-2xl px-7 py-5 flex gap-8">
            {/* Jam saat ini */}
            <div className="flex items-center gap-3">
                <span className="text-[#003527]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                </span>
                <div>
                    <p className="text-xs text-gray-400 font-medium">Waktu Sekarang</p>
                    <p className="font-bold text-[#003527] text-sm tabular-nums">{clock || "--:--:--"}</p>
                </div>
            </div>
            {/* Sholat berikutnya */}
            <div className="flex items-center gap-3">
                <span className="text-[#D97706]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3" />
                        <circle cx="12" cy="12" r="4" />
                    </svg>
                </span>
                <div>
                    <p className="text-xs text-gray-400 font-medium">Sholat Berikutnya</p>
                    <p className="font-bold text-[#003527] text-sm">
                        {next ? `${next.name} ${next.label}` : "--:--"}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Komponen Jadwal Sholat Lengkap ───────────────────────────────────────────
export function PrayerSchedule({ lat, lng, timezone }) {
    const { times, next } = usePrayerTimes(lat, lng, timezone);

    if (!times) return null;

    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {times.map((s) => {
                const isNext = next?.name === s.name;
                return (
                    <div
                        key={s.name}
                        className={`rounded-xl p-3 text-center border transition-all ${
                            isNext
                                ? "bg-[#003527] text-white border-[#003527] shadow-lg"
                                : "bg-white text-[#404944] border-emerald-100"
                        }`}
                    >
                        <p className={`text-xs font-semibold mb-1 ${isNext ? "text-emerald-300" : "text-[#52625c]"}`}>
                            {s.name}
                        </p>
                        <p className={`text-sm font-bold tabular-nums ${isNext ? "text-white" : "text-[#003527]"}`}>
                            {s.label}
                        </p>
                        {isNext && (
                            <p className="text-[10px] text-emerald-300 mt-0.5 font-medium">Berikutnya</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}