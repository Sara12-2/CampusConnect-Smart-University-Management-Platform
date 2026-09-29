"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Calendar, Trash2, User, Package, PackageOpen,
  Inbox, Tag, ShieldCheck, Filter, Grid3x3, List, Eye,
  CheckCircle2, Clock, AlertCircle, ArrowRight, X, Gift,
} from "lucide-react";
import { mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

/* ============================================================
   TYPE CONFIG
   ============================================================ */
const typeConfig = {
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

const statusConfig: Record<string, { icon: typeof Clock; label: string; bg: string; text: string; border: string }> = {
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

export default function AdminLostFound() {
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = mockLostFound.filter((it) => {
    const matchFilter = filter === "all" || it.type === filter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      it.title.toLowerCase().includes(q) ||
      it.location.toLowerCase().includes(q) ||
      it.reporterName.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = [
    { label: "Total Items", value: mockLostFound.length, icon: Package, accent: false },
    { label: "Lost", value: mockLostFound.filter(i => i.type === "lost").length, icon: Search, accent: true },
    { label: "Found", value: mockLostFound.filter(i => i.type === "found").length, icon: Gift, accent: false },
    { label: "Returned", value: mockLostFound.filter(i => i.status === "returned").length, icon: CheckCircle2, accent: true },
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
              Item Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] 
              flex items-center justify-center shadow-lg shadow-[#E67E22]/25">
              <Search size={18} className="text-white" />
            </div>
            Manage Lost & Found
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
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 
                transition-all duration-300 overflow-hidden
                hover:shadow-xl hover:shadow-[#227736]/5 hover:border-[#227736]/30"
            >
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  ${s.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"}`}
              />

              <div className="relative flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center 
                    ${
                      s.accent
                        ? "bg-[#fdf2e3] border border-[#E67E22]/30 text-[#E67E22]"
                        : "bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]"
                    }`}
                >
                  <Icon size={14} />
                </div>
              </div>

              <p className={`relative text-3xl font-extrabold tracking-tight 
                ${s.accent ? "text-[#E67E22]" : "text-[#227736]"}`}>
                {s.value}
              </p>
              <p className="relative text-xs text-[#5a6e63] mt-1 font-medium">
                {s.label}
              </p>

              <span
                className={`absolute bottom-0 left-5 right-5 h-0.5 origin-left 
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                  rounded-full ${s.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}
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
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl 
                bg-white border-2 border-[#e2ebe6] 
                text-[#0f1d17] placeholder:text-[#5a6e63]/60
                outline-none transition-all duration-300 
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {[
              { id: "all", label: "All", icon: Grid3x3 },
              { id: "lost", label: "Lost", icon: Search },
              { id: "found", label: "Found", icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = filter === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold 
                    rounded-lg transition-all duration-300 whitespace-nowrap
                    ${
                      active
                        ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                        : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                    }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {[
              { id: "grid", icon: Grid3x3 },
              { id: "list", icon: List },
            ].map((v) => {
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <motion.button
                  key={v.id}
                  onClick={() => setView(v.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300
                    ${
                      active
                        ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                        : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                    }`}
                  aria-label={`${v.id} view`}
                >
                  <Icon size={14} />
                </motion.button>
              );
            })}
          </div>
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] 
              flex items-center justify-center mb-4"
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
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 
                    hover:shadow-xl hover:shadow-[#227736]/10"
                >
                  {/* Top gradient strip */}
                  <div
                    className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`}
                  />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${
                        it.type === "lost" ? "bg-[#E67E22]/8" : "bg-[#227736]/8"
                      }`}
                  />

                  <div className="relative p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center 
                            text-white shadow-md ${cfg.bg} ${cfg.border} 
                            bg-gradient-to-br ${cfg.gradient}`}
                        >
                          <TypeIcon size={18} />
                        </motion.div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 
                              text-[10px] font-bold px-2 py-0.5 rounded-full 
                              border uppercase tracking-wider
                              ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(it.id)}
                        className="p-1.5 rounded-lg text-[#dc3545] 
                          hover:bg-[#fdeaea] transition-all duration-300"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>

                    {/* Item title */}
                    <h3 className="font-bold text-[#0f1d17] text-base 
                      group-hover:text-[#227736] transition-colors line-clamp-1">
                      {it.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#5a6e63] mt-1.5 line-clamp-2 
                      leading-relaxed">
                      {it.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <MapPin size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">{it.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Calendar size={11} className="text-[#227736]" />
                        </div>
                        <span>{formatDate(it.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
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

                    {/* Status + action footer */}
                    <div className="mt-4 pt-4 border-t border-[#e2ebe6] 
                      flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 
                          text-[10px] font-bold px-2 py-0.5 rounded-full 
                          border uppercase tracking-wider
                          ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        <StatusIcon size={10} />
                        {statusCfg.label}
                      </span>

                      <motion.button
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-1 text-xs font-bold 
                          text-[#227736] hover:text-[#1c6430] transition-colors"
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
                  whileHover={{ y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 
                    hover:shadow-xl hover:shadow-[#227736]/5"
                >
                  {/* Left accent bar */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

                  <div className="relative p-5 pl-6 flex items-center gap-4">
                    {/* Type icon */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center 
                        text-white shadow-md shrink-0 
                        bg-gradient-to-br ${cfg.gradient}`}
                    >
                      <TypeIcon size={20} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <StatusIcon size={10} />
                          {statusCfg.label}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#0f1d17] text-base 
                        group-hover:text-[#227736] transition-colors line-clamp-1">
                        {it.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 
                        mt-2 text-xs text-[#5a6e63]">
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

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg text-[#5a6e63] 
                          hover:bg-[#eaf6ee] hover:text-[#227736] 
                          transition-all duration-300"
                        aria-label="View"
                      >
                        <Eye size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(it.id)}
                        className="p-2 rounded-lg text-[#dc3545] 
                          hover:bg-[#fdeaea] transition-all duration-300"
                        aria-label="Delete"
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

      {/* ==================== DELETE CONFIRM MODAL ==================== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm 
              z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl 
                border border-[#e2ebe6] max-w-md w-full overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 
                bg-gradient-to-r from-[#dc3545] to-[#c82333]" />

              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-11 h-11 rounded-xl bg-[#fdeaea] 
                      border border-[#f5c2c7] flex items-center justify-center 
                      text-[#dc3545] shrink-0"
                  >
                    <Trash2 size={20} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-[#0f1d17] text-lg">
                      Delete this item?
                    </h3>
                    <p className="text-xs text-[#5a6e63] mt-1">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white border-2 
                      border-[#e2ebe6] text-sm font-bold text-[#5a6e63]
                      hover:bg-[#f8faf9] hover:border-[#227736]/30
                      transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl bg-[#dc3545] text-white 
                      text-sm font-bold shadow-md shadow-red-500/25
                      hover:bg-[#c82333] hover:shadow-lg hover:shadow-red-500/30
                      transition-all duration-300"
                  >
                    Delete Item
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}