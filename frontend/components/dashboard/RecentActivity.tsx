"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  FileCheck,
  Search,
  ArrowRight,
  Activity,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  type: "notice" | "complaint" | "claim" | "lost-found";
  date: string;
  href?: string;
}

interface Props {
  items: ActivityItem[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
}

/* ============================================================
   TYPE CONFIG — dark green + dark orange
   ============================================================ */
const typeConfig: Record<
  ActivityItem["type"],
  {
    icon: LucideIcon;
    gradient: string;
    bg: string;
    text: string;
    border: string;
    label: string;
  }
> = {
  notice: {
    icon: Bell,
    gradient: "from-[#227736] to-[#1c6430]",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    label: "Notice",
  },
  complaint: {
    icon: MessageSquare,
    gradient: "from-[#E67E22] to-[#D35400]",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    label: "Complaint",
  },
  claim: {
    icon: FileCheck,
    gradient: "from-[#227736] to-[#28a745]",
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    label: "Claim",
  },
  "lost-found": {
    icon: Search,
    gradient: "from-[#E67E22] to-[#B45A0B]",
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    label: "Lost & Found",
  },
};

export default function RecentActivity({
  items,
  title = "Recent Activity",
  viewAllHref,
  emptyMessage = "No recent activity.",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-2xl border border-[#e2ebe6] p-5 md:p-6 
        hover:shadow-lg hover:shadow-[#227736]/5 transition-shadow duration-300 
        overflow-hidden"
    >
      {/* ============ TOP ACCENT LINE ============ */}
      <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full 
        bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22] opacity-60" />

      {/* ============ CORNER ACCENT ============ */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full 
        bg-[#E67E22]/5 blur-2xl pointer-events-none" />

      {/* ============ HEADER ============ */}
      <div className="relative flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] 
            flex items-center justify-center shadow-md shadow-[#227736]/25">
            <Activity size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-[#0f1d17] text-base tracking-tight">
              {title}
            </h2>
            <p className="text-[10px] text-[#5a6e63] font-medium uppercase 
              tracking-[0.15em] mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 
              text-xs font-bold text-[#227736] hover:text-[#1c6430] 
              transition-colors duration-300"
          >
            View all
            <ArrowRight
              size={12}
              strokeWidth={2.5}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        )}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 mx-auto rounded-2xl bg-[#eaf6ee] 
              border border-[#c8e6d1] flex items-center justify-center mb-3"
          >
            <Inbox size={22} className="text-[#227736]" />
          </motion.div>
          <p className="text-sm font-bold text-[#0f1d17]">
            No activity yet
          </p>
          <p className="text-xs text-[#5a6e63] mt-1">
            {emptyMessage}
          </p>
        </motion.div>
      ) : (
        /* ============ ITEMS LIST ============ */
        <div className="relative space-y-2">
          {items.map((item, i) => {
            const cfg = typeConfig[item.type];
            const Icon = cfg.icon;

            const content = (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className={cn(
                 "group/item relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 overflow-hidden",
                  item.href
                    ? "border-transparent hover:bg-[#f8faf9] hover:border-[#e2ebe6] cursor-pointer"
                    : "border-transparent"
                )}
              >
                {/* ============ LEFT ACCENT BAR (on hover) ============ */}
                {item.href && (
                  <span
                    className={cn(
                     "absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full origin-top scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300",
                      item.type === "notice" || item.type === "claim"
                        ? "bg-[#227736]"
                        : "bg-[#E67E22]"
                    )}
                  />
                )}

                {/* ============ ICON BOX ============ */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                   "w-9 h-9 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0 shadow-md transition-shadow duration-300",
                    cfg.gradient,
                    item.type === "notice" || item.type === "claim"
                      ? "shadow-[#227736]/25"
                      : "shadow-[#E67E22]/25"
                  )}
                >
                  <Icon size={15} strokeWidth={2.5} />
                </motion.div>

                {/* ============ TEXT CONTENT ============ */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-bold text-[#0f1d17] line-clamp-1 transition-colors duration-300",
                      item.href && "group-hover/item:text-[#227736]"
                    )}
                  >
                    {item.title}
                  </p>

                  {item.description && (
                    <p className="text-xs text-[#5a6e63] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}

                  {/* ============ META ROW ============ */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={cn(
                       "inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md border",
                        cfg.bg, cfg.text, cfg.border
                      )}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-[#5a6e63] font-medium">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>

                {/* ============ RIGHT ARROW (on hover) ============ */}
                {item.href && (
                  <ArrowRight
                    size={13}
                    strokeWidth={2.5}
                    className="shrink-0 mt-2 text-[#5a6e63]/40 
                      opacity-0 group-hover/item:opacity-100 
                      group-hover/item:translate-x-0.5 
                      group-hover/item:text-[#227736] 
                      transition-all duration-300"
                  />
                )}
              </motion.div>
            );

            return item.href ? (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}