"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Mail, Lock, User, UserPlus, ArrowRight,
  ShieldCheck, Sparkles, Bell, MessageSquare, Search,
  CheckCircle2, Eye, EyeOff, AlertCircle, Loader2, BookOpen, MapPin, Rocket, KeyRound, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: Bell, label: "Real-time Notices" },
  { icon: MessageSquare, label: "Track Complaints" },
  { icon: Search, label: "Lost & Found" },
  { icon: Sparkles, label: "AI Summaries" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", email: "", department: "Computer Science", semester: "1", password: "", confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 3) return setError("Please enter your full name (min 3 characters).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!agreed) return setError("Please agree to the Terms & Privacy Policy.");

    setLoading(true);
    setTimeout(() => router.push("/student"), 800);
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#f8faf9] py-4 px-4 sm:px-6">
      
      {/* Background ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#227736]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#E67E22]/10 blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#e2ebe6] overflow-hidden flex flex-col lg:flex-row"
        >
          
          {/* ==================== LEFT SIDE (Smaller) ==================== */}
          <div className="lg:w-[42%] relative bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] p-6 lg:p-8 text-white flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <GraduationCap size={16} />
                </div>
                <span className="font-bold text-sm tracking-tight">CampusConnect</span>
              </Link>

              <h2 className="text-2xl lg:text-3xl font-extrabold leading-[1.15] tracking-tight mb-2">
                Join the smart<br />
                <span className="text-[#E67E22]">campus revolution.</span>
              </h2>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Create your free account to unlock real-time notices and AI tools.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <Icon size={12} className="text-[#E67E22]" />
                      <span className="text-[10px] font-medium text-white/90">{f.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-white/50">
              <ShieldCheck size={12} />
              <span>Trusted by 15+ universities</span>
            </div>
          </div>

          {/* ==================== RIGHT SIDE (Compact Form) ==================== */}
          <div className="lg:w-[58%] p-5 lg:p-7 relative flex flex-col justify-center bg-white">
            
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-extrabold text-[#0f1d17] tracking-tight">Create your account</h1>
              <p className="text-xs text-[#5a6e63] mt-0.5">Join thousands of students using CampusConnect.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full Name" icon={User} placeholder="Sara Manzoor" value={form.name} onChange={(v: string) => { setForm({ ...form, name: v }); setError(""); }} />
                <Field label="Email" icon={Mail} type="email" placeholder="you@campusconnect.edu" value={form.email} onChange={(v: string) => { setForm({ ...form, email: v }); setError(""); }} />
              </div>

              {/* Department & Semester */}
              <div className="grid grid-cols-2 gap-3">
                <CustomSelect 
                  label="Department" icon={BookOpen} value={form.department} 
                  onChange={(v: string) => setForm({ ...form, department: v })} 
                  options={[{ value: "Computer Science", label: "CS" }, { value: "Software Engineering", label: "SE" }, { value: "Business Admin", label: "BBA" }, { value: "Electrical Eng.", label: "EE" }]} 
                />
                <CustomSelect 
                  label="Semester" icon={MapPin} value={form.semester} 
                  onChange={(v: string) => setForm({ ...form, semester: v })} 
                  options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: `Sem ${n}` }))} 
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PasswordField label="Password" placeholder="Min 6 chars" value={form.password} onChange={(v: string) => { setForm({ ...form, password: v }); setError(""); }} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                <PasswordField label="Confirm Password" placeholder="Re-enter" value={form.confirm} onChange={(v: string) => { setForm({ ...form, confirm: v }); setError(""); }} show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
              </div>

              {/* Passwords Match Indicator */}
              <AnimatePresence>
                {form.confirm && form.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className={cn("flex items-center gap-1 text-[10px] font-semibold", form.password === form.confirm ? "text-[#227736]" : "text-[#dc3545]")}>
                      {form.password === form.confirm ? <><CheckCircle2 size={10} /> Passwords match</> : <><AlertCircle size={10} /> Passwords do not match</>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer select-none py-0.5 group">
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(""); }} className="mt-0.5 w-3.5 h-3.5 rounded border-[#c8e6d1] text-[#227736] focus:ring-[#227736]/20 accent-[#227736] cursor-pointer" />
                <span className="text-[10px] text-[#5a6e63] leading-relaxed group-hover:text-[#0f1d17] transition-colors">
                  I agree to the <a href="#" className="text-[#227736] font-semibold hover:underline">Terms</a> and <a href="#" className="text-[#227736] font-semibold hover:underline">Privacy Policy</a>
                </span>
              </label>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-start gap-1.5 p-2 rounded-lg bg-[#fdeaea] border border-[#f5c2c7]">
                    <AlertCircle size={12} className="text-[#dc3545] mt-0.5 shrink-0" />
                    <p className="text-[10px] text-[#b32434] font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button type="submit" disabled={loading} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} className="group relative w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#227736] text-white text-xs font-bold shadow-md hover:bg-[#1c6430] disabled:opacity-60 transition-all duration-200">
                {loading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : <><UserPlus size={14} /> Create Account <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2ebe6]" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] text-[#5a6e63] font-medium">Already have an account?</span></div>
            </div>

            {/* Login Link */}
            <Link href="/login" className="group w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-[#227736] text-xs font-bold border border-[#e2ebe6] hover:border-[#227736]/30 hover:bg-[#f8faf9] transition-all duration-200">
              <KeyRound size={14} /> Sign in instead <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* ============================================================
   SMALLER FIELD COMPONENTS
   ============================================================ */

function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#0f1d17] mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        <Icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] group-focus-within:text-[#227736] transition-colors" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className="w-full pl-8 pr-3 py-2 rounded-lg text-xs border border-[#e2ebe6] bg-[#f8faf9] text-[#0f1d17] placeholder:text-[#5a6e63]/50 focus:border-[#227736] focus:bg-white focus:ring-2 focus:ring-[#227736]/10 outline-none transition-all duration-200" />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, show, toggle }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#0f1d17] mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] group-focus-within:text-[#227736] transition-colors" />
        <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className="w-full pl-8 pr-8 py-2 rounded-lg text-xs border border-[#e2ebe6] bg-[#f8faf9] text-[#0f1d17] placeholder:text-[#5a6e63]/50 focus:border-[#227736] focus:bg-white focus:ring-2 focus:ring-[#227736]/10 outline-none transition-all duration-200" />
        <button type="button" onClick={toggle} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#5a6e63] hover:text-[#227736] transition-colors">
          {show ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
    </div>
  );
}

// ✅ FULLY CUSTOM DROPDOWN (No blue, fixed height, doesn't break card)
function CustomSelect({ label, icon: Icon, value, onChange, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o: any) => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[10px] font-bold text-[#0f1d17] mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        <Icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a6e63] group-focus-within:text-[#227736] transition-colors pointer-events-none z-10" />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-[34px] pl-8 pr-7 rounded-lg text-xs border border-[#e2ebe6] bg-[#f8faf9] text-left text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-2 focus:ring-[#227736]/10 outline-none transition-all duration-200 flex items-center justify-between"
        >
          <span className="truncate">{selected?.label || "Select"}</span>
          <ChevronDown size={12} className={cn("text-[#5a6e63] transition-transform", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute z-50 w-full mt-1 bg-white border border-[#e2ebe6] rounded-lg shadow-lg overflow-hidden max-h-[160px] overflow-y-auto custom-scrollbar"
            >
              {options.map((o: any) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setIsOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs transition-colors",
                    value === o.value 
                      ? "bg-[#eaf6ee] text-[#227736] font-bold" 
                      : "text-[#0f1d17] hover:bg-[#f8faf9] hover:text-[#227736]"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}