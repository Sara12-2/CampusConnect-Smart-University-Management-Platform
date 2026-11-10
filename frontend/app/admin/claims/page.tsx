"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FileCheck, Check, X, Clock, User, ShieldCheck,
  Calendar, Inbox, CheckCircle2, XCircle,
  AlertCircle, ArrowRight, Loader2,
} from "lucide-react";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

type ClaimStatus = "pending" | "approved" | "rejected";
type FilterType = "all" | ClaimStatus;

interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  proof: string;
  status: ClaimStatus;
  createdAt: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

/* ============================================================
   STATUS CONFIG
   ============================================================ */

const statusConfig: Record<
  ClaimStatus,
  {
    icon: typeof Clock;
    label: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
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

const filterTabs: { id: FilterType; label: string; icon: typeof Clock }[] = [
  { id: "all", label: "All", icon: Inbox },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminClaims() {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>("all");
  const [claims, setClaims] = useState<Claim[]>(mockClaims as Claim[]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: "approved" | "rejected";
    itemTitle: string;
  } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ============================================================
     HELPERS
     ============================================================ */

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  /* ============================================================
     ACTIONS
     ============================================================ */

  const updateStatus = async (id: string, status: ClaimStatus) => {
    setProcessingId(id);

    try {
      // ============================================================
      // TODO: Uncomment when FastAPI backend endpoint is ready
      // ============================================================
      //
      // const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // const res = await fetch(`${API_URL}/api/admin/claims/${id}/${status === "approved" ? "approve" : "reject"}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      // });
      //
      // if (!res.ok) throw new Error("Failed to update claim. Please try again.");
      //
      // ============================================================

      // Simulate API delay
      await new Promise((r) => setTimeout(r, 500));

      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );

      pushToast(
        "success",
        status === "approved"
          ? "Claim approved successfully."
          : "Claim rejected."
      );
    } catch (err) {
      pushToast(
        "error",
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
      setConfirmAction(null);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    updateStatus(confirmAction.id, confirmAction.action);
  };

  /* ============================================================
     DERIVED
     ============================================================ */

  const filteredClaims = claims.filter(
    (c) => filter === "all" || c.status === filter
  );

  const stats: { id: FilterType; label: string; value: number; accent: boolean }[] = [
    { id: "all", label: "Total", value: claims.length, accent: false },
    {
      id: "pending",
      label: "Pending",
      value: claims.filter((c) => c.status === "pending").length,
      accent: true,
    },
    {
      id: "approved",
      label: "Approved",
      value: claims.filter((c) => c.status === "approved").length,
      accent: false,
    },
    {
      id: "rejected",
      label: "Rejected",
      value: claims.filter((c) => c.status === "rejected").length,
      accent: true,
    },
  ];

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* ==================== TOASTS ==================== */}
      <div
        className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold",
                t.type === "success"
                  ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]"
                  : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545]"
              )}
            >
              {t.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

      {/* ==================== STATS (Clickable Filter) ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const active = filter === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => setFilter(s.id)}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              className={cn(
                "relative text-left bg-white rounded-2xl border p-5 transition-all duration-300",
                active
                  ? s.accent
                    ? "border-[#E67E22] shadow-sm"
                    : "border-[#227736] shadow-sm"
                  : "border-[#e2ebe6] hover:border-[#227736]/30"
              )}
              aria-pressed={active}
              aria-label={`Filter ${s.label} claims`}
            >
              <p className="text-[11px] text-[#5a6e63] font-bold uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p
                className={cn(
                  "text-3xl font-extrabold tracking-tight tabular-nums",
                  s.accent ? "text-[#E67E22]" : "text-[#227736]"
                )}
              >
                {s.value}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ==================== FILTER TABS + COUNT ==================== */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white border border-[#e2ebe6] rounded-xl p-1 shadow-sm">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                  active
                    ? "bg-[#227736] text-white shadow-sm"
                    : "text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736]"
                )}
                aria-pressed={active}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-xs font-bold text-[#5a6e63]">
          Showing {filteredClaims.length}{" "}
          {filteredClaims.length === 1 ? "claim" : "claims"}
        </span>
      </div>

      {/* ==================== CLAIMS LIST ==================== */}
      {filteredClaims.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6] shadow-sm">
          <Inbox size={40} className="mx-auto text-[#5a6e63]/30 mb-4" />
          <h3 className="font-bold text-[#0f1d17] text-lg">No claims found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing the filters above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredClaims.map((c, i) => {
              const item = mockLostFound.find((it) => it.id === c.itemId);
              const cfg = statusConfig[c.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const isProcessing = processingId === c.id;

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
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        cfg.bg,
                        cfg.border,
                        cfg.text
                      )}
                    >
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
                    <AlertCircle
                      size={13}
                      className="text-[#E67E22] mt-0.5 shrink-0"
                    />
                    <p className="text-[11px] text-[#5a6e63] leading-relaxed line-clamp-2">
                      {c.proof}
                    </p>
                  </div>

                  {/* Date & Status */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 lg:w-auto">
                    <span className="text-[11px] text-[#5a6e63] font-medium flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar size={11} /> {formatDate(c.createdAt)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider",
                        cfg.bg,
                        cfg.text,
                        cfg.border
                      )}
                    >
                      <StatusIcon size={11} /> {cfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 lg:w-48 justify-end">
                    {c.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            setConfirmAction({
                              id: c.id,
                              action: "approved",
                              itemTitle: item?.title || "this item",
                            })
                          }
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold hover:bg-[#1c6430] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          aria-label={`Approve claim for ${item?.title}`}
                        >
                          {isProcessing ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} strokeWidth={3} />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            setConfirmAction({
                              id: c.id,
                              action: "rejected",
                              itemTitle: item?.title || "this item",
                            })
                          }
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white text-[#dc3545] text-xs font-bold border border-[#dc3545]/30 hover:bg-[#fdeaea] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          aria-label={`Reject claim for ${item?.title}`}
                        >
                          <X size={12} strokeWidth={3} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <Link
                        href={`/admin/claims/${c.id}`}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-[#227736] hover:text-[#1c6430] px-3 py-2 w-full transition-colors"
                      >
                        Details <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ==================== CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setConfirmAction(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-[#e2ebe6] shadow-2xl max-w-md w-full p-6"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  confirmAction.action === "approved"
                    ? "bg-[#eaf6ee] text-[#227736]"
                    : "bg-[#fdeaea] text-[#dc3545]"
                )}
              >
                {confirmAction.action === "approved" ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <AlertCircle size={22} />
                )}
              </div>
              <h2
                id="confirm-title"
                className="text-lg font-extrabold text-[#0f1d17] mb-1"
              >
                {confirmAction.action === "approved"
                  ? "Approve this claim?"
                  : "Reject this claim?"}
              </h2>
              <p className="text-sm text-[#5a6e63] mb-6">
                You are about to{" "}
                {confirmAction.action === "approved" ? "approve" : "reject"} the
                claim for <strong>{confirmAction.itemTitle}</strong>. This action
                cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={processingId !== null}
                  className="flex-1 py-2.5 rounded-xl border border-[#e2ebe6] bg-white text-sm font-bold text-[#0f1d17] hover:bg-[#f8faf9] transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={processingId !== null}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                    confirmAction.action === "approved"
                      ? "bg-[#227736] hover:bg-[#1c6430]"
                      : "bg-[#dc3545] hover:bg-[#b32434]"
                  )}
                >
                  {processingId ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Updating...
                    </>
                  ) : confirmAction.action === "approved" ? (
                    "Yes, Approve"
                  ) : (
                    "Yes, Reject"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}