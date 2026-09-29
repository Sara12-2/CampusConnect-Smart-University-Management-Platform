"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, Pin, PinOff, Search, Bell, Calendar,
  Sparkles, Filter, Eye, X, FileText, Clock, CheckCircle2,
  AlertTriangle, TrendingUp, Layers, Zap, Building2, BookOpen,
  ChevronDown, Inbox, Wand2, ShieldCheck, ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { mockNotices } from "@/data/mock-data";
import { formatDate, daysLeft, cn } from "@/lib/utils";
import type { Notice } from "@/types";

type FilterTab = "all" | "pinned" | "exam" | "event" | "fee" | "urgent";

/* ============================================================
   DATA
   ============================================================ */

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

const categoryConfig: Record<string, {
  icon: typeof Bell;
  bg: string;
  text: string;
  border: string;
  bar: string;
}> = {
  exam: {
    icon: BookOpen,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  event: {
    icon: Sparkles,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
  fee: {
    icon: TrendingUp,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  urgent: {
    icon: AlertTriangle,
    bg: "bg-[#fdeaea]",
    text: "text-[#dc3545]",
    border: "border-[#f5c2c7]",
    bar: "bg-[#dc3545]",
  },
  general: {
    icon: FileText,
    bg: "bg-[#f8faf9]",
    text: "text-[#5a6e63]",
    border: "border-[#e2ebe6]",
    bar: "bg-[#5a6e63]",
  },
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

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deptFilter, setDeptFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summaryPreview, setSummaryPreview] = useState("");

  const [preview, setPreview] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  /* ---------- Stats ---------- */
  const stats = useMemo(
    () => ({
      total: notices.length,
      pinned: notices.filter((n) => n.pinned).length,
      active: notices.filter(
        (n) => !n.deadline || daysLeft(n.deadline) > 0
      ).length,
      withAI: notices.filter((n) => n.summary).length,
    }),
    [notices]
  );

  /* ---------- Filtered list ---------- */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return notices.filter((n) => {
      const matchQ =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q);
      const matchDept = deptFilter === "All" || n.department === deptFilter;
      const matchTab =
        filter === "all"
          ? true
          : filter === "pinned"
          ? n.pinned
          : n.category === filter;
      return matchQ && matchDept && matchTab;
    });
  }, [notices, query, filter, deptFilter]);

  /* ---------- Open create / edit ---------- */
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setSummaryPreview("");
    setFormOpen(true);
  };

  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      department: n.department,
      semester: n.semester ? String(n.semester) : "all",
      deadline: n.deadline ?? "",
      category: n.category,
      pinned: n.pinned,
    });
    setErrors({});
    setSummaryPreview(n.summary ?? "");
    setFormOpen(true);
  };

  /* ---------- Validation ---------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
    if (form.content.trim().length < 20)
      e.content = "Content must be at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- Generate AI summary (mock) ---------- */
  const generateSummary = (content: string) => {
    const sentences = content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
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

  /* ---------- Submit ---------- */
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const summary = summaryPreview || generateSummary(form.content);
    const payload: Notice = {
      id: editing?.id ?? `n${Date.now()}`,
      title: form.title,
      content: form.content,
      summary,
      department: form.department,
      semester: form.semester === "all" ? undefined : Number(form.semester),
      pinned: form.pinned,
      deadline: form.deadline || undefined,
      createdAt: editing?.createdAt ?? new Date().toISOString().split("T")[0],
      author: "Admin",
      category: form.category as Notice["category"],
    };

    if (editing) {
      setNotices((prev) => prev.map((n) => (n.id === editing.id ? payload : n)));
    } else {
      setNotices((prev) => [payload, ...prev]);
    }
    setFormOpen(false);
  };

  /* ---------- Actions ---------- */
  const togglePin = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ---------- Config ---------- */
  const tabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pinned", label: "Pinned" },
    { value: "exam", label: "Exam" },
    { value: "event", label: "Event" },
    { value: "fee", label: "Fee" },
    { value: "urgent", label: "Urgent" },
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
            <Bell size={12} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
              Notice Center
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
            tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] 
              flex items-center justify-center shadow-lg shadow-[#227736]/25">
              <Bell size={18} className="text-white" />
            </div>
            Manage Notices
          </h1>
          <p className="text-sm text-[#5a6e63] mt-2">
            Create, edit, and publish notices with AI-generated summaries.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
            bg-[#227736] text-white text-sm font-bold 
            shadow-lg shadow-[#227736]/25 
            hover:bg-[#1c6430] hover:shadow-xl hover:shadow-[#227736]/30
            transition-all duration-300"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Notice
        </motion.button>
      </motion.div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Notices", value: stats.total, icon: Bell, accent: false },
          { label: "Pinned", value: stats.pinned, icon: Pin, accent: true },
          { label: "Active", value: stats.active, icon: Clock, accent: false },
          { label: "AI Summarized", value: stats.withAI, icon: Sparkles, accent: true },
        ].map((s, i) => {
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
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
              size={15}
            />
            <input
              placeholder="Search notices by title, content, or department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl 
                bg-white border-2 border-[#e2ebe6] text-[#0f1d17] 
                placeholder:text-[#5a6e63]/60
                outline-none transition-all duration-300 
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                  p-1 rounded-md text-[#5a6e63] hover:text-[#227736] 
                  hover:bg-[#eaf6ee] transition-all"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative">
            <Building2
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 
                text-[#5a6e63] pointer-events-none"
            />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full appearance-none pl-10 pr-10 py-2.5 text-sm rounded-xl 
                bg-white border-2 border-[#e2ebe6] text-[#0f1d17] 
                cursor-pointer outline-none transition-all duration-300 
                focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10"
            >
              {departments.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                text-[#5a6e63] pointer-events-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-[#5a6e63]" />
          {tabs.map((t) => {
            const active = filter === t.value;
            return (
              <motion.button
                key={t.value}
                onClick={() => setFilter(t.value)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300",
                  active
                    ? "bg-[#227736] text-white shadow-md shadow-[#227736]/25"
                    : "bg-white text-[#5a6e63] border border-[#e2ebe6] hover:border-[#227736]/40 hover:text-[#227736]"
                )}
              >
                {t.label}
              </motion.button>
            );
          })}

          <span className="ml-auto text-xs text-[#5a6e63] font-medium px-2">
            {filtered.length} {filtered.length === 1 ? "notice" : "notices"}
          </span>
        </div>
      </motion.div>

      {/* ==================== NOTICES LIST ==================== */}
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
          <h3 className="font-bold text-[#0f1d17]">No notices found</h3>
          <p className="text-sm text-[#5a6e63] mt-1">
            Try changing filters or create a new notice.
          </p>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => {
              const cfg = categoryConfig[n.category] || categoryConfig.general;
              const CatIcon = cfg.icon;

              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-2xl border border-[#e2ebe6] 
                    hover:border-[#227736]/30 overflow-hidden
                    transition-all duration-300 
                    hover:shadow-xl hover:shadow-[#227736]/5"
                >
                  {/* Left accent bar */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

                  {/* Corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      ${
                        n.category === "urgent"
                          ? "bg-[#dc3545]/8"
                          : n.category === "exam" || n.category === "fee"
                          ? "bg-[#E67E22]/8"
                          : "bg-[#227736]/8"
                      }`}
                  />

                  <div className="relative p-5 pl-6">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {n.pinned && (
                          <span className="inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/40 
                            uppercase tracking-wider">
                            <Pin size={10} />
                            Pinned
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 
                            text-[10px] font-bold px-2 py-0.5 rounded-full 
                            border uppercase tracking-wider
                            ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <CatIcon size={10} />
                          {n.category}
                        </span>
                        <span className="inline-flex items-center gap-1 
                          text-[10px] font-bold px-2 py-0.5 rounded-full 
                          bg-white text-[#5a6e63] border border-[#e2ebe6]">
                          <Building2 size={10} />
                          {n.department}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePin(n.id)}
                          title={n.pinned ? "Unpin" : "Pin"}
                          className={`p-1.5 rounded-lg transition-all duration-200 
                            ${
                              n.pinned
                                ? "text-[#E67E22] hover:bg-[#fdf2e3]"
                                : "text-[#5a6e63] hover:bg-[#fdf2e3] hover:text-[#E67E22]"
                            }`}
                        >
                          {n.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPreview(n)}
                          title="Preview"
                          className="p-1.5 rounded-lg text-[#5a6e63] 
                            hover:bg-[#f8faf9] hover:text-[#227736] transition-all duration-200"
                        >
                          <Eye size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(n)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-[#227736] 
                            hover:bg-[#eaf6ee] transition-all duration-200"
                        >
                          <Edit size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteTarget(n)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-[#dc3545] 
                            hover:bg-[#fdeaea] transition-all duration-200"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[#0f1d17] text-base 
                      group-hover:text-[#227736] transition-colors line-clamp-2 leading-snug">
                      {n.title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm text-[#5a6e63] line-clamp-2 mt-1.5 leading-relaxed">
                      {n.content}
                    </p>

                    {/* AI Summary */}
                    {n.summary && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 p-3 rounded-xl bg-[#f8faf9] 
                          border border-[#e2ebe6] relative overflow-hidden"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 
                          bg-gradient-to-b from-[#E67E22] to-[#227736]" />

                        <div className="flex items-start gap-2 pl-2">
                          <Sparkles size={11} className="text-[#E67E22] mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-[#B45A0B] 
                              uppercase tracking-wider mb-1">
                              AI Summary
                            </p>
                            <p className="text-xs text-[#0f1d17] line-clamp-2 leading-relaxed">
                              {n.summary}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5a6e63] 
                      mt-3 pt-3 border-t border-[#e2ebe6]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(n.createdAt)}
                      </span>
                      {n.deadline && (
                        <span
                          className={cn(
                            "flex items-center gap-1.5 font-bold",
                            daysLeft(n.deadline) > 0
                              ? "text-[#E67E22]"
                              : "text-[#dc3545]"
                          )}
                        >
                          {daysLeft(n.deadline) > 0 ? (
                            <Clock size={11} />
                          ) : (
                            <AlertTriangle size={11} />
                          )}
                          {daysLeft(n.deadline) > 0
                            ? `${daysLeft(n.deadline)} days left`
                            : "Expired"}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ==================== CREATE / EDIT MODAL ==================== */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Notice" : "Create New Notice"}
        subtitle={editing ? "Update the notice details below." : "Fill in details and publish."}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="notice-form"
              variant="primary"
            >
              {editing ? (
                <>Save Changes</>
              ) : (
                <>
                  <Plus size={15} />
                  Publish Notice
                </>
              )}
            </Button>
          </div>
        }
      >
        <form id="notice-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Notice Title"
            placeholder="e.g., Mid-Term Examination Schedule Fall 2025"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            error={errors.title}
          />

          <Textarea
            label="Full Content"
            rows={6}
            placeholder="Write the full notice here — dates, deadlines, required documents..."
            value={form.content}
            onChange={(e) => {
              setForm({ ...form, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
            error={errors.content}
          />

          {/* AI Summary generator */}
          <div className="rounded-xl border-2 border-[#E67E22]/30 
            bg-[#fdf2e3]/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#B45A0B] uppercase 
                tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} />
                AI Summary
              </p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold 
                  px-2.5 py-1 rounded-lg 
                  bg-white text-[#E67E22] border border-[#E67E22]/30 
                  hover:bg-[#E67E22] hover:text-white hover:border-[#E67E22] 
                  transition-all duration-300"
              >
                <Wand2 size={11} />
                Auto-generate
              </motion.button>
            </div>

            <textarea
              value={summaryPreview}
              onChange={(e) => setSummaryPreview(e.target.value)}
              placeholder="Click 'Auto-generate' or write a summary manually..."
              rows={3}
              className="w-full resize-none rounded-lg bg-white 
                border border-[#E67E22]/20 
                px-3 py-2 text-xs text-[#0f1d17] 
                placeholder:text-[#5a6e63]/60 
                focus:border-[#E67E22] focus:ring-4 focus:ring-[#E67E22]/10 
                outline-none transition-all duration-300"
            />
            <p className="text-[10px] text-[#5a6e63] mt-1.5">
              This summary will be shown to students on the notice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              options={departments}
            />
            <Select
              label="Semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              options={[
                { value: "all", label: "All Semesters" },
                ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                  value: String(n),
                  label: `Semester ${n}`,
                })),
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={categories}
            />
            <Input
              label="Deadline (optional)"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* Pin toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl 
            border-2 border-[#e2ebe6] hover:border-[#E67E22]/40 
            cursor-pointer transition-all duration-300 group">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 cursor-pointer accent-[#E67E22]"
            />
            <div>
              <p className="text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
                <Pin size={14} className="text-[#E67E22]" />
                Pin this notice
              </p>
              <p className="text-xs text-[#5a6e63] mt-0.5">
                Pinned notices appear at the top for students.
              </p>
            </div>
          </label>
        </form>
      </Modal>

      {/* ==================== PREVIEW MODAL ==================== */}
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title="Notice Preview"
        size="xl"
      >
        {preview && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {preview.pinned && (
                <span className="inline-flex items-center gap-1 
                  text-[10px] font-bold px-2 py-0.5 rounded-full 
                  bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/40 
                  uppercase tracking-wider">
                  <Pin size={10} />
                  Pinned
                </span>
              )}
              <span className="inline-flex items-center gap-1 
                text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">
                {preview.category}
              </span>
              <span className="inline-flex items-center gap-1 
                text-[10px] font-bold px-2 py-0.5 rounded-full 
                bg-white text-[#5a6e63] border border-[#e2ebe6]">
                <Building2 size={10} />
                {preview.department}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight">
              {preview.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5a6e63]">
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                {formatDate(preview.createdAt)}
              </span>
              {preview.deadline && (
                <span className="flex items-center gap-1.5 text-[#E67E22] font-bold">
                  <Clock size={11} />
                  Deadline: {formatDate(preview.deadline)}
                </span>
              )}
            </div>

            {preview.summary && (
              <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] 
                relative overflow-hidden">
                <span className="absolute left-0 top-0 bottom-0 w-1 
                  bg-gradient-to-b from-[#E67E22] to-[#227736]" />

                <div className="pl-3">
                  <p className="text-xs font-bold text-[#B45A0B] uppercase 
                    tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} />
                    AI Summary
                  </p>
                  <p className="text-sm text-[#0f1d17] leading-relaxed">
                    {preview.summary}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-[#5a6e63] uppercase 
                tracking-wider mb-2">
                Full Content
              </p>
              <p className="text-sm text-[#0f1d17] leading-relaxed whitespace-pre-line">
                {preview.content}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== DELETE CONFIRM MODAL ==================== */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Notice?"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={15} />
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-[#5a6e63]">
            Are you sure you want to delete this notice? This action cannot be undone.
          </p>
          <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
            <p className="font-bold text-[#0f1d17] text-sm line-clamp-2">
              {deleteTarget?.title}
            </p>
          </div>
          <p className="text-xs text-[#dc3545] font-bold flex items-center gap-1.5">
            <AlertTriangle size={12} />
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}