"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, BookOpen, Shield, Ban, Search,
  Grid3x3, List, UserCog, Eye, Edit,
  GraduationCap, Calendar, X, Inbox,
  UserPlus, Activity
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
    sem: 5,
    joined: "2024-08-15",
    activity: "High",
  },
  {
    id: "s2",
    name: "Abdullah",
    email: "abdullah@campusconnect.edu",
    role: "student" as const,
    dept: "Computer Science",
    sem: 5,
    joined: "2024-08-20",
    activity: "Medium",
  },
  {
    id: "s3",
    name: "Abubakar Nadeem",
    email: "abubakar@campusconnect.edu",
    role: "student" as const,
    dept: "Software Engineering",
    sem: 3,
    joined: "2024-09-01",
    activity: "High",
  },
  {
    id: "s4",
    name: "Umair Akram",
    email: "umair@campusconnect.edu",
    role: "student" as const,
    dept: "Computer Science",
    sem: 5,
    joined: "2024-08-25",
    activity: "Low",
  },
  {
    id: "a1",
    name: "Sir Safi Ullah",
    email: "admin@campusconnect.edu",
    role: "admin" as const,
    dept: "Administration",
    sem: 0,
    joined: "2024-01-10",
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
    gradient: "from-[#227736] to-[#1c6430]",
  },
  student: {
    icon: GraduationCap,
    label: "Student",
    bg: "bg-[#fdf2e3]",
    text: "text-[#E67E22]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
  },
};

const activityConfig = {
  High: { color: "text-[#227736]", bg: "bg-[#eaf6ee]" },
  Medium: { color: "text-[#E67E22]", bg: "bg-[#fdf2e3]" },
  Low: { color: "text-[#5a6e63]", bg: "bg-[#f8faf9]" },
};

/* ✅ Initials Avatar (Professional Look) */
function Avatar({ name, role }: { name: string, role: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgGradient = role === "admin" ? "from-[#227736] to-[#1c6430]" : "from-[#E67E22] to-[#D35400]";
  
  return (
    <div className={`relative w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-md bg-gradient-to-br ${bgGradient} shrink-0 text-white font-bold text-lg tracking-wider`}>
      {initials}
      {/* Status dot */}
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#28a745]">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[#28a745]"
        />
      </span>
    </div>
  );
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return usersData.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* ==================== HEADER ==================== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <UserCog size={14} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">User Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] flex items-center justify-center shadow-lg shadow-[#227736]/20">
              <Users size={20} className="text-white" />
            </div>
            Manage Users
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">Manage student and administrator accounts across the platform.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-lg shadow-[#227736]/20 hover:bg-[#1c6430] transition-all duration-300">
          <UserPlus size={16} /> Add User
        </button>
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
              className="group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 shadow-sm hover:shadow-md hover:border-[#227736]/30 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm ${s.accent ? "bg-[#fdf2e3] text-[#E67E22]" : "bg-[#eaf6ee] text-[#227736]"}`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <p className="text-3xl font-extrabold text-[#0f1d17] tracking-tight">{s.value}</p>
              <p className="text-xs text-[#5a6e63] mt-1 font-semibold uppercase tracking-wider">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== FILTERS ==================== */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-white p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:bg-white focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl shrink-0">
          {[
            { id: "all", label: "All", icon: Users },
            { id: "student", label: "Students", icon: GraduationCap },
            { id: "admin", label: "Admins", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  active ? "bg-[#227736] text-white shadow-sm" : "text-[#5a6e63] hover:text-[#227736] hover:bg-white"
                )}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl shrink-0">
          {[
            { id: "grid", icon: Grid3x3 },
            { id: "list", icon: List },
          ].map((v) => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  active ? "bg-[#227736] text-white shadow-sm" : "text-[#5a6e63] hover:text-[#227736] hover:bg-white"
                )}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== USERS ==================== */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6] shadow-sm">
          <Inbox size={40} className="mx-auto text-[#5a6e63]/40 mb-4" />
          <h3 className="font-bold text-[#0f1d17] text-lg">No users found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">Try changing filters or search query.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const actCfg = activityConfig[u.activity as keyof typeof activityConfig];

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group relative bg-white rounded-[2rem] border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${rcfg.gradient}`} />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <Avatar name={u.name} role={u.role} />
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${rcfg.bg} ${rcfg.text} ${rcfg.border}`}>
                          <RoleIcon size={12} /> {rcfg.label}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-[#0f1d17] text-lg group-hover:text-[#227736] transition-colors">{u.name}</h3>
                    
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <Mail size={14} className="text-[#227736]" /> <span className="truncate">{u.email}</span>
                      </div>
                      {u.role === "student" && (
                        <>
                          <div className="flex items-center gap-2 text-[#5a6e63]">
                            <BookOpen size={14} className="text-[#227736]" /> <span>{u.dept}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#5a6e63]">
                            <GraduationCap size={14} className="text-[#E67E22]" /> <span>Semester {u.sem}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2 text-[#5a6e63]">
                        <Calendar size={14} className="text-[#227736]" /> <span>Joined {u.joined}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#e2ebe6] flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${actCfg.bg} ${actCfg.color}`}>
                        <Activity size={10} /> {u.activity}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736]"><Eye size={16} /></button>
                        <button className="p-2 rounded-lg text-[#227736] hover:bg-[#eaf6ee]"><Edit size={16} /></button>
                        <button className="p-2 rounded-lg text-[#dc3545] hover:bg-[#fdeaea]"><Ban size={16} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role];
              const RoleIcon = rcfg.icon;
              const actCfg = activityConfig[u.activity as keyof typeof activityConfig];

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <Avatar name={u.name} role={u.role} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-[#0f1d17] text-lg group-hover:text-[#227736]">{u.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${rcfg.bg} ${rcfg.text} ${rcfg.border}`}>
                        <RoleIcon size={10} /> {rcfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5a6e63]">
                      <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>
                      {u.role === "student" && (
                        <>
                          <span className="flex items-center gap-1"><BookOpen size={12} /> {u.dept}</span>
                          <span className="flex items-center gap-1"><GraduationCap size={12} className="text-[#E67E22]" /> Sem {u.sem}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${actCfg.bg} ${actCfg.color}`}>
                      {u.activity}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736]"><Eye size={16} /></button>
                      <button className="p-2 rounded-lg text-[#227736] hover:bg-[#eaf6ee]"><Edit size={16} /></button>
                      <button className="p-2 rounded-lg text-[#dc3545] hover:bg-[#fdeaea]"><Ban size={16} /></button>
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