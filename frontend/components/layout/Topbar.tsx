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
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Props {
  role?: "student" | "admin";
  onMenuClick?: () => void;
}

export default function Topbar({ role = "student", onMenuClick }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  
  // Dynamic User & Notification State
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Get User from LocalStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      // Fallback if no user (shouldn't happen if logged in)
      setUser({ name: "Guest User", email: "guest@campusconnect.edu", role: role });
    }

    // 2. Fetch Real Notifications
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch(`${API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifs();
  }, [role]);

  const unread = notifications.filter((n) => !n.isRead).length;

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

  const handleLogout = () => {
    // Clear storage on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setProfileOpen(false);
    router.push("/login");
  };

  // Get initials safely
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name || "");
  const displayName = user?.name || "User";
  const firstName = displayName.split(" ")[0];
  const userEmail = user?.email || "user@campusconnect.edu";
  const userRole = user?.role || role;

  // Theme Config
  const cfg = {
    label: role === "admin" ? "Admin Panel —" : "Welcome back,",
    searchFocus: "focus:border-[#227736] focus:ring-[#227736]/10",
    iconHover: "hover:bg-[#eaf6ee] hover:text-[#227736]",
    notifDot: "bg-[#E67E22]",
    avatar: role === "admin" ? "from-[#E67E22] to-[#d4701a]" : "from-[#227736] to-[#28a745]",
    profileLink: role === "admin" ? "/admin" : "/student/profile",
    notificationsLink: role === "admin" ? "/admin" : "/student/notifications",
    roleBadge: role === "admin" ? "bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/30" : "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]",
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2ebe6]">
      <div className="h-0.5 bg-gradient-to-r from-[#227736] via-[#28a745] to-[#E67E22]" />

      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3">
        {/* LEFT: Menu + Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-[#227736] hover:bg-[#eaf6ee] transition-colors duration-300"
          >
            <Menu size={20} />
          </motion.button>

          <div className="min-w-0">
            <p className="text-[10px] text-[#5a6e63] truncate uppercase tracking-wider font-semibold">
              {cfg.label}
            </p>
            <h2 className="font-bold text-[#0f1d17] truncate text-sm md:text-base tracking-tight">
              {firstName}
            </h2>
          </div>
        </div>

        {/* CENTER: Search */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6e63] group-focus-within:text-[#227736] transition-colors duration-300" size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={role === "admin" ? "Search users, notices..." : "Search notices, items..."}
              className={cn("w-full pl-10 pr-10 py-2 text-sm rounded-xl bg-[#f8faf9] border-2 border-[#e2ebe6] text-[#0f1d17] placeholder:text-[#5a6e63]/60 outline-none transition-all duration-300 focus:bg-white focus:ring-4", cfg.searchFocus)}
            />
            {query ? (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6e63] hover:text-[#227736] hover:bg-[#eaf6ee] p-1 rounded-md transition-all"><X size={13} /></button>
            ) : (
              <kbd className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-[#5a6e63] bg-white border border-[#e2ebe6] rounded-md px-1.5 py-0.5">⌘K</kbd>
            )}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button onClick={() => setMobileSearch((v) => !v)} className="md:hidden p-2 rounded-xl text-[#5a6e63] hover:bg-[#eaf6ee] hover:text-[#227736] transition-all duration-300">
            <Search size={18} />
          </button>

          {/* NOTIFICATIONS */}
          <div ref={notifRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              className={cn("relative p-2 rounded-xl text-[#5a6e63] transition-all duration-300", cfg.iconHover)}
            >
              <motion.div animate={unread > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}>
                <Bell size={18} />
              </motion.div>

              {unread > 0 && (
                <>
                  <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} className={cn("absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white", cfg.notifDot)} />
                  <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-[#dc3545] text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">{unread}</span>
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#e2ebe6] overflow-hidden">
                  <div className="relative px-4 py-3 border-b border-[#e2ebe6] flex items-center justify-between">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#227736] to-[#E67E22]" />
                    <h3 className="font-bold text-sm text-[#0f1d17] flex items-center gap-1.5"><Bell size={13} className="text-[#227736]" />Notifications</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf2e3] text-[#B45A0B] border border-[#E67E22]/30 uppercase tracking-wider">{unread} new</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-3"><Bell size={20} className="text-[#227736]" /></div>
                        <p className="text-sm text-[#5a6e63]">No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <Link key={n.id} href={cfg.notificationsLink} onClick={() => setNotifOpen(false)} className={cn("group relative block px-4 py-3 border-b border-[#f8faf9] hover:bg-[#f8faf9] transition-colors duration-300", !n.isRead && "bg-[#eaf6ee]/40")}>
                          <div className="flex items-start gap-2.5">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border", n.isRead ? "bg-[#f8faf9] border-[#e2ebe6] text-[#5a6e63]" : "bg-[#fdf2e3] border-[#E67E22]/30 text-[#E67E22]")}><Bell size={13} /></div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className={cn("text-sm truncate", n.isRead ? "font-medium text-[#5a6e63]" : "font-bold text-[#0f1d17]")}>{n.title}</p>
                                {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] shrink-0 mt-1.5" />}
                              </div>
                              <p className="text-xs text-[#5a6e63] line-clamp-2 mt-0.5">{n.message}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }} className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f8faf9] transition-all duration-300">
              <div className={cn("relative w-9 h-9 rounded-full bg-gradient-to-br text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#227736]/20 ring-2 ring-white", cfg.avatar)}>
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#28a745] border-2 border-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#0f1d17] truncate max-w-24">{firstName}</p>
              </div>
              <ChevronDown size={14} className={cn("hidden md:block text-[#5a6e63] transition-transform duration-300", profileOpen && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-[#e2ebe6] overflow-hidden">
                  <div className="relative px-4 py-4 border-b border-[#e2ebe6]">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#227736] to-[#E67E22]" />
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center font-bold shadow-md", cfg.avatar)}>{initials}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-[#0f1d17] truncate">{displayName}</p>
                        <p className="text-xs text-[#5a6e63] truncate">{userEmail}</p>
                      </div>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", cfg.roleBadge)}><Sparkles size={10} />{userRole}</span>
                  </div>

                  <div className="py-1">
                    <Link href={cfg.profileLink} onClick={() => setProfileOpen(false)} className="group flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5a6e63] hover:bg-[#f8faf9] hover:text-[#227736] transition-all duration-300">
                      <div className="w-7 h-7 rounded-md bg-[#f8faf9] group-hover:bg-[#eaf6ee] flex items-center justify-center transition-colors"><User size={13} /></div>
                      My Profile
                    </Link>
                  </div>

                  <div className="border-t border-[#e2ebe6] py-1">
                    <button onClick={handleLogout} className="group w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#dc3545] hover:bg-[#fdeaea] transition-all duration-300 font-bold">
                      <div className="w-7 h-7 rounded-md bg-[#fdeaea] group-hover:bg-[#dc3545] group-hover:text-white flex items-center justify-center transition-colors"><LogOut size={13} /></div>
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <AnimatePresence>
        {mobileSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden border-t border-[#e2ebe6] bg-white">
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6e63]" size={16} />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className={cn("w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#f8faf9] border-2 border-[#e2ebe6] text-[#0f1d17] outline-none transition-all focus:bg-white focus:ring-4 placeholder:text-[#5a6e63]/60", cfg.searchFocus)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}