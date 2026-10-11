"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Mail, Lock, User, UserPlus, ArrowRight,
  ShieldCheck, Sparkles, Bell, MessageSquare, Search,
  CheckCircle2, Eye, EyeOff, AlertCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   DATA
   ============================================================ */

const features = [
  { icon: Bell, label: "Real-time Notices" },
  { icon: MessageSquare, label: "Track Complaints" },
  { icon: Search, label: "Lost & Found" },
  { icon: Sparkles, label: "AI Summaries" },
];

/* ============================================================
   PAGE
   ============================================================ */

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
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
    setTimeout(() => router.push("/student"), 700);
  };

  return (
    <main className="relative min-h-screen flex bg-[#fafbfa] overflow-hidden">

      {/* ==================== LEFT PANEL ==================== */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative hidden lg:flex w-[46%] xl:w-[48%]
          bg-gradient-to-br from-[#1c6430] via-[#227736] to-[#2a8040]
          text-white overflow-hidden"
      >
        {/* Subtle mesh */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Single soft glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full
            bg-[#E67E22]/30 blur-3xl pointer-events-none"
        />

        {/* Decorative icon */}
        <GraduationCap
          size={280}
          strokeWidth={0.4}
          className="absolute -bottom-16 -right-10 text-white/[0.04]
            pointer-events-none select-none"
        />

        {/* Content */}
        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur
                border border-white/20 flex items-center justify-center
                group-hover:bg-white/20 transition-colors">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight">
                CampusConnect
              </span>
            </Link>
          </motion.div>

          {/* Middle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-sm"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-white/10 backdrop-blur border border-white/15 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/85">
                Get Started
              </span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold leading-[1.15]
              tracking-tight">
              Everything your campus needs,
              <span className="text-[#E67E22]"> in one place.</span>
            </h2>

            <p className="mt-5 text-sm text-white/70 leading-relaxed">
              Create your free account and get instant access to notices,
              complaints, Lost & Found, and AI-powered summaries.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-2.5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15
                      flex items-center justify-center shrink-0">
                      <Icon size={13} />
                    </div>
                    <span className="text-sm text-white/85">{f.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2 text-xs text-white/60"
          >
            <ShieldCheck size={12} />
            <span>Trusted by students across 15+ universities</span>
          </motion.div>
        </div>
      </motion.aside>

      {/* ==================== RIGHT PANEL ==================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex-1 flex items-center justify-center
          px-6 py-10 md:px-10 overflow-y-auto"
      >
        <div className="relative w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br
                from-[#227736] to-[#28a745] text-white flex items-center
                justify-center shadow-md shadow-[#227736]/20">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-lg text-[#0f1d17]">
                Campus<span className="text-[#227736]">Connect</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-[#eaf6ee] border border-[#c8e6d1] mb-4">
              <UserPlus size={11} className="text-[#227736]" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#227736]">
                Free Forever
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1d17] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#5a6e63] mt-2">
              Join thousands of students using CampusConnect.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Field
              label="Full Name"
              icon={User}
              placeholder="Sara Manzoor"
              value={form.name}
              onChange={(v) => {
                setForm({ ...form, name: v });
                if (error) setError("");
              }}
            />

            {/* Email */}
            <Field
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@campusconnect.edu"
              value={form.email}
              onChange={(v) => {
                setForm({ ...form, email: v });
                if (error) setError("");
              }}
            />

            {/* Department + Semester */}
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Department"
                value={form.department}
                onChange={(v) => setForm({ ...form, department: v })}
                options={[
                  { value: "Computer Science", label: "CS" },
                  { value: "Software Engineering", label: "SE" },
                  { value: "Business Admin", label: "BBA" },
                  { value: "Electrical Eng.", label: "EE" },
                ]}
              />
              <SelectField
                label="Semester"
                value={form.semester}
                onChange={(v) => setForm({ ...form, semester: v })}
                options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
                  value: String(n),
                  label: `Sem ${n}`,
                }))}
              />
            </div>

            {/* Password */}
            <PasswordField
              label="Password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(v) => {
                setForm({ ...form, password: v });
                if (error) setError("");
              }}
              show={showPassword}
              toggle={() => setShowPassword((v) => !v)}
            />

            {/* Confirm */}
            <PasswordField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={(v) => {
                setForm({ ...form, confirm: v });
                if (error) setError("");
              }}
              show={showConfirm}
              toggle={() => setShowConfirm((v) => !v)}
            />

            {/* Match indicator */}
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
                      "flex items-center gap-1.5 text-xs font-medium",
                      form.password === form.confirm
                        ? "text-[#227736]"
                        : "text-[#dc3545]"
                    )}
                  >
                    {form.password === form.confirm ? (
                      <>
                        <CheckCircle2 size={12} />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} />
                        Passwords do not match
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
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
                <a href="#" className="text-[#227736] font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#227736] font-semibold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2 p-3 rounded-lg
                    bg-[#fdeaea] border border-[#f5c2c7]"
                >
                  <AlertCircle size={14} className="text-[#dc3545] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#b32434] font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-lg
                bg-[#227736] text-white text-sm font-semibold
                shadow-md shadow-[#227736]/20
                hover:bg-[#1c6430] hover:shadow-lg hover:shadow-[#227736]/30
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full
                group-hover:translate-x-full transition-transform duration-700
                bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Create Account
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
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
              <span className="bg-[#fafbfa] px-3 text-xs text-[#5a6e63]">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign in */}
          <Link
            href="/login"
            className="group w-full inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-lg
              bg-white text-[#227736] text-sm font-semibold
              border border-[#e2ebe6]
              hover:border-[#227736]/30 hover:bg-[#f8faf9]
              transition-all duration-200"
          >
            Sign in instead
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>

          {/* Security note */}
          <p className="mt-6 flex items-center justify-center gap-1.5
            text-[11px] text-[#5a6e63]">
            <Lock size={10} />
            Your data is encrypted and secure
          </p>
        </div>
      </motion.div>
    </main>
  );
}

/* ============================================================
   FIELD COMPONENTS
   ============================================================ */

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#0f1d17] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm
            border border-[#e2ebe6] bg-white text-[#0f1d17]
            placeholder:text-[#5a6e63]/50
            focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
            hover:border-[#c8e6d1]
            outline-none transition-all duration-200"
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  toggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  show: boolean;
  toggle: () => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#0f1d17] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6e63]"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm
            border border-[#e2ebe6] bg-white text-[#0f1d17]
            placeholder:text-[#5a6e63]/50
            focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
            hover:border-[#c8e6d1]
            outline-none transition-all duration-200"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded
            text-[#5a6e63] hover:text-[#227736] transition-colors"
          aria-label="Toggle password"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#0f1d17] mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm
          border border-[#e2ebe6] bg-white text-[#0f1d17]
          focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10
          hover:border-[#c8e6d1]
          outline-none transition-all duration-200 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}