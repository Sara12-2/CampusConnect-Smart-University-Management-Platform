"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck, Check, X, Clock, User, ShieldCheck,
  Calendar, Inbox, CheckCircle2, XCircle, Search,
  AlertCircle, ChevronDown, ArrowRight,
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
}> = {
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    bg: "bg-[#fdeaea]",
    text: "text-[#dc3545]",
    border: "border-[#f5c2c7]",
  },
};

export default function AdminClaims() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredClaims = mockClaims.filter(
    (c) => filter === "all" || c.status === filter
  );

  const stats = [
    { label: "Total", value: mockClaims.length, accent: false },
    { label: "Pending", value: mockClaims.filter(c => c.status === "pending").length, accent: true },
    { label: "Approved", value: mockClaims.filter(c => c.status === "approved").length, accent: false },
    { label: "Rejected", value: mockClaims.filter(c => c.status === "rejected").length, accent: true },
  ];

  return (
    <div className="space-y-6">

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
            bg-[#fdf2e3] border border-[#E67E22]/30 mb-3">
            <ShieldCheck size={12} className="text-[#E67E22]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B45A0B]">
              Verification Queue
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] 
              flex items-center justify-center shadow-lg shadow-[#E67E22]/25">
              <FileCheck size={18} className="text-white" />
            </div>
            Manage Claims
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Review and verify student claims for Lost & Found items.
          </p>
        </div>
      </motion.div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 
              transition-all duration-300 overflow-hidden
              hover:shadow-xl hover:shadow-[#227736]/5 hover:border-[#227736]/30"
          >
            {/* Corner accent */}
            <div
              className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                ${s.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"}`}
            />

            <p className={`relative text-3xl font-extrabold tracking-tight 
              ${s.accent ? "text-[#E67E22]" : "text-[#227736]"}`}>
              {s.value}
            </p>
            <p className="relative text-xs text-[#5a6e63] mt-1 font-medium">
              {s.label}
            </p>

            {/* Bottom accent line */}
            <span
              className={`absolute bottom-0 left-5 right-5 h-0.5 origin-left 
                scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                rounded-full ${s.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}
            />
          </motion.div>
        ))}
      </div>

      {/* ==================== FILTER TABS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f8faf9] 
          border border-[#e2ebe6] rounded-2xl"
      >
        {[
          { id: "all", label: "All", icon: Inbox },
          { id: "pending", label: "Pending", icon: Clock },
          { id: "approved", label: "Approved", icon: CheckCircle2 },
          { id: "rejected", label: "Rejected", icon: XCircle },
        ].map((tab, i) => {
          const Icon = tab.icon;
          const active = filter === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl 
                text-sm font-semibold transition-all duration-300 
                ${
                  active
                    ? "bg-[#227736] text-white shadow-lg shadow-[#227736]/25"
                    : "text-[#5a6e63] hover:bg-white hover:text-[#227736]"
                }`}
            >
              <Icon size={14} />
              {tab.label}

              {/* Active dot indicator */}
              {active && (
                <motion.span
                  layoutId="activeClaimTab"
                  className="absolute inset-0 rounded-xl border-2 border-[#227736]/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Count badge */}
        <span className="ml-auto text-xs text-[#5a6e63] font-medium px-3">
          {filteredClaims.length} {filteredClaims.length === 1 ? "claim" : "claims"}
        </span>
      </motion.div>

      {/* ==================== CLAIMS LIST ==================== */}
      {filteredClaims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] 
              flex items-center justify-center mb-4"
          >
            <Inbox size={26} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17]">No claims found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try a different filter to see claims.
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 
                    hover:shadow-xl hover:shadow-[#227736]/5"
                >
                  {/* Left accent bar */}
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-1 
                      transition-transform duration-500 
                      ${c.status === "pending" ? "bg-[#E67E22]" : 
                        c.status === "approved" ? "bg-[#227736]" : "bg-[#dc3545]"}`}
                  />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${c.status === "pending" ? "bg-[#E67E22]/8" : 
                        c.status === "approved" ? "bg-[#227736]/8" : "bg-[#dc3545]/8"}`}
                  />

                  <div className="relative p-5 pl-6">
                    {/* Header row */}
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center 
                          shrink-0 shadow-md border 
                          ${
                            c.status === "pending"
                              ? "bg-[#fdf2e3] border-[#E67E22]/30 text-[#E67E22] shadow-[#E67E22]/20"
                              : c.status === "approved"
                              ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736] shadow-[#227736]/20"
                              : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545] shadow-red-500/20"
                          }`}
                      >
                        <FileCheck size={20} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-[#0f1d17] text-base">
                                Claim for {item?.title || "Unknown Item"}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 
                                  text-[10px] font-bold px-2 py-0.5 rounded-full 
                                  border uppercase tracking-wider
                                  ${cfg.bg} ${cfg.text} ${cfg.border}`}
                              >
                                <StatusIcon size={10} />
                                {cfg.label}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                              <span className="inline-flex items-center gap-1.5 
                                text-xs text-[#5a6e63]">
                                <User size={11} />
                                <span className="font-medium text-[#0f1d17]">
                                  {c.claimantName}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1.5 
                                text-xs text-[#5a6e63]">
                                <Calendar size={11} />
                                {formatDate(c.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Proof block */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="mt-4 p-3.5 rounded-xl bg-[#f8faf9] 
                            border border-[#e2ebe6] relative overflow-hidden"
                        >
                          {/* Accent line */}
                          <span
                            className={`absolute left-0 top-0 bottom-0 w-0.5 
                              ${c.status === "pending" ? "bg-[#E67E22]" : 
                                c.status === "approved" ? "bg-[#227736]" : "bg-[#dc3545]"}`}
                          />

                          <div className="flex items-start gap-2 pl-2">
                            <AlertCircle
                              size={13}
                              className="text-[#E67E22] mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="text-[10px] font-bold text-[#5a6e63] 
                                uppercase tracking-wider mb-1">
                                Ownership Proof
                              </p>
                              <p className="text-sm text-[#0f1d17] leading-relaxed">
                                {c.proof}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Actions (only for pending) */}
                    {c.status === "pending" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 pt-4 border-t border-[#e2ebe6] 
                          flex flex-col sm:flex-row gap-2"
                      >
                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="flex-1 flex items-center justify-center gap-2 
                            py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold 
                            shadow-md shadow-[#227736]/25 
                            hover:bg-[#1c6430] hover:shadow-lg hover:shadow-[#227736]/30
                            transition-all duration-300"
                        >
                          <Check size={15} strokeWidth={3} />
                          Approve Claim
                        </motion.button>

                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="flex-1 flex items-center justify-center gap-2 
                            py-2.5 rounded-xl bg-white text-[#dc3545] text-sm font-bold 
                            border-2 border-[#dc3545]/30 
                            hover:bg-[#fdeaea] hover:border-[#dc3545]
                            transition-all duration-300"
                        >
                          <X size={15} strokeWidth={3} />
                          Reject Claim
                        </motion.button>

                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="flex items-center justify-center gap-2 
                            py-2.5 px-4 rounded-xl bg-[#f8faf9] text-[#5a6e63] 
                            text-sm font-bold border border-[#e2ebe6]
                            hover:bg-white hover:text-[#227736] hover:border-[#227736]/40
                            transition-all duration-300"
                        >
                          <Search size={14} />
                          <span className="hidden sm:inline">Details</span>
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Resolved footer (non-pending) */}
                    {c.status !== "pending" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 pt-3 border-t border-[#e2ebe6] 
                          flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {c.status === "approved" ? (
                            <>
                              <CheckCircle2 size={14} className="text-[#227736]" />
                              <span className="text-[#5a6e63]">
                                Verified and approved
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle size={14} className="text-[#dc3545]" />
                              <span className="text-[#5a6e63]">
                                Claim rejected
                              </span>
                            </>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1 text-xs font-bold 
                            text-[#227736] hover:text-[#1c6430] transition-colors"
                        >
                          View details
                          <ArrowRight size={11} />
                        </motion.button>
                      </motion.div>
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