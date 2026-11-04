"use client";
import { Search, Filter, X, RotateCcw, Sliders } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types";

export type StatusFilter = "all" | ComplaintStatus;
export type CategoryFilter =
  | "all"
  | "classroom"
  | "lab"
  | "electricity"
  | "wifi"
  | "furniture"
  | "other";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  category?: CategoryFilter;
  onCategoryChange?: (c: CategoryFilter) => void;
  onReset?: () => void;
  resultsCount?: number;
}

/* ============================================================
   TABS
   ============================================================ */
const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "assigned", label: "Assigned" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "classroom", label: "Classroom" },
  { value: "lab", label: "Computer Lab" },
  { value: "electricity", label: "Electricity" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" },
];

export default function ComplaintFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  category = "all",
  onCategoryChange,
  onReset,
  resultsCount,
}: Props) {
  const hasActive = query || status !== "all" || category !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-[#e2ebe6] bg-white p-4 md:p-5 
        shadow-sm shadow-[#227736]/5 overflow-hidden"
    >
      {/* ============ TOP ACCENT LINE ============ */}
      <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full 
        bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22] opacity-60" />

      {/* ============ HEADER ROW ============ */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] 
            flex items-center justify-center">
            <Sliders size={13} className="text-[#227736]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5a6e63] uppercase tracking-[0.15em]">
              Filters
            </p>
            {typeof resultsCount === "number" && (
              <p className="text-xs font-bold text-[#0f1d17]">
                {resultsCount} {resultsCount === 1 ? "result" : "results"}
              </p>
            )}
          </div>
        </div>

        {hasActive && onReset && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={onReset}
            className="group inline-flex items-center gap-1.5 text-[11px] font-bold 
              text-[#E67E22] hover:text-white 
              px-3 py-1.5 rounded-lg 
              bg-[#fdf2e3] hover:bg-[#E67E22] 
              border border-[#E67E22]/30 hover:border-[#E67E22]
              transition-all duration-300"
          >
            <RotateCcw
              size={11}
              strokeWidth={2.5}
              className="group-hover:-rotate-180 transition-transform duration-500"
            />
            Reset
          </motion.button>
        )}
      </div>

      {/* ============ SEARCH + CATEGORY ROW ============ */}
      <div className="grid md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative md:col-span-2 group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63] 
              group-focus-within:text-[#227736] transition-colors duration-300"
            size={15}
            strokeWidth={2.5}
          />
          <input
            placeholder="Search by title, description, or student name..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl 
              bg-[#f8faf9] border-2 border-[#e2ebe6] text-[#0f1d17]
              outline-none transition-all duration-300 
              placeholder:text-[#5a6e63]/60
              focus:bg-white focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
          />
          {query && (
            <motion.button
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                p-1 rounded-md text-[#5a6e63] 
                hover:text-[#227736] hover:bg-[#eaf6ee] 
                transition-all duration-200"
              aria-label="Clear search"
            >
              <X size={13} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>

        {/* Category dropdown */}
        {onCategoryChange && (
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
              className="w-full appearance-none rounded-xl 
                bg-[#f8faf9] border-2 border-[#e2ebe6] 
                pl-4 pr-10 py-2.5 text-sm text-[#0f1d17]
                outline-none cursor-pointer transition-all duration-300 
                hover:border-[#227736]/40 hover:bg-white
                focus:bg-white focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <Filter
              size={13}
              strokeWidth={2.5}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                text-[#5a6e63] pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* ============ STATUS TABS ============ */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[10px] font-bold 
          text-[#5a6e63] uppercase tracking-wider shrink-0">
          <Filter size={11} className="text-[#227736]" strokeWidth={2.5} />
          Status:
        </div>

        <div className="relative flex gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] 
          rounded-xl flex-wrap">
          {statusTabs.map((t) => {
            const active = status === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onStatusChange(t.value)}
                className={cn(
                  "relative px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 whitespace-nowrap",
                  active
                    ? "text-white"
                    : "text-[#5a6e63] hover:text-[#227736] hover:bg-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="activeStatusTab"
                    className="absolute inset-0 rounded-lg 
                      bg-gradient-to-r from-[#227736] to-[#1c6430]
                      shadow-md shadow-[#227736]/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}