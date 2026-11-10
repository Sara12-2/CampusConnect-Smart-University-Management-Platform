"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageSquare, User, Clock, CheckCircle2, CircleDot, Search,
  Calendar, Wrench, ChevronDown, Inbox, Tag, X, AlertCircle,
  ArrowRight, Loader2, UserCheck,
} from "lucide-react";
import { mockComplaints } from "@/data/mock-data";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

type ComplaintStatus = "submitted" | "assigned" | "in-progress" | "resolved";
type FilterType = "all" | ComplaintStatus;

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  studentName: string;
  createdAt: string;
  assignedTo?: string | null;
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
  ComplaintStatus,
  {
    icon: typeof Clock;
    label: string;
    bg: string;
    text: string;
    border: string;
    bar: string;
  }
> = {
  submitted: {
    icon: CircleDot,
    label: "Submitted",
    bg: "bg-[#f8faf9]",
    text: "text-[#5a6e63]",
    border: "border-[#e2ebe6]",
    bar: "bg-[#5a6e63]",
  },
  assigned: {
    icon: User,
    label: "Assigned",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    bg: "bg-[#fdf7ef]",
    text: "text-[#b86b0a]",
    border: "border-[#f4a228]/30",
    bar: "bg-[#f4a228]",
  },
  resolved: {
    icon: CheckCircle2,
    label: "Resolved",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
};

const filterTabs: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "submitted", label: "Submitted" },
  { id: "assigned", label: "Assigned" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

const STAFF_LIST = ["IT Support", "Maintenance", "Electrician", "Network Admin"];

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminComplaints() {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(
    mockComplaints as Complaint[]
  );
  const [processingId, setProcessingId] = useState<string | null>(null);
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
     UPDATE STATUS
     ============================================================ */

  const handleStatusChange = async (
    id: string,
    newStatus: ComplaintStatus
  ) => {
    const current = complaints.find((c) => c.id === id);
    if (!current || current.status === newStatus) return;

    setProcessingId(id);

    try {
      // ============================================================
      // TODO: Uncomment when FastAPI endpoint is ready
      // ============================================================
      //
      // const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // const res = await fetch(`${API_URL}/api/admin/complaints/${id}/status`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      //
      // if (!res.ok) throw new Error("Failed to update status. Try again.");
      //
      // ============================================================

      await new Promise((r) => setTimeout(r, 400));

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      pushToast(
        "success",
        `Complaint marked as ${newStatus.replace("-", " ")}.`
      );
    } catch (err) {
      pushToast(
        "error",
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     ASSIGN STAFF
     ============================================================ */

  const handleAssignStaff = async (id: string, staff: string) => {
    setProcessingId(id);
    try {
      // TODO: PATCH /api/admin/complaints/{id}/assign with { staff }
      await new Promise((r) => setTimeout(r, 400));

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                assignedTo: staff,
                status: c.status === "submitted" ? "assigned" : c.status,
              }
            : c
        )
      );
      pushToast("success", `Assigned to ${staff}.`);
    } catch (err) {
      pushToast(
        "error",
        err instanceof Error ? err.message : "Failed to assign."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ============================================================
     DERIVED DATA
     ============================================================ */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return complaints.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [complaints, filter, search]);

  const stats: {
    id: FilterType;
    label: string;
    value: number;
    icon: typeof Inbox;
  }[] = [
    { id: "all", label: "Total", value: complaints.length, icon: Inbox },
    {
      id: "submitted",
      label: "Submitted",
      value: complaints.filter((c) => c.status === "submitted").length,
      icon: CircleDot,
    },
    {
      id: "in-progress",
      label: "In Progress",
      value: complaints.filter((c) => c.status === "in-progress").length,
      icon: Clock,
    },
    {
      id: "resolved",
      label: "Resolved",
      value: complaints.filter((c) => c.status === "resolved").length,
      icon: CheckCircle2,
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
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#e2ebe6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Wrench size={11} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Issue Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">
            Manage Complaints
          </h1>
          <p className="text-sm text-[#5a6e63] mt-1">
            Review, assign, and resolve campus issues reported by students.
          </p>
        </div>
      </div>

      {/* ==================== STATS (Clickable Filter) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const isActive = filter === s.id;
          return (
            <motion.button
              key={s.id}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(s.id)}
              className={cn(
                "group relative text-left bg-white rounded-2xl border p-4 transition-all duration-300 overflow-hidden",
                isActive
                  ? "border-[#227736] shadow-md shadow-[#227736]/15"
                  : "border-[#e2ebe6] hover:border-[#227736]/40"
              )}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeComplaintStat"
                  className="absolute inset-0 bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center">
                  <Icon size={14} className="text-[#227736]" />
                </div>
                {isActive && <CheckCircle2 size={13} className="text-[#227736]" />}
              </div>
              <p className="relative text-2xl font-extrabold text-[#0f1d17] tracking-tight tabular-nums">
                {s.value}
              </p>
              <p className="relative text-[10px] text-[#5a6e63] font-bold uppercase tracking-wider mt-0.5">
                {s.label}
              </p>

              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#227736]" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ==================== SEARCH + FILTER TABS ==================== */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, student, or category..."
            aria-label="Search complaints"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border border-[#e2ebe6] text-[#0f1d17] placeholder:text-[#5a6e63]/60 outline-none transition-all duration-200 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 hover:border-[#c8e6d1]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-all"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl shrink-0 overflow-x-auto">
          {filterTabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-[#227736] text-white shadow-sm shadow-[#227736]/20"
                    : "text-[#5a6e63] hover:text-[#0f1d17] hover:bg-[#f8faf9]"
                )}
                aria-pressed={active}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== COMPLAINTS LIST ==================== */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e2ebe6] rounded-2xl bg-[#f8faf9]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-4">
            <Inbox size={26} className="text-[#227736]" />
          </div>
          <h3 className="font-bold text-[#0f1d17]">No complaints found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing the filters or search query.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const cfg = statusConfig[c.status] || statusConfig.submitted;
              const StatusIcon = cfg.icon;
              const isProcessing = processingId === c.id;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#227736]/5"
                >
                  <span
                    className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.bar)}
                  />

                  <div className="relative p-4 pl-5">
                    <div className="flex items-start gap-4 flex-wrap lg:flex-nowrap">
                      {/* Icon */}
                      <motion.div
                        whileHover={
                          shouldReduceMotion ? {} : { rotate: 6, scale: 1.05 }
                        }
                        transition={{ type: "spring", stiffness: 300 }}
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border",
                          cfg.bg,
                          cfg.border,
                          cfg.text
                        )}
                      >
                        <MessageSquare size={17} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                              cfg.bg,
                              cfg.text,
                              cfg.border
                            )}
                          >
                            <StatusIcon size={9} />
                            {cfg.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white text-[#5a6e63] border-[#e2ebe6]">
                            <Tag size={9} />
                            {c.category}
                          </span>
                        </div>

                        <Link href={`/admin/complaints/${c.id}`} className="block">
                          <h3 className="font-bold text-[#0f1d17] text-sm md:text-base group-hover:text-[#227736] transition-colors line-clamp-1">
                            {c.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-[#5a6e63] mt-1 line-clamp-1">
                          {c.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-[#5a6e63]">
                          <span className="inline-flex items-center gap-1">
                            <User size={10} />
                            <span className="font-medium text-[#0f1d17]">
                              {c.studentName}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(c.createdAt)}
                          </span>
                          {c.assignedTo && (
                            <span className="inline-flex items-center gap-1 text-[#227736] font-semibold">
                              <UserCheck size={10} />
                              {c.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        {/* Assign staff (only if unassigned) */}
                        {!c.assignedTo && c.status !== "resolved" && (
                          <div className="relative">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAssignStaff(c.id, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              disabled={isProcessing}
                              aria-label="Assign staff"
                              className="appearance-none text-xs font-bold rounded-lg border border-[#e2ebe6] bg-white pl-3 pr-8 py-2 text-[#0f1d17] cursor-pointer outline-none transition-all duration-200 hover:border-[#227736]/40 focus:border-[#227736] disabled:opacity-60"
                            >
                              <option value="">Assign...</option>
                              {STAFF_LIST.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <UserCheck
                              size={12}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
                            />
                          </div>
                        )}

                        {/* Status dropdown */}
                        <div className="relative">
                          <select
                            value={c.status}
                            onChange={(e) =>
                              handleStatusChange(
                                c.id,
                                e.target.value as ComplaintStatus
                              )
                            }
                            disabled={isProcessing}
                            aria-label="Change status"
                            className="appearance-none text-xs font-bold rounded-lg border border-[#e2ebe6] bg-white pl-3 pr-8 py-2 text-[#0f1d17] cursor-pointer outline-none transition-all duration-200 hover:border-[#227736]/40 focus:border-[#227736] disabled:opacity-60"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          {isProcessing ? (
                            <Loader2
                              size={12}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] animate-spin"
                            />
                          ) : (
                            <ChevronDown
                              size={12}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
                            />
                          )}
                        </div>

                        {/* Detail link */}
                        <Link
                          href={`/admin/complaints/${c.id}`}
                          aria-label="View details"
                          className="p-2 rounded-lg text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-colors"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <div className="text-center text-xs text-[#5a6e63] py-2">
          Showing{" "}
          <span className="font-bold text-[#0f1d17]">{filtered.length}</span> of{" "}
          <span className="font-bold text-[#0f1d17]">{complaints.length}</span>{" "}
          complaints
        </div>
      )}
    </div>
  );
}