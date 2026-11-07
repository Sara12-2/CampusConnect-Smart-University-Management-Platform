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

const generateAISummary = (content: string): string => {
  if (!content || content.trim().length < 20) return "";
  const cleaned = content.replace(/\s+/g, " ").trim();
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

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

  const base = sentences.slice(0, 2).join(" ");
  const summary = base + (keyPoints.length ? " " + keyPoints.join(" ") : "");

  return summary.slice(0, 240) + (summary.length > 240 ? "..." : "");
};

export default function NoticeForm({
  initial, onSubmit, onCancel, submitLabel = "Publish Notice",
}: Props) {
  const [form, setForm] = useState<FormState>(
    initial ? {
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
      setErrors({ ...errors, content: "Minimum 30 characters required for summary." }); // ✅ English
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
    if (form.title.trim().length < 5) e.title = "Title must be at least 5 characters."; // ✅ English
    if (form.content.trim().length < 20)
      e.content = "Content must be at least 20 characters."; // ✅ English
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
            className="flex items-center gap-2 p-3 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            {initial ? "Notice updated successfully!" : "Notice published successfully!"} {/* ✅ English */}
          </motion.div>
        )}
      </AnimatePresence>

      <Input
        label="Notice Title *"
        placeholder="e.g., Mid-Term Examination Schedule Fall 2025"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
      />

      <Textarea
        label="Full Content *"
        rows={6}
        placeholder="Write the full notice here — dates, deadlines, required documents..." // ✅ English
        value={form.content}
        onChange={(e) => update("content", e.target.value)}
        error={errors.content}
      />

      <div className="rounded-2xl border-2 border-[#E67E22]/30 bg-gradient-to-r from-[#fdf2e3]/50 to-[#eaf6ee]/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-[#B45A0B] uppercase flex items-center gap-1.5">
            <Sparkles size={12} /> AI Summary
          </p>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={generating}
            className="text-xs font-semibold text-[#E67E22] hover:text-[#D35400] 
              flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#fdf2e3] 
              transition-all disabled:opacity-50"
          >
            <Wand2 size={12} className={generating ? "animate-pulse" : ""} />
            {generating ? "Generating..." : summary ? "Regenerate" : "Auto-generate"}
          </button>
        </div>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Click 'Auto-generate' or write a manual summary..." // ✅ English
          rows={3}
          className="w-full rounded-xl border-2 border-[#E67E22]/20 bg-white px-3 py-2 text-sm 
            focus:border-[#E67E22] focus:ring-4 focus:ring-[#E67E22]/10 outline-none 
            transition-all placeholder:text-[#5a6e63]/60 resize-none"
        />
        <p className="text-[11px] text-[#5a6e63] mt-1.5">
          This summary will be shown to students in the notice detail. {/* ✅ English */}
        </p>
      </div>

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

      <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#e2ebe6] hover:border-[#E67E22]/50 cursor-pointer transition-all">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(e) => update("pinned", e.target.checked)}
          className="w-4 h-4 accent-[#E67E22] cursor-pointer"
        />
        <div>
          <p className="text-sm font-semibold text-[#0f1d17] flex items-center gap-1.5">
            <Pin size={14} className="text-[#E67E22]" /> Pin this notice
          </p>
          <p className="text-xs text-[#5a6e63]">
            Pinned notices appear at the top for students. {/* ✅ English */}
          </p>
        </div>
      </label>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
        <AlertCircle size={15} className="text-[#E67E22] mt-0.5 shrink-0" />
        <p className="text-xs text-[#5a6e63] leading-relaxed">
          Once published, students will receive a notification. A reminder will also be sent if a deadline is set. {/* ✅ English */}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
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