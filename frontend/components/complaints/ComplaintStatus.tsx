"use client";
import { motion } from "framer-motion";
import { Circle, User, Clock, CheckCircle2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComplaintStatus as StatusType } from "@/types";

interface Props {
  status: StatusType;
  compact?: boolean;
}

/* ============================================================
   STEPS — dark green + dark orange
   ============================================================ */
const steps: {
  key: StatusType;
  label: string;
  icon: typeof Circle;
  gradient: string;
  dotColor: string;
}[] = [
  {
    key: "submitted",
    label: "Submitted",
    icon: Circle,
    gradient: "from-[#5a6e63] to-[#0f1d17]",
    dotColor: "bg-[#5a6e63]",
  },
  {
    key: "assigned",
    label: "Assigned",
    icon: User,
    gradient: "from-[#227736] to-[#1c6430]",
    dotColor: "bg-[#227736]",
  },
  {
    key: "in-progress",
    label: "In Progress",
    icon: Clock,
    gradient: "from-[#E67E22] to-[#D35400]",
    dotColor: "bg-[#E67E22]",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    gradient: "from-[#28a745] to-[#227736]",
    dotColor: "bg-[#28a745]",
  },
];

export default function ComplaintStatus({ status, compact = false }: Props) {
  const currentIdx = steps.findIndex((s) => s.key === status);

  /* ============================================================
     COMPACT VERSION
     ============================================================ */
  if (compact) {
    const step = steps[currentIdx];
    const Icon = step.icon;
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full 
          bg-white border border-[#e2ebe6] shadow-sm"
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-gradient-to-br text-white flex items-center justify-center shadow-sm",
            step.gradient
          )}
        >
          <Icon size={10} strokeWidth={2.5} />
        </div>
        <span className="text-xs font-bold text-[#0f1d17]">
          {step.label}
        </span>
      </motion.div>
    );
  }

  /* ============================================================
     FULL TIMELINE VERSION
     ============================================================ */
  const progressPercent =
    steps.length > 1 ? (currentIdx / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative">
      {/* ==================== CONNECTING LINE ==================== */}
      <div className="absolute top-5 left-5 right-5 h-1 bg-[#e2ebe6] rounded-full" />

      {/* ==================== PROGRESS LINE ==================== */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-5 left-5 h-1 rounded-full 
          bg-gradient-to-r from-[#227736] via-[#E67E22] to-[#28a745] 
          shadow-md shadow-[#227736]/20"
        style={{ maxWidth: "calc(100% - 2.5rem)" }}
      />

      {/* ==================== STEPS ==================== */}
      <div className="relative flex justify-between">
        {steps.map((s, i) => {
          const done = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center gap-2 z-10 relative">
              {/* ============ PULSE RING (only current) ============ */}
              {isCurrent && (
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "absolute top-0 w-10 h-10 rounded-full",
                    s.dotColor
                  )}
                />
              )}

              {/* ============ STEP CIRCLE ============ */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2 + i * 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center",
                  "ring-4 ring-white transition-all duration-300",
                  done
                    ? cn(
                        "bg-gradient-to-br text-white",
                        s.gradient,
                        isCurrent
                          ? "shadow-xl"
                          : "shadow-md"
                      )
                    : "bg-[#f8faf9] text-[#5a6e63]/50 border-2 border-[#e2ebe6]"
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={2.5}
                  className={cn(
                    isCurrent && "animate-pulse"
                  )}
                />

                {/* ============ STEP NUMBER BADGE ============ */}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                  className={cn(
                    "absolute -top-1 -right-1 w-5 h-5 rounded-full",
                    "text-[9px] font-extrabold",
                    "flex items-center justify-center",
                    "ring-2 ring-white",
                    done
                      ? "bg-white text-[#0f1d17] border border-[#e2ebe6]"
                      : "bg-[#5a6e63] text-white"
                  )}
                >
                  {i + 1}
                </motion.span>
              </motion.div>

              {/* ============ LABEL ============ */}
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className={cn(
                  "text-xs text-center max-w-20 leading-tight transition-colors duration-300",
                  isCurrent
                    ? "font-extrabold text-[#0f1d17]"
                    : done
                    ? "font-bold text-[#5a6e63]"
                    : "font-medium text-[#5a6e63]/50"
                )}
              >
                {s.label}
              </motion.span>

              {/* ============ CURRENT INDICATOR ============ */}
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                    "text-[9px] font-extrabold uppercase tracking-wider",
                    "border shadow-sm",
                    status === "in-progress"
                      ? "bg-[#fdf2e3] text-[#B45A0B] border-[#E67E22]/40"
                      : status === "resolved"
                      ? "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                      : status === "assigned"
                      ? "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                      : "bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]"
                  )}
                >
                  <Activity size={8} strokeWidth={3} />
                  Current
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}