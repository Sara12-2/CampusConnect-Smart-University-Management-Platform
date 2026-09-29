"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   LOADING SPINNER
   ============================================================ */

interface Props {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
  variant?: "default" | "dots" | "pulse";
}

const sizes = {
  sm: 16,
  md: 24,
  lg: 40,
};

export default function Loading({
  size = "md",
  text,
  fullScreen = false,
  className,
  variant = "default",
}: Props) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* Variant: default spinner */}
      {variant === "default" && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-[#227736]"
        >
          <Loader2 size={sizes[size]} />
        </motion.div>
      )}

      {/* Variant: bouncing dots */}
      {variant === "dots" && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full bg-[#227736]"
            />
          ))}
        </div>
      )}

      {/* Variant: pulsing circle */}
      {variant === "pulse" && (
        <div className="relative" style={{ width: sizes[size], height: sizes[size] }}>
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#227736]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute inset-0 rounded-full bg-[#227736]"
          />
          <div className="absolute inset-0 rounded-full bg-[#227736]" />
        </div>
      )}

      {/* Loading text with animated dots */}
      {text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 text-sm text-[#5a6e63] font-medium"
        >
          <span>{text}</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/85 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl border border-[#e2ebe6] px-10 py-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

/* ============================================================
   SKELETON LOADERS
   ============================================================ */

/** Skeleton card — for lists/grids */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#e2ebe6] p-5 overflow-hidden relative",
        className
      )}
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#eaf6ee] to-transparent skew-x-12"
      />

      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-[#eaf6ee] mb-3" />
        <div className="h-4 bg-[#eaf6ee] rounded w-3/4 mb-2" />
        <div className="h-3 bg-[#eaf6ee] rounded w-1/2" />
      </div>
    </div>
  );
}

/** Skeleton line — for text */
export function SkeletonLine({
  width = "w-full",
  className,
}: {
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-3 bg-[#eaf6ee] rounded relative overflow-hidden",
        width,
        className
      )}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </div>
  );
}

/** Skeleton row — for tables */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 border border-[#e2ebe6] rounded-xl bg-white">
      <div className="w-9 h-9 rounded-lg bg-[#eaf6ee] shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-2/3" />
        <SkeletonLine width="w-1/3" />
      </div>
    </div>
  );
}

/** Skeleton avatar — for user profiles */
export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-full bg-[#eaf6ee] shrink-0"
      style={{ width: size, height: size }}
    />
  );
}