"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, MapPin, Calendar, Trash2, User, Package, Inbox, Tag,
  ShieldCheck, Grid3x3, List, Eye, CheckCircle2, Clock,
  AlertCircle, ArrowRight, X, Gift, Loader2, FileCheck, CircleDot,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ItemType = "lost" | "found";
type ItemStatus = "open" | "claimed" | "returned";
type FilterType = "all" | ItemType;
type StatusFilter = "all" | ItemStatus;
type ViewType = "grid" | "list";

interface LostFoundItem {
  id: number;
  title: string;
  description: string;
  location: string;
  image_url?: string | null;
  reporterId: number;
  type: ItemType;
  status: ItemStatus;
  createdAt: string;
}

interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const typeConfig: Record<ItemType, { icon: typeof Search; label: string; bg: string; text: string; border: string; bar: string; gradient: string; }> = {
  lost: { icon: Search, label: "Lost", bg: "bg-[#fdf2e3]", text: "text-[#B45A0B]", border: "border-[#E67E22]/40", bar: "bg-[#E67E22]", gradient: "from-[#E67E22] to-[#D35400]" },
  found: { icon: Gift, label: "Found", bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]", bar: "bg-[#227736]", gradient: "from-[#227736] to-[#28a745]" },
};

const statusConfig: Record<ItemStatus, { icon: typeof Clock; label: string; bg: string; text: string; border: string }> = {
  open: { icon: AlertCircle, label: "Open", bg: "bg-[#fdf2e3]", text: "text-[#B45A0B]", border: "border-[#E67E22]/40" },
  claimed: { icon: Clock, label: "Claimed", bg: "bg-[#f8faf9]", text: "text-[#5a6e63]", border: "border-[#e2ebe6]" },
  returned: { icon: CheckCircle2, label: "Returned", bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]" },
};

const filterTabs: { id: FilterType; label: string; icon: typeof Grid3x3 }[] = [
  { id: "all", label: "All", icon: Grid3x3 },
  { id: "lost", label: "Lost", icon: Search },
  { id: "found", label: "Found", icon: Gift },
];

const statusFilterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Status" },
  { id: "open", label: "Open" },
  { id: "claimed", label: "Claimed" },
  { id: "returned", label: "Returned" },
];

const viewTabs: { id: ViewType; icon: typeof Grid3x3; label: string }[] = [
  { id: "grid", icon: Grid3x3, label: "Grid view" },
  { id: "list", icon: List, label: "List view" },
];

export default function AdminLostFound() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewType>("grid");
  
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [viewTarget, setViewTarget] = useState<LostFoundItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        const [itemsRes, claimsRes] = await Promise.all([
          fetch(`${API_URL}/api/lost-found`, { headers }),
          fetch(`${API_URL}/api/claims`, { headers })
        ]);

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(Array.isArray(itemsData) ? itemsData : []);
        }
        if (claimsRes.ok) {
          const claimsData = await claimsRes.json();
          setClaims(Array.isArray(claimsData) ? claimsData : []);
        }
      } catch (err) {
        pushToast("error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/lost-found/${deleteTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete item");

      setItems((prev) => prev.filter((i) => i.id !== deleteTarget));
      setDeleteTarget(null);
      pushToast("success", "Item deleted successfully.");
    } catch (err) {
      pushToast("error", "Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = items.filter((it) => {
    const q = search.toLowerCase().trim();
    const matchType = filter === "all" || it.type === filter;
    const matchStatus = statusFilter === "all" || it.status === statusFilter;
    const matchSearch = !q || it.title.toLowerCase().includes(q) || it.location.toLowerCase().includes(q) || (it.description && it.description.toLowerCase().includes(q));
    return matchType && matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Items", value: items.length, icon: Package, accent: false },
    { label: "Lost", value: items.filter((i) => i.type === "lost").length, icon: Search, accent: true },
    { label: "Found", value: items.filter((i) => i.type === "found").length, icon: Gift, accent: false },
    { label: "Returned", value: items.filter((i) => i.status === "returned").length, icon: CheckCircle2, accent: true },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]"><Loader2 size={32} className="animate-spin text-[#227736]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* TOASTS */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className={cn("pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold", t.type === "success" ? "bg-[#eaf6ee] border-[#c8e6d1] text-[#227736]" : "bg-[#fdeaea] border-[#f5c2c7] text-[#dc3545]")}>
              {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdf2e3] border border-[#E67E22]/30 mb-3">
            <ShieldCheck size={12} className="text-[#E67E22]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B45A0B]">Item Registry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] flex items-center justify-center shadow-lg shadow-[#E67E22]/25"><Search size={18} className="text-white" /></div>
            Manage Lost &amp; Found
          </h1>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e2ebe6] p-5">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", s.accent ? "bg-[#fdf2e3] text-[#E67E22]" : "bg-[#eaf6ee] text-[#227736]")}><s.icon size={14} /></div>
            <p className={cn("text-3xl font-extrabold", s.accent ? "text-[#E67E22]" : "text-[#227736]")}>{s.value}</p>
            <p className="text-xs text-[#5a6e63] mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] p-3 md:p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by item name, location..." className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border-2 border-[#e2ebe6] outline-none focus:border-[#227736]" />
          </div>
          <div className="flex items-center gap-2 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {filterTabs.map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg", filter === tab.id ? "bg-[#227736] text-white" : "text-[#5a6e63]")}><tab.icon size={12} />{tab.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl">
            {viewTabs.map((v) => (
              <button key={v.id} onClick={() => setView(v.id)} className={cn("p-2 rounded-lg", view === v.id ? "bg-[#227736] text-white" : "text-[#5a6e63]")}><v.icon size={14} /></button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#e2ebe6] flex-wrap">
          <span className="text-[10px] font-bold uppercase text-[#5a6e63]">Status:</span>
          {statusFilterTabs.map((s) => (
            <button key={s.id} onClick={() => setStatusFilter(s.id)} className={cn("px-3 py-1 text-[11px] font-bold rounded-md", statusFilter === s.id ? "bg-[#227736] text-white" : "bg-white text-[#5a6e63] border border-[#e2ebe6]")}>{s.label}</button>
          ))}
          <span className="ml-auto text-[11px] font-bold text-[#5a6e63]">Showing {filtered.length} items</span>
        </div>
      </div>

      {/* ITEMS */}
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Inbox size={26} className="mx-auto text-[#227736] mb-4" /><h3 className="font-bold text-[#0f1d17]">No items found</h3></div>
      ) : view === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it) => {
            const cfg = typeConfig[it.type];
            const statusCfg = statusConfig[it.status] || statusConfig.open;
            return (
              <div key={it.id} className="bg-white rounded-2xl border border-[#e2ebe6] p-5 hover:shadow-lg transition-all">
                <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient} -mx-5 -mt-5 mb-4 rounded-t-2xl`} />
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cfg.gradient}`}><cfg.icon size={18} /></div>
                  <button onClick={() => setDeleteTarget(it.id)} className="p-1.5 text-[#dc3545] hover:bg-[#fdeaea] rounded-lg"><Trash2 size={14} /></button>
                </div>
                <h3 className="font-bold text-[#0f1d17] text-base line-clamp-1">{it.title}</h3>
                <p className="text-sm text-[#5a6e63] mt-1.5 line-clamp-2">{it.description}</p>
                <div className="mt-4 space-y-2 text-xs text-[#5a6e63]">
                  <div className="flex items-center gap-2"><MapPin size={11} className="text-[#227736]" /> {it.location}</div>
                  <div className="flex items-center gap-2"><Calendar size={11} className="text-[#227736]" /> {formatDate(it.createdAt)}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#e2ebe6] flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>{statusCfg.label}</span>
                  <button onClick={() => setViewTarget(it)} className="text-xs font-bold text-[#227736] flex items-center gap-1">View <ArrowRight size={11} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((it) => {
            const cfg = typeConfig[it.type];
            const statusCfg = statusConfig[it.status] || statusConfig.open;
            return (
              <div key={it.id} className="bg-white rounded-2xl border border-[#e2ebe6] p-5 pl-6 flex items-center gap-4">
                <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cfg.gradient}`}><cfg.icon size={20} /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0f1d17] text-base line-clamp-1">{it.title}</h3>
                  <div className="flex gap-4 mt-2 text-xs text-[#5a6e63]">
                    <span><MapPin size={11} className="inline mr-1" />{it.location}</span>
                    <span><Calendar size={11} className="inline mr-1" />{formatDate(it.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewTarget(it)} className="p-2 text-[#5a6e63] hover:text-[#227736]"><Eye size={15} /></button>
                  <button onClick={() => setDeleteTarget(it.id)} className="p-2 text-[#dc3545] hover:bg-[#fdeaea] rounded-lg"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewTarget(null)} className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className={`h-1.5 bg-gradient-to-r ${typeConfig[viewTarget.type].gradient}`} />
              <div className="p-6">
                <h2 className="text-xl font-extrabold text-[#0f1d17] mb-2">{viewTarget.title}</h2>
                <p className="text-sm text-[#5a6e63] mb-4">{viewTarget.description}</p>
                <div className="p-4 bg-[#f8faf9] rounded-xl mb-4">
                  <h3 className="text-sm font-bold mb-2">Claims ({claims.filter(c => c.itemId === viewTarget.id).length})</h3>
                  {claims.filter(c => c.itemId === viewTarget.id).length === 0 ? <p className="text-xs text-[#5a6e63]">No claims yet.</p> : claims.filter(c => c.itemId === viewTarget.id).map(c => (
                    <div key={c.id} className="p-2 bg-white rounded border mb-2 text-xs">{c.message} <span className="font-bold ml-2">({c.status})</span></div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setViewTarget(null)} className="px-4 py-2 rounded-lg bg-[#227736] text-white text-xs font-bold">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isDeleting && setDeleteTarget(null)} className="fixed inset-0 bg-[#0f1d17]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-2">Delete this item?</h3>
              <p className="text-xs text-[#5a6e63] mb-6">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-lg border text-sm font-bold">Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2 rounded-lg bg-[#dc3545] text-white text-sm font-bold">{isDeleting ? "Deleting..." : "Delete"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}