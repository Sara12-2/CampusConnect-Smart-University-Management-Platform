"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import {
  Compass,
  Database,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Rocket,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/* ============================================================
   INLINE SVG BRAND ICONS
   (lucide-react v1.x removed brand icons)
   ============================================================ */

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  );
}

/* ============================================================
   DATA
   ============================================================ */

const team = [
  {
    name: "Sara Manzoor",
    role: "Project Lead & Frontend Developer",
    id: "UL-BSCSM-A-24-01",
    icon: Compass,
    accent: true,
    github: "https://github.com/Sara12-2",
    linkedin: "https://www.linkedin.com/in/sara-manzoor-3a8a56365",
  },
  {
    name: "Muhammad Abubakar Nadeem",
    role: "Chatbot Developement",
    id: "UL-BSCSM-A-24-46",
    icon: Database,
    accent: false,
    github: "https://github.com/AbuBakkar285",
    linkedin: " https://www.linkedin.com/in/muhammad-abu-bakkar-nadeem-427a94404?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Muhammad Abdullah",
    role: "Backend Developer",
    id: "UL-BSCSM-A-24-43",
    icon: Code2,
    accent: true,
    github: "https://github.com/Abdullah-zx",
    linkedin: "https://www.linkedin.com/me?trk=p_mwlite_profile_view-secondary_nav",
  },
  {
    name: "M. Umair Akram",
    role: "Database",
    id: "UL-BSCSM-A-24-26",
    icon: Layers,
    accent: false,
    github: "https://github.com/umaiirakram",
    linkedin: "https://www.linkedin.com/in/umair-akram-1b0416433?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
];

const features = [
  {
    title: "Smart Notice Summaries",
    desc: "Long PDF notices translated into crisp, key bullet points powered by AI.",
    icon: Sparkles,
    badge: "AI Engine",
  },
  {
    title: "Tracked Complaints",
    desc: "Submit, track, and resolve campus infrastructure issues in real time.",
    icon: ShieldCheck,
    badge: "Real-time",
  },
  {
    title: "Lost & Found Ledger",
    desc: "Centralized claim verification system for misplaced campus belongings.",
    icon: Layers,
    badge: "Verified",
  },
];

const milestones = [
  {
    phase: "01",
    title: "Problem Definition",
    desc: "Identified campus friction: fragmented notices and unorganized complaints.",
    icon: BookOpen,
  },
  {
    phase: "02",
    title: "Full Stack Architecture",
    desc: "Designed a performant React/Next.js interface backed by robust API routing.",
    icon: Code2,
  },
  {
    phase: "03",
    title: "AI Integration",
    desc: "Engineered LLM summarization flows for quick comprehension.",
    icon: Sparkles,
  },
  {
    phase: "04",
    title: "Campus Deployment",
    desc: "Delivered an operational smart platform ready for higher education.",
    icon: Rocket,
  },
];

/* Floating badge animation positions (desktop only) */
const badgeAnimations = [
  {
    x: [-30, 20, 40, -10, -30],
    y: [-120, -140, -40, -20, -120],
    scale: [1, 1.05, 0.95, 1, 1],
  },
  {
    x: [160, 120, 20, 100, 160],
    y: [-60, 40, 120, -20, -60],
    scale: [1, 0.95, 1.05, 1, 1],
  },
  {
    x: [80, -40, -140, 0, 80],
    y: [120, 140, 20, 60, 120],
    scale: [1, 1.05, 0.95, 1, 1],
  },
  {
    x: [-160, -120, 0, -100, -160],
    y: [40, -60, -120, 20, 40],
    scale: [1, 0.95, 1.05, 1, 1],
  },
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9] text-[#0f1d17] overflow-x-hidden selection:bg-[#E67E22] selection:text-white">
        {/* ==================== HERO SECTION ==================== */}
        <section
          ref={heroRef}
          className="relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] text-white pt-28 pb-28 md:pt-36 md:pb-36 overflow-hidden border-b border-[#1c6430]"
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />

          {/* Ambient glow */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }
            }
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-[#E67E22]/25 blur-[130px] pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative max-w-7xl mx-auto px-6 z-10"
          >
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left column: heading */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="lg:col-span-5 text-center lg:text-left space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                      The Architects
                    </span>
                  </span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
                >
                  Smart Campus <br />
                  <span className="bg-gradient-to-r from-[#E67E22] via-white to-[#E67E22] bg-clip-text text-transparent">
                    Innovation Team
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
                >
                  Engineered by student developers to streamline university
                  notices, grievances, and claim verification in one unified
                  platform.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start"
                >
                  <Button
                    href="/register"
                    size="lg"
                    className="!bg-[#E67E22] !text-white hover:!bg-[#D35400] shadow-xl border-none"
                  >
                    Explore Platform{" "}
                    <ArrowRight size={18} className="ml-1" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right column: 3D laptop + floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 relative lg:min-h-[460px] flex items-center justify-center"
              >
                {/* Floating badges — desktop only */}
                {team.map((member, i) => {
                  const Icon = member.icon;
                  return (
                    <motion.div
                      key={member.name}
                      animate={shouldReduceMotion ? {} : badgeAnimations[i]}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="hidden lg:flex absolute z-30 p-3 px-4 rounded-2xl bg-white text-[#0f1d17] shadow-2xl border border-[#e2ebe6] items-center gap-3 backdrop-blur-md"
                      aria-hidden="true"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold shrink-0 ${
                          member.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400]"
                            : "bg-gradient-to-br from-[#227736] to-[#1c6430]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0f1d17] whitespace-nowrap">
                          {member.name}
                        </p>
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-wider ${
                            member.accent ? "text-[#E67E22]" : "text-[#227736]"
                          }`}
                        >
                          {member.role}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* 3D laptop model */}
                <motion.div
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : { rotateY: -18, rotateX: 12, scale: 1.02 }
                  }
                  transition={{ duration: 0.4 }}
                  className="relative mx-auto w-full max-w-[460px] transform-gpu my-auto"
                  style={{
                    transform:
                      "rotateY(-25deg) rotateX(15deg) rotateZ(3deg)",
                    transformStyle: "preserve-3d",
                  }}
                  aria-hidden="true"
                >
                  {/* Laptop lid */}
                  <div className="relative rounded-t-2xl bg-[#0f1712] p-3 border-4 border-[#2b3a30] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.75)]">
                    {/* Browser bar */}
                    <div className="flex items-center justify-between pb-2 px-2 border-b border-white/10 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <div className="px-3 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70 font-mono">
                        campusconnect.app
                      </div>
                    </div>

                    {/* Simulated dashboard */}
                    <div className="rounded-lg bg-[#f8faf9] p-3.5 text-[#0f1d17] space-y-2.5 min-h-[240px] shadow-inner">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#e2ebe6] shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-[#227736] text-white flex items-center justify-center text-[10px] font-bold">
                            CC
                          </div>
                          <span className="text-xs font-bold text-[#0f1d17]">
                            CampusConnect
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#eaf6ee] text-[#227736] text-[9px] font-bold">
                          Live System
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">Notices</p>
                          <p className="text-xs font-extrabold text-[#227736]">
                            24 Active
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">
                            Complaints
                          </p>
                          <p className="text-xs font-extrabold text-[#E67E22]">
                            08 Pending
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">Claims</p>
                          <p className="text-xs font-extrabold text-[#1c6430]">
                            03 Verified
                          </p>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]">
                        <p className="text-[11px] font-bold text-[#0f1d17]">
                          AI Notice Digest
                        </p>
                        <p className="text-[9px] text-[#5a6e63] mt-0.5">
                          Exams schedule uploaded. Clear ID cards required.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Laptop base */}
                  <div className="relative h-6 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 rounded-b-xl border-t-2 border-gray-500 shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-20 h-1.5 bg-gray-700 rounded-b-md shadow-inner" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ==================== CORE FEATURES ==================== */}
        <section className="py-20 bg-white border-b border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest text-[#E67E22] uppercase bg-[#E67E22]/10 px-3 py-1 rounded-full border border-[#E67E22]/20">
                Core Capabilities
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f1d17] mt-3">
                Engineered for Campus Productivity
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={shouldReduceMotion ? {} : { y: -8 }}
                  className="p-8 rounded-3xl bg-[#f8faf9] border border-[#e2ebe6] shadow-sm hover:shadow-xl hover:border-[#227736]/40 transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaf6ee] text-[#227736] flex items-center justify-center group-hover:bg-[#227736] group-hover:text-white transition-colors duration-300">
                      <f.icon size={24} />
                    </div>
                    <span className="text-xs font-bold font-mono text-[#E67E22] bg-white px-2.5 py-1 rounded-full border border-[#e2ebe6]">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-[#0f1d17]">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#5a6e63] mt-3 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== DEVELOPMENT PHASES ==================== */}
        <section className="py-24 bg-[#f8faf9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4">
                <span className="text-xs font-bold tracking-widest text-[#227736] uppercase bg-[#eaf6ee] px-3 py-1 rounded-full border border-[#c8e6d1]">
                  System Evolution
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d17] mt-4 leading-tight">
                  How CampusConnect Was Built
                </h2>
                <p className="text-[#5a6e63] mt-4 text-sm leading-relaxed">
                  From research on campus administrative pain-points to a fully
                  deployed modular web architecture.
                </p>
              </div>

              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.phase}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-[#e2ebe6] shadow-sm hover:border-[#227736]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-[#E67E22] font-mono">
                        {m.phase}
                      </span>
                      <m.icon size={20} className="text-[#227736]" />
                    </div>
                    <h4 className="font-extrabold text-[#0f1d17] text-base">
                      {m.title}
                    </h4>
                    <p className="text-xs text-[#5a6e63] mt-2 leading-relaxed">
                      {m.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TEAM GRID (WITH SOCIAL LINKS) ==================== */}
        <section className="py-24 bg-white border-t border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-[#227736] uppercase bg-[#eaf6ee] px-3 py-1 rounded-full border border-[#c8e6d1]">
                Meet The Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d17] mt-3">
                Team Profiles &amp; IDs
              </h2>
              <p className="text-sm text-[#5a6e63] mt-3">
                Connect with the developers behind CampusConnect
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => {
                const isOrange = member.accent;
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={shouldReduceMotion ? {} : { y: -6 }}
                    className="group p-6 rounded-3xl bg-[#f8faf9] border border-[#e2ebe6] shadow-sm hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden flex flex-col"
                  >
                    <div
                      className={`absolute top-0 inset-x-0 h-1.5 ${
                        isOrange ? "bg-[#E67E22]" : "bg-[#227736]"
                      }`}
                    />

                    <div className="w-16 h-16 mx-auto mb-4 mt-2 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-[#165127] to-[#227736]">
                      <member.icon size={28} />
                    </div>

                    <h3 className="font-extrabold text-base text-[#0f1d17]">
                      {member.name}
                    </h3>
                    <p
                      className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                        isOrange ? "text-[#E67E22]" : "text-[#227736]"
                      }`}
                    >
                      {member.role}
                    </p>
                    <p className="text-[11px] text-[#5a6e63] mt-3 font-mono bg-white py-1 px-2.5 rounded-full border border-[#e2ebe6] inline-block mx-auto">
                      {member.id}
                    </p>

                    {/* Social links */}
                    <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[#e2ebe6]">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on GitHub`}
                          className="w-9 h-9 rounded-xl bg-white border border-[#e2ebe6] flex items-center justify-center text-[#5a6e63] hover:text-[#0f1d17] hover:border-[#0f1d17] hover:bg-[#f0f2f1] transition-all"
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="w-9 h-9 rounded-xl bg-white border border-[#e2ebe6] flex items-center justify-center text-[#5a6e63] hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#e8f1fb] transition-all"
                        >
                          <LinkedinIcon size={16} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-20 bg-[#f8faf9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] p-10 sm:p-16 text-center text-white overflow-hidden shadow-2xl">
              <div
                className="absolute top-0 right-0 w-80 h-80 bg-[#E67E22]/20 rounded-full blur-[90px] pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to upgrade your campus workflow?
                </h2>
                <p className="mt-4 text-white/80 text-sm sm:text-base">
                  Get started with CampusConnect to access centralized notices,
                  issue management, and AI summaries.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Button
                    href="/register"
                    size="lg"
                    className="!bg-white !text-[#0f1d17] hover:!bg-[#eaf6ee] shadow-xl border-none"
                  >
                    Get Started <ArrowRight size={18} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}