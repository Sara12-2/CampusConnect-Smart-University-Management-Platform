"use client";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className, ...props }: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm",
          "focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none",
          "transition-all duration-200 placeholder:text-slate-400 resize-none",
          error && "border-red-400",
          className
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}