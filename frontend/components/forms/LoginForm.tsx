"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Valid email daalein.";
    if (password.length < 6)
      e.password = "Password kam se kam 6 characters.";
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
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
        {(["student", "admin"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "relative py-2 text-sm font-semibold rounded-lg transition-all",
              role === r
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {r === "student" ? "Student" : "Admin"}
          </button>
        ))}
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@campusconnect.edu"
        icon={<Mail size={16} />}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        error={errors.email}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={16} />}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        error={errors.password}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
          />
          Remember me
        </label>
        <Link
          href="#"
          className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        <ShieldCheck size={16} /> {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-slate-500 pt-2">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-orange-600 font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}