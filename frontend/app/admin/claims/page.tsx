"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck, Check, X, Clock, User, ShieldCheck,
  Calendar, Inbox, CheckCircle2, XCircle,
  AlertCircle, ArrowRight
} from "lucide-react";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
    border: "border-[#E67E22]/30",
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
    { id: "all" as const, label: "Total", value: mockClaims.length, accent: false },
    { id: "pending" as const, label: "Pending", value: mockClaims.filter((c) => c.status === "pending").length, accent: true },
    { id: "approved" as const, label: "Approved", value: mockClaims.filter((c) => c.status === "approved").length, accent: false },
    { id: "rejected" as const, label: "Rejected", value: mockClaims.filter((c) => c.status === "rejected").length, accent: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#e2ebe6]"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <ShieldCheck size={14} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Verification
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] tracking-tight">
            Manage Claims
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Review and verify student claims for Lost & Found items.
          </p>
        </div>
      </motion.div>

      {/* ==================== STATS (Minimal) ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const active = filter === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => setFilter(s.id)}
              whileHover={{ y: -2 }}
              className={cn(
                "relative text-left bg-white rounded-2xl border p-5 transition-all duration-300",
                active
                  ? s.accent ? "border-[#E67E22] shadow-sm" : "border-[#227736] shadow-sm"
                  : "border-[#e2ebe6] hover:border-[#227736]/30"
              )}
            >
              <p className="text-[11px] text-[#5a6e63] font-bold uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className={cn(
                "text-3xl font-extrabold tracking-tight",
                s.accent ? "text-[#E67E22]" : "text-[#227736]"
              )}>
                {s.value}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ==================== FILTER TABS ==================== */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white border border-[#e2ebe6] rounded-xl p-1 shadow-sm">
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
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                  active ? "bg-[#227736] text-white shadow-sm" : "text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736]"
                )}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-xs font-bold text-[#5a6e63]">
          Showing {filteredClaims.length} {filteredClaims.length === 1 ? "claim" : "claims"}
        </span>
      </div>

      {/* ==================== CLAIMS LIST (Clean Cards) ==================== */}
      {filteredClaims.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6] shadow-sm">
          <Inbox size={40} className="mx-auto text-[#5a6e63]/30 mb-4" />
          <h3 className="font-bold text-[#0f1d17] text-lg">No claims found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">Try changing the filters above.</p>
        </div>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 hover:shadow-md transition-all duration-300 p-5 flex flex-col lg:flex-row lg:items-center gap-5"
                >
                  {/* Title & Info */}
                  <div className="flex items-center gap-4 lg:w-1/3 shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      cfg.bg, cfg.border, cfg.text
                    )}>
                      <FileCheck size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#0f1d17] text-sm truncate">
                        {item?.title || "Unknown Item"}
                      </h3>
                      <p className="text-[11px] text-[#5a6e63] mt-0.5 truncate flex items-center gap-1">
                        <User size={10} /> {c.claimantName}
                      </p>
                    </div>
                  </div>

                  {/* Proof */}
                  <div className="flex-1 px-4 py-2.5 rounded-lg bg-[#f8faf9] border border-[#e2ebe6] flex items-start gap-2">
                    <AlertCircle size={13} className="text-[#E67E22] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#5a6e63] leading-relaxed line-clamp-2">
                      {c.proof}
                    </p>
                  </div>

                  {/* Date & Status */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 lg:w-auto">
                    <span className="text-[11px] text-[#5a6e63] font-medium flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar size={11} /> {formatDate(c.createdAt)}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider",
                      cfg.bg, cfg.text, cfg.border
                    )}>
                      <StatusIcon size={11} /> {cfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 lg:w-48 justify-end">
                    {c.status === "pending" ? (
                      <>
                        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold hover:bg-[#1c6430] transition-colors">
                          <Check size={12} strokeWidth={3} /> Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white text-[#dc3545] text-xs font-bold border border-[#dc3545]/30 hover:bg-[#fdeaea] transition-colors">
                          <X size={12} strokeWidth={3} /> Reject
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center justify-center gap-1 text-xs font-bold text-[#227736] hover:text-[#1c6430] px-3 py-2 w-full transition-colors">
                        Details <ArrowRight size={12} />
                      </button>
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