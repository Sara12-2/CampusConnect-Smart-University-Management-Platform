"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, FileCheck, ArrowRight, Pin,
  Calendar, Sparkles, TrendingUp, Clock, CheckCircle2, AlertCircle,
  Plus, Upload, MapPin, Gift, Zap, Lightbulb, GraduationCap,
  CircleDot, XCircle, Hourglass,
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
      shadow: "shadow-[#227736]/30",
    },
    {
      icon: MessageSquare,
      label: "Complaints",
      value: mockComplaints.length,
      color: "from-[#f4a228] to-[#e08a10]",
      accent: true,
      shadow: "shadow-[#f4a228]/30",
    },
    {
      icon: Search,
      label: "Lost & Found",
      value: mockLostFound.length,
      color: "from-[#227736] to-[#58b277]",
      accent: false,
      shadow: "shadow-[#227736]/30",
    },
    {
      icon: FileCheck,
      label: "Claims",
      value: mockClaims.length,
      color: "from-[#f4a228] to-[#b86b0a]",
      accent: true,
      shadow: "shadow-[#f4a228]/30",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Submit Complaint",
      desc: "Report a campus issue with details and photos",
      href: "/student/complaints",
      accent: false,
    },
    {
      icon: Upload,
      label: "Report Lost Item",
      desc: "Report a lost or found item on campus",
      href: "/student/lost-found",
      accent: true,
      badge: "NEW",
    },
    {
      icon: Bell,
      label: "View Notices",
      desc: "Check the latest university notices",
      href: "/student/notices",
      accent: false,
    },
  ];

  /* ---------- status icon helper ---------- */
  const statusIcon = (status: string) => {
    if (status === "resolved" || status === "approved")
      return <CheckCircle2 size={13} className="text-[#227736]" />;
    if (status === "in-progress" || status === "pending")
      return <Hourglass size={13} className="text-[#f4a228]" />;
    if (status === "submitted")
      return <CircleDot size={13} className="text-[#5a6e63]" />;
    if (status === "rejected")
      return <XCircle size={13} className="text-[#dc3545]" />;
    return null;
  };

  return (
    <div className="space-y-8">

      {/* ==================== WELCOME BANNER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127] p-6 md:p-8 text-white shadow-2xl shadow-[#227736]/25 overflow-hidden"
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

        {/* Orange glow corner */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full 
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />

        {/* Decorative big icon (GraduationCap) */}
        <GraduationCap
          size={180}
          strokeWidth={0.8}
          className="absolute -bottom-10 -right-6 text-white/[0.06] 
            pointer-events-none select-none"
        />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
              bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#58b277] animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Student Dashboard
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
            className="mt-2 text-sm text-white/80"
          >
            {mockUser.department} · Semester {mockUser.semester}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs md:text-sm text-white/70 max-w-xl leading-relaxed"
          >
            Here's what's happening across your campus today — new notices,
            complaint updates, and Lost & Found items.
          </motion.p>
        </div>
      </motion.div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                p-5 transition-all duration-300 
                hover:shadow-xl hover:shadow-[#227736]/10 
                hover:border-[#227736]/40 cursor-default overflow-hidden"
            >
              {/* Corner accent */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  ${s.accent ? "bg-[#f4a228]/10" : "bg-[#227736]/10"}`}
              />

              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} 
                  text-white flex items-center justify-center mb-3 
                  shadow-md ${s.shadow}`}
              >
                <Icon size={22} strokeWidth={2.2} />
              </motion.div>

              <p className="relative text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                {s.value}
              </p>
              <p className="relative text-xs text-[#5a6e63] mt-0.5 font-medium">
                {s.label}
              </p>

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

      {/* ==================== QUICK ACTIONS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-[#0f1d17] 
              tracking-tight flex items-center gap-2">
              <Zap size={20} className="text-[#f4a228]" />
              Quick Actions
            </h2>
            <p className="text-xs text-[#5a6e63] mt-1">
              Jump straight to what you need
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((q, i) => {
            const Icon = q.icon;
            return (
              <Link key={q.label} href={q.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden rounded-2xl 
                    bg-white border p-5 transition-all duration-300 
                    ${
                      q.accent
                        ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-xl hover:shadow-[#f4a228]/15"
                        : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/15"
                    }`}
                >
                  {/* Glow */}
                  <div
                    className={`absolute -right-6 -top-6 w-28 h-28 rounded-full 
                      bg-gradient-to-br blur-2xl opacity-10 
                      group-hover:opacity-25 transition-opacity duration-500 
                      ${q.accent ? "from-[#f4a228] to-[#e08a10]" : "from-[#227736] to-[#28a745]"}`}
                  />

                  {/* Badge */}
                  {q.badge && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold 
                      px-2 py-0.5 rounded-full bg-[#f4a228] text-white">
                      {q.badge}
                    </span>
                  )}

                  <div className="relative flex items-start gap-3.5">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 rounded-xl 
                        flex items-center justify-center shrink-0 
                        transition-all duration-300 
                        ${
                          q.accent
                            ? "bg-[#fdf7ef] border border-[#f4a228]/30 group-hover:bg-[#f4a228] group-hover:border-[#f4a228]"
                            : "bg-[#eaf6ee] border border-[#c8e6d1] group-hover:bg-[#227736] group-hover:border-[#227736]"
                        }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={2.2}
                        className={`transition-colors duration-300 
                          ${
                            q.accent
                              ? "text-[#f4a228] group-hover:text-white"
                              : "text-[#227736] group-hover:text-white"
                          }`}
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#0f1d17] text-sm 
                        group-hover:text-[#227736] transition-colors duration-300">
                        {q.label}
                      </h3>
                      <p className="text-xs text-[#5a6e63] mt-1 line-clamp-2 leading-relaxed">
                        {q.desc}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className={`shrink-0 mt-1 transition-all duration-300 
                        group-hover:translate-x-1 
                        ${q.accent
                          ? "text-[#5a6e63]/50 group-hover:text-[#f4a228]"
                          : "text-[#5a6e63]/50 group-hover:text-[#227736]"
                        }`}
                    />
                  </div>

                  {/* Bottom accent line */}
                  <span
                    className={`absolute bottom-0 left-5 right-5 h-0.5 
                      origin-left scale-x-0 group-hover:scale-x-100 
                      transition-transform duration-500 rounded-full 
                      ${q.accent ? "bg-[#f4a228]" : "bg-[#227736]"}`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== NOTICES + COMPLAINTS ==================== */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ---- Recent Notices ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                flex items-center justify-center">
                <Bell size={15} className="text-[#227736]" />
              </div>
              Recent Notices
            </h2>
            <Link
              href="/student/notices"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentNotices.map((n, i) => (
              <Link key={n.id} href={`/student/notices/${n.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ x: 6 }}
                  className="group relative p-4 rounded-xl border border-[#e2ebe6] 
                    hover:border-[#227736]/40 hover:bg-[#f8faf9] 
                    transition-all duration-300 overflow-hidden"
                >
                  {/* Orange accent bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 
                    bg-gradient-to-b from-[#f4a228] to-[#e08a10] 
                    scale-y-0 group-hover:scale-y-100 
                    origin-top transition-transform duration-300" />

                  <div className="flex items-start justify-between gap-3 pl-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {n.pinned && (
                          <span className="inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/40">
                            <Pin size={9} /> Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 
                          text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                          bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">
                          {n.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#0f1d17] text-sm 
                        group-hover:text-[#227736] transition-colors line-clamp-1">
                        {n.title}
                      </h3>
                      <p className="text-xs text-[#5a6e63] mt-1 line-clamp-2">
                        {n.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] 
                    text-[#5a6e63] mt-3 pl-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(n.createdAt)}
                    </span>
                    {n.deadline && (
                      <span className="flex items-center gap-1 text-[#f4a228] font-semibold">
                        <Sparkles size={11} /> {daysLeft(n.deadline)} days left
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ---- My Complaints ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <div className="w-8 h-8 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30
                flex items-center justify-center">
                <MessageSquare size={15} className="text-[#f4a228]" />
              </div>
              My Complaints
            </h2>
          </div>

          <div className="space-y-3">
            {myComplaints.map((c, i) => (
              <Link key={c.id} href={`/student/complaints/${c.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group p-3 rounded-xl border border-[#e2ebe6] 
                    hover:border-[#227736]/30 hover:bg-[#f8faf9] 
                    transition-all duration-300"
                >
                  <p className="font-semibold text-sm text-[#0f1d17] line-clamp-1 
                    group-hover:text-[#227736] transition-colors">
                    {c.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 
                        text-[10px] font-bold px-2 py-0.5 rounded-full border 
                        ${statusColors[c.status]}`}
                    >
                      {statusIcon(c.status)}
                      {c.status}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <Link
            href="/student/complaints"
            className="group inline-flex items-center gap-1 text-xs md:text-sm 
              text-[#227736] hover:text-[#1c6430] font-semibold 
              mt-5 transition-all"
          >
            View all
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* ==================== LOST & FOUND + CLAIMS ==================== */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ---- Lost & Found ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                flex items-center justify-center">
                <Search size={15} className="text-[#227736]" />
              </div>
              Lost & Found
            </h2>
            <Link
              href="/student/lost-found"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
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
                    whileHover={{ x: 6 }}
                    className="group p-3 rounded-xl border border-[#e2ebe6] 
                      hover:border-[#227736]/30 hover:bg-[#f8faf9] 
                      transition-all duration-300 
                      flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        shrink-0 border transition-colors duration-300 
                        ${
                          isLost
                            ? "bg-[#fdf7ef] border-[#f4a228]/30 text-[#f4a228] group-hover:bg-[#f4a228] group-hover:text-white"
                            : "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736] group-hover:bg-[#227736] group-hover:text-white"
                        }`}>
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-[#0f1d17] truncate 
                          group-hover:text-[#227736] transition-colors">
                          {it.title}
                        </p>
                        <p className="text-xs text-[#5a6e63] truncate mt-0.5 
                          flex items-center gap-1">
                          <MapPin size={10} /> {it.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase
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
        </motion.div>

        {/* ---- My Claims ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-[#e2ebe6] p-6
            hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]">
              <div className="w-8 h-8 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30
                flex items-center justify-center">
                <FileCheck size={15} className="text-[#f4a228]" />
              </div>
              My Claims
            </h2>
            <Link
              href="/student/claims"
              className="group text-xs md:text-sm text-[#227736] hover:text-[#1c6430] 
                font-semibold flex items-center gap-1 transition-all"
            >
              View all
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {myClaims.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                whileHover={{ x: 4 }}
                className="p-3 rounded-xl border border-[#e2ebe6] 
                  hover:border-[#227736]/30 hover:bg-[#f8faf9] 
                  transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#0f1d17] flex items-center gap-1.5">
                      <FileCheck size={12} className="text-[#f4a228]" />
                      Claim #{c.id}
                    </p>
                    <p className="text-xs text-[#5a6e63] line-clamp-1 mt-1">
                      {c.proof}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 
                      text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 
                      ${statusColors[c.status]}`}
                  >
                    {statusIcon(c.status)}
                    {c.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ==================== QUICK TIP ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] 
          p-5 flex items-start gap-3 overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full 
          bg-[#f4a228]/10 blur-2xl" />

        <div className="relative w-10 h-10 rounded-xl bg-[#fdf7ef] 
          flex items-center justify-center shrink-0 border border-[#f4a228]/30">
          <Lightbulb size={18} className="text-[#f4a228]" />
        </div>

        <div className="relative">
          <p className="text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#227736]" />
            Quick tip
          </p>
          <p className="text-xs text-[#5a6e63] mt-1 leading-relaxed">
            Long notices now come with AI summaries — click any notice to see
            the key points in seconds.
          </p>
        </div>
      </motion.div>
    </div>
  );
}