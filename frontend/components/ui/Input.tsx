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
        <label className="block text-sm font-semibold text-[#0f1d17] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6e63]">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full rounded-xl border-2 border-[#e2ebe6] bg-white px-4 py-2.5 text-sm text-[#0f1d17]",
            "focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none",
            "transition-all duration-200 placeholder:text-[#5a6e63]/60",
            !!icon && "pl-10",
            error && "border-[#dc3545] focus:border-[#dc3545] focus:ring-[#dc3545]/10",
            className
          )}
        />
      </div>
      {error && <p className="text-xs text-[#dc3545] mt-1.5 font-medium">{error}</p>}
    </div>
  );
}