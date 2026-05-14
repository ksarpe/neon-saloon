"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Brain, Heart, Zap, Star, Tv } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Quiz o Pannie Młodej",
    desc: "Kto zna ją najlepiej? Odpowiadajcie jednocześnie i sprawdźcie, która zna pannę młodą od podszewki.",
    color: "var(--neon-pink)",
    border: "rgba(221,84,162,0.35)",
    bg: "rgba(221,84,162,0.07)",
  },
  {
    icon: Heart,
    title: "Nigdy przenigdy",
    desc: "Karty z wyznaniami i sekretami. Podniesione ręce, czerwone twarze, niezapomniane wieczory.",
    color: "var(--sheriff-gold)",
    border: "rgba(249,74,255,0.35)",
    bg: "rgba(249,74,255,0.07)",
  },
  {
    icon: Zap,
    title: "Na żywo, w czasie rzeczywistym",
    desc: "Każda uczestniczka gra na swoim telefonie. Host widzi wszystko na dużym ekranie.",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.35)",
    bg: "rgba(167,139,250,0.07)",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Host otwiera salon",
    desc: "Jeden ekran na TV lub laptopie — wchodzi na /graj i klika Chcę być szeryfem.",
    color: "var(--sheriff-gold)",
  },
  {
    step: "02",
    title: "Uczestniczki skanują",
    desc: "Każda wchodzi na stronę na telefonie, wpisuje PIN wyświetlony przez hosta.",
    color: "var(--neon-pink)",
  },
  {
    step: "03",
    title: "Chaos i śmiech gwarantowane",
    desc: "Host przełącza karty, wyniki lecą na żywo. Rywalizujcie, wyznawajcie, śmiejcie się.",
    color: "#a78bfa",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative w-full overflow-x-hidden">
      {/* ── Ambient glows ────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.1,
          }}
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative z-[10] min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(3.5rem,14vw,9rem)] leading-[0.9] tracking-widest shimmer-text"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
        >
          Last Rodeo
          <br />
          Andżeliki
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-base leading-relaxed"
          style={{ color: "rgba(240,223,192,0.7)" }}
        >
          Kahoot na dzikim zachodzie. Trivia, wyznania i czyste szaleństwo — na
          żywo, dla całej ekipy.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/graj")}
            className="relative overflow-hidden group flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white text-base"
            style={{
              background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
              boxShadow: "0 4px 40px rgba(221,84,162,0.55)",
              fontFamily: "var(--font-bebas), 'Bebas Neue', cursive",
              fontSize: "1.15rem",
              letterSpacing: "0.12em",
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
            <span className="relative z-10">Zagrajcie teraz</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/graj/join")}
            className="relative overflow-hidden group flex items-center justify-center gap-2 py-4 px-5 rounded-2xl border-2 text-sm font-semibold"
            style={{
              borderColor: "rgba(255,220,180,0.25)",
              backgroundColor: "rgba(255,220,180,0.05)",
              color: "rgba(255,220,180,0.85)",
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
            <span className="relative z-10">Dołącz z kodem</span>
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ color: "rgba(255,220,180,0.3)" }}
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight size={14} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="relative z-[10] px-6 py-24 flex flex-col items-center gap-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-5xl sm:text-6xl tracking-widest shimmer-text"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            Jak to działa?
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "rgba(240,223,192,0.5)" }}
          >
            Trzy kroki do pełnego chaosu.
          </p>
        </motion.div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col gap-4 p-6 rounded-2xl border"
              style={{
                borderColor: "rgba(255,220,180,0.1)",
                backgroundColor: "rgba(13,8,24,0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', cursive",
                  color: item.color,
                  opacity: 0.9,
                }}
              >
                {item.step}
              </span>
              <div>
                <p
                  className="font-bold text-base mb-1"
                  style={{ color: item.color }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(240,223,192,0.55)" }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="relative z-[10] px-6 py-16 flex flex-col items-center gap-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-5xl sm:text-6xl tracking-widest shimmer-text"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            Tryby gry
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "rgba(240,223,192,0.5)" }}
          >
            Każda runda inna, każda niezapomniana.
          </p>
        </motion.div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all duration-300"
              style={{
                borderColor: f.border,
                backgroundColor: f.bg,
              }}
            >
              <f.icon size={30} style={{ color: f.color }} />
              <div>
                <p
                  className="font-bold text-base mb-1.5"
                  style={{ color: f.color }}
                >
                  {f.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(240,223,192,0.55)" }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="relative z-[10] px-6 py-32 flex flex-col items-center gap-8 text-center">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(221,84,162,0.12) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            backgroundColor: "rgba(221,84,162,0.1)",
            border: "2px solid rgba(221,84,162,0.3)",
            boxShadow: "0 0 40px rgba(221,84,162,0.2)",
          }}
        >
          <Tv size={36} style={{ color: "var(--neon-pink)" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl tracking-widest shimmer-text"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
        >
          Gotowe na
          <br />
          Wielki Finał?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-sm text-sm leading-relaxed"
          style={{ color: "rgba(240,223,192,0.6)" }}
        >
          Zaproście uczestniczki, podłączcie TV i niech się zacznie ostatnie
          wielkie rodeo Andżeliki.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => router.push("/graj")}
          className="relative overflow-hidden group flex items-center gap-3 py-5 px-10 rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
            boxShadow: "0 6px 50px rgba(221,84,162,0.6)",
            fontFamily: "var(--font-bebas), 'Bebas Neue', cursive",
            fontSize: "1.3rem",
            letterSpacing: "0.15em",
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
          <span className="relative z-10">Wejdź do salonu</span>
        </motion.button>
      </section>

      {/* bottom padding for global footer */}
      <div className="h-16" />
    </main>
  );
}
