"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  UserCog, Mail, Phone, Building2, UserPlus, Users,
  CheckCircle2, AlertCircle, Search, X, Inbox, Award,
  Edit, Trash2, Eye, Shield, Loader2, Save, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

type StaffFilter = "all" | "active" | "inactive";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  active: boolean;
  department: string;
  tasks: number;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

/* ============================================================
   DATA
   ============================================================ */

const STAFF_ROLES = ["IT Support", "Maintenance", "Electrician", "Network Admin", "Cleaner", "Security"];
const STAFF_DEPARTMENTS = ["Computer Lab", "Facilities", "Maintenance", "Administration", "Library", "Cafeteria"];

const initialStaff: Staff[] = [
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

const emptyForm = {
  name: "",
  role: "IT Support",
  email: "",
  phone: "",
  department: "Facilities",
  active: true,
};

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminStaff() {
  const shouldReduceMotion = useReducedMotion();

  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StaffFilter>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [viewTarget, setViewTarget] = useState<Staff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ============================================================
     TOASTS
     ============================================================ */

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  /* ============================================================
     FILTER + STATS
     ============================================================ */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return staff.filter((s) => {
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
  }, [staff, search, filter]);

  const stats = [
    { label: "Total Staff", value: staff.length, icon: Users },
    { label: "Active", value: staff.filter((s) => s.active).length, icon: CheckCircle2 },
    { label: "Inactive", value: staff.filter((s) => !s.active).length, icon: AlertCircle, accent: true },
    { label: "Tasks", value: staff.reduce((sum, s) => sum + s.tasks, 0), icon: Award },
  ];

  const filterTabs: { id: StaffFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: staff.length },
    { id: "active", label: "Active", count: staff.filter((s) => s.active).length },
    { id: "inactive", label: "Inactive", count: staff.filter((s) => !s.active).length },
  ];

  /* ============================================================
     FORM OPEN
     ============================================================ */

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({
      name: s.name,
      role: s.role,
      email: s.email,
      phone: s.phone,
      department: s.department,
      active: s.active,
    });
    setErrors({});
    setFormOpen(true);
  };

  /* ============================================================
     VALIDATE
     ============================================================ */

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone.trim().length < 7) e.phone = "Enter a valid phone.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ============================================================
     SUBMIT
     ============================================================ */

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // TODO: POST/PUT /api/admin/staff
      await new Promise((r) => setTimeout(r, 500));

      const payload: Staff = {
        id: editing?.id ?? `st${Date.now()}`,
        name: form.name.trim(),
        role: form.role,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        department: form.department,
        active: form.active,
        tasks: editing?.tasks ?? 0,
      };

      if (editing) {
        setStaff((prev) => prev.map((s) => (s.id === editing.id ? payload : s)));
        pushToast("success", "Staff member updated.");
      } else {
        setStaff((prev) => [payload, ...prev]);
        pushToast("success", "Staff member added.");
      }
      setFormOpen(false);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     TOGGLE ACTIVE
     ============================================================ */

  const toggleActive = (id: string) => {
    const target = staff.find((s) => s.id === id);
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    pushToast("success", target?.active ? "Staff deactivated." : "Staff activated.");
  };

  /* ============================================================
     DELETE
     ============================================================ */

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // TODO: DELETE /api/admin/staff/{id}
      await new Promise((r) => setTimeout(r, 400));
      setStaff((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      pushToast("success", "Staff member removed.");
      setDeleteTarget(null);
    } catch {
      pushToast("error", "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* ==================== TOASTS ==================== */}
      <div
        className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold",
                t.type === "success"
                  ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]"
                  : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545]"
              )}
            >
              {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#e2ebe6]"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Shield size={11} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Staff Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] flex items-center justify-center text-white shadow-md shadow-[#227736]/20">
              <UserCog size={20} />
            </div>
            Manage Staff
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Assign tasks and manage complaint resolution team.
          </p>
        </div>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-md shadow-[#227736]/25 hover:bg-[#1c6430] hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
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
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, role, email, or department..."
            aria-label="Search staff"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border border-[#e2ebe6] text-[#0f1d17] placeholder:text-[#5a6e63]/60 outline-none transition-all duration-200 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 hover:border-[#c8e6d1]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-all"
              aria-label="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl shrink-0">
          {filterTabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                aria-pressed={active}
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
          className="text-center py-16 border border-dashed border-[#e2ebe6] rounded-2xl bg-[#f8faf9]"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-4">
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
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] hover:border-[#227736]/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#227736]/5"
                >
                  <span
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      s.active ? "bg-[#227736]" : "bg-[#5a6e63]/50"
                    )}
                  />

                  <div className="p-4 pl-5 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="relative shrink-0">
                      <motion.div
                        whileHover={shouldReduceMotion ? {} : { rotate: 6, scale: 1.05 }}
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
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white",
                          s.active ? "bg-[#28a745]" : "bg-[#5a6e63]"
                        )}
                      >
                        {s.active && (
                          <motion.span
                            animate={
                              shouldReduceMotion
                                ? {}
                                : { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[#28a745]"
                          />
                        )}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors">
                          {s.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6] uppercase tracking-wider">
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

                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      <div
                        className={cn(
                          "hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border",
                          s.tasks > 0
                            ? "bg-[#fdf7ef] border-[#f4a228]/30"
                            : "bg-[#f8faf9] border-[#e2ebe6]"
                        )}
                      >
                        <Award
                          size={11}
                          className={s.tasks > 0 ? "text-[#b86b0a]" : "text-[#5a6e63]"}
                        />
                        <span className="text-xs font-bold text-[#0f1d17] tabular-nums">
                          {s.tasks}
                        </span>
                        <span className="text-[9px] text-[#5a6e63] uppercase tracking-wider">
                          tasks
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                          onClick={() => setViewTarget(s)}
                          aria-label="View"
                          className="p-2 rounded-lg text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736] transition-all"
                        >
                          <Eye size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                          onClick={() => openEdit(s)}
                          aria-label="Edit"
                          className="p-2 rounded-lg text-[#227736] hover:bg-[#eaf6ee] transition-all"
                        >
                          <Edit size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                          onClick={() => toggleActive(s.id)}
                          aria-label={s.active ? "Deactivate" : "Activate"}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            s.active
                              ? "text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#b86b0a]"
                              : "text-[#b86b0a] hover:bg-[#fdf7ef] hover:text-[#227736]"
                          )}
                        >
                          {s.active ? <AlertCircle size={14} /> : <UserCheck size={14} />}
                        </motion.button>
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                          onClick={() => setDeleteTarget(s)}
                          aria-label="Delete"
                          className="p-2 rounded-lg text-[#dc3545] hover:bg-[#fdeaea] transition-all"
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

      {filtered.length > 0 && (
        <div className="text-center text-xs text-[#5a6e63] py-2">
          Showing <span className="font-bold text-[#0f1d17]">{filtered.length}</span> of{" "}
          <span className="font-bold text-[#0f1d17]">{staff.length}</span> staff members
        </div>
      )}

      {/* ==================== CREATE / EDIT MODAL ==================== */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setFormOpen(false)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e2ebe6]">
                <h2 className="text-xl font-extrabold text-[#0f1d17]">
                  {editing ? "Edit Staff Member" : "Add Staff Member"}
                </h2>
                <p className="text-xs text-[#5a6e63] mt-1">
                  {editing ? "Update staff details below." : "Fill in details to add new staff."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    disabled={submitting}
                    placeholder="e.g., Muhammad Ali"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl text-sm border bg-[#f8faf9] text-[#0f1d17] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#227736]/10",
                      errors.name
                        ? "border-[#dc3545] focus:border-[#dc3545]"
                        : "border-[#e2ebe6] focus:border-[#227736]"
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-[#dc3545] mt-1 font-semibold">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      disabled={submitting}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-[#f8faf9] text-[#0f1d17] outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                    >
                      {STAFF_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Department</label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      disabled={submitting}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-[#f8faf9] text-[#0f1d17] outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                    >
                      {STAFF_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    disabled={submitting}
                    placeholder="name@campus.edu"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl text-sm border bg-[#f8faf9] text-[#0f1d17] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#227736]/10",
                      errors.email
                        ? "border-[#dc3545] focus:border-[#dc3545]"
                        : "border-[#e2ebe6] focus:border-[#227736]"
                    )}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-[#dc3545] mt-1 font-semibold">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    disabled={submitting}
                    placeholder="+92 300 1234567"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl text-sm border bg-[#f8faf9] text-[#0f1d17] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#227736]/10",
                      errors.phone
                        ? "border-[#dc3545] focus:border-[#dc3545]"
                        : "border-[#e2ebe6] focus:border-[#227736]"
                    )}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-[#dc3545] mt-1 font-semibold">{errors.phone}</p>
                  )}
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#e2ebe6] hover:border-[#227736]/40 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    disabled={submitting}
                    className="w-4 h-4 cursor-pointer accent-[#227736]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#0f1d17]">Active</p>
                    <p className="text-xs text-[#5a6e63] mt-0.5">
                      Inactive staff won't receive new task assignments.
                    </p>
                  </div>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl border-2 border-[#e2ebe6] text-sm font-bold text-[#5a6e63] hover:bg-[#f8faf9] transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold hover:bg-[#1c6430] shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> {editing ? "Save" : "Add Staff"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== VIEW MODAL ==================== */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewTarget(null)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-[#e2ebe6] flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#227736] to-[#1c6430] flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {viewTarget.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0f1d17]">{viewTarget.name}</h2>
                    <p className="text-xs text-[#5a6e63]">{viewTarget.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewTarget(null)}
                  className="p-1.5 rounded-lg text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
                  <Mail size={14} className="text-[#227736]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#5a6e63] uppercase">Email</p>
                    <p className="text-sm text-[#0f1d17]">{viewTarget.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
                  <Phone size={14} className="text-[#227736]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#5a6e63] uppercase">Phone</p>
                    <p className="text-sm text-[#0f1d17]">{viewTarget.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
                  <Building2 size={14} className="text-[#227736]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#5a6e63] uppercase">Department</p>
                    <p className="text-sm text-[#0f1d17]">{viewTarget.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
                    <Award size={14} className="text-[#b86b0a]" />
                    <div>
                      <p className="text-[10px] font-bold text-[#5a6e63] uppercase">Tasks</p>
                      <p className="text-sm font-bold text-[#0f1d17]">{viewTarget.tasks}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
                    {viewTarget.active ? (
                      <CheckCircle2 size={14} className="text-[#227736]" />
                    ) : (
                      <AlertCircle size={14} className="text-[#5a6e63]" />
                    )}
                    <div>
                      <p className="text-[10px] font-bold text-[#5a6e63] uppercase">Status</p>
                      <p className="text-sm font-bold text-[#0f1d17]">
                        {viewTarget.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== DELETE CONFIRM ==================== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}
            className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] max-w-md w-full overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-[#dc3545] to-[#c82333]" />
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] flex items-center justify-center text-[#dc3545] shrink-0">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f1d17] text-lg">Remove this staff?</h3>
                    <p className="text-xs text-[#5a6e63] mt-1">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] mb-4">
                  <p className="font-bold text-sm text-[#0f1d17]">{deleteTarget.name}</p>
                  <p className="text-xs text-[#5a6e63]">{deleteTarget.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl border-2 border-[#e2ebe6] text-sm font-bold text-[#5a6e63] hover:bg-[#f8faf9] transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-[#dc3545] text-white text-sm font-bold hover:bg-[#c82333] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Deleting...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}