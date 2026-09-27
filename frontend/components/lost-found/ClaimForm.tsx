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
      e.proof = "Proof kam se kam 15 characters ka hona chahiye.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?\d{10,}$/.test(contact)) {
      e.contact = "Valid email ya phone number daalein.";
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
      {/* Item preview */}
      {item && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-100">
          <p className="text-xs font-semibold text-orange-600 uppercase mb-1">
            Claiming Item
          </p>
          <h3 className="font-bold text-slate-800">{item.title}</h3>
          <p className="text-xs text-slate-600 mt-1">
            {item.location} • {item.reporterName}
          </p>
        </div>
      )}

      {/* Success message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium"
        >
          <CheckCircle2 size={16} /> Claim submit ho gaya! Admin verify karega.
        </motion.div>
      )}

      {/* Proof */}
      <Textarea
        label="Proof / Ownership Description *"
        rows={4}
        placeholder="Item ke baare mein kuch aisi detail likhein jo sirf aapko pata ho (e.g., scratches, stickers, contents)..."
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        error={errors.proof}
      />

      {/* Contact */}
      <Input
        label="Contact Email or Phone *"
        placeholder="you@campus.edu ya +92 300 0000000"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        error={errors.contact}
      />

      {/* Evidence upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Evidence Image (optional)
        </label>
        <label
          className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center 
            hover:border-orange-400 hover:bg-orange-50/40 transition-all cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Upload className="mx-auto text-slate-400 mb-2" size={22} />
          {file ? (
            <p className="text-sm font-medium text-orange-600">{file.name}</p>
          ) : (
            <p className="text-sm text-slate-500">
              Click to upload image (JPG, PNG — max 5MB)
            </p>
          )}
        </label>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <AlertCircle size={15} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Jhooti claim karne par account suspend kiya jaa sakta hai. Sirf sahi
          ownership details dein.
        </p>
      </div>

      {/* Actions */}
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

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <ShieldCheck size={11} /> Your info is safe & verified by admin only.
      </p>
    </form>
  );
}