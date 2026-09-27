"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, CheckCircle2, Circle, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { mockComplaints } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

const steps = [
  { key: "submitted", label: "Submitted", icon: Circle },
  { key: "assigned", label: "Assigned", icon: User },
  { key: "in-progress", label: "In Progress", icon: Clock },
  { key: "resolved", label: "Resolved", icon: CheckCircle2 },
];

export default function ComplaintDetail() {
  const params = useParams();
  const complaint = mockComplaints.find((c) => c.id === params.id);

  if (!complaint) {
    return (
      <div>
        <EmptyState title="Complaint nahi mili" />
        <div className="text-center">
          <Link href="/student/complaints" className="text-orange-600 font-semibold hover:underline">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === complaint.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Link href="/student/complaints" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 font-semibold">
        <ArrowLeft size={16} /> Back to Complaints
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
          <Badge className="bg-slate-100 text-slate-700 border-slate-200">{complaint.category}</Badge>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800">{complaint.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(complaint.createdAt)}</span>
          {complaint.assignedTo && (
            <span className="flex items-center gap-1"><User size={14} /> Assigned: {complaint.assignedTo}</span>
          )}
        </div>

        <p className="mt-5 text-slate-600 leading-relaxed">{complaint.description}</p>

        {/* Progress Timeline */}
        <div className="mt-8">
          <h2 className="font-bold text-slate-800 mb-5">Progress Timeline</h2>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 rounded-full" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute top-5 left-5 h-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
              style={{ maxWidth: "calc(100% - 2.5rem)" }}
            />
            <div className="relative flex justify-between">
              {steps.map((s, i) => {
                const done = i <= currentIdx;
                const Icon = s.icon;
                return (
                  <div key={s.key} className="flex flex-col items-center gap-2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white ${
                        done
                          ? "bg-gradient-to-br from-orange-500 to-green-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <span className={`text-xs font-semibold ${done ? "text-slate-800" : "text-slate-400"}`}>
                      {s.label}
                    </span>
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