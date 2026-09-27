"use client";
import { motion } from "framer-motion";
import { Circle, User, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComplaintStatus as StatusType } from "@/types";

interface Props {
  status: StatusType;
  compact?: boolean;
}

const steps: {
  key: StatusType;
  label: string;
  icon: typeof Circle;
  color: string;
}[] = [
  { key: "submitted", label: "Submitted", icon: Circle, color: "from-orange-400 to-orange-500" },
  { key: "assigned", label: "Assigned", icon: User, color: "from-orange-500 to-yellow-500" },
  { key: "in-progress", label: "In Progress", icon: Clock, color: "from-yellow-500 to-green-500" },
  { key: "resolved", label: "Resolved", icon: CheckCircle2, color: "from-green-500 to-green-600" },
];

export default function ComplaintStatus({ status, compact = false }: Props) {
  const currentIdx = steps.findIndex((s) => s.key === status);

  if (compact) {
    // Simple inline indicator
    const step = steps[currentIdx];
    const Icon = step.icon;
    return (
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-6 h-6 rounded-full bg-gradient-to-br text-white flex items-center justify-center",
            step.color
          )}
        >
          <Icon size={12} />
        </div>
        <span className="text-xs font-semibold text-slate-700">{step.label}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 rounded-full" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="absolute top-5 left-5 h-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
        style={{ maxWidth: "calc(100% - 2.5rem)" }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((s, i) => {
          const done = i <= currentIdx;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex flex-col items-center gap-2 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 300 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white transition-all",
                  done
                    ? "bg-gradient-to-br from-orange-500 to-green-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-slate-200 text-slate-400"
                )}
              >
                <Icon size={18} />
              </motion.div>
              <span
                className={cn(
                  "text-xs font-semibold text-center",
                  done ? "text-slate-800" : "text-slate-400"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}