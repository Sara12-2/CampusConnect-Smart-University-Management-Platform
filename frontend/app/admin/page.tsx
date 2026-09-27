"use client";
import { motion } from "framer-motion";
import { Users, Mail, BookOpen, Shield, Ban } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const users = [
  { id: "s1", name: "Sara Manzoor", email: "sara@campusconnect.edu", role: "student", dept: "CS", sem: 5 },
  { id: "s2", name: "Abdullah", email: "abdullah@campusconnect.edu", role: "student", dept: "CS", sem: 5 },
  { id: "s3", name: "Abubakar Nadeem", email: "abubakar@campusconnect.edu", role: "student", dept: "SE", sem: 3 },
  { id: "s4", name: "Umair Akram", email: "umair@campusconnect.edu", role: "student", dept: "CS", sem: 5 },
  { id: "a1", name: "Sir Safi Ullah", email: "admin@campusconnect.edu", role: "admin", dept: "—", sem: 0 },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-1">Students aur admin accounts manage karein.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold">
                {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{u.name}</h3>
                <Badge className={u.role === "admin"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-orange-100 text-orange-700 border-orange-200"}>
                  <Shield size={10} /> {u.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-1 truncate"><Mail size={11} /> {u.email}</p>
              {u.role === "student" && (
                <p className="flex items-center gap-1"><BookOpen size={11} /> {u.dept} — Sem {u.sem}</p>
              )}
            </div>
            <button className="mt-4 w-full text-xs font-semibold text-red-600 hover:bg-red-50 py-2 rounded-lg transition-all flex items-center justify-center gap-1">
              <Ban size={12} /> Suspend Account
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}