"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, User, MessageSquare, ArrowRight, Wrench, Zap,
  Wifi, Armchair, DoorOpen, Tag, AlertCircle, Clock,
  CheckCircle2, CircleDot, Inbox,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { Complaint } from "@/types";

/* ============================================================
   CATEGORY CONFIG — icons instead of emojis
   ============================================================ */
const categoryConfig: Record<string, {
  icon: typeof Wrench;
  label: string;
}> = {
  classroom: { icon: DoorOpen, label: "Classroom" },
  lab: { icon: Wrench, label: "Computer Lab" },
  electricity: { icon: Zap, label: "Electricity" },
  wifi: { icon: Wifi, label: "Wi-Fi" },
  furniture: { icon: Armchair, label: "Furniture" },
  other: { icon: Tag, label: "Other" },
};

/* ============================================================
   STATUS CONFIG — icon + colors
   ============================================================ */
const statusConfig: Record<string, {
  icon: typeof Clock;
  bg: string;
  text: string;
  border: string;
  bar: string;
}> = {
  submitted: {
    icon: CircleDot,
    bg: "bg-[#f8faf9]",
    text: "text-[#5a6e63]",
    border: "border-[#e2ebe6]",
    bar: "bg-[#5a6e63]",
  },
  assigned: {
    icon: User,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#227736]",
  },
  "in-progress": {
    icon: Clock,
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    bar: "bg-[#E67E22]",
  },
  resolved: {
    icon: CheckCircle2,
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    bar: "bg-[#28a745]",
  },
};

interface Props {
  complaint: Complaint;
  index?: number;
  href?: string;
  compact?: boolean;
}

export default function ComplaintCard({
  complaint,
  index = 0,
  href,
  compact = false,
}: Props) {
  const link = href ?? `/student/complaints/${complaint.id}`;
  const cfg = statusConfig[complaint.status] || statusConfig.submitted;
  const catCfg = categoryConfig[complaint.category] || categoryConfig.other;
  const StatusIcon = cfg.icon;
  const CategoryIcon = catCfg.icon;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative bg-white rounded-2xl border border-[#e2ebe6] overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-[#227736]/5 hover:border-[#227736]/30",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* ---------- Left accent bar (status color) ---------- */}
      <span
        className={cn(
          "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
          cfg.bar
        )}
      />

      {/* ---------- Corner accent (hover) ---------- */}
      <div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 rounded-bl-full",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          complaint.status === "in-progress"
            ? "bg-[#E67E22]/8"
            : complaint.status === "resolved"
            ? "bg-[#227736]/8"
            : "bg-[#5a6e63]/5"
        )}
      />

      <div className="relative pl-2">
        {/* ============ TOP ROW — Badges ============ */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                "text-[10px] font-bold uppercase tracking-wider border",
                cfg.bg, cfg.text, cfg.border
              )}
            >
              <StatusIcon size={11} strokeWidth={2.5} />
              {complaint.status.replace("-", " ")}
            </span>

            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 
              rounded-full text-[10px] font-bold uppercase tracking-wider 
              bg-white text-[#5a6e63] border border-[#e2ebe6]
              group-hover:border-[#E67E22]/30 transition-colors duration-300">
              <CategoryIcon size={11} strokeWidth={2.5} />
              {catCfg.label}
            </span>
          </div>
        </div>

        {/* ============ TITLE ============ */}
        <h3 className="font-bold text-[#0f1d17] line-clamp-2 leading-snug
          group-hover:text-[#227736] transition-colors duration-300">
          {complaint.title}
        </h3>

        {/* ============ DESCRIPTION ============ */}
        {!compact && (
          <p className="text-sm text-[#5a6e63] line-clamp-2 mt-2 leading-relaxed">
            {complaint.description}
          </p>
        )}

        {/* ============ ASSIGNED TO ============ */}
        {complaint.assignedTo && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]
            flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#227736] flex items-center justify-center shrink-0">
              <Wrench size={11} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs text-[#227736] font-bold truncate">
              {complaint.assignedTo}
            </span>
            <span className="ml-auto text-[10px] text-[#5a6e63] font-medium uppercase tracking-wider">
              Assigned
            </span>
          </div>
        )}

        {/* ============ META ROW ============ */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-3.5 
          border-t border-[#e2ebe6]">

          {/* Student */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#f8faf9] flex items-center justify-center">
              <User size={10} className="text-[#227736]" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] text-[#5a6e63] font-medium truncate max-w-28">
              {complaint.studentName}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#f8faf9] flex items-center justify-center">
              <Calendar size={10} className="text-[#227736]" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] text-[#5a6e63] font-medium">
              {formatDate(complaint.createdAt)}
            </span>
          </div>

          {/* View link */}
          {!compact && href !== null && (
            <motion.span
              className="ml-auto flex items-center gap-1 text-[11px] font-bold 
                text-[#227736] opacity-0 group-hover:opacity-100 
                group-hover:translate-x-0.5 transition-all duration-300"
            >
              View
              <ArrowRight size={11} strokeWidth={2.5} />
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return href ? <Link href={link}>{inner}</Link> : inner;
}