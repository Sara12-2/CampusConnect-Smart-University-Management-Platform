"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Bell, MessageSquare, Search, FileCheck, UserCog,
  TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Clock,
  ShieldCheck, Activity, Zap, Sparkles, Building2, Inbox,
  ChevronRight, BarChart3, Layers, Eye,
} from "lucide-react";
import {
  mockNotices, mockComplaints, mockLostFound, mockClaims,
} from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

/* ============================================================
   STATUS CONFIG
   ============================================================ */
const complaintStatusConfig: Record<string, {
  icon: typeof Clock;
  bg: string;
  text: string;
  border: string;
  bar: string;
}> = {
  submitted: {
    icon: Inbox,
    bg: "bg-[#f8faf9]",
    text: "text-[#5a6e63]",
    border: "border-[#e2ebe6]",
    bar: "bg-[#5a6e63]",
  },
  assigned: {
    icon: UserCog,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
  "in-progress": {
    icon: Clock,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  resolved: {
    icon: CheckCircle2,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#28a745]",
  },
};

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: "5,240",
      icon: Users,
      accent: false,
      change: "+12%",
      trend: "up" as const,
      href: "/admin/users",
    },
    {
      label: "Active Notices",
      value: mockNotices.length,
      icon: Bell,
      accent: false,
      change: "+3",
      trend: "up" as const,
      href: "/admin/notices",
    },
    {
      label: "Open Complaints",
      value: mockComplaints.filter((c) => c.status !== "resolved").length,
      icon: MessageSquare,
      accent: true,
      change: "-5%",
      trend: "down" as const,
      href: "/admin/complaints",
    },
    {
      label: "Lost & Found",
      value: mockLostFound.length,
      icon: Search,
      accent: false,
      change: "+8",
      trend: "up" as const,
      href: "/admin/lost-found",
    },
    {
      label: "Pending Claims",
      value: mockClaims.filter((c) => c.status === "pending").length,
      icon: FileCheck,
      accent: true,
      change: "+2",
      trend: "up" as const,
      href: "/admin/claims",
    },
    {
      label: "Staff Members",
      value: "42",
      icon: UserCog,
      accent: false,
      change: "+1",
      trend: "up" as const,
      href: "/admin/staff",
    },
  ];

  const quickActions = [
    {
      icon: Bell,
      label: "Create Notice",
      href: "/admin/notices",
      accent: false,
    },
    {
      icon: ShieldCheck,
      label: "Review Claims",
      href: "/admin/claims",
      accent: true,
      badge: mockClaims.filter((c) => c.status === "pending").length.toString(),
    },
    {
      icon: MessageSquare,
      label: "Manage Complaints",
      href: "/admin/complaints",
      accent: false,
    },
    {
      icon: UserCog,
      label: "Staff Directory",
      href: "/admin/staff",
      accent: true,
    },
  ];

  const activity = [
    { icon: Bell, text: "New notice published", meta: "Mid-Term Exam Schedule", time: "2m ago", accent: false },
    { icon: CheckCircle2, text: "Complaint resolved", meta: "Wi-Fi in Lab 3", time: "15m ago", accent: false },
    { icon: FileCheck, text: "Claim submitted", meta: "Blue Water Bottle", time: "1h ago", accent: true },
    { icon: Users, text: "New user registered", meta: "Sara Manzoor", time: "2h ago", accent: false },
  ];

  return (
    <div className="space-y-8">

      {/* ==================== WELCOME BANNER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] 
          p-6 md:p-8 text-white shadow-xl shadow-[#227736]/20 overflow-hidden"
      >
        {/* Mesh pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Animated orange glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full 
            bg-[#E67E22]/40 blur-3xl pointer-events-none"
        />

        {/* Decorative icon */}
        <BarChart3
          size={180}
          strokeWidth={0.6}
          className="absolute -bottom-10 -right-6 text-white/[0.05] 
            pointer-events-none select-none"
        />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
              />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                Administrator Panel
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
            >
              Welcome back, Admin
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/80"
            >
              Full overview of your university platform — users, notices,
              complaints, and more.
            </motion.p>
          </div>

          {/* Date badge */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl 
              bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Clock size={14} className="text-[#E67E22]" />
            <span className="text-xs font-bold">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                  p-4 transition-all duration-300 overflow-hidden cursor-pointer
                  hover:shadow-xl hover:shadow-[#227736]/10 
                  hover:border-[#227736]/30"
              >
                {/* Corner accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                    ${s.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"}`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`relative w-9 h-9 rounded-lg flex items-center justify-center 
                    mb-3 shadow-md 
                    ${
                      s.accent
                        ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white shadow-[#E67E22]/30"
                        : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-[#227736]/30"
                    }`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </motion.div>

                <p className="relative text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                  {s.value}
                </p>
                <p className="relative text-[11px] text-[#5a6e63] mt-0.5 font-medium 
                  line-clamp-1">
                  {s.label}
                </p>

                {/* Trend */}
                <p
                  className={`relative text-[10px] font-bold mt-1.5 
                    flex items-center gap-1 
                    ${s.trend === "up" ? "text-[#227736]" : "text-[#dc3545]"}`}
                >
                  <TrendingUp
                    size={10}
                    className={s.trend === "down" ? "rotate-180" : ""}
                  />
                  {s.change}
                </p>

                {/* Bottom accent line */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 origin-left 
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                    rounded-full ${s.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}
                />
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#0f1d17] tracking-tight 
              flex items-center gap-2">
              <Zap size={18} className="text-[#E67E22]" />
              Quick Actions
            </h2>
            <p className="text-xs text-[#5a6e63] mt-1">
              Jump straight to what you need
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((q, i) => {
            const Icon = q.icon;
            return (
              <Link key={q.label} href={q.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden rounded-2xl 
                    bg-white border p-4 transition-all duration-300 cursor-pointer
                    ${
                      q.accent
                        ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-xl hover:shadow-[#E67E22]/15"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/15"
                    }`}
                >
                  {/* Glow */}
                  <div
                    className={`absolute -right-6 -top-6 w-24 h-24 rounded-full 
                      bg-gradient-to-br blur-2xl opacity-10 
                      group-hover:opacity-25 transition-opacity duration-500 
                      ${q.accent ? "from-[#E67E22] to-[#D35400]" : "from-[#227736] to-[#28a745]"}`}
                  />

                  {/* Badge */}
                  {q.badge && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold 
                      px-1.5 py-0.5 rounded-full bg-[#E67E22] text-white">
                      {q.badge}
                    </span>
                  )}

                  <div className="relative flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center 
                        shrink-0 transition-all duration-300 
                        ${
                          q.accent
                            ? "bg-[#fdf2e3] border border-[#E67E22]/30 group-hover:bg-[#E67E22] group-hover:border-[#E67E22]"
                            : "bg-[#eaf6ee] border border-[#c8e6d1] group-hover:bg-[#227736] group-hover:border-[#227736]"
                        }`}
                    >
                      <Icon
                        size={18}
                        className={`transition-colors duration-300 
                          ${
                            q.accent
                              ? "text-[#E67E22] group-hover:text-white"
                              : "text-[#227736] group-hover:text-white"
                          }`}
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#0f1d17] text-sm 
                        group-hover:text-[#227736] transition-colors line-clamp-1">
                        {q.label}
                      </h3>
                    </div>

                    <ArrowRight
                      size={14}
                      className={`shrink-0 transition-all duration-300 
                        group-hover:translate-x-1 
                        ${q.accent
                          ? "text-[#5a6e63]/50 group-hover:text-[#E67E22]"
                          : "text-[#5a6e63]/50 group-hover:text-[#227736]"
                        }`}
                    />
                  </div>

                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 origin-left 
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                      rounded-full ${q.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== ACTIVITY + MAIN CONTENT ==================== */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ---- Recent Activity ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1 rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1d17] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] 
                flex items-center justify-center">
                <Activity size={14} className="text-[#227736]" />
              </div>
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group relative flex items-start gap-3 p-3 
                    rounded-xl hover:bg-[#f8faf9] transition-all duration-300"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center 
                      shrink-0 shadow-sm border transition-all duration-300
                      ${
                        a.accent
                          ? "bg-[#fdf2e3] border-[#E67E22]/30 text-[#E67E22]"
                          : "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]"
                      }`}
                  >
                    <Icon size={14} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0f1d17] 
                      group-hover:text-[#227736] transition-colors">
                      {a.text}
                    </p>
                    <p className="text-xs text-[#5a6e63] truncate mt-0.5">
                      {a.meta}
                    </p>
                  </div>

                  <span className="text-[10px] text-[#5a6e63] font-mono shrink-0 mt-0.5">
                    {a.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ---- Recent Complaints ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1d17] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#fdf2e3] border border-[#E67E22]/30 
                flex items-center justify-center">
                <AlertCircle size={14} className="text-[#E67E22]" />
              </div>
              Recent Complaints
            </h2>
            <Link
              href="/admin/complaints"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockComplaints.slice(0, 4).map((c, i) => {
              const cfg = complaintStatusConfig[c.status] || complaintStatusConfig.submitted;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  whileHover={{ x: 4 }}
                  className="group relative p-3.5 rounded-xl border border-[#e2ebe6] 
                    hover:border-[#227736]/40 hover:bg-[#f8faf9] 
                    transition-all duration-300 overflow-hidden"
                >
                  {/* Left accent bar */}
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.bar} 
                      scale-y-0 group-hover:scale-y-100 origin-top 
                      transition-transform duration-300`}
                  />

                  <div className="flex items-start justify-between gap-3 pl-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#0f1d17] 
                        group-hover:text-[#227736] transition-colors line-clamp-1">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-[#5a6e63] mt-1">
                        by <span className="font-medium text-[#0f1d17]">{c.studentName}</span>
                        {" · "}
                        {formatDate(c.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center gap-1 
                        text-[10px] font-bold px-2 py-0.5 rounded-full border 
                        uppercase tracking-wider
                        ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <StatusIcon size={10} />
                      {c.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ==================== RECENT NOTICES + PENDING CLAIMS ==================== */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ---- Recent Notices ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1d17] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] 
                flex items-center justify-center">
                <Bell size={14} className="text-[#227736]" />
              </div>
              Recent Notices
            </h2>
            <Link
              href="/admin/notices"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockNotices.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                whileHover={{ x: 4 }}
                className="group relative p-3.5 rounded-xl border border-[#e2ebe6] 
                  hover:border-[#227736]/40 hover:bg-[#f8faf9] 
                  transition-all duration-300 overflow-hidden"
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#227736] 
                    scale-y-0 group-hover:scale-y-100 origin-top 
                    transition-transform duration-300"
                />

                <div className="flex items-start justify-between gap-3 pl-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {n.pinned && (
                        <span className="inline-flex items-center gap-1 
                          text-[9px] font-bold px-1.5 py-0.5 rounded-full 
                          bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/40 
                          uppercase tracking-wider">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm text-[#0f1d17] 
                      group-hover:text-[#227736] transition-colors line-clamp-1">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-[#5a6e63] mt-1 flex items-center gap-1.5">
                      <Building2 size={10} />
                      {n.department}
                      {" · "}
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---- Pending Claims ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1d17] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#fdf2e3] border border-[#E67E22]/30 
                flex items-center justify-center">
                <FileCheck size={14} className="text-[#E67E22]" />
              </div>
              Pending Claims
            </h2>
            <Link
              href="/admin/claims"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockClaims.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl border border-[#e2ebe6] 
                  hover:border-[#E67E22]/40 hover:bg-[#fdf2e3]/30 
                  transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#0f1d17] 
                      flex items-center gap-1.5">
                      <FileCheck size={12} className="text-[#E67E22]" />
                      Claim by {c.claimantName}
                    </p>
                    <p className="text-xs text-[#5a6e63] mt-1 line-clamp-1">
                      {c.proof}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 shrink-0
                    text-[10px] font-bold px-2 py-0.5 rounded-full border 
                    bg-[#fdf2e3] text-[#B45A0B] border-[#E67E22]/40 
                    uppercase tracking-wider">
                    <Clock size={9} />
                    {c.status}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-[#e2ebe6]">
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex-1 flex items-center justify-center gap-1.5 
                      py-2 rounded-lg bg-[#227736] text-white text-xs font-bold 
                      shadow-md shadow-[#227736]/25 
                      hover:bg-[#1c6430] hover:shadow-lg 
                      transition-all duration-300"
                  >
                    <CheckCircle2 size={12} />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex-1 flex items-center justify-center gap-1.5 
                      py-2 rounded-lg bg-white text-[#dc3545] text-xs font-bold 
                      border-2 border-[#dc3545]/30 
                      hover:bg-[#fdeaea] hover:border-[#dc3545]
                      transition-all duration-300"
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ==================== SYSTEM STATUS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="relative rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] 
          p-5 flex items-center justify-between gap-4 overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full 
          bg-[#E67E22]/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-[#eaf6ee] 
            border border-[#c8e6d1] flex items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-[#28a745]/30"
            />
            <Layers size={16} className="relative text-[#227736]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#E67E22]" />
              System Status: All systems operational
            </p>
            <p className="text-xs text-[#5a6e63] mt-1">
              Last checked a few seconds ago · All modules running smoothly
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ x: 3 }}
          className="relative hidden md:flex items-center gap-1.5 text-xs 
            font-bold text-[#227736] cursor-pointer"
        >
          View system health
          <ChevronRight size={12} />
        </motion.div>
      </motion.div>
    </div>
  );
}