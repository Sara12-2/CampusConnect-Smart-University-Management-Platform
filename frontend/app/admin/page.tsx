"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Users, Mail, BookOpen, Shield, Ban, Search, Grid3x3, List,
  UserCog, Eye, Edit, GraduationCap, Calendar, X, Inbox,
  UserPlus, Activity, CheckCircle2, MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   TYPES
   ============================================================ */

type Role = "student" | "admin";
type RoleFilter = "all" | Role;
type ViewType = "grid" | "list";
type ActivityLevel = "High" | "Medium" | "Low";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  dept: string;
  sem: number;
  joined: string;
  activity: ActivityLevel;
}

/* ============================================================
   DATA
   ============================================================ */

const usersData: UserRow[] = [
  { id: "s1", name: "Sara Manzoor", email: "sara@campusconnect.edu", role: "student", dept: "Computer Science", sem: 5, joined: "2024-08-15", activity: "High" },
  { id: "s2", name: "Abdullah", email: "abdullah@campusconnect.edu", role: "student", dept: "Computer Science", sem: 5, joined: "2024-08-20", activity: "Medium" },
  { id: "s3", name: "Abubakar Nadeem", email: "abubakar@campusconnect.edu", role: "student", dept: "Software Engineering", sem: 3, joined: "2024-09-01", activity: "High" },
  { id: "s4", name: "Umair Akram", email: "umair@campusconnect.edu", role: "student", dept: "Computer Science", sem: 5, joined: "2024-08-25", activity: "Low" },
  { id: "a1", name: "Sir Safi Ullah", email: "admin@campusconnect.edu", role: "admin", dept: "Administration", sem: 0, joined: "2024-01-10", activity: "High" },
];

/* ============================================================
   CONFIG
   ============================================================ */

const roleConfig: Record<
  Role,
  {
    icon: typeof Shield;
    label: string;
    bg: string;
    text: string;
    border: string;
    gradient: string;
    accentDot: string;
  }
> = {
  admin: {
    icon: Shield,
    label: "Admin",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    gradient: "from-[#227736] to-[#1c6430]",
    accentDot: "bg-[#227736]",
  },
  student: {
    icon: GraduationCap,
    label: "Student",
    bg: "bg-[#fdf2e3]",
    text: "text-[#E67E22]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
    accentDot: "bg-[#E67E22]",
  },
};

const activityConfig: Record<
  ActivityLevel,
  { color: string; bg: string; dot: string; ring: string }
> = {
  High: {
    color: "text-[#227736]",
    bg: "bg-[#eaf6ee]",
    dot: "bg-[#227736]",
    ring: "ring-[#227736]/20",
  },
  Medium: {
    color: "text-[#B45A0B]",
    bg: "bg-[#fdf2e3]",
    dot: "bg-[#E67E22]",
    ring: "ring-[#E67E22]/20",
  },
  Low: {
    color: "text-[#5a6e63]",
    bg: "bg-[#f8faf9]",
    dot: "bg-[#5a6e63]",
    ring: "ring-[#5a6e63]/15",
  },
};

const roleTabs: { id: RoleFilter; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All", icon: Users },
  { id: "student", label: "Students", icon: GraduationCap },
  { id: "admin", label: "Admins", icon: Shield },
];

const viewTabs: { id: ViewType; icon: typeof Grid3x3; label: string }[] = [
  { id: "grid", icon: Grid3x3, label: "Grid view" },
  { id: "list", icon: List, label: "List view" },
];

/* ============================================================
   AVATAR
   ============================================================ */

function Avatar({
  name,
  role,
  size = "md",
}: {
  name: string;
  role: Role;
  size?: "sm" | "md";
}) {
  const shouldReduceMotion = useReducedMotion();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cfg = roleConfig[role];
  const sizes =
    size === "sm"
      ? "w-11 h-11 text-sm rounded-xl"
      : "w-14 h-14 text-lg rounded-[1.25rem]";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shadow-md bg-gradient-to-br shrink-0 text-white font-bold tracking-wider",
        cfg.gradient,
        sizes
      )}
      aria-hidden="true"
    >
      {initials}
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-[#28a745]",
          size === "sm" ? "w-3 h-3" : "w-4 h-4"
        )}
      >
        {!shouldReduceMotion && (
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#28a745]"
          />
        )}
      </span>
    </div>
  );
}

/* ============================================================
   ACTION BUTTONS
   ============================================================ */

function ActionButtons({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="p-2 rounded-lg text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736] transition-colors"
        aria-label={`View ${name}`}
        title="View"
      >
        <Eye size={15} />
      </button>
      <button
        className="p-2 rounded-lg text-[#227736] hover:bg-[#eaf6ee] transition-colors"
        aria-label={`Edit ${name}`}
        title="Edit"
      >
        <Edit size={15} />
      </button>
      <button
        className="p-2 rounded-lg text-[#dc3545] hover:bg-[#fdeaea] transition-colors"
        aria-label={`Block ${name}`}
        title="Block"
      >
        <Ban size={15} />
      </button>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminUsers() {
  const shouldReduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [view, setView] = useState<ViewType>("grid");

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
    { label: "Students", value: usersData.filter((u) => u.role === "student").length, icon: GraduationCap, accent: true },
    { label: "Admins", value: usersData.filter((u) => u.role === "admin").length, icon: Shield, accent: false },
    { label: "Active Now", value: usersData.filter((u) => u.activity === "High").length, icon: Activity, accent: true },
  ];

  const roleCounts: Record<RoleFilter, number> = {
    all: usersData.length,
    student: usersData.filter((u) => u.role === "student").length,
    admin: usersData.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <UserCog size={14} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              User Directory
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] flex items-center justify-center shadow-lg shadow-[#227736]/20">
              <Users size={20} className="text-white" />
            </div>
            Manage Users
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Manage student and administrator accounts across the platform.
          </p>
        </div>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-lg shadow-[#227736]/20 hover:bg-[#1c6430] hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <UserPlus size={16} className="relative" />
          <span className="relative">Add User</span>
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
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 shadow-sm hover:shadow-xl hover:shadow-[#227736]/5 hover:border-[#227736]/30 transition-all duration-300 overflow-hidden"
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  s.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"
                )}
              />
              <div
                className={cn(
                  "relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm",
                  s.accent
                    ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white shadow-[#E67E22]/25"
                    : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-[#227736]/25"
                )}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <p className="relative text-3xl font-extrabold text-[#0f1d17] tracking-tight tabular-nums">
                {s.value}
              </p>
              <p className="relative text-[10px] text-[#5a6e63] mt-1 font-bold uppercase tracking-wider">
                {s.label}
              </p>
              <span
                className={cn(
                  "absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full",
                  s.accent ? "bg-[#E67E22]" : "bg-[#227736]"
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ==================== FILTERS ==================== */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-white p-3 md:p-4 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63] peer-focus:text-[#227736] transition-colors"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department..."
            aria-label="Search users"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:bg-white focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl shrink-0">
          {roleTabs.map((tab) => {
            const Icon = tab.icon;
            const active = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                aria-pressed={active}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors",
                  active
                    ? "text-white"
                    : "text-[#5a6e63] hover:text-[#227736] hover:bg-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="roleTabBg"
                    className="absolute inset-0 rounded-lg bg-[#227736] shadow-sm shadow-[#227736]/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon size={13} /> {tab.label}
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-white text-[#5a6e63]"
                    )}
                  >
                    {roleCounts[tab.id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* View tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl shrink-0">
          {viewTabs.map((v) => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                aria-pressed={active}
                aria-label={v.label}
                className={cn(
                  "relative p-2 rounded-lg transition-colors",
                  active
                    ? "text-white"
                    : "text-[#5a6e63] hover:text-[#227736] hover:bg-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="viewTabBg"
                    className="absolute inset-0 rounded-lg bg-[#227736] shadow-sm shadow-[#227736]/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={14} className="relative" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== USERS ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6] shadow-sm"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-4"
          >
            <Inbox size={28} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17] text-lg">No users found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or search query.
          </p>
        </motion.div>
      ) : view === "grid" ? (
        /* ============ GRID VIEW ============ */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const actCfg = activityConfig[u.activity];

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  className="group relative bg-white rounded-[2rem] border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#227736]/5 transition-all duration-300"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${rcfg.gradient}`} />
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      u.role === "admin" ? "bg-[#227736]/5" : "bg-[#E67E22]/5"
                    )}
                  />

                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <Avatar name={u.name} role={u.role} />
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider",
                          rcfg.bg,
                          rcfg.text,
                          rcfg.border
                        )}
                      >
                        <RoleIcon size={12} /> {rcfg.label}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-[#0f1d17] text-lg group-hover:text-[#227736] transition-colors line-clamp-1">
                      {u.name}
                    </h3>
                    <p className="text-xs text-[#5a6e63] mt-0.5 truncate flex items-center gap-1.5">
                      <Mail size={11} /> {u.email}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-[#5a6e63]">
                      {u.role === "student" && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#f8faf9] flex items-center justify-center shrink-0">
                              <BookOpen size={11} className="text-[#227736]" />
                            </div>
                            <span className="truncate">{u.dept}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#fdf2e3] flex items-center justify-center shrink-0">
                              <GraduationCap size={11} className="text-[#E67E22]" />
                            </div>
                            <span>Semester {u.sem}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#f8faf9] flex items-center justify-center shrink-0">
                          <Calendar size={11} className="text-[#227736]" />
                        </div>
                        <span>
                          Joined{" "}
                          {new Date(u.joined).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#e2ebe6] flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ring-1",
                          actCfg.bg,
                          actCfg.color,
                          actCfg.ring
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", actCfg.dot)} />
                        {u.activity} Activity
                      </span>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <ActionButtons name={u.name} />
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
        <div className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm overflow-hidden">
          {/* Table header (desktop only) */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-[#f8faf9] border-b border-[#e2ebe6] text-[10px] font-bold uppercase tracking-wider text-[#5a6e63]">
            <div className="col-span-5">User</div>
            <div className="col-span-3">Department</div>
            <div className="col-span-2">Activity</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const actCfg = activityConfig[u.activity];

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative grid md:grid-cols-12 gap-3 px-5 py-4 items-center border-b border-[#e2ebe6] last:border-0 hover:bg-[#f8faf9]/60 transition-colors"
                >
                  {/* Left accent bar */}
                  <span
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity",
                      rcfg.accentDot
                    )}
                  />

                  {/* User cell */}
                  <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                    <Avatar name={u.name} role={u.role} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[#0f1d17] text-sm group-hover:text-[#227736] transition-colors truncate">
                          {u.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border",
                            rcfg.bg,
                            rcfg.text,
                            rcfg.border
                          )}
                        >
                          <RoleIcon size={9} /> {rcfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5a6e63] truncate flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {u.email}
                      </p>
                    </div>
                  </div>

                  {/* Department cell */}
                  <div className="md:col-span-3 text-xs text-[#5a6e63] flex items-center gap-1.5">
                    {u.role === "student" ? (
                      <>
                        <BookOpen size={11} className="text-[#227736] shrink-0" />
                        <span className="truncate">
                          {u.dept} · Sem {u.sem}
                        </span>
                      </>
                    ) : (
                      <>
                        <Shield size={11} className="text-[#227736] shrink-0" />
                        <span>{u.dept}</span>
                      </>
                    )}
                  </div>

                  {/* Activity cell */}
                  <div className="md:col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1",
                        actCfg.bg,
                        actCfg.color,
                        actCfg.ring
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", actCfg.dot)} />
                      {u.activity}
                    </span>
                  </div>

                  {/* Actions cell */}
                  <div className="md:col-span-2 flex md:justify-end">
                    <ActionButtons name={u.name} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="text-center text-xs text-[#5a6e63] py-2">
          Showing{" "}
          <span className="font-bold text-[#0f1d17]">{filtered.length}</span> of{" "}
          <span className="font-bold text-[#0f1d17]">{usersData.length}</span>{" "}
          users
        </div>
      )}
    </div>
  );
}