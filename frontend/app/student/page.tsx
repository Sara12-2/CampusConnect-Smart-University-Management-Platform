"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bell, MessageSquare, Search, FileCheck, ArrowRight, Pin,
  Calendar, Sparkles, CheckCircle2, Plus, Upload, MapPin, Gift,
  Zap, GraduationCap, CircleDot, XCircle, Hourglass, TrendingUp,
  Activity, Loader2, AlertCircle
} from "lucide-react";
import { formatDate, statusColors, daysLeft } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [lostFound, setLostFound] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to view dashboard.");

        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, noticesRes, complaintsRes, lostFoundRes, claimsRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/me`, { headers }),
          fetch(`${API_URL}/api/notices`),
          fetch(`${API_URL}/api/complaints`, { headers }),
          fetch(`${API_URL}/api/lost-found`),
          fetch(`${API_URL}/api/claims`, { headers }),
        ]);

        if (!userRes.ok) throw new Error("Failed to load user data.");

        setUser(await userRes.json());
        setNotices(noticesRes.ok ? await noticesRes.json() : []);
        setComplaints(complaintsRes.ok ? await complaintsRes.json() : []);
        setLostFound(lostFoundRes.ok ? await lostFoundRes.json() : []);
        setClaims(claimsRes.ok ? await claimsRes.json() : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#227736]" size={40} /></div>;
  if (error) return <div className="flex justify-center py-20"><div className="flex items-center gap-2 p-4 rounded-xl bg-[#fdeaea] border border-[#f5c2c7] text-[#dc3545]"><AlertCircle size={20} /><p className="text-sm font-semibold">{error}</p></div></div>;
  if (!user) return null;

  const recentNotices = notices.slice(0, 3);
  const myComplaints = complaints.slice(0, 3);
  const myClaims = claims.slice(0, 2);
  const myItems = lostFound.slice(0, 2);

  const stats = [
    { icon: Bell, label: "Notices", value: notices.length, color: "from-[#227736] to-[#28a745]", accent: false, trend: "+3", sparkline: [4, 6, 5, 8, 7, 10, 12], shadow: "shadow-[#227736]/30" },
    { icon: MessageSquare, label: "Complaints", value: complaints.length, color: "from-[#f4a228] to-[#e08a10]", accent: true, trend: "-1", sparkline: [8, 7, 9, 6, 8, 5, 4], shadow: "shadow-[#f4a228]/30" },
    { icon: Search, label: "Lost & Found", value: lostFound.length, color: "from-[#227736] to-[#58b277]", accent: false, trend: "+2", sparkline: [3, 5, 4, 6, 8, 7, 9], shadow: "shadow-[#227736]/30" },
    { icon: FileCheck, label: "Claims", value: claims.length, color: "from-[#f4a228] to-[#b86b0a]", accent: true, trend: "+1", sparkline: [1, 2, 2, 3, 4, 3, 5], shadow: "shadow-[#f4a228]/30" },
  ];

  const quickActions = [
    { icon: Plus, label: "New Complaint", href: "/student/complaints", accent: false },
    { icon: Upload, label: "Report Item", href: "/student/lost-found", accent: true, badge: "NEW" },
    { icon: Bell, label: "Notices", href: "/student/notices", accent: false },
    { icon: Search, label: "Lost & Found", href: "/student/lost-found", accent: true },
  ];

  const statusIcon = (status: string) => {
    if (status === "resolved" || status === "approved") return <CheckCircle2 size={12} className="text-[#227736]" />;
    if (status === "in-progress" || status === "pending") return <Hourglass size={12} className="text-[#f4a228]" />;
    if (status === "submitted") return <CircleDot size={12} className="text-[#5a6e63]" />;
    if (status === "rejected") return <XCircle size={12} className="text-[#dc3545]" />;
    return null;
  };

  const Sparkline = ({ data, accent }: { data: number[]; accent: boolean }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const W = 100, H = 30;
    const points = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - ((v - min) / range) * H }));
    const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    const areaPath = `${path} L ${W} ${H} L 0 ${H} Z`;
    const color = accent ? "#f4a228" : "#227736";
    const gradId = `grad-${accent ? "o" : "g"}-${Math.random().toString(36).slice(2, 6)}`;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8" preserveAspectRatio="none">
        <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.4" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <motion.path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} opacity="0.6" />)}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.005, rotateX: 1, rotateY: -1 }} style={{ transformStyle: "preserve-3d", perspective: 1200 }} className="relative rounded-3xl bg-gradient-to-br from-[#227736] via-[#1c6430] to-[#165127] p-6 md:p-8 text-white shadow-2xl shadow-[#227736]/30 hover:shadow-[0_30px_60px_-20px_rgba(34,119,54,0.5)] overflow-hidden transition-shadow duration-500">
        <GraduationCap size={180} strokeWidth={0.8} className="absolute -bottom-10 -right-6 text-white/[0.06] pointer-events-none select-none" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58b277] opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#58b277]" /></span><span className="text-[10px] font-bold tracking-wider uppercase">Live Dashboard</span></div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {user.name?.split(" ")[0] || "Student"}</h1>
            <p className="mt-2 text-sm text-white/75 flex items-center gap-2 flex-wrap"><span className="inline-flex items-center gap-1"><GraduationCap size={13} className="text-[#f4a228]" />{user.department || "N/A"}</span><span className="w-1 h-1 rounded-full bg-white/40" /><span>Semester {user.semester || "N/A"}</span></p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {[{ icon: Activity, label: "Active", value: complaints.filter(c=>c.status==="submitted").length.toString(), color: "from-[#58b277] to-[#28a745]" }, { icon: Hourglass, label: "Pending", value: complaints.filter(c=>c.status==="in-progress").length.toString(), color: "from-[#f4a228] to-[#e08a10]" }, { icon: CheckCircle2, label: "Done", value: complaints.filter(c=>c.status==="resolved").length.toString(), color: "from-[#227736] to-[#1c6430]" }].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }} whileHover={{ y: -4, scale: 1.05 }} className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 min-w-[88px] text-center shadow-lg shadow-black/10 hover:shadow-xl hover:border-white/30 transition-all duration-300 cursor-default">
                  <Icon size={14} className="text-white/60 mx-auto mb-1" />
                  <p className={`text-2xl font-extrabold bg-gradient-to-br ${s.color} bg-clip-text text-transparent tracking-tight`}>{s.value}</p>
                  <p className="text-[9px] text-white/70 uppercase tracking-wider font-bold mt-0.5">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const trendUp = s.trend.startsWith("+");
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: -2 }} style={{ transformStyle: "preserve-3d", perspective: 1000 }} className={`group relative bg-white rounded-2xl border border-[#e2ebe6] p-5 transition-all duration-500 cursor-default overflow-hidden ${s.accent ? "hover:border-[#f4a228]/50 hover:shadow-[0_25px_50px_-20px_rgba(244,162,40,0.4)]" : "hover:border-[#227736]/40 hover:shadow-[0_25px_50px_-20px_rgba(34,119,54,0.4)]"}`}>
              <div className="relative flex items-center justify-between mb-3">
                <motion.div whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }} transition={{ duration: 0.5 }} className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md ${s.shadow} group-hover:shadow-xl transition-shadow duration-500`}><Icon size={20} strokeWidth={2.2} /></motion.div>
                <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${trendUp ? "bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]" : "bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/40"}`}><TrendingUp size={9} className={trendUp ? "" : "rotate-180"} />{s.trend}</span>
              </div>
              <p className="relative text-3xl font-extrabold text-[#0f1d17] tracking-tight">{s.value}</p>
              <p className="relative text-[10px] text-[#5a6e63] font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
              <div className="relative mt-3 -mx-1"><Sparkline data={s.sparkline} accent={s.accent} /></div>
            </motion.div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((q, i) => {
          const Icon = q.icon;
          return (
            <Link key={q.label} href={q.href}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} whileHover={{ y: -8, scale: 1.04, rotateX: 3 }} whileTap={{ scale: 0.97 }} className={`group relative overflow-hidden rounded-2xl bg-white border p-5 aspect-square flex flex-col items-center justify-center transition-all duration-500 ${q.accent ? "border-[#f4a228]/30 hover:border-[#f4a228]/60 hover:shadow-[0_25px_50px_-15px_rgba(244,162,40,0.45)]" : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-[0_25px_50px_-15px_rgba(34,119,54,0.45)]"}`}>
                <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} transition={{ duration: 0.5 }} className={`relative w-14 h-14 rounded-2xl mb-3 flex items-center justify-center transition-all duration-500 ${q.accent ? "bg-[#fdf7ef] border border-[#f4a228]/30 group-hover:bg-[#f4a228]" : "bg-[#eaf6ee] border border-[#c8e6d1] group-hover:bg-[#227736]"}`}><Icon size={24} className={q.accent ? "text-[#f4a228] group-hover:text-white" : "text-[#227736] group-hover:text-white"} /></motion.div>
                <span className="relative text-xs font-bold text-[#0f1d17] text-center">{q.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* NOTICES & ACTIVITY */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#e2ebe6] p-6">
          <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-lg flex items-center gap-2.5 text-[#0f1d17]"><div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center"><Bell size={15} className="text-[#227736]" /></div>Latest Notices</h2><Link href="/student/notices" className="group text-xs md:text-sm text-[#227736] font-semibold flex items-center gap-1">See all<ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></Link></div>
          <div className="space-y-3">
            {recentNotices.length === 0 ? <p className="text-sm text-gray-500">No notices yet.</p> : recentNotices.map((n, i) => (
              <Link key={n.id} href={`/student/notices/${n.id}`}>
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} whileHover={{ x: 6, scale: 1.01 }} className="group p-4 rounded-xl border border-[#e2ebe6] hover:border-[#227736]/40 hover:bg-gradient-to-r hover:from-[#f8faf9] hover:to-white transition-all duration-500 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#227736] to-[#28a745] flex items-center justify-center shrink-0 shadow-md shadow-[#227736]/30"><Bell size={18} className="text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">{n.pinned && <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/40"><Pin size={8} /> Pinned</span>}<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">{n.category}</span></div>
                    <h3 className="font-semibold text-sm text-[#0f1d17] line-clamp-1">{n.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-[#5a6e63] mt-1.5"><span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(n.createdAt)}</span>{n.deadline && <span className="flex items-center gap-1 text-[#f4a228] font-semibold"><Sparkles size={10} /> {daysLeft(n.deadline)}d left</span>}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Donut Chart (ab static value ki jagah real counts hain) */}
        <div className="rounded-2xl bg-white border border-[#e2ebe6] p-6">
          <div className="flex items-center gap-2.5 mb-5"><div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center"><Activity size={15} className="text-[#227736]" /></div><h2 className="font-bold text-lg text-[#0f1d17]">Activity</h2></div>
          <div className="relative flex items-center justify-center my-4">
            <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f4f2" strokeWidth="14" />
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="#227736" strokeWidth="14" strokeLinecap="round" strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 * (1 - (notices.length / Math.max(notices.length + complaints.length + claims.length, 1))) }} transition={{ duration: 1.2, delay: 0.2 }} />
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="#f4a228" strokeWidth="14" strokeLinecap="round" strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 * (1 - (complaints.length / Math.max(notices.length + complaints.length + claims.length, 1))) }} transition={{ duration: 1.2, delay: 0.4 }} style={{ transform: "rotate(162deg)", transformOrigin: "60px 60px" }} />
              <motion.circle cx="60" cy="60" r="50" fill="none" stroke="#58b277" strokeWidth="14" strokeLinecap="round" strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 * (1 - (claims.length / Math.max(notices.length + complaints.length + claims.length, 1))) }} transition={{ duration: 1.2, delay: 0.6 }} style={{ transform: "rotate(270deg)", transformOrigin: "60px 60px" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="text-3xl font-extrabold text-[#0f1d17]">{notices.length + complaints.length + claims.length}</p><p className="text-[9px] text-[#5a6e63] uppercase tracking-wider font-bold">Total</p></div>
          </div>
          <div className="space-y-2 mt-4">
            {[{ icon: Bell, label: "Notices", count: notices.length, color: "#227736" }, { icon: MessageSquare, label: "Complaints", count: complaints.length, color: "#f4a228" }, { icon: FileCheck, label: "Claims", count: claims.length, color: "#58b277" }].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}><Icon size={10} style={{ color: item.color }} /></div><span className="text-[#5a6e63] font-medium">{item.label}</span></div>
                  <span className="font-bold text-[#0f1d17]">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* COMPLAINTS & LOST & FOUND */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-[#e2ebe6] p-6">
          <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-lg flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30 flex items-center justify-center"><MessageSquare size={15} className="text-[#f4a228]" /></div>Complaints</h2><Link href="/student/complaints" className="text-xs font-semibold text-[#227736] flex items-center gap-1">See all<ArrowRight size={13} /></Link></div>
          <div className="space-y-3">
            {myComplaints.length === 0 ? <p className="text-sm text-gray-500">No complaints yet.</p> : myComplaints.map((c, i) => (
              <Link key={c.id} href={`/student/complaints/${c.id}`}>
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} whileHover={{ x: 4, scale: 1.01 }} className="group p-3 rounded-xl border border-[#e2ebe6] hover:border-[#f4a228]/40 hover:bg-[#fdf7ef]/30 transition-all duration-300 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#fdf7ef] border border-[#f4a228]/30 flex items-center justify-center shrink-0 group-hover:bg-[#f4a228] transition-all"><MessageSquare size={14} className="text-[#f4a228] group-hover:text-white" /></div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-[#0f1d17] line-clamp-1">{c.title}</p><span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${statusColors[c.status] || "bg-gray-100"}`}>{statusIcon(c.status)}{c.status}</span></div>
                  <ArrowRight size={13} className="text-[#b0bfb7] group-hover:text-[#f4a228] group-hover:translate-x-1" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#e2ebe6] p-6">
          <div className="flex items-center justify-between mb-5"><h2 className="font-bold text-lg flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center"><Search size={15} className="text-[#227736]" /></div>Lost & Found</h2><Link href="/student/lost-found" className="text-xs font-semibold text-[#227736] flex items-center gap-1">See all<ArrowRight size={13} /></Link></div>
          <div className="space-y-3">
            {myItems.length === 0 ? <p className="text-sm text-gray-500">No items yet.</p> : myItems.map((it, i) => {
              const isLost = it.type === "lost";
              const Icon = isLost ? Search : Gift;
              return (
                <Link key={it.id} href={`/student/lost-found/${it.id}`}>
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }} whileHover={{ x: 6, scale: 1.01 }} className="group p-3 rounded-xl border border-[#e2ebe6] hover:border-[#227736]/30 hover:bg-[#f8faf9] transition-all duration-300 flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${isLost ? "bg-gradient-to-br from-[#fdf7ef] to-[#f9e6c8] border-[#f4a228]/30 text-[#f4a228]" : "bg-gradient-to-br from-[#eaf6ee] to-[#d4ead9] border-[#c8e6d1] text-[#227736]"}`}><Icon size={18} /></div>
                    <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-[#0f1d17] truncate">{it.title}</p><p className="text-[10px] text-[#5a6e63] truncate flex items-center gap-1"><MapPin size={9} /> {it.location || "N/A"}</p></div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase ${isLost ? "bg-[#fdf7ef] text-[#b86b0a] border-[#f4a228]/40" : "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"}`}>{it.type}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}