"use client";
import { motion } from "framer-motion";
import { UserCog, Mail, Phone, Wrench, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const staff = [
  { id: "st1", name: "Muhammad Ali", role: "IT Support", email: "ali@campus.edu", phone: "+92 300 1111111", active: true },
  { id: "st2", name: "Fatima Khan", role: "Maintenance", email: "fatima@campus.edu", phone: "+92 300 2222222", active: true },
  { id: "st3", name: "Hassan Raza", role: "Electrician", email: "hassan@campus.edu", phone: "+92 300 3333333", active: false },
];

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Staff</h1>
          <p className="text-slate-500 text-sm mt-1">Complaints assign karne ke liye staff.</p>
        </div>
        <Button variant="secondary">
          <Plus size={16} /> Add Staff
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold">
                {s.name.split(" ").map(n => n[0]).join("")}
              </div>
              <Badge className={s.active
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-slate-100 text-slate-600 border-slate-200"}>
                {s.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <h3 className="font-bold text-slate-800">{s.name}</h3>
            <p className="text-xs font-semibold text-orange-600 flex items-center gap-1 mt-1">
              <Wrench size={11} /> {s.role}
            </p>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-1 truncate"><Mail size={11} /> {s.email}</p>
              <p className="flex items-center gap-1"><Phone size={11} /> {s.phone}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}