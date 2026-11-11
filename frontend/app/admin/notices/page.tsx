"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Plus, Edit, Trash2, Pin, PinOff, Search, Bell, Calendar,
  Sparkles, Filter, Eye, X, FileText, Clock, AlertTriangle,
  TrendingUp, Building2, BookOpen, ChevronDown, Inbox,
  CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { formatDate, daysLeft, cn } from "@/lib/utils";

/* ============================================================
   CONFIG & TYPES
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type FilterTab = "all" | "pinned" | "exam" | "event" | "fee" | "urgent";

interface Notice {
  id: number;
  title: string;
  content: string;
  summary?: string;
  department: string;
  semester?: number;
  pinned: boolean;
  deadline?: string;
  category: string;
  priority?: string;
  createdAt: string;
  author?: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const departments = [
  { value: "All", label: "All Departments" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Business Admin", label: "Business Admin" },
  { value: "Electrical Eng.", label: "Electrical Eng." },
];

const categories = [
  { value: "general", label: "General" },
  { value: "exam", label: "Exam" },
  { value: "event", label: "Event" },
  { value: "fee", label: "Fee" },
  { value: "urgent", label: "Urgent" },
];

const categoryConfig: Record<string, { icon: typeof Bell; bg: string; text: string; border: string; bar: string; }> = {
  exam: { icon: BookOpen, bg: "bg-[#fdf2e3]", text: "text-[#B45A0B]", border: "border-[#E67E22]/40", bar: "bg-[#E67E22]" },
  event: { icon: Sparkles, bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]", bar: "bg-[#227736]" },
  fee: { icon: TrendingUp, bg: "bg-[#fdf2e3]", text: "text-[#B45A0B]", border: "border-[#E67E22]/40", bar: "bg-[#E67E22]" },
  urgent: { icon: AlertTriangle, bg: "bg-[#fdeaea]", text: "text-[#dc3545]", border: "border-[#f5c2c7]", bar: "bg-[#dc3545]" },
  general: { icon: FileText, bg: "bg-[#f8faf9]", text: "text-[#5a6e63]", border: "border-[#e2ebe6]", bar: "bg-[#5a6e63]" },
};

const emptyForm = {
  title: "",
  content: "",
  department: "All",
  semester: "all",
  deadline: "",
  category: "general",
  pinned: false,
};

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pinned", label: "Pinned" },
  { value: "exam", label: "Exam" },
  { value: "event", label: "Event" },
  { value: "fee", label: "Fee" },
  { value: "urgent", label: "Urgent" },
];

export default function AdminNoticesPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deptFilter, setDeptFilter] = useState("All");

  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summaryPreview, setSummaryPreview] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [preview, setPreview] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  // Fetch Notices on Load
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        
        const res = await fetch(`${API_URL}/api/notices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error("Failed to fetch notices");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setNotices(data);
        } else {
          setNotices([]);
        }
      } catch (err) {
        pushToast("error", "Failed to load notices");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [router]);

  const stats = useMemo(() => ({
    total: notices.length,
    pinned: notices.filter((n) => n.pinned).length,
    active: notices.filter((n) => !n.deadline || daysLeft(n.deadline) > 0).length,
    withAI: notices.filter((n) => n.summary).length,
  }), [notices]);

  const filtered = useMemo(() => {
    if (!Array.isArray(notices)) return [];
    const q = query.toLowerCase().trim();
    return notices.filter((n) => {
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.department.toLowerCase().includes(q);
      const matchDept = deptFilter === "All" || n.department === deptFilter;
      const matchTab = filter === "all" ? true : filter === "pinned" ? n.pinned : n.category === filter;
      return matchQ && matchDept && matchTab;
    });
  }, [notices, query, filter, deptFilter]);

  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      department: n.department,
      semester: n.semester ? String(n.semester) : "all",
      deadline: n.deadline ? n.deadline.split("T")[0] : "",
      category: n.category,
      pinned: n.pinned,
    });
    setErrors({});
    setSummaryPreview(n.summary ?? "");
    setFormOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
    if (form.content.trim().length < 20) e.content = "Content must be at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generateSummary = (content: string) => {
    const sentences = content.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    const summary = sentences.slice(0, 2).join(". ");
    return summary ? summary + "." : content.slice(0, 120) + "...";
  };

  const handleGenerate = () => {
    if (form.content.trim().length < 20) {
      setErrors({ ...errors, content: "Add more content before generating." });
      return;
    }
    setSummaryPreview(generateSummary(form.content));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const summary = summaryPreview || generateSummary(form.content);
      
      const payload = {
        title: form.title,
        content: form.content,
        summary,
        department: form.department,
        semester: form.semester === "all" ? null : Number(form.semester),
        pinned: form.pinned,
        deadline: form.deadline || null,
        category: form.category,
      };

      const res = await fetch(`${API_URL}/api/notices/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update notice");

      const updatedNotice = await res.json();
      setNotices((prev) => prev.map((n) => (n.id === editing.id ? updatedNotice : n)));
      pushToast("success", "Notice updated successfully.");
      setFormOpen(false);
    } catch (err) {
      pushToast("error", "Failed to update notice.");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePin = async (id: number) => {
    const target = notices.find((n) => n.id === id);
    if (!target) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pinned: !target.pinned }),
      });

      if (!res.ok) throw new Error("Failed to toggle pin");
      const updatedNotice = await res.json();
      
      setNotices((prev) => prev.map((n) => (n.id === id ? updatedNotice : n)));
      pushToast("success", target?.pinned ? "Notice unpinned." : "Notice pinned.");
    } catch (err) {
      pushToast("error", "Failed to update pin.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notices/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      if (!res.ok) throw new Error("Failed to delete notice");
      
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      pushToast("success", "Notice deleted.");
      setDeleteTarget(null);
    } catch (err) {
      pushToast("error", "Failed to delete notice.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]"><Loader2 size={32} className="animate-spin text-[#227736]" /></div>;
  }

  return (
    <div className="space-y-6">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Bell size={12} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">Notice Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] flex items-center justify-center shadow-lg shadow-[#227736]/25">
              <Bell size={18} className="text-white" />
            </div>
            Manage Notices
          </h1>
        </div>

        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
          onClick={() => router.push("/admin/notices/new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold shadow-lg"
        >
          <Plus size={16} /> New Notice
        </motion.button>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Notices", value: stats.total, icon: Bell, accent: false },
          { label: "Pinned", value: stats.pinned, icon: Pin, accent: true },
          { label: "Active", value: stats.active, icon: Clock, accent: false },
          { label: "AI Summarized", value: stats.withAI, icon: Sparkles, accent: true },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl border border-[#e2ebe6] p-5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.accent ? "bg-[#fdf2e3] text-[#E67E22]" : "bg-[#eaf6ee] text-[#227736]")}><Icon size={18} /></div>
              <p className="text-2xl font-extrabold text-[#0f1d17]">{s.value}</p>
              <p className="text-xs text-[#5a6e63] mt-0.5 font-medium">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] p-3 md:p-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" size={15} />
            <input placeholder="Search notices..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border-2 border-[#e2ebe6] outline-none" />
          </div>
          <div className="relative">
            <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border-2 border-[#e2ebe6] appearance-none">
              {departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {tabs.map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)} className={cn("px-3 py-1.5 text-xs font-bold rounded-lg", filter === t.value ? "bg-[#227736] text-white" : "bg-white text-[#5a6e63]")}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* NOTICES LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Inbox size={26} className="mx-auto text-[#227736] mb-4" /><h3 className="font-bold">No notices found</h3></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((n) => {
            const cfg = categoryConfig[n.category] || categoryConfig.general;
            return (
              <div key={n.id} className="bg-white rounded-2xl border border-[#e2ebe6] p-5 relative">
                <span className={cn("absolute left-0 top-0 bottom-0 w-1", cfg.bar)} />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {n.pinned && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/40 uppercase">Pinned</span>}
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", cfg.bg, cfg.text, cfg.border)}>{n.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border">{n.department}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => togglePin(n.id)} className="p-1.5 text-[#E67E22]">{n.pinned ? <PinOff size={13} /> : <Pin size={13} />}</button>
                    <button onClick={() => setPreview(n)} className="p-1.5 text-[#5a6e63]"><Eye size={13} /></button>
                    <button onClick={() => openEdit(n)} className="p-1.5 text-[#227736]"><Edit size={13} /></button>
                    <button onClick={() => setDeleteTarget(n)} className="p-1.5 text-[#dc3545]"><Trash2 size={13} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-[#0f1d17] text-base mb-1 line-clamp-2">{n.title}</h3>
                <p className="text-sm text-[#5a6e63] line-clamp-2 mb-3">{n.content}</p>
                {n.summary && <div className="p-3 bg-[#f8faf9] rounded-xl text-xs text-[#0f1d17] line-clamp-2 mb-3"><Sparkles size={10} className="inline mr-1 text-[#E67E22]"/> {n.summary}</div>}
                <div className="flex items-center gap-3 text-xs text-[#5a6e63] pt-3 border-t">
                  <span><Calendar size={11} className="inline mr-1"/> {formatDate(n.createdAt)}</span>
                  {n.deadline && <span className={daysLeft(n.deadline) > 0 ? "text-[#E67E22]" : "text-[#dc3545]"}>{daysLeft(n.deadline) > 0 ? `${daysLeft(n.deadline)} days left` : "Expired"}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL */}
      <Modal open={formOpen && !!editing} onClose={() => !submitting && setFormOpen(false)} title="Edit Notice" size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" form="edit-form" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
          </div>
        }
      >
        <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} disabled={submitting} />
          <Textarea label="Content" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} error={errors.content} disabled={submitting} />
          <div className="bg-[#fdf2e3]/40 p-4 rounded-xl border border-[#E67E22]/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#B45A0B]"><Sparkles size={10} className="inline mr-1"/> AI Summary</span>
              <button type="button" onClick={handleGenerate} className="text-[10px] bg-white px-2 py-1 rounded border text-[#E67E22]">Auto-generate</button>
            </div>
            <textarea value={summaryPreview} onChange={(e) => setSummaryPreview(e.target.value)} rows={2} className="w-full text-xs p-2 rounded border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} options={departments} disabled={submitting} />
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories} disabled={submitting} />
          </div>
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} disabled={submitting} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> <span className="text-sm font-bold">Pin this notice</span></label>
        </form>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Notice Preview" size="xl">
        {preview && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{preview.title}</h2>
            <div className="p-4 bg-[#f8faf9] rounded-xl border"><p className="text-xs font-bold text-[#B45A0B] mb-1"><Sparkles size={10} className="inline mr-1"/> AI Summary</p><p className="text-sm">{preview.summary}</p></div>
            <p className="text-sm text-[#5a6e63] whitespace-pre-line">{preview.content}</p>
          </div>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="Delete Notice?" size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
          </div>
        }
      >
        <p className="text-sm">Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?</p>
      </Modal>
    </div>
  );
}