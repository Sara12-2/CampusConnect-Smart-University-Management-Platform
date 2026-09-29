"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Topbar from "@/components/layout/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Close sidebar on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sidebarOpen]);

  return (
    <div className="relative flex bg-[#f8faf9] min-h-screen">

      {/* ==================== BACKGROUND DECORATION ==================== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #227736 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full 
          bg-[#E67E22] blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
          bg-[#227736] blur-3xl pointer-events-none"
      />

      {/* ==================== DESKTOP SIDEBAR — STICKY ==================== */}
      <div className="hidden md:block relative z-10 w-64 shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar />
        </div>
      </div>

      {/* ==================== MOBILE SIDEBAR OVERLAY ==================== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 
                bg-[#0f1d17]/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 
                w-72 max-w-[85vw] shadow-2xl shadow-black/30"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 -right-12 z-10 w-10 h-10 rounded-xl 
                  bg-white/95 backdrop-blur-sm border border-[#e2ebe6] 
                  flex items-center justify-center 
                  text-[#0f1d17] hover:text-[#E67E22] 
                  hover:border-[#E67E22]/40
                  shadow-lg transition-all duration-300"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </motion.button>

              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        <Topbar role="admin" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {children}
          </motion.div>
        </main>

        {/* ==================== FOOTER STRIP ==================== */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative px-6 md:px-8 py-4 
            border-t border-[#e2ebe6] 
            bg-white/70 backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 
            text-xs text-[#5a6e63]">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#28a745]"
              />
              <span className="font-medium">
                CampusConnect Admin · System operational
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">© {new Date().getFullYear()}</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#e2ebe6]" />
              <span className="font-mono">v1.0.0</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}