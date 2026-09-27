"use client";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className, ...props }: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm",
            "focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none",
            "transition-all duration-200 placeholder:text-slate-400",
            icon && "pl-10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className
          )}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}