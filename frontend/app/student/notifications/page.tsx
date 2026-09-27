"use client";
import { motion } from "framer-motion";
import { Bell, MessageSquare, FileCheck, Clock, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { mockNotifications } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

const iconMap = {
  notice: Bell,
  deadline: Clock,
  complaint: MessageSquare,
  claim: FileCheck,
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Aapke saare important updates.</p>
      </motion.div>

      <div className="space-y-3">
        {mockNotifications.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-lg ${
                n.read ? "border-slate-200" : "border-orange-300 bg-orange-50/30"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                n.read ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-orange-500 to-green-500 text-white"
              }`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-800">{n.title}</h3>
                  {!n.read && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">New</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                <p className="text-xs text-slate-400 mt-2">{formatDate(n.createdAt)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}