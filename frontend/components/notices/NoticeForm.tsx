"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Pin, Sparkles, Wand2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import type { Notice } from "@/types";

interface FormState {
  title: string;
  content: string;
  department: string;
  semester: string;
  category: string;
  deadline: string;
  pinned: boolean;
}

interface Props {
  initial?: Notice;
  onSubmit?: (data: FormState & { summary: string }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const empty: FormState = {
  title: "",
  content: "",
  department: "All",
  semester: "all",
  category: "general",
  deadline: "",
  pinned: false,
};

// Simple mock AI summary generator (client-side)
// Real implementation: call AI API on publish
const generateAISummary = (content: string): string => {
  if (!content || content.trim().length < 20) return "";
  const cleaned = content.replace(/\s+/g, " ").trim();
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Extract key info: dates, numbers, deadlines
  const keyPoints: string[] = [];
  const dateMatch = cleaned.match(
    /\b(\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{0,4}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/gi
  );
  if (dateMatch) keyPoints.push(`Key date: ${dateMatch[0]}.`);

  if (/deadline|last date|before|submit|apply/i.test(cleaned))
    keyPoints.push("Deadline mentioned — check details.");

  if (/document|id card|cnic|transcript/i.test(cleaned))
    keyPoints.push("Required documents listed.");

  if (/fee|payment|challan/i.test(cleaned))
    keyPoints.push("Fee/payment involved.");

  // Take first 2 sentences as base
  const base = sentences.slice(0, 2).join(" ");
  const summary =
    base + (keyPoints.length ? " " + keyPoints.join(" ") : "");

  return summary.slice(0, 240) + (summary.length > 240 ? "..." : "");
};

export default function NoticeForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Publish Notice",
}: Props) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          content: initial.content,
          department: initial.department,
          semester: initial.semester ? String(initial.semester) : "all",
          category: initial.category,
          deadline: initial.deadline ?? "",
          pinned: initial.pinned,
        }
      : empty
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [generating, setGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleGenerateSummary = () => {
    if (form.content.trim().length < 30) {
      setErrors({ ...errors, content: "Summary ke liye kam se kam 30 characters." });
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setSummary(generateAISummary(form.content));
      setGenerating(false);
    }, 700);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5) e.title = "Title kam se kam 5 characters.";
    if (form.content.trim().length < 20)
      e.content = "Content kam se kam 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const finalSummary = summary || generateAISummary(form.content);
    onSubmit?.({ ...form, summary: finalSummary });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (!initial) {
        setForm(empty);
        setSummary("");
      }
    }, 2200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            {initial ? "Notice update ho gayi!" : "Notice publish ho gayi!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <Input
        label="Notice Title *"
        placeholder="e.g., Mid-Term Examination Schedule Fall 2025"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
      />

      {/* Content */}
      <Textarea
        label="Full Content *"
        rows={6}
        placeholder="Poori notice yahan likhein — dates, deadlines, required documents..."
        value={form.content}
        onChange={(e) => update("content", e.target.value)}
        error={errors.content}
      />

      {/* AI Summary Generator */}
      <div className="rounded-2xl border-2 border-orange-100 bg-gradient-to-r from-orange-50/50 to-green-50/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1.5">
            <Sparkles size={12} /> AI Summary
          </p>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={generating}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 
              flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-orange-100 
              transition-all disabled:opacity-50"
          >
            <Wand2 size={12} className={generating ? "animate-pulse" : ""} />
            {generating ? "Generating..." : summary ? "Regenerate" : "Auto-generate"}
          </button>
        </div>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Click 'Auto-generate' ya phir manually summary likhein..."
          rows={3}
          className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2 text-sm 
            focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
            transition-all placeholder:text-slate-400 resize-none"
        />
        <p className="text-[11px] text-slate-500 mt-1.5">
          Ye summary students ko notice detail mein dikhegi.
        </p>
      </div>

      {/* Department + Semester */}
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Department"
          value={form.department}
          onChange={(e) => update("department", e.target.value)}
          options={[
            { value: "All", label: "All Departments" },
            { value: "Computer Science", label: "Computer Science" },
            { value: "Software Engineering", label: "Software Engineering" },
            { value: "Business Admin", label: "Business Admin" },
            { value: "Electrical Eng.", label: "Electrical Eng." },
          ]}
        />
        <Select
          label="Semester"
          value={form.semester}
          onChange={(e) => update("semester", e.target.value)}
          options={[
            { value: "all", label: "All Semesters" },
            ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
              value: String(n),
              label: `Semester ${n}`,
            })),
          ]}
        />
      </div>

      {/* Category + Deadline */}
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          options={[
            { value: "general", label: "📌 General" },
            { value: "exam", label: "📝 Exam" },
            { value: "event", label: "🎉 Event" },
            { value: "fee", label: "💰 Fee" },
            { value: "urgent", label: "🚨 Urgent" },
          ]}
        />
        <Input
          label="Deadline (optional)"
          type="date"
          value={form.deadline}
          onChange={(e) => update("deadline", e.target.value)}
        />
      </div>

      {/* Pin toggle */}
      <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-orange-300 cursor-pointer transition-all">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(e) => update("pinned", e.target.checked)}
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

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <AlertCircle size={15} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Notice publish hone ke baad students ko notification chali jayegi.
          Deadline set karne par reminder bhi jayega.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" className="flex-1">
          <Send size={15} /> {submitLabel}
        </Button>
      </div>
    </form>
  );
}