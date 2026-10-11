"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Pin, Calendar, Sparkles, Filter, Bell,
  ArrowRight, Clock, Tag, TrendingUp, X, SlidersHorizontal,
  ChevronDown, CheckCircle2, Zap, BookOpen, Hash,
} from "lucide-react";
import { mockNotices } from "@/data/mock-data";
import { formatDate, daysLeft } from "@/lib/utils";

export default function NoticesPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [sem, setSem] = useState("All");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: Bell },
    { id: "exam", label: "Exams", icon: BookOpen },
    { id: "fee", label: "Fees", icon: Tag },
    { id: "event", label: "Events", icon: Sparkles },
  ];

  const filtered = mockNotices.filter((n) => {
    const q = query.toLowerCase();
    const matchQ =
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q);
    const matchD = dept === "All" || n.department === dept;
    const matchS = sem === "All" || n.semester === Number(sem);
    const matchC =
      activeCategory === "all" || n.category === activeCategory;
    return matchQ && matchD && matchS && matchC;
  });

  const clearFilters = () => {
    setQuery("");
    setDept("All");
    setSem("All");
    setActiveCategory("all");
  };

  const hasFilters =
    query || dept !== "All" || sem !== "All" || activeCategory !== "all";

  /* ------- stats -------- */
  const pinnedCount = mockNotices.filter((n) => n.pinned).length;
  const urgentCount = mockNotices.filter((n) => {
    if (!n.deadline) return false;
    const days = daysLeft(n.deadline);
    return days > 0 && days <= 7;
  }).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ==================== HERO HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127]
          p-6 md:p-8 text-white overflow-hidden
          shadow-xl shadow-[#227736]/20"
      >
        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Orange glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />

        {/* Decorative icon */}
        <Bell
          size={180}
          strokeWidth={0.5}
          className="absolute -bottom-8 -right-4 text-white/[0.06]
            pointer-events-none select-none"
        />

        {/* Shine sweep */}
        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            skew-x-12 pointer-events-none"
        />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20 mb-3"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Notice Board
            </span>
          </motion.div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
              >
                University Notices
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm text-white/75 max-w-md"
              >
                Every important notice in one place — searchable and AI-summarized
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-3"
            >
              {[
                { icon: Pin, value: pinnedCount, label: "Pinned" },
                { icon: Clock, value: urgentCount, label: "Urgent" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.08 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-md
                      border border-white/20 px-4 py-2.5 min-w-[80px] text-center
                      shadow-lg shadow-black/10 hover:bg-white/15
                      transition-all duration-300 cursor-default"
                  >
                    <Icon size={14} className="text-[#f4a228] mx-auto mb-1" />
                    <p className="text-xl font-extrabold tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-[9px] text-white/60 uppercase tracking-wider font-bold">
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ==================== SEARCH BAR ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
          size={18}
        />
        <input
          placeholder="Search notices by title or content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 text-sm rounded-2xl bg-white
            border border-[#e2ebe6] text-[#0f1d17]
            placeholder:text-[#5a6e63]/60
            focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
            hover:border-[#227736]/30
            outline-none transition-all duration-300
            shadow-sm focus:shadow-md"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg
                flex items-center justify-center
                text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]
                transition-all duration-300"
              aria-label="Clear search"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ==================== FILTER ROW ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-3 flex-wrap"
      >
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {categories.map((c, i) => {
            const Icon = c.icon;
            const active = activeCategory === c.id;
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(c.id)}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                  text-xs font-bold transition-colors duration-300
                  ${
                    active
                      ? "text-white"
                      : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736]"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430]
                      shadow-md shadow-[#227736]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={13} className="relative" />
                <span className="relative">{c.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Selects */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SlidersHorizontal
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
            />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-xs font-semibold rounded-xl
                border border-[#e2ebe6] bg-white text-[#0f1d17]
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                hover:border-[#227736]/30
                outline-none transition-all duration-300 cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
            />
          </div>

          <div className="relative">
            <Hash
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
            />
            <select
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-xs font-semibold rounded-xl
                border border-[#e2ebe6] bg-white text-[#0f1d17]
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                hover:border-[#227736]/30
                outline-none transition-all duration-300 cursor-pointer"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  Semester {n}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
            />
          </div>

          {/* Clear filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
                  text-xs font-bold text-[#dc3545]
                  bg-[#fdeaea] border border-[#dc3545]/20
                  hover:bg-[#dc3545] hover:text-white hover:border-[#dc3545]
                  transition-all duration-300"
              >
                <X size={12} />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ==================== RESULTS COUNT ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between text-xs"
      >
        <p className="text-[#5a6e63]">
          Showing{" "}
          <span className="font-bold text-[#0f1d17]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "notice" : "notices"}
        </p>
        {hasFilters && (
          <p className="text-[#f4a228] font-semibold flex items-center gap-1">
            <Filter size={11} />
            Filters applied
          </p>
        )}
      </motion.div>

      {/* ==================== NOTICE GRID ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl border-2 border-dashed border-[#e2ebe6]
            bg-[#f8faf9] p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto rounded-2xl
              bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]
              border border-[#c8e6d1] flex items-center justify-center mb-5
              shadow-lg shadow-[#227736]/10"
          >
            <Bell size={32} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17] text-lg">No notices found</h3>
          <p className="text-sm text-[#5a6e63] mt-1 max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {hasFilters && (
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-[#227736] text-white text-xs font-bold
                shadow-md shadow-[#227736]/20 hover:bg-[#1c6430]
                transition-all duration-300"
            >
              <X size={12} />
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => {
              const urgent = n.deadline && daysLeft(n.deadline) <= 7;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/student/notices/${n.id}`}>
                    <motion.div
                      className={`group relative h-full rounded-2xl bg-white overflow-hidden
                        border transition-all duration-500
                        ${
                          n.pinned
                            ? "border-[#f4a228]/40 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.35)]"
                            : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.35)]"
                        }`}
                    >
                      {/* Top accent line */}
                      <div
                        className={`h-1 transition-all duration-500
                          ${
                            n.pinned
                              ? "bg-gradient-to-r from-[#f4a228] via-[#e08a10] to-[#f4a228]"
                              : "bg-gradient-to-r from-[#227736] via-[#28a745] to-[#227736]"
                          }`}
                      />

                      {/* Shine sweep */}
                      <motion.div
                        initial={{ x: "-150%" }}
                        whileHover={{ x: "250%" }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r
                          from-transparent via-white/40 to-transparent
                          skew-x-12 pointer-events-none z-10"
                      />

                      {/* Corner glow */}
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500
                          ${
                            n.pinned
                              ? "bg-[#f4a228]/10"
                              : "bg-[#227736]/10"
                          }`}
                      />

                      <div className="relative p-5">
                        {/* Badges row */}
                        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                          {n.pinned && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                              className="inline-flex items-center gap-1
                                text-[9px] font-bold px-2 py-0.5 rounded-full
                                bg-gradient-to-br from-[#f4a228] to-[#e08a10]
                                text-white shadow-md shadow-[#f4a228]/40"
                            >
                              <Pin size={9} /> Pinned
                            </motion.span>
                          )}

                          <span className="inline-flex items-center gap-1
                            text-[9px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded-full
                            bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">
                            {n.category}
                          </span>

                          <span className="inline-flex items-center gap-1
                            text-[9px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded-full
                            bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6]">
                            {n.department}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-[#0f1d17] text-base
                          group-hover:text-[#227736] transition-colors
                          line-clamp-2 tracking-tight">
                          {n.title}
                        </h3>

                        {/* AI Summary */}
                        {n.summary && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 p-3.5 rounded-xl relative overflow-hidden
                              bg-gradient-to-br from-[#fdf7ef] via-white to-[#eaf6ee]
                              border border-[#f4a228]/20
                              group-hover:border-[#f4a228]/40
                              transition-all duration-500"
                          >
                            {/* AI glow */}
                            <motion.div
                              animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute -top-6 -right-6 w-20 h-20 rounded-full
                                bg-[#f4a228]/20 blur-2xl pointer-events-none"
                            />

                            <div className="relative">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <motion.div
                                  animate={{ rotate: [0, 15, -15, 0] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <Sparkles size={11} className="text-[#f4a228]" />
                                </motion.div>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#b86b0a]">
                                  AI Summary
                                </span>
                              </div>
                              <p className="text-xs text-[#5a6e63] leading-relaxed line-clamp-2">
                                {n.summary}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-[#f0f4f2]">
                          <div className="flex items-center gap-3 text-[11px] text-[#5a6e63]">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(n.createdAt)}
                            </span>

                            {n.deadline && (
                              <span
                                className={`flex items-center gap-1 font-bold ${
                                  urgent ? "text-[#dc3545]" : "text-[#f4a228]"
                                }`}
                              >
                                <Clock size={11} />
                                {daysLeft(n.deadline)}d left
                              </span>
                            )}
                          </div>

                          <motion.div
                            whileHover={{ x: 3 }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                              bg-[#f8faf9] group-hover:bg-[#227736]
                              text-[#5a6e63] group-hover:text-white
                              transition-all duration-300"
                          >
                            <ArrowRight size={13} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ==================== FOOTER SUMMARY ==================== */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-[#5a6e63] py-3"
        >
          <CheckCircle2 size={12} className="text-[#227736]" />
          Showing {filtered.length} of {mockNotices.length} notices
        </motion.div>
      )}
    </div>
  );
}