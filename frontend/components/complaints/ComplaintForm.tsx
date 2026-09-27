"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
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

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 5)
      e.title = "Title kam se kam 5 characters.";
    if (form.description.trim().length < 15)
      e.description = "Description kam se kam 15 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit?.({ ...form, image });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (!initial) {
        setForm(empty);
        setImage(null);
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
            {initial ? "Complaint update ho gayi!" : "Complaint submit ho gayi!"}
          </motion.div>
        )}
      </AnimatePresence>

      <Input
        label="Complaint Title *"
        placeholder="e.g., Wi-Fi not working in Lab 3"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Category *"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          options={[
            { value: "classroom", label: "🏫 Classroom" },
            { value: "lab", label: "💻 Computer Lab" },
            { value: "electricity", label: "⚡ Electricity" },
            { value: "wifi", label: "📶 Wi-Fi" },
            { value: "furniture", label: "🪑 Furniture" },
            { value: "other", label: "📌 Other" },
          ]}
        />
        <Input
          label="Location (optional)"
          placeholder="Lab 3, Block B"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </div>

      <Textarea
        label="Description *"
        rows={4}
        placeholder="Issue ki poori detail likhein — kab se, kaunsa room, kitna impact..."
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
      />

      <FileUpload
        label="Evidence Image (optional)"
        onFileSelect={setImage}
        accept="image/*"
      />

      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <AlertCircle size={15} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Sahi detail dein taake staff jaldi issue resolve kar sake. Complaint
          submit hone ke baad status track kar sakte ho.
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