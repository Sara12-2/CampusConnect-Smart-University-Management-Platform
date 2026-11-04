"use client";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  GraduationCap, Target, Users, Sparkles, ShieldCheck, BookOpen,
  Zap, Heart, Compass, Rocket, Code2, Database, Layers,
  ArrowRight, GitBranch, Globe, Link2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/* ============================================================
   DATA
   ============================================================ */

const values = [
  {
    icon: Target,
    title: "Centralized",
    desc: "All university services on a single, unified platform.",
    accent: false,
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Notice summaries that you understand in seconds.",
    accent: true,
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    desc: "Role-based access and admin-verified claims.",
    accent: false,
  },
  {
    icon: Users,
    title: "Student-First",
    desc: "Simple, fast, and clear interface built for students.",
    accent: true,
  },
];

const team = [
  {
    name: "Sara Manzoor",
    role: "Project Lead",
    id: "UL-BSCSM-A-24-01",
    icon: Compass,
    accent: false,
  },
  {
    name: "Muhammad Abubakar Nadeem",
    role: "Backend Developer",
    id: "UL-BSCSM-A-24-46",
    icon: Database,
    accent: true,
  },
  {
    name: "Muhammad Abdullah",
    role: "Frontend Developer",
    id: "UL-BSCSM-A-24-43",
    icon: Code2,
    accent: false,
  },
  {
    name: "Muhammad Umair Akram",
    role: "Database & Testing",
    id: "UL-BSCSM-A-24-26",
    icon: Layers,
    accent: true,
  },
];

const stats = [
  { value: "3", label: "Core Modules", icon: Layers, accent: false },
  { value: "AI", label: "Powered", icon: Sparkles, accent: true },
  { value: "2", label: "User Roles", icon: Users, accent: false },
  { value: "24/7", label: "Availability", icon: Zap, accent: true },
];

const milestones = [
  {
    year: "Phase 1",
    title: "Idea & Research",
    desc: "Identified real campus problems — missed notices, untracked complaints, lost items.",
    icon: BookOpen,
  },
  {
    year: "Phase 2",
    title: "Design & Build",
    desc: "Designed the platform with a student-first approach, built on modern tech.",
    icon: Code2,
  },
  {
    year: "Phase 3",
    title: "AI Integration",
    desc: "Integrated AI-powered notice summarization for quick comprehension.",
    icon: Sparkles,
  },
  {
    year: "Phase 4",
    title: "Launch & Iterate",
    desc: "Ready for universities — continuously improving with feedback.",
    icon: Rocket,
  },
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ============================================================
   FLOATING BLOBS
   ============================================================ */

function FloatingBlobs({ variant = "green" }: { variant?: "green" | "orange" }) {
  const color = variant === "green" ? "#227736" : "#E67E22";
  return (
    <>
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}20, transparent 70%)`,
          width: 400,
          height: 400,
          top: "10%",
          left: "-10%",
        }}
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}15, transparent 70%)`,
          width: 500,
          height: 500,
          bottom: "10%",
          right: "-15%",
        }}
      />
    </>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 80]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#0f1d17] overflow-x-hidden">

        {/* ==================== HERO ==================== */}
        <section
          ref={heroRef}
          className="relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] text-white overflow-hidden"
        >
          {/* Mesh pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Animated orange glow */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#E67E22]/40 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#28a745]/40 blur-3xl pointer-events-none"
          />

          {/* Floating sparkle dots */}
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              className={`absolute rounded-full shadow-lg ${
                i % 2 === 0 ? "bg-[#E67E22] shadow-[#E67E22]/50" : "bg-white shadow-white/50"
              }`}
              style={{
                width: i % 3 === 0 ? 8 : 5,
                height: i % 3 === 0 ? 8 : 5,
                top: `${15 + i * 12}%`,
                left: `${10 + i * 15}%`,
              }}
            />
          ))}

          {/* Decorative icon */}
          <GraduationCap
            size={220}
            strokeWidth={0.6}
            className="absolute -bottom-12 -right-6 text-white/[0.05] pointer-events-none select-none"
          />

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="relative max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28 text-center"
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-3xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                variants={item}
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6 cursor-default transition-colors hover:bg-white/15"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                  About Us
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={item}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em]"
              >
                About{" "}
                <span className="relative inline-block">
                  <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="bg-gradient-to-r from-white via-[#E67E22] to-white bg-clip-text text-transparent"
                    style={{
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                    }}
                  >
                    CampusConnect
                  </motion.span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] as const }}
                    className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[#E67E22] to-transparent rounded-full"
                  />
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={item}
                className="mt-6 text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto"
              >
                A smart university management and student services platform
                that brings notices, complaints, and Lost & Found together in
                one place.
              </motion.p>

              {/* Trust row */}
              <motion.div
                variants={item}
                className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm"
              >
                {["Built for universities", "AI-powered", "Student-first"].map((label, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="flex items-center gap-2 text-white/85 cursor-default"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
                    />
                    <span className="font-medium">{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 pointer-events-none"
          >
            <motion.span
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
            />
          </motion.div>
        </section>

        {/* ==================== MISSION ==================== */}
        <section className="relative py-20 md:py-24 bg-white overflow-hidden">
          <FloatingBlobs variant="green" />

          <div className="relative max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 items-start"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-4 cursor-default"
                >
                  <BookOpen size={12} className="text-[#227736]" />
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                    Our Mission
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                  Making campus life
                  <br />
                  <span className="text-[#227736]">simpler and smarter.</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ y: -4 }}
                className="relative p-6 md:p-8 rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] transition-shadow duration-300 hover:shadow-xl hover:shadow-[#227736]/5 overflow-hidden"
              >
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-[#E67E22]/15"
                />

                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E67E22] to-transparent"
                />

                <div className="relative">
                  <p className="text-sm md:text-base text-[#5a6e63] leading-relaxed">
                    CampusConnect's goal is to make communication between
                    university students and administration simple, fast, and
                    digital. We bring notices, campus complaints, and Lost &
                    Found into one centralized platform — where everything is
                    searchable and trackable.
                  </p>
                  <p className="mt-4 text-sm md:text-base text-[#5a6e63] leading-relaxed">
                    The AI-powered notice summarization feature helps students
                    understand lengthy notices in seconds — highlighting key
                    dates, required documents, and action items.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Digital", "Centralized", "AI-assisted"].map((tag, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                        whileHover={{ y: -3, scale: 1.08 }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#e2ebe6] text-[#227736] hover:border-[#227736]/40 hover:shadow-md transition-all duration-300 cursor-default"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== TIMELINE ==================== */}
        <section className="relative py-20 md:py-24 bg-[#f8faf9] border-y border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#c8e6d1] mb-4 cursor-default"
              >
                <GitBranch size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  Our Journey
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                From idea to impact.
              </h2>
              <p className="mt-4 text-sm md:text-base text-[#5a6e63]">
                Four phases that shaped CampusConnect.
              </p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#c8e6d1] to-transparent" />

              <div className="grid md:grid-cols-4 gap-6 md:gap-4">
                {milestones.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      whileHover={{ y: -6 }}
                      className="relative group"
                    >
                      <div className="relative z-10 flex justify-center mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.15 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="w-14 h-14 rounded-2xl bg-white border-2 border-[#227736] flex items-center justify-center shadow-lg shadow-[#227736]/10 group-hover:border-[#E67E22] group-hover:shadow-[#E67E22]/20 transition-all duration-300"
                        >
                          <Icon size={20} className="text-[#227736] group-hover:text-[#E67E22] transition-colors duration-300" />
                        </motion.div>
                      </div>

                      <div className="text-center px-2">
                        <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-[#E67E22] mb-2">
                          {m.year}
                        </span>
                        <h3 className="font-bold text-[#0f1d17] text-sm">
                          {m.title}
                        </h3>
                        <p className="text-xs text-[#5a6e63] mt-2 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== VALUES ==================== */}
        <section className="relative py-20 md:py-24 bg-white overflow-hidden">
          <FloatingBlobs variant="orange" />

          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-4 cursor-default"
              >
                <Heart size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  Our Values
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                What we stand for.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative p-6 rounded-2xl bg-white border border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-2xl hover:shadow-[#227736]/10 transition-all duration-300 overflow-hidden"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        v.accent ? "bg-[#E67E22]/15" : "bg-[#227736]/10"
                      }`}
                    />

                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        className={`absolute inset-0 w-12 h-12 rounded-xl ${
                          v.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                        }`}
                      />

                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md ${
                          v.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white shadow-[#E67E22]/30"
                            : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-[#227736]/30"
                        }`}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </motion.div>
                    </div>

                    <h3 className="relative font-bold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors duration-300">
                      {v.title}
                    </h3>
                    <p className="relative text-sm text-[#5a6e63] mt-2 leading-relaxed">
                      {v.desc}
                    </p>

                    <span
                      className={`absolute bottom-0 left-6 right-6 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full ${
                        v.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== STATS ==================== */}
        <section className="relative py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="relative p-5 rounded-2xl bg-white border border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/10 transition-all duration-300 text-center overflow-hidden group cursor-default"
                  >
                    <motion.div
                      animate={{ opacity: [0, 0.08, 0], scale: [1, 1.3, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                      className={`absolute inset-0 rounded-2xl ${
                        s.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                      }`}
                    />

                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`relative mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                        s.accent
                          ? "bg-[#fdf2e3] border border-[#E67E22]/30 text-[#E67E22]"
                          : "bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]"
                      }`}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <p className="relative text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">
                      {s.value}
                    </p>
                    <p className="relative text-xs text-[#5a6e63] mt-1 font-medium">
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== TEAM ==================== */}
        <section className="relative py-20 md:py-24 bg-[#f8faf9] border-y border-[#e2ebe6] overflow-hidden">
          <FloatingBlobs variant="green" />

          <div className="relative max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#c8e6d1] mb-4 cursor-default"
              >
                <Users size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  Meet the Team
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                The people behind
                <br />
                <span className="text-[#227736]">CampusConnect.</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-[#5a6e63]">
                A small, focused team building a big idea for universities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8 }}
                    className="group relative p-6 rounded-2xl bg-white border border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-2xl hover:shadow-[#227736]/10 transition-all duration-300 text-center overflow-hidden"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        m.accent ? "bg-[#E67E22]/15" : "bg-[#227736]/10"
                      }`}
                    />

                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                        className={`absolute inset-0 rounded-2xl ${
                          m.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                        }`}
                      />

                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                          m.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[#E67E22]/30"
                            : "bg-gradient-to-br from-[#227736] to-[#28a745] shadow-[#227736]/30"
                        }`}
                      >
                        <Icon size={26} strokeWidth={2} />
                      </motion.div>
                    </div>

                    <h3 className="relative font-bold text-[#0f1d17] text-sm tracking-tight">
                      {m.name}
                    </h3>

                    <div className="relative mt-2">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-default ${
                          m.accent
                            ? "bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/40"
                            : "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            m.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                          }`}
                        />
                        {m.role}
                      </motion.span>
                    </div>

                    <p className="relative text-[10px] text-[#5a6e63] mt-3 font-mono tracking-wider">
                      {m.id}
                    </p>

                    {/* Social icons */}
                    <div className="relative mt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {[GitBranch, Link2, Globe].map((SocIcon, si) => (
                        <motion.button
                          key={si}
                          whileHover={{ y: -2, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                            m.accent
                              ? "bg-[#fdf2e3] border-[#E67E22]/30 text-[#E67E22] hover:bg-[#E67E22] hover:text-white"
                              : "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736] hover:bg-[#227736] hover:text-white"
                          }`}
                          aria-label="Social link"
                        >
                          <SocIcon size={12} />
                        </motion.button>
                      ))}
                    </div>

                    <span
                      className={`absolute bottom-0 left-6 right-6 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full ${
                        m.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl bg-gradient-to-br from-[#165127] via-[#227736] to-[#1c6430] p-10 md:p-14 text-center text-white overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25], x: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#E67E22]/50 blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#28a745]/40 blur-3xl pointer-events-none"
              />

              {[...Array(4)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#E67E22] shadow-lg shadow-[#E67E22]/50"
                  style={{ top: `${20 + i * 18}%`, left: `${15 + i * 20}%` }}
                />
              ))}

              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="w-14 h-14 mx-auto rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-5 border border-white/25"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Rocket size={24} />
                  </motion.div>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em]">
                  Ready to transform
                  <br />
                  <span className="text-[#E67E22]">your campus?</span>
                </h2>

                <p className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto">
                  Join us in building the future of university management.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Button
                      href="/register"
                      size="lg"
                      className="!bg-white !text-[#227736] hover:!bg-[#eaf6ee] !shadow-xl !shadow-black/20 !font-bold"
                    >
                      Get Started <ArrowRight size={16} />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Button
                      href="/contact"
                      variant="ghost"
                      size="lg"
                      className="!text-white !border !border-white/30 hover:!bg-white/10 hover:!border-[#E67E22]/60"
                    >
                      Contact Us
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs text-white/75">
                  {["Built for universities", "Secure by design", "Free to explore"].map((label, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
                      <span className="font-medium">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}