"use client";
import { motion } from "framer-motion";
import { Mail, BookOpen, Hash, Edit, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { mockUser } from "@/data/mock-data";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Apni information update karein.</p>
      </motion.div>

      <Card hover={false}>
        <div className="flex items-center gap-5 pb-6 border-b border-slate-200">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-orange-500/20">
            {mockUser.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-bold">{mockUser.name}</h2>
            <p className="text-sm text-slate-500">{mockUser.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full capitalize">
              {mockUser.role}
            </span>
          </div>
        </div>

        <form className="mt-6 space-y-4">
          <Input label="Full Name" defaultValue={mockUser.name} icon={<Edit size={16} />} />
          <Input label="Email" defaultValue={mockUser.email} icon={<Mail size={16} />} disabled />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Department" defaultValue={mockUser.department} icon={<BookOpen size={16} />} />
            <Input label="Semester" defaultValue={String(mockUser.semester)} icon={<Hash size={16} />} />
          </div>
          <Button type="submit" variant="primary" size="lg">
            <Save size={16} /> Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}