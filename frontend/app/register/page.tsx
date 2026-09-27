"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, UserPlus, BookOpen } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", department: "Computer Science", semester: "1", password: "", confirm: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords match nahi kar rahe");
      return;
    }
    setError("");
    router.push("/student");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
              <GraduationCap size={22} />
            </div>
            Campus<span className="text-orange-500">Connect</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Join the smart campus</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-orange-500/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Sara Manzoor"
              icon={<User size={16} />}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@campusconnect.edu"
              icon={<Mail size={16} />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
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
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                options={[1,2,3,4,5,6,7,8].map(n => ({ value: String(n), label: `Semester ${n}` }))}
              />
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={error}
              required
            />

            <Button type="submit" variant="secondary" size="lg" className="w-full">
              <UserPlus size={16} /> Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}