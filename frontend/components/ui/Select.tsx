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
        <label className="block text-sm font-semibold text-[#0f1d17] mb-1.5">
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          "w-full rounded-xl border-2 border-[#e2ebe6] bg-white px-4 py-2.5 text-sm text-[#0f1d17]",
          "focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none",
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