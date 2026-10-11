"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck, Check, X, Clock, User, ShieldCheck,
  Calendar, Inbox, CheckCircle2, XCircle,
  AlertCircle, ArrowRight,
} from "lucide-react";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

/* ============================================================
   STATUS CONFIG
   ============================================================ */
const statusConfig: Record<string, {
  icon: typeof Clock;
  label: string;
  bg: string;
  text: string;
  border: string;
  bar: string;
}> = {
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    bg: "bg-[#fdeaea]",
    text: "text-[#dc3545]",
    border: "border-[#f5c2c7]",
    bar: "bg-[#dc3545]",
  },
};

export default function AdminClaims() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredClaims = mockClaims.filter(
    (c) => filter === "all" || c.status === filter
  );

  const stats = [
    { id: "all" as const, label: "Total", value: mockClaims.length, accent: false },
    {
      id: "pending" as const,
      label: "Pending",
      value: mockClaims.filter((c) => c.status === "pending").length,
      accent: true,
    },
    {
      id: "approved" as const,
      label: "Approved",
      value: mockClaims.filter((c) => c.status === "approved").length,
      accent: false,
    },
    {
      id: "rejected" as const,
      label: "Rejected",
      value: mockClaims.filter((c) => c.status === "rejected").length,
      accent: true,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-4
          pb-5 border-b border-[#e2ebe6]"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
            bg-[#fdf2e3] border border-[#E67E22]/30 mb-3">
            <ShieldCheck size={11} className="text-[#E67E22]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B45A0B]">
              Verification Queue
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">
            Manage Claims
          </h1>
          <p className="text-sm text-[#5a6e63] mt-1">
            Review and verify student claims.
          </p>
        </div>
      </motion.div>

      {/* ==================== STATS (HORIZONTAL — wide) ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const active = filter === s.id;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(s.id)}
              className={`group relative text-left bg-white rounded-2xl border
                transition-all duration-300 overflow-hidden
                px-5 py-4
                ${
                  active
                    ? s.accent
                      ? "border-[#E67E22] shadow-lg shadow-[#E67E22]/15"
                      : "border-[#227736] shadow-lg shadow-[#227736]/15"
                    : "border-[#e2ebe6] hover:border-[#227736]/40"
                }`}
            >
              {active && (
                <motion.div
                  layoutId="activeClaimStat"
                  className={`absolute inset-0 ${
                    s.accent
                      ? "bg-gradient-to-r from-[#fdf2e3] to-[#fbe4c7]/20"
                      : "bg-gradient-to-r from-[#eaf6ee] to-[#d4ead9]/20"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Horizontal layout: label LEFT, value RIGHT */}
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-[11px] text-[#5a6e63] font-bold
                  uppercase tracking-wider">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-extrabold tracking-tight tabular-nums
                    ${s.accent ? "text-[#E67E22]" : "text-[#227736]"}`}
                >
                  {s.value}
                </p>
              </div>

              {active && (
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    s.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ==================== FILTER TABS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-2"
      >
        {[
          { id: "all", label: "All", icon: Inbox },
          { id: "pending", label: "Pending", icon: Clock },
          { id: "approved", label: "Approved", icon: CheckCircle2 },
          { id: "rejected", label: "Rejected", icon: XCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                text-xs font-bold transition-all duration-200
                ${
                  active
                    ? "bg-[#227736] text-white shadow-md shadow-[#227736]/20"
                    : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736]"
                }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}

        <span className="ml-auto text-xs text-[#5a6e63] font-medium">
          {filteredClaims.length} {filteredClaims.length === 1 ? "claim" : "claims"}
        </span>
      </motion.div>

      {/* ==================== CLAIMS LIST (HORIZONTAL CARDS) ==================== */}
      {filteredClaims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-[#e2ebe6] rounded-2xl bg-[#f8faf9]"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1]
            flex items-center justify-center mb-3">
            <Inbox size={22} className="text-[#227736]" />
          </div>
          <h3 className="font-bold text-[#0f1d17] text-sm">No claims found</h3>
          <p className="text-xs text-[#5a6e63] mt-1">
            Try a different filter.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredClaims.map((c, i) => {
              const item = mockLostFound.find((it) => it.id === c.itemId);
              const cfg = statusConfig[c.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6]
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 hover:shadow-lg hover:shadow-[#227736]/5"
                >
                  {/* Left accent bar */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

                  {/* HORIZONTAL layout: icon | content | status | actions */}
                  <div className="relative flex flex-col lg:flex-row lg:items-center gap-4
                    p-4 pl-5">

                    {/* Icon + Title (LEFT) */}
                    <div className="flex items-center gap-3 lg:flex-1 min-w-0">
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center
                          shrink-0 border ${cfg.bg} ${cfg.border} ${cfg.text}`}
                      >
                        <FileCheck size={16} />
                      </motion.div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#0f1d17] text-sm
                          tracking-tight line-clamp-1">
                          {item?.title || "Unknown Item"}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#5a6e63]">
                          <span className="inline-flex items-center gap-1">
                            <User size={9} />
                            <span className="font-medium text-[#0f1d17]">
                              {c.claimantName}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={9} />
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proof (MIDDLE — expands on wide screens) */}
                    <div className="lg:flex-1 flex items-start gap-2 px-3 py-2 rounded-lg
                      bg-[#f8faf9] border border-[#e2ebe6]">
                      <AlertCircle size={11} className="text-[#E67E22] mt-0.5 shrink-0" />
                      <p className="text-[11px] text-[#5a6e63] leading-relaxed line-clamp-1 lg:line-clamp-2">
                        {c.proof}
                      </p>
                    </div>

                    {/* Status badge (RIGHT) */}
                    <span
                      className={`shrink-0 inline-flex items-center gap-1
                        text-[10px] font-bold px-2.5 py-1 rounded-full
                        border uppercase tracking-wider
                        ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <StatusIcon size={9} />
                      {cfg.label}
                    </span>

                    {/* Actions (FAR RIGHT) */}
                    {c.status === "pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1
                            px-3.5 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold
                            shadow-md shadow-[#227736]/20 hover:bg-[#1c6430]
                            transition-all duration-200"
                        >
                          <Check size={12} strokeWidth={3} />
                          Approve
                        </motion.button>

                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1
                            px-3.5 py-2 rounded-lg bg-white text-[#dc3545] text-xs font-bold
                            border-2 border-[#dc3545]/30 hover:bg-[#fdeaea]
                            hover:border-[#dc3545] transition-all duration-200"
                        >
                          <X size={12} strokeWidth={3} />
                          Reject
                        </motion.button>
                      </div>
                    )}

                    {c.status !== "pending" && (
                      <motion.button
                        whileHover={{ x: 3 }}
                        className="shrink-0 flex items-center gap-1 text-xs font-bold
                          text-[#227736] hover:text-[#1c6430] transition-colors px-2"
                      >
                        Details
                        <ArrowRight size={11} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}