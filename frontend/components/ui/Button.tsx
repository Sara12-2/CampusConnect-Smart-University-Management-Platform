"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent"
  | "white";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  className?: string;
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#227736] text-white hover:bg-[#1c6430] active:bg-[#165127] shadow-md shadow-[#227736]/25 hover:shadow-lg hover:shadow-[#227736]/30",
  secondary:
    "bg-[#eaf6ee] text-[#227736] hover:bg-[#d5ecdc] border border-[#c8e6d1] hover:border-[#a3d5b3]",
  outline:
    "border-2 border-[#227736] text-[#227736] hover:bg-[#eaf6ee] hover:border-[#1c6430]",
  ghost:
    "text-[#5a6e63] hover:bg-[#eaf6ee] hover:text-[#227736]",
  danger:
    "bg-[#dc3545] text-white hover:bg-[#c82333] shadow-md shadow-red-500/25",
  accent:
    "bg-[#f4a228] text-white hover:bg-[#e08a10] shadow-md shadow-[#f4a228]/25",
  white:
    "bg-white text-[#227736] hover:bg-[#eaf6ee] shadow-md shadow-black/10 hover:shadow-lg",
};

const sizes: Record<Size, string> = {
  // ✅ Mobile pe chota, desktop pe bara
  sm: "px-3 py-1.5 text-xs sm:text-[13px] rounded-lg",
  md: "px-4 py-2 text-sm sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl",
  lg: "px-5 py-2.5 text-sm sm:px-7 sm:py-3.5 sm:text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  form,
  className,
  disabled,
}: Props) {
  // ✅ whitespace-nowrap lagaya taake text 2 lines mein na toote
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 font-semibold overflow-hidden group whitespace-nowrap",
    "transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100",
    variants[variant],
    sizes[size],
    className
  );

  const inner = (
    <>
      {/* Shine sweep effect */}
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
          transition-transform duration-700 ease-out
          bg-gradient-to-r from-transparent via-white/25 to-transparent 
          pointer-events-none"
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 sm:gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.span
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn("inline-block", className?.includes("w-full") && "w-full")}
      >
        <Link href={href} className={classes}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      type={type}
      {...({ form } as any)} // ✅ TypeScript 'form' prop error fixed
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}