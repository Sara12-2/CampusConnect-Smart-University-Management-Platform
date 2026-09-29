"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog, Mail, Phone, Wrench, Plus, Users, ShieldCheck,
  CheckCircle2, AlertCircle, Search, Filter, Grid3x3, List,
  MoreVertical, Edit, Trash2, Eye, Building2, Calendar,
  Award, Zap, ChevronDown, X, Inbox, TrendingUp, UserPlus,
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
    joined: "2023-08-15",
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
    joined: "2023-06-20",
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
    joined: "2024-01-10",
    tasks: 0,
  },
];

const roleConfig: Record<string, {
  icon: typeof Wrench;
  bg: string;
  text: string;
  border: string;
  gradient: string;
}> = {
  "IT Support": {
    icon: Wrench,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    gradient: "from-[#227736] to-[#28a745]",
  },
  Maintenance: {
    icon: Building2,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
  },
  Electrician: {
    icon: Zap,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
  },
};

export default function AdminStaff() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

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
    { label: "Total Staff", value: staffData.length, icon: Users, accent: false },
    { label: "Active", value: staffData.filter(s => s.active).length, icon: CheckCircle2, accent: false },
    { label: "Inactive", value: staffData.filter(s => !s.active).length, icon: AlertCircle, accent: true },
    { label: "Total Tasks", value: staffData.reduce((sum, s) => sum + s.tasks, 0), icon: Award, accent: true },
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
            <ShieldCheck size={12} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Staff Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] 
              flex items-center justify-center shadow-lg shadow-[#227736]/25">
              <UserCog size={18} className="text-white" />
            </div>
            Manage Staff
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Manage staff members for complaint assignment and resolution.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
            bg-[#227736] text-white text-sm font-bold 
            shadow-lg shadow-[#227736]/25 
            hover:bg-[#1c6430] hover:shadow-xl hover:shadow-[#227736]/30
            transition-all duration-300"
        >
          <UserPlus size={16} strokeWidth={2.5} />
          Add Staff
        </motion.button>
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

              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center 
                  mb-3 shadow-md 
                  ${
                    s.accent
                      ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white shadow-[#E67E22]/30"
                      : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-[#227736]/30"
                  }`}
              >
                <Icon size={18} strokeWidth={2.2} />
              </motion.div>

              <p className="relative text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                {s.value}
              </p>
              <p className="relative text-xs text-[#5a6e63] mt-0.5 font-medium">
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

      {/* ==================== FILTERS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
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
              placeholder="Search by name, role, or email..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl 
                bg-white border-2 border-[#e2ebe6] text-[#0f1d17] 
                placeholder:text-[#5a6e63]/60
                outline-none transition-all duration-300 
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                  p-1 rounded-md text-[#5a6e63] hover:text-[#227736] 
                  hover:bg-[#eaf6ee] transition-all"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {[
              { id: "all", label: "All", icon: Users },
              { id: "active", label: "Active", icon: CheckCircle2 },
              { id: "inactive", label: "Inactive", icon: AlertCircle },
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

        {/* Count */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#5a6e63] font-medium">
            Showing {filtered.length} {filtered.length === 1 ? "member" : "members"}
          </span>
        </div>
      </motion.div>

      {/* ==================== STAFF ==================== */}
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
          <h3 className="font-bold text-[#0f1d17]">No staff found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or add a new staff member.
          </p>
        </motion.div>
      ) : view === "grid" ? (
        /* ============ GRID VIEW ============ */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => {
              const cfg = roleConfig[s.role] || roleConfig["IT Support"];
              const RoleIcon = cfg.icon;
              const initials = s.name.split(" ").map(n => n[0]).join("").slice(0, 2);

              return (
                <motion.div
                  key={s.id}
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
                  <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${s.active ? "bg-[#227736]/8" : "bg-[#E67E22]/8"}`}
                  />

                  <div className="relative p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Avatar */}
                      <div className="relative">
                        <motion.div
                          whileHover={{ rotate: 8, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center 
                            text-white font-extrabold text-lg shadow-lg 
                            bg-gradient-to-br ${cfg.gradient}`}
                        >
                          {initials}
                        </motion.div>

                        {/* Status indicator */}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full 
                            border-2 border-white 
                            ${s.active ? "bg-[#28a745]" : "bg-[#5a6e63]"}`}
                        >
                          {s.active && (
                            <motion.span
                              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full bg-[#28a745]"
                            />
                          )}
                        </span>
                      </div>

                      {/* Status badge + menu */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${
                              s.active
                                ? "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                                : "bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]"
                            }`}
                        >
                          {s.active ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                          {s.active ? "Active" : "Inactive"}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-[#5a6e63] 
                            hover:bg-[#f8faf9] hover:text-[#227736] 
                            transition-all duration-200"
                          aria-label="More"
                        >
                          <MoreVertical size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-[#0f1d17] text-base 
                      group-hover:text-[#227736] transition-colors">
                      {s.name}
                    </h3>

                    {/* Role badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 mt-2 
                        text-[10px] font-bold px-2.5 py-1 rounded-full 
                        border uppercase tracking-wider
                        ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <RoleIcon size={11} />
                      {s.role}
                    </span>

                    {/* Details */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Mail size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">{s.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Phone size={11} className="text-[#227736]" />
                        </div>
                        <span>{s.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Building2 size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">{s.department}</span>
                      </div>
                    </div>

                    {/* Footer - tasks + joined */}
                    <div className="mt-4 pt-4 border-t border-[#e2ebe6] 
                      flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-[#eaf6ee] 
                          flex items-center justify-center">
                          <Award size={11} className="text-[#227736]" />
                        </div>
                        <span className="text-xs font-bold text-[#0f1d17]">
                          {s.tasks}
                        </span>
                        <span className="text-[10px] text-[#5a6e63]">tasks</span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-[#5a6e63] 
                            hover:bg-[#f8faf9] hover:text-[#227736] 
                            transition-all duration-200"
                          aria-label="View"
                        >
                          <Eye size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-[#227736] 
                            hover:bg-[#eaf6ee] transition-all duration-200"
                          aria-label="Edit"
                        >
                          <Edit size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg text-[#dc3545] 
                            hover:bg-[#fdeaea] transition-all duration-200"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
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
            {filtered.map((s, i) => {
              const cfg = roleConfig[s.role] || roleConfig["IT Support"];
              const RoleIcon = cfg.icon;
              const initials = s.name.split(" ").map(n => n[0]).join("").slice(0, 2);

              return (
                <motion.div
                  key={s.id}
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
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-1 
                      ${s.active ? "bg-[#227736]" : "bg-[#5a6e63]"}`}
                  />

                  <div className="relative p-5 pl-6 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center 
                          text-white font-extrabold shadow-md
                          bg-gradient-to-br ${cfg.gradient}`}
                      >
                        {initials}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
                          rounded-full border-2 border-white 
                          ${s.active ? "bg-[#28a745]" : "bg-[#5a6e63]"}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[#0f1d17] text-base 
                          group-hover:text-[#227736] transition-colors">
                          {s.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <RoleIcon size={10} />
                          {s.role}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${
                              s.active
                                ? "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                                : "bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]"
                            }`}
                        >
                          {s.active ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                          {s.active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 
                        mt-2 text-xs text-[#5a6e63]">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={11} />
                          {s.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={11} />
                          {s.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 size={11} />
                          {s.department}
                        </span>
                      </div>
                    </div>

                    {/* Tasks + actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-[#eaf6ee] 
                          flex items-center justify-center">
                          <Award size={11} className="text-[#227736]" />
                        </div>
                        <span className="text-xs font-bold text-[#0f1d17]">
                          {s.tasks}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#5a6e63] 
                            hover:bg-[#f8faf9] hover:text-[#227736] 
                            transition-all duration-200"
                          aria-label="View"
                        >
                          <Eye size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#227736] 
                            hover:bg-[#eaf6ee] transition-all duration-200"
                          aria-label="Edit"
                        >
                          <Edit size={15} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-[#dc3545] 
                            hover:bg-[#fdeaea] transition-all duration-200"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
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
    </div>
  );
}