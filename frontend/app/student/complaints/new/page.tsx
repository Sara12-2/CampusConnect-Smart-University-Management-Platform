"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Send, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function NewComplaintPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "lab",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          images: [], // Backend requires this field
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit complaint.");
      }

      // Success -> Redirect
      router.push("/student/complaints");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-[#5a6e63] hover:text-[#227736] mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight mb-6">Submit a Complaint</h1>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief summary of the issue" required disabled={loading} className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} placeholder="Describe your issue in detail" required disabled={loading} className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all resize-none disabled:opacity-60" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={loading} className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all disabled:opacity-60">
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="wifi">Wi-Fi</option>
                <option value="electricity">Electricity</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold hover:bg-[#1c6430] shadow-md shadow-[#227736]/25 transition-all disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
              <button type="button" onClick={() => router.back()} disabled={loading} className="px-5 py-2.5 rounded-xl border border-[#e2ebe6] text-sm font-semibold text-[#5a6e63] hover:bg-[#f8faf9] transition-colors disabled:opacity-60">Cancel</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}