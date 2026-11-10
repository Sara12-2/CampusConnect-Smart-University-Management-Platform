"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2,
  ArrowRight, MessageSquare, Users, HelpCircle, ChevronDown, Rocket, ShieldCheck,
  Loader2, AlertCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

const contactCards = [
  { icon: Mail, title: "Email Us", value: "info@campusconnect.edu", color: "green" },
  { icon: Phone, title: "Call Us", value: "+92 300 1234567", color: "orange" },
  { icon: MapPin, title: "Visit Us", value: "University Campus, Layyah", color: "green" },
  { icon: Clock, title: "Office Hours", value: "Mon – Fri : 9 AM – 5 PM", color: "orange" },
];

const otherWays = [
  { icon: Users, title: "Join Our Community", desc: "Be a part of our growing community." },
  { icon: MessageSquare, title: "Follow Us on Linkedin", desc: "Stay updated with the latest news." },
  { icon: HelpCircle, title: "Support Center", desc: "Find answers to common questions." },
];

const subjects = [
  "General Inquiry",
  "Technical Support",
  "Feedback"
];

/* ============================================================
   TYPES
   ============================================================ */

type FormStatus = "idle" | "submitting" | "success" | "error";

/* ============================================================
   PAGE
   ============================================================ */

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Select a subject");

  /* ============================================================
     SUBMIT HANDLER — Backend Ready
     ============================================================ */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: selectedSubject === "Select a subject" ? "" : selectedSubject,
      message: String(formData.get("message") || "").trim(),
    };

    // Client-side validation
    if (!payload.name || !payload.email || !payload.message) {
      setErrorMsg("Please fill in all required fields.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      // ============================================================
      // TODO: Uncomment when FastAPI backend is ready
      // ============================================================
      //
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (!res.ok) {
      //   throw new Error("Failed to send message. Please try again.");
      // }
      //
      // ============================================================

      // Temporary: simulate API call (remove when backend ready)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("📨 Contact form payload (backend not connected yet):", payload);

      setStatus("success");
      formRef.current?.reset();
      setSelectedSubject("Select a subject");

      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafcfb] text-[#0f1d17] overflow-x-hidden pt-28 pb-20 selection:bg-[#E67E22] selection:text-white">
        
        <div className="max-w-7xl mx-auto px-6">
          
          {/* ==================== HERO SECTION ==================== */}
          <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 mb-24 mt-10">
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] text-[#227736] text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
                <MessageSquare size={12} /> Get In Touch
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0f1d17] leading-[1.1]">
                Contact <span className="text-[#E67E22]">Us</span>
              </h1>
              <p className="mt-6 text-lg text-[#5a6e63] leading-relaxed max-w-lg mx-auto lg:mx-0">
                {`Have questions, suggestions, or need support? We're here to help — reach out to us anytime!`}
              </p>
              <div className="w-20 h-1.5 bg-[#E67E22] rounded-full mt-8 mx-auto lg:mx-0" />
            </div>

            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center perspective-1000">
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-md bg-white p-3 rounded-[2rem] shadow-2xl border border-[#e2ebe6]"
                style={{ transform: "rotateY(-5deg) rotateX(5deg)", transformStyle: "preserve-3d" }}
              >
                <div className="relative w-full h-[280px] md:h-[320px] rounded-[1.5rem] overflow-hidden bg-[#e2ebe6]">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="University Map" 
                    className="w-full h-full object-cover opacity-90 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-[#227736]/10 mix-blend-overlay" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                     <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="bg-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-[#e2ebe6]">
                       <MapPin size={16} className="text-[#E67E22]" />
                       <span className="text-xs font-bold text-[#0f1d17]">University of Layyah</span>
                     </motion.div>
                     <div className="w-8 h-2 bg-black/20 rounded-full blur-sm mt-2" />
                  </div>
                </div>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#0f1d17]">Our Location</h3>
                    <p className="text-xs text-[#5a6e63] mt-0.5">Layyah, Punjab, Pakistan</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eaf6ee] flex items-center justify-center text-[#227736] shadow-sm">
                    <MapPin size={18} />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ==================== 4 INFO CARDS ==================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactCards.map((c, i) => {
              const isGreen = c.color === "green";
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn("p-5 rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all flex items-center gap-4", isGreen ? "border-[#e2ebe6] hover:border-[#227736]/40" : "border-[#e2ebe6] hover:border-[#E67E22]/40")}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", isGreen ? "bg-[#227736] text-white shadow-[#227736]/20" : "bg-[#E67E22] text-white shadow-[#E67E22]/20")}>
                    <c.icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#5a6e63] mb-1">{c.title}</p>
                    <p className="text-sm font-extrabold text-[#0f1d17]">{c.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* ==================== FORM & OTHER WAYS ==================== */}
          <section className="grid lg:grid-cols-2 gap-8">
            
            {/* LEFT: Contact Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#e2ebe6] shadow-sm relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf6ee] border border-[#c8e6d1] mb-4">
                <Send size={12} className="text-[#227736]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#227736]">Send a Message</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#0f1d17] mb-2">{`Let's talk.`}</h2>
              <p className="text-sm text-[#5a6e63] mb-8">{`Fill in the form and we'll get back to you as soon as possible.`}</p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Your Name *</label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Enter your name" 
                      required 
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:border-[#227736] focus:ring-2 focus:ring-[#227736]/20 outline-none text-sm transition-all disabled:opacity-60" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Email Address *</label>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      required 
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:border-[#227736] focus:ring-2 focus:ring-[#227736]/20 outline-none text-sm transition-all disabled:opacity-60" 
                    />
                  </div>
                </div>
                
                {/* CUSTOM DROPDOWN (Green Theme) */}
                <div>
                  <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Subject</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:border-[#227736] focus:ring-2 focus:ring-[#227736]/20 outline-none text-sm transition-all text-left flex items-center justify-between disabled:opacity-60"
                    >
                      <span className={selectedSubject === "Select a subject" ? "text-[#5a6e63]" : "text-[#0f1d17] font-medium"}>
                        {selectedSubject}
                      </span>
                      <ChevronDown size={16} className={cn("text-[#227736] transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-20 w-full mt-2 bg-white border border-[#e2ebe6] rounded-xl shadow-xl overflow-hidden"
                        >
                          {subjects.map((sub, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedSubject(sub);
                                setIsOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-[#0f1d17] hover:bg-[#eaf6ee] hover:text-[#227736] transition-colors"
                            >
                              {sub}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Your Message *</label>
                  <textarea 
                    name="message"
                    rows={4} 
                    placeholder="Write your message here..." 
                    required 
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8faf9] border border-[#e2ebe6] focus:border-[#227736] focus:ring-2 focus:ring-[#227736]/20 outline-none text-sm transition-all resize-none disabled:opacity-60" 
                  />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {status === "error" && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"
                    >
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Send Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting || status === "success"}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#227736] to-[#1c6430] hover:from-[#1c6430] hover:to-[#144d25] text-white font-bold text-sm shadow-lg shadow-[#227736]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : status === "success" ? (
                    <>
                      <CheckCircle2 size={18} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
                
                <p className="text-center text-[10px] text-[#5a6e63] font-semibold flex items-center justify-center gap-1 mt-2">
                  <ShieldCheck size={12} /> Your information is safe with us.
                </p>
              </form>
            </motion.div>

            {/* RIGHT: Other Ways */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6 h-full flex flex-col">
              <div className="bg-white p-8 rounded-[2rem] border border-[#e2ebe6] shadow-sm flex-1">
                <h3 className="text-xl font-extrabold text-[#0f1d17] mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#227736]" />
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-4">
                  {otherWays.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f8faf9] border border-transparent hover:border-[#e2ebe6] transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#eaf6ee] flex items-center justify-center text-[#227736] group-hover:scale-110 transition-transform">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0f1d17] group-hover:text-[#227736] transition-colors">{item.title}</p>
                          <p className="text-xs text-[#5a6e63] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-[#5a6e63] group-hover:text-[#227736] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}