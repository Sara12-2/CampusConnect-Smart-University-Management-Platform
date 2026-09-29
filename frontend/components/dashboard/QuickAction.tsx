"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
  accent?: boolean;
  delay?: number;
  badge?: string;
}

export default function QuickAction({
  label,
  description,
  icon: Icon,
  href,
  gradient = "from-[#227736] to-[#28a745]",
  accent = false,
  delay = 0,
  badge,
}: Props) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl",
          "bg-white border border-[#e2ebe6] p-5",
          "transition-all duration-300",
          accent
            ? "hover:shadow-xl hover:shadow-[#f4a228]/15 hover:border-[#f4a228]/40"
            : "hover:shadow-xl hover:shadow-[#227736]/15 hover:border-[#227736]/40"
        )}
      >
        {/* Background glow */}
        <div
          className={cn(
            "absolute -right-6 -top-6 w-28 h-28 rounded-full",
            "bg-gradient-to-br blur-2xl opacity-10",
            "group-hover:opacity-25 transition-opacity duration-500",
            gradient
          )}
        />

        {/* Top accent dot */}
        <span
          className={cn(
            "absolute top-3 right-3 w-1.5 h-1.5 rounded-full",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            accent ? "bg-[#f4a228]" : "bg-[#227736]"
          )}
        />

        <div className="relative flex items-start gap-3.5">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn(
              "w-11 h-11 rounded-xl bg-gradient-to-br text-white",
              "flex items-center justify-center shrink-0",
              "shadow-md transition-shadow duration-300",
              accent
                ? "shadow-[#f4a228]/30 group-hover:shadow-lg group-hover:shadow-[#f4a228]/40"
                : "shadow-[#227736]/30 group-hover:shadow-lg group-hover:shadow-[#227736]/40",
              gradient
            )}
          >
            <Icon size={20} />
          </motion.div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#0f1d17] text-sm 
                group-hover:text-[#227736] transition-colors duration-300">
                {label}
              </h3>
              {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full 
                  bg-[#f4a228] text-white">
                  {badge}
                </span>
              )}
            </div>

            {description && (
              <p className="text-xs text-[#5a6e63] mt-1 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <motion.div
            className="shrink-0 mt-1"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
          >
            <ArrowRight
              size={16}
              className={cn(
                "transition-all duration-300",
                "text-[#5a6e63]/50",
                "group-hover:translate-x-1",
                accent
                  ? "group-hover:text-[#f4a228]"
                  : "group-hover:text-[#227736]"
              )}
            />
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <span
          className={cn(
            "absolute bottom-0 left-5 right-5 h-0.5 origin-left rounded-full",
            "scale-x-0 group-hover:scale-x-100",
            "transition-transform duration-500",
            accent ? "bg-[#f4a228]" : "bg-[#227736]"
          )}
        />
      </motion.div>
    </Link>
  );
}