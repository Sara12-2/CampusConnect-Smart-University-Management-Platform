"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, MessageSquare, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn, formatDate, statusColors } from "@/lib/utils";
import type { Complaint } from "@/types";

interface Props {
  complaint: Complaint;
  index?: number;
  href?: string;
  compact?: boolean;
}

const categoryEmoji: Record<string, string> = {
  classroom: "🏫",
  lab: "💻",
  electricity: "⚡",
  wifi: "📶",
  furniture: "🪑",
  other: "📌",
};

export default function ComplaintCard({
  complaint,
  index = 0,
  href,
  compact = false,
}: Props) {
  const link = href ?? `/student/complaints/${complaint.id}`;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "bg-white rounded-2xl border border-slate-200 transition-all duration-300 group",
        "hover:shadow-xl hover:-translate-y-1 hover:border-orange-200",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusColors[complaint.status]}>
            {complaint.status}
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
            {categoryEmoji[complaint.category] || "📌"} {complaint.category}
          </Badge>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
        {complaint.title}
      </h3>

      {!compact && (
        <p className="text-sm text-slate-600 line-clamp-2 mt-1.5">
          {complaint.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <User size={11} /> {complaint.studentName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {formatDate(complaint.createdAt)}
        </span>
        {complaint.assignedTo && (
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <MessageSquare size={11} /> Assigned: {complaint.assignedTo}
          </span>
        )}
        {!compact && href !== null && (
          <span className="ml-auto flex items-center gap-1 text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight size={11} />
          </span>
        )}
      </div>
    </motion.div>
  );

  return href ? <Link href={link}>{inner}</Link> : inner;
}