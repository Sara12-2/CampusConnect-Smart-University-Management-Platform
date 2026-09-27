"use client";
import { motion } from "framer-motion";
import { FileCheck, Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

export default function ClaimsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">My Claims</h1>
        <p className="text-slate-500 text-sm mt-1">Aapne jo claims submit kiye unki list.</p>
      </motion.div>

      {mockClaims.length === 0 ? (
        <EmptyState title="Koi claim nahi" message="Abhi tak koi claim submit nahi kiya." />
      ) : (
        <div className="space-y-3">
          {mockClaims.map((c, i) => {
            const item = mockLostFound.find((it) => it.id === c.itemId);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-green-100 text-orange-600 flex items-center justify-center shrink-0">
                    <FileCheck size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-800">{item?.title || `Claim #${c.id}`}</h3>
                      <Badge className={statusColors[c.status]}>{c.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{c.proof}</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(c.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}