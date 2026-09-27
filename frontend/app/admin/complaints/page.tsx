"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, User, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { mockComplaints } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

export default function AdminComplaints() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? mockComplaints : mockComplaints.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Manage Complaints</h1>
        <p className="text-slate-500 text-sm mt-1">Complaints review, assign aur update karein.</p>
      </motion.div>

      <Card hover={false}>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-green-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={statusColors[c.status]}>{c.status}</Badge>
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200">{c.category}</Badge>
                </div>
                <h3 className="font-bold text-slate-800">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><User size={11} /> {c.studentName}</span>
                  <span>{formatDate(c.createdAt)}</span>
                  {c.assignedTo && <span>Assigned: {c.assignedTo}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  defaultValue={c.status}
                  className="text-xs rounded-lg border border-slate-200 px-2 py-1.5 focus:border-green-500 outline-none"
                >
                  <option value="submitted">Submitted</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}