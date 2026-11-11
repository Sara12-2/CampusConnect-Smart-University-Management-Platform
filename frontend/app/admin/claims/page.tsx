"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FileCheck, Check, X, Clock, User, ShieldCheck,
  Calendar, Inbox, CheckCircle2, XCircle,
  AlertCircle, ArrowRight, Loader2,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ClaimStatus = "pending" | "approved" | "rejected";
type FilterType = "all" | ClaimStatus;

interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  message: string;
  status: ClaimStatus;
  createdAt: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const statusConfig: Record<
  ClaimStatus,
  { icon: typeof Clock; label: string; bg: string; text: string; border: string; }
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

export default function AdminClaims() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "approved" | "rejected"; itemTitle: string; } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/claims`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch claims");
        
        const data = await res.json();
        setClaims(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load claims. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [router]);

  const updateStatus = async (id: number, status: ClaimStatus) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/claims/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update claim");

      setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      pushToast("success", `Claim ${status === "approved" ? "approved" : "rejected"} successfully.`);
    } catch (err) {
      pushToast("error", "Failed to update claim. Please try again.");
    } finally {
      setProcessingId(null);
      setConfirmAction(null);
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    updateStatus(confirmAction.id, confirmAction.action);
  };

  const filteredClaims = claims.filter((c) => filter === "all" || c.status === filter);

  const stats = [
    { id: "all" as FilterType, label: "Total", value: claims.length, accent: false },
    { id: "pending" as FilterType, label: "Pending", value: claims.filter((c) => c.status === "pending").length, accent: true },
    { id: "approved" as FilterType, label: "Approved", value: claims.filter((c) => c.status === "approved").length, accent: false },
    { id: "rejected" as FilterType, label: "Rejected", value: claims.filter((c) => c.status === "rejected").length, accent: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <Loader2 size={32} className="animate-spin text-[#227736]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf9] text-[#dc3545]">
        <AlertCircle size={40} className="mb-4" />
        <p className="font-bold">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#227736] text-white rounded-lg text-sm font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* TOASTS */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className={cn("pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold", t.type === "success" ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]" : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545]")}>
              {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-6 border-b border-[#e2ebe6]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
          <ShieldCheck size={14} className="text-[#227736]" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">Verification</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17]">Manage Claims</h1>
        <p className="text-sm text-[#5a6e63] mt-2">Review and verify student claims for Lost & Found items.</p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const active = filter === s.id;
          return (
            <motion.button key={s.id} onClick={() => setFilter(s.id)} whileHover={shouldReduceMotion ? {} : { y: -2 }} className={cn("text-left bg-white rounded-2xl border p-5 transition-all", active ? s.accent ? "border-[#E67E22] shadow-sm" : "border-[#227736] shadow-sm" : "border-[#e2ebe6]")}>
              <p className="text-[11px] text-[#5a6e63] font-bold uppercase mb-1">{s.label}</p>
              <p className={cn("text-3xl font-extrabold", s.accent ? "text-[#E67E22]" : "text-[#227736]")}>{s.value}</p>
            </motion.button>
          );
        })}
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-white border border-[#e2ebe6] rounded-xl p-1 shadow-sm">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const active = filter === tab.id;
            return (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold", active ? "bg-[#227736] text-white shadow-sm" : "text-[#5a6e63] hover:bg-[#f8faf9]")}>
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-xs font-bold text-[#5a6e63]">Showing {filteredClaims.length} claims</span>
      </div>

      {/* CLAIMS LIST */}
      {filteredClaims.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6]">
          <Inbox size={40} className="mx-auto text-[#5a6e63]/30 mb-4" />
          <h3 className="font-bold text-[#0f1d17]">No claims found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">Try changing the filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredClaims.map((c, i) => {
              const cfg = statusConfig[c.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const isProcessing = processingId === c.id;

              return (
                <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white rounded-2xl border border-[#e2ebe6] p-5 flex flex-col lg:flex-row lg:items-center gap-5">
                  
                  {/* Claim ID & Claimant */}
                  <div className="flex items-center gap-4 lg:w-1/3 shrink-0">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", cfg.bg, cfg.border, cfg.text)}>
                      <FileCheck size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#0f1d17] text-sm truncate">Claim #{c.id} (Item {c.itemId})</h3>
                      <p className="text-[11px] text-[#5a6e63] mt-0.5 flex items-center gap-1"><User size={10} /> Claimant ID: {c.claimantId}</p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1 px-4 py-2.5 rounded-lg bg-[#f8faf9] border border-[#e2ebe6] flex items-start gap-2">
                    <AlertCircle size={13} className="text-[#E67E22] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-[#5a6e63] line-clamp-2">{c.message || "No message provided."}</p>
                  </div>

                  {/* Date & Status */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                    <span className="text-[11px] text-[#5a6e63] flex items-center gap-1.5"><Calendar size={11} /> {formatDate(c.createdAt)}</span>
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase", cfg.bg, cfg.text, cfg.border)}>
                      <StatusIcon size={11} /> {cfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 lg:w-48 justify-end">
                    {c.status === "pending" ? (
                      <>
                        <button onClick={() => setConfirmAction({ id: c.id, action: "approved", itemTitle: `Claim #${c.id}` })} disabled={isProcessing} className="flex-1 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold hover:bg-[#1c6430] disabled:opacity-60">
                          Approve
                        </button>
                        <button onClick={() => setConfirmAction({ id: c.id, action: "rejected", itemTitle: `Claim #${c.id}` })} disabled={isProcessing} className="flex-1 py-2 rounded-lg bg-white text-[#dc3545] text-xs font-bold border border-[#dc3545]/30 hover:bg-[#fdeaea] disabled:opacity-60">
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#5a6e63] font-semibold">No actions available</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setConfirmAction(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-extrabold text-[#0f1d17] mb-2">{confirmAction.action === "approved" ? "Approve this claim?" : "Reject this claim?"}</h2>
              <p className="text-sm text-[#5a6e63] mb-6">You are about to {confirmAction.action} the claim for <strong>{confirmAction.itemTitle}</strong>.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-xl border border-[#e2ebe6] text-sm font-bold hover:bg-[#f8faf9]">Cancel</button>
                <button onClick={handleConfirm} disabled={processingId !== null} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60", confirmAction.action === "approved" ? "bg-[#227736] hover:bg-[#1c6430]" : "bg-[#dc3545] hover:bg-[#b32434]")}>
                  {processingId ? "Updating..." : "Yes, Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}