"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell, MessageSquare, Search, FileCheck, ArrowRight, Pin, Calendar, Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockNotices, mockComplaints, mockLostFound, mockClaims, mockUser } from "@/data/mock-data";
import { formatDate, statusColors, daysLeft } from "@/lib/utils";

export default function StudentDashboard() {
  const recentNotices = mockNotices.slice(0, 3);
  const myComplaints = mockComplaints.slice(0, 3);
  const myClaims = mockClaims.slice(0, 2);
  const myItems = mockLostFound.slice(0, 2);

  const stats = [
    { label: "Notices", value: mockNotices.length, icon: Bell, color: "from-orange-500 to-orange-600" },
    { label: "Complaints", value: mockComplaints.length, icon: MessageSquare, color: "from-green-500 to-green-600" },
    { label: "Lost & Found", value: mockLostFound.length, icon: Search, color: "from-orange-500 to-green-500" },
    { label: "Claims", value: mockClaims.length, icon: FileCheck, color: "from-green-500 to-orange-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-orange-500 to-green-500 p-8 text-white shadow-xl shadow-orange-500/20"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Assalam-o-Alaikum, {mockUser.name.split(" ")[0]}! 👋
        </h1>
        <p className="mt-2 opacity-90">
          {mockUser.department} — Semester {mockUser.semester}
        </p>
        <p className="mt-4 text-sm opacity-80 max-w-xl">
          Aaj ke campus updates dekhein — naye notices, complaint status, aur
          Lost & Found items.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Notices */}
        <Card className="lg:col-span-2" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Bell size={18} className="text-orange-500" /> Recent Notices
            </h2>
            <Link href="/student/notices" className="text-sm text-orange-600 hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentNotices.map((n) => (
              <Link key={n.id} href={`/student/notices/${n.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {n.pinned && (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                            <Pin size={10} /> Pinned
                          </Badge>
                        )}
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {n.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm">{n.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(n.createdAt)}</span>
                    {n.deadline && (
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <Sparkles size={11} /> {daysLeft(n.deadline)} days left
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>

        {/* My Complaints */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MessageSquare size={18} className="text-green-500" /> My Complaints
            </h2>
          </div>
          <div className="space-y-3">
            {myComplaints.map((c) => (
              <Link key={c.id} href={`/student/complaints/${c.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50/40 transition-all"
                >
                  <p className="font-semibold text-sm text-slate-800 line-clamp-1">{c.title}</p>
                  <div className="mt-2">
                    <Badge className={statusColors[c.status]}>{c.status}</Badge>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <Link href="/student/complaints" className="text-sm text-green-600 hover:underline font-semibold flex items-center gap-1 mt-4">
            View all <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lost & Found */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Search size={18} className="text-orange-500" /> Lost & Found
            </h2>
            <Link href="/student/lost-found" className="text-sm text-orange-600 hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {myItems.map((it) => (
              <Link key={it.id} href={`/student/lost-found/${it.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{it.title}</p>
                    <p className="text-xs text-slate-500">{it.location}</p>
                  </div>
                  <Badge className={it.type === "lost" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}>
                    {it.type}
                  </Badge>
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>

        {/* My Claims */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileCheck size={18} className="text-green-500" /> My Claims
            </h2>
            <Link href="/student/claims" className="text-sm text-green-600 hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {myClaims.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-200">
                <p className="font-semibold text-sm text-slate-800">Claim #{c.id}</p>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.proof}</p>
                <div className="mt-2">
                  <Badge className={statusColors[c.status]}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}