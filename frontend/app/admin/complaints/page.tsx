"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, User, Clock, AlertCircle, CheckCircle2,
  CircleDot, Search, Calendar, Wrench, ChevronDown,
  Inbox, Tag, X,
} from "lucide-react";
import { mockComplaints } from "@/data/mock-data";
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
  bar: string;
}> = {
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

export default function AdminComplaints() {
  const [filter, setFilter] = useState<"all" | "submitted" | "assigned" | "in-progress" | "resolved">("all");
  const [search, setSearch] = useState("");

  const filtered = mockComplaints.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = [
    { id: "all" as const, label: "Total", value: mockComplaints.length, icon: Inbox },
    { id: "submitted" as const, label: "Submitted", value: mockComplaints.filter(c => c.status === "submitted").length, icon: CircleDot },
    { id: "in-progress" as const, label: "In Progress", value: mockComplaints.filter(c => c.status === "in-progress").length, icon: Clock },
    { id: "resolved" as const, label: "Resolved", value: mockComplaints.filter(c => c.status === "resolved").length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ==================== HEADER ==================== */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#e2ebe6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
            bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
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

      {/* ==================== STATS (Clickable) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const isActive = filter === s.id;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(s.id)}
              className={cn(
                "group relative text-left bg-white rounded-2xl border p-4 transition-all duration-300 overflow-hidden",
                isActive
                  ? "border-[#227736] shadow-md shadow-[#227736]/15"
                  : "border-[#e2ebe6] hover:border-[#227736]/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeComplaintStat"
                  className="absolute inset-0 bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
                  flex items-center justify-center">
                  <Icon size={14} className="text-[#227736]" />
                </div>
                {isActive && (
                  <CheckCircle2 size={13} className="text-[#227736]" />
                )}
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

      {/* ==================== SEARCH ==================== */}
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
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl
              bg-white border border-[#e2ebe6] text-[#0f1d17]
              placeholder:text-[#5a6e63]/60
              outline-none transition-all duration-200
              focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
              hover:border-[#c8e6d1]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1
                rounded-md text-[#5a6e63] hover:text-[#227736]
                hover:bg-[#eaf6ee] transition-all"
              aria-label="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl shrink-0">
          {[
            { id: "all", label: "All" },
            { id: "submitted", label: "Submitted" },
            { id: "in-progress", label: "In Progress" },
            { id: "resolved", label: "Resolved" },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-[#227736] text-white shadow-sm shadow-[#227736]/20"
                    : "text-[#5a6e63] hover:text-[#0f1d17] hover:bg-[#f8faf9]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== COMPLAINTS LIST ==================== */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e2ebe6]
          rounded-2xl bg-[#f8faf9]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee]
            border border-[#c8e6d1] flex items-center justify-center mb-4">
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

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6]
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 hover:shadow-lg hover:shadow-[#227736]/5"
                >
                  {/* Left accent bar */}
                  <span className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.bar)} />

                  <div className="relative p-4 pl-5">
                    <div className="flex items-start gap-4 flex-wrap lg:flex-nowrap">

                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border",
                          cfg.bg, cfg.border, cfg.text
                        )}
                      >
                        <MessageSquare size={17} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                            cfg.bg, cfg.text, cfg.border
                          )}>
                            <StatusIcon size={9} />
                            {cfg.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold
                            uppercase tracking-wider px-2 py-0.5 rounded-full border
                            bg-white text-[#5a6e63] border-[#e2ebe6]">
                            <Tag size={9} />
                            {c.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-[#0f1d17] text-sm md:text-base
                          group-hover:text-[#227736] transition-colors line-clamp-1">
                          {c.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#5a6e63] mt-1 line-clamp-1">
                          {c.description}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2
                          text-[11px] text-[#5a6e63]">
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
                              <Wrench size={10} />
                              {c.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status dropdown — RIGHT SIDE */}
                      <div className="relative shrink-0 ml-auto">
                        <select
                          defaultValue={c.status}
                          className="appearance-none text-xs font-bold rounded-lg
                            border border-[#e2ebe6] bg-white
                            pl-3 pr-8 py-2
                            text-[#0f1d17] cursor-pointer
                            outline-none transition-all duration-200
                            hover:border-[#227736]/40
                            focus:border-[#227736]"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2
                            text-[#5a6e63] pointer-events-none"
                        />
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
          Showing <span className="font-bold text-[#0f1d17]">{filtered.length}</span> of{" "}
          <span className="font-bold text-[#0f1d17]">{mockComplaints.length}</span> complaints
        </div>
      )}
    </div>
  );
}