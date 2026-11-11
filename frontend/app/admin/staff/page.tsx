"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  UserCog, Mail, Phone, Building2, UserPlus, Users,
  CheckCircle2, AlertCircle, Search, X, Inbox, Award,
  Edit, Trash2, Eye, Shield, Loader2, Save, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type StaffFilter = "all" | "active" | "inactive";

interface Staff {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department: string;
  is_active: boolean;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const STAFF_ROLES = ["IT Support", "Maintenance", "Electrician", "Network Admin", "Cleaner", "Security"];
const STAFF_DEPARTMENTS = ["Computer Lab", "Facilities", "Maintenance", "Administration", "Library", "Cafeteria"];

const emptyForm = {
  name: "",
  role: "IT Support",
  email: "",
  phone: "",
  department: "Facilities",
  is_active: true,
};

export default function AdminStaff() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
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

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  // Fetch Staff from Backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/admin/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch staff");

        const data = await res.json();
        setStaff(Array.isArray(data) ? data : []);
      } catch (err) {
        pushToast("error", "Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [router]);

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
        (filter === "active" && s.is_active) ||
        (filter === "inactive" && !s.is_active);
      return matchQ && matchFilter;
    });
  }, [staff, search, filter]);

  const stats = [
    { label: "Total Staff", value: staff.length, icon: Users },
    { label: "Active", value: staff.filter((s) => s.is_active).length, icon: CheckCircle2 },
    { label: "Inactive", value: staff.filter((s) => !s.is_active).length, icon: AlertCircle, accent: true },
  ];

  const filterTabs: { id: StaffFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: staff.length },
    { id: "active", label: "Active", count: staff.filter((s) => s.is_active).length },
    { id: "inactive", label: "Inactive", count: staff.filter((s) => !s.is_active).length },
  ];

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
      phone: s.phone || "",
      department: s.department,
      is_active: s.is_active,
    });
    setErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone && form.phone.trim().length < 7) e.phone = "Enter a valid phone.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const payload = {
        name: form.name.trim(),
        role: form.role,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        department: form.department,
        designation: form.role, // Backend expects 'designation' instead of 'role'
        is_active: form.is_active,
      };

      const url = editing 
        ? `${API_URL}/api/admin/staff/${editing.id}` 
        : `${API_URL}/api/admin/staff`;
      
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save staff");
      }

      const savedStaff = await res.json();

      if (editing) {
        setStaff((prev) => prev.map((s) => (s.id === editing.id ? savedStaff : s)));
        pushToast("success", "Staff member updated.");
      } else {
        setStaff((prev) => [savedStaff, ...prev]);
        pushToast("success", "Staff member added.");
      }
      
      setFormOpen(false);
    } catch (err) {
      pushToast("error", err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: number) => {
    const target = staff.find((s) => s.id === id);
    if (!target) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/admin/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ is_active: !target.is_active }),
      });

      if (!res.ok) throw new Error("Failed to toggle status");
      
      const updatedStaff = await res.json();
      setStaff((prev) => prev.map((s) => (s.id === id ? updatedStaff : s)));
      pushToast("success", target.is_active ? "Staff deactivated." : "Staff activated.");
    } catch (err) {
      pushToast("error", "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/admin/staff/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!res.ok) throw new Error("Failed to delete staff");
      
      setStaff((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      pushToast("success", "Staff member removed.");
      setDeleteTarget(null);
    } catch (err) {
      pushToast("error", "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]"><Loader2 size={32} className="animate-spin text-[#227736]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* TOASTS */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className={cn("pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold", t.type === "success" ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]" : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545]")}>
              {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#e2ebe6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Shield size={11} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">Staff Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] flex items-center justify-center text-white shadow-md"><UserCog size={20} /></div>
            Manage Staff
          </h1>
        </div>

        <motion.button whileHover={shouldReduceMotion ? {} : { y: -2 }} onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-md">
          <UserPlus size={15} /> Add Staff
        </motion.button>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((s) => (
          <motion.div key={s.label} className="bg-white rounded-2xl border border-[#e2ebe6] p-4">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3 border", s.accent ? "bg-[#fdf7ef] border-[#f4a228]/30 text-[#b86b0a]" : "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]")}><s.icon size={15} /></div>
            <p className="text-2xl font-extrabold text-[#0f1d17]">{s.value}</p>
            <p className="text-[10px] text-[#5a6e63] font-bold uppercase mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border border-[#e2ebe6] outline-none focus:border-[#227736]" />
        </div>
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl shrink-0">
          {filterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg", filter === tab.id ? "bg-[#227736] text-white" : "text-[#5a6e63]")}>
              {tab.label} <span className="text-[9px] bg-white/20 px-1.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STAFF LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Inbox size={26} className="mx-auto text-[#227736] mb-4" /><h3 className="font-bold">No staff found</h3></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const initials = s.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-[#e2ebe6] p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                <span className={cn("absolute left-0 top-0 bottom-0 w-1", s.is_active ? "bg-[#227736]" : "bg-[#5a6e63]/50")} />
                <div className="flex items-center gap-4 lg:w-1/3 shrink-0">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-md", s.is_active ? "bg-gradient-to-br from-[#227736] to-[#1c6430]" : "bg-gradient-to-br from-[#5a6e63] to-[#3d4d46]")}>
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f1d17] text-base">{s.name}</h3>
                    <p className="text-xs text-[#5a6e63]">{s.role}</p>
                  </div>
                </div>

                <div className="flex-1 px-4 py-2 rounded-lg bg-[#f8faf9] border border-[#e2ebe6] text-xs text-[#5a6e63] flex flex-wrap gap-4">
                  <span><Mail size={11} className="inline mr-1"/> {s.email}</span>
                  <span><Phone size={11} className="inline mr-1"/> {s.phone || "N/A"}</span>
                  <span><Building2 size={11} className="inline mr-1"/> {s.department}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <button onClick={() => setViewTarget(s)} className="p-2 text-[#5a6e63]"><Eye size={14} /></button>
                  <button onClick={() => openEdit(s)} className="p-2 text-[#227736]"><Edit size={14} /></button>
                  <button onClick={() => toggleActive(s.id)} className={cn("p-2", s.is_active ? "text-[#5a6e63]" : "text-[#b86b0a]")}>
                    {s.is_active ? <AlertCircle size={14} /> : <UserCheck size={14} />}
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="p-2 text-[#dc3545]"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !submitting && setFormOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b"><h2 className="text-xl font-bold">{editing ? "Edit Staff Member" : "Add Staff Member"}</h2></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold">Full Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold">Role</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-2 border rounded-xl">
                      {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold">Department</label>
                    <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full p-2 border rounded-xl">
                      {STAFF_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  <span className="text-xs font-bold">Active</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setFormOpen(false)} disabled={submitting} className="flex-1 py-2 border rounded-xl font-bold">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-2 bg-[#227736] text-white rounded-xl font-bold">{submitting ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewTarget(null)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{viewTarget.name}</h2>
              <p className="text-sm"><strong>Role:</strong> {viewTarget.role}</p>
              <p className="text-sm"><strong>Email:</strong> {viewTarget.email}</p>
              <p className="text-sm"><strong>Phone:</strong> {viewTarget.phone || "N/A"}</p>
              <p className="text-sm"><strong>Department:</strong> {viewTarget.department}</p>
              <button onClick={() => setViewTarget(null)} className="mt-4 w-full py-2 bg-[#227736] text-white rounded-xl">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-2">Remove this staff?</h3>
              <p className="text-sm mb-4">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border rounded-xl">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 bg-[#dc3545] text-white rounded-xl font-bold">{deleting ? "Deleting..." : "Remove"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}