"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportLostFoundPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/lost-found
    router.push("/student/lost-found");
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
            Report Lost / Found Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                Item Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Black wallet, iPhone, Water bottle"
                required
                className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="Describe the item (color, brand, distinguishing features)"
                required
                className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
                >
                  <option value="lost">I Lost This Item</option>
                  <option value="found">I Found This Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1d17] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Library, Cafeteria"
                  required
                  className="w-full rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-4 py-2.5 text-sm outline-none focus:border-[#227736] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#227736] text-white text-sm font-bold hover:bg-[#1c6430] shadow-md shadow-[#227736]/25 transition-all"
              >
                <Package size={16} />
                Submit Report
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