"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, CheckCircle2, Circle, Clock, Loader2, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, statusColors } from "@/lib/utils";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const steps = [
  { key: "submitted", label: "Submitted", icon: Circle },
  { key: "assigned", label: "Assigned", icon: User },
  { key: "in-progress", label: "In Progress", icon: Clock },
  { key: "resolved", label: "Resolved", icon: CheckCircle2 },
];

export default function ComplaintDetail() {
  const params = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/complaints/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Complaint not found or access denied.");
        const data = await res.json();
        setComplaint(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchComplaint();
  }, [params.id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#227736]" size={40} /></div>;
  if (error || !complaint) {
    return (
      <div>
        <EmptyState title={error || "Complaint not found"} />
        <div className="text-center mt-4">
          <Link href="/student/complaints" className="text-[#E67E22] font-semibold hover:underline">← Back to Complaints</Link>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === complaint.status);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <Link href="/student/complaints" className="inline-flex items-center gap-2 text-sm text-[#5a6e63] hover:text-[#E67E22] font-semibold transition-colors">
        <ArrowLeft size={16} /> Back to Complaints
      </Link>

      <div className="bg-white rounded-3xl border border-[#e2ebe6] p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={statusColors[complaint.status] || "bg-gray-100"}>{complaint.status}</Badge>
          <Badge className="bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]">{complaint.category}</Badge>
        </div>

        <h1 className="text-2xl font-extrabold text-[#0f1d17]">{complaint.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#5a6e63]">
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(complaint.createdAt)}</span>
          {complaint.assignedTo && <span className="flex items-center gap-1"><User size={14} /> Assigned: {complaint.assignedTo}</span>}
        </div>

        <p className="mt-5 text-[#5a6e63] leading-relaxed">{complaint.description}</p>

        <div className="mt-8">
          <h2 className="font-bold text-[#0f1d17] mb-5">Progress Timeline</h2>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-1 bg-[#e2ebe6] rounded-full" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute top-5 left-5 h-1 bg-gradient-to-r from-[#E67E22] to-[#227736] rounded-full"
              style={{ maxWidth: "calc(100% - 2.5rem)" }}
            />
            <div className="relative flex justify-between">
              {steps.map((s, i) => {
                const done = i <= currentIdx;
                const Icon = s.icon;
                return (
                  <div key={s.key} className="flex flex-col items-center gap-2 z-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }} className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white ${done ? "bg-gradient-to-br from-[#E67E22] to-[#227736] text-white shadow-lg shadow-[#E67E22]/30" : "bg-[#f8faf9] text-[#5a6e63]/50 border border-[#e2ebe6]"}`}>
                      <Icon size={18} />
                    </motion.div>
                    <span className={`text-xs font-semibold ${done ? "text-[#0f1d17]" : "text-[#5a6e63]/50"}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}