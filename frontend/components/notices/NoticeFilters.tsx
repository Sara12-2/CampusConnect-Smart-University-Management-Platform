"use client";
import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NoticeCategoryFilter =
  | "all"
  | "exam"
  | "event"
  | "fee"
  | "urgent"
  | "general";

export type NoticeSortOption = "newest" | "oldest" | "deadline";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  category: NoticeCategoryFilter;
  onCategoryChange: (c: NoticeCategoryFilter) => void;
  department: string;
  onDepartmentChange: (d: string) => void;
  semester?: string;
  onSemesterChange?: (s: string) => void;
  sort?: NoticeSortOption;
  onSortChange?: (s: NoticeSortOption) => void;
  onReset?: () => void;
  departments?: string[];
}

const categoryTabs: { value: NoticeCategoryFilter; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "📋" },
  { value: "exam", label: "Exam", emoji: "📝" },
  { value: "event", label: "Event", emoji: "🎉" },
  { value: "fee", label: "Fee", emoji: "💰" },
  { value: "urgent", label: "Urgent", emoji: "🚨" },
  { value: "general", label: "General", emoji: "📌" },
];

const sortOptions: { value: NoticeSortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "deadline", label: "By Deadline" },
];

export default function NoticeFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  department,
  onDepartmentChange,
  semester = "all",
  onSemesterChange,
  sort = "newest",
  onSortChange,
  onReset,
  departments = ["All", "Computer Science", "Software Engineering", "Business Admin"],
}: Props) {
  const hasActive =
    query || category !== "all" || department !== "All" || semester !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm"
    >
      {/* Row 1: Search + Department + Semester */}
      <div className="grid md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search notices by title, content, or department..."
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

        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
            focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
            transition-all cursor-pointer"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d === "All" ? "All Departments" : d}
            </option>
          ))}
        </select>

        {onSemesterChange ? (
          <select
            value={semester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
              focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
              transition-all cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={String(n)}>
                Semester {n}
              </option>
            ))}
          </select>
        ) : (
          onSortChange && (
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as NoticeSortOption)}
              className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
                focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
                transition-all cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )
        )}
      </div>

      {/* Row 2: Category Tabs */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl flex-wrap">
          {categoryTabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onCategoryChange(t.value)}
              className={cn(
                "relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300",
                category === t.value
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {category === t.value && (
                <motion.span
                  layoutId="activeNoticeCategory"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">
                {t.emoji} {t.label}
              </span>
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
            <Filter size={12} /> Reset Filters
          </button>
        )}
      </div>
    </motion.div>
  );
}