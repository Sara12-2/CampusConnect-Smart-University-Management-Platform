"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, UserPlus, Eye, EyeOff, CheckCircle2,
  AlertCircle, Loader2, ArrowRight, ShieldCheck, GraduationCap,
  Building2, BookOpen, Sparkles, Fingerprint, Check, X,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit?: (data: any) => void;
}

/* ============================================================
   PASSWORD STRENGTH
   ============================================================ */
function getStrength(pw: string): {
  score: number;
  label: string;
  color: string;
  bg: string;
  gradient: string;
} {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2)
    return {
      score,
      label: "Weak",
      color: "text-[#dc3545]",
      bg: "bg-[#dc3545]",
      gradient: "from-[#dc3545] to-[#b32434]",
    };
  if (score <= 3)
    return {
      score,
      label: "Medium",
      color: "text-[#E67E22]",
      bg: "bg-[#E67E22]",
      gradient: "from-[#E67E22] to-[#D35400]",
    };
  return {
    score,
    label: "Strong",
    color: "text-[#227736]",
    bg: "bg-[#227736]",
    gradient: "from-[#227736] to-[#28a745]",
  };
}

/* ============================================================
   PASSWORD RULES
   ============================================================ */
const passwordRules = [
  { label: "At least 6 characters", test: (pw: string) => pw.length >= 6 },
  { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "One special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export default function RegisterForm({ onSubmit }: Props) {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const update = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3)
      e.name = "Name must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm)
      e.confirm = "Passwords do not match.";
    if (!agreed) e.terms = "Please accept the terms to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit?.(form);
      router.push("/student");
    }, 800);
  };

  const strength = getStrength(form.password);
  const passwordsMatch =
    form.confirm.length > 0 && form.password === form.confirm;
  const passwordsDontMatch =
    form.confirm.length > 0 && form.password !== form.confirm;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ==================== NAME ==================== */}
      <Input
        label="Full Name"
        placeholder="Sara Manzoor"
        icon={<User size={15} />}
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
        required
      />

      {/* ==================== EMAIL ==================== */}
      <Input
        label="Email Address"
        type="email"
        placeholder="you@campusconnect.edu"
        icon={<Mail size={15} />}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
        required
      />

      {/* ==================== DEPARTMENT + SEMESTER ==================== */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Department"
          value={form.department}
          onChange={(e) => update("department", e.target.value)}
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
          onChange={(e) => update("semester", e.target.value)}
          options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
            value: String(n),
            label: `Semester ${n}`,
          }))}
        />
      </div>

      {/* ==================== PASSWORD ==================== */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a strong password"
          icon={<Lock size={15} />}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
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
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </motion.button>
      </div>

      {/* ==================== PASSWORD STRENGTH BAR ==================== */}
      <AnimatePresence>
        {form.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3">
              {/* Bars */}
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className={cn(
                      "h-1.5 rounded-full flex-1 origin-left transition-colors duration-300",
                      i <= strength.score ? strength.bg : "bg-[#e2ebe6]"
                    )}
                  />
                ))}
              </div>

              {/* Label */}
              <motion.span
                key={strength.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "text-[10px] font-extrabold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-full",
                  strength.score <= 2 && "bg-[#fdeaea]",
                  strength.score === 3 && "bg-[#fdf2e3]",
                  strength.score >= 4 && "bg-[#eaf6ee]",
                  strength.color
                )}
              >
                {strength.label}
              </motion.span>
            </div>

            {/* Password Rules (only when typing) */}
            {form.password.length > 0 && strength.score < 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2.5 grid grid-cols-2 gap-1.5"
              >
                {passwordRules.map((rule, i) => {
                  const passed = rule.test(form.password);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] font-medium",
                        passed ? "text-[#227736]" : "text-[#5a6e63]/60"
                      )}
                    >
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                          passed
                            ? "bg-[#227736]"
                            : "bg-[#f8faf9] border border-[#e2ebe6]"
                        )}
                      >
                        {passed ? (
                          <Check size={8} className="text-white" strokeWidth={3} />
                        ) : (
                          <X size={8} className="text-[#5a6e63]/60" strokeWidth={3} />
                        )}
                      </div>
                      {rule.label}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== CONFIRM PASSWORD ==================== */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
          icon={<Lock size={15} />}
          value={form.confirm}
          onChange={(e) => update("confirm", e.target.value)}
          error={errors.confirm}
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
          aria-label="Toggle confirm password visibility"
        >
          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
        </motion.button>
      </div>

      {/* ==================== PASSWORD MATCH INDICATOR ==================== */}
      <AnimatePresence>
        {(passwordsMatch || passwordsDontMatch) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors",
                passwordsMatch
                  ? "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]"
                  : "bg-[#fdeaea] text-[#dc3545] border border-[#f5c2c7]"
              )}
            >
              {passwordsMatch ? (
                <>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Passwords match
                </>
              ) : (
                <>
                  <AlertCircle size={12} strokeWidth={2.5} />
                  Passwords do not match
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== TERMS CHECKBOX ==================== */}
      <label
        className={cn(
          "flex items-start gap-2.5 p-3 rounded-xl cursor-pointer select-none",
          "transition-colors duration-200",
          agreed
            ? "bg-[#eaf6ee]/40 border border-[#c8e6d1]"
            : errors.terms
            ? "bg-[#fdeaea]/40 border border-[#f5c2c7]"
            : "hover:bg-[#f8faf9] border border-transparent"
        )}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (errors.terms) setErrors({ ...errors, terms: "" });
          }}
          className="mt-0.5 w-4 h-4 rounded accent-[#227736] cursor-pointer shrink-0"
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

      {errors.terms && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs text-[#dc3545] font-medium -mt-2"
        >
          <AlertCircle size={11} strokeWidth={2.5} />
          {errors.terms}
        </motion.p>
      )}

      {/* ==================== SUBMIT BUTTON ==================== */}
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
        {/* Shine sweep */}
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
            <UserPlus size={16} strokeWidth={2.5} />
            Create Account
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="group-hover:translate-x-1 transition-transform"
            />
          </>
        )}
      </motion.button>

      {/* ==================== TRUST ROW ==================== */}
      <div className="flex items-center justify-center gap-3 text-[10px] 
        text-[#5a6e63] pt-1 flex-wrap">
        <span className="flex items-center gap-1">
          <ShieldCheck size={11} className="text-[#227736]" />
          Secure
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1">
          <GraduationCap size={11} className="text-[#227736]" />
          For universities
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1">
          <Building2 size={11} className="text-[#E67E22]" />
          Free forever
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-[#E67E22]" />
          AI-powered
        </span>
      </div>

      {/* ==================== SIGN IN LINK ==================== */}
      <div className="pt-2">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2ebe6]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] text-[#5a6e63] 
              font-bold uppercase tracking-wider">
              Already a member?
            </span>
          </div>
        </div>

        <Link href="/login">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full inline-flex items-center justify-center 
              gap-2 px-6 py-3 rounded-xl 
              bg-white text-[#227736] text-sm font-bold 
              border-2 border-[#e2ebe6] 
              hover:border-[#227736]/40 hover:bg-[#eaf6ee]
              transition-all duration-300"
          >
            <Fingerprint size={14} strokeWidth={2.5} />
            Sign in instead
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.div>
        </Link>
      </div>
    </form>
  );
}