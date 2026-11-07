"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  Target,
  Users,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Zap,
  Compass,
  Rocket,
  Code2,
  Database,
  Layers,
  ArrowRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

/* ============================================================
   DATA
   ============================================================ */

const team = [
  { name: "Sara Manzoor", role: "Project Lead", id: "UL-BSCSM-A-24-01", icon: Compass, accent: true },
  { name: "M. Abubakar Nadeem", role: "Backend Developer", id: "UL-BSCSM-A-24-46", icon: Database, accent: false },
  { name: "Muhammad Abdullah", role: "Frontend Developer", id: "UL-BSCSM-A-24-43", icon: Code2, accent: true },
  { name: "M. Umair Akram", role: "Database & Testing", id: "UL-BSCSM-A-24-26", icon: Layers, accent: false },
];

const features = [
  { title: "Smart Notice Summaries", desc: "Long PDF notices translated into crisp, key bullet points powered by AI.", icon: Sparkles, badge: "AI Engine" },
  { title: "Tracked Complaints", desc: "Submit, track, and resolve campus infrastructure issues in real time.", icon: ShieldCheck, badge: "Real-time" },
  { title: "Lost & Found Ledger", desc: "Centralized claim verification system for misplaced campus belongings.", icon: Layers, badge: "Verified" },
];

const milestones = [
  { phase: "01", title: "Problem Definition", desc: "Identified campus friction: fragmented notices and unorganized complaints.", icon: BookOpen },
  { phase: "02", title: "Full Stack Architecture", desc: "Designed a performant React/Next.js interface backed by robust API routing.", icon: Code2 },
  { phase: "03", title: "AI Integration", desc: "Engineered LLM summarization flows for quick comprehension.", icon: Sparkles },
  { phase: "04", title: "Campus Deployment", desc: "Delivered an operational smart platform ready for higher education.", icon: Rocket },
];

/* ============================================================
   ANIMATIONS & VARIANTS
   ============================================================ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf9] text-[#0f1d17] overflow-x-hidden selection:bg-[#E67E22] selection:text-white">
        
        {/* ==================== HERO SECTION (FULL 3D LAPTOP FACING LEFT + REVOLVING DEV BADGES) ==================== */}
        <section
          ref={heroRef}
          className="relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] text-white pt-28 pb-28 md:pt-36 md:pb-36 overflow-hidden border-b border-[#1c6430]"
        >
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.06]" 
            style={{ 
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", 
              backgroundSize: "32px 32px" 
            }} 
          />
          
          {/* Glowing Ambient Glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-[#E67E22]/25 blur-[130px] pointer-events-none"
          />

          <motion.div style={{ opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-6 z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Vision & Heading */}
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="lg:col-span-5 text-center lg:text-left space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                      The Architects
                    </span>
                  </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                  Smart Campus <br />
                  <span className="bg-gradient-to-r from-[#E67E22] via-white to-[#E67E22] bg-clip-text text-transparent">
                    Innovation Team
                  </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Engineered by student developers to streamline university notices, grievances, and claim verification in one unified platform.
                </motion.p>

                <motion.div variants={itemVariants} className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button href="/register" size="lg" className="!bg-[#E67E22] !text-white hover:!bg-[#D35400] shadow-xl border-none">
                    Explore Platform <ArrowRight size={18} className="ml-1" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Column: Full 3D Laptop Angled Facing Text + Smooth Revolving Badges */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 relative min-h-[460px] flex items-center justify-center"
              >
                
                {/* Developer Badge 1: Sara Manzoor (Continuous Floating Path) */}
                <motion.div 
                  animate={{ 
                    x: [-30, 20, 40, -10, -30],
                    y: [-120, -140, -40, -20, -120],
                    scale: [1, 1.05, 0.95, 1, 1]
                  }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute z-30 p-3 px-4 rounded-2xl bg-white text-[#0f1d17] shadow-2xl border border-[#e2ebe6] flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white flex items-center justify-center font-bold shrink-0">
                    <Compass size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f1d17] whitespace-nowrap">Sara Manzoor</p>
                    <p className="text-[10px] font-semibold text-[#E67E22] uppercase tracking-wider">Project Lead</p>
                  </div>
                </motion.div>

                {/* Developer Badge 2: M. Abubakar Nadeem */}
                <motion.div 
                  animate={{ 
                    x: [160, 120, 20, 100, 160],
                    y: [-60, 40, 120, -20, -60],
                    scale: [1, 0.95, 1.05, 1, 1]
                  }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute z-30 p-3 px-4 rounded-2xl bg-white text-[#0f1d17] shadow-2xl border border-[#e2ebe6] flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] text-white flex items-center justify-center font-bold shrink-0">
                    <Database size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f1d17] whitespace-nowrap">M. Abubakar Nadeem</p>
                    <p className="text-[10px] font-semibold text-[#227736] uppercase tracking-wider">Backend Developer</p>
                  </div>
                </motion.div>

                {/* Developer Badge 3: Muhammad Abdullah */}
                <motion.div 
                  animate={{ 
                    x: [80, -40, -140, 0, 80],
                    y: [120, 140, 20, 60, 120],
                    scale: [1, 1.05, 0.95, 1, 1]
                  }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute z-30 p-3 px-4 rounded-2xl bg-white text-[#0f1d17] shadow-2xl border border-[#e2ebe6] flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white flex items-center justify-center font-bold shrink-0">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f1d17] whitespace-nowrap">Muhammad Abdullah</p>
                    <p className="text-[10px] font-semibold text-[#E67E22] uppercase tracking-wider">Frontend Developer</p>
                  </div>
                </motion.div>

                {/* Developer Badge 4: M. Umair Akram */}
                <motion.div 
                  animate={{ 
                    x: [-160, -120, 0, -100, -160],
                    y: [40, -60, -120, 20, 40],
                    scale: [1, 0.95, 1.05, 1, 1]
                  }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute z-30 p-3 px-4 rounded-2xl bg-white text-[#0f1d17] shadow-2xl border border-[#e2ebe6] flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#227736] to-[#1c6430] text-white flex items-center justify-center font-bold shrink-0">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f1d17] whitespace-nowrap">M. Umair Akram</p>
                    <p className="text-[10px] font-semibold text-[#227736] uppercase tracking-wider">Database & Testing</p>
                  </div>
                </motion.div>

                {/* REALISTIC 3D LAPTOP MODEL (Angled Face towards Left Text) */}
                <motion.div 
                  whileHover={{ rotateY: -18, rotateX: 12, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative mx-auto w-full max-w-[460px] transform-gpu my-auto"
                  style={{
                    transform: "rotateY(-25deg) rotateX(15deg) rotateZ(3deg)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Laptop Screen Lid / Top Half */}
                  <div className="relative rounded-t-2xl bg-[#0f1712] p-3 border-4 border-[#2b3a30] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.75)]">
                    
                    {/* Screen Webbar */}
                    <div className="flex items-center justify-between pb-2 px-2 border-b border-white/10 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <div className="px-3 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70 font-mono">
                        campusconnect.app
                      </div>
                    </div>

                    {/* Simulated Screen Dashboard UI */}
                    <div className="rounded-lg bg-[#f8faf9] p-3.5 text-[#0f1d17] space-y-2.5 min-h-[240px] shadow-inner">
                      
                      {/* Top Header Mockup */}
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#e2ebe6] shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-[#227736] text-white flex items-center justify-center text-[10px] font-bold">CC</div>
                          <span className="text-xs font-bold text-[#0f1d17]">CampusConnect</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#eaf6ee] text-[#227736] text-[9px] font-bold">Live System</span>
                      </div>

                      {/* Mockup Cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">Notices</p>
                          <p className="text-xs font-extrabold text-[#227736]">24 Active</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">Complaints</p>
                          <p className="text-xs font-extrabold text-[#E67E22]">08 Pending</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#e2ebe6]">
                          <p className="text-[8px] text-[#5a6e63]">Claims</p>
                          <p className="text-xs font-extrabold text-[#1c6430]">03 Verified</p>
                        </div>
                      </div>

                      {/* Notice Banner */}
                      <div className="p-2 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1]">
                        <p className="text-[11px] font-bold text-[#0f1d17]">AI Notice Digest</p>
                        <p className="text-[9px] text-[#5a6e63] mt-0.5">Exams schedule uploaded. Clear ID cards required.</p>
                      </div>

                    </div>
                  </div>

                  {/* Laptop Base Stand & Keyboard Perspective Deck */}
                  <div className="relative h-6 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 rounded-b-xl border-t-2 border-gray-500 shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-20 h-1.5 bg-gray-700 rounded-b-md shadow-inner" />
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* ==================== CORE FEATURES ==================== */}
        <section className="py-20 bg-white border-b border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest text-[#E67E22] uppercase bg-[#E67E22]/10 px-3 py-1 rounded-full border border-[#E67E22]/20">
                Core Capabilities
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f1d17] mt-3">
                Engineered for Campus Productivity
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-3xl bg-[#f8faf9] border border-[#e2ebe6] shadow-sm hover:shadow-xl hover:border-[#227736]/40 transition-all duration-300 relative group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#eaf6ee] text-[#227736] flex items-center justify-center group-hover:bg-[#227736] group-hover:text-white transition-colors duration-300">
                      <f.icon size={24} />
                    </div>
                    <span className="text-xs font-bold font-mono text-[#E67E22] bg-white px-2.5 py-1 rounded-full border border-[#e2ebe6]">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-[#0f1d17]">{f.title}</h3>
                  <p className="text-sm text-[#5a6e63] mt-3 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== DEVELOPMENT PHASES ==================== */}
        <section className="py-24 bg-[#f8faf9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-4">
                <span className="text-xs font-bold tracking-widest text-[#227736] uppercase bg-[#eaf6ee] px-3 py-1 rounded-full border border-[#c8e6d1]">
                  System Evolution
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d17] mt-4 leading-tight">
                  How CampusConnect Was Built
                </h2>
                <p className="text-[#5a6e63] mt-4 text-sm leading-relaxed">
                  From research on campus administrative pain-points to a fully deployed modular web architecture.
                </p>
              </div>

              <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.phase}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-2xl bg-white border border-[#e2ebe6] shadow-sm hover:border-[#227736]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-[#E67E22] font-mono">{m.phase}</span>
                      <m.icon size={20} className="text-[#227736]" />
                    </div>
                    <h4 className="font-extrabold text-[#0f1d17] text-base">{m.title}</h4>
                    <p className="text-xs text-[#5a6e63] mt-2 leading-relaxed">{m.desc}</p>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ==================== TEAM GRID ==================== */}
        <section className="py-24 bg-white border-t border-[#e2ebe6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-[#227736] uppercase bg-[#eaf6ee] px-3 py-1 rounded-full border border-[#c8e6d1]">
                Full Details
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d17] mt-3">
                Team Profiles & IDs
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => {
                const isOrange = member.accent;
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="group p-6 rounded-3xl bg-[#f8faf9] border border-[#e2ebe6] shadow-sm hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
                  >
                    <div className={`absolute top-0 inset-x-0 h-1.5 ${isOrange ? "bg-[#E67E22]" : "bg-[#227736]"}`} />

                    <div className="w-16 h-16 mx-auto mb-4 mt-2 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-[#165127] to-[#227736]">
                      <member.icon size={28} />
                    </div>

                    <h3 className="font-extrabold text-base text-[#0f1d17]">{member.name}</h3>
                    <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isOrange ? "text-[#E67E22]" : "text-[#227736]"}`}>
                      {member.role}
                    </p>
                    <p className="text-[11px] text-[#5a6e63] mt-3 font-mono bg-white py-1 px-2.5 rounded-full border border-[#e2ebe6] inline-block">
                      {member.id}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-20 bg-[#f8faf9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] p-10 sm:p-16 text-center text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#E67E22]/20 rounded-full blur-[90px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to upgrade your campus workflow?
                </h2>
                <p className="mt-4 text-white/80 text-sm sm:text-base">
                  Get started with CampusConnect to access centralized notices, issue management, and AI summaries.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Button 
                    href="/register" 
                    size="lg" 
                    className="!bg-white !text-[#0f1d17] hover:!bg-[#eaf6ee] shadow-xl border-none"
                  >
                    Get Started <ArrowRight size={18} className="ml-1" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}