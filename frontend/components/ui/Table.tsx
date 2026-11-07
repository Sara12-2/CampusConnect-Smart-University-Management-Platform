"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data found.", // ✅ Fixed to English
  className,
}: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-[#5a6e63] text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-[#e2ebe6]", className)}>
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-[#fdf2e3] to-[#eaf6ee] border-b border-[#e2ebe6]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left px-4 py-3 font-bold text-[#0f1d17] text-xs uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#e2ebe6]">
          {data.map((row, i) => (
            <motion.tr
              key={keyExtractor(row)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-[#f8faf9]"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn("px-4 py-3 text-[#5a6e63]", col.className)}
                >
                  {col.render
                    ? col.render(row, i)
                    : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}