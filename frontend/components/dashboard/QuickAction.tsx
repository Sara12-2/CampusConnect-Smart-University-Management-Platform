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
  delay?: number;
}

export default function QuickAction({
  label,
  description,
  icon: Icon,
  href,
  gradient = "from-orange-500 to-orange-600",
  delay = 0,
}: Props) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-xl hover:border-orange-200 transition-all"
      >
        {/* Background glow */}
        <div
          className={cn(
            "absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl group-hover:opacity-20 transition-opacity",
            gradient
          )}
        />

        <div className="relative flex items-start gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shrink-0 shadow-md",
              gradient
            )}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm">{label}</h3>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <ArrowRight
            size={16}
            className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all mt-1"
          />
        </div>
      </motion.div>
    </Link>
  );
}