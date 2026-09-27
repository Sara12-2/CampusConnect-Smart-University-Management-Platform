"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bell, MessageSquare, Search, FileCheck, User, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/notices", label: "Notices", icon: Bell },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
  { href: "/student/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/student/lost-found", label: "Lost & Found", icon: Search },
  { href: "/student/claims", label: "My Claims", icon: FileCheck },
  { href: "/student/profile", label: "Profile", icon: User },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-4 hidden md:flex flex-col">
      <div className="px-3 py-4 mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student</p>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Link key={it.href} href={it.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                )}
              >
                <Icon size={18} />
                {it.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <Link href="/login">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={18} /> Logout
        </div>
      </Link>
    </aside>
  );
}