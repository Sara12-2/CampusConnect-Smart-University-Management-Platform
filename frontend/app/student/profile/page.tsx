"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Mail, Hash, Edit3, Save, User, Phone, MapPin,
  GraduationCap, Shield, Sparkles, Camera, Check,
  Calendar, BadgeCheck, X,
} from "lucide-react";

const mockUser = {
  id: "s1",
  name: "Sara Manzoor",
  email: "sara@campusconnect.edu",
  role: "student",
  department: "Computer Science",
  semester: 5,
  phone: "+92 300 1234567",
  location: "Lahore, Pakistan",
  joinedAt: "2024-09-15",
};

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    department: mockUser.department,
    semester: mockUser.semester,
    phone: mockUser.phone,
    location: mockUser.location,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    form.name,
    form.email,
    form.department,
    form.semester,
    form.phone,
    form.location,
  ];
  const filledCount = fields.filter(Boolean).length;
  const completion = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ==================== PROFILE HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-white border border-[#e8eeea]
          shadow-sm hover:shadow-md transition-shadow duration-500
          overflow-hidden"
      >
        {/* Top green strip */}
        <div className="relative h-28 bg-gradient-to-r from-[#227736] via-[#2d8f45] to-[#227736] overflow-hidden">
          {/* Mesh */}
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Soft glow */}
          <motion.div
            animate={{ x: [0, 20, 0], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 right-0 w-64 h-64 rounded-full
              bg-[#f4a228]/30 blur-3xl pointer-events-none"
          />

          {/* Edit button */}
          <div className="absolute top-3 right-3 z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(!editing)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-[11px] font-bold backdrop-blur-md border transition-all duration-300
                ${
                  editing
                    ? "bg-white/20 border-white/30 text-white hover:bg-white/30"
                    : "bg-white/90 border-white/40 text-[#227736] hover:bg-white shadow-sm"
                }`}
            >
              {editing ? (
                <>
                  <X size={12} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={12} />
                  Edit
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Avatar + Info — proper spacing */}
        <div className="relative px-6 pb-6">
          {/* Avatar — absolutely positioned, no overlap */}
          <div className="relative -mt-14 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.03 }}
              className="relative group w-fit"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl
                bg-gradient-to-br from-[#eaf6ee] to-[#c8e6d1]
                ring-4 ring-white shadow-md
                overflow-hidden">

                {/* Girl avatar SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#eaf6ee" />
                  <ellipse cx="50" cy="58" rx="27" ry="29" fill="#1c6430" />
                  <circle cx="50" cy="54" r="20" fill="#f4d1a8" />
                  <path
                    d="M 30 47 Q 30 27, 50 24 Q 70 27, 70 47 Q 68 40, 60 38 Q 50 36, 40 38 Q 32 40, 30 47 Z"
                    fill="#1c6430"
                  />
                  <path d="M 28 52 Q 24 57, 26 64 Q 28 62, 30 57 Z" fill="#165127" />
                  <path d="M 72 52 Q 76 57, 74 64 Q 72 62, 70 57 Z" fill="#165127" />
                  <ellipse cx="43" cy="52" rx="1.8" ry="2.2" fill="#0f1d17" />
                  <ellipse cx="57" cy="52" rx="1.8" ry="2.2" fill="#0f1d17" />
                  <circle cx="43.5" cy="51.4" r="0.6" fill="white" />
                  <circle cx="57.5" cy="51.4" r="0.6" fill="white" />
                  <ellipse cx="38" cy="59" rx="3" ry="1.5" fill="#f4a228" opacity="0.35" />
                  <ellipse cx="62" cy="59" rx="3" ry="1.5" fill="#f4a228" opacity="0.35" />
                  <path
                    d="M 45 62 Q 50 65, 55 62"
                    stroke="#8a3f08"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Verified badge */}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                    bg-[#227736] ring-4 ring-white
                    flex items-center justify-center shadow-sm"
                >
                  <BadgeCheck size={13} className="text-white" strokeWidth={2.5} />
                </motion.span>

                {/* Camera overlay */}
                <motion.button
                  animate={{ opacity: editing ? 1 : 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Change avatar"
                >
                  <Camera size={20} className="text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Info below avatar — clean separation */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            {/* Name + Completion ring in one row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1d17] tracking-tight truncate">
                  {form.name}
                </h1>

                <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-[#5a6e63]">
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={12} className="text-[#227736]" />
                    {form.department}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#c8e6d1]" />
                  <span>Semester {form.semester}</span>
                  <span className="w-1 h-1 rounded-full bg-[#c8e6d1]" />
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} className="text-[#f4a228]" />
                    Joined{" "}
                    {new Date(mockUser.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Completion ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="hidden sm:flex flex-col items-center gap-1 shrink-0"
              >
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                    <circle
                      cx="30" cy="30" r="24"
                      fill="none"
                      stroke="#e8eeea"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="30" cy="30" r="24"
                      fill="none"
                      stroke="url(#ringGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="151"
                      initial={{ strokeDashoffset: 151 }}
                      animate={{ strokeDashoffset: 151 * (1 - completion / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#227736" />
                        <stop offset="100%" stopColor="#f4a228" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-[#0f1d17] tabular-nums">
                      {completion}%
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#5a6e63] uppercase tracking-wider">
                  Complete
                </span>
              </motion.div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                px-2.5 py-1 rounded-full bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1]">
                <Shield size={9} />
                {mockUser.role}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                px-2.5 py-1 rounded-full bg-[#fdf7ef] text-[#b86b0a] border border-[#f4a228]/30">
                <Sparkles size={9} />
                Verified
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ==================== SUCCESS TOAST ==================== */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-[#eaf6ee] border border-[#c8e6d1] shadow-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-8 h-8 rounded-lg bg-[#227736] flex items-center justify-center shrink-0"
            >
              <Check size={16} className="text-white" strokeWidth={3} />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-[#0f1d17]">Profile updated</p>
              <p className="text-xs text-[#5a6e63]">Your changes have been saved</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== CONTACT INFO ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid sm:grid-cols-2 gap-3"
      >
        <ContactCard icon={Mail} label="Email" value={form.email} accent={false} />
        <ContactCard icon={Phone} label="Phone" value={form.phone} accent={true} />
        <ContactCard icon={GraduationCap} label="Department" value={form.department} accent={false} />
        <ContactCard icon={MapPin} label="Location" value={form.location} accent={true} />
      </motion.div>

      {/* ==================== EDIT FORM ==================== */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSave}
              className="relative rounded-2xl bg-white border border-[#e8eeea]
                shadow-sm overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-[#227736] via-[#58b277] to-[#f4a228]" />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#eaf6ee] border border-[#c8e6d1]
                    flex items-center justify-center">
                    <User size={18} className="text-[#227736]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0f1d17] text-sm">
                      Edit Information
                    </h2>
                    <p className="text-xs text-[#5a6e63] mt-0.5">
                      Update your details below
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    icon={User}
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />

                  <FormField
                    icon={Mail}
                    label="Email Address"
                    value={form.email}
                    onChange={() => {}}
                    locked
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      icon={GraduationCap}
                      label="Department"
                      value={form.department}
                      onChange={(v) => setForm({ ...form, department: v })}
                    />
                    <FormField
                      icon={Hash}
                      label="Semester"
                      value={String(form.semester)}
                      onChange={(v) =>
                        setForm({ ...form, semester: parseInt(v) || 0 })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      icon={Phone}
                      label="Phone Number"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                    />
                    <FormField
                      icon={MapPin}
                      label="Location"
                      value={form.location}
                      onChange={(v) => setForm({ ...form, location: v })}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#e8eeea] flex items-center gap-3 flex-wrap">
                  <motion.button
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                      bg-[#227736] text-white text-sm font-bold
                      shadow-md shadow-[#227736]/20
                      hover:bg-[#1c6430] hover:shadow-lg hover:shadow-[#227736]/30
                      transition-all duration-300 overflow-hidden group"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700
                      bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <Save size={14} className="relative" />
                    <span className="relative">Save Changes</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                      text-sm font-bold text-[#5a6e63]
                      hover:bg-[#f8faf9] hover:text-[#0f1d17]
                      transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   CONTACT CARD
   ============================================================ */

function ContactCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative rounded-2xl bg-white border border-[#e8eeea]
        p-4 flex items-center gap-3
        hover:border-[#227736]/30 hover:shadow-md hover:shadow-[#227736]/5
        transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${
            accent
              ? "bg-[#fdf7ef] border border-[#f4a228]/30"
              : "bg-[#eaf6ee] border border-[#c8e6d1]"
          }`}
      >
        <Icon size={17} className={accent ? "text-[#f4a228]" : "text-[#227736]"} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#5a6e63]">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#0f1d17] truncate mt-0.5">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   FORM FIELD
   ============================================================ */

function FormField({
  icon: Icon,
  label,
  value,
  onChange,
  locked,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (v: string) => void;
  locked?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider
        text-[#5a6e63] mb-1.5">
        {label}
        {locked && (
          <span className="inline-flex items-center gap-1 text-[9px] text-[#b86b0a]
            bg-[#fdf7ef] border border-[#f4a228]/30 px-1.5 py-0.5 rounded-full normal-case">
            <Shield size={8} /> Locked
          </span>
        )}
      </label>

      <div className="relative">
        <div
          className={`absolute left-3 top-1/2 -translate-y-1/2
            w-8 h-8 rounded-lg flex items-center justify-center
            transition-all duration-300
            ${
              locked
                ? "bg-[#f8faf9] border border-[#e8eeea]"
                : "bg-[#eaf6ee] border border-[#c8e6d1]"
            }`}
        >
          <Icon size={14} className={locked ? "text-[#b0bfb7]" : "text-[#227736]"} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          className={`w-full pr-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300 outline-none
            ${
              locked
                ? "bg-[#f8faf9] text-[#5a6e63] border border-[#e8eeea] cursor-not-allowed"
                : "bg-white text-[#0f1d17] border border-[#e8eeea] hover:border-[#c8e6d1] focus:border-[#227736] focus:ring-3 focus:ring-[#227736]/10"
            }`}
          style={{ paddingLeft: "3.25rem" }}
        />
      </div>
    </motion.div>
  );
}