"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Pin, Sparkles, Clock, ArrowRight, User } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn, formatDate, daysLeft } from "@/lib/utils";
import type { Notice } from "@/types";

interface Props {
  notice: Notice;
  index?: number;
  href?: string;
  variant?: "default" | "compact" | "featured";
  showSummary?: boolean;
}

const categoryColor: Record<string, string> = {
  exam: "bg-orange-100 text-orange-700 border-orange-200",
  event: "bg-green-100 text-green-700 border-green-200",
  fee: "bg-yellow-100 text-yellow-700 border-yellow-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
  general: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function NoticeCard({
  notice,
  index = 0,
  href,
  variant = "default",
  showSummary = true,
}: Props) {
  const link = href ?? `/student/notices/${notice.id}`;
  const compact = variant === "compact";
  const featured = variant === "featured";

  return (
    <Link href={link}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className={cn(
          "group bg-white rounded-2xl border transition-all duration-300 h-full flex flex-col",
          "hover:shadow-xl hover:border-orange-200",
          notice.pinned
            ? "border-orange-300 bg-gradient-to-br from-orange-50/40 to-white"
            : "border-slate-200",
          compact ? "p-4" : featured ? "p-6" : "p-5"
        )}
      >
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {notice.pinned && (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              <Pin size={10} /> Pinned
            </Badge>
          )}
          <Badge className={categoryColor[notice.category]}>
            {notice.category}
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
            {notice.department}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-bold text-slate-800 group-hover:text-orange-600 transition-colors",
            compact ? "text-sm line-clamp-1" : featured ? "text-xl line-clamp-2" : "text-base line-clamp-2"
          )}
        >
          {notice.title}
        </h3>

        {/* Description / Content */}
        {!compact && (
          <p className="text-sm text-slate-600 line-clamp-2 mt-2">
            {notice.content}
          </p>
        )}

        {/* AI Summary */}
        {showSummary && notice.summary && !compact && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-100">
            <p className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1 mb-1">
              <Sparkles size={10} /> AI Summary
            </p>
            <p className="text-xs text-slate-700 line-clamp-2">
              {notice.summary}
            </p>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <User size={11} /> {notice.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {formatDate(notice.createdAt)}
          </span>
          {notice.deadline && (
            <span
              className={cn(
                "flex items-center gap-1 font-semibold",
                daysLeft(notice.deadline) > 0 ? "text-orange-600" : "text-red-600"
              )}
            >
              <Clock size={11} />
              {daysLeft(notice.deadline) > 0
                ? `${daysLeft(notice.deadline)}d left`
                : "Expired"}
            </span>
          )}
          {!compact && (
            <span className="ml-auto flex items-center gap-1 text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View <ArrowRight size={11} />
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}