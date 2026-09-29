"use client";
import { motion } from "framer-motion";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  variant?: "default" | "compact" | "card";
  className?: string;
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "There's no data to display at the moment.",
  icon: Icon = Inbox,
  action,
  variant = "default",
  className,
}: Props) {
  const isCompact = variant === "compact";
  const isCard = variant === "card";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "text-center",
        isCompact ? "py-10" : "py-16",
        isCard &&
          "bg-[#f8faf9] border border-[#e2ebe6] rounded-2xl px-6 py-12",
        className
      )}
    >
      {/* Icon with animated rings */}
      <div className="relative w-16 h-16 mx-auto mb-5">
        {/* Outer pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-2xl bg-[#eaf6ee]"
        />

        {/* Middle ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="absolute inset-0 rounded-2xl bg-[#eaf6ee]"
        />

        {/* Icon container */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#eaf6ee] to-[#d5ecdc] border border-[#c8e6d1] flex items-center justify-center shadow-sm">
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="text-[#227736]" size={isCompact ? 22 : 26} />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "font-bold text-[#0f1d17] tracking-tight",
          isCompact ? "text-sm" : "text-base"
        )}
      >
        {title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className={cn(
          "text-[#5a6e63] max-w-sm mx-auto leading-relaxed",
          isCompact ? "text-xs mt-1" : "text-sm mt-2"
        )}
      >
        {message}
      </motion.p>

      {/* Optional action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}