"use client";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, Sparkles, ShieldCheck, Users,
  Clock, Filter, Image as ImageIcon, CheckCircle2, Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

const services = [
  {
    icon: Bell,
    title: "Smart Digital Notice Board",
    color: "from-orange-500 to-orange-600",
    desc: "University notices ek hi jagah — searchable, filterable aur AI-summarized.",
    features: [
      "Notice publishing by admin",
      "Search & filter (department/semester)",
      "Deadline reminders",
      "Pinned / important notices",
      "AI-generated summaries",
    ],
  },
  {
    icon: MessageSquare,
    title: "Complaint & Issue Management",
    color: "from-green-500 to-green-600",
    desc: "Campus issues report karo, track karo — status ke saath.",
    features: [
      "Submit complaints with images",
      "Categories: Classroom, Lab, Wi-Fi, etc.",
      "Status: Submitted → Assigned → In Progress → Resolved",
      "Admin assignment & monitoring",
      "Complete history tracking",
    ],
  },
  {
    icon: Search,
    title: "University Lost & Found",
    color: "from-orange-500 to-green-500",
    desc: "Gumshuda cheezein report karo, mile to claim karo — verified.",
    features: [
      "Report lost or found items",
      "Item images, location & date",
      "Search & filtering",
      "Submit claims",
      "Admin verification",
    ],
  },
];

const aiFeatures = [
  { icon: Sparkles, title: "AI Notice Summaries", desc: "Lengthy notices ka short summary — dates, deadlines, documents sab highlighted." },
  { icon: Clock, title: "Instant Understanding", desc: "Seconds mein samjho, minutes bachao." },
  { icon: CheckCircle2, title: "Original Retained", desc: "Original notice bhi available — summary ke saath." },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-green-50/40">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Our{" "}
              <span className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Teen core modules — ek unified platform. Sab kuch students aur
              administrators ke liye designed.
            </p>
          </motion.div>
        </section>

        {/* Services */}
        <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="grid md:grid-cols-3 gap-0">
                <div className={`bg-gradient-to-br ${s.color} p-8 text-white flex flex-col justify-between`}>
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                      <s.icon size={26} />
                    </div>
                    <h2 className="text-2xl font-bold">{s.title}</h2>
                    <p className="mt-3 text-sm opacity-90">{s.desc}</p>
                  </div>
                </div>
                <div className="md:col-span-2 p-8">
                  <h3 className="font-bold text-lg mb-4">Key Features</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* AI Feature */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-green-500 p-10 text-white shadow-2xl shadow-orange-500/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <Zap size={14} /> AI Feature
              </div>
              <h2 className="text-3xl font-bold">AI Notice Summarization</h2>
              <p className="mt-3 opacity-90 max-w-2xl mx-auto">
                Lengthy notices ko seconds mein samjho — dates, deadlines,
                required documents, sab AI summary mein.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {aiFeatures.map((f) => (
                <div key={f.title} className="bg-white/15 backdrop-blur rounded-2xl p-5">
                  <f.icon size={22} className="mb-3" />
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="text-sm opacity-90 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 pb-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <Button href="/register" variant="primary" size="lg">
            Create Free Account
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}