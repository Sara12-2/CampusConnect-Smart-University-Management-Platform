"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bell, Calendar, Loader2, AlertCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notices/${id}`);
        if (!res.ok) throw new Error("Notice not found.");
        const data = await res.json();
        setNotice(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#227736]" size={40} />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-[#f8faf9] p-8 flex flex-col items-center justify-center">
        <AlertCircle size={40} className="text-[#dc3545] mb-4" />
        <h2 className="text-xl font-bold text-[#0f1d17]">{error || "Notice not found"}</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#227736] font-semibold hover:underline"
        >
          ← Go Back
        </button>
      </div>
    );
  }

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
            {notice.category && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-[10px]">
                {notice.category}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight mb-4">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5a6e63] mb-6 pb-6 border-b border-[#e2ebe6]">
            <Calendar size={14} />
            <span>{formatDate(notice.createdAt)}</span>
            {notice.author && (
              <>
                <span className="mx-2">•</span>
                <User size={14} />
                <span>{notice.author}</span>
              </>
            )}
            <span className="mx-2">•</span>
            <span className="font-mono">ID: {notice.id}</span>
          </div>

          {notice.summary && (
            <div className="mb-6 p-4 rounded-xl bg-[#f8faf9] border border-[#e2ebe6]">
              <p className="text-xs font-bold text-[#227736] uppercase tracking-wider mb-1">
                AI Summary
              </p>
              <p className="text-sm text-[#0f1d17] font-medium">{notice.summary}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none text-[#5a6e63] leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </div>
        </motion.article>
      </div>
    </div>
  );
}