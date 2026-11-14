"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MessageSquare, X, CircleDot, Hourglass, CheckCircle2,
  XCircle, Calendar, User, Tag, Image as ImageIcon, Info,
  Wifi, Armchair, Building2, Zap, BookOpen, ChevronDown,
  ArrowRight, Loader2, AlertCircle
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   STATUS CONFIG
   ============================================================ */

const statusConfig = {
  submitted: { label: "Submitted", dot: "bg-[#5a6e63]", text: "text-[#5a6e63]", bg: "bg-[#f8faf9]", border: "border-[#e2ebe6]" },
  "in-progress": { label: "In Progress", dot: "bg-[#f4a228]", text: "text-[#b86b0a]", bg: "bg-[#fdf7ef]", border: "border-[#f4a228]/30" },
  resolved: { label: "Resolved", dot: "bg-[#227736]", text: "text-[#227736]", bg: "bg-[#eaf6ee]", border: "border-[#c8e6d1]" },
  rejected: { label: "Rejected", dot: "bg-[#dc3545]", text: "text-[#dc3545]", bg: "bg-[#fdeaea]", border: "border-[#dc3545]/30" },
} as const;

type StatusKey = keyof typeof statusConfig;

const priorityConfig = {
  low: { label: "Low", color: "bg-[#f8faf9] text-[#5a6e63] border-[#e2ebe6]" },
  normal: { label: "Normal", color: "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]" },
  high: { label: "High", color: "bg-[#fdf7ef] text-[#b86b0a] border-[#f4a228]/30" },
  urgent: { label: "Urgent", color: "bg-[#fdeaea] text-[#dc3545] border-[#dc3545]/30" },
};

const categoryConfig = {
  classroom: { label: "Classroom", icon: BookOpen },
  lab: { label: "Computer Lab", icon: Building2 },
  electricity: { label: "Electricity", icon: Zap },
  wifi: { label: "Wi-Fi", icon: Wifi },
  furniture: { label: "Furniture", icon: Armchair },
  other: { label: "Other", icon: CircleDot },
};

/* ============================================================
   PAGE
   ============================================================ */

export default function ComplaintsPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | StatusKey>("all");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "lab",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to view complaints.");
      
      const res = await fetch(`${API_URL}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch complaints.");
      const data = await res.json();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");

      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          images: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit complaint.");
      }

      setOpen(false);
      setFormData({ title: "", description: "", category: "lab" });
      fetchComplaints(); // Refresh list
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = complaints.filter((c) => filter === "all" || c.status === filter);

  const counts = {
    all: complaints.length,
    submitted: complaints.filter((c) => c.status === "submitted").length,
    "in-progress": complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#227736]" size={40} /></div>;
  if (error) return <div className="flex justify-center py-20"><div className="flex items-center gap-2 p-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={20} /><p className="text-sm font-semibold">{error}</p></div></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HERO HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127] p-6 md:p-7 text-white overflow-hidden shadow-xl shadow-[#227736]/20">
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" /></span><span className="text-[10px] font-bold tracking-wider uppercase">Support Tickets</span></div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Complaints</h1>
            <p className="mt-2 text-sm text-white/75 max-w-md">Track issues by ticket ID and resolution status.</p>
          </div>
          <motion.button whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setOpen(true)} className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#227736] text-sm font-bold shadow-xl shadow-black/20 hover:bg-[#eaf6ee] transition-all duration-300"><Plus size={15} className="relative" /><span className="relative">New Ticket</span></motion.button>
        </div>
      </motion.div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e2ebe6] border border-[#e2ebe6] rounded-2xl overflow-hidden bg-white shadow-sm">
        {[
          { id: "all" as const, label: "Total", count: counts.all, status: null },
          { id: "submitted" as const, label: "Submitted", count: counts.submitted, status: "submitted" as const },
          { id: "in-progress" as const, label: "In Progress", count: counts["in-progress"], status: "in-progress" as const },
          { id: "resolved" as const, label: "Resolved", count: counts.resolved, status: "resolved" as const },
        ].map((s) => {
          const active = filter === s.id;
          return (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`py-4 px-4 text-center transition-colors relative ${active ? "" : "hover:bg-[#f8faf9]"}`}>
              {active && <motion.div layoutId="activeTicketStat" className="absolute inset-0 bg-gradient-to-br from-[#227736] to-[#1c6430]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <p className={`relative text-2xl font-extrabold tabular-nums tracking-tight ${active ? "text-white" : "text-[#0f1d17]"}`}>{s.count}</p>
              <p className={`relative text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1.5 ${active ? "text-white/80" : "text-[#5a6e63]"}`}>{s.status && <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : statusConfig[s.status].dot}`} />}{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* RESULTS */}
      <div className="flex items-center justify-between text-xs">
        <p className="text-[#5a6e63] font-medium"><span className="font-bold text-[#0f1d17]">{filtered.length}</span> {filtered.length === 1 ? "ticket" : "tickets"}</p>
        {filter !== "all" && <button onClick={() => setFilter("all")} className="text-[#227736] hover:text-[#1c6430] font-bold hover:underline transition-colors">Show all</button>}
      </div>

      {/* TICKET LIST */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-dashed border-[#e2ebe6] rounded-2xl bg-[#f8faf9]">
          <MessageSquare size={44} className="mx-auto text-[#5a6e63]/30 mb-4" strokeWidth={1.2} />
          <h3 className="text-lg font-bold text-[#0f1d17]">No tickets {filter !== "all" ? `in "${statusConfig[filter]?.label}"` : ""}</h3>
          <p className="text-sm text-[#5a6e63] mt-1">{filter === "all" ? "You haven't submitted any complaints yet." : "No tickets match this filter."}</p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const s = statusConfig[c.status as StatusKey] || statusConfig.submitted;
              const p = priorityConfig[(c.priority as keyof typeof priorityConfig) || "normal"];
              const cat = categoryConfig[c.category as keyof typeof categoryConfig] || categoryConfig.other;
              const CatIcon = cat.icon;
              const ticketId = `TKT-${String(c.id).padStart(4, '0')}`;

              return (
                <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}>
                  <Link href={`/student/complaints/${c.id}`} className={`group block relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${c.status === "resolved" ? "border-[#227736]/30 hover:border-[#227736]/60" : c.status === "in-progress" ? "border-[#f4a228]/30 hover:border-[#f4a228]/60" : c.status === "rejected" ? "border-[#dc3545]/30 hover:border-[#dc3545]/60" : "border-[#e2ebe6] hover:border-[#5a6e63]/40"}`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.dot}`} />
                    <div className="relative pl-5 pr-4 py-4">
                      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                          <span className="text-[11px] font-mono font-bold text-[#227736] bg-[#eaf6ee] px-2 py-0.5 rounded-md border border-[#c8e6d1] shrink-0">{ticketId}</span>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${p.color} shrink-0`}><Tag size={8} />{p.label}</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6] shrink-0"><CatIcon size={8} />{cat.label}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border} shrink-0`}><span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-[#0f1d17] group-hover:text-[#227736] transition-colors line-clamp-1 tracking-tight">{c.title}</h3>
                      <p className="text-xs text-[#5a6e63] line-clamp-1 mt-1 leading-relaxed">{c.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-[#5a6e63] mt-3.5 pt-3 border-t border-dashed border-[#e2ebe6]">
                        <span className="flex items-center gap-1.5"><Calendar size={10} className="text-[#f4a228]" />{formatDate(c.createdAt)}</span>
                        {c.assignedTo && <span className="flex items-center gap-1.5"><User size={10} className="text-[#227736]" />{c.assignedTo}</span>}
                        <div className="flex-1" />
                        <ArrowRight size={13} className="text-[#5a6e63] group-hover:text-[#227736] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* INFO */}
      {filtered.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-start gap-3 p-4 rounded-2xl bg-[#f8faf9] border border-dashed border-[#e2ebe6]">
          <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center shrink-0"><Info size={14} className="text-[#227736]" /></div>
          <p className="text-xs text-[#5a6e63] leading-relaxed pt-1">Every complaint gets a unique ticket ID. Status updates appear in real-time. Average resolution time is 1-2 business days.</p>
        </motion.div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="relative bg-gradient-to-br from-[#227736] to-[#1c6430] p-6 text-white">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25"><Plus size={20} /></div><div><h2 className="text-lg font-extrabold tracking-tight">New Complaint Ticket</h2><p className="text-[11px] text-white/70 mt-0.5">A ticket ID will be generated automatically</p></div></div>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all duration-300"><X size={16} /></motion.button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]" autoComplete="off">
                {submitError && <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={16} /><p className="text-xs font-semibold">{submitError}</p></div>}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Subject</label>
                  <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Short summary of the issue" required disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Category</label>
                  <div className="relative">
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={submitting} className="w-full appearance-none px-4 pr-9 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 cursor-pointer disabled:opacity-60">
                      <option value="classroom">Classroom</option>
                      <option value="lab">Computer Lab</option>
                      <option value="electricity">Electricity</option>
                      <option value="wifi">Wi-Fi</option>
                      <option value="furniture">Furniture</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Describe the issue — location, time, what happened..." required disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm resize-none border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                </div>
                <div className="flex gap-3 pt-3">
                  <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setOpen(false)} disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#dc3545]/40 hover:text-[#dc3545] hover:bg-[#fdeaea] transition-all duration-300 disabled:opacity-60">Cancel</motion.button>
                  <motion.button type="submit" disabled={submitting} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-br from-[#227736] to-[#1c6430] text-white shadow-lg shadow-[#227736]/30 hover:shadow-xl hover:shadow-[#227736]/40 transition-all duration-300 relative overflow-hidden group disabled:opacity-60">
                    {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : <span className="relative">Submit Ticket</span>}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}