"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import {
  Bell, MessageSquare, Search, ShieldCheck, Users, GraduationCap,
  ArrowRight, CheckCircle2, Sparkles, TrendingUp,
  Play, Lock, Globe, Check, ChevronRight,
  FileCheck, Clock, AlertCircle, Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/* ============================================================
   DATA
   ============================================================ */

const primaryFeatures = [
  { icon: Bell, title: "Smart Notice Board", desc: "Every university notice in one place, with AI summaries so students understand them in seconds.", preview: "notice" },
  { icon: MessageSquare, title: "Complaint Management", desc: "Students report issues with photos. Admins assign and track them through resolution.", preview: "complaint" },
  { icon: Search, title: "Lost & Found", desc: "Report lost items or list found ones. Verified claims ensure they reach the right owner.", preview: "lost-found" },
];

const secondaryFeatures = [
  { icon: Sparkles, title: "AI Summaries", desc: "Auto-generated summaries for long notices." },
  { icon: ShieldCheck, title: "Verified Claims", desc: "Admin-verified for security." },
  { icon: Users, title: "Role-Based Access", desc: "Separate student and admin dashboards." },
  { icon: FileCheck, title: "Track Everything", desc: "Real-time status on all submissions." },
];

const productTabs = [
  { id: "notices", label: "Notice Board", icon: Bell },
  { id: "complaints", label: "Complaints", icon: MessageSquare },
  { id: "lost-found", label: "Lost & Found", icon: Search },
];

const howItWorks = [
  { icon: GraduationCap, title: "Register", desc: "Sign up with your department and semester." },
  { icon: Bell, title: "Discover", desc: "Browse notices and updates relevant to you." },
  { icon: Send, title: "Report", desc: "Submit complaints or report lost items." },
  { icon: CheckCircle2, title: "Track", desc: "Follow every step through to resolution." },
];

const projectStats = [
  { icon: FileCheck, value: "3", label: "Core Modules", accent: false },
  { icon: Sparkles, value: "AI", label: "Powered Summaries", accent: true },
  { icon: Clock, value: "Live", label: "Real-Time Updates", accent: false },
  { icon: ShieldCheck, value: "2", label: "Access Roles", accent: true },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ============================================================
   UI PREVIEWS
   ============================================================ */

function NoticePreview() {
  return (
    <div className="rounded-xl border border-[#e2ebe6] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#eaf6ee] flex items-center justify-center">
            <Bell size={11} className="text-[#227736]" />
          </div>
          <span className="text-[10px] font-bold text-[#5a6e63] uppercase tracking-wider">
            Latest Notice
          </span>
        </div>
        <span className="text-[9px] font-bold text-white bg-[#E67E22] px-2 py-0.5 rounded-full">
          NEW
        </span>
      </div>
      <p className="text-xs font-bold text-[#0f1d17]">Mid-Term Exam Schedule</p>
      <div className="mt-3 pt-3 border-t border-[#e2ebe6]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles size={10} className="text-[#E67E22]" />
          <span className="text-[9px] font-bold text-[#227736] uppercase tracking-wider">
            AI Summary
          </span>
        </div>
        <p className="text-[10px] text-[#5a6e63] leading-relaxed">
          Exams begin 20 Oct 2025. Bring original ID card and fee clearance slip.
        </p>
      </div>
    </div>
  );
}

function ComplaintPreview() {
  return (
    <div className="rounded-xl border border-[#e2ebe6] bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#fdf2e3] flex items-center justify-center">
            <MessageSquare size={11} className="text-[#E67E22]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5a6e63] uppercase tracking-wider">
              Complaint #C-142
            </p>
            <p className="text-xs font-bold text-[#0f1d17] mt-0.5">
              Wi-Fi not working in Lab 3
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Submitted", done: true },
          { label: "Assigned to IT", done: true },
          { label: "In Progress", done: true, active: true },
          { label: "Resolved", done: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                s.active ? "bg-[#E67E22]" : s.done ? "bg-[#227736]" : "bg-[#e2ebe6]"
              }`}
            >
              {s.done && <Check size={8} className="text-white" />}
            </div>
            <span
              className={`text-[10px] ${
                s.active
                  ? "font-bold text-[#E67E22]"
                  : s.done
                  ? "text-[#5a6e63]"
                  : "text-[#b0bfb7]"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LostFoundPreview() {
  return (
    <div className="rounded-xl border border-[#e2ebe6] bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-[#eaf6ee] flex items-center justify-center">
          <Search size={11} className="text-[#227736]" />
        </div>
        <span className="text-[10px] font-bold text-[#5a6e63] uppercase tracking-wider">
          Recent Items
        </span>
      </div>
      <div className="space-y-2">
        {[
          { type: "LOST", title: "Black Wallet", loc: "Cafeteria", accent: true },
          { type: "FOUND", title: "Blue Bottle", loc: "Library", accent: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#f8faf9] border border-[#e2ebe6]">
            <div
              className={`text-[8px] font-black px-1.5 py-0.5 rounded text-white ${
                item.accent ? "bg-[#E67E22]" : "bg-[#227736]"
              }`}
            >
              {item.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#0f1d17] truncate">
                {item.title}
              </p>
              <p className="text-[9px] text-[#5a6e63]">{item.loc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#e2ebe6]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={10} className="text-[#227736]" />
          <span className="text-[9px] font-semibold text-[#5a6e63]">
            All claims are admin-verified
          </span>
        </div>
      </div>
    </div>
  );
}

const previewMap: Record<string, () => JSX.Element> = {
  notice: NoticePreview,
  complaint: ComplaintPreview,
  "lost-found": LostFoundPreview,
};

/* ============================================================
   HERO DASHBOARD CARD
   ============================================================ */

function HeroDashboardCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(y);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative [perspective:1400px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow behind — dark green + dark orange */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-6 rounded-[28px] blur-2xl
          bg-gradient-to-br from-[#227736]/40 via-[#1c6430]/30 to-[#E67E22]/30"
      />

      {/* Sparkle dots — dark green + dark orange */}
      <motion.span
        animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -right-3 w-2 h-2 rounded-full bg-[#E67E22] shadow-lg shadow-[#E67E22]/50"
      />
      <motion.span
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-4 w-2.5 h-2.5 rounded-full bg-[#28a745] shadow-lg shadow-[#28a745]/50"
      />
      <motion.span
        animate={{ x: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 -left-5 w-1.5 h-1.5 rounded-full bg-white"
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl overflow-hidden 
          bg-white shadow-2xl shadow-black/30 
          border border-white/20
          ring-1 ring-[#227736]/10"
      >
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-y-0 w-1/3 z-20
            bg-gradient-to-r from-transparent via-white/40 to-transparent 
            skew-x-12"
        />

        <div className="flex items-center gap-2 px-4 py-2.5 
          bg-[#f8faf9] border-b border-[#e2ebe6]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#227736]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28a745]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#E67E22]" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white rounded-md px-3 py-1 text-[10px] 
              text-[#5a6e63] max-w-xs mx-auto text-center 
              border border-[#e2ebe6] flex items-center justify-center gap-1.5">
              <Lock size={9} className="text-[#227736]" />
              app.campusconnect.edu/student
            </div>
          </div>
        </div>

        <div className="bg-[#f8faf9] p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-[#5a6e63]">Welcome back,</p>
              <p className="text-sm font-bold text-[#0f1d17]">Sara Manzoor</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-[#eaf6ee] 
                border border-[#c8e6d1] rounded-full px-2 py-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28a745] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#227736]" />
                </span>
                <span className="text-[9px] font-bold text-[#227736]">LIVE</span>
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-7 h-7 rounded-full 
                  bg-gradient-to-br from-[#227736] to-[#28a745] 
                  text-white flex items-center justify-center 
                  text-[10px] font-bold ring-2 ring-[#c8e6d1]"
              >
                SM
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Notices", value: "24", color: "#227736" },
              { label: "Complaints", value: "08", color: "#E67E22" },
              { label: "Claims", value: "03", color: "#28a745" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.12, type: "spring", stiffness: 200 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="bg-white rounded-lg border border-[#e2ebe6] p-2.5 
                  cursor-default transition-colors hover:border-[#227736]/30"
              >
                <p className="text-[9px] text-[#5a6e63] font-semibold 
                  uppercase tracking-wider">
                  {s.label}
                </p>
                <div className="flex items-end justify-between mt-0.5">
                  <p className="text-base font-bold text-[#0f1d17]">{s.value}</p>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.01 }}
            className="relative bg-white rounded-lg border border-[#e2ebe6] p-3 mb-2.5 overflow-hidden"
          >
            <motion.div
              animate={{ scaleY: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-0 bottom-0 w-1 
                bg-gradient-to-b from-[#227736] to-[#E67E22]"
            />
            <div className="pl-2">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={11} className="text-[#227736]" />
                <span className="text-[9px] font-bold text-[#5a6e63] 
                  uppercase tracking-wider">
                  Latest Notice
                </span>
              </div>
              <p className="text-xs font-bold text-[#0f1d17]">Mid-Term Exam Schedule</p>
              <div className="mt-2 pt-2 border-t border-[#e2ebe6] flex items-center gap-1.5">
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={10} className="text-[#E67E22]" />
                </motion.div>
                <span className="text-[9px] font-bold text-[#227736]">
                  AI Summary available
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.35 }}
            className="bg-white rounded-lg border border-[#e2ebe6] p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider">
                Recent Activity
              </p>
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#28a745]">
                <TrendingUp size={9} /> +24%
              </span>
            </div>
            <div className="space-y-1.5">
              {[70, 45, 90, 60].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#227736]"
                  />
                  <div className="flex-1 h-1.5 rounded-full bg-[#e2ebe6] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${w}%` }}
                      transition={{ delay: 1.5 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#227736] to-[#28a745]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, x: -30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
        whileHover={{ y: -4, scale: 1.03 }}
        className="absolute -left-6 md:-left-10 top-28 hidden md:block 
          bg-white rounded-xl border border-[#e2ebe6] 
          shadow-xl shadow-black/20 p-3 w-52 z-30"
      >
        <div className="flex items-start gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-7 h-7 rounded-lg bg-[#eaf6ee] 
              flex items-center justify-center shrink-0"
          >
            <CheckCircle2 size={13} className="text-[#227736]" />
          </motion.div>
          <div>
            <p className="text-[10px] font-bold text-[#0f1d17]">
              Complaint resolved
            </p>
            <p className="text-[9px] text-[#5a6e63] mt-0.5">
              Wi-Fi · Lab 3 · just now
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating notice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
        whileHover={{ y: 4, scale: 1.03 }}
        className="absolute -right-6 md:-right-10 bottom-20 hidden md:block 
          bg-white rounded-xl border border-[#e2ebe6] 
          shadow-xl shadow-black/20 p-3 w-52 z-30"
      >
        <div className="flex items-start gap-2">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-7 h-7 rounded-lg bg-[#fdf2e3] 
              flex items-center justify-center shrink-0"
          >
            <Bell size={13} className="text-[#E67E22]" />
          </motion.div>
          <div>
            <p className="text-[10px] font-bold text-[#0f1d17]">
              New notice posted
            </p>
            <p className="text-[9px] text-[#5a6e63] mt-0.5">
              Scholarship · 2 min ago
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("notices");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#0f1d17] overflow-x-hidden">

        {/* ================= HERO ================= */}
        <section className="relative bg-gradient-to-b from-[#165127] to-[#1c6430] text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Orange glow corner */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full 
              bg-[#E67E22]/50 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-7xl mx-auto px-6 pt-14 md:pt-20 pb-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* LEFT */}
              <motion.div variants={container} initial="hidden" animate="show">
                <motion.div
                  variants={item}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white/10 backdrop-blur-sm border border-white/15 mb-6"
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
                  />
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                    The Smarter Campus Platform
                  </span>
                </motion.div>

                <motion.h1
                  variants={item}
                  className="text-[40px] md:text-[52px] lg:text-[60px] font-extrabold 
                    leading-[1.05] tracking-[-0.035em] text-white"
                >
                  Everything your
                  <br />
                  <span className="relative inline-block">
                    campus needs.
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left 
                        bg-[#E67E22] rounded-full"
                    />
                  </span>
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-6 text-sm md:text-base text-white/75 max-w-md 
                    leading-relaxed"
                >
                  Notices, complaints, Lost & Found, and AI-powered
                  insights — connected in one platform built for universities.
                </motion.p>

                <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                  <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button href="/register" size="lg"
                      className="!bg-white !text-[#227736] hover:!bg-[#eaf6ee] 
                        !shadow-xl !shadow-black/20 !font-bold">
                      Get Started <ArrowRight size={16} />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button href="/services" variant="ghost" size="lg"
                      className="!text-white !border !border-white/30 
                        hover:!bg-white/10 hover:!border-[#E67E22]/60">
                      <Play size={14} /> Explore Platform
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={item}
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 
                    text-xs md:text-sm text-white/80"
                >
                  {["Smart Notices", "Issue Tracking", "AI-Powered"].map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={13} className="text-[#E67E22]" />
                      <span className="font-medium">{label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* RIGHT */}
              <div className="lg:pl-4">
                <HeroDashboardCard />
              </div>
            </div>
          </div>
        </section>

        {/* ================= BUILT FOR ================= */}
        <section className="py-12 bg-white border-b border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold text-[#5a6e63] 
              uppercase tracking-[0.25em] mb-8">
              Built for universities
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-6">
              {["Students", "Faculty", "Administration", "Staff"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 text-[#5a6e63] 
                    hover:text-[#227736] transition-colors duration-300 cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                  <span className="text-base md:text-lg font-bold tracking-tight">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRIMARY FEATURES ================= */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-14"
            >
              <p className="text-[11px] font-bold text-[#227736] 
                uppercase tracking-[0.22em] mb-4">
                Core Modules
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold 
                text-[#0f1d17] tracking-[-0.03em] leading-[1.1]">
                Three tools, one
                <br />
                <span className="text-[#227736]">connected platform.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {primaryFeatures.map((f, i) => {
                const Icon = f.icon;
                const Preview = previewMap[f.preview];
                const isOrange = i === 1;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className={`group p-5 rounded-2xl bg-white border transition-all duration-300 ${
                      isOrange
                        ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-xl hover:shadow-[#E67E22]/10"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isOrange
                            ? "bg-[#fdf2e3]"
                            : "bg-[#eaf6ee]"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={isOrange ? "text-[#E67E22]" : "text-[#227736]"}
                        />
                      </motion.div>
                      <h3 className="font-bold text-[#0f1d17] text-sm">{f.title}</h3>
                    </div>
                    <p className="text-xs text-[#5a6e63] leading-relaxed mb-4">{f.desc}</p>
                    <Preview />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SECONDARY FEATURES ================= */}
        <section className="py-14 bg-[#f8faf9] border-y border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {secondaryFeatures.map((f, i) => {
                const Icon = f.icon;
                const isOrange = i % 2 === 1;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`w-8 h-8 rounded-lg bg-white border flex items-center justify-center shrink-0 transition-colors ${
                        isOrange
                          ? "border-[#E67E22]/30 group-hover:border-[#E67E22]/60"
                          : "border-[#e2ebe6] group-hover:border-[#227736]/40"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={isOrange ? "text-[#E67E22]" : "text-[#227736]"}
                      />
                    </motion.div>
                    <div>
                      <p className="text-sm font-bold text-[#0f1d17]">{f.title}</p>
                      <p className="text-xs text-[#5a6e63] mt-0.5 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PRODUCT SHOWCASE ================= */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-12"
            >
              <p className="text-[11px] font-bold text-[#227736] 
                uppercase tracking-[0.22em] mb-4">
                Product Preview
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold 
                text-[#0f1d17] tracking-[-0.03em] leading-[1.1]">
                See CampusConnect
                <br />
                <span className="text-[#227736]">in action.</span>
              </h2>
            </motion.div>

            <div className="flex flex-wrap gap-2 mb-8">
              {productTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                      text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "bg-[#227736] text-white shadow-lg shadow-[#227736]/20"
                          : "bg-[#f8faf9] text-[#5a6e63] hover:bg-[#eaf6ee] hover:text-[#227736]"
                      }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-[#e2ebe6] overflow-hidden bg-[#f8faf9]"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 
                bg-white border-b border-[#e2ebe6]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#227736]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28a745]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E67E22]" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-[#f8faf9] rounded-md px-3 py-1 text-[10px] 
                    text-[#5a6e63] max-w-sm mx-auto text-center 
                    border border-[#e2ebe6]">
                    app.campusconnect.edu/{activeTab}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {activeTab === "notices" && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Mid-Term Exam Schedule", tag: "EXAM", pinned: true, ai: "Exams begin 20 Oct. Bring ID card and fee slip.", accent: true },
                      { title: "Scholarship Applications Open", tag: "FEE", pinned: false, ai: "Merit-based. CGPA 3.5+. Deadline 15 Oct.", accent: false },
                      { title: "Annual Sports Gala 2025", tag: "EVENT", pinned: false, ai: "5-10 Nov. Register with Sports Dept.", accent: true },
                    ].map((n, i) => (
                      <div key={i} className="bg-white rounded-xl border 
                        border-[#e2ebe6] p-4 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 
                            rounded-full text-white ${
                              n.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                            }`}>
                            {n.tag}
                          </span>
                          {n.pinned && (
                            <span className="text-[9px] font-bold text-[#227736]">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#0f1d17]">{n.title}</p>
                        <div className="mt-3 pt-3 border-t border-[#e2ebe6]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={10} className="text-[#E67E22]" />
                            <span className="text-[9px] font-bold text-[#227736]">
                              AI SUMMARY
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5a6e63] leading-relaxed">
                            {n.ai}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "complaints" && (
                  <div className="bg-white rounded-xl border border-[#e2ebe6] overflow-hidden">
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-[#f8faf9] 
                      border-b border-[#e2ebe6] text-[10px] font-bold 
                      text-[#5a6e63] uppercase tracking-wider">
                      <div className="col-span-5">Complaint</div>
                      <div className="col-span-3">Category</div>
                      <div className="col-span-4">Status</div>
                    </div>
                    {[
                      { title: "Wi-Fi not working in Lab 3", cat: "Wi-Fi", status: "In Progress", color: "bg-[#E67E22]" },
                      { title: "Broken chairs in Classroom 12", cat: "Furniture", status: "Submitted", color: "bg-[#5a6e63]" },
                      { title: "Fan not working in Room 8", cat: "Electricity", status: "Resolved", color: "bg-[#227736]" },
                    ].map((c, i) => (
                      <div key={i} className="grid grid-cols-12 px-4 py-3 
                        border-b border-[#e2ebe6] last:border-0 
                        hover:bg-[#f8faf9] transition-colors">
                        <div className="col-span-5 text-xs font-semibold text-[#0f1d17]">
                          {c.title}
                        </div>
                        <div className="col-span-3 text-xs text-[#5a6e63]">{c.cat}</div>
                        <div className="col-span-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 
                            rounded-full text-white ${c.color}`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "lost-found" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { type: "LOST", title: "Black Wallet", loc: "Cafeteria, Block B", date: "23 Sep", accent: true },
                      { type: "FOUND", title: "Blue Water Bottle", loc: "Library Hall", date: "24 Sep", accent: false },
                    ].map((it, i) => (
                      <div key={i} className="bg-white rounded-xl border 
                        border-[#e2ebe6] p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 
                            rounded-full text-white ${
                              it.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                            }`}>
                            {it.type}
                          </span>
                          <span className="text-[10px] text-[#5a6e63]">{it.date}</span>
                        </div>
                        <p className="text-sm font-bold text-[#0f1d17]">{it.title}</p>
                        <p className="text-xs text-[#5a6e63] mt-1">{it.loc}</p>
                        {it.type === "FOUND" && (
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 w-full text-xs font-bold 
                              text-white bg-[#227736] hover:bg-[#1c6430] 
                              py-2 rounded-lg transition-all duration-300"
                          >
                            Claim this item
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-20 md:py-28 bg-[#f8faf9]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-14"
            >
              <p className="text-[11px] font-bold text-[#227736] 
                uppercase tracking-[0.22em] mb-4">
                How it works
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold 
                text-[#0f1d17] tracking-[-0.03em] leading-[1.1]">
                A simple, four-step
                <br />
                <span className="text-[#227736]">workflow.</span>
              </h2>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-6 left-12 right-12 
                h-px bg-gradient-to-r from-transparent via-[#c8e6d1] to-transparent" />

              <div className="grid md:grid-cols-4 gap-8 md:gap-4">
                {howItWorks.map((s, i) => {
                  const Icon = s.icon;
                  const isOrange = i % 2 === 1;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="relative group"
                    >
                      <div className="relative z-10 flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.05 }}
                          className={`w-12 h-12 rounded-full bg-white 
                            border-2 flex items-center justify-center 
                            shadow-sm transition-colors ${
                              isOrange
                                ? "border-[#E67E22] group-hover:border-[#227736]"
                                : "border-[#227736] group-hover:border-[#E67E22]"
                            }`}
                        >
                          <Icon
                            size={18}
                            className={`transition-colors ${
                              isOrange
                                ? "text-[#E67E22] group-hover:text-[#227736]"
                                : "text-[#227736] group-hover:text-[#E67E22]"
                            }`}
                          />
                        </motion.div>
                        <span className="text-xs font-black text-[#c8e6d1] tracking-tighter">
                          0{i + 1}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#0f1d17] text-base">{s.title}</h3>
                      <p className="text-sm text-[#5a6e63] mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROJECT STATS ================= */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-[11px] font-bold text-[#227736] 
                uppercase tracking-[0.22em] mb-4">
                Platform Overview
              </p>
              <h2 className="text-[32px] md:text-[40px] font-extrabold 
                text-[#0f1d17] tracking-[-0.03em]">
                What <span className="text-[#227736]">CampusConnect</span> includes.
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {projectStats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className={`group p-6 rounded-2xl border transition-all duration-300 
                      text-center bg-white ${
                        s.accent
                          ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-xl hover:shadow-[#E67E22]/10"
                          : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/10"
                      }`}
                  >
                    <motion.div
                      whileHover={{ rotate: -8, scale: 1.1 }}
                      className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-4 
                        transition-colors duration-300 ${
                          s.accent
                            ? "bg-[#fdf2e3] group-hover:bg-[#E67E22]"
                            : "bg-[#eaf6ee] group-hover:bg-[#227736]"
                        }`}
                    >
                      <Icon
                        size={18}
                        className={`transition-colors duration-300 ${
                          s.accent
                            ? "text-[#E67E22] group-hover:text-white"
                            : "text-[#227736] group-hover:text-white"
                        }`}
                      />
                    </motion.div>
                    <p className="text-3xl font-extrabold text-[#0f1d17] tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs text-[#5a6e63] mt-1.5 font-medium">
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PURPOSE ================= */}
        <section className="py-20 md:py-28 bg-[#227736] text-white 
          relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Orange glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full 
              bg-[#E67E22]/40 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-bold text-white/70 
                uppercase tracking-[0.22em] mb-5">
                Why we built it
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold 
                text-white tracking-[-0.03em] leading-[1.15]">
                Designed around real
                <br />
                <span className="relative inline-block">
                  campus problems.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left 
                      bg-[#E67E22] rounded-full"
                  />
                </span>
              </h2>
              <p className="mt-8 text-white/75 text-base md:text-lg max-w-2xl mx-auto 
                leading-relaxed">
                Students were missing important notices, issues were going
                unreported, and lost items were never reunited with their
                owners. CampusConnect brings all of it under one roof.
              </p>

              <div className="mt-10 flex flex-wrap justify-center items-center 
                gap-x-8 gap-y-4 text-sm text-white/85">
                {[
                  "Centralized communication",
                  "Transparent tracking",
                  "AI-powered clarity",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-[#E67E22]" />
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#e2ebe6] 
                bg-[#f8faf9] px-8 py-14 md:px-14 md:py-16 text-center relative overflow-hidden"
            >
              {/* Orange accent corner */}
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full 
                bg-[#E67E22]/10 blur-2xl" />

              <div className="relative">
                <h2 className="text-[32px] md:text-[42px] font-extrabold 
                  text-[#0f1d17] tracking-[-0.03em] leading-[1.15]">
                  Your campus.
                  <br />
                  <span className="text-[#227736]">One connected platform.</span>
                </h2>
                <p className="mt-5 text-[#5a6e63] text-base md:text-lg max-w-xl mx-auto">
                  Start exploring CampusConnect and see how it fits your
                  university's needs.
                </p>

                <div className="mt-9 flex flex-wrap gap-3 justify-center">
                  <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button href="/register" variant="primary" size="lg">
                      Get Started <ArrowRight size={16} />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Button href="/services" variant="outline" size="lg">
                      Explore Platform <ChevronRight size={16} />
                    </Button>
                  </motion.div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center 
                  gap-6 text-xs text-[#5a6e63]">
                  <span className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#227736]" /> No setup cost
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock size={12} className="text-[#227736]" /> Secure by default
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe size={12} className="text-[#227736]" /> Web-based
                  </span>
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