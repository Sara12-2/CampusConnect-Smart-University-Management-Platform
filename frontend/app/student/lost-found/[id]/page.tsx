"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User, X, FileCheck, Loader2, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ItemDetail() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_URL}/api/lost-found/${params.id}`);
        if (!res.ok) throw new Error("Item not found.");
        const data = await res.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchItem();
  }, [params.id]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to claim an item.");

      const res = await fetch(`${API_URL}/api/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          message: claimMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit claim.");
      }

      setClaimOpen(false);
      setSubmitted(true);
      setClaimMessage("");
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#227736]" size={40} /></div>;

  if (error || !item) {
    return (
      <div>
        <EmptyState title={error || "Item not found"} />
        <div className="text-center mt-4">
          <Link href="/student/lost-found" className="text-[#E67E22] font-semibold hover:underline">
            ← Back to Lost & Found
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <Link href="/student/lost-found" className="inline-flex items-center gap-2 text-sm text-[#5a6e63] hover:text-[#E67E22] font-semibold transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="bg-white rounded-3xl border border-[#e2ebe6] overflow-hidden shadow-sm">
        {/* Header */}
        <div className={`h-56 bg-gradient-to-br flex items-center justify-center text-white ${item.type === "lost" ? "from-[#E67E22] to-[#D35400]" : "from-[#227736] to-[#28a745]"}`}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <FileCheck size={36} />
            </div>
            <p className="text-sm opacity-90 uppercase font-bold tracking-wider">{item.type}</p>
          </div>
        </div>

        <div className="p-8">
          <Badge className={item.type === "lost" ? "bg-[#fdf2e3] text-[#B45A0B] border-[#E67E22]/40" : "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"}>
            {item.type}
          </Badge>
          
          <h1 className="text-3xl font-extrabold text-[#0f1d17] mt-3">{item.title}</h1>
          <p className="text-[#5a6e63] mt-3 leading-relaxed">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 text-[#5a6e63]">
              <MapPin size={15} className="text-[#E67E22]" /> {item.location || "N/A"}
            </div>
            <div className="flex items-center gap-2 text-[#5a6e63]">
              <Calendar size={15} className="text-[#E67E22]" /> {formatDate(item.createdAt)}
            </div>
            <div className="flex items-center gap-2 text-[#5a6e63]">
              <User size={15} className="text-[#E67E22]" /> Reported by User #{item.reporterId}
            </div>
          </div>

          {item.type === "found" && (
            <div className="mt-8">
              <Button onClick={() => setClaimOpen(true)} variant="secondary" size="lg" className="w-full sm:w-auto">
                <FileCheck size={16} /> Claim This Item
              </Button>
            </div>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 bg-[#eaf6ee] border border-[#c8e6d1] rounded-xl text-[#227736] text-sm font-semibold">
              ✅ Claim submitted successfully! Admin will verify it.
            </motion.div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setClaimOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#0f1d17]">Submit Claim</h2>
                <button onClick={() => setClaimOpen(false)} className="p-2 rounded-lg hover:bg-[#f8faf9] text-[#5a6e63] transition-colors">
                  <X size={18} />
                </button>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]">
                  <AlertCircle size={16} />
                  <p className="text-xs font-semibold">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <Textarea
                  label="Proof / Description"
                  rows={4}
                  placeholder="Describe unique details about the item only you would know..."
                  required
                  value={claimMessage}
                  onChange={(e: any) => setClaimMessage(e.target.value)}
                  disabled={submitting}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setClaimOpen(false)} disabled={submitting} className="flex-1">Cancel</Button>
                  <Button type="submit" variant="secondary" disabled={submitting} className="flex-1">
                    {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Submit Claim"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}