"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, FileCheck, ArrowRight, Pin,
  Calendar, Sparkles, CheckCircle2,
  Plus, Upload, MapPin, Gift, Zap, GraduationCap,
  CircleDot, XCircle, Hourglass, TrendingUp, Activity,
  Home, Settings, BookOpen,
} from "lucide-react";
import {
  mockNotices,
  mockComplaints,
  mockLostFound,
  mockClaims,
  mockUser,
} from "@/data/mock-data";
import { formatDate, statusColors, daysLeft } from "@/lib/utils";

export default function StudentDashboard() {
  const recentNotices = mockNotices.slice(0, 3);
  const myComplaints = mockComplaints.slice(0, 3);
  const myClaims = mockClaims.slice(0, 2);
  const myItems = mockLostFound.slice(0, 2);

  const stats = [
    {
      icon: Bell,
      label: "Notices",
      value: mockNotices.length,
      color: "from-[#227736] to-[#28a745]",
      accent: false,
      trend: "+3",
      sparkline: [4, 6, 5, 8, 7, 10, 12],
      shadow: "shadow-[#227736]/30",
    },
    {
      icon: MessageSquare,
      label: "Complaints",
      value: mockComplaints.length,
      color: "from-[#f4a228] to-[#e08a10]",
      accent: true,
      trend: "-1",
      sparkline: [8, 7, 9, 6, 8, 5, 4],
      shadow: "shadow-[#f4a228]/30",
    },
    {
      icon: Search,
      label: "Lost & Found",
      value: mockLostFound.length,
      color: "from-[#227736] to-[#58b277]",
      accent: false,
      trend: "+2",
      sparkline: [3, 5, 4, 6, 8, 7, 9],
      shadow: "shadow-[#227736]/30",
    },
    {
      icon: FileCheck,
      label: "Claims",
      value: mockClaims.length,
      color: "from-[#f4a228] to-[#b86b0a]",
      accent: true,
      trend: "+1",
      sparkline: [1, 2, 2, 3, 4, 3, 5],
      shadow: "shadow-[#f4a228]/30",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "New Complaint", href: "/student/complaints", accent: false },
    { icon: Upload, label: "Report Item", href: "/student/lost-found", accent: true, badge: "NEW" },
    { icon: Bell, label: "Notices", href: "/student/notices", accent: false },
    { icon: Search, label: "Lost & Found", href: "/student/lost-found", accent: true },
  ];

  /* ---------- status icon helper ---------- */
  const statusIcon = (status: string) => {
    if (status === "resolved" || status === "approved")
      return <CheckCircle2 size={12} className="text-[#227736]" />;
    if (status === "in-progress" || status === "pending")
      return <Hourglass size={12} className="text-[#f4a228]" />;
    if (status === "submitted")
      return <CircleDot size={12} className="text-[#5a6e63]" />;
    if (status === "rejected")
      return <XCircle size={12} className="text-[#dc3545]" />;
    return null;
  };

  /* ---------- Mini sparkline component ---------- */
  const Sparkline = ({ data, accent }: { data: number[]; accent: boolean }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const W = 100;
    const H = 30;

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - ((v - min) / range) * H,
    }));

    const path = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    const areaPath = `${path} L ${W} ${H} L 0 ${H} Z`;
    const color = accent ? "#f4a228" : "#227736";
    const gradId = `grad-${accent ? "o" : "g"}-${Math.random().toString(36).slice(2, 6)}`;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} opacity="0.6" />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">

      {/* ==================== WELCOME BANNER (3D) ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.005, rotateX: 1, rotateY: -1 }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127]
          p-6 md:p-8 text-white
          shadow-2xl shadow-[#227736]/30
          hover:shadow-[0_30px_60px_-20px_rgba(34,119,54,0.5)]
          overflow-hidden transition-shadow duration-500"
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

        {/* Orange glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />

        {/* Green glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full
            bg-[#28a745]/40 blur-3xl pointer-events-none"
        />

        {/* Decorative icon */}
        <GraduationCap
          size={180}
          strokeWidth={0.8}
          className="absolute -bottom-10 -right-6 text-white/[0.06]
            pointer-events-none select-none"
        />

        {/* Shine sweep */}
        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            skew-x-12 pointer-events-none"
        />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                bg-white/10 backdrop-blur-md border border-white/20 mb-3"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Live Dashboard
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
            >
              Welcome back, {mockUser.name.split(" ")[0]}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/75 flex items-center gap-2 flex-wrap"
            >
              <span className="inline-flex items-center gap-1">
                <GraduationCap size={13} className="text-[#f4a228]" />
                {mockUser.department}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Semester {mockUser.semester}</span>
            </motion.p>
          </div>

          {/* Mini stats visual — desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="hidden md:flex items-center gap-3"
          >
            {[
              { icon: Activity, label: "Active", value: "3", color: "from-[#58b277] to-[#28a745]" },
              { icon: Hourglass, label: "Pending", value: "2", color: "from-[#f4a228] to-[#e08a10]" },
              { icon: CheckCircle2, label: "Done", value: "8", color: "from-[#227736] to-[#1c6430]" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="relative rounded-2xl bg-white/10 backdrop-blur-md
                    border border-white/20 px-4 py-3 min-w-[88px] text-center
                    shadow-lg shadow-black/10 hover:shadow-xl
                    hover:border-white/30 transition-all duration-300 cursor-default"
                >
                  <Icon size={14} className="text-white/60 mx-auto mb-1" />
                  <p className={`text-2xl font-extrabold bg-gradient-to-br ${s.color}
                    bg-clip-text text-transparent tracking-tight`}>
                    {s.value}
                  </p>
                  <p className="text-[9px] text-white/70 uppercase tracking-wider font-bold mt-0.5">
                    {s.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ==================== STATS (3D cards with sparklines) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const trendUp = s.trend.startsWith("+");
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className={`group relative bg-white rounded-2xl border border-[#e2ebe6]
                p-5 transition-all duration-500 cursor-default overflow-hidden
                ${
                  s.accent
                    ? "hover:border-[#f4a228]/50 hover:shadow-[0_25px_50px_-20px_rgba(244,162,40,0.4)]"
                    : "hover:border-[#227736]/40 hover:shadow-[0_25px_50px_-20px_rgba(34,119,54,0.4)]"
                }`}
            >
              {/* Corner glow */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  ${s.accent ? "bg-[#f4a228]/10" : "bg-[#227736]/10"}`}
              />

              <div className="relative flex items-center justify-between mb-3">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${s.color}
                    text-white flex items-center justify-center
                    shadow-md ${s.shadow} group-hover:shadow-xl transition-shadow duration-500`}
                >
                  <Icon size={20} strokeWidth={2.2} />
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className={`absolute inset-0 rounded-xl ${s.accent ? "bg-[#f4a228]" : "bg-[#227736]"}`}
                  />
                </motion.div>

                {/* Trend badge */}
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full
                    ${
                      trendUp
                        ? "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]"
                        : "bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/40"
                    }`}
                >
                  <TrendingUp size={9} className={trendUp ? "" : "rotate-180"} />
                  {s.trend}
                </span>
              </div>

              <p className="relative text-3xl font-extrabold text-[#0f1d17] tracking-tight">
                {s.value}
              </p>
              <p className="relative text-[10px] text-[#5a6e63] font-semibold uppercase tracking-wider mt-0.5">
                {s.label}
              </p>

              {/* Sparkline */}
              <div className="relative mt-3 -mx-1">
                <Sparkline data={s.sparkline} accent={s.accent} />
              </div>

              {/* Bottom accent line */}
              <span
                className={`absolute bottom-0 left-5 right-5 h-0.5 origin-left
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-500
                  rounded-full ${s.accent ? "bg-[#f4a228]" : "bg-[#227736]"}`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ==================== QUICK ACTIONS (visual grid) ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-extrabold text-[#0f1d17]
            tracking-tight flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap size={20} className="text-[#f4a228]" />
            </motion.div>
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((q, i) => {
            const Icon = q.icon;
            return (
              <Link key={q.label} href={q.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ y: -8, scale: 1.04, rotateX: 3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={`group relative overflow-hidden rounded-2xl
                    bg-white border p-5 aspect-square flex flex-col items-center justify-center
                    transition-all duration-500
                    ${
                      q.accent
                        ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.45)]"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.45)]"
                    }`}
                >
                  {/* Background glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-br ${
                        q.accent
                          ? "from-[#fdf7ef] via-white to-[#fdf7ef]"
                          : "from-[#eaf6ee] via-white to-[#eaf6ee]"
                      }`}
                  />

                  {/* Shine sweep */}
                  <motion.div
                    initial={{ x: "-150%" }}
                    whileHover={{ x: "250%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r
                      from-transparent via-white/60 to-transparent
                      skew-x-12 pointer-events-none"
                  />

                  {/* Badge */}
                  {q.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-2 right-2 text-[8px] font-bold
                        px-1.5 py-0.5 rounded-full
                        bg-gradient-to-br from-[#f4a228] to-[#e08a10]
                        text-white shadow-md shadow-[#f4a228]/40 z-10"
                    >
                      {q.badge}
                    </motion.span>
                  )}

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                    className={`relative w-14 h-14 rounded-2xl mb-3
                      flex items-center justify-center
                      transition-all duration-500
                      ${
                        q.accent
                          ? "bg-[#fdf7ef] border border-[#f4a228]/30 group-hover:bg-[#f4a228] group-hover:border-[#f4a228] group-hover:shadow-xl group-hover:shadow-[#f4a228]/50"
                          : "bg-[#eaf6ee] border border-[#c8e6d1] group-hover:bg-[#227736] group-hover:border-[#227736] group-hover:shadow-xl group-hover:shadow-[#227736]/50"
                      }`}
                  >
                    <Icon
                      size={24}
                      strokeWidth={2.2}
                      className={`transition-colors duration-300
                        ${
                          q.accent
                            ? "text-[#f4a228] group-hover:text-white"
                            : "text-[#227736] group-hover:text-white"
                        }`}
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      className={`absolute inset-0 rounded-2xl ${
                        q.accent ? "bg-[#f4a228]" : "bg-[#227736]"
                      }`}
                    />
                  </motion.div>

                  {/* Label */}
                  <span className="relative text-xs font-bold text-[#0f1d17]
                    group-hover:text-[#227736] transition-colors text-center">
                    {q.label}
                  </span>

                  <ArrowRight
                    size={14}
                    className={`relative mt-2 transition-all duration-300
                      group-hover:translate-x-1
                      ${
                        q.accent
                          ? "text-[#5a6e63]/40 group-hover:text-[#f4a228]"
                          : "text-[#5a6e63]/40 group-hover:text-[#227736]"
                      }`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== ACTIVITY OVERVIEW ==================== */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ---- Recent Notices (visual cards) ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="lg:col-span-2 rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-2xl hover:shadow-[#227736]/10 hover:border-[#227736]/30
            transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                  flex items-center justify-center shadow-sm shadow-[#227736]/10"
              >
                <Bell size={15} className="text-[#227736]" />
              </motion.div>
              Latest Notices
            </h2>
            <Link
              href="/student/notices"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430]
                font-semibold flex items-center gap-1 transition-all"
            >
              See all
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {recentNotices.map((n, i) => (
              <Link key={n.id} href={`/student/notices/${n.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ x: 6, scale: 1.01 }}
                  className="group relative p-4 rounded-xl border border-[#e2ebe6]
                    hover:border-[#227736]/40 hover:bg-gradient-to-r hover:from-[#f8faf9] hover:to-white
                    transition-all duration-500 overflow-hidden flex items-start gap-4"
                >
                  {/* Icon visual */}
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745]
                      flex items-center justify-center shrink-0 shadow-md shadow-[#227736]/30"
                  >
                    <Bell size={18} className="text-white" />
                  </motion.div>

                  <div className="flex-1 min-w-0 relative">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {n.pinned && (
                        <span className="inline-flex items-center gap-1
                          text-[9px] font-bold px-1.5 py-0.5 rounded-full
                          bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/40">
                          <Pin size={8} /> Pinned
                        </span>
                      )}
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase
                        bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">
                        {n.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-[#0f1d17]
                      group-hover:text-[#227736] transition-colors line-clamp-1">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-[#5a6e63] mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(n.createdAt)}
                      </span>
                      {n.deadline && (
                        <span className="flex items-center gap-1 text-[#f4a228] font-semibold">
                          <Sparkles size={10} /> {daysLeft(n.deadline)}d left
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    className="text-[#b0bfb7] group-hover:text-[#227736] group-hover:translate-x-1
                      transition-all duration-300 shrink-0 mt-3"
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ---- Activity Donut Chart ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-2xl hover:shadow-[#227736]/10 hover:border-[#227736]/30
            transition-all duration-500"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                flex items-center justify-center shadow-sm shadow-[#227736]/10"
            >
              <Activity size={15} className="text-[#227736]" />
            </motion.div>
            <h2 className="font-bold text-lg text-[#0f1d17]">Activity</h2>
          </div>

          {/* Donut chart */}
          <div className="relative flex items-center justify-center my-4">
            <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f4f2" strokeWidth="14" />

              <motion.circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#227736"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="314"
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 * (1 - 0.45) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />

              <motion.circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#f4a228"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="314"
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 * (1 - 0.30) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                style={{ transform: "rotate(162deg)", transformOrigin: "60px 60px" }}
              />

              <motion.circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#58b277"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="314"
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 * (1 - 0.25) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                style={{ transform: "rotate(270deg)", transformOrigin: "60px 60px" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-3xl font-extrabold text-[#0f1d17]"
              >
                17
              </motion.p>
              <p className="text-[9px] text-[#5a6e63] uppercase tracking-wider font-bold">
                Total
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {[
              { icon: Bell, label: "Notices", value: 45, color: "#227736", count: 8 },
              { icon: MessageSquare, label: "Complaints", value: 30, color: "#f4a228", count: 5 },
              { icon: FileCheck, label: "Claims", value: 25, color: "#58b277", count: 4 },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={10} style={{ color: item.color }} />
                    </div>
                    <span className="text-[#5a6e63] font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-[#0f1d17]">{item.count}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ==================== COMPLAINTS + LOST & FOUND ==================== */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ---- My Complaints ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-2xl hover:shadow-[#f4a228]/10 hover:border-[#f4a228]/30
            transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30
                  flex items-center justify-center shadow-sm shadow-[#f4a228]/10"
              >
                <MessageSquare size={15} className="text-[#f4a228]" />
              </motion.div>
              Complaints
            </h2>
            <Link
              href="/student/complaints"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430]
                font-semibold flex items-center gap-1 transition-all"
            >
              See all
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {myComplaints.map((c, i) => (
              <Link key={c.id} href={`/student/complaints/${c.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="group p-3 rounded-xl border border-[#e2ebe6]
                    hover:border-[#f4a228]/40 hover:bg-[#fdf7ef]/30
                    transition-all duration-300 flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className="w-9 h-9 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30
                      flex items-center justify-center shrink-0
                      group-hover:bg-[#f4a228] group-hover:border-[#f4a228]
                      group-hover:shadow-md group-hover:shadow-[#f4a228]/30
                      transition-all duration-300"
                  >
                    <MessageSquare size={14} className="text-[#f4a228] group-hover:text-white transition-colors" />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#0f1d17] line-clamp-1
                      group-hover:text-[#227736] transition-colors">
                      {c.title}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1
                        text-[9px] font-bold px-1.5 py-0.5 rounded-full border
                        ${statusColors[c.status]}`}
                    >
                      {statusIcon(c.status)}
                      {c.status}
                    </span>
                  </div>

                  <ArrowRight
                    size={13}
                    className="text-[#b0bfb7] group-hover:text-[#f4a228] group-hover:translate-x-1
                      transition-all duration-300 shrink-0"
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ---- Lost & Found ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-2xl hover:shadow-[#227736]/10 hover:border-[#227736]/30
            transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                  flex items-center justify-center shadow-sm shadow-[#227736]/10"
              >
                <Search size={15} className="text-[#227736]" />
              </motion.div>
              Lost & Found
            </h2>
            <Link
              href="/student/lost-found"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430]
                font-semibold flex items-center gap-1 transition-all"
            >
              See all
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {myItems.map((it, i) => {
              const isLost = it.type === "lost";
              const Icon = isLost ? Search : Gift;
              return (
                <Link key={it.id} href={`/student/lost-found/${it.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="group p-3 rounded-xl border border-[#e2ebe6]
                      hover:border-[#227736]/30 hover:bg-[#f8faf9]
                      transition-all duration-300 flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center
                        shrink-0 border transition-all duration-300 shadow-sm
                        ${
                          isLost
                            ? "bg-gradient-to-br from-[#fdf7ef] to-[#f9e6c8] border-[#f4a228]/30 text-[#f4a228] group-hover:shadow-md group-hover:shadow-[#f4a228]/30"
                            : "bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9] border-[#c8e6d1] text-[#227736] group-hover:shadow-md group-hover:shadow-[#227736]/30"
                        }`}
                    >
                      <Icon size={18} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#0f1d17] truncate
                        group-hover:text-[#227736] transition-colors">
                        {it.title}
                      </p>
                      <p className="text-[10px] text-[#5a6e63] truncate mt-0.5
                        flex items-center gap-1">
                        <MapPin size={9} /> {it.location}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase
                        ${
                          isLost
                            ? "bg-[#fdf7ef] text-[#b86b0a] border-[#f4a228]/40"
                            : "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                        }`}
                    >
                      {it.type}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Visual CTA */}
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#227736]/5 via-[#f4a228]/5 to-[#227736]/5
              border border-dashed border-[#c8e6d1] flex items-center gap-3 cursor-pointer
              hover:border-[#227736]/40 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-[#c8e6d1]
              flex items-center justify-center shadow-sm">
              <Plus size={14} className="text-[#227736]" />
            </div>
            <span className="text-xs font-bold text-[#227736]">Report new item</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}