"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, User as UserIcon, Minimize2,
  RotateCcw, Sparkles, Bell, FileText, Search, GraduationCap,
  AlertCircle, CheckCircle2, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFallbackReply } from "./mockReplies";

/* ============================================================
   UPDATED CUSTOM 3D ROBOT MASCOT (More Robotic Feel)
   ============================================================ */
const BotMascot = ({ size = 160 }: { size?: number }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="drop-shadow-2xl"
    >
      <defs>
        {/* Metallic Gradients */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3ca35d" />
          <stop offset="100%" stopColor="#1c6430" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2c3e34" />
          <stop offset="100%" stopColor="#1a2620" />
        </linearGradient>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Glow */}
      <circle cx="100" cy="110" r="75" fill="#eaf6ee" opacity="0.6" />

      {/* Side Antennas */}
      <line x1="40" y1="80" x2="25" y2="60" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="25" cy="60" r="5" fill="#E67E22" filter="url(#glow)" />
      
      <line x1="160" y1="80" x2="175" y2="60" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="175" cy="60" r="5" fill="#E67E22" filter="url(#glow)" />

      {/* Top Antenna */}
      <line x1="100" y1="50" x2="100" y2="35" stroke="url(#metalGrad)" strokeWidth="5" strokeLinecap="round" />
      <motion.circle 
        cx="100" cy="28" r="7" 
        fill="#E67E22" 
        filter="url(#glow)"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main Body Base (Ears/Side panels) */}
      <rect x="35" y="85" width="20" height="40" rx="8" fill="url(#metalGrad)" />
      <rect x="145" y="85" width="20" height="40" rx="8" fill="url(#metalGrad)" />

      {/* Main Robot Head */}
      <rect x="50" y="55" width="100" height="90" rx="30" fill="url(#bodyGrad)" />
      
      {/* 3D Highlight on Head */}
      <path d="M65 60 Q100 55 135 60" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" opacity="0.4" />

      {/* Visor / Face Screen */}
      <rect x="65" y="75" width="70" height="50" rx="15" fill="url(#visorGrad)" stroke="#111827" strokeWidth="2" />
      
      {/* Glowing Eyes */}
      <motion.g
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
      >
        <rect x="80" y="90" width="12" height="20" rx="6" fill="#4ade80" filter="url(#glow)" />
        <rect x="108" y="90" width="12" height="20" rx="6" fill="#4ade80" filter="url(#glow)" />
      </motion.g>

      {/* Robot Mouth */}
      <rect x="90" y="115" width="20" height="4" rx="2" fill="#4ade80" opacity="0.8" />

      {/* Graduation Cap (3D) */}
      <path d="M50 60L100 35L150 60L100 85L50 60Z" fill="url(#capGrad)" />
      <path d="M100 85V100" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="103" r="5" fill="#f59e0b" filter="url(#glow)" />
      
      {/* Cap Base/Top detail */}
      <path d="M70 47.5L100 62L130 47.5" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
};

/* ============================================================
   UNIVERSITY LOGO (For Header and Messages)
   ============================================================ */
const UniLogo = ({ size = 30, className = "" }: { size?: number; className?: string }) => {
  return (
    <img
      src="/logo.png" // <-- Yahan apni file ka naam likhein
      alt="University Logo"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
};

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  sources?: string[];
  mode?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const WELCOME_QUOTES = [
  "How can I help you navigate CampusConnect today?",
  "Ask about exams, scholarships, campus policies, or lodge complaints in English.",
  "Need help finding a lost item or checking the latest department notices?",
  "I am your official CampusConnect English AI guide. How can I assist you today?",
];

const SUGGESTION_CARDS = [
  { icon: Bell, title: "Exam Schedule", subtitle: "Midterm exam dates", prompt: "What is the exam schedule?" },
  { icon: FileText, title: "Lodge Complaint", subtitle: "Report issues", prompt: "How do I submit a complaint?" },
  { icon: Search, title: "Lost & Found", subtitle: "Claim lost property", prompt: "How do I claim a lost item?" },
  { icon: GraduationCap, title: "Scholarships", subtitle: "Criteria & deadlines", prompt: "Tell me about scholarship criteria and deadlines" },
];

/* ============================================================
   INLINE MARKDOWN PARSER
   ============================================================ */
function renderInline(text: string): React.ReactNode {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldText = part.slice(2, -2).replace(/\*/g, "").trim();
      return <strong key={i} className="font-semibold text-[#0f1d17]">{boldText}</strong>;
    }
    const cleaned = part.replace(/\*+/g, "");
    return <span key={i}>{cleaned}</span>;
  });
}

function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") return <div key={idx} className="my-1.5 border-t border-[#e2ebe6]" />;

        if (trimmed.startsWith("### ")) {
          return <div key={idx} className="font-bold text-[#1c6430] text-xs sm:text-sm mt-2 mb-0.5">{renderInline(trimmed.replace(/^###\s+/, ""))}</div>;
        }
        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          return <div key={idx} className="font-bold text-[#1c6430] text-sm sm:text-base mt-2 mb-0.5">{renderInline(trimmed.replace(/^#{1,2}\s+/, ""))}</div>;
        }
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^[\*\-•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-[#227736] font-bold select-none leading-tight">•</span>
              <span className="flex-1">{renderInline(bulletText)}</span>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+\.)\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="font-bold text-[#227736] select-none leading-tight">{numMatch[1]}</span>
              <span className="flex-1">{renderInline(numMatch[2])}</span>
            </div>
          );
        }
        return <p key={idx} className="my-0.5">{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

/* ============================================================
   STRICT ENGLISH QUERY CHECK
   ============================================================ */
function isRomanUrduOrNonEnglish(text: string): boolean {
  if (!text) return false;
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) return true;

  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = new Set(cleaned.split(/\s+/).filter(Boolean));

  const strongIndicators = [
    "kya", "kia", "kaise", "kese", "kaisay", "kesay", "kyun", "kyu", "kyn", "kahan", "kidhar", "kab",
    "konsa", "konsi", "konse", "kon", "kaun", "batao", "batayein", "bataye", "bataiye", "btao", "btain", "batana",
    "chahiye", "chahye", "mujhe", "mjhe", "mjy", "hamara", "humara", "hamari", "shikayat", "shikayaat",
    "wazifa", "wazaif", "gumshuda", "rabta", "auqat", "masla", "maslay", "masail", "karein", "karen",
    "sakte", "saktay", "sakta", "sakti", "parhai", "dakhla", "chutti", "chuttiyan", "samjhao", "karo", "kijiye", "dijiye"
  ];
  for (const ind of strongIndicators) { if (words.has(ind)) return true; }

  const particles = [
    "hai", "hain", "hyn", "hy", "hoon", "hun", "tha", "thi", "thay", "hoga", "hogi", "honge", "hongay",
    "mera", "meri", "mere", "meray", "tera", "teri", "tere", "teray", "apna", "apne", "apni", "aapna", "aapne", "aapni",
    "uska", "uski", "unka", "unki", "inka", "iski", "aap", "tum", "karna", "karta", "karti", "karte", "kartay", "karun", "karu",
    "nahi", "nhi", "nahin", "mat", "bhi", "bhe", "wale", "wali", "wala", "walay", "baare", "bare", "baray",
    "ke", "ki", "ko", "se", "sy", "mein", "mai", "ka", "kitna", "kitne"
  ];
  const count = particles.filter((p) => words.has(p)).length;
  if (count >= 2) return true;
  if (count === 1 && words.size <= 5) return true;

  return false;
}

/* ============================================================
   MAIN CHATBOT COMPONENT
   ============================================================ */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [welcomeQuoteIdx, setWelcomeQuoteIdx] = useState(0);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasCheckedRef = useRef(false);

  const checkBackendOnce = useCallback(async () => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE}/health`, { method: "GET", signal: controller.signal, cache: "no-store" });
      clearTimeout(timeoutId);
      setBackendOnline(res.ok);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      checkBackendOnce();
      setWelcomeQuoteIdx(Math.floor(Math.random() * WELCOME_QUOTES.length));
    }
  }, [open, checkBackendOnce]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    if (isRomanUrduOrNonEnglish(content)) {
      setTimeout(() => {
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "bot",
          content: "Please ask your question in English. CampusConnect Assistant only accepts inquiries in English.",
          time: now(),
          sources: [],
          mode: "verified",
        };
        setMessages((m) => [...m, botMsg]);
        setTyping(false);
      }, 300);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      let reply = "";
      let sources: string[] = [];
      let mode = "rag";
      let backendSuccess = false;

      try {
        const response = await fetch(`${API_BASE}/api/chat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            use_rag: true,
            history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          reply = data.reply || "";
          sources = Array.isArray(data.sources) ? data.sources : [];
          mode = data.mode || "rag";
          backendSuccess = true;
          setBackendOnline(true);
        }
      } catch {}

      if (!backendSuccess) {
        setBackendOnline(false);
        try {
          const nextRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content,
              history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
            }),
            signal: controller.signal,
          });

          if (nextRes.ok) {
            const nextData = await nextRes.json();
            reply = nextData.reply || "";
            sources = Array.isArray(nextData.sources) ? nextData.sources : [];
            mode = "verified";
          }
        } catch {}
      }

      if (!reply) {
        reply = getFallbackReply(content);
        mode = "local";
      }

      const cleanSources = sources.filter((s: string) => {
        const lower = (s || "").toLowerCase();
<<<<<<< Updated upstream
        return (
          !lower.includes("gemini") &&
          !lower.includes("google") &&
          !lower.includes("groq") &&
          !lower.includes("llama") &&
          !lower.includes("backend rag") &&
          !lower.includes("flash")
        );
=======
        return !lower.includes("gemini") && !lower.includes("google") && !lower.includes("backend rag") && !lower.includes("flash");
>>>>>>> Stashed changes
      });

      const botMsg: Message = { id: `b-${Date.now()}`, role: "bot", content: reply, time: now(), sources: cleanSources.slice(0, 2), mode };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: `Unable to reach assistant: ${err.message || "Network error"}. Please verify your connection.`,
        time: now(),
        sources: [],
        mode: "error",
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      clearTimeout(timeoutId);
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setWelcomeQuoteIdx((prev) => (prev + 1) % WELCOME_QUOTES.length);
  };

  return (
    <>
      {/* ==================== FLOATING BUTTON ==================== */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full
              bg-white shadow-[0_10px_30px_-5px_rgba(34,119,54,0.4)]
              flex items-center justify-center hover:bg-[#f8faf9]
              transition-colors duration-300 border border-[#e2ebe6]"
            aria-label="Open chat"
          >
<<<<<<< Updated upstream
            <MessageSquare size={24} />
=======
            <BotMascot size={60} />
>>>>>>> Stashed changes
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== CHAT WINDOW ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0, height: minimized ? 64 : 580 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[400px] rounded-3xl
              bg-white shadow-2xl border border-[#e2ebe6] flex flex-col overflow-hidden"
          >
            {/* ============ HEADER ============ */}
            <div className="bg-gradient-to-r from-[#227736] to-[#1c6430] text-white p-3.5
              flex items-center justify-between shrink-0">

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md
                    flex items-center justify-center border border-white/25 overflow-hidden p-1">
                    <UniLogo size={28} />
                  </div>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#1c6430]",
                      backendOnline === true ? "bg-[#58b277]" : backendOnline === false ? "bg-[#E67E22]" : "bg-white/40"
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight text-white">CampusConnect AI</p>
                    {backendOnline === true ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/35 tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Live
                      </span>
                    ) : backendOnline === false ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-white/15 border border-white/20 tracking-wider">
                        Ready
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-full bg-white/10 tracking-wider opacity-70">
                        Connecting
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/80">English AI Campus Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors" title="Clear chat" aria-label="Clear chat">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setMinimized((v) => !v)} className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors" aria-label="Minimize">
                  <Minimize2 size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors" aria-label="Close">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ============ BODY ============ */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8faf9]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col h-full justify-center items-center text-center space-y-6 py-4">
                      
                      <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
                         <BotMascot size={140} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-extrabold text-[#0f1d17] tracking-tight">
                          Hello, <span className="text-[#227736]">Scholar!</span>
                        </h3>
                        <p className="text-sm text-[#5a6e63] mt-2 px-4 leading-relaxed font-medium">
                          {WELCOME_QUOTES[welcomeQuoteIdx]}
                        </p>
                      </div>

                      {/* 4 Cards in a single row */}
                      <div className="w-full grid grid-cols-4 gap-1.5 px-1 mt-2">
                        {SUGGESTION_CARDS.map((card) => {
                          const Icon = card.icon;
                          return (
                            <button
                              key={card.title}
                              onClick={() => handleSend(card.prompt)}
                              className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-[#e2ebe6] hover:border-[#227736] hover:shadow-md hover:shadow-[#227736]/5 transition-all duration-200 group"
                            >
                              <div className="w-6 h-6 rounded-md bg-[#eaf6ee] border border-[#c8e6d1] flex items-center justify-center mb-1.5 group-hover:bg-[#227736] group-hover:border-[#227736] transition-colors shrink-0">
                                <Icon size={12} className="text-[#227736] group-hover:text-white transition-colors" />
                              </div>
                              <p className="text-[10px] font-bold text-[#0f1d17] group-hover:text-[#227736] transition-colors leading-tight">{card.title}</p>
                            </button>
                          );
                        })}
                      </div>
                      
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.05 : 0 }}
                        className={cn("flex items-end gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                      >
                        {msg.role === "bot" && (
                          <div className="w-7 h-7 rounded-full bg-white border border-[#e2ebe6] shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                             <UniLogo size={24} />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-[#227736] text-white rounded-br-md shadow-sm whitespace-pre-line"
                              : msg.mode === "error"
                                ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-md"
                                : "bg-white text-[#0f1d17] border border-[#e2ebe6] rounded-bl-md shadow-xs"
                          )}
                        >
                          {msg.role === "user" ? msg.content : <FormattedMessage content={msg.content} />}

                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-[#e2ebe6] flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-semibold text-[#227736] flex items-center gap-1">
                                <FileText size={10} /> Official Sources:
                              </span>
                              {msg.sources.map((src, i) => (
                                <span key={i} className="text-[10px] bg-[#f8faf9] text-[#0f1d17] font-medium px-2 py-0.5 rounded-md border border-[#e2ebe6]">
                                  {src}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className={cn("text-[9px] mt-1.5 flex items-center gap-2", msg.role === "user" ? "justify-end opacity-70" : "justify-between")}>
                            {msg.role === "bot" && (
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1",
                                msg.mode === "error" ? "bg-red-100 text-red-800 border-red-300" : "bg-[#eaf6ee] text-[#227736] border-[#c8e6d1]"
                              )}>
                                {msg.mode === "error" ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                                {msg.mode === "error" ? "Error" : "CampusConnect AI"}
                              </span>
                            )}
                            <span className="opacity-60">{msg.time}</span>
                          </div>
                        </div>

                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-[#eaf6ee] text-[#227736] flex items-center justify-center shrink-0 border border-[#c8e6d1]">
                            <UserIcon size={13} />
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}

                  {typing && (
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-7 rounded-full bg-white border border-[#e2ebe6] shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                        <UniLogo size={24} />
                      </div>
                      <div className="bg-white border border-[#e2ebe6] rounded-2xl rounded-bl-md px-4 py-3 shadow-xs">
                        <div className="flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.span key={i} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full bg-[#227736]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ============ FOOTER (Input) ============ */}
                <div className="border-t border-[#e2ebe6] p-3 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask CampusConnect Assistant in English..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-3.5 py-2.5 text-xs sm:text-sm outline-none text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-3 focus:ring-[#227736]/10 transition-all duration-200 placeholder:text-[#5a6e63] max-h-24"
                      style={{ minHeight: 40 }}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || typing}
                      className="w-10 h-10 rounded-xl bg-[#227736] hover:bg-[#1c6430] text-white flex items-center justify-center shadow-sm transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-end mt-1 px-1">
                    <span className="text-[9px] text-[#5a6e63] font-medium flex items-center gap-1 opacity-80">
                      <Sparkles size={9} className="text-[#E67E22]" /> CampusConnect AI
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}