"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20",
  secondary:
    "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20",
  outline:
    "border-2 border-orange-500 text-orange-600 hover:bg-orange-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export default function Button({
  children, variant = "primary", size = "md",
  href, onClick, type = "button", className, disabled,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300",
    "hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant], sizes[size], className
  );

  if (href) {
    return (
      <motion.div whileTap={{ scale: 0.97 }}>
        <Link href={href} className={classes}>{children}</Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type} onClick={onClick} disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}