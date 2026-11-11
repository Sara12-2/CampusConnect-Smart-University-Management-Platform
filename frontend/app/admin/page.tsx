"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Users, Mail, BookOpen, Shield, Ban, Search, Grid3x3, List,
  UserCog, Eye, Edit, GraduationCap, Calendar, X, Inbox,
  UserPlus, Activity, CheckCircle2, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   TYPES
   ============================================================ */

type Role = "student" | "admin";
type RoleFilter = "all" | Role;
type ViewType = "grid" | "list";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string | null;
  semester: number | null;
  is_active: boolean;
}

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const roleConfig: Record<
  Role,
  { icon: typeof Shield; label: string; bg: string; text: string; border: string; gradient: string; accentDot: string; }
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

const roleTabs: { id: RoleFilter; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All", icon: Users },
  { id: "student", label: "Students", icon: GraduationCap },
  { id: "admin", label: "Admins", icon: Shield },
];

const viewTabs: { id: ViewType; icon: typeof Grid3x3; label: string }[] = [
  { id: "grid", icon: Grid3x3, label: "Grid view" },
  { id: "list", icon: List, label: "List view" },
];

function Avatar({ name, role, size = "md" }: { name: string; role: Role; size?: "sm" | "md" }) {
  const shouldReduceMotion = useReducedMotion();
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const cfg = roleConfig[role] || roleConfig.student;
  const sizes = size === "sm" ? "w-11 h-11 text-sm rounded-xl" : "w-14 h-14 text-lg rounded-[1.25rem]";

  return (
    <div className={cn("relative flex items-center justify-center shadow-md bg-gradient-to-br shrink-0 text-white font-bold tracking-wider", cfg.gradient, sizes)} aria-hidden="true">
      {initials}
      <span className={cn("absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-[#28a745]", size === "sm" ? "w-3 h-3" : "w-4 h-4")}>
        {!shouldReduceMotion && (
          <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#28a745]" />
        )}
      </span>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminUsers() {
  const shouldReduceMotion = useReducedMotion();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [view, setView] = useState<ViewType>("grid");
  const [toast, setToast] = useState("");

  // Add User Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "student", department: "Computer Science", semester: "1" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Fetch Users from Backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.department && u.department.toLowerCase().includes(q));
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchQ && matchRole;
    });
  }, [users, search, roleFilter]);

  const roleCounts: Record<RoleFilter, number> = {
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  // Add User Submit
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // Note: We use /api/auth/register for adding users (or admin specific if you have one)
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          department: newUser.department,
          semester: Number(newUser.semester),
          // role is forced to student on backend, so we can't create admins this way without a specific admin endpoint
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to create user");
      }

      const created = await res.json();
      // Since backend only returns student info on register, we fetch the whole list again to be safe
      const updatedRes = await fetch(`${API_URL}/api/admin/users`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const updatedUsers = await updatedRes.json();
      setUsers(updatedUsers);
      
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "student", department: "Computer Science", semester: "1" });
      setToast("User added successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-4 right-4 z-50 bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] px-4 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
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

        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-lg shadow-[#227736]/20 hover:bg-[#1c6430] transition-all"
        >
          <UserPlus size={16} /> Add User
        </motion.button>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users, accent: false },
          { label: "Students", value: users.filter((u) => u.role === "student").length, icon: GraduationCap, accent: true },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, icon: Shield, accent: false },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl border border-[#e2ebe6] p-5 shadow-sm">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm", s.accent ? "bg-[#fdf2e3] text-[#E67E22]" : "bg-[#eaf6ee] text-[#227736]")}>
                <Icon size={18} />
              </div>
              <p className="text-3xl font-extrabold text-[#0f1d17]">{s.value}</p>
              <p className="text-[10px] text-[#5a6e63] mt-1 font-bold uppercase">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-white p-3 md:p-4 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or department..." className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:border-[#227736] outline-none" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5a6e63]"><X size={14} /></button>}
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl shrink-0">
          {roleTabs.map((tab) => {
            const Icon = tab.icon;
            const active = roleFilter === tab.id;
            return (
              <button key={tab.id} onClick={() => setRoleFilter(tab.id)} className={cn("relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors", active ? "text-white" : "text-[#5a6e63] hover:text-[#227736] hover:bg-white")}>
                {active && <motion.span layoutId="roleTabBg" className="absolute inset-0 rounded-lg bg-[#227736]" />}
                <span className="relative flex items-center gap-1.5"><Icon size={13} /> {tab.label} <span className="text-[9px] bg-white/20 px-1.5 rounded-full">{roleCounts[tab.id]}</span></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING / ERROR / USERS */}
      {loading ? (
        <div className="text-center py-20"><Loader2 size={32} className="animate-spin mx-auto text-[#227736]" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e2ebe6]">
          <Inbox size={40} className="mx-auto text-[#5a6e63]/30 mb-4" />
          <h3 className="font-bold text-[#0f1d17]">No users found</h3>
        </div>
      ) : view === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((u, i) => {
              const rcfg = roleConfig[u.role] || roleConfig.student;
              const RoleIcon = rcfg.icon;
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group bg-white rounded-[2rem] border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${rcfg.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <Avatar name={u.name} role={u.role} />
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider", rcfg.bg, rcfg.text, rcfg.border)}>
                        <RoleIcon size={12} /> {rcfg.label}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[#0f1d17] text-lg truncate">{u.name}</h3>
                    <p className="text-xs text-[#5a6e63] mt-0.5 truncate flex items-center gap-1.5"><Mail size={11} /> {u.email}</p>
                    <div className="mt-4 space-y-2 text-xs text-[#5a6e63]">
                      {u.role === "student" && (
                        <>
                          <div className="flex items-center gap-2"><BookOpen size={11} className="text-[#227736]" /> <span>{u.department}</span></div>
                          <div className="flex items-center gap-2"><GraduationCap size={11} className="text-[#E67E22]" /> <span>Semester {u.semester}</span></div>
                        </>
                      )}
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#e2ebe6] flex justify-between">
                      <span className="text-[10px] font-bold text-[#227736] bg-[#eaf6ee] px-2 py-1 rounded-full">Active</span>
                      <button className="text-[#dc3545] text-xs font-bold hover:underline">Block</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm overflow-hidden">
          {filtered.map((u, i) => {
            const rcfg = roleConfig[u.role] || roleConfig.student;
            const RoleIcon = rcfg.icon;
            return (
              <div key={u.id} className="grid md:grid-cols-12 gap-3 px-5 py-4 items-center border-b last:border-0 hover:bg-[#f8faf9]/60">
                <div className="md:col-span-5 flex items-center gap-3">
                  <Avatar name={u.name} role={u.role} size="sm" />
                  <div>
                    <h3 className="font-bold text-sm text-[#0f1d17]">{u.name}</h3>
                    <p className="text-[11px] text-[#5a6e63]">{u.email}</p>
                  </div>
                </div>
                <div className="md:col-span-3 text-xs text-[#5a6e63]">{u.department || "Admin"}</div>
                <div className="md:col-span-2 text-xs text-[#5a6e63]">{u.role === "student" ? `Sem ${u.semester}` : "—"}</div>
                <div className="md:col-span-2 flex justify-end">
                   <button className="text-[#dc3545] text-xs font-bold hover:underline">Block</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-[#e2ebe6]">
                <h2 className="text-xl font-extrabold text-[#0f1d17]">Add New User</h2>
              </div>
              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                {modalError && <div className="bg-red-50 text-red-600 p-2 rounded text-xs">{modalError}</div>}
                <div>
                  <label className="text-xs font-bold text-[#0f1d17]">Name</label>
                  <input type="text" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-sm bg-[#f8faf9]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0f1d17]">Email</label>
                  <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-sm bg-[#f8faf9]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0f1d17]">Password</label>
                  <input type="password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-sm bg-[#f8faf9]" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl border font-bold text-[#5a6e63] hover:bg-[#f8faf9]">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-xl bg-[#227736] text-white font-bold disabled:opacity-50 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Add User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}