"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  accent?: boolean;
  change?: string;
  trend?: "up" | "down";
  href?: string;
  delay?: number;
  description?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  accent = false,
  change,
  trend = "up",
  href,
  delay = 0,
  description,
}: Props) {
  /* Auto-pick gradient based on accent */
  const finalGradient =
    gradient ??
    (accent
      ? "from-[#E67E22] to-[#D35400]"
      : "from-[#227736] to-[#28a745]");

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative bg-white rounded-2xl border border-[#e2ebe6] p-5",
        "transition-all duration-300 overflow-hidden",
        "hover:shadow-xl",
        accent
          ? "hover:shadow-[#E67E22]/10 hover:border-[#E67E22]/40"
          : "hover:shadow-[#227736]/10 hover:border-[#227736]/40",
        href && "cursor-pointer"
      )}
    >
      {/* ============ TOP ACCENT LINE ============ */}
      <div
        className={cn(
          "absolute top-0 left-5 right-5 h-0.5 rounded-full origin-left",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          accent
            ? "bg-gradient-to-r from-[#E67E22] to-transparent"
            : "bg-gradient-to-r from-[#227736] to-transparent"
        )}
      />

      {/* ============ CORNER ACCENT (hover) ============ */}
      <div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 rounded-bl-full",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          accent ? "bg-[#E67E22]/8" : "bg-[#227736]/8"
        )}
      />

      {/* ============ HEADER ROW ============ */}
      <div className="relative flex items-start justify-between">
        {/* Icon box */}
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={cn(
            "w-11 h-11 rounded-xl bg-gradient-to-br text-white",
            "flex items-center justify-center shadow-md",
            finalGradient,
            accent
              ? "shadow-[#E67E22]/30 group-hover:shadow-lg group-hover:shadow-[#E67E22]/40"
              : "shadow-[#227736]/30 group-hover:shadow-lg group-hover:shadow-[#227736]/40"
          )}
        >
          <Icon size={20} strokeWidth={2.2} />
        </motion.div>

        {/* Trend badge */}
        {change && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 300 }}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full",
              "text-[10px] font-extrabold",
              trend === "up"
                ? "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]"
                : "bg-[#fdeaea] text-[#dc3545] border border-[#f5c2c7]"
            )}
          >
            {trend === "up" ? (
              <TrendingUp size={10} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={10} strokeWidth={2.5} />
            )}
            {change}
          </motion.span>
        )}
      </div>

      {/* ============ VALUE ============ */}
      <div className="relative mt-4">
        <p className="text-3xl font-extrabold text-[#0f1d17] tracking-tight leading-none">
          {value}
        </p>

        {/* Label */}
        <p className="text-xs text-[#5a6e63] mt-1.5 font-medium">
          {label}
        </p>

        {/* Optional description */}
        {description && (
          <p className="text-[10px] text-[#5a6e63]/70 mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* ============ BOTTOM ACCENT LINE (hover) ============ */}
      <span
        className={cn(
          "absolute bottom-0 left-5 right-5 h-0.5 origin-left rounded-full",
          "scale-x-0 group-hover:scale-x-100",
          "transition-transform duration-500",
          accent ? "bg-[#E67E22]" : "bg-[#227736]"
        )}
      />

      {/* ============ ARROW ICON (hover, if href) ============ */}
      {href && (
        <motion.span
          className={cn(
            "absolute top-4 right-4 w-6 h-6 rounded-lg",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            accent
              ? "bg-[#fdf2e3] text-[#E67E22]"
              : "bg-[#eaf6ee] text-[#227736]"
          )}
        >
          <ArrowRight size={11} strokeWidth={2.5} />
        </motion.span>
      )}
    </motion.div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}