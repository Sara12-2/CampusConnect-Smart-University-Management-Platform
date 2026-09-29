"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, User, Filter, Clock, AlertCircle, CheckCircle2,
  CircleDot, Search, Calendar, Wrench, ChevronDown, ArrowRight,
  Inbox, TrendingUp, MapPin, Tag,
} from "lucide-react";
import { mockComplaints } from "@/data/mock-data";
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
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  resolved: {
    icon: CheckCircle2,
    label: "Resolved",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#28a745]",
  },
};

const categoryIcon: Record<string, typeof Tag> = {
  classroom: Tag,
  lab: Wrench,
  electricity: AlertCircle,
  wifi: AlertCircle,
  furniture: Wrench,
  other: Tag,
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
    { label: "Total", value: mockComplaints.length, accent: false, icon: Inbox },
    { label: "In Progress", value: mockComplaints.filter(c => c.status === "in-progress").length, accent: true, icon: Clock },
    { label: "Resolved", value: mockComplaints.filter(c => c.status === "resolved").length, accent: false, icon: CheckCircle2 },
    { label: "Submitted", value: mockComplaints.filter(c => c.status === "submitted").length, accent: true, icon: CircleDot },
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
            bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Wrench size={12} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Issue Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] 
              flex items-center justify-center shadow-lg shadow-[#227736]/25">
              <MessageSquare size={18} className="text-white" />
            </div>
            Manage Complaints
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Review, assign, and resolve campus issues reported by students.
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
              placeholder="Search by title, student, or category..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl 
                bg-white border-2 border-[#e2ebe6] 
                text-[#0f1d17] placeholder:text-[#5a6e63]/60
                outline-none transition-all duration-300 
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            />
          </div>

          {/* Filter icon + tabs */}
          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "submitted", label: "Submitted" },
              { id: "in-progress", label: "In Progress" },
              { id: "resolved", label: "Resolved" },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative px-3 py-1.5 text-xs font-bold rounded-lg 
                    transition-all duration-300 whitespace-nowrap
                    ${
                      active
                        ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                        : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                    }`}
                >
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ==================== COMPLAINTS LIST ==================== */}
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
          <h3 className="font-bold text-[#0f1d17]">No complaints found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing the filters or search query.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const cfg = statusConfig[c.status] || statusConfig.submitted;
              const StatusIcon = cfg.icon;
              const CatIcon = categoryIcon[c.category] || Tag;

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
                  <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${
                        c.status === "in-progress"
                          ? "bg-[#E67E22]/8"
                          : "bg-[#227736]/8"
                      }`}
                  />

                  <div className="relative p-5 pl-6">
                    {/* Header row */}
                    <div className="flex items-start gap-4">
                      {/* Category icon */}
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center 
                          shrink-0 shadow-md border 
                          ${
                            c.status === "in-progress"
                              ? "bg-[#fdf2e3] border-[#E67E22]/30 text-[#E67E22] shadow-[#E67E22]/20"
                              : c.status === "resolved"
                              ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736] shadow-[#227736]/20"
                              : c.status === "assigned"
                              ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736] shadow-[#227736]/20"
                              : "bg-[#f8faf9] border-[#e2ebe6] text-[#5a6e63] shadow-black/5"
                          }`}
                      >
                        <CatIcon size={20} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span
                                className={`inline-flex items-center gap-1 
                                  text-[10px] font-bold px-2 py-0.5 rounded-full 
                                  border uppercase tracking-wider
                                  ${cfg.bg} ${cfg.text} ${cfg.border}`}
                              >
                                <StatusIcon size={10} />
                                {cfg.label}
                              </span>
                              <span className="inline-flex items-center gap-1 
                                text-[10px] font-bold px-2 py-0.5 rounded-full 
                                border uppercase tracking-wider
                                bg-white text-[#5a6e63] border-[#e2ebe6]">
                                <CatIcon size={10} />
                                {c.category}
                              </span>
                            </div>

                            <h3 className="font-bold text-[#0f1d17] text-base 
                              group-hover:text-[#227736] transition-colors">
                              {c.title}
                            </h3>
                            <p className="text-sm text-[#5a6e63] mt-1.5 line-clamp-2 
                              leading-relaxed">
                              {c.description}
                            </p>
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 
                          text-xs text-[#5a6e63]">
                          <span className="inline-flex items-center gap-1.5">
                            <User size={11} />
                            <span className="font-medium text-[#0f1d17]">
                              {c.studentName}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={11} />
                            {formatDate(c.createdAt)}
                          </span>
                          {c.assignedTo && (
                            <span className="inline-flex items-center gap-1.5 
                              text-[#227736] font-semibold">
                              <Wrench size={11} />
                              Assigned to {c.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status dropdown */}
                      <div className="hidden md:flex flex-col gap-2 shrink-0">
                        <div className="relative">
                          <select
                            defaultValue={c.status}
                            className="appearance-none text-xs font-bold rounded-xl 
                              border-2 border-[#e2ebe6] bg-white 
                              pl-3 pr-8 py-2 
                              text-[#0f1d17] cursor-pointer
                              outline-none transition-all duration-300 
                              hover:border-[#227736]/40 
                              focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
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

                    {/* Mobile status row */}
                    <div className="md:hidden mt-4 pt-4 border-t border-[#e2ebe6]">
                      <div className="relative">
                        <select
                          defaultValue={c.status}
                          className="w-full appearance-none text-xs font-bold rounded-xl 
                            border-2 border-[#e2ebe6] bg-white 
                            pl-3 pr-8 py-2 
                            text-[#0f1d17] cursor-pointer
                            outline-none transition-all duration-300 
                            focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
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

                    {/* Hover details link */}
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      whileHover={{ opacity: 1 }}
                      className="mt-3 pt-3 border-t border-[#e2ebe6] 
                        flex items-center justify-between opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300"
                    >
                      <span className="text-xs text-[#5a6e63]">
                        Complaint ID: <span className="font-mono font-bold text-[#0f1d17]">
                          #{c.id}
                        </span>
                      </span>
                      <motion.button
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-1 text-xs font-bold 
                          text-[#227736] hover:text-[#1c6430] transition-colors"
                      >
                        View full details
                        <ArrowRight size={11} />
                      </motion.button>
                    </motion.div>
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