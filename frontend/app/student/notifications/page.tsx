"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Bell, MessageSquare, FileCheck, Clock, Check, CheckCheck,
  Filter, Sparkles, Trash2, ChevronRight, Zap, Activity,
} from "lucide-react";
import { mockNotifications } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

const iconMap = {
  notice: Bell,
  deadline: Clock,
  complaint: MessageSquare,
  claim: FileCheck,
};

const colorMap = {
  notice: { from: "#227736", to: "#28a745", light: "#eaf6ee", accent: false },
  deadline: { from: "#f4a228", to: "#e08a10", light: "#fdf7ef", accent: true },
  complaint: { from: "#f4a228", to: "#b86b0a", light: "#fdf7ef", accent: true },
  claim: { from: "#227736", to: "#58b277", light: "#eaf6ee", accent: false },
};

type FilterType = "all" | "unread" | "notice" | "complaint" | "claim" | "deadline";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "notice", label: "Notices" },
    { id: "complaint", label: "Complaints" },
    { id: "claim", label: "Claims" },
    { id: "deadline", label: "Deadlines" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127]
          p-5 md:p-6 text-white overflow-hidden
          shadow-xl shadow-[#227736]/20"
      >
        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Orange glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />

        {/* Decorative icon */}
        <Bell
          size={140}
          strokeWidth={0.5}
          className="absolute -bottom-8 -right-4 text-white/[0.06]
            pointer-events-none select-none"
        />

        {/* Shine sweep */}
        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            skew-x-12 pointer-events-none"
        />

        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                bg-white/10 backdrop-blur-md border border-white/20 mb-3"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Notifications Center
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3"
            >
              Notifications
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-sm font-bold px-2.5 py-1 rounded-full
                    bg-[#f4a228] text-white shadow-lg shadow-[#f4a228]/40"
                >
                  {unreadCount} new
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/75 flex items-center gap-2"
            >
              <Activity size={13} className="text-[#f4a228]" />
              Stay updated with everything happening on campus
            </motion.p>
          </div>

          {/* Mark all read button */}
          {unreadCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white/15 backdrop-blur-md border border-white/25
                hover:bg-white/25 hover:border-white/40
                text-white text-xs font-bold
                shadow-lg shadow-black/10 hover:shadow-xl
                transition-all duration-300"
            >
              <CheckCheck size={14} />
              Mark all read
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ==================== FILTERS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin"
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={14} className="text-[#5a6e63]" />
        </div>
        {filters.map((f, i) => {
          const active = filter === f.id;
          return (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                text-xs font-bold whitespace-nowrap transition-all duration-300
                ${
                  active
                    ? "bg-gradient-to-br from-[#227736] to-[#1c6430] text-white shadow-lg shadow-[#227736]/30"
                    : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736] hover:bg-[#f8faf9]"
                }`}
            >
              {active && (
                <motion.span
                  layoutId="notifFilterActive"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] shadow-lg shadow-[#227736]/30 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center
                    ${
                      active
                        ? "bg-white/20 text-white"
                        : f.id === "unread"
                        ? "bg-[#f4a228] text-white"
                        : "bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6]"
                    }`}
                >
                  {f.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ==================== NOTIFICATIONS LIST ==================== */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-2xl border-2 border-dashed border-[#e2ebe6]
                bg-[#f8faf9] p-10 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto rounded-2xl
                  bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]
                  border border-[#c8e6d1] flex items-center justify-center mb-4
                  shadow-lg shadow-[#227736]/10"
              >
                <Bell size={28} className="text-[#227736]" />
              </motion.div>
              <h3 className="font-bold text-[#0f1d17]">No notifications</h3>
              <p className="text-sm text-[#5a6e63] mt-1">
                {filter === "all"
                  ? "You're all caught up!"
                  : "Nothing to show for this filter."}
              </p>
            </motion.div>
          ) : (
            filtered.map((n, i) => {
              const Icon = iconMap[n.type];
              const colors = colorMap[n.type];

              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.005 }}
                  className={`group relative rounded-2xl border overflow-hidden
                    transition-all duration-500
                    ${
                      n.read
                        ? "bg-white border-[#e2ebe6] hover:border-[#227736]/30 hover:shadow-2xl hover:shadow-[#227736]/10"
                        : "bg-gradient-to-br from-[#fdf7ef]/60 via-white to-[#f8faf9] border-[#f4a228]/40 hover:border-[#f4a228]/60 hover:shadow-2xl hover:shadow-[#f4a228]/20"
                    }`}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute left-0 top-0 bottom-0 w-1
                          bg-gradient-to-b from-[#f4a228] to-[#e08a10]
                          shadow-[0_0_12px_rgba(244,162,40,0.8)]"
                      />
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full
                        bg-[#f4a228] shadow-lg shadow-[#f4a228]/60">
                        <motion.span
                          animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-[#f4a228]"
                        />
                      </span>
                    </>
                  )}

                  {/* Shine sweep */}
                  <motion.div
                    initial={{ x: "-150%" }}
                    whileHover={{ x: "250%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r
                      from-transparent via-white/40 to-transparent
                      skew-x-12 pointer-events-none"
                  />

                  <div className="relative p-4 md:p-5 flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                      transition={{ duration: 0.5 }}
                      className="relative shrink-0"
                    >
                      <div
                        className="relative w-12 h-12 rounded-xl flex items-center justify-center
                          text-white shadow-lg transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                          boxShadow: `0 8px 20px -5px ${colors.from}50`,
                        }}
                      >
                        <Icon size={20} strokeWidth={2.2} />

                        {/* Pulse ring */}
                        <motion.span
                          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                          className="absolute inset-0 rounded-xl"
                          style={{ backgroundColor: colors.from }}
                        />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm md:text-base tracking-tight line-clamp-1
                              ${
                                n.read
                                  ? "font-semibold text-[#5a6e63]"
                                  : "font-extrabold text-[#0f1d17]"
                              }`}
                          >
                            {n.title}
                          </h3>
                        </div>

                        {/* New badge + actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!n.read && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1 text-[9px] font-bold
                                px-2 py-0.5 rounded-full
                                bg-gradient-to-br from-[#f4a228] to-[#e08a10]
                                text-white shadow-md shadow-[#f4a228]/40"
                            >
                              <Sparkles size={9} /> NEW
                            </motion.span>
                          )}

                          {/* Action buttons — visible on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {!n.read && (
                              <motion.button
                                whileHover={{ scale: 1.15, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => markAsRead(n.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center
                                  bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]
                                  hover:bg-[#227736] hover:text-white hover:border-[#227736]
                                  transition-all duration-300"
                                aria-label="Mark as read"
                              >
                                <Check size={13} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.15, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeNotification(n.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center
                                bg-[#fdf2e3] border border-[#f4a228]/30 text-[#f4a228]
                                hover:bg-[#dc3545] hover:text-white hover:border-[#dc3545]
                                transition-all duration-300"
                              aria-label="Delete"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <p
                        className={`text-xs md:text-sm mt-1.5 leading-relaxed line-clamp-2
                          ${n.read ? "text-[#5a6e63]" : "text-[#0f1d17]/80"}`}
                      >
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                        <div className="flex items-center gap-2 text-[11px] text-[#5a6e63]">
                          <Clock size={11} />
                          {formatDate(n.createdAt)}
                        </div>

                        <span
                          className="text-[9px] font-bold uppercase tracking-wider
                            px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: colors.light,
                            color: colors.from,
                            borderColor: `${colors.from}30`,
                          }}
                        >
                          {n.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line on hover */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left
                      scale-x-0 group-hover:scale-x-100 transition-transform duration-500
                      rounded-full bg-gradient-to-r from-transparent ${
                        colors.accent ? "via-[#f4a228]" : "via-[#227736]"
                      } to-transparent`}
                  />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ==================== FOOTER SUMMARY ==================== */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-[#5a6e63]
            py-3"
        >
          <CheckCircle2 size={12} className="text-[#227736]" />
          Showing {filtered.length} of {notifications.length} notifications
        </motion.div>
      )}
    </div>
  );
}

/* ---------- inline CheckCircle2 to avoid extra import ---------- */
function CheckCircle2({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}