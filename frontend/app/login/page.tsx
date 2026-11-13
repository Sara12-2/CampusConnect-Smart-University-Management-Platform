"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff,
  AlertCircle, User, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FIX: Role change hote hi form clear karne ka function
  const handleRoleChange = (newRole: "student" | "admin") => {
    setRole(newRole);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      // ✅ TOKEN SAVE KARO
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      router.push(data.user.role === "admin" ? "/admin" : "/student");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8faf9] via-white to-[#eaf6ee] p-6 overflow-hidden">
      {/* Background Mesh & Glows */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #227736 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#227736]/20 blur-3xl pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#E67E22]/20 blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md">
        
        {/* LOGO + HEADER */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 6, scale: 1.08 }} transition={{ type: "spring", stiffness: 300 }} className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#e2ebe6] shadow-md shadow-[#227736]/10 transition-all duration-300 flex items-center justify-center">
              <Image src="/logo.png" alt="University Logo" width={48} height={48} className="object-contain p-0.5" priority />
            </motion.div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-extrabold text-[#0f1d17] tracking-tight flex items-center gap-1 leading-none">
                Campus<span className="text-[#227736]">Connect</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] mt-0.5" />
              </span>
              <span className="text-[9px] font-semibold text-[#5a6e63] tracking-[0.12em] uppercase mt-0.5">Smart Platform</span>
            </div>
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">Welcome back</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-sm text-[#5a6e63] mt-1.5">Sign in to continue to your dashboard</motion.p>
        </div>

        {/* CARD */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative bg-white rounded-2xl border border-[#e2ebe6] p-6 sm:p-8 shadow-xl shadow-[#227736]/5 overflow-hidden">
          <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22]" />

          {/* ROLE TOGGLE */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#f8faf9] border border-[#e2ebe6] rounded-xl mb-6">
            {(["student", "admin"] as const).map((r) => {
              const isActive = role === r;
              return (
                <button 
                  key={r} 
                  type="button" 
                  onClick={() => handleRoleChange(r)} // ✅ Yahan change kiya
                  className={cn("relative py-2.5 text-sm font-bold rounded-lg transition-colors capitalize", isActive ? "text-[#227736]" : "text-[#5a6e63] hover:text-[#0f1d17]")}
                >
                  {isActive && <motion.div layoutId="roleToggle" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[#e2ebe6]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {r === "student" ? <User size={13} /> : <ShieldCheck size={13} />}
                    {r === "student" ? "Student" : "Admin"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FORM */}
          {/* ✅ FIX: autoComplete="off" add kiya browser memory rokne ke liye */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} 
                  placeholder="you@campusconnect.edu" 
                  required 
                  disabled={loading} 
                  autoComplete="new-email" // ✅ Browser autofill fix
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/50 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all disabled:opacity-60" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f1d17] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }} 
                  placeholder="••••••••" 
                  required 
                  disabled={loading} 
                  autoComplete="new-password" // ✅ Browser autofill fix
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-[#e2ebe6] bg-white text-[#0f1d17] placeholder:text-[#5a6e63]/50 focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 outline-none transition-all disabled:opacity-60" 
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-[#5a6e63] hover:text-[#227736]">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-start gap-2 p-3 rounded-lg bg-[#fdeaea] border border-[#f5c2c7]">
                  <AlertCircle size={14} className="text-[#dc3545] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#b32434] font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#227736] to-[#28a745] hover:from-[#1c6430] hover:to-[#227736] text-white text-sm font-bold shadow-md disabled:opacity-60 transition-all overflow-hidden group">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : <><ShieldCheck size={15} /> Sign In <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2ebe6]" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-[#5a6e63]">New to CampusConnect?</span></div>
          </div>

          <Link href="/register" className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#227736] text-sm font-bold border border-[#e2ebe6] hover:border-[#227736]/40 hover:bg-[#f8faf9] transition-all">
            Create new account <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}