"use client";
import { motion } from "framer-motion";
import { FileCheck, Check, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockClaims, mockLostFound } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

export default function AdminClaims() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Manage Claims</h1>
        <p className="text-slate-500 text-sm mt-1">Claims verify karein — approve ya reject.</p>
      </motion.div>

      <div className="space-y-3">
        {mockClaims.map((c, i) => {
          const item = mockLostFound.find(it => it.id === c.itemId);
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
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Claim for: {item?.title || "Unknown Item"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">By {c.claimantName}</p>
                    </div>
                    <Badge className={statusColors[c.status]}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 p-3 rounded-xl bg-slate-50">
                    <span className="font-semibold">Proof:</span> {c.proof}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(c.createdAt)}</p>
                </div>
              </div>
              {c.status === "pending" && (
                <div className="flex gap-2 mt-4 ml-15">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all">
                    <Check size={14} /> Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all">
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}