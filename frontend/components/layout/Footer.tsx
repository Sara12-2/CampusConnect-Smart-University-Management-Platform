"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Heart, ArrowUpRight, Sparkles,
  Bell, MessageSquare, Search, ShieldCheck, Globe,
  Facebook, Twitter, Instagram, Linkedin,
} from "lucide-react";

/* ============================================================
   DATA
   ============================================================ */
const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const servicesList = [
  { icon: Bell, label: "Notice Board" },
  { icon: MessageSquare, label: "Complaints" },
  { icon: Search, label: "Lost & Found" },
  { icon: Sparkles, label: "AI Summaries" },
];

const contactInfo = [
  { icon: Mail, value: "info@campusconnect.edu", href: "mailto:info@campusconnect.edu" },
  { icon: Phone, value: "+92 300 0000000", href: "tel:+923000000000" },
  { icon: MapPin, value: "University Campus", href: "#" },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#1c6430] to-[#165127] text-white mt-16 overflow-hidden">

      {/* ==================== MESH PATTERN ==================== */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ==================== ANIMATED GLOWS ==================== */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full 
          bg-[#E67E22]/30 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full 
          bg-[#28a745]/30 blur-3xl pointer-events-none"
      />

      {/* ==================== DECORATIVE ICON ==================== */}
      <Sparkles
        size={200}
        strokeWidth={0.5}
        className="absolute -bottom-12 -right-4 text-white/[0.03] 
          pointer-events-none select-none"
      />

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-16 
        grid md:grid-cols-4 gap-10">

        {/* ---------- BRAND ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-lg mb-5 group"
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-11 h-11 rounded-xl overflow-hidden 
                bg-white/10 backdrop-blur border border-white/20 
                flex items-center justify-center 
                group-hover:border-[#E67E22]/60 
                transition-all duration-300"
            >
              <Image
                src="/logo.png"
                alt="University Logo"
                width={44}
                height={44}
                className="object-contain p-0.5"
              />

              {/* Orange corner dot with pulse */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full 
                bg-[#E67E22] ring-2 ring-[#1c6430] z-10">
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-[#E67E22]"
                />
              </span>
            </motion.div>

            <span className="tracking-tight group-hover:text-[#E67E22] transition-colors">
              CampusConnect
            </span>
          </Link>

          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Smart University Management & Student Services Platform —
            built for modern universities.
          </p>

          {/* Social buttons */}
          <div className="mt-6 flex gap-2">
            {socials.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur 
                    border border-white/15 
                    hover:bg-[#E67E22] hover:border-[#E67E22] 
                    hover:text-white hover:shadow-lg hover:shadow-[#E67E22]/40
                    transition-all duration-300 
                    flex items-center justify-center 
                    text-white/80"
                >
                  <Icon size={15} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* ---------- QUICK LINKS ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="font-bold text-white mb-5 flex items-center gap-2 text-base">
            Quick Links
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
          </h4>

          <ul className="space-y-3 text-sm">
            {quickLinks.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 
                    text-white/70 hover:text-white 
                    transition-all duration-300"
                >
                  {/* Animated dash */}
                  <span className="w-0 h-px bg-[#E67E22] 
                    group-hover:w-4 transition-all duration-300" />
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {l.label}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 -translate-x-2 
                      group-hover:opacity-100 group-hover:translate-x-0 
                      transition-all duration-300 text-[#E67E22]"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ---------- SERVICES ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-bold text-white mb-5 flex items-center gap-2 text-base">
            Services
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
          </h4>

          <ul className="space-y-3 text-sm">
            {servicesList.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-2.5 
                    text-white/70 hover:text-white 
                    transition-all duration-300 cursor-default"
                >
                  <div className="w-6 h-6 rounded-md bg-white/10 backdrop-blur 
                    border border-white/15 
                    group-hover:bg-[#E67E22] group-hover:border-[#E67E22] 
                    flex items-center justify-center shrink-0
                    transition-all duration-300">
                    <Icon size={11} className="text-white/70 group-hover:text-white 
                      transition-colors" />
                  </div>
                  <span>{s.label}</span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* ---------- CONTACT ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="font-bold text-white mb-5 flex items-center gap-2 text-base">
            Contact
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
          </h4>

          <ul className="space-y-3 text-sm">
            {contactInfo.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <a
                    href={c.href}
                    className="group flex items-center gap-3 
                      text-white/70 hover:text-white 
                      transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur 
                      border border-white/15 shrink-0
                      group-hover:bg-[#E67E22] group-hover:border-[#E67E22] 
                      group-hover:scale-110
                      flex items-center justify-center 
                      transition-all duration-300">
                      <Icon size={13} className="group-hover:text-white 
                        transition-colors" />
                    </div>
                    <span className="group-hover:translate-x-0.5 
                      transition-transform">
                      {c.value}
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </ul>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-3 rounded-xl bg-white/5 backdrop-blur 
              border border-white/10 flex items-start gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E67E22]/20 
              border border-[#E67E22]/30 flex items-center justify-center 
              shrink-0">
              <ShieldCheck size={13} className="text-[#E67E22]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Secure & Reliable
              </p>
              <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">
                Your data is encrypted and safe
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ==================== BOTTOM BAR ==================== */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 
          flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/60 flex items-center gap-1.5 
              flex-wrap justify-center"
          >
            © {new Date().getFullYear()} CampusConnect. Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={11} className="text-[#E67E22] fill-[#E67E22]" />
            </motion.span>
            for universities.
          </motion.p>

          {/* Right links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-xs text-white/60"
          >
            <Link
              href="/about"
              className="hover:text-[#E67E22] transition-colors duration-300"
            >
              Privacy
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link
              href="/contact"
              className="hover:text-[#E67E22] transition-colors duration-300"
            >
              Terms
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />

            {/* Back to top */}
            <motion.a
              href="#"
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg 
                bg-white/5 hover:bg-[#E67E22] 
                border border-white/10 hover:border-[#E67E22]
                transition-all duration-300 font-medium"
            >
              <Globe size={10} />
              Back to top
            </motion.a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}