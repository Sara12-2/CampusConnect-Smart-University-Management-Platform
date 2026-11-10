"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, MapPin, Calendar, Trash2, User, Package, Inbox, Tag,
  ShieldCheck, Grid3x3, List, Eye, CheckCircle2, Clock,
  AlertCircle, ArrowRight, X, Gift, Loader2, FileCheck, CircleDot,
} from "lucide-react";
import { mockLostFound, mockClaims } from "@/data/mock-data";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

type ItemType = "lost" | "found";
type ItemStatus = "open" | "claimed" | "returned";
type FilterType = "all" | ItemType;
type StatusFilter = "all" | ItemStatus;
type ViewType = "grid" | "list";

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  reporterName: string;
  type: ItemType;
  status: ItemStatus;
}

interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  proof: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

/* ============================================================
   CONFIG OBJECTS
   ============================================================ */

const typeConfig: Record<
  ItemType,
  {
    icon: typeof Search;
    label: string;
    bg: string;
    text: string;
    border: string;
    bar: string;
    gradient: string;
  }
> = {
  lost: {
    icon: Search,
    label: "Lost",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
    gradient: "from-[#E67E22] to-[#D35400]",
  },
  found: {
    icon: Gift,
    label: "Found",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
    gradient: "from-[#227736] to-[#28a745]",
  },
};

const statusConfig: Record<
  ItemStatus,
  { icon: typeof Clock; label: string; bg: string; text: string; border: string }
> = {
  open: {
    icon: AlertCircle,
    label: "Open",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
  },
  claimed: {
    icon: Clock,
    label: "Claimed",
    bg: "bg-[#f8faf9]",
    text: "text-[#5a6e63]",
    border: "border-[#e2ebe6]",
  },
  returned: {
    icon: CheckCircle2,
    label: "Returned",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
  },
};

const filterTabs: { id: FilterType; label: string; icon: typeof Grid3x3 }[] = [
  { id: "all", label: "All", icon: Grid3x3 },
  { id: "lost", label: "Lost", icon: Search },
  { id: "found", label: "Found", icon: Gift },
];

const statusFilterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Status" },
  { id: "open", label: "Open" },
  { id: "claimed", label: "Claimed" },
  { id: "returned", label: "Returned" },
];

const viewTabs: { id: ViewType; icon: typeof Grid3x3; label: string }[] = [
  { id: "grid", icon: Grid3x3, label: "Grid view" },
  { id: "list", icon: List, label: "List view" },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminLostFound() {
  const shouldReduceMotion = useReducedMotion();

  const [items, setItems] = useState<LostFoundItem[]>(
    mockLostFound as LostFoundItem[]
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewType>("grid");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<LostFoundItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
     DELETE HANDLER — Actually deletes
     ============================================================ */

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      // ============================================================
      // TODO: Uncomment when FastAPI endpoint is ready
      // ============================================================
      //
      // const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // const res = await fetch(`${API_URL}/api/admin/lost-found/${deleteTarget}`, {
      //   method: "DELETE",
      //   headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // });
      // if (!res.ok) throw new Error("Failed to delete item.");
      //
      // ============================================================

      await new Promise((r) => setTimeout(r, 500));

      setItems((prev) => prev.filter((i) => i.id !== deleteTarget));
      setDeleteTarget(null);
      pushToast("success", "Item deleted successfully.");
    } catch (err) {
      pushToast(
        "error",
        err instanceof Error ? err.message : "Failed to delete item."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /* ============================================================
     DERIVED DATA
     ============================================================ */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((it) => {
      const matchType = filter === "all" || it.type === filter;
      const matchStatus =
        statusFilter === "all" || it.status === statusFilter;
      const matchSearch =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q) ||
        it.reporterName.toLowerCase().includes(q) ||
        (it.description && it.description.toLowerCase().includes(q));
      return matchType && matchStatus && matchSearch;
    });
  }, [items, filter, statusFilter, search]);

  const stats = [
    { label: "Total Items", value: items.length, icon: Package, accent: false },
    {
      label: "Lost",
      value: items.filter((i) => i.type === "lost").length,
      icon: Search,
      accent: true,
    },
    {
      label: "Found",
      value: items.filter((i) => i.type === "found").length,
      icon: Gift,
      accent: false,
    },
    {
      label: "Returned",
      value: items.filter((i) => i.status === "returned").length,
      icon: CheckCircle2,
      accent: true,
    },
  ];

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="space-y-6">
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
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdf2e3] border border-[#E67E22]/30 mb-3">
            <ShieldCheck size={12} className="text-[#E67E22]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B45A0B]">
              Item Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] flex items-center justify-center shadow-lg shadow-[#E67E22]/25">
              <Search size={18} className="text-white" />
            </div>
            Manage Lost &amp; Found
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Review, verify, and manage all reported lost and found items.
          </p>
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
              transition={{ delay: i * 0.08 }}
              whileHover={shouldReduceMotion ? {} : { y: -5 }}
              className="group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-[#227736]/5 hover:border-[#227736]/30"
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  s.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"
                )}
              />

              <div className="relative flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    s.accent
                      ? "bg-[#fdf2e3] border border-[#E67E22]/30 text-[#E67E22]"
                      : "bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]"
                  )}
                >
                  <Icon size={14} />
                </div>
              </div>

              <p
                className={cn(
                  "relative text-3xl font-extrabold tracking-tight tabular-nums",
                  s.accent ? "text-[#E67E22]" : "text-[#227736]"
                )}
              >
                {s.value}
              </p>
              <p className="relative text-xs text-[#5a6e63] mt-1 font-medium">
                {s.label}
              </p>

              <span
                className={cn(
                  "absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full",
                  s.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ==================== FILTER BAR ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] p-3 md:p-4"
      >
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by item name, location, or reporter..."
              aria-label="Search items"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border-2 border-[#e2ebe6] text-[#0f1d17] placeholder:text-[#5a6e63]/60 outline-none transition-all duration-300 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
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

          {/* Type filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const active = filter === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 whitespace-nowrap",
                    active
                      ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                      : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                  )}
                >
                  <Icon size={12} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {viewTabs.map((v) => {
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <motion.button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={active}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    active
                      ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                      : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                  )}
                  aria-label={v.label}
                >
                  <Icon size={14} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Status filter row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#e2ebe6] flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a6e63]">
            Status:
          </span>
          {statusFilterTabs.map((s) => {
            const active = statusFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                aria-pressed={active}
                className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200",
                  active
                    ? "bg-[#227736] text-white shadow-sm"
                    : "bg-white text-[#5a6e63] border border-[#e2ebe6] hover:text-[#227736] hover:border-[#227736]/30"
                )}
              >
                {s.label}
              </button>
            );
          })}
          <span className="ml-auto text-[11px] font-bold text-[#5a6e63]">
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>
      </motion.div>

      {/* ==================== ITEMS ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-4"
          >
            <Inbox size={26} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17]">No items found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or search query.
          </p>
        </motion.div>
      ) : view === "grid" ? (
        /* ============ GRID VIEW ============ */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((it, i) => {
              const cfg = typeConfig[it.type];
              const statusCfg = statusConfig[it.status] || statusConfig.open;
              const StatusIcon = statusCfg.icon;
              const TypeIcon = cfg.icon;

              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -6 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#227736]/10"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

                  <div
                    className={cn(
                      "absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      it.type === "lost" ? "bg-[#E67E22]/8" : "bg-[#227736]/8"
                    )}
                  />

                  <div className="relative p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <motion.div
                          whileHover={
                            shouldReduceMotion
                              ? {}
                              : { rotate: 10, scale: 1.1 }
                          }
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${cfg.gradient}`}
                        >
                          <TypeIcon size={18} />
                        </motion.div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={
                          shouldReduceMotion ? {} : { scale: 1.1, rotate: 8 }
                        }
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(it.id)}
                        className="p-1.5 rounded-lg text-[#dc3545] hover:bg-[#fdeaea] transition-all duration-300"
                        aria-label={`Delete ${it.title}`}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>

                    <h3 className="font-bold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors line-clamp-1">
                      {it.title}
                    </h3>

                    <p className="text-sm text-[#5a6e63] mt-1.5 line-clamp-2 leading-relaxed">
                      {it.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] flex items-center justify-center shrink-0">
                          <MapPin size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">{it.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] flex items-center justify-center shrink-0">
                          <Calendar size={11} className="text-[#227736]" />
                        </div>
                        <span>{formatDate(it.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] flex items-center justify-center shrink-0">
                          <User size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">
                          Reported by{" "}
                          <span className="font-medium text-[#0f1d17]">
                            {it.reporterName}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#e2ebe6] flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        <StatusIcon size={10} />
                        {statusCfg.label}
                      </span>

                      <motion.button
                        whileHover={shouldReduceMotion ? {} : { x: 3 }}
                        onClick={() => setViewTarget(it)}
                        className="flex items-center gap-1 text-xs font-bold text-[#227736] hover:text-[#1c6430] transition-colors"
                        aria-label={`View details of ${it.title}`}
                      >
                        View
                        <ArrowRight size={11} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* ============ LIST VIEW ============ */
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((it, i) => {
              const cfg = typeConfig[it.type];
              const statusCfg = statusConfig[it.status] || statusConfig.open;
              const StatusIcon = statusCfg.icon;
              const TypeIcon = cfg.icon;

              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#227736]/5"
                >
                  <span className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.bar)} />

                  <div className="relative p-5 pl-6 flex items-center gap-4">
                    <motion.div
                      whileHover={
                        shouldReduceMotion ? {} : { rotate: 10, scale: 1.1 }
                      }
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 bg-gradient-to-br ${cfg.gradient}`}
                    >
                      <TypeIcon size={20} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <StatusIcon size={10} />
                          {statusCfg.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors line-clamp-1">
                        {it.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#5a6e63]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={11} />
                          {it.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={11} />
                          {formatDate(it.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <User size={11} />
                          {it.reporterName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <motion.button
                        whileHover={
                          shouldReduceMotion ? {} : { scale: 1.05 }
                        }
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewTarget(it)}
                        className="p-2 rounded-lg text-[#5a6e63] hover:bg-[#eaf6ee] hover:text-[#227736] transition-all duration-300"
                        aria-label={`View details of ${it.title}`}
                      >
                        <Eye size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={
                          shouldReduceMotion ? {} : { scale: 1.1, rotate: 8 }
                        }
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(it.id)}
                        className="p-2 rounded-lg text-[#dc3545] hover:bg-[#fdeaea] transition-all duration-300"
                        aria-label={`Delete ${it.title}`}
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ==================== DETAIL MODAL (View) ==================== */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewTarget(null)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const cfg = typeConfig[viewTarget.type];
                const statusCfg =
                  statusConfig[viewTarget.status] || statusConfig.open;
                const TypeIcon = cfg.icon;
                const StatusIcon = statusCfg.icon;
                const relatedClaims = (mockClaims as Claim[]).filter(
                  (c) => c.itemId === viewTarget.id
                );

                return (
                  <>
                    <div
                      className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`}
                    />

                    {/* Header */}
                    <div className="p-6 border-b border-[#e2ebe6]">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${cfg.gradient}`}
                          >
                            <TypeIcon size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}
                              >
                                {cfg.label}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                              >
                                <StatusIcon size={10} />
                                {statusCfg.label}
                              </span>
                            </div>
                            <h2 className="text-xl font-extrabold text-[#0f1d17]">
                              {viewTarget.title}
                            </h2>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewTarget(null)}
                          className="p-1.5 rounded-lg text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-colors"
                          aria-label="Close"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[#5a6e63]">
                          <MapPin size={13} className="text-[#227736] shrink-0" />
                          <span className="truncate">
                            {viewTarget.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5a6e63]">
                          <Calendar size={13} className="text-[#227736] shrink-0" />
                          <span>{formatDate(viewTarget.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5a6e63]">
                          <User size={13} className="text-[#227736] shrink-0" />
                          <span className="truncate">
                            {viewTarget.reporterName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 border-b border-[#e2ebe6]">
                      <h3 className="text-sm font-bold text-[#0f1d17] uppercase tracking-wider mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-[#5a6e63] leading-relaxed">
                        {viewTarget.description}
                      </p>
                    </div>

                    {/* Claims */}
                    <div className="p-6 bg-[#f8faf9]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-[#0f1d17] uppercase tracking-wider flex items-center gap-2">
                          <FileCheck size={14} className="text-[#227736]" />
                          Claims ({relatedClaims.length})
                        </h3>
                      </div>

                      {relatedClaims.length === 0 ? (
                        <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#e2ebe6]">
                          <Inbox
                            size={24}
                            className="mx-auto text-[#5a6e63]/40 mb-2"
                          />
                          <p className="text-xs text-[#5a6e63]">
                            No claims submitted for this item yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {relatedClaims.map((c) => {
                            const cStatusCfg =
                              c.status === "approved"
                                ? statusConfig.returned
                                : c.status === "rejected"
                                ? {
                                    ...statusConfig.open,
                                    label: "Rejected",
                                    bg: "bg-[#fdeaea]",
                                    text: "text-[#dc3545]",
                                    border: "border-[#f5c2c7]",
                                    icon: X,
                                  }
                                : statusConfig.claimed;
                            const CIcon = cStatusCfg.icon;
                            return (
                              <div
                                key={c.id}
                                className="bg-white rounded-xl border border-[#e2ebe6] p-3"
                              >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] flex items-center justify-center">
                                      <User
                                        size={13}
                                        className="text-[#227736]"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-[#0f1d17]">
                                        {c.claimantName}
                                      </p>
                                      <p className="text-[10px] text-[#5a6e63]">
                                        {formatDate(c.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cStatusCfg.bg} ${cStatusCfg.text} ${cStatusCfg.border}`}
                                  >
                                    <CIcon size={9} />
                                    {c.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#5a6e63] leading-relaxed line-clamp-2">
                                  {c.proof}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#e2ebe6] flex justify-end gap-2 bg-white">
                      <button
                        onClick={() => {
                          setDeleteTarget(viewTarget.id);
                          setViewTarget(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-white border border-[#dc3545]/30 text-[#dc3545] text-xs font-bold hover:bg-[#fdeaea] transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                      <button
                        onClick={() => setViewTarget(null)}
                        className="px-4 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold hover:bg-[#1c6430] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== DELETE CONFIRM MODAL ==================== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setDeleteTarget(null)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] max-w-md w-full overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dc3545] to-[#c82333]" />

              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? {}
                        : { scale: [1, 1.1, 1] }
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-11 h-11 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] flex items-center justify-center text-[#dc3545] shrink-0"
                  >
                    <Trash2 size={20} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-[#0f1d17] text-lg">
                      Delete this item?
                    </h3>
                    <p className="text-xs text-[#5a6e63] mt-1">
                      This action cannot be undone. All related claims will
                      also be removed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-white border-2 border-[#e2ebe6] text-sm font-bold text-[#5a6e63] hover:bg-[#f8faf9] hover:border-[#227736]/30 transition-all duration-300 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-[#dc3545] text-white text-sm font-bold shadow-md shadow-red-500/25 hover:bg-[#c82333] hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Item"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}