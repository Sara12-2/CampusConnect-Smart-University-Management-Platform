"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Bell, MessageSquare, Search, FileCheck, UserCog, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/notices", label: "Notices", icon: Bell },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/admin/lost-found", label: "Lost & Found", icon: Search },
  { href: "/admin/claims", label: "Claims", icon: FileCheck },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-4 hidden md:flex flex-col">
      <div className="px-3 py-4 mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrator</p>
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
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/20"
                    : "text-slate-600 hover:bg-green-50 hover:text-green-600"
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