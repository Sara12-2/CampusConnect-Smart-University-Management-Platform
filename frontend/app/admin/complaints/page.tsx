"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageSquare, User, Clock, CheckCircle2, CircleDot, Search,
  Calendar, Wrench, ChevronDown, Inbox, Tag, X, AlertCircle,
  ArrowRight, Loader2, UserCheck,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ComplaintStatus = "submitted" | "assigned" | "in-progress" | "resolved";
type FilterType = "all" | ComplaintStatus;

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  studentName: string;
  createdAt: string;
  assignedTo?: string | null;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const statusConfig: Record<
  ComplaintStatus,
  { icon: typeof Clock; label: string; bg: string; text: string; border: string; bar: string; }
> = {
  submitted: { icon: CircleDot, label: "Submitted", bg: "bg-[#f8faf9]", text: "text-[#5a6e63]", border: "border-[#e2ebe6]", bar: "bg-[#5a6e63]" },
  assigned: { icon: User, label: "Assigned", bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]", bar: "bg-[#227736]" },
  "in-progress": { icon: Clock, label: "In Progress", bg: "bg-[#fdf7ef]", text: "text-[#b86b0a]", border: "border-[#f4a228]/30", bar: "bg-[#f4a228]" },
  resolved: { icon: CheckCircle2, label: "Resolved", bg: "bg-[#eaf6ee]", text: "text-[#227736]", border: "border-[#c8e6d1]", bar: "bg-[#227736]" },
};

const filterTabs: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "submitted", label: "Submitted" },
  { id: "assigned", label: "Assigned" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

const STAFF_LIST = ["IT Support", "Maintenance", "Electrician", "Network Admin"];

export default function AdminComplaints() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch complaints");
        
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        pushToast("error", "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [router]);

  const handleStatusChange = async (id: number, newStatus: ComplaintStatus) => {
    const current = complaints.find((c) => c.id === id);
    if (!current || current.status === newStatus) return;

    setProcessingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      pushToast("success", `Complaint marked as ${newStatus.replace("-", " ")}.`);
    } catch (err) {
      pushToast("error", "Something went wrong.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAssignStaff = async (id: number, staff: string) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // Backend expects assignedTo in snake_case or camelCase depending on schema
        body: JSON.stringify({ assignedTo: staff, status: "assigned" }),
      });

      if (!res.ok) throw new Error("Failed to assign staff");

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, assignedTo: staff, status: "assigned" } : c
        )
      );
      pushToast("success", `Assigned to ${staff}.`);
    } catch (err) {
      pushToast("error", "Failed to assign.");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(complaints)) return [];
    const q = search.toLowerCase().trim();
    return complaints.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [complaints, filter, search]);

  const stats = [
    { id: "all" as FilterType, label: "Total", value: complaints.length, icon: Inbox },
    { id: "submitted" as FilterType, label: "Submitted", value: complaints.filter((c) => c.status === "submitted").length, icon: CircleDot },
    { id: "in-progress" as FilterType, label: "In Progress", value: complaints.filter((c) => c.status === "in-progress").length, icon: Clock },
    { id: "resolved" as FilterType, label: "Resolved", value: complaints.filter((c) => c.status === "resolved").length, icon: CheckCircle2 },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]"><Loader2 size={32} className="animate-spin text-[#227736]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
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
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#e2ebe6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-3">
            <Wrench size={11} className="text-[#227736]" />
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">Issue Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">Manage Complaints</h1>
          <p className="text-sm text-[#5a6e63] mt-1">Review, assign, and resolve campus issues reported by students.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const isActive = filter === s.id;
          return (
            <motion.button key={s.id} onClick={() => setFilter(s.id)} className={cn("text-left bg-white rounded-2xl border p-4 transition-all", isActive ? "border-[#227736] shadow-md" : "border-[#e2ebe6]")}>
              <div className="w-8 h-8 rounded-lg bg-[#eaf6ee] flex items-center justify-center mb-2"><Icon size={14} className="text-[#227736]" /></div>
              <p className="text-2xl font-extrabold text-[#0f1d17]">{s.value}</p>
              <p className="text-[10px] text-[#5a6e63] font-bold uppercase mt-0.5">{s.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, student, or category..." className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white border border-[#e2ebe6] outline-none focus:border-[#227736]" />
        </div>
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e2ebe6] rounded-xl overflow-x-auto">
          {filterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={cn("px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap", filter === tab.id ? "bg-[#227736] text-white" : "text-[#5a6e63]")}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#f8faf9] rounded-2xl border border-dashed border-[#e2ebe6]">
          <Inbox size={26} className="mx-auto text-[#227736] mb-4" />
          <h3 className="font-bold text-[#0f1d17]">No complaints found</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const cfg = statusConfig[c.status] || statusConfig.submitted;
            const StatusIcon = cfg.icon;
            const isProcessing = processingId === c.id;

            return (
              <div key={c.id} className="bg-white rounded-2xl border border-[#e2ebe6] p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-4 lg:w-1/3 shrink-0">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", cfg.bg, cfg.border, cfg.text)}><MessageSquare size={17} /></div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#0f1d17] text-sm truncate">{c.title}</h3>
                    <p className="text-[11px] text-[#5a6e63] mt-0.5 flex items-center gap-1"><User size={10} /> {c.studentName}</p>
                  </div>
                </div>

                <div className="flex-1 px-4 py-2 rounded-lg bg-[#f8faf9] border border-[#e2ebe6]">
                  <p className="text-[11px] text-[#5a6e63] line-clamp-2">{c.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  {!c.assignedTo && c.status !== "resolved" && (
                    <select onChange={(e) => e.target.value && handleAssignStaff(c.id, e.target.value)} disabled={isProcessing} className="text-xs font-bold rounded-lg border p-2 bg-white">
                      <option value="">Assign...</option>
                      {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                  <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)} disabled={isProcessing} className="text-xs font-bold rounded-lg border p-2 bg-white">
                    <option value="submitted">Submitted</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <Link href={`/admin/complaints/${c.id}`} className="p-2 text-[#227736]"><ArrowRight size={14} /></Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}