"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Bell, MessageSquare, FileCheck, Clock, Check, CheckCheck,
  Filter, Sparkles, Zap, Activity, Loader2, AlertCircle
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const iconMap: Record<string, any> = {
  notice: Bell,
  deadline: Clock,
  complaint: MessageSquare,
  claim: FileCheck,
  general: Bell,
};

const colorMap: Record<string, any> = {
  notice: { from: "#227736", to: "#28a745", light: "#eaf6ee", accent: false },
  deadline: { from: "#f4a228", to: "#e08a10", light: "#fdf7ef", accent: true },
  complaint: { from: "#f4a228", to: "#b86b0a", light: "#fdf7ef", accent: true },
  claim: { from: "#227736", to: "#58b277", light: "#eaf6ee", accent: false },
  general: { from: "#5a6e63", to: "#0f1d17", light: "#f8faf9", accent: false },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to view notifications.");
      
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch notifications.");
      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const markAllRead = async () => {
    // Loop through unread notifications and mark them
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#227736]" size={40} /></div>;
  if (error) return <div className="flex items-center justify-center py-20"><div className="flex items-center gap-2 p-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={20} /><p className="text-sm font-semibold">{error}</p></div></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER (same as before) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127] p-5 md:p-6 text-white overflow-hidden shadow-xl shadow-[#227736]/20">
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" /></span>
              <span className="text-[10px] font-bold tracking-wider uppercase">Notifications Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Notifications
              {unreadCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-bold px-2.5 py-1 rounded-full bg-[#f4a228] text-white shadow-lg shadow-[#f4a228]/40">{unreadCount} new</motion.span>}
            </h1>
            <p className="mt-2 text-sm text-white/75 flex items-center gap-2"><Activity size={13} className="text-[#f4a228]" />Stay updated with everything happening on campus</p>
          </div>
          {unreadCount > 0 && (
            <motion.button whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={markAllRead} className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 hover:border-white/40 text-white text-xs font-bold shadow-lg shadow-black/10 transition-all duration-300"><CheckCheck size={14} />Mark all read</motion.button>
          )}
        </div>
      </motion.div>

      {/* FILTERS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-1.5 shrink-0"><Filter size={14} className="text-[#5a6e63]" /></div>
        {[{ id: "all", label: "All", count: notifications.length }, { id: "unread", label: "Unread", count: unreadCount }].map((f, i) => {
          const active = filter === f.id;
          return (
            <motion.button key={f.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setFilter(f.id as any)} className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${active ? "bg-gradient-to-br from-[#227736] to-[#1c6430] text-white shadow-lg shadow-[#227736]/30" : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736] hover:bg-[#f8faf9]"}`}>
              {active && <motion.span layoutId="notifFilterActive" className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] shadow-lg shadow-[#227736]/30 -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              {f.label}
              {f.count !== undefined && f.count > 0 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center ${active ? "bg-white/20 text-white" : f.id === "unread" ? "bg-[#f4a228] text-white" : "bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6]"}`}>{f.count}</span>}
            </motion.button>
          );
        })}
      </motion.div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative rounded-2xl border-2 border-dashed border-[#e2ebe6] bg-[#f8faf9] p-10 text-center">
              <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9] border border-[#c8e6d1] flex items-center justify-center mb-4 shadow-lg shadow-[#227736]/10"><Bell size={28} className="text-[#227736]" /></motion.div>
              <h3 className="font-bold text-[#0f1d17]">No notifications</h3>
              <p className="text-sm text-[#5a6e63] mt-1">{filter === "all" ? "You're all caught up!" : "Nothing to show for this filter."}</p>
            </motion.div>
          ) : (
            filtered.map((n, i) => {
              const type = n.link ? "notice" : "general"; // Simple fallback logic
              const Icon = iconMap[type] || Bell;
              const colors = colorMap[type] || colorMap.general;

              return (
                <motion.div key={n.id} layout initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.95 }} transition={{ delay: i * 0.05, duration: 0.4 }} whileHover={{ y: -4, scale: 1.005 }} className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${n.isRead ? "bg-white border-[#e2ebe6] hover:border-[#227736]/30 hover:shadow-2xl hover:shadow-[#227736]/10" : "bg-gradient-to-br from-[#fdf7ef]/60 via-white to-[#f8faf9] border-[#f4a228]/40 hover:border-[#f4a228]/60 hover:shadow-2xl hover:shadow-[#f4a228]/20"}`}>
                  {!n.isRead && (
                    <>
                      <motion.span animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f4a228] to-[#e08a10] shadow-[0_0_12px_rgba(244,162,40,0.8)]" />
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#f4a228] shadow-lg shadow-[#f4a228]/60"><motion.span animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#f4a228]" /></span>
                    </>
                  )}

                  <div className="relative p-4 md:p-5 flex items-start gap-4">
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }} transition={{ duration: 0.5 }} className="relative shrink-0">
                      <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, boxShadow: `0 8px 20px -5px ${colors.from}50` }}>
                        <Icon size={20} strokeWidth={2.2} />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm md:text-base tracking-tight line-clamp-1 ${n.isRead ? "font-semibold text-[#5a6e63]" : "font-extrabold text-[#0f1d17]"}`}>{n.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!n.isRead && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-br from-[#f4a228] to-[#e08a10] text-white shadow-md shadow-[#f4a228]/40"><Sparkles size={9} /> NEW</motion.span>}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {!n.isRead && (
                              <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => markAsRead(n.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] hover:bg-[#227736] hover:text-white hover:border-[#227736] transition-all duration-300"><Check size={13} /></motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className={`text-xs md:text-sm mt-1.5 leading-relaxed line-clamp-2 ${n.isRead ? "text-[#5a6e63]" : "text-[#0f1d17]/80"}`}>{n.message}</p>
                      <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                        <div className="flex items-center gap-2 text-[11px] text-[#5a6e63]"><Clock size={11} />{formatDate(n.createdAt)}</div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ backgroundColor: colors.light, color: colors.from, borderColor: `${colors.from}30` }}>{type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}