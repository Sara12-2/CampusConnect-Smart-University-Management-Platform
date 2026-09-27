"use client";
import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, ...props }: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm",
          "focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none",
          "transition-all duration-200 cursor-pointer",
          className
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}