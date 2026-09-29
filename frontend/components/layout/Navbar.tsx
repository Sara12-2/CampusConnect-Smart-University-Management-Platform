"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-white/95 border-b border-[#e2ebe6] shadow-md shadow-[#227736]/5"
          : "bg-white/85 backdrop-blur-md border-b border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">

        {/* ==================== LOGO ==================== */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-11 h-11 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-[#e2ebe6] shadow-md shadow-[#227736]/10 group-hover:border-[#E67E22]/40 group-hover:shadow-lg group-hover:shadow-[#E67E22]/15 transition-all duration-300"
          >
            {/* University Logo */}
            <Image
              src="/logo.png"
              alt="University Logo"
              width={44}
              height={44}
              className="object-contain p-0.5"
              priority
            />
          </motion.div>

          <span className="text-[#0f1d17] tracking-tight group-hover:text-[#227736] transition-colors duration-300">
            Campus
            <span className="text-[#227736] group-hover:text-[#E67E22] transition-colors duration-300">
              Connect
            </span>
          </span>
        </Link>

        {/* ==================== DESKTOP LINKS ==================== */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={cn(
                    "relative block px-4 py-2 rounded-lg transition-all duration-300",
                    isActive
                      ? "text-[#227736] font-bold"
                      : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                  )}
                >
                  <span className="relative z-10">{l.label}</span>

                  {/* Orange underline — grows from center on hover, stays visible on active */}
                  <motion.span
                    initial={false}
                    className="absolute bottom-0.5 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-[#E67E22] to-[#D35400]"
                    animate={
                      isActive
                        ? { scaleX: 1, opacity: 1 }
                        : { scaleX: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "center" }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ==================== DESKTOP ACTIONS ==================== */}
        <div className="hidden md:flex items-center gap-3">
          <Button href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button href="/register" variant="primary" size="sm">
              Get Started
              <Sparkles size={13} className="opacity-80" />
            </Button>
          </motion.div>
        </div>

        {/* ==================== MOBILE TOGGLE ==================== */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-lg hover:bg-[#eaf6ee] text-[#227736] transition-colors duration-300"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* ==================== MOBILE MENU ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-[#e2ebe6] bg-white"
          >
            <div className="px-6 py-4 space-y-1.5">
              {links.map((l, i) => {
                const isActive = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center justify-between py-2.5 px-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden",
                        isActive
                          ? "text-[#227736] bg-[#eaf6ee] font-bold"
                          : "text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee]"
                      )}
                    >
                      {/* Left orange accent bar on active */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-[#E67E22] to-[#D35400]" />
                      )}

                      <span>{l.label}</span>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="flex gap-2 pt-3 border-t border-[#e2ebe6]">
                <Button href="/login" variant="outline" size="sm" className="flex-1">
                  Login
                </Button>
                <Button href="/register" variant="primary" size="sm" className="flex-1">
                  Register
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}