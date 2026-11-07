"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Send, CheckCircle2, AlertCircle, X, Image as ImageIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { LostFoundItem } from "@/types";

interface FormData {
  type: "lost" | "found";
  title: string;
  description: string;
  location: string;
  date: string;
  contact: string;
}

interface Props {
  initial?: LostFoundItem;
  onSubmit?: (data: FormData & { image?: File | null }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const emptyForm: FormData = {
  type: "lost",
  title: "",
  description: "",
  location: "",
  date: new Date().toISOString().split("T")[0],
  contact: "",
};

export default function ItemForm({
  initial, onSubmit, onCancel, submitLabel = "Submit Report",
}: Props) {
  const [form, setForm] = useState<FormData>(
    initial ? {
          type: initial.type,
          title: initial.title,
          description: initial.description,
          location: initial.location,
          date: initial.date,
          contact: "",
        }
      : emptyForm
  );
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters."; // ✅ English
    if (form.description.trim().length < 10)
      e.description = "Description must be at least 10 characters."; // ✅ English
    if (form.location.trim().length < 2) e.location = "Location is required."; // ✅ English
    if (!form.date) e.date = "Please select a date."; // ✅ English
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact) &&
        !/^\+?\d{10,}$/.test(form.contact)) {
      e.contact = "Please enter a valid email or phone number."; // ✅ English
    }
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
        setForm(emptyForm);
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
            className="flex items-center gap-2 p-3 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            {initial ? "Item updated successfully!" : "Item reported successfully! Admin will verify it."} {/* ✅ English */}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-semibold text-[#0f1d17] mb-1.5">
          Report Type *
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl">
          {(["lost", "found"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("type", t)}
              className={`relative py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                form.type === t
                  ? t === "lost"
                    ? "bg-white text-[#E67E22] shadow-sm border border-[#E67E22]/30"
                    : "bg-white text-[#227736] shadow-sm border border-[#c8e6d1]"
                  : "text-[#5a6e63] hover:text-[#0f1d17]"
              }`}
            >
              {t === "lost" ? "🔍 I Lost Something" : "🎁 I Found Something"}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Item Name *"
        placeholder="e.g., Black Wallet, Blue Water Bottle"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        error={errors.title}
      />

      <Textarea
        label="Description *"
        rows={3}
        placeholder="Item details, colors, any identifying marks..." // ✅ English
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Location *"
          placeholder="Cafeteria, Block B"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          error={errors.location}
        />
        <Input
          label="Date *"
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          error={errors.date}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      <Input
        label="Contact (Email or Phone) *"
        placeholder="you@campus.edu or +92 300 0000000"
        value={form.contact}
        onChange={(e) => update("contact", e.target.value)}
        error={errors.contact}
      />

      <div>
        <label className="block text-sm font-semibold text-[#0f1d17] mb-1.5">
          Item Image (optional)
        </label>
        <label
          className={`block border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            image
              ? "border-[#227736]/50 bg-[#eaf6ee]/50"
              : "border-[#e2ebe6] hover:border-[#E67E22]/50 hover:bg-[#fdf2e3]/40"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          {image ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#227736] text-white flex items-center justify-center">
                <ImageIcon size={22} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#227736]">{image.name}</p>
                <p className="text-xs text-[#5a6e63]">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setImage(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[#fdeaea] text-[#dc3545] transition-all"
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <>
              <Upload className="mx-auto text-[#5a6e63] mb-2" size={22} />
              <p className="text-sm text-[#5a6e63]">
                Click to upload image (JPG, PNG — max 5MB)
              </p>
            </>
          )}
        </label>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
        <AlertCircle size={15} className="text-[#E67E22] mt-0.5 shrink-0" />
        <p className="text-xs text-[#5a6e63] leading-relaxed">
          Provide accurate information so your item can be matched quickly. False reports may result in account suspension. {/* ✅ English */}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" variant={form.type === "lost" ? "primary" : "secondary"} className="flex-1">
          <Send size={15} /> {submitLabel}
        </Button>
      </div>
    </form>
  );
}