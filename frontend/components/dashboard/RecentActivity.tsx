"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  FileCheck,
  Search,
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

const typeConfig: Record<
  ActivityItem["type"],
  { icon: LucideIcon; color: string; label: string }
> = {
  notice: { icon: Bell, color: "from-orange-500 to-orange-600", label: "Notice" },
  complaint: {
    icon: MessageSquare,
    color: "from-green-500 to-green-600",
    label: "Complaint",
  },
  claim: { icon: FileCheck, color: "from-orange-500 to-green-500", label: "Claim" },
  "lost-found": {
    icon: Search,
    color: "from-green-500 to-orange-600",
    label: "Lost & Found",
  },
};

export default function RecentActivity({
  items,
  title = "Recent Activity",
  viewAllHref,
  emptyMessage = "Koi recent activity nahi.",
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-lg text-slate-800">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-orange-600 hover:text-orange-700 font-semibold hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-center py-8 text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const cfg = typeConfig[item.type];
            const Icon = cfg.icon;
            const content = (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border border-transparent transition-all",
                  item.href && "hover:bg-slate-50 hover:border-slate-200 cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0",
                    cfg.color
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="uppercase font-bold tracking-wider">
                      {cfg.label}
                    </span>
                    <span>•</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
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
    </div>
  );
}