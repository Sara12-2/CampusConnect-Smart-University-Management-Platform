"use client";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion, type Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell, MessageSquare, Search, ShieldCheck, Users, GraduationCap,
  ArrowRight, CheckCircle2, Sparkles, TrendingUp,
  Play, Lock, Globe, Check, ChevronRight,
  FileCheck, Clock, Send, Home, User, ChevronDown, Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/* ============================================================
   TYPES
   ============================================================ */

interface Notice {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  priority?: string;
  is_published?: boolean;
  created_at?: string;
}

/* ============================================================
   STATIC DATA
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
  { icon: FileCheck, value: 3, label: "Core Modules", accent: false, isText: null as string | null },
  { icon: Sparkles, value: 0, label: "AI-Powered Summaries", accent: true, isText: "AI" as string | null },
  { icon: Clock, value: 0, label: "Real-Time Updates", accent: false, isText: "Live" as string | null },
  { icon: ShieldCheck, value: 2, label: "Access Roles", accent: true, isText: null as string | null },
];

const faqs = [
  {
    q: "Do I need to pay to use CampusConnect?",
    a: "No. CampusConnect is completely free for students, faculty, and university staff. There are no setup costs or hidden fees.",
  },
  {
    q: "How does the AI summary feature work?",
    a: "Long university notices are automatically condensed into clear, actionable summaries using AI. You can read the key points in seconds while still having access to the full original notice.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. Passwords are securely hashed, and access is role-based so students can only see their own submissions.",
  },
  {
    q: "Can I use CampusConnect on my phone?",
    a: "Absolutely. CampusConnect is fully responsive and works on desktop, tablet, and mobile devices. The interface adapts to any screen size.",
  },
  {
    q: "Who can see my complaints?",
    a: "Only you and the assigned university staff can see your complaint details. Other students cannot view your submissions.",
  },
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ============================================================
   UTILITIES
   ============================================================ */

function CountUp({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{count}</>;
}

/* ============================================================
   UI PREVIEWS (Used inside primary features)
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
          { label: "Submitted", done: true, active: false },
          { label: "Assigned to IT", done: true, active: false },
          { label: "In Progress", done: true, active: true },
          { label: "Resolved", done: false, active: false },
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
        ].map((it, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#f8faf9] border border-[#e2ebe6]">
            <div
              className={`text-[8px] font-black px-1.5 py-0.5 rounded text-white ${
                it.accent ? "bg-[#E67E22]" : "bg-[#227736]"
              }`}
            >
              {it.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#0f1d17] truncate">
                {it.title}
              </p>
              <p className="text-[9px] text-[#5a6e63]">{it.loc}</p>
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

const previewMap: Record<string, () => React.JSX.Element> = {
  notice: NoticePreview,
  complaint: ComplaintPreview,
  "lost-found": LostFoundPreview,
};

/* ============================================================
   PHONE MOCKUP WITH AUTO-SCROLL
   ============================================================ */

function PhoneMockup() {
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollDist, setScrollDist] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (contentRef.current && screenRef.current) {
        const cH = contentRef.current.scrollHeight;
        const sH = screenRef.current.clientHeight;
        setScrollDist(Math.max(0, cH - sH));
      }
    };
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center min-h-[600px]">
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[420px] h-[520px] rounded-full blur-3xl
          bg-gradient-to-br from-[#28a745]/40 via-[#227736]/20 to-[#E67E22]/30
          pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
        whileHover={{ y: -8, rotate: 0 }}
        className="relative z-10 scale-[0.85] sm:scale-95 md:scale-100 origin-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative w-[300px] h-[610px] rounded-[42px]
          bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a]
          p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]
          ring-1 ring-black/40">

          <div className="absolute -right-[3px] top-[140px] w-[3px] h-[70px]
            bg-[#2a2a2a] rounded-r" />
          <div className="absolute -right-[3px] top-[220px] w-[3px] h-[40px]
            bg-[#2a2a2a] rounded-r" />

          <div className="absolute -left-[3px] top-[130px] w-[3px] h-[35px]
            bg-[#2a2a2a] rounded-l" />
          <div className="absolute -left-[3px] top-[180px] w-[3px] h-[60px]
            bg-[#2a2a2a] rounded-l" />
          <div className="absolute -left-[3px] top-[255px] w-[3px] h-[60px]
            bg-[#2a2a2a] rounded-l" />

          <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-white">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30
              w-[100px] h-[26px] rounded-full bg-black
              flex items-center justify-end pr-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />
            </div>

            <div className="absolute top-0 left-0 right-0 z-20 pt-3 px-6
              flex items-center justify-between text-[9px] font-bold text-[#0f1d17]">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-2 border border-[#0f1d17] rounded-sm" />
                <span className="inline-block w-3 h-2 border border-[#0f1d17] rounded-sm" />
                <span className="inline-block w-4 h-2 bg-[#0f1d17] rounded-sm" />
              </span>
            </div>

            <div
              ref={screenRef}
              className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
            >
              <motion.div
                ref={contentRef}
                animate={{
                  y: shouldReduceMotion ? 0 : scrollDist > 0 ? [0, -scrollDist, 0] : 0,
                }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
                className="pt-10 pb-16"
              >
                <div className="px-5 pt-2 pb-4 bg-gradient-to-br from-[#165127] to-[#227736] text-white
                  rounded-b-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[9px] text-white/70">Good morning,</p>
                      <p className="text-sm font-bold">Sara Manzoor</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center relative">
                        <Bell size={12} />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                          bg-[#E67E22] border border-[#165127]" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E67E22] to-[#d4701a]
                        flex items-center justify-center text-[10px] font-bold">
                        SM
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15">
                    <Search size={12} className="text-white/60" />
                    <span className="text-[10px] text-white/60">Search notices, items...</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                      { label: "Notices", value: "24" },
                      { label: "Complaints", value: "08" },
                      { label: "Claims", value: "03" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/10">
                        <p className="text-[8px] text-white/60 uppercase tracking-wider">{s.label}</p>
                        <p className="text-sm font-bold">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 mt-4">
                  <p className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider mb-2">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: Bell, label: "Notices", color: "#227736", bg: "#eaf6ee" },
                      { icon: MessageSquare, label: "Complain", color: "#E67E22", bg: "#fdf2e3" },
                      { icon: Search, label: "Lost", color: "#227736", bg: "#eaf6ee" },
                      { icon: User, label: "Profile", color: "#E67E22", bg: "#fdf2e3" },
                    ].map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: a.bg }}
                          >
                            <Icon size={16} style={{ color: a.color }} />
                          </div>
                          <span className="text-[8px] font-semibold text-[#0f1d17]">{a.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-5 mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider">
                      Latest Notice
                    </p>
                    <span className="text-[9px] font-bold text-[#227736]">See all</span>
                  </div>
                  <div className="rounded-2xl border border-[#e2ebe6] bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#eaf6ee] border-b border-[#c8e6d1]">
                      <div className="flex items-center gap-1.5">
                        <Bell size={11} className="text-[#227736]" />
                        <span className="text-[9px] font-bold text-[#227736] uppercase tracking-wider">Exam</span>
                      </div>
                      <span className="text-[8px] font-bold text-white bg-[#E67E22] px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-[#0f1d17]">Mid-Term Exam Schedule</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Sparkles size={9} className="text-[#E67E22]" />
                        <span className="text-[8px] font-bold text-[#E67E22] uppercase tracking-wider">
                          AI Summary
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5a6e63] mt-1 leading-relaxed">
                        Exams begin 20 Oct 2025. Bring original ID card and fee clearance slip.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider">
                      My Complaints
                    </p>
                    <span className="text-[9px] font-bold text-[#227736]">See all</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: "Wi-Fi not working in Lab 3", status: "In Progress", color: "#E67E22", bg: "#fdf2e3" },
                      { title: "Broken chairs in Class 12", status: "Resolved", color: "#227736", bg: "#eaf6ee" },
                    ].map((c, i) => (
                      <div key={i} className="rounded-xl border border-[#e2ebe6] bg-white px-3 py-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-semibold text-[#0f1d17] flex-1">
                            {c.title}
                          </p>
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{ color: c.color, backgroundColor: c.bg }}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider">
                      Lost & Found
                    </p>
                    <span className="text-[9px] font-bold text-[#227736]">See all</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { type: "LOST", title: "Black Wallet", loc: "Cafeteria · 2h ago", accent: true },
                      { type: "FOUND", title: "Blue Water Bottle", loc: "Library · 5h ago", accent: false },
                    ].map((it, i) => (
                      <div key={i} className="rounded-xl border border-[#e2ebe6] bg-white p-3 flex items-center gap-2">
                        <div className={`text-[8px] font-black px-1.5 py-1 rounded text-white ${it.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}>
                          {it.type}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-[#0f1d17] truncate">{it.title}</p>
                          <p className="text-[9px] text-[#5a6e63]">{it.loc}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#b0bfb7]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 mt-5">
                  <div className="rounded-2xl bg-gradient-to-br from-[#227736] to-[#28a745] p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Quick Report
                    </p>
                    <p className="text-sm font-bold mt-1">Having an issue?</p>
                    <p className="text-[10px] opacity-80 mt-0.5">Submit a complaint in 30 seconds</p>
                    <button className="mt-3 w-full bg-white text-[#227736] rounded-xl py-2 text-[10px] font-bold">
                      Submit Complaint
                    </button>
                  </div>
                </div>

                <div className="h-4" />
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 h-[60px]
                bg-white/95 backdrop-blur-md border-t border-[#e2ebe6]
                flex items-center justify-around px-4">
                {[
                  { icon: Home, label: "Home", active: true },
                  { icon: Bell, label: "Notices", active: false },
                  { icon: MessageSquare, label: "Issues", active: false },
                  { icon: User, label: "Profile", active: false },
                ].map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <Icon
                        size={16}
                        className={n.active ? "text-[#227736]" : "text-[#b0bfb7]"}
                      />
                      <span
                        className={`text-[8px] font-bold ${
                          n.active ? "text-[#227736]" : "text-[#b0bfb7]"
                        }`}
                      >
                        {n.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ y: -4, scale: 1.05 }}
          className="absolute -left-12 md:-left-20 top-32 hidden md:block
            bg-white rounded-2xl border border-[#e2ebe6]
            shadow-xl shadow-black/20 p-3 w-44 z-20
            ring-1 ring-[#227736]/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eaf6ee] flex items-center justify-center">
              <CheckCircle2 size={14} className="text-[#227736]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#0f1d17]">Complaint resolved</p>
              <p className="text-[9px] text-[#5a6e63]">just now</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          whileHover={{ y: 4, scale: 1.05 }}
          className="absolute -right-12 md:-right-20 bottom-32 hidden md:block
            bg-white rounded-2xl border border-[#e2ebe6]
            shadow-xl shadow-black/20 p-3 w-44 z-20
            ring-1 ring-[#E67E22]/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fdf2e3] flex items-center justify-center">
              <Sparkles size={14} className="text-[#E67E22]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#0f1d17]">AI Summary ready</p>
              <p className="text-[9px] text-[#5a6e63]">2 min ago</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */

function FaqItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-[#e2ebe6] rounded-xl bg-white overflow-hidden transition-all hover:border-[#227736]/30"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
      >
        <span className="text-sm md:text-base font-bold text-[#0f1d17]">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-[#227736] shrink-0" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm text-[#5a6e63] leading-relaxed">
          {faq.a}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("notices");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState(false);

  // Fetch latest notices from API
  useEffect(() => {
    let isMounted = true;
    const fetchNotices = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch("http://127.0.0.1:8000/api/notices", {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (isMounted) {
          setNotices(Array.isArray(data) ? data.slice(0, 3) : []);
          setNoticesError(false);
        }
      } catch {
        if (isMounted) setNoticesError(true);
      } finally {
        if (isMounted) setNoticesLoading(false);
      }
    };
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

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

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full
              bg-[#E67E22]/50 blur-3xl pointer-events-none"
          />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

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
                      transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] as const }}
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
                  className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center gap-5"
                >
                  <div className="flex -space-x-2">
                    {["SM", "AK", "RH", "FA"].map((initials, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ y: -2, scale: 1.1, zIndex: 10 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E67E22] to-[#d4701a]
                          border-2 border-[#165127] flex items-center justify-center
                          text-[10px] font-bold text-white cursor-default"
                      >
                        {initials}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Trusted by students</p>
                    <p className="text-white/60 mt-0.5">across multiple departments</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* RIGHT — Phone mockup */}
              <div className="relative lg:pl-4">
                <PhoneMockup />
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
                    className={`group relative p-5 rounded-2xl bg-white border overflow-hidden
                      transition-all duration-300 ${
                      isOrange
                        ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-xl hover:shadow-[#E67E22]/10"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/10"
                    }`}
                  >
                    <motion.div
                      initial={{ x: "-150%" }}
                      whileHover={{ x: "150%" }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      className="absolute inset-y-0 w-1/2 bg-gradient-to-r
                        from-transparent via-white/60 to-transparent
                        skew-x-12 pointer-events-none"
                    />

                    <div className="relative flex items-center gap-2.5 mb-3">
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isOrange ? "bg-[#fdf2e3]" : "bg-[#eaf6ee]"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={isOrange ? "text-[#E67E22]" : "text-[#227736]"}
                        />
                      </motion.div>
                      <h3 className="font-bold text-[#0f1d17] text-sm">{f.title}</h3>
                    </div>
                    <p className="relative text-xs text-[#5a6e63] leading-relaxed mb-4">{f.desc}</p>
                    <div className="relative">
                      <Preview />
                    </div>
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
                    <div className="relative shrink-0">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className={`w-9 h-9 rounded-lg bg-white border flex items-center justify-center
                          transition-colors ${
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
                      <span
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full
                          text-[8px] font-bold flex items-center justify-center
                          border-2 border-[#f8faf9] text-white ${
                            isOrange ? "bg-[#E67E22]" : "bg-[#227736]"
                          }`}
                      >
                        {i + 1}
                      </span>
                    </div>
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

        {/* ================= PRODUCT SHOWCASE (REAL DATA) ================= */}
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
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-semibold transition-colors duration-300 ${
                      active
                        ? "text-white"
                        : "bg-[#f8faf9] text-[#5a6e63] hover:bg-[#eaf6ee] hover:text-[#227736]"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-[#227736] shadow-lg shadow-[#227736]/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={14} />
                      {tab.label}
                    </span>
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
                  <>
                    {noticesLoading ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl border border-[#e2ebe6] p-4 animate-pulse"
                          >
                            <div className="h-4 bg-[#e2ebe6] rounded mb-3 w-1/3" />
                            <div className="h-3 bg-[#e2ebe6] rounded mb-2 w-3/4" />
                            <div className="h-3 bg-[#e2ebe6] rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : noticesError || notices.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-4">
                          <Bell size={26} className="text-[#227736]" />
                        </div>
                        <h3 className="font-bold text-[#0f1d17]">No notices available yet</h3>
                        <p className="text-sm text-[#5a6e63] mt-1 max-w-sm mx-auto">
                          Notices will appear here once they are published by the administration.
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-4">
                        {notices.map((n) => (
                          <div
                            key={n.id}
                            className="bg-white rounded-xl border border-[#e2ebe6] p-4 hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white bg-[#E67E22]">
                                {n.category || "NOTICE"}
                              </span>
                              {n.priority === "high" && (
                                <span className="text-[9px] font-bold text-[#E67E22]">
                                  Priority
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-[#0f1d17] line-clamp-2">
                              {n.title}
                            </p>
                            <div className="mt-3 pt-3 border-t border-[#e2ebe6]">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles size={10} className="text-[#E67E22]" />
                                <span className="text-[9px] font-bold text-[#227736]">
                                  AI SUMMARY
                                </span>
                              </div>
                              <p className="text-[10px] text-[#5a6e63] leading-relaxed line-clamp-2">
                                {n.summary || n.content?.slice(0, 100) + "..."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
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
                          <Link
                            href="/student/lost-found"
                            className="mt-4 block text-center w-full text-xs font-bold
                              text-white bg-[#227736] hover:bg-[#1c6430]
                              py-2 rounded-lg transition-all duration-300"
                          >
                            Claim this item
                          </Link>
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
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="hidden md:block absolute top-6 left-12 right-12 h-px origin-left
                  bg-gradient-to-r from-[#227736] via-[#E67E22] to-[#227736]"
              />

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
                      {s.isText ? s.isText : <CountUp to={s.value} />}
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

        {/* ================= FAQ ================= */}
        <section className="py-20 md:py-28 bg-[#f8faf9]">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-[11px] font-bold text-[#227736]
                uppercase tracking-[0.22em] mb-4">
                FAQ
              </p>
              <h2 className="text-[32px] md:text-[42px] font-extrabold
                text-[#0f1d17] tracking-[-0.03em] leading-[1.1]">
                Frequently asked
                <br />
                <span className="text-[#227736]">questions.</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} index={i} />
              ))}
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
                    transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
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
              className="rounded-2xl p-[1.5px] bg-gradient-to-br from-[#227736] via-[#e2ebe6] to-[#E67E22]
                shadow-xl shadow-[#227736]/5"
            >
              <div className="rounded-2xl bg-[#f8faf9] px-8 py-14 md:px-14 md:py-16 text-center relative overflow-hidden">
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
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}