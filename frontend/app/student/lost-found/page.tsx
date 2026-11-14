"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, MapPin, Calendar, X, Wallet, Key, Smartphone,
  Glasses, Backpack, Coffee, ArrowRight, CheckCircle2, Sparkles,
  Image as ImageIcon, Loader2, AlertCircle, User
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ============================================================
   CATEGORY → FALLBACK ICON
   ============================================================ */

const categoryIcon: Record<string, LucideIcon> = {
  wallet: Wallet,
  bottle: Coffee,
  key: Key,
  phone: Smartphone,
  glasses: Glasses,
  backpack: Backpack,
};

/* ============================================================
   PAGE
   ============================================================ */

export default function LostFoundPage() {
  const [tab, setTab] = useState<"all" | "lost" | "found">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lost-found`);
      if (!res.ok) throw new Error("Failed to fetch items.");
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to report an item.");

      const res = await fetch(`${API_URL}/api/lost-found`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          location: formData.location,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit report.");
      }

      setOpen(false);
      setFormData({ type: "lost", title: "", description: "", location: "", date: "" });
      fetchItems(); // Refresh list
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter((it) => {
    const matchTab = tab === "all" || it.type === tab;
    const q = query.toLowerCase();
    const matchQ =
      it.title.toLowerCase().includes(q) ||
      (it.location && it.location.toLowerCase().includes(q));
    return matchTab && matchQ;
  });

  const clearFilters = () => {
    setQuery("");
    setTab("all");
  };

  const hasFilters = query || tab !== "all";

  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;

  const tabs = [
    { id: "all", label: "All Items", icon: Sparkles, count: items.length },
    { id: "lost", label: "Lost", icon: Search, count: lostCount },
    { id: "found", label: "Found", icon: CheckCircle2, count: foundCount },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER (same as before) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127] p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-[#227736]/20">
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" /></span>
              <span className="text-[10px] font-bold tracking-wider uppercase">Lost & Found</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Reunite with your belongings</h1>
            <p className="mt-2 text-sm text-white/75 max-w-md">Report lost items or help return found ones to their rightful owners.</p>
          </div>
          <motion.button whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setOpen(true)} className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#227736] text-sm font-bold shadow-xl shadow-black/20 hover:bg-[#eaf6ee] transition-all duration-300">
            <Plus size={15} className="relative" />
            <span className="relative">Report Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* SEARCH */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none" size={18} />
        <input placeholder="Search by item name or location..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-12 pr-12 py-3.5 text-sm rounded-2xl bg-white border border-[#e2ebe6] text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 hover:border-[#227736]/30 outline-none transition-all duration-300 shadow-sm focus:shadow-md" />
        <AnimatePresence>
          {query && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] transition-all duration-300"><X size={14} /></motion.button>}
        </AnimatePresence>
      </motion.div>

      {/* LOADING & ERROR */}
      {loading && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#227736]" size={36} /></div>}
      {error && !loading && <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={18} /><p className="text-sm font-semibold">{error}</p></div>}

      {!loading && !error && (
        <>
          {/* TABS */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {tabs.map((t, i) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <motion.button key={t.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setTab(t.id as any)} className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-300 ${active ? "text-white" : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736]"}`}>
                    {active && <motion.span layoutId="activeTab" className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] shadow-md shadow-[#227736]/30" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    <Icon size={13} className="relative" />
                    <span className="relative">{t.label}</span>
                    <span className={`relative text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${active ? "bg-white/20 text-white" : "bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6]"}`}>{t.count}</span>
                  </motion.button>
                );
              })}
            </div>
            {hasFilters && <motion.button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#dc3545] bg-[#fdeaea] border border-[#dc3545]/20 hover:bg-[#dc3545] hover:text-white transition-all duration-300"><X size={12} /> Clear</motion.button>}
          </motion.div>

          {/* RESULTS COUNT */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-[#5a6e63]">
            Showing <span className="font-bold text-[#0f1d17]">{filtered.length}</span> {filtered.length === 1 ? "item" : "items"}
          </motion.div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl border-2 border-dashed border-[#e2ebe6] bg-[#f8faf9] p-12 text-center">
              <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9] border border-[#c8e6d1] flex items-center justify-center mb-5 shadow-lg shadow-[#227736]/10"><Search size={32} className="text-[#227736]" /></motion.div>
              <h3 className="font-bold text-[#0f1d17] text-lg">No items found</h3>
              <p className="text-sm text-[#5a6e63] mt-1 max-w-sm mx-auto">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((it, i) => {
                  const isLost = it.type === "lost";
                  const FallbackIcon = categoryIcon[it.category] || Search;

                  return (
                    <motion.div key={it.id} layout initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ delay: i * 0.05, duration: 0.4 }} whileHover={{ y: -8 }}>
                      <Link href={`/student/lost-found/${it.id}`}>
                        <motion.div className={`group relative h-full rounded-2xl bg-white overflow-hidden border transition-all duration-500 ${isLost ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.35)]" : "border-[#227736]/30 hover:border-[#227736]/60 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.35)]"}`}>
                          <div className={`h-1 ${isLost ? "bg-gradient-to-r from-[#f4a228] via-[#e08a10] to-[#f4a228]" : "bg-gradient-to-r from-[#227736] via-[#28a745] to-[#227736]"}`} />

                          <div className="relative h-48 overflow-hidden bg-[#f8faf9]">
                            <div className={`absolute inset-0 flex items-center justify-center ${isLost ? "bg-gradient-to-br from-[#fdf7ef] via-[#fbe4c7] to-[#f4a228]/40" : "bg-gradient-to-br from-[#eaf6ee] via-[#d4ead9] to-[#227736]/40"}`}>
                              <FallbackIcon size={80} strokeWidth={1} className={isLost ? "text-[#f4a228]/40" : "text-[#227736]/40"} />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white backdrop-blur-md shadow-lg ${isLost ? "bg-[#f4a228]/95 shadow-[#f4a228]/40" : "bg-[#227736]/95 shadow-[#227736]/40"}`}>
                              {isLost ? <Search size={10} /> : <CheckCircle2 size={10} />}
                              {isLost ? "Lost" : "Found"}
                            </div>
                            <div className="absolute top-3 right-3 z-10">
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#5a6e63] border border-white/60 shadow-md"><span className={`w-1.5 h-1.5 rounded-full ${isLost ? "bg-[#f4a228]" : "bg-[#58b277]"} animate-pulse`} />Open</span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1.5 text-[10px] font-semibold text-white"><MapPin size={11} className="shrink-0" /><span className="truncate">{it.location || "N/A"}</span></div>
                          </div>

                          <div className="relative p-5">
                            <h3 className="font-extrabold text-[#0f1d17] text-base group-hover:text-[#227736] transition-colors line-clamp-1 tracking-tight">{it.title}</h3>
                            <p className="text-xs text-[#5a6e63] leading-relaxed mt-2 line-clamp-2">{it.description}</p>
                            
                            <div className="mt-4 pt-4 border-t border-[#f0f4f2] flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-[11px] text-[#5a6e63]"><Calendar size={11} className="text-[#f4a228]" /><span className="font-medium">{formatDate(it.createdAt)}</span></div>
                              <motion.div whileHover={{ x: 3 }} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isLost ? "bg-[#fdf7ef] text-[#f4a228] group-hover:bg-[#f4a228] group-hover:text-white" : "bg-[#eaf6ee] text-[#227736] group-hover:bg-[#227736] group-hover:text-white"}`}><ArrowRight size={14} /></motion.div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-dashed border-[#f0f4f2] flex items-center gap-2 text-[10px] text-[#5a6e63]">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#227736] to-[#28a745] flex items-center justify-center text-white text-[8px] font-bold"><User size={10} /></div>
                              <span>Reported by <span className="font-bold text-[#0f1d17]">User #{it.reporterId}</span></span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="relative bg-gradient-to-br from-[#227736] to-[#1c6430] p-6 text-white">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25"><Plus size={20} /></div>
                    <div><h2 className="text-lg font-extrabold tracking-tight">Report Item</h2><p className="text-[11px] text-white/70 mt-0.5">Help us reunite items with their owners</p></div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all duration-300"><X size={16} /></motion.button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]" autoComplete="off">
                {submitError && <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={16} /><p className="text-xs font-semibold">{submitError}</p></div>}
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-2">What would you like to report?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: "lost", label: "I Lost", icon: Search, accent: true }, { value: "found", label: "I Found", icon: CheckCircle2, accent: false }].map((t) => {
                      const Icon = t.icon;
                      const isChecked = formData.type === t.value;
                      return (
                        <label key={t.value} className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] ${isChecked ? (t.accent ? "border-[#f4a228] bg-[#fdf7ef]" : "border-[#227736] bg-[#eaf6ee]") : "border-[#e2ebe6]"}`}>
                          <input type="radio" name="type" value={t.value} checked={isChecked} onChange={() => setFormData({...formData, type: t.value})} className="sr-only" disabled={submitting} />
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.accent ? "bg-[#fdf7ef] border border-[#f4a228]/30 text-[#f4a228]" : "bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]"}`}><Icon size={18} /></div>
                            <span className="text-xs font-bold text-[#0f1d17]">{t.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Item Name</label>
                  <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Black leather wallet" required disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Describe the item with as much detail as possible..." required disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm resize-none border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Location</label>
                    <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Library Hall" required disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/60 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5a6e63] mb-1.5">Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} disabled={submitting} className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all duration-300 disabled:opacity-60" />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <motion.button type="button" onClick={() => setOpen(false)} disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#dc3545]/40 hover:text-[#dc3545] hover:bg-[#fdeaea] transition-all duration-300 disabled:opacity-60">Cancel</motion.button>
                  <motion.button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-br from-[#227736] to-[#1c6430] text-white shadow-lg shadow-[#227736]/30 hover:shadow-xl hover:shadow-[#227736]/40 transition-all duration-300 relative overflow-hidden group disabled:opacity-60">
                    {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : <span className="relative">Submit Report</span>}
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