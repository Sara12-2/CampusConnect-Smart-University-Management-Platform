"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2,
  Sparkles, Wand2, Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   CONFIG
   ============================================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

interface NewNoticeForm {
  title: string;
  content: string;
  category: string;
  priority: string;
  department: string;
  semester: string;
  deadline: string;
  pinned: boolean;
}

/* ============================================================
   DATA
   ============================================================ */

const DEPARTMENTS = [
  { value: "All", label: "All Departments" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Business Admin", label: "Business Admin" },
  { value: "Electrical Eng.", label: "Electrical Eng." },
];

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "exam", label: "Exam" },
  { value: "event", label: "Event" },
  { value: "fee", label: "Fee" },
  { value: "urgent", label: "Urgent" },
];

const SEMESTERS = [
  { value: "all", label: "All Semesters" },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    value: String(n),
    label: `Semester ${n}`,
  })),
];

/* ============================================================
   PAGE
   ============================================================ */

export default function NewNoticePage() {
  const router = useRouter();

  const [form, setForm] = useState<NewNoticeForm>({
    title: "",
    content: "",
    category: "exam",
    priority: "normal",
    department: "All",
    semester: "all",
    deadline: "",
    pinned: false,
  });
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ============================================================
     AI SUMMARY (MOCK)
     ============================================================ */

  const generateSummary = () => {
    if (form.content.trim().length < 20) {
      setErrors({ ...errors, content: "Add more content before generating." });
      return;
    }
    const sentences = form.content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const text = sentences.slice(0, 2).join(". ");
    setSummary(text ? text + "." : form.content.slice(0, 120) + "...");
    if (errors.content) setErrors({ ...errors, content: "" });
  };

  /* ============================================================
     SUBMIT
     ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client validation
    const err: Record<string, string> = {};
    if (form.title.trim().length < 5) err.title = "Title must be at least 5 characters.";
    if (form.content.trim().length < 20) err.content = "Content must be at least 20 characters.";
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    try {
      // ============================================================
      // TODO: Uncomment when FastAPI endpoint is ready
      // ============================================================
      //
      // const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      // const res = await fetch(`${API_URL}/api/admin/notices`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify({
      //     title: form.title.trim(),
      //     content: form.content.trim(),
      //     summary: summary || undefined,
      //     category: form.category,
      //     priority: form.priority,
      //     department: form.department,
      //     semester: form.semester === "all" ? null : Number(form.semester),
      //     deadline: form.deadline || null,
      //     pinned: form.pinned,
      //   }),
      // });
      // if (!res.ok) {
      //   const data = await res.json().catch(() => ({}));
      //   throw new Error(data.detail || "Failed to publish notice.");
      // }
      //
      // ============================================================

      await new Promise((r) => setTimeout(r, 800));

      setSuccess(true);
      setTimeout(() => router.push("/admin/notices"), 1000);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Failed to publish notice.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-[#5a6e63] hover:text-[#227736] mb-6 transition-colors disabled:opacity-60"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm p-6 sm:p-8"
        >
          <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight mb-2">
            Create New Notice
          </h1>
          <p className="text-sm text-[#5a6e63] mb-6">
            Fill in the details below and publish to notify students.
          </p>

          {/* Success banner */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-sm font-bold"
            >
              <CheckCircle2 size={16} /> Notice published! Redirecting...
            </motion.div>
          )}

          {/* Form error banner */}
          {errors.form && (
            <div
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545] text-sm font-bold"
              role="alert"
            >
              <AlertCircle size={16} /> {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="notice-title"
                className="block text-sm font-semibold text-[#0f1d17] mb-2"
              >
                Title <span className="text-[#dc3545]">*</span>
              </label>
              <input
                id="notice-title"
                name="title"
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                disabled={loading}
                placeholder="e.g., Mid-Term Examination Schedule Fall 2025"
                className={cn(
                  "w-full rounded-xl border bg-[#f8faf9] px-4 py-2.5 text-sm outline-none transition-all focus:bg-white disabled:opacity-60",
                  errors.title
                    ? "border-[#dc3545] focus:border-[#dc3545]"
                    : "border-[#e2ebe6] focus:border-[#227736]"
                )}
              />
              {errors.title && (
                <p className="text-xs text-[#dc3545] mt-1 font-semibold">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="notice-content"
                className="block text-sm font-semibold text-[#0f1d17] mb-2"
              >
                Content <span className="text-[#dc3545]">*</span>
              </label>
              <textarea
                id="notice-content"
                name="content"
                value={form.content}
                onChange={(e) => {
                  setForm({ ...form, content: e.target.value });
                  if (errors.content) setErrors({ ...errors, content: "" });
                }}
                rows={6}
                disabled={loading}
                placeholder="Write the full notice here — dates, deadlines, required documents..."
                className={cn(
                  "w-full rounded-xl border bg-[#f8faf9] px-4 py-2.5 text-sm outline-none transition-all resize-none focus:bg-white disabled:opacity-60",
                  errors.content
                    ? "border-[#dc3545] focus:border-[#dc3545]"
                    : "border-[#e2ebe6] focus:border-[#227736]"
                )}
              />
              {errors.content && (
                <p className="text-xs text-[#dc3545] mt-1 font-semibold">{errors.content}</p>
              )}
            </div>

            {/* AI Summary */}
            <div className="rounded-xl border-2 border-[#E67E22]/30 bg-[#fdf2e3]/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#B45A0B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={11} /> AI Summary
                </p>
                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-[#E67E22] border border-[#E67E22]/30 hover:bg-[#E67E22] hover:text-white transition-all disabled:opacity-60"
                >
                  <Wand2 size={11} /> Auto-generate
                </button>
              </div>
              <textarea
                name="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                disabled={loading}
                placeholder="Click 'Auto-generate' or write a summary manually..."
                className="w-full resize-none rounded-lg bg-white border border-[#E67E22]/20 px-3 py-2 text-xs text-[#0f1d17] outline-none focus:border-[#E67E22] transition-all disabled:opacity-60"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="notice-category"
                  className="block text-sm font-semibold text-[#0f1d17] mb-2"
                >
                  Category
                </label>
                <select
                  id="notice-category"
                  name="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="notice-priority"
                  className="block text-sm font-semibold text-[#0f1d17] mb-2"
                >
                  Priority
                </label>
                <select
                  id="notice-priority"
                  name="priority"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Department + Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="notice-department"
                  className="block text-sm font-semibold text-[#0f1d17] mb-2"
                >
                  Department
                </label>
                <select
                  id="notice-department"
                  name="department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="notice-semester"
                  className="block text-sm font-semibold text-[#0f1d17] mb-2"
                >
                  Semester
                </label>
                <select
                  id="notice-semester"
                  name="semester"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="notice-deadline"
                className="block text-sm font-semibold text-[#0f1d17] mb-2"
              >
                Deadline <span className="text-[#5a6e63] font-normal">(optional)</span>
              </label>
              <input
                id="notice-deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                disabled={loading}
                className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60"
              />
            </div>

            {/* Pin toggle */}
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#e2ebe6] hover:border-[#E67E22]/40 cursor-pointer transition-all">
              <input
                type="checkbox"
                name="pinned"
                checked={form.pinned}
                onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                disabled={loading}
                className="w-4 h-4 accent-[#E67E22]"
              />
              <div>
                <p className="text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
                  <Pin size={14} className="text-[#E67E22]" /> Pin this notice
                </p>
                <p className="text-xs text-[#5a6e63] mt-0.5">
                  Pinned notices appear at the top for students.
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#e2ebe6]">
              <button
                type="submit"
                disabled={loading || success}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold hover:bg-[#1c6430] shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Publish Notice
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-[#e2ebe6] text-sm font-semibold text-[#5a6e63] hover:bg-[#f8faf9] transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}