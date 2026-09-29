"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Mail, Lock, User, UserPlus, ArrowRight,
  BookOpen, ShieldCheck, Sparkles, Bell, MessageSquare, Search,
  CheckCircle2, Eye, EyeOff, AlertCircle, Loader2, Zap,
  Building2, Users, Award, Layers,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";

/* ============================================================
   FEATURES
   ============================================================ */
const features = [
  { icon: Bell, label: "Real-time Notices" },
  { icon: MessageSquare, label: "Track Complaints" },
  { icon: Search, label: "Lost & Found" },
  { icon: Sparkles, label: "AI Summaries" },
];

const stats = [
  { icon: Users, value: "5,000+", label: "Students" },
  { icon: Building2, value: "15+", label: "Universities" },
  { icon: Award, value: "4.9/5", label: "Rating" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "Computer Science",
    semester: "1",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (form.name.trim().length < 3) {
      setError("Please enter your full name (min 3 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push("/student");
    }, 700);
  };

  return (
    <main className="relative min-h-screen flex bg-white overflow-hidden">

      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #227736 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ==================== LEFT PANEL — MARKETING ==================== */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden lg:flex w-1/2 xl:w-[55%] 
          bg-gradient-to-br from-[#165127] via-[#1c6430] to-[#227736] 
          text-white overflow-hidden"
      >
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
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25], x: [0, 20, 0] }}
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
        {[...Array(6)].map((_, i) => (
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
              top: `${15 + i * 13}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}

        {/* Big decorative icon */}
        <GraduationCap
          size={300}
          strokeWidth={0.5}
          className="absolute -bottom-16 -right-12 text-white/[0.04] 
            pointer-events-none select-none"
        />

        {/* Content */}
        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Top — Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 
              font-bold text-xl group">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-11 h-11 rounded-xl 
                  bg-white/15 backdrop-blur border border-white/25 
                  flex items-center justify-center"
              >
                <GraduationCap size={22} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full 
                  bg-[#E67E22] ring-2 ring-[#1c6430]" />
              </motion.div>
              <span className="tracking-tight">CampusConnect</span>
            </Link>
          </motion.div>

          {/* Middle — Marketing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full 
                bg-white/10 backdrop-blur-sm border border-white/15 mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"
              />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/90">
                Join CampusConnect
              </span>
            </motion.div>

            <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.05] 
              tracking-[-0.03em]">
              Everything your
              <br />
              <span className="text-[#E67E22]">campus needs.</span>
            </h2>

            <p className="mt-6 text-base text-white/75 leading-relaxed">
              Create your free account and get instant access to notices,
              complaints, Lost & Found, and AI-powered summaries.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 cursor-default"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur 
                      border border-white/15 flex items-center justify-center 
                      shrink-0">
                      <Icon size={14} />
                    </div>
                    <span className="text-sm font-medium text-white/90">
                      {f.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom — Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-6"
          >
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur 
                    border border-white/15 flex items-center justify-center">
                    <Icon size={13} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/60 font-medium">
                      {s.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.aside>

      {/* ==================== RIGHT PANEL — FORM ==================== */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 flex items-center justify-center 
          p-6 md:p-10 bg-gradient-to-br from-white via-[#f8faf9] to-white 
          overflow-y-auto"
      >
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full 
          bg-[#E67E22]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full 
          bg-[#227736]/5 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg py-6">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br 
                from-[#227736] to-[#28a745] text-white flex items-center 
                justify-center shadow-lg shadow-[#227736]/25">
                <GraduationCap size={22} />
              </div>
              <span className="text-[#0f1d17]">
                Campus<span className="text-[#227736]">Connect</span>
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
              bg-[#fdf2e3] border border-[#E67E22]/30 mb-4">
              <UserPlus size={12} className="text-[#E67E22]" />
              <span className="text-[10px] font-bold tracking-[0.15em] 
                uppercase text-[#B45A0B]">
                Free Forever
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f1d17] 
              tracking-tight">
              Create account.
            </h1>
            <p className="text-sm text-[#5a6e63] mt-2">
              Join thousands of students already using CampusConnect.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative rounded-3xl bg-white border border-[#e2ebe6] 
              p-6 md:p-8 shadow-xl shadow-[#227736]/5 overflow-hidden"
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-8 right-8 h-0.5 
              bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22] rounded-full" />

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                label="Full Name"
                placeholder="Sara Manzoor"
                icon={<User size={16} />}
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (error) setError("");
                }}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@campusconnect.edu"
                icon={<Mail size={16} />}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (error) setError("");
                }}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Department"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  options={[
                    { value: "Computer Science", label: "Computer Science" },
                    { value: "Software Engineering", label: "Software Engineering" },
                    { value: "Business Admin", label: "Business Admin" },
                    { value: "Electrical Eng.", label: "Electrical Eng." },
                  ]}
                />
                <Select
                  label="Semester"
                  value={form.semester}
                  onChange={(e) =>
                    setForm({ ...form, semester: e.target.value })
                  }
                  options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                    value: String(n),
                    label: `Semester ${n}`,
                  }))}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  icon={<Lock size={16} />}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (error) setError("");
                  }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-[38px] p-1.5 rounded-lg 
                    text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] 
                    transition-all duration-200"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  icon={<Lock size={16} />}
                  value={form.confirm}
                  onChange={(e) => {
                    setForm({ ...form, confirm: e.target.value });
                    if (error) setError("");
                  }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-[38px] p-1.5 rounded-lg 
                    text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] 
                    transition-all duration-200"
                  aria-label="Toggle confirm password"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.button>
              </div>

              {/* Password match indicator */}
              <AnimatePresence>
                {form.confirm && form.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] font-medium",
                        form.password === form.confirm
                          ? "text-[#227736]"
                          : "text-[#dc3545]"
                      )}
                    >
                      {form.password === form.confirm ? (
                        <>
                          <CheckCircle2 size={11} />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <AlertCircle size={11} />
                          Passwords do not match
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none 
                p-3 rounded-xl hover:bg-[#f8faf9] transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (error) setError("");
                  }}
                  className="mt-0.5 w-4 h-4 rounded accent-[#227736] cursor-pointer"
                />
                <span className="text-xs text-[#5a6e63] leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#227736] font-bold hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#227736] font-bold hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 p-3 rounded-xl 
                      bg-[#fdeaea] border-2 border-[#f5c2c7]">
                      <AlertCircle size={15} className="text-[#dc3545] 
                        mt-0.5 shrink-0" />
                      <p className="text-xs text-[#b32434] font-medium">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
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
                <span className="absolute inset-0 -translate-x-full 
                  group-hover:translate-x-full transition-transform duration-700 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Account
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2ebe6]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#5a6e63] font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign in link */}
            <Link href="/login">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full inline-flex items-center justify-center gap-2 
                  px-6 py-3 rounded-xl 
                  bg-white text-[#227736] text-sm font-bold 
                  border-2 border-[#e2ebe6] 
                  hover:border-[#227736]/40 hover:bg-[#eaf6ee]
                  transition-all duration-300"
              >
                <ShieldCheck size={15} />
                Sign in instead
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.div>
            </Link>

            {/* Security note */}
            <p className="mt-5 flex items-center justify-center gap-1.5 
              text-[10px] text-[#5a6e63]">
              <Lock size={10} className="text-[#227736]" />
              Your data is encrypted and secure
            </p>
          </motion.div>

          {/* Bottom trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 
              text-xs text-[#5a6e63]"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-[#227736]" />
              <span className="font-medium">No credit card</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-[#E67E22]" />
              <span className="font-medium">Instant access</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
            <div className="flex items-center gap-1.5">
              <Layers size={12} className="text-[#227736]" />
              <span className="font-medium">All features included</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}