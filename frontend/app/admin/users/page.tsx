"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Bell, MessageSquare, Search, FileCheck, UserCog,
  TrendingUp, ArrowRight, Clock, Sparkles,
} from "lucide-react";
import {
  mockNotices, mockComplaints, mockLostFound, mockClaims,
} from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

/* ============================================================
   STATS
   ============================================================ */

const stats = [
  {
    label: "Users",
    value: "5.2k",
    icon: Users,
    accent: false,
    change: "+12%",
    trend: "up" as const,
    href: "/admin/users",
    spark: [3, 4, 4, 5, 6, 6, 8],
  },
  {
    label: "Notices",
    value: mockNotices.length,
    icon: Bell,
    accent: false,
    change: "+3",
    trend: "up" as const,
    href: "/admin/notices",
    spark: [2, 3, 3, 4, 4, 5, 6],
  },
  {
    label: "Complaints",
    value: mockComplaints.filter((c) => c.status !== "resolved").length,
    icon: MessageSquare,
    accent: true,
    change: "-5%",
    trend: "down" as const,
    href: "/admin/complaints",
    spark: [8, 7, 7, 6, 6, 5, 4],
  },
  {
    label: "Lost & Found",
    value: mockLostFound.length,
    icon: Search,
    accent: false,
    change: "+8",
    trend: "up" as const,
    href: "/admin/lost-found",
    spark: [4, 5, 5, 6, 7, 7, 9],
  },
  {
    label: "Claims",
    value: mockClaims.filter((c) => c.status === "pending").length,
    icon: FileCheck,
    accent: true,
    change: "+2",
    trend: "up" as const,
    href: "/admin/claims",
    spark: [1, 2, 2, 3, 4, 3, 5],
  },
  {
    label: "Staff",
    value: 42,
    icon: UserCog,
    accent: false,
    change: "+1",
    trend: "up" as const,
    href: "/admin/staff",
    spark: [36, 37, 38, 39, 40, 41, 42],
  },
];

const quickActions = [
  { icon: Bell, label: "Create Notice", href: "/admin/notices", accent: false },
  {
    icon: FileCheck,
    label: "Review Claims",
    href: "/admin/claims",
    accent: true,
    badge: mockClaims.filter((c) => c.status === "pending").length,
  },
  { icon: MessageSquare, label: "Manage Complaints", href: "/admin/complaints", accent: false },
  { icon: UserCog, label: "Staff Directory", href: "/admin/staff", accent: true },
];

/* ============================================================
   SPARKLINE
   ============================================================ */

function Sparkline({ data, accent }: { data: number[]; accent: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 100;
  const H = 20;
  const color = accent ? "#E67E22" : "#227736";

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));

  const path = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-4" preserveAspectRatio="none">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        opacity="0.7"
      />
    </svg>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminDashboard() {
  const pendingClaims = mockClaims.filter((c) => c.status === "pending");

  return (
    <div className="space-y-6">

      {/* ==================== WELCOME ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736]
          p-6 md:p-7 text-white shadow-xl shadow-[#227736]/20 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full
            bg-[#E67E22]/40 blur-3xl pointer-events-none"
        />

        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                Admin Panel
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl
            bg-white/10 backdrop-blur-sm border border-white/20">
            <Clock size={13} className="text-[#E67E22]" />
            <span className="text-xs font-bold">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`group bg-white rounded-2xl border border-[#e2ebe6] p-3.5
                  transition-all duration-300 cursor-pointer
                  ${
                    s.accent
                      ? "hover:border-[#E67E22]/50 hover:shadow-[0_15px_30px_-10px_rgba(230,126,34,0.3)]"
                      : "hover:border-[#227736]/40 hover:shadow-[0_15px_30px_-10px_rgba(34,119,54,0.3)]"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${
                        s.accent
                          ? "bg-[#fdf2e3] text-[#E67E22] border border-[#E67E22]/30"
                          : "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]"
                      }`}
                  >
                    <Icon size={14} strokeWidth={2.2} />
                  </div>
                  <span
                    className={`text-[9px] font-bold flex items-center gap-0.5
                      ${s.trend === "up" ? "text-[#227736]" : "text-[#dc3545]"}`}
                  >
                    <TrendingUp
                      size={9}
                      className={s.trend === "down" ? "rotate-180" : ""}
                    />
                    {s.change}
                  </span>
                </div>

                <p className="text-lg font-extrabold text-[#0f1d17] tracking-tight">
                  {s.value}
                </p>
                <p className="text-[10px] text-[#5a6e63] font-semibold uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>

                <div className="mt-2 -mx-1">
                  <Sparkline data={s.spark} accent={s.accent} />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((q, i) => {
          const Icon = q.icon;
          return (
            <Link key={q.label} href={q.href}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden rounded-2xl bg-white
                  border p-4 transition-all duration-300 cursor-pointer
                  ${
                    q.accent
                      ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-lg hover:shadow-[#E67E22]/15"
                      : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-lg hover:shadow-[#227736]/15"
                  }`}
              >
                {q.badge !== undefined && q.badge > 0 && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold
                    px-1.5 py-0.5 rounded-full bg-[#E67E22] text-white">
                    {q.badge}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      transition-all duration-300
                      ${
                        q.accent
                          ? "bg-[#fdf2e3] border border-[#E67E22]/30 group-hover:bg-[#E67E22] group-hover:border-[#E67E22]"
                          : "bg-[#eaf6ee] border border-[#c8e6d1] group-hover:bg-[#227736] group-hover:border-[#227736]"
                      }`}
                  >
                    <Icon
                      size={17}
                      className={`transition-colors duration-300
                        ${
                          q.accent
                            ? "text-[#E67E22] group-hover:text-white"
                            : "text-[#227736] group-hover:text-white"
                        }`}
                    />
                  </div>

                  <h3 className="flex-1 font-bold text-[#0f1d17] text-xs
                    group-hover:text-[#227736] transition-colors line-clamp-1">
                    {q.label}
                  </h3>

                  <ArrowRight
                    size={13}
                    className={`shrink-0 transition-all duration-300 group-hover:translate-x-0.5
                      ${q.accent
                        ? "text-[#5a6e63]/50 group-hover:text-[#E67E22]"
                        : "text-[#5a6e63]/50 group-hover:text-[#227736]"
                      }`}
                  />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* ==================== RECENT COMPLAINTS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white border border-[#e2ebe6] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fdf2e3] border border-[#E67E22]/30
              flex items-center justify-center">
              <MessageSquare size={13} className="text-[#E67E22]" />
            </div>
            <h2 className="font-bold text-sm text-[#0f1d17]">Recent Complaints</h2>
          </div>
          <Link
            href="/admin/complaints"
            className="group text-[11px] text-[#227736] hover:text-[#1c6430]
              font-semibold flex items-center gap-1"
          >
            View all
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-2">
          {mockComplaints.slice(0, 4).map((c, i) => {
            const statusMap: Record<string, any> = {
              submitted: { bg: "bg-[#f8faf9]", text: "text-[#5a6e63]", border: "border-[#e2ebe6]" },
              "in-progress": { bg: "bg-[#fdf2e3]", text: "text-[#B45A0B]", border: "border-[#E67E22]/40" },
              resolved: { bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]" },
            };
            const cfg = statusMap[c.status] || statusMap.submitted;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className="group flex items-center justify-between gap-3 p-3 rounded-lg
                  border border-[#e2ebe6] hover:border-[#227736]/30
                  hover:bg-[#f8faf9] transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f1d17]
                    group-hover:text-[#227736] transition-colors line-clamp-1">
                    {c.title}
                  </p>
                  <p className="text-[10px] text-[#5a6e63] mt-0.5">
                    {c.studentName} · {formatDate(c.createdAt)}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full
                    border uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  {c.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== PENDING CLAIMS ==================== */}
      {pendingClaims.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#fdf2e3] border border-[#E67E22]/30
                flex items-center justify-center">
                <FileCheck size={13} className="text-[#E67E22]" />
              </div>
              <h2 className="font-bold text-sm text-[#0f1d17]">Pending Claims</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full
                bg-[#E67E22] text-white">
                {pendingClaims.length}
              </span>
            </div>
            <Link
              href="/admin/claims"
              className="group text-[11px] text-[#227736] hover:text-[#1c6430]
                font-semibold flex items-center gap-1"
            >
              View all
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {pendingClaims.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-[#e2ebe6]
                  hover:border-[#E67E22]/40 hover:bg-[#fdf2e3]/20
                  transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0f1d17]">
                      {c.claimantName}
                    </p>
                    <p className="text-[10px] text-[#5a6e63] line-clamp-1 mt-0.5">
                      {c.proof}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#e2ebe6]">
                  <button
                    className="flex-1 py-1.5 rounded-lg bg-[#227736] text-white text-[10px] font-bold
                      hover:bg-[#1c6430] transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 py-1.5 rounded-lg bg-white text-[#dc3545] text-[10px] font-bold
                      border border-[#dc3545]/30 hover:bg-[#fdeaea] transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}