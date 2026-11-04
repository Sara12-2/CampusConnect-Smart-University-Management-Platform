"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md shadow-[#227736]/5 border-b border-[#e2ebe6] py-2.5"
          : "bg-white/80 backdrop-blur-md border-b border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* ==================== BRAND ==================== */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white
                flex items-center justify-center
                border border-[#e2ebe6]
                shadow-sm shadow-[#227736]/10
                group-hover:border-[#E67E22]/50
                group-hover:shadow-lg group-hover:shadow-[#E67E22]/20
                transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="University Logo"
                width={44}
                height={44}
                className="object-contain p-0.5 relative z-10"
                priority
              />

              {/* Subtle shine on hover */}
              <motion.div
                initial={{ x: "-150%" }}
                whileHover={{ x: "150%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none z-20"
              />
            </motion.div>

            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-extrabold text-[#0f1d17] tracking-tight
                flex items-center gap-1 leading-none">
                Campus<span className="text-[#227736] group-hover:text-[#E67E22] transition-colors">Connect</span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#E67E22] mt-0.5"
                />
              </span>
              <span className="text-[9px] font-semibold text-[#5a6e63]
                tracking-[0.12em] uppercase mt-0.5 hidden sm:block">
                Smart Platform
              </span>
            </div>
          </Link>

          {/* ==================== DESKTOP NAV ==================== */}
          <nav className="hidden md:flex items-center gap-0.5 bg-[#f8faf9]
            px-2 py-1.5 rounded-full border border-[#e2ebe6]
            shadow-sm shadow-[#227736]/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                    isActive
                      ? "text-[#227736]"
                      : "text-[#5a6e63] hover:text-[#0f1d17] hover:bg-white/70"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-[#e2ebe6]"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ==================== DESKTOP CTA ==================== */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="group text-sm font-semibold text-[#5a6e63] hover:text-[#227736]
                px-3 py-2 rounded-lg hover:bg-[#eaf6ee] transition-colors
                flex items-center gap-1.5"
            >
              <LogIn size={14} className="group-hover:scale-110 transition-transform" />
              Sign In
            </Link>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                href="/register"
                className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                  text-sm font-bold text-white overflow-hidden group
                  bg-gradient-to-r from-[#227736] to-[#28a745]
                  hover:from-[#1c6430] hover:to-[#227736]
                  shadow-md shadow-[#227736]/30 hover:shadow-lg hover:shadow-[#227736]/40
                  transition-all duration-300"
              >
                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                  transition-transform duration-700
                  bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative">Get Started</span>
                <ArrowRight
                  size={14}
                  className="relative group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </motion.div>
          </div>

          {/* ==================== MOBILE TOGGLE ==================== */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-xl border border-[#e2ebe6] bg-white
              flex items-center justify-center text-[#0f1d17]
              hover:bg-[#f8faf9] hover:border-[#227736]/30
              transition-all duration-200 shrink-0"
            aria-label="Toggle Navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-[#e2ebe6] bg-white/95 backdrop-blur-lg
              overflow-hidden shadow-lg shadow-[#227736]/5"
          >
            <div className="px-5 py-4 space-y-3">
              {/* Nav links */}
              <div className="space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "relative block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-[#eaf6ee] text-[#227736] font-bold"
                            : "text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#0f1d17]"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="mobileActiveBar"
                            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full
                              bg-gradient-to-b from-[#E67E22] to-[#D35400]"
                          />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div className="pt-3 border-t border-[#e2ebe6] flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-1.5
                    py-2.5 rounded-xl text-sm font-semibold
                    text-[#5a6e63] border border-[#e2ebe6] hover:bg-[#f8faf9]
                    transition-colors"
                >
                  <LogIn size={14} />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-1.5
                    py-2.5 rounded-xl text-sm font-bold
                    text-white bg-gradient-to-r from-[#227736] to-[#28a745]
                    hover:from-[#1c6430] hover:to-[#227736]
                    shadow-sm shadow-[#227736]/25 transition-all"
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}