"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser, mockAdmin, mockNotifications } from "@/data/mock-data";

interface Props {
  role?: "student" | "admin";
  onMenuClick?: () => void;
}

const roleConfig = {
  student: {
    label: "Welcome back,",
    user: mockUser,
    accent: "orange",
    searchFocus: "focus:border-orange-500 focus:ring-orange-100",
    iconHover: "hover:bg-orange-50 hover:text-orange-600",
    notifDot: "bg-orange-500",
    avatar: "from-orange-500 to-green-500",
    profileLink: "/student/profile",
    notificationsLink: "/student/notifications",
  },
  admin: {
    label: "Admin Panel —",
    user: mockAdmin,
    accent: "green",
    searchFocus: "focus:border-green-500 focus:ring-green-100",
    iconHover: "hover:bg-green-50 hover:text-green-600",
    notifDot: "bg-green-500",
    avatar: "from-green-500 to-green-600",
    profileLink: "/admin",
    notificationsLink: "/admin",
  },
};

export default function Topbar({ role = "student", onMenuClick }: Props) {
  const router = useRouter();
  const cfg = roleConfig[role];
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = mockNotifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = cfg.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleLogout = () => {
    setProfileOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3">
        {/* Left: Menu + Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-xs text-slate-500 truncate">{cfg.label}</p>
            <h2 className="font-bold text-slate-800 truncate text-sm md:text-base">
              {cfg.user.name}
            </h2>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                role === "admin"
                  ? "Search users, notices, complaints..."
                  : "Search notices, complaints, items..."
              }
              className={cn(
                "w-full pl-9 pr-4 py-2 text-sm rounded-xl border-2 border-slate-200 outline-none transition-all",
                "focus:ring-4 placeholder:text-slate-400",
                cfg.searchFocus
              )}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearch((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className={cn(
                "relative p-2 rounded-xl text-slate-600 transition-all",
                cfg.iconHover
              )}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span
                  className={cn(
                    "absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ring-white",
                    cfg.notifDot
                  )}
                />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">
                      Notifications
                    </h3>
                    <span className="text-xs text-orange-600 font-semibold">
                      {unread} new
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.length === 0 ? (
                      <p className="p-6 text-center text-sm text-slate-500">
                        Koi notifications nahi
                      </p>
                    ) : (
                      mockNotifications.map((n) => (
                        <Link
                          key={n.id}
                          href={cfg.notificationsLink}
                          onClick={() => setNotifOpen(false)}
                          className={cn(
                            "block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                            !n.read && "bg-orange-50/40"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && (
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {n.title}
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  <Link
                    href={cfg.notificationsLink}
                    onClick={() => setNotifOpen(false)}
                    className="block px-4 py-3 text-center text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    View all notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all"
              aria-label="Profile"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full bg-gradient-to-br text-white flex items-center justify-center font-bold text-sm shadow-sm",
                  cfg.avatar
                )}
              >
                {initials}
              </div>
              <ChevronDown
                size={14}
                className="hidden md:block text-slate-400"
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {cfg.user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {cfg.user.email}
                    </p>
                    <span
                      className={cn(
                        "inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      )}
                    >
                      {cfg.user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={cfg.profileLink}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={15} /> Settings
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Sun size={15} /> Light Theme
                    </button>
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search drawer */}
      <AnimatePresence>
        {mobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="p-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(
                    "w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 outline-none transition-all",
                    "focus:ring-4 placeholder:text-slate-400",
                    cfg.searchFocus
                  )}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}