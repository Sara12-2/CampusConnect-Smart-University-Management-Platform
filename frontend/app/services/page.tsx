"use client";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, Sparkles, ShieldCheck, Users,
  Clock, Filter, Image as ImageIcon, CheckCircle2, Zap,
  ArrowRight, Layers, FileCheck, Rocket, Award,
  BookOpen, AlertCircle, Building2, CircleDot,
  GraduationCap, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

const services = [
  {
    id: "notices",
    icon: Bell,
    badge: "Module 01",
    title: "Smart Digital Notice Board",
    tagline: "Never miss an important notice again.",
    accent: true,
    desc: "All university notices in one place — searchable, filterable, and AI-summarized for instant understanding.",
    features: [
      { icon: FileCheck, text: "Notice publishing by admin" },
      { icon: Filter, text: "Search & filter by department/semester" },
      { icon: Clock, text: "Deadline reminders" },
      { icon: Award, text: "Pinned & important notices" },
      { icon: Sparkles, text: "AI-generated summaries" },
      { icon: Bell, text: "Real-time notifications" },
    ],
    stats: [
      { value: "300+", label: "Notices / month" },
      { value: "100%", label: "Coverage" },
    ],
  },
  {
    id: "complaints",
    icon: MessageSquare,
    badge: "Module 02",
    title: "Complaint & Issue Management",
    tagline: "Turn campus problems into solutions.",
    accent: false,
    desc: "Report campus issues, track them through resolution, and see everything in real time.",
    features: [
      { icon: ImageIcon, text: "Submit complaints with images" },
      { icon: Layers, text: "Categories: Classroom, Lab, Wi-Fi" },
      { icon: CircleDot, text: "Live status: Submitted to Resolved" },
      { icon: Users, text: "Admin assignment & monitoring" },
      { icon: Clock, text: "Complete history tracking" },
      { icon: AlertCircle, text: "Priority handling" },
    ],
    stats: [
      { value: "98%", label: "Resolution rate" },
      { value: "< 2d", label: "Avg. response" },
    ],
  },
  {
    id: "lost-found",
    icon: Search,
    badge: "Module 03",
    title: "University Lost & Found",
    tagline: "Reconnecting people with their belongings.",
    accent: true,
    desc: "Report lost items or list found ones. Verified claims ensure items reach the right owner.",
    features: [
      { icon: Search, text: "Report lost or found items" },
      { icon: ImageIcon, text: "Item images, location & date" },
      { icon: Filter, text: "Advanced search & filtering" },
      { icon: FileCheck, text: "Submit ownership claims" },
      { icon: ShieldCheck, text: "Admin verification process" },
      { icon: CheckCircle2, text: "Secure item handover" },
    ],
    stats: [
      { value: "1.2k+", label: "Items reunited" },
      { value: "100%", label: "Verified" },
    ],
  },
];

const aiFeatures = [
  {
    icon: Sparkles,
    title: "AI Notice Summaries",
    desc: "Lengthy notices condensed into clear summaries — dates, deadlines, and documents highlighted.",
    accent: false,
  },
  {
    icon: Clock,
    title: "Instant Understanding",
    desc: "Comprehend in seconds what would take minutes — no more missed details.",
    accent: true,
  },
  {
    icon: FileCheck,
    title: "Original Retained",
    desc: "The full notice is always available alongside the summary for complete context.",
    accent: false,
  },
];

const processSteps = [
  {
    icon: GraduationCap,
    title: "Register",
    desc: "Sign up with your department and semester.",
  },
  {
    icon: BookOpen,
    title: "Discover",
    desc: "Browse notices and updates tailored to you.",
  },
  {
    icon: MessageSquare,
    title: "Report",
    desc: "Submit complaints or report lost items.",
  },
  {
    icon: CheckCircle2,
    title: "Track",
    desc: "Follow every step through to resolution.",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#0f1d17] overflow-x-hidden">

        {/* ==================== HERO ==================== */}
        <section className="relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.4, 0.25], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#E67E22]/40 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#28a745]/40 blur-3xl pointer-events-none"
          />

          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              className={`absolute rounded-full ${
                i % 2 === 0
                  ? "bg-[#E67E22] shadow-lg shadow-[#E67E22]/50"
                  : "bg-white shadow-lg shadow-white/50"
              }`}
              style={{
                width: i % 3 === 0 ? 8 : 5,
                height: i % 3 === 0 ? 8 : 5,
                top: `${15 + i * 15}%`,
                left: `${10 + i * 18}%`,
              }}
            />
          ))}

          <Layers
            size={220}
            strokeWidth={0.6}
            className="absolute -bottom-12 -right-6 text-white/[0.05] pointer-events-none select-none"
          />

          {/* ✅ pt-10 md:pt-14 = navbar ke neeche thora gap */}
          <div className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-20 md:pb-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
                />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                  Our Services
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em]"
              >
                Three modules,
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-white via-[#E67E22] to-white bg-clip-text text-transparent">
                    one platform.
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left bg-[#E67E22] rounded-full"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto"
              >
                Everything your campus needs — notices, complaints, and
                Lost & Found, unified in one elegant platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs md:text-sm"
              >
                {["AI-powered", "Student-first", "Admin-friendly"].map((label, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="flex items-center gap-2 text-white/85 cursor-default"
                  >
                    <CheckCircle2 size={14} className="text-[#E67E22]" />
                    <span className="font-medium">{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== SERVICE MODULES ==================== */}
        <section className="relative py-20 md:py-24 bg-white overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-[#227736] blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.09, 0.05] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#E67E22] blur-3xl pointer-events-none"
          />

          <div className="relative max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-4 cursor-default"
              >
                <Layers size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  Core Modules
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                Three powerful modules.
                <br />
                <span className="text-[#227736]">One seamless experience.</span>
              </h2>
            </motion.div>

            <div className="space-y-8">
              {services.map((s, i) => {
                const Icon = s.icon;
                const isReversed = i % 2 === 1;

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="group relative bg-white rounded-3xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#227736]/10"
                  >
                    <div
                      className={`h-1.5 bg-gradient-to-r ${
                        s.accent
                          ? "from-[#E67E22] via-[#D35400] to-[#E67E22]"
                          : "from-[#227736] via-[#28a745] to-[#227736]"
                      }`}
                    />

                    <div
                      className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        s.accent ? "bg-[#E67E22]/8" : "bg-[#227736]/8"
                      }`}
                    />

                    <div
                      className={cn(
                        "grid md:grid-cols-5 gap-0",
                        isReversed && "md:[&>*:first-child]:order-2"
                      )}
                    >
                      {/* Icon side */}
                      <div
                        className={cn(
                          "md:col-span-2 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden",
                          s.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400]"
                            : "bg-gradient-to-br from-[#227736] to-[#28a745]"
                        )}
                      >
                        <Icon
                          size={180}
                          strokeWidth={0.5}
                          className="absolute -bottom-8 -right-6 text-white/[0.08] pointer-events-none"
                        />

                        <div className="relative">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/25 mb-5">
                            {s.badge}
                          </span>

                          <motion.div
                            whileHover={{ rotate: 8, scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shadow-lg mb-5"
                          >
                            <Icon size={28} strokeWidth={2} />
                          </motion.div>

                          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                            {s.title}
                          </h3>

                          <p className="mt-3 text-sm text-white/85 italic">
                            {s.tagline}
                          </p>
                        </div>

                        <div className="relative mt-8 pt-6 border-t border-white/20 flex items-center gap-6">
                          {s.stats.map((st, si) => (
                            <div key={si}>
                              <p className="text-2xl font-extrabold tracking-tight">
                                {st.value}
                              </p>
                              <p className="text-[10px] uppercase tracking-wider text-white/70 mt-0.5 font-semibold">
                                {st.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="md:col-span-3 p-8 md:p-10">
                        <p className="text-sm md:text-base text-[#5a6e63] leading-relaxed mb-6">
                          {s.desc}
                        </p>

                        <div className="flex items-center gap-2 mb-5">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center",
                              s.accent
                                ? "bg-[#fdf2e3] border border-[#E67E22]/30"
                                : "bg-[#eaf6ee] border border-[#c8e6d1]"
                            )}
                          >
                            <Zap
                              size={12}
                              className={s.accent ? "text-[#E67E22]" : "text-[#227736]"}
                            />
                          </div>
                          <h4 className="font-bold text-[#0f1d17] text-sm uppercase tracking-wider">
                            Key Features
                          </h4>
                        </div>

                        <ul className="grid sm:grid-cols-2 gap-3">
                          {s.features.map((f, fi) => {
                            const FeatureIcon = f.icon;
                            return (
                              <motion.li
                                key={fi}
                                initial={{ opacity: 0, x: -8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + fi * 0.05 }}
                                className="group/item flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[#f8faf9] transition-all duration-300"
                              >
                                <div
                                  className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300",
                                    s.accent
                                      ? "bg-[#fdf2e3] text-[#E67E22] group-hover/item:bg-[#E67E22] group-hover/item:text-white"
                                      : "bg-[#eaf6ee] text-[#227736] group-hover/item:bg-[#227736] group-hover/item:text-white"
                                  )}
                                >
                                  <FeatureIcon size={13} strokeWidth={2.2} />
                                </div>
                                <span className="text-sm text-[#0f1d17] group-hover/item:text-[#227736] transition-colors font-medium">
                                  {f.text}
                                </span>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== AI FEATURE ==================== */}
        <section className="relative py-20 md:py-24 bg-[#f8faf9] border-y border-[#e2ebe6] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #227736 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdf2e3] border border-[#E67E22]/30 mb-4 cursor-default"
              >
                <Sparkles size={12} className="text-[#E67E22]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B45A0B]">
                  AI Feature
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                AI Notice
                <br />
                <span className="text-[#227736]">Summarization.</span>
              </h2>

              <p className="mt-5 text-base md:text-lg text-[#5a6e63] max-w-2xl mx-auto leading-relaxed">
                Lengthy notices condensed into clear, actionable summaries —
                so students understand in seconds what would take minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {aiFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -8 }}
                    className={cn(
                      "group relative p-6 rounded-2xl bg-white overflow-hidden border transition-all duration-300",
                      f.accent
                        ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-2xl hover:shadow-[#E67E22]/10"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-2xl hover:shadow-[#227736]/10"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        f.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"
                      )}
                    />

                    <div className="relative mb-5">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        className={cn(
                          "absolute inset-0 w-12 h-12 rounded-xl",
                          f.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                        )}
                      />

                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className={cn(
                          "relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md",
                          f.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[#E67E22]/30"
                            : "bg-gradient-to-br from-[#227736] to-[#28a745] shadow-[#227736]/30"
                        )}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </motion.div>
                    </div>

                    <h3 className="font-bold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-[#5a6e63] mt-2 leading-relaxed">
                      {f.desc}
                    </p>

                    <span
                      className={cn(
                        "absolute bottom-0 left-6 right-6 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full",
                        f.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                      )}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="relative py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-4 cursor-default"
              >
                <Rocket size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  How It Works
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-[-0.02em] leading-[1.1]">
                From registration to resolution.
              </h2>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#c8e6d1] to-transparent" />

              <div className="grid md:grid-cols-4 gap-8 md:gap-6">
                {processSteps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      whileHover={{ y: -6 }}
                      className="relative group text-center"
                    >
                      <div className="relative z-10 flex justify-center mb-5">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.15 }}
                          transition={{ duration: 0.6, type: "spring" }}
                          className="relative w-20 h-20 rounded-2xl bg-white border-2 border-[#227736] flex items-center justify-center shadow-lg shadow-[#227736]/10 group-hover:border-[#E67E22] group-hover:shadow-[#E67E22]/20 transition-all duration-300"
                        >
                          <Icon
                            size={28}
                            className="text-[#227736] group-hover:text-[#E67E22] transition-colors duration-300"
                          />

                          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#E67E22] text-white text-[10px] font-extrabold flex items-center justify-center shadow-md shadow-[#E67E22]/30">
                            {i + 1}
                          </span>
                        </motion.div>
                      </div>

                      <h3 className="font-bold text-[#0f1d17] text-lg group-hover:text-[#227736] transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-sm text-[#5a6e63] mt-2 leading-relaxed max-w-xs mx-auto">
                        {s.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25], x: [0, 20, 0] }}
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
                  style={{
                    top: `${20 + i * 18}%`,
                    left: `${15 + i * 20}%`,
                  }}
                />
              ))}

              <div className="relative max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
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
                  Ready to get started?
                </h2>
                <p className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto">
                  Create your free account and experience all three modules in action.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <motion.a
                    href="/register"
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#227736] text-sm font-bold shadow-xl shadow-black/20 hover:bg-[#eaf6ee] transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </motion.a>

                  <motion.a
                    href="/contact"
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent text-white text-sm font-bold border-2 border-white/30 hover:bg-white/10 hover:border-[#E67E22]/60 transition-all duration-300"
                  >
                    Contact Us
                    <ChevronRight size={16} />
                  </motion.a>
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs text-white/75">
                  {["Free forever", "No credit card", "Cancel anytime"].map((label, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#E67E22]" />
                      <span className="font-medium">{label}</span>
                    </div>
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