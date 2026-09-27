"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
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
}: Props) {
  const [internal, setInternal] = useState("");
  const value = externalValue ?? internal;
  const [focused, setFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (v: string) => {
    if (externalValue === undefined) setInternal(v);
    onChange?.(v);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(v), debounceMs);
  };

  const handleClear = () => {
    if (externalValue === undefined) setInternal("");
    onChange?.("");
    onSearch?.("");
  };

  const filteredSuggestions =
    focused && value.length > 1
      ? suggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5)
      : [];

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border-2 border-slate-200 
            focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none 
            transition-all placeholder:text-slate-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 size={14} className="animate-spin text-orange-500" />}
          {value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
          >
            {filteredSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleChange(s);
                  onSearch?.(s);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <Search size={12} className="inline mr-2 text-slate-400" />
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}