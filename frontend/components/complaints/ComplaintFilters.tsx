"use client";
import { Search, Filter, X } from "lucide-react";
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
}

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
}: Props) {
  const hasActive = query || status !== "all" || category !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm"
    >
      <div className="grid md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search complaints by title or description..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 
              focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
              transition-all placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category */}
        {onCategoryChange && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
              focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
              transition-all cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Status Tabs */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl flex-wrap">
          {statusTabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onStatusChange(t.value)}
              className={cn(
                "relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300",
                status === t.value
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {status === t.value && (
                <motion.span
                  layoutId="activeStatusTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {hasActive && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-orange-600 
              hover:text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all"
          >
            <Filter size={12} /> Reset
          </button>
        )}
      </div>
    </motion.div>
  );
}