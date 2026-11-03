"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User as UserIcon,
  Minimize2,
  RotateCcw,
  Sparkles,
  Bell,
  FileText,
  Search,
  GraduationCap,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  sources?: string[];
  mode?: string;
}

const WELCOME_QUOTES = [
  "How can I help you navigate CampusConnect today?",
  "Ask about exams, scholarships, campus policies, or lodge complaints in English.",
  "Need help finding a lost item or checking the latest department notices?",
  "I am your official CampusConnect English AI guide. How can I assist you today?",
];

const SUGGESTION_CARDS = [
  {
    icon: Bell,
    title: "Exam Schedule",
    subtitle: "When is the midterm examination?",
    prompt: "What is the exam schedule?",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: FileText,
    title: "Lodge Complaint",
    subtitle: "How to report Wi-Fi or electricity issues",
    prompt: "How do I submit a complaint?",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Search,
    title: "Lost & Found",
    subtitle: "How to claim or report lost property",
    prompt: "How do I claim a lost item?",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    subtitle: "Eligibility criteria & CGPA rules",
    prompt: "Tell me about scholarship criteria and deadlines",
    color: "from-purple-500 to-pink-600",
  },
];

function renderInline(text: string): React.ReactNode {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldText = part.slice(2, -2).replace(/\*/g, "").trim();
      return (
        <strong key={i} className="font-semibold text-[#0f1d17]">
          {boldText}
        </strong>
      );
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

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <div key={idx} className="my-1.5 border-t border-emerald-100" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <div key={idx} className="font-bold text-[#144722] text-xs sm:text-sm mt-2 mb-0.5">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </div>
          );
        }

        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          return (
            <div key={idx} className="font-bold text-[#144722] text-sm sm:text-base mt-2 mb-0.5">
              {renderInline(trimmed.replace(/^#{1,2}\s+/, ""))}
            </div>
          );
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

        return (
          <p key={idx} className="my-0.5">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [welcomeQuoteIdx, setWelcomeQuoteIdx] = useState(0);

  // Gemini Connectivity State
  const [geminiConnected, setGeminiConnected] = useState<boolean | null>(null);
  const [geminiModel, setGeminiModel] = useState<string>("gemini-flash-lite-latest");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Test Google Gemini Connectivity
  const runConnectivityTest = async () => {
    setTestingConnection(true);
    setConnectionMessage("Testing Gemini API connection...");
    try {
      const res = await fetch("/api/chat/test");
      const data = await res.json();
      if (res.ok && data.connected) {
        setGeminiConnected(true);
        setGeminiModel(data.displayName || data.model || "Gemini 2.5 Flash");
        setConnectionMessage(`✅ Connected to ${data.displayName || data.model} (${data.latencyMs}ms)`);
      } else {
        setGeminiConnected(false);
        setConnectionMessage(`❌ Gemini Error: ${data.error || "Connection failed"}`);
      }
    } catch (err: any) {
      setGeminiConnected(false);
      setConnectionMessage(`❌ Connectivity test failed: ${err.message}`);
    } finally {
      setTestingConnection(false);
      setTimeout(() => setConnectionMessage(null), 5000);
    }
  };

  // Initial check on mount
  useEffect(() => {
    runConnectivityTest();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    if (open) {
      setWelcomeQuoteIdx(Math.floor(Math.random() * WELCOME_QUOTES.length));
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      time: now(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      // Connect to Gemini chat route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API returned ${response.status}`);
      }

      setGeminiConnected(true);

      const rawSources = Array.isArray(data.sources) ? data.sources : [];
      // Clean sources: filter out model names and tech terms
      const cleanSources = rawSources.filter((s: string) => {
        const lower = (s || "").toLowerCase();
        return (
          !lower.includes("gemini") &&
          !lower.includes("google") &&
          !lower.includes("backend rag") &&
          !lower.includes("flash")
        );
      });

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: data.reply || "Sorry, I could not generate a reply.",
        time: now(),
        sources: cleanSources,
        mode: data.mode || "verified",
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      setGeminiConnected(false);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: `⚠️ **Connection Error**: Unable to get reply from Google Gemini API.\n\n*Error details:* ${err.message || "Failed to reach Gemini API"}.\n\nPlease check your internet connection or verify your \`GEMINI_API_KEY\` setting.`,
        time: now(),
        sources: [],
        mode: "error",
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
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
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#227736] text-white shadow-2xl shadow-[#227736]/40 flex items-center justify-center hover:bg-[#1c6430] transition-colors duration-300 group overflow-hidden"
            aria-label="Open chat"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,#f4a228,transparent)] opacity-40"
            />
            <MessageSquare size={24} className="relative z-10" />

            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4a228] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#f4a228]" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== CHAT WINDOW ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: minimized ? 64 : 580,
            }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[410px] rounded-3xl bg-white shadow-2xl border border-[#c8e6d1]/60 flex flex-col overflow-hidden"
          >
            {/* ============ HEADER ============ */}
            <div className="bg-gradient-to-r from-[#227736] via-[#1c6430] to-[#144722] text-white p-3.5 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div className="flex items-center gap-2.5 relative z-10">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
                    <Sparkles size={18} className="text-[#f4a228]" />
                  </div>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#227736]",
                      geminiConnected ? "bg-[#58b277]" : "bg-amber-400"
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm tracking-tight text-white">
                      CampusConnect AI
                    </p>
                    {geminiConnected === true ? (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/35 tracking-wider flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Gemini Live
                      </span>
                    ) : geminiConnected === false ? (
                      <span
                        className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 tracking-wider flex items-center gap-1 cursor-help"
                        title="Gemini API is not connected. Click test connection."
                      >
                        <AlertCircle size={10} className="text-amber-300" />
                        Key Disconnected
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-full bg-white/15 text-white/80 tracking-wider flex items-center gap-1">
                        <Activity size={10} className="animate-spin" />
                        Connecting...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 flex items-center gap-1">
                    English AI Campus Assistant
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-1 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={runConnectivityTest}
                  disabled={testingConnection}
                  title="Test Gemini API Connection"
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                  aria-label="Test Connection"
                >
                  <RefreshCw size={14} className={cn(testingConnection && "animate-spin")} />
                </motion.button>
                {messages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    title="New Chat"
                    className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                    aria-label="New Chat"
                  >
                    <RotateCcw size={15} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMinimized((v) => !v)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </motion.button>
              </div>
            </div>

            {/* Connection Status Toast / Banner */}
            {connectionMessage && (
              <div className="bg-emerald-800 text-white text-[11px] px-3 py-1.5 flex items-center justify-between border-b border-emerald-700/60">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <Activity size={12} className="text-[#f4a228] shrink-0" />
                  {connectionMessage}
                </span>
                <button
                  onClick={() => setConnectionMessage(null)}
                  className="text-white/70 hover:text-white ml-2 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ============ BODY ============ */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8faf9]">
                  {/* ====== WELCOME SCREEN ====== */}
                  {messages.length === 0 ? (
                    <div className="py-2 px-1 flex flex-col justify-between h-full">
                      {/* Greeting Headline */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center pt-2 pb-4"
                      >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#227736] text-xs font-semibold mb-3 shadow-xs">
                          <Sparkles size={13} className="text-[#f4a228]" />
                          <span>CampusConnect AI Assistant</span>
                        </div>

                        <h3 className="text-xl font-extrabold text-[#0f1d17] tracking-tight">
                          {greeting}, <span className="bg-gradient-to-r from-[#227736] via-[#28a745] to-[#f4a228] bg-clip-text text-transparent">Scholar</span> 👋
                        </h3>
                        <p className="text-xs text-[#5a6e63] mt-1.5 px-4 leading-relaxed font-medium">
                          {WELCOME_QUOTES[welcomeQuoteIdx]}
                        </p>
                      </motion.div>

                      {/* Interactive Prompt Cards */}
                      <div className="grid grid-cols-2 gap-2 my-2">
                        {SUGGESTION_CARDS.map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <motion.button
                              key={card.title}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + idx * 0.06 }}
                              whileHover={{ y: -3, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSend(card.prompt)}
                              className="text-left p-3 rounded-2xl bg-white border border-[#e2ebe6] hover:border-[#227736] hover:shadow-md hover:shadow-[#227736]/10 transition-all duration-200 group flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className={cn("w-7 h-7 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-xs", card.color)}>
                                  <Icon size={14} />
                                </div>
                                <span className="text-[10px] text-[#227736] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ask →
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#0f1d17] group-hover:text-[#227736] transition-colors">
                                  {card.title}
                                </p>
                                <p className="text-[10px] text-[#5a6e63] mt-0.5 line-clamp-1">
                                  {card.subtitle}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Connectivity verification */}
                      <div className="mt-3 text-center">
                        <button
                          onClick={runConnectivityTest}
                          disabled={testingConnection}
                          className="text-[11px] text-[#5a6e63] hover:text-[#227736] transition-colors inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={12} className={cn(geminiConnected ? "text-emerald-600" : "text-amber-500")} />
                          <span>Status: {geminiConnected ? "Gemini Connected & Ready" : "Check Connection"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ====== ACTIVE MESSAGE LIST ====== */
                    messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.35,
                          delay: idx === messages.length - 1 ? 0.05 : 0,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={cn(
                          "flex items-end gap-2",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "bot" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-[#227736] to-[#28a745] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#227736]/25"
                          >
                            <Bot size={13} />
                          </motion.div>
                        )}

                        <motion.div
                          whileHover={{ y: -1 }}
                          className={cn(
                            "max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-[#227736] text-white rounded-br-md shadow-md shadow-[#227736]/25 whitespace-pre-line"
                              : msg.mode === "error"
                              ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-md shadow-xs"
                              : "bg-white text-[#0f1d17] border border-[#e2ebe6] rounded-bl-md shadow-xs"
                          )}
                        >
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <FormattedMessage content={msg.content} />
                          )}

                          {/* Grounded Official Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-emerald-100 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-semibold text-[#1c6430] flex items-center">
                                📚 Official Sources:
                              </span>
                              {msg.sources.map((src, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-emerald-50 text-[#144722] font-medium px-2 py-0.5 rounded-md border border-emerald-200/80"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                          )}

                          <div
                            className={cn(
                              "text-[10px] mt-2 flex items-center gap-2",
                              msg.role === "user" ? "justify-end opacity-70" : "justify-between"
                            )}
                          >
                            {msg.role === "bot" && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1",
                                  msg.mode === "error"
                                    ? "bg-red-100 text-red-800 border-red-300"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                )}
                              >
                                {msg.mode === "error" ? "⚠️ Error" : "🟢 CampusConnect AI"}
                              </span>
                            )}
                            <span className="opacity-60">{msg.time}</span>
                          </div>
                        </motion.div>

                        {msg.role === "user" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                            className="w-7 h-7 rounded-full bg-[#eaf6ee] text-[#227736] flex items-center justify-center shrink-0 border border-[#c8e6d1]"
                          >
                            <UserIcon size={13} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}

                  {/* Typing Indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#227736] to-[#28a745] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#227736]/25">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Bot size={13} />
                        </motion.div>
                      </div>
                      <div className="bg-white border border-[#e2ebe6] rounded-2xl rounded-bl-md px-4 py-3 shadow-xs">
                        <div className="flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{
                                y: [0, -5, 0],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                              }}
                              className="w-1.5 h-1.5 rounded-full bg-[#227736]"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ============ FOOTER / INPUT ============ */}
                <div className="border-t border-[#e2ebe6] p-3 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask CampusConnect Assistant in English..."
                        rows={1}
                        className="w-full resize-none rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-3.5 py-2.5 text-xs sm:text-sm outline-none text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-3 focus:ring-[#227736]/10 transition-all duration-200 placeholder:text-[#5a6e63] max-h-24"
                        style={{ minHeight: 40 }}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleSend()}
                      disabled={!input.trim() || typing}
                      className="relative w-10 h-10 rounded-xl bg-[#227736] hover:bg-[#1c6430] text-white flex items-center justify-center shadow-md shadow-[#227736]/25 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none shrink-0 overflow-hidden group"
                      aria-label="Send"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <Send size={16} className="relative z-10" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between mt-2 px-1">
                    <button
                      onClick={clearChat}
                      className="flex items-center gap-1 text-[10px] text-[#5a6e63] hover:text-[#227736] font-medium transition-colors"
                    >
                      <RotateCcw size={10} />
                      New chat
                    </button>
                    <span className="text-[10px] text-[#5a6e63] font-medium flex items-center gap-1">
                      <Sparkles size={10} className="text-[#f4a228]" />
                      CampusConnect Assistant
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