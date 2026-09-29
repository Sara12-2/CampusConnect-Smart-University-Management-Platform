"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare,
  Clock, ShieldCheck, Globe, ArrowRight, Sparkles, AlertCircle,
  User, AtSign, Tag, FileText, Loader2, Building2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

/* ============================================================
   DATA
   ============================================================ */
const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "info@campusconnect.edu",
    href: "mailto:info@campusconnect.edu",
    accent: false,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+92 300 0000000",
    href: "tel:+923000000000",
    accent: true,
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "University Campus, Pakistan",
    href: "#",
    accent: false,
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri · 9:00 AM – 5:00 PM",
    href: "#",
    accent: true,
  },
];

const reasons = [
  { icon: MessageSquare, label: "General inquiry" },
  { icon: Building2, label: "Partnership" },
  { icon: ShieldCheck, label: "Report an issue" },
  { icon: Sparkles, label: "Feature request" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 900);
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen bg-white text-[#0f1d17] overflow-x-hidden">

        {/* ==================== HERO ==================== */}
        <section className="relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] 
          text-white overflow-hidden">

          {/* Mesh pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Animated orange glow */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.4, 0.25], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full 
              bg-[#E67E22]/40 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full 
              bg-[#28a745]/40 blur-3xl pointer-events-none"
          />

          {/* Floating sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              className={`absolute rounded-full ${
                i % 2 === 0
                  ? "bg-[#E67E22] shadow-lg shadow-[#E67E22]/50"
                  : "bg-white shadow-lg shadow-white/50"
              }`}
              style={{
                width: i % 3 === 0 ? 8 : 5,
                height: i % 3 === 0 ? 8 : 5,
                top: `${20 + i * 14}%`,
                left: `${15 + i * 16}%`,
              }}
            />
          ))}

          {/* Big decorative icon */}
          <MessageSquare
            size={200}
            strokeWidth={0.6}
            className="absolute -bottom-10 -right-4 text-white/[0.05] 
              pointer-events-none select-none"
          />

          <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full 
                  bg-white/10 backdrop-blur-sm border border-white/15 mb-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
                />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                  We're here to help
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold 
                  leading-[1.05] tracking-[-0.03em]"
              >
                Get in{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-white via-[#E67E22] to-white 
                    bg-clip-text text-transparent">
                    touch
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left 
                      bg-[#E67E22] rounded-full"
                  />
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-base md:text-lg text-white/85 leading-relaxed 
                  max-w-2xl mx-auto"
              >
                Have a question, feedback, or need support? Our team responds
                within 24 hours — usually much sooner.
              </motion.p>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap justify-center items-center 
                  gap-x-6 gap-y-3 text-xs md:text-sm"
              >
                {[
                  { icon: Clock, label: "24h response time" },
                  { icon: ShieldCheck, label: "Secure & private" },
                  { icon: Globe, label: "Available globally" },
                ].map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="flex items-center gap-2 text-white/85 cursor-default"
                    >
                      <Icon size={14} className="text-[#E67E22]" />
                      <span className="font-medium">{b.label}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== CONTACT INFO CARDS ==================== */}
        <section className="relative py-16 md:py-20 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                  bg-[#eaf6ee] border border-[#c8e6d1] mb-4 cursor-default"
              >
                <Sparkles size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                  Contact Information
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] 
                tracking-[-0.02em] leading-[1.1]">
                Multiple ways to reach us.
              </h2>
            </motion.div>

            {/* Info cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -6 }}
                    className={`group relative rounded-2xl border p-5 
                      transition-all duration-300 overflow-hidden
                      ${
                        c.accent
                          ? "border-[#E67E22]/30 hover:border-[#E67E22]/60 hover:shadow-xl hover:shadow-[#E67E22]/10"
                          : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xl hover:shadow-[#227736]/10"
                      } bg-white`}
                  >
                    {/* Corner accent */}
                    <div
                      className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                        ${c.accent ? "bg-[#E67E22]/10" : "bg-[#227736]/10"}`}
                    />

                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`relative w-11 h-11 rounded-xl flex items-center 
                        justify-center mb-4 shadow-md transition-all duration-300 
                        ${
                          c.accent
                            ? "bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white shadow-[#E67E22]/30"
                            : "bg-gradient-to-br from-[#227736] to-[#28a745] text-white shadow-[#227736]/30"
                        }`}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </motion.div>

                    <p className="relative text-[10px] font-bold text-[#5a6e63] 
                      uppercase tracking-wider mb-1">
                      {c.label}
                    </p>
                    <p className="relative font-bold text-[#0f1d17] text-sm 
                      group-hover:text-[#227736] transition-colors">
                      {c.value}
                    </p>

                    <span
                      className={`absolute bottom-0 left-5 right-5 h-0.5 origin-left 
                        scale-x-0 group-hover:scale-x-100 transition-transform duration-500 
                        rounded-full ${c.accent ? "bg-[#E67E22]" : "bg-[#227736]"}`}
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== FORM + SIDEBAR ==================== */}
        <section className="relative pb-20 md:pb-28 bg-[#f8faf9] border-y border-[#e2ebe6] 
          overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* ============ LEFT — Form ============ */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3 order-2 lg:order-1"
              >
                <div className="relative rounded-3xl bg-white border border-[#e2ebe6] 
                  p-6 md:p-8 overflow-hidden">

                  {/* Top gradient line */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 
                    bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22] rounded-full" />

                  {/* Header */}
                  <div className="relative mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                      bg-[#fdf2e3] border border-[#E67E22]/30 mb-3">
                      <Send size={11} className="text-[#E67E22]" />
                      <span className="text-[10px] font-bold tracking-[0.15em] 
                        uppercase text-[#B45A0B]">
                        Send a Message
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] 
                      tracking-tight">
                      Let's talk.
                    </h2>
                    <p className="mt-2 text-sm text-[#5a6e63]">
                      Fill the form and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  {/* Success message */}
                  <AnimatePresence>
                    {sent && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="mb-5 p-4 rounded-2xl bg-[#eaf6ee] 
                          border-2 border-[#c8e6d1] flex items-start gap-3"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-9 h-9 rounded-xl bg-[#227736] 
                            flex items-center justify-center shrink-0"
                        >
                          <CheckCircle2 size={18} className="text-white" />
                        </motion.div>
                        <div>
                          <p className="font-bold text-[#0f1d17] text-sm">
                            Message sent successfully
                          </p>
                          <p className="text-xs text-[#5a6e63] mt-0.5">
                            We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="Sara Manzoor"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        icon={<User size={14} />}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="sara@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        icon={<AtSign size={14} />}
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="How can we help you?"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      icon={<Tag size={14} />}
                      required
                    />

                    <Textarea
                      label="Your Message"
                      rows={5}
                      placeholder="Tell us more about your query..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ y: -3, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="group relative w-full inline-flex items-center 
                          justify-center gap-2 px-6 py-3.5 rounded-xl 
                          bg-[#227736] text-white text-sm font-bold 
                          shadow-lg shadow-[#227736]/25 
                          hover:bg-[#1c6430] hover:shadow-xl hover:shadow-[#227736]/30
                          disabled:opacity-60 disabled:cursor-not-allowed
                          transition-all duration-300 overflow-hidden"
                      >
                        {/* Shine sweep */}
                        <span className="absolute inset-0 -translate-x-full 
                          group-hover:translate-x-full transition-transform duration-700 
                          bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {sending ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 
                      text-[10px] text-[#5a6e63]">
                      <ShieldCheck size={11} className="text-[#227736]" />
                      Your information is safe and never shared.
                    </p>
                  </form>
                </div>
              </motion.div>

              {/* ============ RIGHT — Sidebar ============ */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2 order-1 lg:order-2 space-y-5"
              >
                {/* Why reach out */}
                <div className="relative rounded-2xl bg-white border border-[#e2ebe6] 
                  p-6 overflow-hidden">
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full 
                      bg-[#E67E22]/10 blur-2xl"
                  />

                  <div className="relative">
                    <h3 className="font-bold text-[#0f1d17] text-base mb-1 
                      flex items-center gap-2">
                      <MessageSquare size={15} className="text-[#227736]" />
                      Why reach out?
                    </h3>
                    <p className="text-xs text-[#5a6e63]">
                      Common reasons people contact us.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {reasons.map((r, i) => {
                        const Icon = r.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2.5 p-2.5 rounded-lg 
                              hover:bg-[#f8faf9] transition-all duration-300 cursor-default"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#eaf6ee] 
                              border border-[#c8e6d1] flex items-center justify-center 
                              shrink-0">
                              <Icon size={12} className="text-[#227736]" />
                            </div>
                            <span className="text-xs font-medium text-[#0f1d17]">
                              {r.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Response time card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl bg-gradient-to-br 
                    from-[#165127] via-[#1c6430] to-[#227736] 
                    p-6 text-white overflow-hidden"
                >
                  {/* Mesh */}
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Glow */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full 
                      bg-[#E67E22]/40 blur-3xl pointer-events-none"
                  />

                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur 
                      flex items-center justify-center border border-white/25 mb-4">
                      <Clock size={20} />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase 
                      text-white/70 mb-1">
                      Average Response
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight">
                      Under 24h
                    </p>
                    <p className="mt-2 text-xs text-white/75 leading-relaxed">
                      Our support team works Monday through Friday, 9 AM to
                      5 PM. Weekend messages get priority on Monday morning.
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/15 
                      flex items-center gap-2 text-xs">
                      <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
                      />
                      <span className="text-white/85 font-medium">
                        Support team is online
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Alternative contact */}
                <div className="relative rounded-2xl border border-[#E67E22]/30 
                  bg-[#fdf2e3]/40 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E67E22] 
                      flex items-center justify-center shrink-0 shadow-md 
                      shadow-[#E67E22]/25">
                      <AlertCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0f1d17]">
                        Need urgent help?
                      </p>
                      <p className="text-xs text-[#5a6e63] mt-1 leading-relaxed">
                        For time-sensitive issues, email us directly at{" "}
                        <a
                          href="mailto:urgent@campusconnect.edu"
                          className="font-bold text-[#E67E22] hover:underline"
                        >
                          urgent@campusconnect.edu
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br 
                from-[#165127] via-[#227736] to-[#1c6430] 
                p-10 md:p-14 text-center text-white overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2], x: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full 
                  bg-[#E67E22]/50 blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full 
                  bg-[#28a745]/40 blur-3xl pointer-events-none"
              />

              <div className="relative">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 mx-auto rounded-2xl bg-white/15 backdrop-blur 
                    flex items-center justify-center mb-5 border border-white/25"
                >
                  <Sparkles size={24} />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em]">
                  Ready to explore
                  <br />
                  <span className="text-[#E67E22]">CampusConnect?</span>
                </h2>

                <p className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto">
                  Join thousands of students and administrators already using
                  the platform.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <motion.a
                    href="/register"
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl 
                      bg-white text-[#227736] text-sm font-bold 
                      shadow-xl shadow-black/20 hover:bg-[#eaf6ee]
                      transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </motion.a>

                  <motion.a
                    href="/services"
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl 
                      bg-transparent text-white text-sm font-bold 
                      border-2 border-white/30 hover:bg-white/10 
                      hover:border-[#E67E22]/60
                      transition-all duration-300"
                  >
                    Explore Platform
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}