"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bell, MessageSquare, Search, Check, ArrowRight, Sparkles,
  X, Brain, ShieldCheck, Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ============================================================
   DATA
   ============================================================ */

const services = [
  {
    title: "Smart Notices",
    desc: "Get the latest university notices with AI summaries.",
    icon: Bell,
    color: "green",
    linkText: "Explore Notices",
    href: "/login?redirect=/student/notices",
    features: [
      "AI-powered summaries",
      "Filter by category",
      "Instant notifications",
    ],
  },
  {
    title: "Complaint Management",
    desc: "Register and track complaints with real-time updates.",
    icon: MessageSquare,
    color: "orange",
    linkText: "Explore Complaints",
    href: "/login?redirect=/student/complaints",
    features: [
      "Track progress live",
      "Get instant responses",
      "Transparent process",
    ],
  },
  {
    title: "Lost & Found",
    desc: "Report or find lost items securely and easily.",
    icon: Search,
    color: "green",
    linkText: "Explore Lost & Found",
    href: "/login?redirect=/student/lost-found",
    features: [
      "Post lost/found items",
      "Browse listings",
      "Get notified",
    ],
  },
];

const comparisons = [
  {
    icon: Brain,
    oldWay: "Reading long PDF notices manually",
    newWay: "AI summarizes key points in seconds",
  },
  {
    icon: ShieldCheck,
    oldWay: "Complaints lost in WhatsApp groups",
    newWay: "Tracked with real-time status updates",
  },
  {
    icon: Zap,
    oldWay: "Lost items posted on random walls",
    newWay: "Verified claims in one searchable place",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function ServicesPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9] text-[#0f1d17] overflow-x-hidden selection:bg-[#E67E22] selection:text-white pb-24">
        {/* ==================== HEADER ==================== */}
        <section className="pt-28 pb-10 text-center max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              <Sparkles size={14} /> Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f1d17]">
              Everything You Need <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#227736] to-[#28a745]">
                In One Place
              </span>
            </h1>
          </motion.div>
        </section>

        {/* ==================== 3D GLASS CARDS ==================== */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((s, i) => {
              const isGreen = s.color === "green";

              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
                  className="group relative rounded-[2rem] bg-white border border-[#e2ebe6] p-7 lg:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Subtle Background Glow */}
                  <div
                    className={cn(
                      "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity",
                      isGreen ? "bg-[#227736]" : "bg-[#E67E22]"
                    )}
                  />

                  {/* 3D Icon Container */}
                  <div className="relative mb-5">
                    <div
                      className={cn(
                        "w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-transform duration-300 relative z-10",
                        isGreen
                          ? "bg-gradient-to-br from-[#227736] to-[#1c6430] shadow-[#227736]/30"
                          : "bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[#E67E22]/30"
                      )}
                    >
                      <div className="absolute inset-0 rounded-2xl border border-white/20 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                      <s.icon size={32} className="text-white relative z-10" />
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full border-[3px] border-white opacity-50 z-0",
                        isGreen ? "bg-[#28a745]" : "bg-[#f4a228]"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-extrabold text-[#0f1d17] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#5a6e63] leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {s.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                            isGreen
                              ? "bg-[#227736] text-white"
                              : "bg-[#E67E22] text-white"
                          )}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-semibold text-[#0f1d17]">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <Link
                    href={s.href}
                    aria-label={s.linkText}
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-bold mt-auto group/link w-fit transition-colors",
                      isGreen ? "text-[#227736]" : "text-[#E67E22]"
                    )}
                  >
                    {s.linkText}
                    <ArrowRight
                      size={16}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ==================== WHY CAMPUSCONNECT ==================== */}
        <section className="max-w-6xl mx-auto px-6 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E67E22]/10 border border-[#E67E22]/20 text-[#E67E22] text-xs font-bold tracking-widest uppercase mb-4">
              <Brain size={14} /> Why CampusConnect
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17]">
              Smarter Than the Old Way
            </h2>
            <p className="text-sm text-[#5a6e63] mt-3">
              Built to replace fragmented WhatsApp groups and manual paperwork
              with one intelligent platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-[#e2ebe6] shadow-sm hover:shadow-md hover:border-[#227736]/30 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#eaf6ee] text-[#227736] flex items-center justify-center mb-4">
                  <c.icon size={20} />
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <X size={14} className="text-red-400 shrink-0 mt-1" />
                  <p className="text-xs text-[#5a6e63] line-through">
                    {c.oldWay}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check
                    size={14}
                    className="text-[#227736] shrink-0 mt-1"
                    strokeWidth={3}
                  />
                  <p className="text-sm font-bold text-[#0f1d17]">
                    {c.newWay}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="mt-20 md:mt-24 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#165127] to-[#227736] text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E67E22]/20 rounded-full blur-3xl" />
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 relative z-10">
              Ready to explore the platform?
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-8 relative z-10 max-w-lg mx-auto">
              Create your free account today and experience the smarter way to
              manage your campus life.
            </p>
            <Button
              href="/register"
              size="lg"
              className="!bg-white !text-[#0f1d17] hover:!bg-[#eaf6ee] shadow-xl border-none font-bold relative z-10"
            >
              Get Started Now
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}