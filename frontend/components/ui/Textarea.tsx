"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";
import { useState, useRef, useEffect } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

export default function Textarea({
  label,
  error,
  hint,
  className,
  showCount = false,
  maxLength,
  autoResize = false,
  value,
  onChange,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLength = typeof value === "string" ? value.length : 0;
  const nearLimit = maxLength ? currentLength > maxLength * 0.9 : false;

  /* ============ AUTO RESIZE ============ */
  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="w-full">
      {/* ============ LABEL ROW ============ */}
      {(label || (showCount && maxLength)) && (
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {label && (
            <label className="block text-sm font-bold text-[#0f1d17] flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#E67E22]" />
              {label}
            </label>
          )}

          {showCount && maxLength && (
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums transition-colors duration-200",
                nearLimit ? "text-[#E67E22]" : "text-[#5a6e63]/70"
              )}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* ============ TEXTAREA CONTAINER ============ */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          {...props}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          maxLength={maxLength}
          className={cn(
            "w-full rounded-xl border-2 px-4 py-2.5 text-sm",
            "bg-[#f8faf9] text-[#0f1d17]",
            "placeholder:text-[#5a6e63]/60",
            "outline-none transition-all duration-300",
            "resize-none",
            autoResize && "overflow-hidden",
            "border-[#e2ebe6]",
            "hover:border-[#227736]/40 hover:bg-white",
            "focus:bg-white focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10",
            error &&
              "border-[#dc3545] focus:border-[#dc3545] focus:ring-[#dc3545]/10 bg-[#fdeaea]/40",
            className
          )}
        />

        {/* ============ SUCCESS INDICATOR (on focus without error) ============ */}
        <AnimatePresence>
          {focused && !error && value && String(value).length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-2.5 right-3 pointer-events-none"
            >
              <CheckCircle2
                size={14}
                className="text-[#227736]"
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============ CORNER ACCENT (hover) ============ */}
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-tl-xl 
          bg-gradient-to-br from-[#E67E22]/0 to-[#E67E22]/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          pointer-events-none rounded-br-xl" />
      </div>

      {/* ============ ERROR MESSAGE ============ */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="overflow-hidden flex items-center gap-1.5 text-xs text-[#dc3545] mt-1.5 font-medium"
          >
            <AlertCircle size={11} strokeWidth={2.5} className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ============ HINT ============ */}
      {hint && !error && (
        <p className="text-xs text-[#5a6e63] mt-1.5 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}