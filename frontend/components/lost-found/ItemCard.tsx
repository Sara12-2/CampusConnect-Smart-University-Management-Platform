"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, User, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { LostFoundItem } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  item: LostFoundItem;
  index?: number;
  href?: string;
}

export default function ItemCard({ item, index = 0, href }: Props) {
  const isLost = item.type === "lost";
  const link = href ?? `/student/lost-found/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={link}>
        <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
          {/* Image / Gradient Banner */}
          <div
            className={cn(
              "relative h-36 flex items-center justify-center text-white overflow-hidden",
              isLost
                ? "bg-gradient-to-br from-orange-400 to-orange-600"
                : "bg-gradient-to-br from-green-400 to-green-600"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Search size={28} />
              </div>
            </motion.div>

            <div className="absolute top-3 right-3">
              <Badge className="bg-white/95 text-slate-800 border-transparent uppercase text-[10px] font-bold">
                {item.type}
              </Badge>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1 flex-1">
              {item.description}
            </p>

            <div className="mt-3 space-y-1.5 text-xs text-slate-500">
              <p className="flex items-center gap-1.5">
                <MapPin size={11} className="text-orange-500 shrink-0" />
                <span className="truncate">{item.location}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar size={11} className="text-orange-500 shrink-0" />
                {formatDate(item.date)}
              </p>
              <p className="flex items-center gap-1.5">
                <User size={11} className="text-orange-500 shrink-0" />
                {item.reporterName}
              </p>
            </div>

            {item.status !== "open" && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Badge
                  className={cn(
                    item.status === "returned"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}