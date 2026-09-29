"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant =
  | "default"
  | "glass"
  | "outline"
  | "elevated"
  | "accent"
  | "gradient"
  | "dark"
  | "interactive";

type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  variant?: Variant;
  padding?: Padding;
  radius?: Radius;
  accentTop?: boolean;
  accentColor?: "green" | "orange";
  onClick?: () => void;
  animated?: boolean;
}

/* ============================================================
   VARIANTS
   ============================================================ */
const variants: Record<Variant, string> = {
  /* Standard white card — green border */
  default: "bg-white border border-[#e2ebe6]",

  /* Glassmorphic — for hero / special sections */
  glass:
    "bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg shadow-[#227736]/5",

  /* Transparent + green outline */
  outline: "bg-transparent border-2 border-[#e2ebe6]",

  /* Elevated — strong shadow, no border */
  elevated: "bg-white border border-transparent shadow-xl shadow-[#227736]/10",

  /* Accent — pale green background */
  accent: "bg-[#f8faf9] border border-[#e2ebe6]",

  /* Gradient — green → orange */
  gradient:
    "bg-gradient-to-br from-[#eaf6ee] via-white to-[#fdf2e3] border border-[#e2ebe6]",

  /* Dark — for emphasis */
  dark: "bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] text-white border border-white/10",

  /* Interactive — more hover punch */
  interactive:
    "bg-white border border-[#e2ebe6] cursor-pointer hover:border-[#227736]/40",
};

/* ============================================================
   PADDINGS
   ============================================================ */
const paddings: Record<Padding, string> = {
  none: "",
  xs: "p-3",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
  xl: "p-8 md:p-10",
};

/* ============================================================
   RADIUS
   ============================================================ */
const radiusMap: Record<Radius, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

export default function Card({
  children,
  className,
  hover = true,
  delay = 0,
  variant = "default",
  padding = "md",
  radius = "lg",
  accentTop = false,
  accentColor = "green",
  onClick,
  animated = true,
}: Props) {
  const CardWrapper = animated ? motion.div : "div";

  const content = (
    <>
      {/* ============ TOP ACCENT LINE ============ */}
      {accentTop && (
        <div
          className={cn(
            "absolute top-0 left-4 right-4 h-0.5 rounded-full",
            accentColor === "orange"
              ? "bg-gradient-to-r from-[#E67E22] via-[#D35400] to-[#E67E22]"
              : "bg-gradient-to-r from-[#227736] via-[#28a745] to-[#227736]"
          )}
        />
      )}

      {/* ============ CHILDREN ============ */}
      <div className={cn(accentTop && "relative pt-1")}>{children}</div>
    </>
  );

  const baseClasses = cn(
    "relative transition-all duration-300 ease-out overflow-hidden",
    radiusMap[radius],
    variants[variant],
    paddings[padding],
    hover && [
      "hover:shadow-xl hover:-translate-y-1",
      variant === "dark"
        ? "hover:shadow-black/25 hover:border-[#E67E22]/40"
        : "hover:shadow-[#227736]/10 hover:border-[#227736]/40",
    ],
    onClick && "cursor-pointer",
    className
  );

  /* ============ ANIMATED VERSION ============ */
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={hover ? { y: -4 } : {}}
        onClick={onClick}
        className={baseClasses}
      >
        {content}
      </motion.div>
    );
  }

  /* ============ STATIC VERSION ============ */
  return (
    <div onClick={onClick} className={baseClasses}>
      {content}
    </div>
  );
}