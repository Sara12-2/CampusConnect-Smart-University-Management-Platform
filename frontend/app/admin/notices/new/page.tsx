"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function NewNoticePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "exam",
    priority: "normal",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/notices
    router.push("/admin/notices");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#5a6e63] hover:text-[#227736] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm p-6 sm:p-8"
        >
          <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight mb-6">
            Create New Notice
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter notice title"
                required
                className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                placeholder="Enter notice content"
                required
                className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
                >
                  <option value="exam">Exam</option>
                  <option value="fee">Fee</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold hover:bg-[#1c6430] shadow-md shadow-[#227736]/25 transition-all"
              >
                <Save size={16} />
                Publish Notice
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-[#e2ebe6] text-sm font-semibold text-[#5a6e63] hover:bg-[#f8faf9] transition-colors"
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