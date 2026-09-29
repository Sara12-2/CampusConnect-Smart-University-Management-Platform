"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle2, AlertCircle, DoorOpen, Wrench, Zap,
  Wifi, Armchair, Tag, MapPin, FileText, Loader2, Sparkles,
  ShieldCheck, Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/forms/FileUpload";
import type { Complaint } from "@/types";

interface FormState {
  title: string;
  description: string;
  category: string;
  location: string;
}

interface Props {
  initial?: Complaint;
  onSubmit?: (data: FormState & { image?: File | null }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const empty: FormState = {
  title: "",
  description: "",
  category: "other",
  location: "",
};

/* ============================================================
   CATEGORY OPTIONS — icons (no emojis)
   ============================================================ */
const categoryOptions = [
  { value: "classroom", label: "Classroom" },
  { value: "lab", label: "Computer Lab" },
  { value: "electricity", label: "Electricity" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" },
];

export default function ComplaintForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Submit Complaint",
}: Props) {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          category: initial.category,
          location: "",
        }
      : empty
  );
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5)
      e.title = "Title must be at least 5 characters.";
    if (form.description.trim().length < 15)
      e.description = "Description must be at least 15 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      onSubmit?.({ ...form, image });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (!initial) {
          setForm(empty);
          setImage(null);
        }
      }, 2200);
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ==================== SUCCESS MESSAGE ==================== */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 rounded-xl 
              bg-[#eaf6ee] border-2 border-[#c8e6d1]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-9 h-9 rounded-xl bg-[#227736] 
                  flex items-center justify-center shrink-0"
              >
                <CheckCircle2 size={18} className="text-white" />
              </motion.div>
              <div>
                <p className="font-bold text-[#0f1d17] text-sm">
                  {initial ? "Complaint updated" : "Complaint submitted"}
                </p>
                <p className="text-xs text-[#5a6e63] mt-0.5">
                  {initial
                    ? "Your changes have been saved."
                    : "We'll notify you once it's reviewed."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== TITLE ==================== */}
      <Input
        label="Complaint Title"
        placeholder="e.g., Wi-Fi not working in Lab 3"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
        required
      />

      {/* ==================== CATEGORY + LOCATION ==================== */}
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          options={categoryOptions}
        />
        <Input
          label="Location (optional)"
          placeholder="Lab 3, Block B"
          icon={<MapPin size={15} />}
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </div>

      {/* ==================== DESCRIPTION ==================== */}
      <Textarea
        label="Description"
        rows={5}
        placeholder="Provide full details — since when, which room, impact on daily activities..."
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
        required
      />

      {/* ==================== FILE UPLOAD ==================== */}
      <div>
        <label className="block text-sm font-bold text-[#0f1d17] mb-2 
          flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
          Evidence Image (optional)
        </label>
        <FileUpload
          onFileSelect={setImage}
          accept="image/*"
        />
      </div>

      {/* ==================== INFO CARD ==================== */}
      <div className="relative rounded-xl bg-[#f8faf9] border border-[#e2ebe6] 
        p-4 overflow-hidden">
        {/* Orange accent line */}
        <span className="absolute left-0 top-0 bottom-0 w-0.5 
          bg-gradient-to-b from-[#227736] to-[#E67E22]" />

        <div className="flex items-start gap-3 pl-2">
          <div className="w-8 h-8 rounded-lg bg-[#fdf2e3] 
            border border-[#E67E22]/30 
            flex items-center justify-center shrink-0">
            <AlertCircle size={15} className="text-[#E67E22]" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0f1d17] mb-0.5">
              Important
            </p>
            <p className="text-xs text-[#5a6e63] leading-relaxed">
              Accurate details help staff resolve the issue faster. You can
              track the complaint status in real-time after submission.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== TRUST ROW ==================== */}
      <div className="flex flex-wrap items-center justify-center gap-4 
        text-[10px] text-[#5a6e63] py-1">
        <span className="flex items-center gap-1.5">
          <Clock size={10} className="text-[#227736]" />
          Avg response: 24h
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={10} className="text-[#227736]" />
          Reviewed by admin
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1.5">
          <Sparkles size={10} className="text-[#E67E22]" />
          Live tracking
        </span>
      </div>

      {/* ==================== ACTIONS ==================== */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group relative flex-1 inline-flex items-center 
            justify-center gap-2 px-6 py-3 rounded-xl 
            bg-[#227736] text-white text-sm font-bold 
            shadow-lg shadow-[#227736]/25 
            hover:bg-[#1c6430] hover:shadow-xl hover:shadow-[#227736]/30
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-300 overflow-hidden"
        >
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full 
            group-hover:translate-x-full transition-transform duration-700 
            bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={15} strokeWidth={2.5} />
              {submitLabel}
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}