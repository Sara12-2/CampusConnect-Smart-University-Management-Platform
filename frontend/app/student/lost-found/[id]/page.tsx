"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User, X, FileCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import EmptyState from "@/components/ui/EmptyState";
import { mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

export default function ItemDetail() {
  const params = useParams();
  const item = mockLostFound.find((i) => i.id === params.id);
  const [claimOpen, setClaimOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!item) {
    return (
      <div>
        <EmptyState title="Item nahi mila" />
        <div className="text-center">
          <Link href="/student/lost-found" className="text-orange-600 font-semibold hover:underline">← Back</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <Link href="/student/lost-found" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 font-semibold">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className={`h-56 bg-gradient-to-br flex items-center justify-center text-white ${
          item.type === "lost" ? "from-orange-400 to-orange-600" : "from-green-400 to-green-600"
        }`}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <FileCheck size={36} />
            </div>
            <p className="text-sm opacity-90 uppercase font-bold tracking-wider">{item.type}</p>
          </div>
        </div>

        <div className="p-8">
          <Badge className={item.type === "lost"
            ? "bg-orange-100 text-orange-700 border-orange-200"
            : "bg-green-100 text-green-700 border-green-200"}>
            {item.type}
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-800 mt-3">{item.title}</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={15} className="text-orange-500" /> {item.location}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={15} className="text-orange-500" /> {formatDate(item.date)}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <User size={15} className="text-orange-500" /> Reported by {item.reporterName}
            </div>
          </div>

          {item.type === "found" && (
            <div className="mt-8">
              <Button onClick={() => setClaimOpen(true)} variant="secondary" size="lg">
                <FileCheck size={16} /> Claim This Item
              </Button>
            </div>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold"
            >
              ✅ Claim submitted! Admin verify karega.
            </motion.div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setClaimOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Submit Claim</h2>
                <button onClick={() => setClaimOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setClaimOpen(false); setSubmitted(true); }} className="space-y-4">
                <Textarea
                  label="Proof / Description"
                  rows={4}
                  placeholder="Item ke baare mein kuch aisi baat likhein jo sirf aapko pata ho..."
                  required
                />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setClaimOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" variant="secondary" className="flex-1">Submit Claim</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}