"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <GraduationCap size={20} />
          </div>
          <span>Campus<span className="text-orange-500">Connect</span></span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative hover:text-orange-600 transition-colors
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5
                  after:bg-gradient-to-r after:from-orange-500 after:to-green-500
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button href="/login" variant="ghost" size="sm">Login</Button>
          <Button href="/register" variant="primary" size="sm">Get Started</Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-6 py-4 space-y-3">
              {links.map((l) => (
                <Link
                  key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="block py-2 font-medium text-slate-700 hover:text-orange-600"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button href="/login" variant="outline" size="sm" className="flex-1">Login</Button>
                <Button href="/register" variant="primary" size="sm" className="flex-1">Register</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}