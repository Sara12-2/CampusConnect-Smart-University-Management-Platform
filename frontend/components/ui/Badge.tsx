"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent"
  | "outline"
  | "ghost"
  | "solid-accent";

type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  icon?: ReactNode;
  pulse?: boolean;
  onRemove?: () => void;
}

/* ============================================================
   VARIANTS
   ============================================================ */
const variants: Record<Variant, string> = {
  /* Green primary */
  default: "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]",

  /* Solid green — emphasis */
  success: "bg-[#227736] text-white border-[#227736]",

  /* Orange accent — dark */
  accent: "bg-[#fdf2e3] text-[#B45A0B] border-[#E67E22]/40",

  /* Solid orange */
  "solid-accent": "bg-[#E67E22] text-white border-[#E67E22]",

  /* Warning (yellow) */
  warning: "bg-[#fff8e1] text-[#8a6100] border-[#ffc107]/40",

  /* Danger (red) */
  danger: "bg-[#fdeaea] text-[#b32434] border-[#f5c2c7]",

  /* Info (soft green) */
  info: "bg-[#eaf6ee] text-[#1c6430] border-[#a3d5b3]",

  /* Outline only */
  outline: "bg-transparent text-[#5a6e63] border-[#e2ebe6]",

  /* Ghost (very subtle) */
  ghost: "bg-[#f8faf9] text-[#5a6e63] border-transparent",
};

/* ============================================================
   SIZES
   ============================================================ */
const sizes: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-0.5 text-[11px] gap-1.5",
  lg: "px-3 py-1 text-xs gap-1.5",
};

export default function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  pulse = false,
  onRemove,
}: Props) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        "transition-colors duration-200",
        variants[variant],
        sizes[size],
        onRemove && "pr-1",
        className
      )}
    >
      {/* ============ DOT INDICATOR ============ */}
      {dot && (
        <span className="relative flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {pulse && (
            <motion.span
              animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-current"
            />
          )}
        </span>
      )}

      {/* ============ ICON ============ */}
      {icon && (
        <span className="shrink-0 flex items-center justify-center">
          {icon}
        </span>
      )}

      {/* ============ CHILDREN ============ */}
      <span className="truncate">{children}</span>

      {/* ============ REMOVE BUTTON ============ */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center 
            hover:bg-current/20 transition-colors shrink-0"
          aria-label="Remove"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M1 1L7 7M7 1L1 7" />
          </svg>
        </button>
      )}
    </motion.span>
  );
}