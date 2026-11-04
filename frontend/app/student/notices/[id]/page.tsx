"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bell, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#5a6e63] hover:text-[#227736] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Notices
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#e2ebe6] shadow-sm p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#227736] uppercase tracking-wider mb-3">
            <Bell size={14} />
            Notice
          </div>

          <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight mb-4">
            Notice Title
          </h1>

          <div className="flex items-center gap-2 text-xs text-[#5a6e63] mb-6 pb-6 border-b border-[#e2ebe6]">
            <Calendar size={14} />
            <span>Posted recently</span>
            <span className="mx-2">•</span>
            <span className="font-mono">ID: {id}</span>
          </div>

          <div className="prose prose-sm max-w-none text-[#5a6e63] leading-relaxed">
            <p>
              Notice content will appear here once connected to the backend. This page will fetch
              details from <code className="font-mono bg-[#f8faf9] px-1 rounded">GET /api/notices/{id}</code>.
            </p>
          </div>
        </motion.article>
      </div>
    </div>
  );
}