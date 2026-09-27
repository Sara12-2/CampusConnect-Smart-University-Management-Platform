"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Pin,
  PinOff,
  Search,
  Bell,
  Calendar,
  Sparkles,
  Filter,
  Eye,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { mockNotices } from "@/data/mock-data";
import { formatDate, daysLeft, cn } from "@/lib/utils";
import type { Notice } from "@/types";

type FilterTab = "all" | "pinned" | "exam" | "event" | "fee" | "urgent";

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

const emptyForm = {
  title: "",
  content: "",
  department: "All",
  semester: "all",
  deadline: "",
  category: "general",
  pinned: false,
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deptFilter, setDeptFilter] = useState("All");

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preview / delete state
  const [preview, setPreview] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // Stats
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

  // Filtered list
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

  // Open modal for create / edit
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
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
    setFormOpen(true);
  };

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5) e.title = "Title kam se kam 5 characters.";
    if (form.content.trim().length < 20)
      e.content = "Content kam se kam 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Generate simple AI summary (mock)
  const generateSummary = (content: string) => {
    const sentences = content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const summary = sentences.slice(0, 2).join(". ");
    return summary ? summary + "." : content.slice(0, 120) + "...";
  };

  // Submit
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const summary = generateSummary(form.content);
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

  // Toggle pin
  const togglePin = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Delete
  const handleDelete = () => {
    if (!deleteTarget) return;
    setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // Tabs config
  const tabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pinned", label: "Pinned" },
    { value: "exam", label: "Exam" },
    { value: "event", label: "Event" },
    { value: "fee", label: "Fee" },
    { value: "urgent", label: "Urgent" },
  ];

  const categoryColor: Record<string, string> = {
    exam: "bg-orange-100 text-orange-700 border-orange-200",
    event: "bg-green-100 text-green-700 border-green-200",
    fee: "bg-yellow-100 text-yellow-700 border-yellow-200",
    urgent: "bg-red-100 text-red-700 border-red-200",
    general: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Manage Notices
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Notices create, edit, delete aur pin karein — AI summary auto-generate hoti hai.
          </p>
        </div>
        <Button onClick={openCreate} variant="secondary">
          <Plus size={16} /> New Notice
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Notices", value: stats.total, color: "from-orange-500 to-orange-600", icon: Bell },
          { label: "Pinned", value: stats.pinned, color: "from-green-500 to-green-600", icon: Pin },
          { label: "Active", value: stats.active, color: "from-orange-500 to-green-500", icon: Calendar },
          { label: "AI Summarized", value: stats.withAI, color: "from-green-500 to-orange-600", icon: Sparkles },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mb-3",
                s.color
              )}
            >
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm"
      >
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search notices by title, content, or department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 
                focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none 
                transition-all placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm 
              focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none 
              transition-all cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                filter === t.value
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notices List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Koi notice nahi mila"
          message="Filters change karein ya naya notice create karein."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-green-200 transition-all group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.pinned && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        <Pin size={10} /> Pinned
                      </Badge>
                    )}
                    <Badge className={categoryColor[n.category]}>
                      {n.category}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {n.department}
                    </Badge>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(n.id)}
                      title={n.pinned ? "Unpin" : "Pin"}
                      className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-all"
                    >
                      {n.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </button>
                    <button
                      onClick={() => setPreview(n)}
                      title="Preview"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-all"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openEdit(n)}
                      title="Edit"
                      className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-all"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(n)}
                      title="Delete"
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-slate-800 line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mt-1.5">
                  {n.content}
                </p>

                {/* AI Summary */}
                {n.summary && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1 mb-1">
                      <Sparkles size={10} /> AI Summary
                    </p>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {n.summary}
                    </p>
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(n.createdAt)}
                  </span>
                  {n.deadline && (
                    <span
                      className={cn(
                        "flex items-center gap-1 font-semibold",
                        daysLeft(n.deadline) > 0
                          ? "text-orange-600"
                          : "text-red-600"
                      )}
                    >
                      <Calendar size={11} />
                      {daysLeft(n.deadline) > 0
                        ? `${daysLeft(n.deadline)} days left`
                        : "Expired"}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ============ CREATE / EDIT MODAL ============ */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Notice" : "Create New Notice"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Notice Title *"
            placeholder="e.g., Mid-Term Examination Schedule Fall 2025"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            error={errors.title}
          />

          <Textarea
            label="Full Content *"
            rows={6}
            placeholder="Poori notice yahan likhein — dates, deadlines, required documents..."
            value={form.content}
            onChange={(e) => {
              setForm({ ...form, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
            error={errors.content}
          />

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
          <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-orange-300 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 accent-orange-500 cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Pin size={14} className="text-orange-500" /> Pin this notice
              </p>
              <p className="text-xs text-slate-500">
                Pinned notices top par dikhte hain students ko.
              </p>
            </div>
          </label>

          {/* AI Info */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-100">
            <Sparkles size={15} className="text-orange-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-orange-600">AI Summary:</span>{" "}
              Notice publish hone par automatically short summary generate hogi,
              jo students ko quickly samajh aayegi.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFormOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" className="flex-1">
              {editing ? "Save Changes" : "Publish Notice"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============ PREVIEW MODAL ============ */}
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
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  <Pin size={10} /> Pinned
                </Badge>
              )}
              <Badge className={categoryColor[preview.category]}>
                {preview.category}
              </Badge>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                {preview.department}
              </Badge>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800">
              {preview.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {formatDate(preview.createdAt)}
              </span>
              {preview.deadline && (
                <span className="flex items-center gap-1 text-orange-600 font-semibold">
                  <Calendar size={11} /> Deadline: {formatDate(preview.deadline)}
                </span>
              )}
            </div>

            {preview.summary && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-green-50 border-2 border-orange-100">
                <p className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1 mb-2">
                  <Sparkles size={12} /> AI Summary
                </p>
                <p className="text-sm text-slate-700">{preview.summary}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                Full Content
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {preview.content}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* ============ DELETE CONFIRM MODAL ============ */}
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
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Kya aap yaqeen se ye notice delete karna chahte hain?
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-800 text-sm line-clamp-2">
              {deleteTarget?.title}
            </p>
          </div>
          <p className="text-xs text-red-500 font-semibold">
            ⚠️ Ye action undo nahi ho sakta.
          </p>
        </div>
      </Modal>
    </div>
  );
}