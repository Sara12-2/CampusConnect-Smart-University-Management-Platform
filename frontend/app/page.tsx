"use client";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, ShieldCheck, Users, GraduationCap,
  ArrowRight, CheckCircle2, Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const features = [
  { icon: Bell, title: "Smart Notice Board", desc: "Real-time notices with AI summaries, deadlines, and reminders." },
  { icon: MessageSquare, title: "Complaint System", desc: "Submit, track, and manage campus complaints with live status." },
  { icon: Search, title: "Lost & Found", desc: "Report lost items or find yours — with verified claims." },
  { icon: Sparkles, title: "AI Summaries", desc: "Lengthy notices ka short, clear summary — seconds mein." },
  { icon: ShieldCheck, title: "Verified Claims", desc: "Admin-verified claims taake koi fraud na ho." },
  { icon: Users, title: "Role-Based Access", desc: "Separate dashboards for students and administrators." },
];

const stats = [
  { label: "Active Students", value: "5,000+" },
  { label: "Notices / Month", value: "300+" },
  { label: "Complaints Resolved", value: "1,200+" },
  { label: "Active Staff", value: "150+" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-green-50/40 text-slate-900">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <CheckCircle2 size={14} /> Smart University Management
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Apne Campus ko{" "}
              <span className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Smart
              </span>{" "}
              banayein.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-lg">
              CampusConnect ek unified platform hai jahan notices, complaints,
              Lost & Found, aur claims — sab kuch ek jagah manage hota hai.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/register" variant="primary" size="lg">
                Get Started <ArrowRight size={18} />
              </Button>
              <Button href="/services" variant="outline" size="lg">
                Explore Features
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-green-500 p-8 text-white shadow-2xl shadow-orange-500/20 animate-float">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Dashboard Preview</p>
                  <h3 className="text-2xl font-bold mt-1">Welcome, Sara 👋</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                    <p className="text-xs opacity-80">Latest Notice</p>
                    <p className="font-semibold">Mid-term exams schedule released</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                    <p className="text-xs opacity-80">Complaint Status</p>
                    <p className="font-semibold">Wi-Fi issue — Resolved ✅</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sab kuch <span className="text-orange-500">ek platform</span> mein
            </h2>
            <p className="mt-3 text-slate-600">
              CampusConnect aapke university ke daily operations ko simple aur
              digital banata hai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-green-100 text-orange-600 flex items-center justify-center mb-4">
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-slate-600 text-sm mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-green-500 text-white p-12 text-center shadow-2xl shadow-orange-500/20">
            <h2 className="text-3xl md:text-4xl font-bold">
              Apne campus ko digital banane ke liye tayyar?
            </h2>
            <p className="mt-4 opacity-90 max-w-xl mx-auto">
              Aaj hi CampusConnect join karein aur university management ko
              smart banayein.
            </p>
            <div className="mt-8 inline-block">
              <Button href="/register" variant="ghost" size="lg" className="!bg-white !text-orange-600 hover:!bg-slate-100">
                Get Started Free <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}