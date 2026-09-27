"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  change?: string;
  trend?: "up" | "down";
  href?: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  gradient = "from-orange-500 to-orange-600",
  change,
  trend = "up",
  href,
  delay = 0,
}: Props) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={href ? { y: -4 } : undefined}
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300",
        href && "hover:shadow-xl hover:border-orange-200 cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-md",
            gradient
          )}
        >
          <Icon size={20} />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full",
              trend === "up"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            )}
          >
            {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-800 mt-3">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}