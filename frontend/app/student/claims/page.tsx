"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileCheck, Calendar, Clock, CheckCircle2, XCircle, Hourglass,
  Sparkles, ArrowRight, Search, Eye, TrendingUp, MessageSquare,
  Award, Activity, ChevronRight, Shield, Info,
} from "lucide-react";
import Link from "next/link";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

/* ============================================================
   STATUS HELPERS
   ============================================================ */

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Hourglass,
    color: "#f4a228",
    gradient: "from-[#f4a228] to-[#e08a10]",
    bg: "bg-[#fdf7ef]",
    border: "border-[#f4a228]/30",
    text: "text-[#b86b0a]",
    description: "Waiting for admin approval",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "#227736",
    gradient: "from-[#227736] to-[#28a745]",
    bg: "bg-[#eaf6ee]",
    border: "border-[#c8e6d1]",
    text: "text-[#227736]",
    description: "Claim verified successfully",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "#dc3545",
    gradient: "from-[#dc3545] to-[#b02a37]",
    bg: "bg-[#fdeaea]",
    border: "border-[#dc3545]/30",
    text: "text-[#dc3545]",
    description: "Proof was insufficient",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

/* ============================================================
   CLAIM CARD
   ============================================================ */

function ClaimCard({ claim, item, index }: any) {
  const cfg = statusConfig[claim.status as StatusKey] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  /* --- timeline steps --- */
  const steps = [
    {
      label: "Submitted",
      done: true,
      icon: FileCheck,
    },
    {
      label: "Under Review",
      done: claim.status !== "pending",
      active: claim.status === "pending",
      icon: Eye,
    },
    {
      label: claim.status === "rejected" ? "Rejected" : "Approved",
      done: claim.status === "approved" || claim.status === "rejected",
      icon: claim.status === "rejected" ? XCircle : CheckCircle2,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-2xl bg-white overflow-hidden
        border transition-all duration-500
        ${
          claim.status === "approved"
            ? "border-[#227736]/30 hover:border-[#227736]/60 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.35)]"
            : claim.status === "rejected"
            ? "border-[#dc3545]/30 hover:border-[#dc3545]/60 hover:shadow-[0_25px_50px_-15px_rgba(220,53,69,0.35)]"
            : "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.35)]"
        }`}
    >
      {/* Top accent line */}
      <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />

      {/* Shine sweep */}
      <motion.div
        initial={{ x: "-150%" }}
        whileHover={{ x: "250%" }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r
          from-transparent via-white/40 to-transparent
          skew-x-12 pointer-events-none z-20"
      />

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${cfg.color}10` }}
      />

      <div className="relative p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center
              text-white shadow-lg shrink-0
              bg-gradient-to-br ${cfg.gradient}`}
            style={{ boxShadow: `0 8px 24px -6px ${cfg.color}60` }}
          >
            <FileCheck size={22} strokeWidth={2.2} />

            {/* Pulse ring */}
            <motion.span
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
              className="absolute inset-0 rounded-2xl"
              style={{ backgroundColor: cfg.color }}
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-extrabold text-[#0f1d17] text-base
                  group-hover:text-[#227736] transition-colors
                  line-clamp-1 tracking-tight">
                  {item?.title || `Claim #${claim.id}`}
                </h3>
                <p className="text-[11px] text-[#5a6e63] font-mono mt-0.5">
                  Claim ID: #{claim.id}
                </p>
              </div>

              {/* Status badge */}
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider
                  px-2.5 py-1 rounded-full border shadow-sm shrink-0
                  ${cfg.bg} ${cfg.text} ${cfg.border}`}
              >
                <StatusIcon size={11} />
                {cfg.label}
              </motion.span>
            </div>

            {/* Description */}
            <p className="text-xs text-[#5a6e63] leading-relaxed mt-3 line-clamp-2">
              {claim.proof}
            </p>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="mt-5 pt-5 border-t border-[#f0f4f2]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-3">
            Progress
          </p>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#e2ebe6]">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: claim.status === "pending" ? 0.5 : 1,
                }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className={`h-full origin-left rounded-full bg-gradient-to-r ${cfg.gradient}`}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-3 gap-2">
              {steps.map((step, si) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + si * 0.1 }}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center
                        border-2 transition-all duration-500
                        ${
                          step.done
                            ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                            : step.active
                            ? "bg-white border-[#f4a228] text-[#f4a228]"
                            : "bg-white border-[#e2ebe6] text-[#b0bfb7]"
                        }`}
                    >
                      <StepIcon size={13} strokeWidth={2.2} />

                      {/* Pulse on active */}
                      {step.active && (
                        <motion.span
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-[#f4a228]"
                        />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider
                        ${
                          step.done || step.active
                            ? "text-[#0f1d17]"
                            : "text-[#b0bfb7]"
                        }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-5 border-t border-[#f0f4f2] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-4 text-[11px] text-[#5a6e63]">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-[#f4a228]" />
              {formatDate(claim.createdAt)}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock size={11} className="text-[#227736]" />
              {claim.status === "pending" ? "2 days ago" : "Reviewed"}
            </span>
          </div>

          <motion.div
            whileHover={{ x: 3 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center
              transition-all duration-300
              ${cfg.bg} ${cfg.text}
              group-hover:shadow-md`}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function ClaimsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = mockClaims.filter(
    (c) => filter === "all" || c.status === filter
  );

  /* ---- stats ---- */
  const pendingCount = mockClaims.filter((c) => c.status === "pending").length;
  const approvedCount = mockClaims.filter((c) => c.status === "approved").length;
  const rejectedCount = mockClaims.filter((c) => c.status === "rejected").length;

  const stats = [
    {
      id: "all",
      label: "Total Claims",
      value: mockClaims.length,
      icon: FileCheck,
      accent: false,
    },
    {
      id: "pending",
      label: "Pending",
      value: pendingCount,
      icon: Hourglass,
      accent: true,
    },
    {
      id: "approved",
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      accent: false,
    },
    {
      id: "rejected",
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      accent: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ==================== HERO HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127]
          p-6 md:p-8 text-white overflow-hidden
          shadow-xl shadow-[#227736]/20"
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
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />

        <FileCheck
          size={180}
          strokeWidth={0.5}
          className="absolute -bottom-8 -right-4 text-white/[0.06]
            pointer-events-none select-none"
        />

        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            skew-x-12 pointer-events-none"
        />

        <div className="relative">
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
              Claims Center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
          >
            My Claims
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-white/75 max-w-md"
          >
            Track the status of your ownership claims and their verification progress.
          </motion.p>
        </div>
      </motion.div>

      {/* ==================== STATS ROW ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const active = filter === s.id;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(s.id as any)}
              className={`group relative rounded-2xl bg-white overflow-hidden
                border p-4 text-left transition-all duration-500
                ${
                  active
                    ? s.accent
                      ? "border-[#f4a228]/60 shadow-[0_15px_30px_-10px_rgba(244,162,40,0.35)]"
                      : "border-[#227736]/60 shadow-[0_15px_30px_-10px_rgba(34,119,54,0.35)]"
                    : "border-[#e2ebe6] hover:border-[#227736]/40"
                }`}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="activeStatBg"
                  className={`absolute inset-0 ${
                    s.accent
                      ? "bg-gradient-to-br from-[#fdf7ef] to-[#fbe4c7]/40"
                      : "bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]/40"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-between mb-2">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center
                    transition-all duration-500
                    ${
                      s.accent
                        ? "bg-gradient-to-br from-[#f4a228] to-[#e08a10] text-white shadow-md shadow-[#f4a228]/30"
                        : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-md shadow-[#227736]/30"
                    }`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </motion.div>

                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-[#227736] flex items-center justify-center"
                  >
                    <CheckCircle2 size={11} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              <p className="relative text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                {s.value}
              </p>
              <p className="relative text-[10px] text-[#5a6e63] font-semibold uppercase tracking-wider mt-0.5">
                {s.label}
              </p>

              {active && (
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${
                    s.accent ? "bg-[#f4a228]" : "bg-[#227736]"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ==================== RESULTS COUNT ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between text-xs"
      >
        <p className="text-[#5a6e63]">
          Showing{" "}
          <span className="font-bold text-[#0f1d17]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "claim" : "claims"}
        </p>
        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            className="text-[#227736] hover:text-[#1c6430] font-bold transition-colors"
          >
            Clear filter
          </button>
        )}
      </motion.div>

      {/* ==================== CLAIMS LIST ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl border-2 border-dashed border-[#e2ebe6]
            bg-[#f8faf9] p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto rounded-2xl
              bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]
              border border-[#c8e6d1] flex items-center justify-center mb-5
              shadow-lg shadow-[#227736]/10"
          >
            <FileCheck size={32} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17] text-lg">
            No {filter !== "all" ? filter : ""} claims
          </h3>
          <p className="text-sm text-[#5a6e63] mt-1 max-w-sm mx-auto">
            {filter !== "all"
              ? `You don't have any ${filter} claims yet.`
              : "You haven't submitted any claims yet. Visit Lost & Found to claim an item."}
          </p>
          <Link href="/student/lost-found">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-[#227736] text-white text-xs font-bold
                shadow-md shadow-[#227736]/20 hover:bg-[#1c6430]
                transition-all duration-300"
            >
              <Search size={12} />
              Browse Lost & Found
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c, i) => {
            const item = mockLostFound.find((it) => it.id === c.itemId);
            return <ClaimCard key={c.id} claim={c} item={item} index={i} />;
          })}
        </div>
      )}

      {/* ==================== INFO CARD ==================== */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-2xl border border-[#e2ebe6] bg-[#f8faf9]
            p-5 flex items-start gap-3 overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full
            bg-[#227736]/10 blur-2xl" />

          <div className="relative w-10 h-10 rounded-xl bg-[#eaf6ee]
            flex items-center justify-center shrink-0 border border-[#c8e6d1]">
            <Info size={18} className="text-[#227736]" />
          </div>

          <div className="relative">
            <p className="text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#f4a228]" />
              About Claims
            </p>
            <p className="text-xs text-[#5a6e63] mt-1 leading-relaxed">
              Claims are reviewed by university admins. Once approved, you can
              collect the item from the reception. Approval typically takes 1-2 business days.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}