"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Copy, Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  summary: string;
  original?: string;
  compact?: boolean;
  collapsible?: boolean;
  showActions?: boolean;
  onRegenerate?: () => void;
  className?: string;
}

export default function NoticeSummary({
  summary,
  original,
  compact = false,
  collapsible = true,
  showActions = true,
  onRegenerate,
  className,
}: Props) {
  const [expanded, setExpanded] = useState(!collapsible);
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // silent
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border-2 border-orange-100 bg-gradient-to-r from-orange-50/60 to-green-50/60 overflow-hidden",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center">
            <Sparkles size={14} />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              AI Summary
            </p>
            {!compact && (
              <p className="text-[10px] text-slate-500">
                Auto-generated — original notice bhi available hai
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showActions && (
            <>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  title="Regenerate"
                  className="p-1.5 rounded-lg hover:bg-white/70 text-orange-600 transition-all"
                >
                  <Wand2 size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                title="Copy summary"
                className="p-1.5 rounded-lg hover:bg-white/70 text-orange-600 transition-all"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </>
          )}
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-white/70 text-orange-600 transition-all"
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* Summary body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p
              className={cn(
                "text-slate-700 leading-relaxed mt-3",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {summary || "Koi summary available nahi."}
            </p>

            {/* Show original toggle */}
            {original && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowOriginal((v) => !v)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 
                    hover:underline flex items-center gap-1"
                >
                  {showOriginal ? "Hide" : "Show"} original notice
                  <ChevronDown
                    size={12}
                    className={cn(
                      "transition-transform",
                      showOriginal && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showOriginal && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed p-3 rounded-lg bg-white/70 border border-slate-200 whitespace-pre-line">
                        {original}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}