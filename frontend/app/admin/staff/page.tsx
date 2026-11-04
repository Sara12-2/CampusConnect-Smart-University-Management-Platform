"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog, Mail, Phone, Building2, UserPlus, Users,
  CheckCircle2, AlertCircle, Search, X, Inbox, Award,
  MoreVertical, Edit, Trash2, Eye, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */
const staffData = [
  {
    id: "st1",
    name: "Muhammad Ali",
    role: "IT Support",
    email: "ali@campus.edu",
    phone: "+92 300 1111111",
    active: true,
    department: "Computer Lab",
    tasks: 12,
  },
  {
    id: "st2",
    name: "Fatima Khan",
    role: "Maintenance",
    email: "fatima@campus.edu",
    phone: "+92 300 2222222",
    active: true,
    department: "Facilities",
    tasks: 8,
  },
  {
    id: "st3",
    name: "Hassan Raza",
    role: "Electrician",
    email: "hassan@campus.edu",
    phone: "+92 300 3333333",
    active: false,
    department: "Maintenance",
    tasks: 0,
  },
];

export default function AdminStaff() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = staffData.filter((s) => {
    const q = search.toLowerCase().trim();
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "active" && s.active) ||
      (filter === "inactive" && !s.active);
    return matchQ && matchFilter;
  });

  const stats = [
    { label: "Total Staff", value: staffData.length, icon: Users },
    {
      label: "Active",
      value: staffData.filter((s) => s.active).length,
      icon: CheckCircle2,
    },
    {
      label: "Inactive",
      value: staffData.filter((s) => !s.active).length,
      icon: AlertCircle,
      accent: true,
    },
    {
      label: "Tasks",
      value: staffData.reduce((sum, s) => sum + s.tasks, 0),
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-4 pb-5
          border-b border-[#e2ebe6]"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
            bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Shield size={11} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Staff Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight
            flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430]
              flex items-center justify-center text-white shadow-md shadow-[#227736]/20">
              <UserCog size={20} />
            </div>
            Manage Staff
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Assign tasks and manage complaint resolution team.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-[#227736] text-white text-sm font-bold
            shadow-md shadow-[#227736]/25 hover:bg-[#1c6430]
            hover:shadow-lg hover:shadow-[#227736]/30
            transition-all duration-300 overflow-hidden group"
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
            transition-transform duration-700
            bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <UserPlus size={15} className="relative" />
          <span className="relative">Add Staff</span>
        </motion.button>
      </motion.div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className={cn(
                "group relative bg-white rounded-2xl border p-4 transition-all duration-300",
                s.accent
                  ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-lg hover:shadow-[#f4a228]/10"
                  : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-lg hover:shadow-[#227736]/10"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center border",
                    s.accent
                      ? "bg-[#fdf7ef] border-[#f4a228]/30 text-[#b86b0a]"
                      : "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]"
                  )}
                >
                  <Icon size={15} strokeWidth={2.2} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#0f1d17] tracking-tight tabular-nums">
                {s.value}
              </p>
              <p className="text-[10px] text-[#5a6e63] font-bold uppercase tracking-wider mt-0.5">
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== SEARCH + FILTER ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-3 md:items-center"
      >
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
            placeholder="Search staff by name, role, email, or department..."
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
              className="absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded-md text-[#5a6e63] hover:text-[#227736]
                hover:bg-[#eaf6ee] transition-all"
              aria-label="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6]
          rounded-xl shrink-0">
          {[
            { id: "all", label: "All", count: staffData.length },
            { id: "active", label: "Active", count: staffData.filter((s) => s.active).length },
            { id: "inactive", label: "Inactive", count: staffData.filter((s) => !s.active).length },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-[#227736] text-white shadow-sm shadow-[#227736]/20"
                    : "text-[#5a6e63] hover:text-[#0f1d17] hover:bg-[#f8faf9]"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center",
                    active ? "bg-white/20 text-white" : "bg-[#f8faf9] text-[#5a6e63]"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== STAFF LIST ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-[#e2ebe6]
            rounded-2xl bg-[#f8faf9]"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee]
            border border-[#c8e6d1] flex items-center justify-center mb-4">
            <Inbox size={26} className="text-[#227736]" />
          </div>
          <h3 className="font-bold text-[#0f1d17]">No staff found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or add a new member.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => {
              const initials = s.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

              return (
                <motion.div
                  key={s.id}
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
                  <span
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      s.active ? "bg-[#227736]" : "bg-[#5a6e63]/50"
                    )}
                  />

                  <div className="p-4 pl-5 flex items-center gap-4 flex-wrap sm:flex-nowrap">

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-md transition-all duration-300",
                          s.active
                            ? "bg-gradient-to-br from-[#227736] to-[#1c6430] shadow-[#227736]/25"
                            : "bg-gradient-to-br from-[#5a6e63] to-[#3d4d46] shadow-[#5a6e63]/20"
                        )}
                      >
                        {initials}
                      </motion.div>

                      {/* Active dot */}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white",
                          s.active ? "bg-[#28a745]" : "bg-[#5a6e63]"
                        )}
                      >
                        {s.active && (
                          <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[#28a745]"
                          />
                        )}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[#0f1d17] text-base
                          group-hover:text-[#227736] transition-colors">
                          {s.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                          bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6] uppercase tracking-wider">
                          {s.role}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                            s.active
                              ? "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                              : "bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]"
                          )}
                        >
                          {s.active ? <CheckCircle2 size={9} /> : <AlertCircle size={9} />}
                          {s.active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-[#5a6e63]">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={11} className="text-[#227736]" />
                          {s.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={11} className="text-[#227736]" />
                          {s.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 size={11} className="text-[#227736]" />
                          {s.department}
                        </span>
                      </div>
                    </div>

                    {/* Tasks + actions */}
                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      {/* Tasks chip */}
                      <div className={cn(
                        "hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border",
                        s.tasks > 0
                          ? "bg-[#fdf7ef] border-[#f4a228]/30"
                          : "bg-[#f8faf9] border-[#e2ebe6]"
                      )}>
                        <Award size={11} className={s.tasks > 0 ? "text-[#b86b0a]" : "text-[#5a6e63]"} />
                        <span className="text-xs font-bold text-[#0f1d17] tabular-nums">
                          {s.tasks}
                        </span>
                        <span className="text-[9px] text-[#5a6e63] uppercase tracking-wider">
                          tasks
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#5a6e63]
                            hover:bg-[#f8faf9] hover:text-[#227736] transition-all"
                          aria-label="View"
                        >
                          <Eye size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#227736]
                            hover:bg-[#eaf6ee] transition-all"
                          aria-label="Edit"
                        >
                          <Edit size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#dc3545]
                            hover:bg-[#fdeaea] transition-all"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </motion.button>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-[#5a6e63] py-2"
        >
          Showing <span className="font-bold text-[#0f1d17]">{filtered.length}</span> of{" "}
          <span className="font-bold text-[#0f1d17]">{staffData.length}</span> staff members
        </motion.div>
      )}
    </div>
  );
}