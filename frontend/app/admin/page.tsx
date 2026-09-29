"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, BookOpen, Shield, Ban, Search, Filter,
  Grid3x3, List, UserCheck, UserX, UserCog, MoreVertical,
  Eye, Edit, Trash2, CheckCircle2, AlertCircle, Building2,
  GraduationCap, Calendar, Award, ChevronDown, X, Inbox,
  TrendingUp, UserPlus, Phone, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */
const usersData = [
  {
    id: "s1",
    name: "Sara Manzoor",
    email: "sara@campusconnect.edu",
    role: "student" as const,
    dept: "Computer Science",
    deptShort: "CS",
    sem: 5,
    joined: "2024-08-15",
    status: "active" as const,
    activity: "High",
  },
  {
    id: "s2",
    name: "Abdullah",
    email: "abdullah@campusconnect.edu",
    role: "student" as const,
    dept: "Computer Science",
    deptShort: "CS",
    sem: 5,
    joined: "2024-08-20",
    status: "active" as const,
    activity: "Medium",
  },
  {
    id: "s3",
    name: "Abubakar Nadeem",
    email: "abubakar@campusconnect.edu",
    role: "student" as const,
    dept: "Software Engineering",
    deptShort: "SE",
    sem: 3,
    joined: "2024-09-01",
    status: "active" as const,
    activity: "High",
  },
  {
    id: "s4",
    name: "Umair Akram",
    email: "umair@campusconnect.edu",
    role: "student" as const,
    dept: "Computer Science",
    deptShort: "CS",
    sem: 5,
    joined: "2024-08-25",
    status: "active" as const,
    activity: "Low",
  },
  {
    id: "a1",
    name: "Sir Safi Ullah",
    email: "admin@campusconnect.edu",
    role: "admin" as const,
    dept: "Administration",
    deptShort: "Admin",
    sem: 0,
    joined: "2024-01-10",
    status: "active" as const,
    activity: "High",
  },
];

const roleConfig = {
  admin: {
    icon: Shield,
    label: "Admin",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    gradient: "from-[#227736] to-[#28a745]",
  },
  student: {
    icon: GraduationCap,
    label: "Student",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
  },
};

const activityConfig = {
  High: { color: "text-[#227736]", bg: "bg-[#eaf6ee]" },
  Medium: { color: "text-[#B45A0B]", bg: "bg-[#fdf2e3]" },
  Low: { color: "text-[#5a6e63]", bg: "bg-[#f8faf9]" },
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return usersData.filter((u) => {
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.dept.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchQ && matchRole;
    });
  }, [search, roleFilter]);

  const stats = [
    { label: "Total Users", value: usersData.length, icon: Users, accent: false },
    { label: "Students", value: usersData.filter(u => u.role === "student").length, icon: GraduationCap, accent: true },
    { label: "Admins", value: usersData.filter(u => u.role === "admin").length, icon: Shield, accent: false },
    { label: "Active Now", value: usersData.filter(u => u.activity === "High").length, icon: Activity, accent: true },
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
            <UserCog size={12} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              User Directory
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] 
              flex items-center justify-center shadow-lg shadow-[#227736]/25">
              <Users size={18} className="text-white" />
            </div>
            Manage Users
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Manage student and administrator accounts across the platform.
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
          Add User
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
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or department..."
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

          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {[
              { id: "all", label: "All", icon: Users },
              { id: "student", label: "Students", icon: GraduationCap },
              { id: "admin", label: "Admins", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = roleFilter === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id as any)}
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

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#5a6e63] font-medium">
            Showing {filtered.length} {filtered.length === 1 ? "user" : "users"}
          </span>
        </div>
      </motion.div>

      {/* ==================== USERS ==================== */}
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
          <h3 className="font-bold text-[#0f1d17]">No users found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or search query.
          </p>
        </motion.div>
      ) : view === "grid" ? (
        /* ============ GRID VIEW ============ */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2);
              const actCfg = activityConfig[u.activity as keyof typeof activityConfig];

              return (
                <motion.div
                  key={u.id}
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
                  <div className={`h-1.5 bg-gradient-to-r ${rcfg.gradient}`} />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${u.role === "admin" ? "bg-[#227736]/8" : "bg-[#E67E22]/8"}`}
                  />

                  <div className="relative p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <motion.div
                          whileHover={{ rotate: 8, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center 
                            text-white font-extrabold text-lg shadow-lg 
                            bg-gradient-to-br ${rcfg.gradient}`}
                        >
                          {initials}
                        </motion.div>

                        {/* Status indicator */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 
                          rounded-full border-2 border-white bg-[#28a745]">
                          <motion.span
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[#28a745]"
                          />
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${rcfg.bg} ${rcfg.text} ${rcfg.border}`}
                        >
                          <RoleIcon size={10} />
                          {rcfg.label}
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
                      {u.name}
                    </h3>

                    {/* Role badge for admin */}
                    {u.role === "admin" && (
                      <span className="inline-flex items-center gap-1 mt-1.5 
                        text-[10px] font-bold text-[#227736]">
                        <Shield size={10} />
                        Administrator Access
                      </span>
                    )}

                    {/* Details */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Mail size={11} className="text-[#227736]" />
                        </div>
                        <span className="truncate">{u.email}</span>
                      </div>

                      {u.role === "student" && (
                        <>
                          <div className="flex items-center gap-2 text-[#5a6e63]">
                            <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                              flex items-center justify-center shrink-0">
                              <BookOpen size={11} className="text-[#227736]" />
                            </div>
                            <span className="truncate">{u.dept}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#5a6e63]">
                            <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                              flex items-center justify-center shrink-0">
                              <GraduationCap size={11} className="text-[#E67E22]" />
                            </div>
                            <span>Semester {u.sem}</span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] 
                          flex items-center justify-center shrink-0">
                          <Calendar size={11} className="text-[#227736]" />
                        </div>
                        <span>Joined {u.joined}</span>
                      </div>
                    </div>

                    {/* Footer - activity + actions */}
                    <div className="mt-4 pt-4 border-t border-[#e2ebe6] 
                      flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            ${actCfg.bg} ${actCfg.color}`}
                        >
                          <Activity size={9} />
                          {u.activity}
                        </span>
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
                          aria-label="Suspend"
                        >
                          <Ban size={13} />
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
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2);
              const actCfg = activityConfig[u.activity as keyof typeof activityConfig];

              return (
                <motion.div
                  key={u.id}
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
                      bg-gradient-to-b ${
                        u.role === "admin"
                          ? "from-[#227736] to-[#28a745]"
                          : "from-[#E67E22] to-[#D35400]"
                      }`}
                  />

                  <div className="relative p-5 pl-6 flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center 
                          text-white font-extrabold shadow-md
                          bg-gradient-to-br ${rcfg.gradient}`}
                      >
                        {initials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
                        rounded-full border-2 border-white bg-[#28a745]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[#0f1d17] text-base 
                          group-hover:text-[#227736] transition-colors">
                          {u.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${rcfg.bg} ${rcfg.text} ${rcfg.border}`}
                        >
                          <RoleIcon size={10} />
                          {rcfg.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            ${actCfg.bg} ${actCfg.color}`}
                        >
                          <Activity size={9} />
                          {u.activity}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 
                        mt-1.5 text-xs text-[#5a6e63]">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={11} />
                          {u.email}
                        </span>
                        {u.role === "student" && (
                          <>
                            <span className="inline-flex items-center gap-1.5">
                              <BookOpen size={11} />
                              {u.dept}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <GraduationCap size={11} className="text-[#E67E22]" />
                              Sem {u.sem}
                            </span>
                          </>
                        )}
                      </div>
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
                        aria-label="Suspend"
                      >
                        <Ban size={15} />
                      </motion.button>
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