"use client";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabType = "all" | "lost" | "found";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  tab: TabType;
  onTabChange: (t: TabType) => void;
  location?: string;
  onLocationChange?: (l: string) => void;
  locations?: string[];
  onReset?: () => void;
}

const tabs: { value: TabType; label: string; color: string }[] = [
  { value: "all", label: "All Items", color: "text-slate-700" },
  { value: "lost", label: "Lost", color: "text-orange-600" },
  { value: "found", label: "Found", color: "text-green-600" },
];

export default function ItemFilters({
  query,
  onQueryChange,
  tab,
  onTabChange,
  location = "all",
  onLocationChange,
  locations = [],
  onReset,
}: Props) {
  const hasActiveFilter = query || tab !== "all" || location !== "all";

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
            placeholder="Search by item name, description, or location..."
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

        {/* Location Filter */}
        {onLocationChange && (
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
              focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
              transition-all cursor-pointer"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onTabChange(t.value)}
              className={cn(
                "relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                tab === t.value
                  ? "bg-white shadow-sm " + t.color
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab === t.value && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {hasActiveFilter && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 
              hover:text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all"
          >
            <Filter size={12} /> Reset Filters
          </button>
        )}
      </div>
    </motion.div>
  );
}