"use client";
import { motion } from "framer-motion";
import {
  Users, Bell, MessageSquare, Search, FileCheck, UserCog, TrendingUp, AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockNotices, mockComplaints, mockLostFound, mockClaims } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "5,240", icon: Users, color: "from-orange-500 to-orange-600", change: "+12%" },
    { label: "Active Notices", value: mockNotices.length, icon: Bell, color: "from-green-500 to-green-600", change: "+3" },
    { label: "Open Complaints", value: mockComplaints.filter(c => c.status !== "resolved").length, icon: MessageSquare, color: "from-orange-500 to-green-500", change: "-5%" },
    { label: "Lost & Found", value: mockLostFound.length, icon: Search, color: "from-green-500 to-orange-600", change: "+8" },
    { label: "Pending Claims", value: mockClaims.filter(c => c.status === "pending").length, icon: FileCheck, color: "from-orange-500 to-orange-600", change: "+2" },
    { label: "Staff Members", value: "42", icon: UserCog, color: "from-green-500 to-green-600", change: "+1" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">University platform ka complete overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
              <s.icon size={16} />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={10} /> {s.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" /> Recent Complaints
            </h2>
          </div>
          <div className="space-y-3">
            {mockComplaints.slice(0, 4).map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800 line-clamp-1">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">by {c.studentName} • {formatDate(c.createdAt)}</p>
                  </div>
                  <Badge className={statusColors[c.status]}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Bell size={18} className="text-green-500" /> Recent Notices
            </h2>
          </div>
          <div className="space-y-3">
            {mockNotices.map((n) => (
              <div key={n.id} className="p-3 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/30 transition-all">
                <p className="font-semibold text-sm text-slate-800 line-clamp-1">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.department} • {formatDate(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pending Claims */}
      <Card hover={false}>
        <h2 className="font-bold text-lg flex items-center gap-2 mb-5">
          <FileCheck size={18} className="text-orange-500" /> Pending Claims
        </h2>
        <div className="space-y-3">
          {mockClaims.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-slate-800">Claim by {c.claimantName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.proof}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all">
                  Approve
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}