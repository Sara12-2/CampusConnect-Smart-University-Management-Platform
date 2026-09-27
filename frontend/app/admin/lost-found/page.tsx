"use client";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminLostFound() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Manage Lost & Found</h1>
        <p className="text-slate-500 text-sm mt-1">Saare items verify aur manage karein.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLostFound.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge className={it.type === "lost"
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-green-100 text-green-700 border-green-200"}>
                {it.type}
              </Badge>
              <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800">{it.title}</h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{it.description}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-1"><MapPin size={11} /> {it.location}</p>
              <p className="flex items-center gap-1"><Calendar size={11} /> {formatDate(it.date)}</p>
              <p>By: {it.reporterName}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}