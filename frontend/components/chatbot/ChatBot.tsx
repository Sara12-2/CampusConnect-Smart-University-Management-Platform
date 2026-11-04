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
  HelpCircle,
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
    prompt: "Tell me about scholarship",
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

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <div key={idx} className="my-1.5 border-t border-[#e2ebe6]" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <div key={idx} className="font-bold text-[#1c6430] text-xs sm:text-sm mt-2 mb-0.5">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </div>
          );
        }

        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          return (
            <div key={idx} className="font-bold text-[#1c6430] text-sm sm:text-base mt-2 mb-0.5">
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

/* ============================================================
   MAIN CHATBOT — HYBRID MODE (Real + Mock Fallback)
   ============================================================ */
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

  // Health-check backend API
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch("http://127.0.0.1:8000/health", {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (isMounted) setBackendOnline(res.ok);
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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

  // ============================================================
  // HANDLE SEND — Real backend first, mock fallback second
  // ============================================================
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
      // 1️⃣ TRY REAL BACKEND (Gemini AI + RAG)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          use_rag: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API returned ${response.status}`);
      }
      setBackendOnline(true);

      const data = await response.json();
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: data.reply || "Sorry, I could not generate a reply.",
        time: now(),
        sources: cleanSources,
        mode: data.mode || "verified",
      };
      setMessages((m) => [...m, botMsg]);
    } catch {
      // Offline fallback to intelligent local reply
      setBackendOnline(false);
      const reply = getMockReply(content);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: reply,
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full
              bg-[#227736] text-white shadow-xl shadow-[#227736]/30
              flex items-center justify-center hover:bg-[#1c6430]
              transition-colors duration-300"
            aria-label="Open chat"
          >
            <MessageSquare size={24} />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E67E22] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E67E22]" />
            </span>
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
                    flex items-center justify-center border border-white/25">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#58b277] ring-2 ring-[#227736]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight">
                      CampusConnect AI
                    </p>
                    {backendOnline === true ? (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/35 tracking-wider flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Live RAG
                      </span>
                    ) : backendOnline === false ? (
                      <span
                        className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 tracking-wider flex items-center gap-1 cursor-help"
                        title="Backend API not running. Run run-backend.bat to connect Gemini RAG API."
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                        Offline Mode
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-full bg-white/15 text-white/80 tracking-wider">
                        Connecting...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 flex items-center gap-1">
                    English & Roman Urdu Support
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-1 z-10">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white
                      transition-colors"
                    aria-label="New chat"
                    title="New chat"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  onClick={() => setMinimized((v) => !v)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white
                    transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white
                    transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
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
                  {/* ====== GEMINI / CHATGPT STYLE WELCOME SCREEN ====== */}
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
                          <span>Gemini 2.0 & ChromaDB RAG</span>
                        </div>

                        <h3 className="text-xl font-extrabold text-[#0f1d17] tracking-tight">
                          {greeting}, <span className="bg-gradient-to-r from-[#227736] via-[#28a745] to-[#f4a228] bg-clip-text text-transparent">Scholar</span> 👋
                        </h3>
                        <p className="text-xs text-[#5a6e63] mt-1.5 px-4 leading-relaxed">
                          {WELCOME_QUOTES[welcomeQuoteIdx]}
                        </p>
                      </div>

                      {/* Interactive Prompt Cards Grid (like ChatGPT/Gemini) */}
                      <div className="grid grid-cols-2 gap-2 my-2">
                        {SUGGESTION_CARDS.map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <button
                              key={card.title}
                              onClick={() => handleSend(card.prompt)}
                              className="text-left p-3 rounded-xl bg-white
                                border border-[#e2ebe6] hover:border-[#227736]
                                hover:shadow-md hover:shadow-[#227736]/5
                                transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#eaf6ee]
                                border border-[#c8e6d1]
                                flex items-center justify-center mb-2
                                group-hover:bg-[#227736] group-hover:border-[#227736]
                                transition-colors">
                                <Icon size={13} className="text-[#227736]
                                  group-hover:text-white transition-colors" />
                              </div>
                              <p className="text-xs font-bold text-[#0f1d17]
                                group-hover:text-[#227736] transition-colors">
                                {card.title}
                              </p>
                              <p className="text-[10px] text-[#5a6e63] mt-0.5 line-clamp-1">
                                {card.subtitle}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Roman Urdu Quick Pill */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2 text-center"
                      >
                        <button
                          onClick={() => handleSend("Mai complaint kaise darj karun?")}
                          className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-50 text-[#1c6430] border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all font-medium inline-flex items-center gap-1.5"
                        >
                          <span>🇵🇰 Roman Urdu:</span>
                          <span className="font-semibold underline">Mai complaint kaise darj karun?</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.05 : 0 }}
                        className={cn(
                          "flex items-end gap-2",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "bot" && (
                          <div className="w-7 h-7 rounded-full bg-[#227736] text-white
                            flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={13} />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-[#227736] text-white rounded-br-md shadow-md shadow-[#227736]/25 whitespace-pre-line"
                              : "bg-white text-[#0f1d17] border border-[#e2ebe6] rounded-bl-md shadow-xs"
                          )}
                        >
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <FormattedMessage content={msg.content} />
                          )}

                          {/* Grounded RAG Citations */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-emerald-100 flex flex-wrap gap-1">
                              <span className="text-[10px] font-semibold text-[#227736] flex items-center">
                                📚 Sources:
                              </span>
                              {msg.sources.map((src, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-[#eaf6ee] text-[#1c6430] px-1.5 py-0.5 rounded-md border border-[#c8e6d1]"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                          )}

                          <div
                            className={cn(
                              "text-[9px] mt-1.5 flex items-center gap-2",
                              msg.role === "user" ? "justify-end opacity-70" : "justify-between"
                            )}
                          >
                            {msg.role === "bot" && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1",
                                  msg.mode === "rag"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                )}
                                title={
                                  msg.mode === "rag"
                                    ? "Live Gemini RAG response"
                                    : "Offline fallback response"
                                }
                              >
                                {msg.mode === "rag" ? "🟢 Live Gemini RAG" : "🟡 Offline Assistant"}
                              </span>
                            )}
                            <span className="opacity-60">{msg.time}</span>
                          </div>
                        </div>

                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-[#eaf6ee] text-[#227736]
                            flex items-center justify-center shrink-0 border border-[#c8e6d1]">
                            <UserIcon size={13} />
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}

                  {typing && (
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#227736] text-white
                        flex items-center justify-center shrink-0 shadow-sm">
                        <Bot size={13} />
                      </div>
                      <div className="bg-white border border-[#e2ebe6] rounded-2xl rounded-bl-md
                        px-4 py-3">
                        <div className="flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                              className="w-1.5 h-1.5 rounded-full bg-[#227736]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ============ FOOTER ============ */}
                <div className="border-t border-[#e2ebe6] p-3 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask in English or Roman Urdu..."
                        rows={1}
                        className="w-full resize-none rounded-xl border border-[#e2ebe6] bg-[#f8faf9] px-3.5 py-2.5 text-xs sm:text-sm outline-none text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-3 focus:ring-[#227736]/10 transition-all duration-200 placeholder:text-[#5a6e63] max-h-24"
                        style={{ minHeight: 40 }}
                      />
                    </div>

                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || typing}
                      className="w-10 h-10 rounded-xl bg-[#227736] hover:bg-[#1c6430]
                        text-white flex items-center justify-center shadow-sm
                        transition-colors duration-200
                        disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 px-1">
                    <button
                      onClick={clearChat}
                      className="flex items-center gap-1 text-[10px] text-[#5a6e63]
                        hover:text-[#227736] font-medium transition-colors"
                    >
                      <RotateCcw size={10} />
                      New chat
                    </button>
                    <span className="text-[10px] text-[#5a6e63] font-medium">
                      {backendOnline === false ? "Offline mode" : "CampusConnect AI"}
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