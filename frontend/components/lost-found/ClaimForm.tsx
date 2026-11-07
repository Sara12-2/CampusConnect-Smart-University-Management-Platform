"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Upload, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { LostFoundItem } from "@/types";

interface Props {
  item?: LostFoundItem;
  onSubmit?: (data: { proof: string; contact: string; evidence?: File | null }) => void;
  onCancel?: () => void;
}

export default function ClaimForm({ item, onSubmit, onCancel }: Props) {
  const [proof, setProof] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ proof?: string; contact?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: { proof?: string; contact?: string } = {};
    if (proof.trim().length < 15) {
      e.proof = "Proof must be at least 15 characters long."; // ✅ English
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?\d{10,}$/.test(contact)) {
      e.contact = "Please enter a valid email or phone number."; // ✅ English
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({ proof, contact, evidence: file });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setProof("");
      setContact("");
      setFile(null);
    }, 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {item && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fdf2e3] to-[#eaf6ee] border border-[#E67E22]/20">
          <p className="text-xs font-semibold text-[#B45A0B] uppercase mb-1">
            Claiming Item
          </p>
          <h3 className="font-bold text-[#0f1d17]">{item.title}</h3>
          <p className="text-xs text-[#5a6e63] mt-1">
            {item.location} • {item.reporterName}
          </p>
        </div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-sm font-medium"
        >
          <CheckCircle2 size={16} /> Claim submitted! Admin will verify it. {/* ✅ English */}
        </motion.div>
      )}

      <Textarea
        label="Proof / Ownership Description *"
        rows={4}
        placeholder="Describe unique details about the item only you would know (e.g., scratches, stickers, contents)..." // ✅ English
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        error={errors.proof}
      />

      <Input
        label="Contact Email or Phone *"
        placeholder="you@campus.edu or +92 300 0000000" // ✅ English
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        error={errors.contact}
      />

      <div>
        <label className="block text-sm font-semibold text-[#0f1d17] mb-1.5">
          Evidence Image (optional)
        </label>
        <label
          className="block border-2 border-dashed border-[#e2ebe6] rounded-xl p-6 text-center 
            hover:border-[#227736]/50 hover:bg-[#eaf6ee]/40 transition-all cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Upload className="mx-auto text-[#5a6e63] mb-2" size={22} />
          {file ? (
            <p className="text-sm font-medium text-[#227736]">{file.name}</p>
          ) : (
            <p className="text-sm text-[#5a6e63]">
              Click to upload image (JPG, PNG — max 5MB)
            </p>
          )}
        </label>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-[#fdf2e3] border border-[#E67E22]/30">
        <AlertCircle size={15} className="text-[#E67E22] mt-0.5 shrink-0" />
        <p className="text-xs text-[#5a6e63] leading-relaxed">
          Submitting false claims may result in account suspension. Please provide accurate ownership details. {/* ✅ English */}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="secondary" className="flex-1">
          <Send size={15} /> Submit Claim
        </Button>
      </div>

      <p className="text-xs text-[#5a6e63] text-center flex items-center justify-center gap-1">
        <ShieldCheck size={11} /> Your info is safe & verified by admin only.
      </p>
    </form>
  );
}