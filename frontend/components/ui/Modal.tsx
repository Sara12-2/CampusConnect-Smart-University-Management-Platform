"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "full";
type Variant = "default" | "success" | "warning" | "danger" | "info";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  footer?: ReactNode;
  className?: string;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  preventScroll?: boolean;
  icon?: ReactNode;
}

/* ============================================================
   SIZES
   ============================================================ */
const sizes: Record<Size, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

/* ============================================================
   VARIANTS — accent color per variant
   ============================================================ */
const variantConfig: Record<Variant, {
  bg: string;
  text: string;
  border: string;
  gradient: string;
  icon: typeof Sparkles;
}> = {
  default: {
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    gradient: "from-[#227736] to-[#28a745]",
    icon: Sparkles,
  },
  success: {
    bg: "bg-[#eaf6ee]",
    text: "text-[#227736]",
    border: "border-[#c8e6d1]",
    gradient: "from-[#227736] to-[#28a745]",
    icon: CheckCircle2,
  },
  warning: {
    bg: "bg-[#fdf2e3]",
    text: "text-[#B45A0B]",
    border: "border-[#E67E22]/40",
    gradient: "from-[#E67E22] to-[#D35400]",
    icon: AlertTriangle,
  },
  danger: {
    bg: "bg-[#fdeaea]",
    text: "text-[#dc3545]",
    border: "border-[#f5c2c7]",
    gradient: "from-[#dc3545] to-[#c82333]",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-[#eaf6ee]",
    text: "text-[#1c6430]",
    border: "border-[#a3d5b3]",
    gradient: "from-[#227736] to-[#58b277]",
    icon: Info,
  },
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "lg",
  variant = "default",
  footer,
  className,
  showClose = true,
  closeOnBackdrop = true,
  preventScroll = true,
  icon,
}: Props) {
  const cfg = variantConfig[variant];
  const modalRef = useRef<HTMLDivElement>(null);

  /* ============ LOCK BODY SCROLL ============ */
  useEffect(() => {
    if (!preventScroll) return;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, preventScroll]);

  /* ============ ESCAPE KEY CLOSE ============ */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* ============ FOCUS TRAP ============ */
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable = modalRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [open]);

  const handleBackdropClick = () => {
    if (closeOnBackdrop) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 
            bg-[#0f1d17]/60 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white rounded-3xl shadow-2xl shadow-black/20 w-full max-h-[90vh] flex flex-col overflow-hidden",
              "border border-[#e2ebe6]",
              sizes[size],
              className
            )}
          >
            {/* ============ TOP GRADIENT LINE ============ */}
            <div
              className={cn(
                "h-1 bg-gradient-to-r",
                cfg.gradient
              )}
            />

            {/* ============ HEADER ============ */}
            {title && (
              <div className="relative flex items-start justify-between gap-4 px-6 py-5 border-b border-[#e2ebe6] shrink-0">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Icon box */}
                  <div
                    className={cn(
                      "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-md",
                      cfg.gradient
                    )}
                  >
                    {icon || <cfg.icon size={18} className="text-white" strokeWidth={2.2} />}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-[#0f1d17] tracking-tight truncate">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-xs text-[#5a6e63] mt-0.5 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {showClose && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="shrink-0 p-2 rounded-lg text-[#5a6e63] 
                      hover:bg-[#f8faf9] hover:text-[#227736] 
                      transition-all duration-300"
                    aria-label="Close"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </motion.button>
                )}
              </div>
            )}

            {/* ============ BODY ============ */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* ============ FOOTER ============ */}
            {footer && (
              <div className="px-6 py-4 border-t border-[#e2ebe6] bg-[#f8faf9] shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}