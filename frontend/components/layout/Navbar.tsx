"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/components/ui/Button";

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#e2ebe6] py-3"
          : "bg-white/70 backdrop-blur-sm border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ==================== BRAND LOGO ==================== */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#227736] to-[#165127] flex items-center justify-center text-white shadow-md shadow-[#227736]/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-1">
                Campus<span className="text-[#227736]">Connect</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
              </span>
              <span className="text-[10px] font-semibold text-[#5a6e63] tracking-wider uppercase -mt-0.5">
                Smart Platform
              </span>
            </div>
          </Link>

          {/* ==================== DESKTOP NAV LINKS ==================== */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#f4f7f5] px-3 py-1.5 rounded-full border border-[#e2ebe6]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#227736]"
                      : "text-[#5a6e63] hover:text-[#0f1d17] hover:bg-white/60"
                  }`}
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

          {/* ==================== CTA BUTTONS ==================== */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#5a6e63] hover:text-[#227736] px-3 py-2 rounded-lg hover:bg-[#eaf6ee] transition-colors flex items-center gap-1.5"
            >
              <LogIn size={15} />
              Sign In
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#227736] to-[#28a745] hover:from-[#1c6430] hover:to-[#227736] shadow-sm shadow-[#227736]/25 hover:shadow-md transition-all active:scale-98"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* ==================== MOBILE HAMBURGER ==================== */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 rounded-xl border border-[#e2ebe6] bg-white flex items-center justify-center text-[#0f1d17] hover:bg-[#f4f7f5] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE MENU DRAWER ==================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-[#e2ebe6] bg-white/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                        isActive
                          ? "bg-[#eaf6ee] text-[#227736] font-bold"
                          : "text-[#5a6e63] hover:bg-[#f4f7f5] hover:text-[#0f1d17]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#e2ebe6] flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-[#5a6e63] border border-[#e2ebe6] hover:bg-[#f4f7f5]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-[#227736] hover:bg-[#1c6430] shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}