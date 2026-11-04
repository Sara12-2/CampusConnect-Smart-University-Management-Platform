"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, User, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#5a6e63] hover:text-[#227736] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Complaints
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                Complaint Details
              </h1>
              <p className="text-sm text-[#5a6e63] mt-1">
                Complaint ID: <span className="font-mono font-semibold">{id}</span>
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[#eaf6ee] text-[#227736] text-xs font-bold border border-[#c8e6d1]">
              In Progress
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-[#227736]" />
              <span className="text-[#5a6e63]">Submitted by:</span>
              <span className="font-semibold text-[#0f1d17]">Student</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag size={16} className="text-[#227736]" />
              <span className="text-[#5a6e63]">Category:</span>
              <span className="font-semibold text-[#0f1d17]">Lab</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-[#227736]" />
              <span className="text-[#5a6e63]">Date:</span>
              <span className="font-semibold text-[#0f1d17]">—</span>
            </div>
          </div>

          <div className="border-t border-[#e2ebe6] pt-6">
            <h2 className="text-lg font-bold text-[#0f1d17] mb-2">Description</h2>
            <p className="text-sm text-[#5a6e63] leading-relaxed">
              Complaint details will appear here once data is connected to the backend.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2 p-4 rounded-xl bg-[#fdf7ef] border border-[#f4a228]/30">
            <AlertCircle size={18} className="text-[#E67E22] mt-0.5 shrink-0" />
            <p className="text-xs text-[#b86b0a]">
              This page is a placeholder. Full complaint details will load from{" "}
              <code className="font-mono bg-white px-1 rounded">GET /api/complaints/{id}</code> once integrated.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}