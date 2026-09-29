"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bell, MessageSquare, Search, FileCheck, User,
  LogOut, GraduationCap, ChevronRight, Sparkles, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   NAVIGATION ITEMS
   ============================================================ */
const items = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/student/notices", label: "Notices", icon: Bell, badge: "3" },
  { href: "/student/notifications", label: "Notifications", icon: Bell, badge: "2" },
  { href: "/student/complaints", label: "Complaints", icon: MessageSquare, badge: null },
  { href: "/student/lost-found", label: "Lost & Found", icon: Search, badge: null },
  { href: "/student/claims", label: "My Claims", icon: FileCheck, badge: null },
  { href: "/student/profile", label: "Profile", icon: User, badge: null },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full min-h-full bg-gradient-to-b from-[#165127] via-[#1c6430] to-[#227736] text-white flex flex-col relative overflow-hidden">

      {/* ==================== BACKGROUND DECORATION ==================== */}
      {/* Mesh pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Orange glow — top-right */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-[#E67E22]/40 blur-3xl pointer-events-none"
      />

      {/* Green glow — bottom-left */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-[#28a745]/40 blur-3xl pointer-events-none"
      />

      {/* Decorative icon */}
      <GraduationCap
        size={200}
        strokeWidth={0.5}
        className="absolute -bottom-12 -right-8 text-white/[0.03] pointer-events-none select-none"
      />

      {/* ==================== HEADER / BRAND ==================== */}
      <div className="relative px-5 py-5 border-b border-white/10 shrink-0">
        <Link href="/student" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:border-[#E67E22]/60 transition-all duration-300"
          >
            <Image
              src="/logo.png"
              alt="University Logo"
              width={40}
              height={40}
              className="object-contain p-0.5"
            />

            {/* Orange corner dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E67E22] ring-2 ring-[#1c6430] z-10" />
          </motion.div>

          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight truncate group-hover:text-[#E67E22] transition-colors">
              CampusConnect
            </p>
            <p className="text-[10px] text-white/60 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse" />
              Student Panel
            </p>
          </div>
        </Link>
      </div>

      {/* ==================== NAVIGATION ==================== */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">

        <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
          Menu
        </p>

        {items.map((it, i) => {
          const active = pathname === it.href;
          const Icon = it.icon;

          return (
            <motion.div
              key={it.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={it.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group",
                    active
                      ? "bg-white text-[#227736] font-bold shadow-lg shadow-black/20"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {/* Active — orange left bar */}
                  {active && (
                    <motion.span
                      layoutId="studentActiveBar"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[#E67E22] to-[#D35400]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Icon container */}
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                      active
                        ? "bg-[#eaf6ee] text-[#227736]"
                        : "bg-white/5 text-white/70 group-hover:bg-[#E67E22]/20 group-hover:text-[#E67E22]"
                    )}
                  >
                    <Icon size={15} strokeWidth={2.2} />
                  </motion.div>

                  {/* Label */}
                  <span className="flex-1 truncate">{it.label}</span>

                  {/* Badge */}
                  {it.badge && (
                    <span
                      className={cn(
                        "shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                        active
                          ? "bg-[#E67E22] text-white"
                          : "bg-[#E67E22] text-white group-hover:scale-110 transition-transform"
                      )}
                    >
                      {it.badge}
                    </span>
                  )}

                  {/* Right chevron on active or hover */}
                  {!it.badge && (
                    <ChevronRight
                      size={14}
                      className={cn(
                        "shrink-0 transition-all duration-300",
                        active
                          ? "text-[#E67E22] opacity-100"
                          : "text-white/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                      )}
                    />
                  )}

                  {/* Soft right glow on hover */}
                  {!active && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#E67E22]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}

        {/* ==================== HELP CARD ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 mx-1 p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden relative"
        >
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#E67E22]/20 blur-xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 border border-[#E67E22]/30 flex items-center justify-center">
                <Sparkles size={11} className="text-[#E67E22]" />
              </div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                Quick Tip
              </p>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed">
              Long notices come with AI summaries — click any notice to see key points.
            </p>
          </div>
        </motion.div>
      </nav>

      {/* ==================== LOGOUT ==================== */}
      <div className="relative px-3 pb-5 pt-2 border-t border-white/10 shrink-0">
        <Link href="/login">
          <motion.div
            whileHover={{ x: 4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-[#dc3545] border border-white/10 hover:border-[#dc3545] transition-all duration-300 overflow-hidden"
          >
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
              <LogOut size={15} strokeWidth={2.2} />
            </div>

            <span className="relative">Logout</span>
          </motion.div>
        </Link>

        {/* Version tag */}
        <p className="mt-3 text-center text-[10px] text-white/40 font-mono">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}