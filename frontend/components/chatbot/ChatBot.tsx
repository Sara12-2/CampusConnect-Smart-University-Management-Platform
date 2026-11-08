"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  MessageCircle,
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
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Mic,
  MicOff,
  MoreVertical,
  Download,
  HelpCircle,
  AlertCircle,
  History,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFallbackReply } from "./mockReplies";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  sources?: string[];
  mode?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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
  },
  {
    icon: FileText,
    title: "Lodge Complaint",
    subtitle: "How to report Wi-Fi or electricity issues",
    prompt: "How do I submit a complaint?",
  },
  {
    icon: Search,
    title: "Lost & Found",
    subtitle: "How to claim or report lost property",
    prompt: "How do I claim a lost item?",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    subtitle: "Eligibility criteria & CGPA rules",
    prompt: "Tell me about scholarship criteria and deadlines",
  },
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

        if (!trimmed) return <div key={idx} className="h-1" />;

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
   STRICT ENGLISH QUERY CHECK
   ============================================================ */
function isRomanUrduOrNonEnglish(text: string): boolean {
  if (!text) return false;
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) return true;

  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = new Set(cleaned.split(/\s+/).filter(Boolean));

  const strongIndicators = [
    "kya", "kia", "kaise", "kese", "kaisay", "kesay",
    "kyun", "kyu", "kyn", "kahan", "kidhar", "kab",
    "konsa", "konsi", "konse", "kon", "kaun",
    "batao", "batayein", "bataye", "bataiye", "btao", "btain", "batana",
    "chahiye", "chahye", "mujhe", "mjhe", "mjy", "hamara", "humara", "hamari",
    "shikayat", "shikayaat", "wazifa", "wazaif", "gumshuda", "rabta", "auqat",
    "masla", "maslay", "masail", "karein", "karen", "sakte", "saktay", "sakta", "sakti",
    "parhai", "dakhla", "chutti", "chuttiyan", "samjhao", "karo", "kijiye", "dijiye"
  ];
  for (const ind of strongIndicators) {
    if (words.has(ind)) return true;
  }

  const particles = [
    "hai", "hain", "hyn", "hy", "hoon", "hun", "tha", "thi", "thay",
    "hoga", "hogi", "honge", "hongay", "mera", "meri", "mere", "meray",
    "tera", "teri", "tere", "teray", "apna", "apne", "apni", "aapna", "aapne", "aapni",
    "uska", "uski", "unka", "unki", "inka", "iski", "aap", "tum",
    "karna", "karta", "karti", "karte", "kartay", "karun", "karu",
    "nahi", "nhi", "nahin", "mat", "bhi", "bhe", "wale", "wali", "wala", "walay",
    "baare", "bare", "baray", "ke", "ki", "ko", "se", "sy", "mein", "mai", "ka", "kitna", "kitne"
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

  // New interactive utilities (Voice Talk, Speech Output, Feedback, Menu)
  const [feedback, setFeedback] = useState<Record<string, "helpful" | "not_helpful">>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVoiceTalking, setIsVoiceTalking] = useState(false);
  const [voiceSpokenText, setVoiceSpokenText] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Chat History & Sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `sess-${Date.now()}`);
  const [showHistory, setShowHistory] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState("");
  const [sessionMenuId, setSessionMenuId] = useState<string | null>(null);

  // Toast notifications (Feedback & History actions)
  const [toast, setToast] = useState<{ message: string; type?: "success" | "info" } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasCheckedRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const voiceTranscriptRef = useRef<string>("");
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  // SINGLE-PASS HEALTH CHECK — NO REPEATED POLLING LOOP
  // ============================================================
  const checkBackendOnce = useCallback(async () => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE}/health`, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      setBackendOnline(res.ok);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  // Load saved chat sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("campusconnect_chat_sessions");
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        }
      }
    } catch { }
  }, []);

  // Sync active conversation with saved chat sessions
  useEffect(() => {
    if (messages.length === 0) return;
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === currentSessionId);
      let title = existingIdx >= 0 ? prev[existingIdx].title : "Academic Chat";
      // Auto-name chat from first user message if title is default
      if ((title === "Academic Chat" || !title) && messages.length > 0) {
        const firstUser = messages.find((m) => m.role === "user");
        if (firstUser) {
          title = firstUser.content.slice(0, 32).trim() + (firstUser.content.length > 32 ? "..." : "");
        }
      }
      const updatedItem: ChatSession = {
        id: currentSessionId,
        title,
        messages,
        updatedAt: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      };
      const nextSessions = existingIdx >= 0
        ? prev.map((s, idx) => (idx === existingIdx ? updatedItem : s))
        : [updatedItem, ...prev];
      try {
        localStorage.setItem("campusconnect_chat_sessions", JSON.stringify(nextSessions));
      } catch { }
      return nextSessions;
    });
  }, [messages, currentSessionId]);

  useEffect(() => {
    if (open) {
      checkBackendOnce();
      setWelcomeQuoteIdx(Math.floor(Math.random() * WELCOME_QUOTES.length));
    } else {
      // Stop speech and voice talk on close
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch { }
      }
      setIsVoiceTalking(false);
      setVoiceSpokenText("");
      setShowMenu(false);
      setShowHelp(false);
      setShowHistory(false);
      setEditingSessionId(null);
      setSessionMenuId(null);
    }
  }, [open, checkBackendOnce]);

  // Clean up Web Audio / Speech Synthesis on unmount
  useEffect(() => {
    // Preload natural speech voices
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch { }
      }
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ============================================================
  // NATURAL AI VOICE SELECTION (PREFERS WARM, HUMAN-LIKE VOICES)
  // ============================================================
  function getBestEnglishVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Natural / Neural Online voices (Edge & Chrome) — High fidelity human voice
    const naturalOnline = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") || v.name.includes("Online") || v.name.includes("Neural")) &&
        !v.name.toLowerCase().includes("david")
    );
    if (naturalOnline) return naturalOnline;

    // 2. Google High-Quality English voices (Chrome)
    const googleVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        v.name.includes("Google") &&
        (v.name.includes("US") || v.name.includes("Female") || v.name.includes("UK"))
    );
    if (googleVoice) return googleVoice;

    // 3. Smooth, clear female voices (Zira, Jenny, Aria, Samantha, Victoria)
    const smoothFemale = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Zira") ||
          v.name.includes("Jenny") ||
          v.name.includes("Aria") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Karen"))
    );
    if (smoothFemale) return smoothFemale;

    // 4. Any English voice that is NOT the robotic David or Mark
    const cleanEnglish = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        !v.name.toLowerCase().includes("david") &&
        !v.name.toLowerCase().includes("mark") &&
        !v.name.toLowerCase().includes("desktop")
    );
    if (cleanEnglish) return cleanEnglish;

    return voices.find((v) => v.lang.startsWith("en")) || null;
  }

  // ============================================================
  // TEXT-TO-SPEECH (SPEAK ALOUD IN NATURAL ENGLISH)
  // ============================================================
  const toggleSpeech = (text: string, msgId: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech audio is not supported in this browser.");
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols before speaking
    const cleanSpoken = text
      .replace(/[*#_`•-]/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.lang = "en-US";
    utterance.rate = 0.94; // Calm, clear, natural pace
    utterance.pitch = 1.02; // Warm, friendly tone

    const preferredVoice = getBestEnglishVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // ============================================================
  // VOICE TALK (HANDS-FREE: TALK -> SILENCE AUTO-SENDS -> BOT SPEAKS)
  // ============================================================
  const startVoiceTalk = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice talk is not supported in this browser. Please open in Chrome, Edge, or Safari.");
      return;
    }

    // Toggle: if already active, cancel it
    if (isVoiceTalking && recognitionRef.current) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      voiceTranscriptRef.current = "";
      setVoiceSpokenText("");
      try {
        recognitionRef.current.abort();
      } catch { }
      setIsVoiceTalking(false);
      return;
    }

    try {
      // Cancel active text-to-speech so mic doesn't hear bot speaking
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false; // Ends automatically when utterance finishes
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      voiceTranscriptRef.current = "";
      setVoiceSpokenText("");

      recognition.onstart = () => {
        setIsVoiceTalking(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const text = transcript.trim();
        voiceTranscriptRef.current = text;
        setVoiceSpokenText(text);

        // Reset silence timer: when user pauses for 1.5 seconds, auto-send!
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (voiceTranscriptRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch { }
          }
        }, 1500);
      };

      recognition.onerror = (event: any) => {
        console.warn("Voice talk error:", event.error);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        setIsVoiceTalking(false);
        setVoiceSpokenText("");
        voiceTranscriptRef.current = "";
      };

      recognition.onend = () => {
        setIsVoiceTalking(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        const query = voiceTranscriptRef.current.trim();
        voiceTranscriptRef.current = "";
        setVoiceSpokenText("");

        if (query) {
          // Send automatically without writing into textarea, and speak the reply!
          handleSend(query, true);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Voice talk start failed:", err);
      setIsVoiceTalking(false);
    }
  };

  // ============================================================
  // COPY TO CLIPBOARD
  // ============================================================
  const copyToClipboard = async (text: string, msgId: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  // ============================================================
  // FEEDBACK HANDLER (HELPFUL / NOT HELPFUL)
  // ============================================================
  const handleFeedback = (msgId: string, type: "helpful" | "not_helpful") => {
    setFeedback((prev) => {
      const current = prev[msgId];
      if (current === type) {
        // Toggle OFF (Remove)
        const next = { ...prev };
        delete next[msgId];
        showToast(type === "helpful" ? "Removed as Helpful" : "Removed as Not Helpful", "info");
        return next;
      } else {
        // Mark as Helpful / Not Helpful
        const next = { ...prev, [msgId]: type };
        showToast(
          type === "helpful"
            ? "Marked as Helpful - Feedback added"
            : "Marked as Not Helpful - Feedback added",
          "success"
        );
        return next;
      }
    });
  };

  // ============================================================
  // CHAT SESSIONS & HISTORY HANDLERS
  // ============================================================
  const startNewChat = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch { }
    }
    setIsVoiceTalking(false);
    setVoiceSpokenText("");
    setMessages([]);
    setCurrentSessionId(`sess-${Date.now()}`);
    setWelcomeQuoteIdx((prev) => (prev + 1) % WELCOME_QUOTES.length);
    setShowHistory(false);
    setShowMenu(false);
    setEditingSessionId(null);
    setSessionMenuId(null);
  };

  const loadChatSession = (session: ChatSession) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    setCurrentSessionId(session.id);
    setMessages(session.messages || []);
    setShowHistory(false);
    setShowMenu(false);
    setEditingSessionId(null);
    setSessionMenuId(null);
  };

  const saveRename = (sessionId: string) => {
    const trimmed = editTitleInput.trim();
    if (!trimmed) {
      setEditingSessionId(null);
      return;
    }
    setSessions((prev) => {
      const updated = prev.map((s) => (s.id === sessionId ? { ...s, title: trimmed } : s));
      try {
        localStorage.setItem("campusconnect_chat_sessions", JSON.stringify(updated));
      } catch { }
      return updated;
    });
    setEditingSessionId(null);
    setEditTitleInput("");
    setSessionMenuId(null);
    showToast("Chat renamed successfully", "success");
  };

  const deleteChatSession = (sessionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      try {
        localStorage.setItem("campusconnect_chat_sessions", JSON.stringify(updated));
      } catch { }
      return updated;
    });
    if (currentSessionId === sessionId) {
      setMessages([]);
      setCurrentSessionId(`sess-${Date.now()}`);
    }
    setSessionMenuId(null);
    showToast("Chat deleted successfully", "info");
  };

  // ============================================================
  // EXPORT CHAT AS TEXT FILE
  // ============================================================
  const exportChat = () => {
    if (messages.length === 0) return;
    const lines = messages.map(
      (m) => `[${m.time}] ${m.role === "user" ? "Student" : "CampusConnect Assistant"}:\n${m.content}\n`
    );
    const content = `CampusConnect Assistant - Official Chat History\nExported: ${new Date().toLocaleString()}\n------------------------------------------------------------\n\n${lines.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CampusConnect_Chat_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  // ============================================================
  // HANDLE SEND — Strict English, Real Backend First, Direct Fallback
  // ============================================================
  const handleSend = async (text?: string, autoSpeak = false) => {
    const content = (text ?? input).trim();
    if (!content) return;

    // Stop active speech when sending new message
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      time: now(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // 0️⃣ STRICT ENGLISH ENFORCEMENT: Decline Roman Urdu immediately
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
        if (autoSpeak || soundOn) {
          toggleSpeech(botMsg.content, botMsg.id);
        }
      }, 300);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      // 1️⃣ TRY REAL FASTAPI BACKEND (Port 8000)
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
            history: messages.slice(-4).map((m) => ({
              role: m.role,
              content: m.content,
            })),
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
      } catch {
        // Backend offline, proceed to Next.js route fallback
      }

      // 2️⃣ IF BACKEND IS OFFLINE, TRY NEXT.JS ROUTE (Direct Groq AI)
      if (!backendSuccess) {
        setBackendOnline(false);
        try {
          const nextRes = await fetch("/api/chat", {
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

          if (nextRes.ok) {
            const nextData = await nextRes.json();
            reply = nextData.reply || "";
            sources = Array.isArray(nextData.sources) ? nextData.sources : [];
            mode = "verified";
          }
        } catch {
          // Both backend and Next route offline, use fallback reply
        }
      }

      // 3️⃣ LOCAL FALLBACK IF ALL CONNECTIONS FAILED
      if (!reply) {
        reply = getFallbackReply(content);
        mode = "local";
      }

      // Clean sources: filter out internal model technical names
      const cleanSources = sources.filter((s: string) => {
        const lower = (s || "").toLowerCase();
        return (
          !lower.includes("gemini") &&
          !lower.includes("google") &&
          !lower.includes("groq") &&
          !lower.includes("llama") &&
          !lower.includes("backend rag") &&
          !lower.includes("flash")
        );
      });

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: reply,
        time: now(),
        sources: cleanSources.slice(0, 2),
        mode,
      };

      setMessages((m) => [...m, botMsg]);

      // If voice talk was used OR auto-sound is enabled, read response aloud
      if ((autoSpeak || soundOn) && reply) {
        toggleSpeech(reply, botMsg.id);
      }
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
      if (autoSpeak || soundOn) {
        toggleSpeech(botMsg.content, botMsg.id);
      }
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
    startNewChat();
  };

  return (
    <>
      {/* ==================== FLOATING OPEN BUTTON ==================== */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99999 }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#227736] hover:bg-[#1c6430] text-white shadow-2xl shadow-[#227736]/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shrink-0 pointer-events-auto"
          aria-label="Open CampusConnect AI Assistant"
          title="Open CampusConnect AI Assistant"
        >
          <MessageCircle size={28} className="text-white" />
        </button>
      )}

      {/* ==================== CHAT WINDOW ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="campusconnect-chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 99999,
              height: minimized ? "64px" : "min(580px, calc(100vh - 48px))",
            }}
            className="w-[94vw] sm:w-[410px] rounded-3xl bg-white shadow-2xl border border-[#e2ebe6] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* ============ TOAST NOTIFICATION ============ */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full text-xs font-semibold shadow-xl border flex items-center gap-2 pointer-events-none whitespace-nowrap bg-[#0f1d17]/95 text-white backdrop-blur-md border-white/10"
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      toast.type === "success" ? "bg-emerald-400" : "bg-sky-400"
                    )}
                  />
                  <span>{toast.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ============ CHAT HISTORY DRAWER / SIDEBAR ============ */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  onClick={() => setSessionMenuId(null)}
                  className="absolute inset-0 z-50 bg-white flex flex-col overflow-hidden"
                >
                  {/* History Drawer Header */}
                  <div className="bg-[#f8faf9] border-b border-[#e2ebe6] p-3.5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-[#0f1d17]">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#227736] flex items-center justify-center border border-emerald-200/60 shadow-xs">
                        <History size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs tracking-tight text-[#0f1d17]">
                          Chat History
                        </h4>
                        <p className="text-[10px] text-[#5a6e63]">
                          {sessions.length} conversation{sessions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowHistory(false);
                        setEditingSessionId(null);
                        setSessionMenuId(null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-200/60 text-[#5a6e63] transition-colors cursor-pointer"
                      aria-label="Close history"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* History Drawer Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#f8faf9]">
                    {sessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#5a6e63]">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#e2ebe6] flex items-center justify-center mb-3 shadow-xs text-[#227736]">
                          <History size={22} />
                        </div>
                        <p className="text-xs font-bold text-[#0f1d17]">No Saved Chats Yet</p>
                        <p className="text-[11px] text-[#5a6e63] mt-1 leading-relaxed">
                          Ask questions in English to begin saving your academic conversations.
                        </p>
                      </div>
                    ) : (
                      sessions.map((session) => {
                        const isActive = session.id === currentSessionId;
                        const isEditing = editingSessionId === session.id;
                        const isMenuOpen = sessionMenuId === session.id;

                        return (
                          <div
                            key={session.id}
                            className={cn(
                              "relative rounded-2xl border transition-all p-3 bg-white",
                              isActive
                                ? "border-[#227736] shadow-sm bg-emerald-50/25 ring-1 ring-[#227736]/20"
                                : "border-[#e2ebe6] hover:border-[#227736]/40 hover:shadow-xs"
                            )}
                          >
                            {isEditing ? (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5"
                              >
                                <input
                                  type="text"
                                  autoFocus
                                  value={editTitleInput}
                                  onChange={(e) => setEditTitleInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      saveRename(session.id);
                                    } else if (e.key === "Escape") {
                                      setEditingSessionId(null);
                                    }
                                  }}
                                  placeholder="Enter conversation name..."
                                  className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-[#227736] outline-none bg-white text-[#0f1d17] focus:ring-2 focus:ring-[#227736]/20 font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => saveRename(session.id)}
                                  className="p-1.5 rounded-lg bg-[#227736] text-white hover:bg-[#1c6430] transition-colors cursor-pointer"
                                  title="Save (Enter)"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSessionId(null)}
                                  className="p-1.5 rounded-lg bg-gray-100 text-[#5a6e63] hover:bg-gray-200 transition-colors cursor-pointer"
                                  title="Cancel"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-2">
                                <div
                                  onClick={() => loadChatSession(session)}
                                  className="flex-1 min-w-0 cursor-pointer"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <p
                                      className={cn(
                                        "text-xs font-bold truncate leading-tight",
                                        isActive ? "text-[#227736]" : "text-[#0f1d17]"
                                      )}
                                    >
                                      {session.title || "Academic Chat"}
                                    </p>
                                    {isActive && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#227736] shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#5a6e63]">
                                    <span>{session.updatedAt}</span>
                                    <span>•</span>
                                    <span>
                                      {session.messages?.length || 0} message
                                      {(session.messages?.length || 0) === 1 ? "" : "s"}
                                    </span>
                                  </div>
                                </div>

                                {/* 3-Dots Action Button */}
                                <div className="relative shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSessionMenuId((prev) =>
                                        prev === session.id ? null : session.id
                                      );
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#5a6e63] transition-colors cursor-pointer"
                                    title="Options"
                                  >
                                    <MoreVertical size={14} />
                                  </button>

                                  {/* 3-Dots Dropdown Menu */}
                                  {isMenuOpen && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="absolute right-0 top-8 z-30 w-32 rounded-xl bg-white border border-[#e2ebe6] shadow-xl p-1 flex flex-col gap-0.5"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingSessionId(session.id);
                                          setEditTitleInput(session.title || "Academic Chat");
                                          setSessionMenuId(null);
                                        }}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#0f1d17] hover:bg-emerald-50 hover:text-[#227736] rounded-lg transition-colors text-left font-medium cursor-pointer"
                                      >
                                        <Pencil size={12} />
                                        <span>Rename</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => deleteChatSession(session.id, e)}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium cursor-pointer"
                                      >
                                        <Trash2 size={12} />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ============ QUICK HELP SYSTEM OVERLAY ============ */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-50 bg-white flex flex-col p-4 overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-[#e2ebe6] pb-3 shrink-0">
                    <div className="flex items-center gap-2 text-[#227736] font-bold text-sm">
                      <HelpCircle size={18} />
                      <span>CampusConnect Help System</span>
                    </div>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#5a6e63] transition-colors"
                      aria-label="Close Help"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="py-3 space-y-2 text-xs flex-1 overflow-y-auto">
                    <p className="text-[#5a6e63] leading-relaxed font-medium">
                      Select an official university topic below to query the AI assistant immediately:
                    </p>

                    {[
                      {
                        title: "Midterm & Final Examination Schedules",
                        desc: "Midterms commence Oct 20; Finals begin Jan 10. Student ID card mandatory.",
                        prompt: "What is the examination schedule and rules?",
                      },
                      {
                        title: "Merit & Need-Based Scholarships",
                        desc: "Merit requires 3.50 CGPA. Need-based requires 2.50 CGPA. Deadline: Oct 15.",
                        prompt: "Tell me about scholarship eligibility and application deadlines",
                      },
                      {
                        title: "How to Submit Wi-Fi or Electricity Complaints",
                        desc: "Lodge issues through student dashboard and track administrative redressal.",
                        prompt: "How do I submit and track a complaint?",
                      },
                      {
                        title: "Lost & Found Reporting and Ownership Claims",
                        desc: "Report misplaced belongings or claim verified found campus property.",
                        prompt: "How do I report or claim a lost item?",
                      },
                      {
                        title: "Campus Office Hours & Administration Contacts",
                        desc: "Monday-Friday 9:00 AM - 4:00 PM. Emergency and departmental helplines.",
                        prompt: "What are university office timings and helpline numbers?",
                      },
                      {
                        title: "Attendance Rules & Code of Conduct",
                        desc: "Minimum 75% attendance rule and campus discipline policy.",
                        prompt: "What are attendance rules and campus conduct policies?",
                      },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setShowHelp(false);
                          handleSend(item.prompt);
                        }}
                        className="w-full text-left p-3 rounded-2xl border border-[#e2ebe6] hover:border-[#227736] hover:bg-emerald-50/70 hover:shadow-xs transition-all group"
                      >
                        <p className="font-bold text-[#0f1d17] group-hover:text-[#227736] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#5a6e63] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#e2ebe6] text-center shrink-0">
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-xs text-[#227736] font-semibold hover:underline"
                    >
                      Return to Chat
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ============ HEADER ============ */}
            <div className="bg-gradient-to-r from-[#227736] to-[#1c6430] text-white p-3.5
              flex items-center justify-between shrink-0">

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md
                    flex items-center justify-center border border-white/25">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#1c6430]",
                      backendOnline === true
                        ? "bg-[#58b277]"
                        : backendOnline === false
                          ? "bg-[#E67E22]"
                          : "bg-white/40"
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm tracking-tight text-white">
                      CampusConnect AI
                    </p>
                    {backendOnline === true ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5
                        rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/35 tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Live
                      </span>
                    ) : backendOnline === false ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5
                        rounded-full bg-white/15 border border-white/20 tracking-wider">
                        Ready
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium uppercase px-1.5 py-0.5
                        rounded-full bg-white/10 tracking-wider opacity-70">
                        Connecting
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/80">
                    English AI Campus Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Chat History"
                  title="Chat History"
                >
                  <History size={15} />
                </button>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                    aria-label="New chat"
                    title="New chat"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMinimized((v) => !v)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Minimize"
                  title="Minimize"
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ============ BODY ============ */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8faf9] relative">
                  {messages.length === 0 ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="text-center pt-3 pb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#227736] text-xs font-semibold mb-3 shadow-xs">
                          <Sparkles size={13} className="text-[#227736]" />
                          <span>CampusConnect AI Assistant</span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#0f1d17] tracking-tight">
                          {greeting}, <span className="text-[#227736]">Scholar</span>
                        </h3>
                        <p className="text-xs text-[#5a6e63] mt-1.5 px-4 leading-relaxed font-medium">
                          {WELCOME_QUOTES[welcomeQuoteIdx]}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2">
                        {SUGGESTION_CARDS.map((card) => {
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

                      <div className="py-2" />
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
                            "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-[#227736] text-white rounded-br-md shadow-sm whitespace-pre-line"
                              : msg.mode === "error"
                                ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-md"
                                : "bg-white text-[#0f1d17] border border-[#e2ebe6] rounded-bl-md shadow-xs"
                          )}
                        >
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <FormattedMessage content={msg.content} />
                          )}

                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-emerald-100 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-semibold text-[#1c6430] flex items-center gap-1">
                                <FileText size={10} />
                                <span>Official Sources:</span>
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

                          {/* Time & Mode Badge */}
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
                                  msg.mode === "error"
                                    ? "bg-red-100 text-red-800 border-red-300"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                )}
                              >
                                {msg.mode === "error" ? (
                                  <>
                                    <AlertCircle size={10} className="text-red-600" />
                                    <span>Error</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>CampusConnect AI</span>
                                  </>
                                )}
                              </span>
                            )}
                            <span className="opacity-60">{msg.time}</span>
                          </div>

                          {/* ========================================================
                              MESSAGE ACTION ROW (Helpful, Not Helpful, Speak, Copy)
                              ======================================================== */}
                          {msg.role === "bot" && msg.mode !== "error" && (
                            <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#e2ebe6] text-[10px] text-[#5a6e63]">
                              <button
                                onClick={() => handleFeedback(msg.id, "helpful")}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 hover:text-[#227736] transition-colors",
                                  feedback[msg.id] === "helpful" && "text-[#227736] font-semibold bg-emerald-50"
                                )}
                                title="Helpful"
                              >
                                <ThumbsUp size={11} className={cn(feedback[msg.id] === "helpful" && "fill-[#227736]")} />
                                <span>Helpful</span>
                              </button>

                              <button
                                onClick={() => handleFeedback(msg.id, "not_helpful")}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-50 hover:text-red-600 transition-colors",
                                  feedback[msg.id] === "not_helpful" && "text-red-600 font-semibold bg-red-50"
                                )}
                                title="Not Helpful"
                              >
                                <ThumbsDown size={11} className={cn(feedback[msg.id] === "not_helpful" && "fill-red-600")} />
                                <span>Not Helpful</span>
                              </button>

                              <button
                                onClick={() => toggleSpeech(msg.content, msg.id)}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 hover:text-[#227736] transition-colors",
                                  speakingId === msg.id && "text-[#227736] font-semibold bg-emerald-50"
                                )}
                                title={speakingId === msg.id ? "Stop audio" : "Listen aloud (Text-to-Speech)"}
                              >
                                {speakingId === msg.id ? (
                                  <VolumeX size={11} className="text-[#227736] animate-pulse" />
                                ) : (
                                  <Volume2 size={11} />
                                )}
                                <span>{speakingId === msg.id ? "Stop" : "Speak"}</span>
                              </button>

                              <button
                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 hover:text-[#227736] transition-colors",
                                  copiedId === msg.id && "text-[#227736] font-semibold bg-emerald-50"
                                )}
                                title="Copy to clipboard"
                              >
                                {copiedId === msg.id ? (
                                  <Check size={11} className="text-[#227736]" />
                                ) : (
                                  <Copy size={11} />
                                )}
                                <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                          )}
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
                        px-4 py-3 shadow-xs">
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
                <div className="border-t border-[#e2ebe6] p-3 bg-white shrink-0 relative">
                  {/* Floating Action Menu (Pill stack above the Orange 3-Dots button) */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        className="absolute bottom-16 right-3 z-40 flex flex-col gap-2 items-end"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            exportChat();
                            setShowMenu(false);
                          }}
                          disabled={messages.length === 0}
                          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0f1d17] hover:text-[#227736] border border-[#e2ebe6] shadow-md hover:shadow-lg text-xs font-semibold transition-all disabled:opacity-40"
                        >
                          <span>Export Chat</span>
                          <Download size={14} className="text-[#227736]" />
                        </button>

                        <button
                          onClick={() => {
                            setSoundOn((s) => !s);
                            if (soundOn && typeof window !== "undefined" && "speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              setSpeakingId(null);
                            }
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0f1d17] hover:text-[#227736] border border-[#e2ebe6] shadow-md hover:shadow-lg text-xs font-semibold transition-all"
                        >
                          <span>{soundOn ? "Sound Off" : "Sound On"}</span>
                          {soundOn ? (
                            <Volume2 size={14} className="text-[#227736]" />
                          ) : (
                            <VolumeX size={14} className="text-[#5a6e63]" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setShowHelp(true);
                            setShowMenu(false);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0f1d17] hover:text-[#227736] border border-[#e2ebe6] shadow-md hover:shadow-lg text-xs font-semibold transition-all"
                        >
                          <span>Help System</span>
                          <HelpCircle size={14} className="text-[#227736]" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Voice Talk Listening Banner */}
                  <AnimatePresence>
                    {isVoiceTalking && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="mb-2.5 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#227736]"></span>
                            </span>
                            <span className="font-bold text-[#144722] text-[11px]">
                              Voice Talk: Speak in English
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={startVoiceTalk}
                            className="text-[10px] font-bold text-red-600 hover:text-red-800 px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>

                        {voiceSpokenText ? (
                          <p className="mt-1.5 text-xs text-[#0f1d17] font-semibold bg-white/90 p-2 rounded-xl border border-emerald-200 shadow-2xs">
                            "{voiceSpokenText}"
                          </p>
                        ) : (
                          <p className="mt-1 text-[10px] text-[#5a6e63]">
                            Silence will automatically send your message to the assistant.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Bar Row: [Text Input (Left)] [Mic] [Send] [Orange 3-Dots] (Right) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* 1. Text Input Box (Left, flex-1) */}
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask CampusConnect in English..."
                      rows={1}
                      className="flex-1 resize-none rounded-2xl border border-[#e2ebe6] bg-[#f8faf9] px-3.5 py-2.5 text-xs sm:text-sm outline-none text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-2 focus:ring-[#227736]/15 transition-all placeholder:text-[#5a6e63] max-h-20"
                      style={{ minHeight: 40 }}
                    />

                    {/* All Action Buttons grouped on the Right side */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* 2. Light Green Circular Mic Button (Voice Talk) */}
                      <button
                        type="button"
                        onClick={startVoiceTalk}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-xs",
                          isVoiceTalking
                            ? "bg-red-500 text-white animate-pulse ring-3 ring-red-300 shadow-md shadow-red-500/30"
                            : "bg-[#eaf6ee] text-[#227736] hover:bg-[#d8eedf] border border-[#c8e6d1]"
                        )}
                        title={isVoiceTalking ? "Voice Talk active: Click to stop" : "Voice Talk: Tap to speak directly with Assistant"}
                        aria-label="Voice talk"
                      >
                        {isVoiceTalking ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>

                      {/* 3. Green Circular Send (Enter) Button */}
                      <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || typing}
                        className="w-10 h-10 rounded-full bg-[#227736] hover:bg-[#1c6430] text-white flex items-center justify-center shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
                        aria-label="Send message"
                        title="Send message (Enter)"
                      >
                        <Send size={16} />
                      </button>

                      {/* 4. Orange Circular 3-Dots More Button */}
                      <button
                        onClick={() => setShowMenu((m) => !m)}
                        className={cn(
                          "w-10 h-10 rounded-full bg-[#E67E22] hover:bg-[#d35400] text-white flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95",
                          showMenu && "ring-2 ring-orange-300 scale-105"
                        )}
                        title="Menu (New Chat, Export, Sound, Help)"
                        aria-label="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
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
