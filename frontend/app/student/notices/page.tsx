"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Pin, Calendar, Sparkles, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { mockNotices } from "@/data/mock-data";
import { formatDate, daysLeft } from "@/lib/utils";

export default function NoticesPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [sem, setSem] = useState("All");

  const filtered = mockNotices.filter((n) => {
    const q = query.toLowerCase();
    const matchQ = n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    const matchD = dept === "All" || n.department === dept;
    const matchS = sem === "All" || n.semester === Number(sem);
    return matchQ && matchD && matchS;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Notices</h1>
        <p className="text-slate-500 text-sm mt-1">
          Saare university notices — searchable aur AI-summarized.
        </p>
      </motion.div>

      {/* Filters */}
      <Card hover={false}>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search notices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none"
            />
          </div>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
          <select
            value={sem}
            onChange={(e) => setSem(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 outline-none"
          >
            <option value="All">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
          </select>
        </div>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState title="Koi notice nahi mila" message="Filters change karke try karein." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/student/notices/${n.id}`}>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all h-full">
                  <div className="flex items-center gap-2 mb-2">
                    {n.pinned && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        <Pin size={10} /> Pinned
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {n.category}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {n.department}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-800 line-clamp-2">{n.title}</h3>
                  {n.summary && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-green-50 border border-orange-100">
                      <p className="text-xs font-semibold text-orange-600 flex items-center gap-1 mb-1">
                        <Sparkles size={11} /> AI Summary
                      </p>
                      <p className="text-xs text-slate-700 line-clamp-2">{n.summary}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(n.createdAt)}</span>
                    {n.deadline && (
                      <span className="text-orange-600 font-semibold">
                        {daysLeft(n.deadline)} days left
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}