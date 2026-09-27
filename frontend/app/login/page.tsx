"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, ShieldCheck } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(role === "admin" ? "/admin" : "/student");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
              <GraduationCap size={22} />
            </div>
            Campus<span className="text-orange-500">Connect</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Welcome back!</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-orange-500/5">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "py-2 text-sm font-semibold rounded-lg transition-all",
                  role === r
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {r === "student" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@campusconnect.edu"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded accent-orange-500" />
                Remember me
              </label>
              <a href="#" className="text-orange-600 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              <ShieldCheck size={16} /> Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}