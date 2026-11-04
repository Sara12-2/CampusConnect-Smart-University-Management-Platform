"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, ShieldCheck, Users, Eye, EyeOff, ArrowRight,
  Loader2, AlertCircle, CheckCircle2, Sparkles, GraduationCap,
  Fingerprint,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface Props {
  role?: "student" | "admin";
  onRoleChange?: (r: "student" | "admin") => void;
  onSubmit?: (data: { email: string; password: string; role: string }) => void;
}

export default function LoginForm({
  role: externalRole,
  onRoleChange,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [internalRole, setInternalRole] = useState<"student" | "admin">("student");
  const role = externalRole ?? internalRole;

  const setRole = (r: "student" | "admin") => {
    setInternalRole(r);
    onRoleChange?.(r);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onSubmit?.({ email, password, role });
      router.push(role === "admin" ? "/admin" : "/student");
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ==================== ROLE TOGGLE ==================== */}
      <div className="relative grid grid-cols-2 gap-2 p-1 bg-[#f8faf9] 
        border border-[#e2ebe6] rounded-xl">
        {(["student", "admin"] as const).map((r) => {
          const Icon = r === "student" ? Users : ShieldCheck;
          const active = role === r;
          return (
            <motion.button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-300",
                active
                  ? "text-white"
                  : "text-[#5a6e63] hover:text-[#227736]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="loginRoleTab"
                  className="absolute inset-0 rounded-lg 
                    bg-gradient-to-r from-[#227736] to-[#1c6430]
                    shadow-md shadow-[#227736]/25"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon size={13} strokeWidth={2.5} />
                {r === "student" ? "Student" : "Admin"}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ==================== EMAIL ==================== */}
      <Input
        label="Email Address"
        type="email"
        placeholder="you@campusconnect.edu"
        icon={<Mail size={15} />}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        error={errors.email}
        required
      />

      {/* ==================== PASSWORD ==================== */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={<Lock size={15} />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
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

      {/* ==================== ERROR ==================== */}
      <AnimatePresence>
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2.5 p-3 rounded-xl 
              bg-[#fdeaea] border-2 border-[#f5c2c7]">
              <AlertCircle
                size={14}
                className="text-[#dc3545] mt-0.5 shrink-0"
                strokeWidth={2.5}
              />
              <p className="text-xs text-[#b32434] font-semibold">
                Please fix the errors above.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== REMEMBER + FORGOT ==================== */}
      <div className="flex items-center justify-between text-sm pt-1">
        <label className="flex items-center gap-2 text-[#5a6e63] 
          cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded accent-[#227736] cursor-pointer"
          />
          <span className="font-medium group-hover:text-[#227736] 
            transition-colors">
            Remember me
          </span>
        </label>

        <Link
          href="#"
          className="text-[#227736] hover:text-[#1c6430] 
            font-bold hover:underline transition-colors 
            text-xs"
        >
          Forgot password?
        </Link>
      </div>

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
          transition-all duration-300 overflow-hidden mt-2"
      >
        {/* Shine sweep */}
        <span className="absolute inset-0 -translate-x-full 
          group-hover:translate-x-full transition-transform duration-700 
          bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <ShieldCheck size={16} strokeWidth={2.5} />
            Sign In
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="group-hover:translate-x-1 transition-transform"
            />
          </>
        )}
      </motion.button>

      {/* ==================== TRUST ROW ==================== */}
      <div className="flex items-center justify-center gap-4 
        text-[10px] text-[#5a6e63] pt-1">
        <span className="flex items-center gap-1.5">
          <Fingerprint size={11} className="text-[#227736]" />
          Secure
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1.5">
          <GraduationCap size={11} className="text-[#227736]" />
          University
        </span>
        <span className="w-1 h-1 rounded-full bg-[#e2ebe6]" />
        <span className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#E67E22]" />
          AI-powered
        </span>
      </div>

      {/* ==================== REGISTER LINK ==================== */}
      <div className="pt-2">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e2ebe6]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] text-[#5a6e63] 
              font-bold uppercase tracking-wider">
              New here?
            </span>
          </div>
        </div>

        <Link href="/register">
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
            Create free account
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