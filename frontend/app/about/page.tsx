"use client";
import { motion } from "framer-motion";
import { GraduationCap, Target, Users, Sparkles, ShieldCheck, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const values = [
  { icon: Target, title: "Centralized", desc: "Saari university services ek hi platform par." },
  { icon: Sparkles, title: "AI-Powered", desc: "Notice summaries jo seconds mein samajh aayein." },
  { icon: ShieldCheck, title: "Secure", desc: "Role-based access aur verified claims." },
  { icon: Users, title: "Student-First", desc: "Students ke liye simple, fast aur clear UI." },
];

const team = [
  { name: "Sara Manzoor", role: "Project Lead", id: "UL-BSCSM-A-24-01" },
  { name: "Muhammad Abubakar Nadeem", role: "Backend Developer", id: "UL-BSCSM-A-24-46" },
  { name: "Muhammad Abdullah", role: "Frontend Developer", id: "UL-BSCSM-A-24-43" },
  { name: "Muhammad Umair Akram", role: "Database & Testing", id: "UL-BSCSM-A-24-26" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-green-50/40">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20">
              <GraduationCap size={30} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              About <span className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">CampusConnect</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Ek smart university management aur student services platform jo
              notices, complaints aur Lost & Found ko ek jagah laata hai.
            </p>
          </motion.div>
        </section>

        {/* Mission */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              CampusConnect ka maqsad hai university students aur administration
              ke darmiyan communication ko simple, fast aur digital banana.
              Hum notices, campus complaints aur Lost & Found ko ek centralized
              platform par laate hain — jahan har cheez searchable aur trackable ho.
              AI-powered notice summarization feature students ko lengthy notices
              ko seconds mein samajhne mein madad karta hai.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-100 to-green-100 text-orange-600 flex items-center justify-center mb-3">
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold">{v.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet The Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center text-xl font-bold mb-3">
                  {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-bold text-sm">{m.name}</h3>
                <p className="text-xs text-orange-600 font-semibold mt-1">{m.role}</p>
                <p className="text-xs text-slate-500 mt-1">{m.id}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}