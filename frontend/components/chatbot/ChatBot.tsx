"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User as UserIcon,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMockReply } from "./mockReplies";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
}

const quickQuestions = [
  "When is the exam schedule?",
  "How do I apply for a scholarship?",
  "How to file a Wi-Fi complaint?",
  "How do I report a lost item?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hello! 👋 I'm the CampusConnect Assistant.\n\nAsk me about notices, complaints, Lost & Found, or anything else on your campus.",
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = (text?: string) => {
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

    setTimeout(() => {
      const reply = getMockReply(content);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: reply,
        time: now(),
      };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: "Chat cleared. Ask me something new! 😊",
        time: now(),
      },
    ]);
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
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#f4a228] ring-2 ring-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== CHAT WINDOW ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: minimized ? 64 : 580,
            }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[92vw] max-w-sm bg-white rounded-2xl",
              "shadow-2xl shadow-black/25",
              "border border-[#e2ebe6] overflow-hidden flex flex-col",
              "max-h-[85vh]"
            )}
          >
            {/* ============ HEADER ============ */}
            <div className="relative bg-gradient-to-r from-[#227736] via-[#1c6430] to-[#227736] text-white px-4 py-3.5 flex items-center justify-between shrink-0 overflow-hidden">
              <motion.div
                animate={{ backgroundPositionX: ["0px", "20px"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-[0.09]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#f4a228]/25 blur-2xl pointer-events-none" />

              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent,#f4a228,transparent)] opacity-70"
                  />
                  <div className="relative w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center border border-white/25">
                    <Bot size={18} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#58b277] ring-2 ring-[#227736]" />
                </div>

                <div>
                  <p className="font-bold text-sm tracking-tight">
                    CampusConnect Assistant
                  </p>
                  <p className="text-[11px] text-white/75 flex items-center gap-1 mt-0.5">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#58b277]"
                    />
                    Online
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMinimized((v) => !v)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                  aria-label="Close"
                >
                  <X size={15} />
                </motion.button>
              </div>
            </div>

            {/* ============ BODY ============ */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8faf9]">
                  {messages.map((msg, idx) => (
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
                          "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line leading-relaxed",
                          msg.role === "user"
                            ? "bg-[#227736] text-white rounded-br-md shadow-md shadow-[#227736]/25"
                            : "bg-white text-[#0f1d17] border border-[#e2ebe6] rounded-bl-md shadow-sm"
                        )}
                      >
                        {msg.content}
                        <div
                          className={cn(
                            "text-[10px] mt-1.5 opacity-60",
                            msg.role === "user" ? "text-right" : "text-left"
                          )}
                        >
                          {msg.time}
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
                  ))}

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
                      <div className="bg-white border border-[#e2ebe6] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
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

                <AnimatePresence>
                  {messages.length <= 1 && !typing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-3 border-t border-[#e2ebe6] bg-white overflow-hidden"
                    >
                      <p className="text-[10px] font-bold text-[#5a6e63] uppercase tracking-wider mb-2">
                        Quick questions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {quickQuestions.map((q, i) => (
                          <motion.button
                            key={q}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSend(q)}
                            className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#eaf6ee] text-[#227736] border border-[#c8e6d1] hover:bg-[#227736] hover:text-white hover:border-[#227736] hover:shadow-md hover:shadow-[#227736]/25 transition-all duration-300 font-medium"
                          >
                            {q}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-[#e2ebe6] p-3 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question..."
                        rows={1}
                        className="w-full resize-none rounded-xl border-2 border-[#e2ebe6] bg-[#f8faf9] px-3.5 py-2.5 text-sm outline-none text-[#0f1d17] focus:border-[#227736] focus:bg-white focus:ring-4 focus:ring-[#227736]/10 transition-all duration-300 placeholder:text-[#5a6e63] max-h-24"
                        style={{ minHeight: 42 }}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleSend()}
                      disabled={!input.trim() || typing}
                      className="relative w-10 h-10 rounded-xl bg-[#227736] hover:bg-[#1c6430] text-white flex items-center justify-center shadow-md shadow-[#227736]/25 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none shrink-0 overflow-hidden group"
                      aria-label="Send"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <Send size={16} className="relative z-10" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between mt-2 px-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChat}
                      className="flex items-center gap-1 text-[10px] text-[#5a6e63] hover:text-[#227736] font-medium transition-colors"
                    >
                      <motion.div
                        whileHover={{ rotate: -180 }}
                        transition={{ duration: 0.4 }}
                      >
                        <RotateCcw size={10} />
                      </motion.div>
                      Clear chat
                    </motion.button>
                    <span className="text-[10px] text-[#5a6e63] font-medium">
                      CampusConnect
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