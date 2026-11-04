"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, MapPin, Calendar, X, Wallet, Key, Smartphone,
  Glasses, Backpack, Coffee, ArrowRight, CheckCircle2, Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

/* ============================================================
   MOCK DATA — 6 Items with real images
   ============================================================ */

const mockLostFound = [
  {
    id: "l1",
    type: "lost",
    title: "Black Leather Wallet",
    description:
      "Black leather wallet containing CNIC and student ID. Lost near the cafeteria during lunch break.",
    location: "Cafeteria, Block B",
    date: "2025-09-23",
    category: "wallet",
    reporterName: "Sara Manzoor",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "l2",
    type: "found",
    title: "Blue Water Bottle",
    description:
      "Found a blue steel water bottle in the library hall. Owner can contact the reception.",
    location: "Library Hall",
    date: "2025-09-24",
    category: "bottle",
    reporterName: "Abdullah",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "l3",
    type: "lost",
    title: "Silver Keychain",
    description:
      "Silver keychain with 4 keys and a small green pendant. Lost somewhere between Block A and cafeteria.",
    location: "Block A - Cafeteria route",
    date: "2025-09-25",
    category: "key",
    reporterName: "Sara Manzoor",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "l4",
    type: "found",
    title: "iPhone 13 (Blue)",
    description:
      "Found a blue iPhone 13 with a clear case. Screen lock is active. Owner must verify with ID.",
    location: "CS Lab 3",
    date: "2025-09-26",
    category: "phone",
    reporterName: "Ayesha Khan",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "l5",
    type: "lost",
    title: "Prescription Glasses",
    description:
      "Black frame prescription glasses in a brown case. Lost in the Physics Lab.",
    location: "Physics Lab",
    date: "2025-09-27",
    category: "glasses",
    reporterName: "Hassan Ali",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "l6",
    type: "found",
    title: "Leather Backpack",
    description:
      "Brown leather backpack with books and notebooks. Found near the main gate.",
    location: "Main Gate",
    date: "2025-09-28",
    category: "backpack",
    reporterName: "Fatima Zahra",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80",
  },
];

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

  const filtered = mockLostFound.filter((it) => {
    const matchTab = tab === "all" || it.type === tab;
    const q = query.toLowerCase();
    const matchQ =
      it.title.toLowerCase().includes(q) ||
      it.location.toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  const clearFilters = () => {
    setQuery("");
    setTab("all");
  };

  const hasFilters = query || tab !== "all";

  const lostCount = mockLostFound.filter((i) => i.type === "lost").length;
  const foundCount = mockLostFound.filter((i) => i.type === "found").length;

  const tabs = [
    { id: "all", label: "All Items", icon: Sparkles, count: mockLostFound.length },
    { id: "lost", label: "Lost", icon: Search, count: lostCount },
    { id: "found", label: "Found", icon: CheckCircle2, count: foundCount },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ==================== HERO ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127]
          p-6 md:p-8 text-white overflow-hidden
          shadow-xl shadow-[#227736]/20"
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full
            bg-[#f4a228]/40 blur-3xl pointer-events-none"
        />
        <Search
          size={180}
          strokeWidth={0.5}
          className="absolute -bottom-8 -right-4 text-white/[0.06]
            pointer-events-none select-none"
        />
        <motion.div
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            skew-x-12 pointer-events-none"
        />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
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
                Lost & Found
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
            >
              Reunite with your belongings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-white/75 max-w-md"
            >
              Report lost items or help return found ones to their rightful owners.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl
              bg-white text-[#227736] text-sm font-bold
              shadow-xl shadow-black/20 hover:bg-[#eaf6ee]
              transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
              transition-transform duration-700
              bg-gradient-to-r from-transparent via-[#f4a228]/30 to-transparent" />
            <Plus size={15} className="relative" />
            <span className="relative">Report Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ==================== SEARCH ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6e63] pointer-events-none"
          size={18}
        />
        <input
          placeholder="Search by item name or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 text-sm rounded-2xl bg-white
            border border-[#e2ebe6] text-[#0f1d17]
            placeholder:text-[#5a6e63]/60
            focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
            hover:border-[#227736]/30
            outline-none transition-all duration-300
            shadow-sm focus:shadow-md"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg
                flex items-center justify-center
                text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]
                transition-all duration-300"
              aria-label="Clear search"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ==================== TABS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id as any)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  text-xs font-bold transition-colors duration-300
                  ${
                    active
                      ? "text-white"
                      : "bg-white border border-[#e2ebe6] text-[#5a6e63] hover:border-[#227736]/40 hover:text-[#227736]"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430]
                      shadow-md shadow-[#227736]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={13} className="relative" />
                <span className="relative">{t.label}</span>
                <span
                  className={`relative text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                    ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#f8faf9] text-[#5a6e63] border border-[#e2ebe6]"
                    }`}
                >
                  {t.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {hasFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
              text-xs font-bold text-[#dc3545]
              bg-[#fdeaea] border border-[#dc3545]/20
              hover:bg-[#dc3545] hover:text-white hover:border-[#dc3545]
              transition-all duration-300"
          >
            <X size={12} />
            Clear
          </motion.button>
        )}
      </motion.div>

      {/* ==================== RESULTS ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-[#5a6e63]"
      >
        Showing{" "}
        <span className="font-bold text-[#0f1d17]">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "item" : "items"}
      </motion.div>

      {/* ==================== GRID ==================== */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl border-2 border-dashed border-[#e2ebe6]
            bg-[#f8faf9] p-12 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto rounded-2xl
              bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9]
              border border-[#c8e6d1] flex items-center justify-center mb-5
              shadow-lg shadow-[#227736]/10"
          >
            <Search size={32} className="text-[#227736]" />
          </motion.div>
          <h3 className="font-bold text-[#0f1d17] text-lg">No items found</h3>
          <p className="text-sm text-[#5a6e63] mt-1 max-w-sm mx-auto">
            Try adjusting your search or filters.
          </p>
          {hasFilters && (
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-[#227736] text-white text-xs font-bold
                shadow-md shadow-[#227736]/20 hover:bg-[#1c6430]
                transition-all duration-300"
            >
              <X size={12} />
              Clear all filters
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((it, i) => {
              const isLost = it.type === "lost";
              const FallbackIcon = categoryIcon[it.category] || Search;

              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/student/lost-found/${it.id}`}>
                    <motion.div
                      className={`group relative h-full rounded-2xl bg-white overflow-hidden
                        border transition-all duration-500
                        ${
                          isLost
                            ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.35)]"
                            : "border-[#227736]/30 hover:border-[#227736]/60 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.35)]"
                        }`}
                    >
                      {/* Top accent */}
                      <div
                        className={`h-1 ${
                          isLost
                            ? "bg-gradient-to-r from-[#f4a228] via-[#e08a10] to-[#f4a228]"
                            : "bg-gradient-to-r from-[#227736] via-[#28a745] to-[#227736]"
                        }`}
                      />

                      {/* ============ IMAGE AREA ============ */}
                      <div className="relative h-48 overflow-hidden bg-[#f8faf9]">
                        {/* Image */}
                        <motion.img
                          src={it.image}
                          alt={it.title}
                          loading="lazy"
                          className="w-full h-full object-cover
                            transition-transform duration-700
                            group-hover:scale-110"
                          onError={(e) => {
                            // Fallback: hide broken image
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />

                        {/* Fallback gradient (if image fails) */}
                        <div
                          className={`absolute inset-0 -z-10 flex items-center justify-center
                            ${
                              isLost
                                ? "bg-gradient-to-br from-[#fdf7ef] via-[#fbe4c7] to-[#f4a228]/40"
                                : "bg-gradient-to-br from-[#eaf6ee] via-[#d4ead9] to-[#227736]/40"
                            }`}
                        >
                          <FallbackIcon
                            size={80}
                            strokeWidth={1}
                            className={isLost ? "text-[#f4a228]/40" : "text-[#227736]/40"}
                          />
                        </div>

                        {/* Dark gradient overlay (bottom) for readability */}
                        <div className="absolute inset-x-0 bottom-0 h-20
                          bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Shine sweep */}
                        <motion.div
                          initial={{ x: "-150%" }}
                          whileHover={{ x: "250%" }}
                          transition={{ duration: 0.9, ease: "easeInOut" }}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r
                            from-transparent via-white/30 to-transparent
                            skew-x-12 pointer-events-none z-10"
                        />

                        {/* Type badge (top-left) */}
                        <motion.div
                          initial={{ scale: 0, x: -10 }}
                          animate={{ scale: 1, x: 0 }}
                          transition={{ type: "spring", delay: 0.2 + i * 0.05 }}
                          className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5
                            text-[10px] font-extrabold uppercase tracking-wider
                            px-2.5 py-1 rounded-full text-white
                            backdrop-blur-md shadow-lg
                            ${
                              isLost
                                ? "bg-[#f4a228]/95 shadow-[#f4a228]/40"
                                : "bg-[#227736]/95 shadow-[#227736]/40"
                            }`}
                        >
                          {isLost ? (
                            <>
                              <Search size={10} /> Lost
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={10} /> Found
                            </>
                          )}
                        </motion.div>

                        {/* Status badge (top-right) */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold
                            px-2 py-1 rounded-full bg-white/90 backdrop-blur-md
                            text-[#5a6e63] border border-white/60 shadow-md">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLost ? "bg-[#f4a228]" : "bg-[#58b277]"
                              } animate-pulse`}
                            />
                            Open
                          </span>
                        </div>

                        {/* Location (bottom-left, on image) */}
                        <div className="absolute bottom-3 left-3 right-3 z-10
                          flex items-center gap-1.5 text-[10px] font-semibold text-white">
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate">{it.location}</span>
                        </div>
                      </div>

                      {/* ============ CONTENT ============ */}
                      <div className="relative p-5">
                        <h3 className="font-extrabold text-[#0f1d17] text-base
                          group-hover:text-[#227736] transition-colors
                          line-clamp-1 tracking-tight">
                          {it.title}
                        </h3>

                        <p className="text-xs text-[#5a6e63] leading-relaxed mt-2 line-clamp-2">
                          {it.description}
                        </p>

                        {/* Meta + arrow */}
                        <div className="mt-4 pt-4 border-t border-[#f0f4f2]
                          flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#5a6e63]">
                            <Calendar size={11} className="text-[#f4a228]" />
                            <span className="font-medium">{formatDate(it.date)}</span>
                          </div>

                          <motion.div
                            whileHover={{ x: 3 }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center
                              transition-all duration-300
                              ${
                                isLost
                                  ? "bg-[#fdf7ef] text-[#f4a228] group-hover:bg-[#f4a228] group-hover:text-white"
                                  : "bg-[#eaf6ee] text-[#227736] group-hover:bg-[#227736] group-hover:text-white"
                              }`}
                          >
                            <ArrowRight size={14} />
                          </motion.div>
                        </div>

                        {/* Reporter */}
                        <div className="mt-3 pt-3 border-t border-dashed border-[#f0f4f2]
                          flex items-center gap-2 text-[10px] text-[#5a6e63]">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#227736] to-[#28a745]
                            flex items-center justify-center text-white text-[8px] font-bold">
                            {it.reporterName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span>
                            Reported by{" "}
                            <span className="font-bold text-[#0f1d17]">{it.reporterName}</span>
                          </span>
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

      {/* ==================== FOOTER SUMMARY ==================== */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-[#5a6e63] py-3"
        >
          <CheckCircle2 size={12} className="text-[#227736]" />
          Showing {filtered.length} of {mockLostFound.length} items
        </motion.div>
      )}

      {/* ==================== MODAL ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
              flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh]
                overflow-hidden shadow-2xl"
            >
              <div className="relative bg-gradient-to-br from-[#227736] to-[#1c6430] p-6 text-white">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md
                      flex items-center justify-center border border-white/25">
                      <Plus size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight">Report Item</h2>
                      <p className="text-[11px] text-white/70 mt-0.5">
                        Help us reunite items with their owners
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      bg-white/15 hover:bg-white/25 backdrop-blur-md
                      transition-all duration-300"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
                className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider
                    text-[#5a6e63] mb-2">
                    What would you like to report?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "lost", label: "I Lost", icon: Search, accent: true },
                      { value: "found", label: "I Found", icon: CheckCircle2, accent: false },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <label
                          key={t.value}
                          className={`group relative cursor-pointer rounded-xl border-2 p-4
                            transition-all duration-300 hover:scale-[1.02]
                            ${
                              t.accent
                                ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:bg-[#fdf7ef]"
                                : "border-[#227736]/30 hover:border-[#227736]/60 hover:bg-[#eaf6ee]"
                            }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={t.value}
                            defaultChecked={t.value === "lost"}
                            className="sr-only peer"
                          />
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center
                                ${
                                  t.accent
                                    ? "bg-[#fdf7ef] border border-[#f4a228]/30 text-[#f4a228]"
                                    : "bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736]"
                                }`}
                            >
                              <Icon size={18} />
                            </div>
                            <span className="text-xs font-bold text-[#0f1d17]">
                              {t.label}
                            </span>
                          </div>
                          <div
                            className={`absolute inset-0 rounded-xl border-2 pointer-events-none
                              opacity-0 peer-checked:opacity-100 transition-opacity
                              ${
                                t.accent
                                  ? "border-[#f4a228] bg-[#fdf7ef]/50"
                                  : "border-[#227736] bg-[#eaf6ee]/50"
                              }`}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Image upload mock */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider
                    text-[#5a6e63] mb-1.5">
                    Item Photo
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-[#e2ebe6]
                    hover:border-[#227736]/40 transition-all duration-300
                    p-6 text-center cursor-pointer bg-[#f8faf9]
                    hover:bg-[#eaf6ee]/30">
                    <div className="w-12 h-12 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1]
                      flex items-center justify-center mx-auto mb-2">
                      <ImageIcon size={20} className="text-[#227736]" />
                    </div>
                    <p className="text-xs font-bold text-[#0f1d17]">
                      Click to upload
                    </p>
                    <p className="text-[10px] text-[#5a6e63] mt-0.5">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider
                    text-[#5a6e63] mb-1.5">
                    Item Name
                  </label>
                  <input
                    placeholder="e.g. Black leather wallet"
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm
                      border border-[#e2ebe6] bg-white text-[#0f1d17]
                      placeholder:text-[#5a6e63]/60
                      focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                      outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider
                    text-[#5a6e63] mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the item with as much detail as possible..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm resize-none
                      border border-[#e2ebe6] bg-white text-[#0f1d17]
                      placeholder:text-[#5a6e63]/60
                      focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                      outline-none transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider
                      text-[#5a6e63] mb-1.5">
                      Location
                    </label>
                    <input
                      placeholder="e.g. Library Hall"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm
                        border border-[#e2ebe6] bg-white text-[#0f1d17]
                        placeholder:text-[#5a6e63]/60
                        focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                        outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider
                      text-[#5a6e63] mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm
                        border border-[#e2ebe6] bg-white text-[#0f1d17]
                        focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
                        outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold
                      bg-white border border-[#e2ebe6] text-[#5a6e63]
                      hover:border-[#dc3545]/40 hover:text-[#dc3545] hover:bg-[#fdeaea]
                      transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-xl text-sm font-bold
                      bg-gradient-to-br from-[#227736] to-[#1c6430] text-white
                      shadow-lg shadow-[#227736]/30
                      hover:shadow-xl hover:shadow-[#227736]/40
                      transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700
                      bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <span className="relative">Submit Report</span>
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