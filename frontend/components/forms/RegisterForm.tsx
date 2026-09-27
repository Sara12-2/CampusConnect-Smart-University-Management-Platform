"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, BookOpen } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Props {
  onSubmit?: (data: any) => void;
}

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Name kam se kam 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email daalein.";
    if (form.password.length < 6)
      e.password = "Password kam se kam 6 characters.";
    if (form.password !== form.confirm)
      e.confirm = "Passwords match nahi kar rahe.";
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
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Sara Manzoor"
        icon={<User size={16} />}
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@campusconnect.edu"
        icon={<Mail size={16} />}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
      />

      <div className="grid grid-cols-2 gap-4">
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

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={16} />}
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={16} />}
        value={form.confirm}
        onChange={(e) => update("confirm", e.target.value)}
        error={errors.confirm}
      />

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        <UserPlus size={16} />{" "}
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-slate-500 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-green-600 font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}