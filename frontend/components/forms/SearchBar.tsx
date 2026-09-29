"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Loader2, Sparkles, ArrowRight, Command,
  CornerDownLeft, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange?: (q: string) => void;
  onSearch?: (q: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  suggestions?: string[];
  className?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
  recentSearches?: string[];
}

export default function SearchBar({
  value: externalValue,
  onChange,
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
  loading = false,
  suggestions = [],
  className,
  autoFocus,
  showShortcut = true,
  recentSearches = [],
}: Props) {
  const [internal, setInternal] = useState("");
  const value = externalValue ?? internal;
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (v: string) => {
    if (externalValue === undefined) setInternal(v);
    onChange?.(v);
    setHighlighted(-1);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(v), debounceMs);
  };

  const handleClear = () => {
    if (externalValue === undefined) setInternal("");
    onChange?.("");
    onSearch?.("");
    setHighlighted(-1);
    inputRef.current?.focus();
  };

  const filteredSuggestions =
    focused && value.length > 1
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5)
      : [];

  /* ============================================================
     KEYBOARD SHORTCUTS
     ============================================================ */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (h) => (h - 1 + filteredSuggestions.length) % filteredSuggestions.length
      );
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      const s = filteredSuggestions[highlighted];
      handleChange(s);
      onSearch?.(s);
      setFocused(false);
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  /* ============================================================
     GLOBAL ⌘K SHORTCUT
     ============================================================ */
  useEffect(() => {
    if (!showShortcut) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showShortcut]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const showSuggestions = filteredSuggestions.length > 0;
  const showRecent = focused && value.length === 0 && recentSearches.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      {/* ==================== INPUT CONTAINER ==================== */}
      <div className="relative group">
        {/* Search icon */}
        <Search
          size={16}
          strokeWidth={2.5}
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300",
            focused ? "text-[#227736]" : "text-[#5a6e63]"
          )}
        />

        {/* Input field */}
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 py-2.5 text-sm rounded-xl",
            "bg-[#f8faf9] border-2 border-[#e2ebe6] text-[#0f1d17]",
            "outline-none transition-all duration-300",
            "placeholder:text-[#5a6e63]/60",
            focused
              ? "bg-white border-[#227736] ring-4 ring-[#227736]/10 pr-20"
              : "hover:bg-white hover:border-[#227736]/40 pr-16"
          )}
        />

        {/* Right side: loading / clear / shortcut */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2
                size={14}
                strokeWidth={2.5}
                className="animate-spin text-[#227736]"
              />
            </motion.div>
          )}

          {value && !loading && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="p-1 rounded-md text-[#5a6e63] 
                hover:text-[#227736] hover:bg-[#eaf6ee] 
                transition-all duration-200"
              aria-label="Clear search"
            >
              <X size={13} strokeWidth={2.5} />
            </motion.button>
          )}

          {/* ⌘K shortcut badge */}
          {showShortcut && !value && !loading && (
            <kbd
              className={cn(
                "hidden md:inline-flex items-center gap-0.5",
                "px-1.5 py-0.5 rounded-md",
                "text-[10px] font-bold font-mono",
                "bg-white border border-[#e2ebe6] text-[#5a6e63]",
                focused && "opacity-0"
              )}
            >
              <Command size={9} strokeWidth={2.5} />
              K
            </kbd>
          )}
        </div>
      </div>

      {/* ==================== SUGGESTIONS DROPDOWN ==================== */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-30 top-full left-0 right-0 mt-2 
              bg-white rounded-2xl border border-[#e2ebe6] 
              shadow-2xl shadow-black/10 overflow-hidden"
          >
            {/* Top gradient line */}
            <div className="h-0.5 bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22]" />

            {/* Header */}
            <div className="px-3 py-2 border-b border-[#e2ebe6] 
              flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5a6e63] 
                uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={10} className="text-[#E67E22]" />
                Suggestions
              </span>
              <span className="text-[10px] text-[#5a6e63] font-medium">
                {filteredSuggestions.length} results
              </span>
            </div>

            {/* Suggestions list */}
            <div className="py-1 max-h-72 overflow-y-auto">
              {filteredSuggestions.map((s, i) => {
                const isHighlighted = i === highlighted;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleChange(s);
                      onSearch?.(s);
                      setFocused(false);
                    }}
                    onMouseEnter={() => setHighlighted(i)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm",
                      "flex items-center gap-2.5 transition-colors duration-150",
                      isHighlighted
                        ? "bg-[#eaf6ee] text-[#227736]"
                        : "text-[#0f1d17] hover:bg-[#f8faf9]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        "border transition-colors duration-200",
                        isHighlighted
                          ? "bg-[#227736] border-[#227736] text-white"
                          : "bg-[#f8faf9] border-[#e2ebe6] text-[#5a6e63]"
                      )}
                    >
                      <Search size={12} strokeWidth={2.5} />
                    </div>

                    <span className="flex-1 truncate font-medium">{s}</span>

                    {isHighlighted && (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="shrink-0 text-[#227736]"
                      >
                        <CornerDownLeft size={12} strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer — keyboard hints */}
            <div className="px-3 py-2 border-t border-[#e2ebe6] bg-[#f8faf9] 
              flex items-center justify-end gap-3 text-[10px] text-[#5a6e63]">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e2ebe6] 
                  font-mono font-bold">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e2ebe6] 
                  font-mono font-bold">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e2ebe6] 
                  font-mono font-bold">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== RECENT SEARCHES ==================== */}
      <AnimatePresence>
        {showRecent && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-30 top-full left-0 right-0 mt-2 
              bg-white rounded-2xl border border-[#e2ebe6] 
              shadow-2xl shadow-black/10 overflow-hidden"
          >
            {/* Top gradient line */}
            <div className="h-0.5 bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22]" />

            <div className="px-3 py-2 border-b border-[#e2ebe6] 
              flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5a6e63] 
                uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={10} className="text-[#E67E22]" />
                Recent
              </span>
              <button className="text-[10px] text-[#227736] font-bold hover:underline">
                Clear
              </button>
            </div>

            <div className="py-1">
              {recentSearches.slice(0, 4).map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleChange(s);
                    onSearch?.(s);
                    setFocused(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm 
                    flex items-center gap-2.5 text-[#0f1d17] 
                    hover:bg-[#f8faf9] transition-colors duration-150 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#f8faf9] border border-[#e2ebe6] 
                    flex items-center justify-center shrink-0 
                    group-hover:border-[#227736]/30 transition-colors">
                    <TrendingUp size={11} className="text-[#5a6e63]" strokeWidth={2.5} />
                  </div>
                  <span className="flex-1 truncate">{s}</span>
                  <ArrowRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 
                      group-hover:translate-x-0.5 transition-all"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}