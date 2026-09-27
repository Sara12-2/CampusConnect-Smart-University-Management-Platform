"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function Card({ children, className, hover = true, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5 shadow-sm",
        hover && "hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}