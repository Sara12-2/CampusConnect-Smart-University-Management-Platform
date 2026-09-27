"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Minimize2,
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
  "Exam schedule kab hai?",
  "Scholarship kaise milegi?",
  "Wi-Fi complaint kaise karein?",
  "Lost item kaise report karein?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Assalam-o-Alaikum! 👋 Main CampusConnect Assistant hoon. Aap notices, complaints, Lost & Found, ya kisi bhi campus cheez ke baare mein pooch sakte hain.",
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
        content: "Chat clear ho gayi! Naya sawal poochein. 😊",
        time: now(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full 
              bg-[#227736] text-white shadow-2xl shadow-[#227736]/30 
              flex items-center justify-center hover:bg-[#1c6430] transition-colors"
            aria-label="Open chat"
          >
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ffc107] ring-2 ring-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: minimized ? 64 : "auto",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl",
              "border border-slate-200 overflow-hidden flex flex-col",
              minimized ? "h-16" : "h-[560px] max-h-[85vh]"
            )}
          >
            {/* Header */}
            <div className="bg-[#227736] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ffc107] ring-2 ring-[#227736]" />
                </div>
                <div>
                  <p className="font-bold text-sm">CampusConnect Assistant</p>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <Sparkles size={10} /> AI • Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized((v) => !v)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-end gap-2",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "bot" && (
                        <div className="w-7 h-7 rounded-full bg-[#227736] text-white flex items-center justify-center shrink-0">
                          <Bot size={14} />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line",
                          msg.role === "user"
                            ? "bg-[#227736] text-white rounded-br-md"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm"
                        )}
                      >
                        {msg.content}
                        <div
                          className={cn(
                            "text-[10px] mt-1 opacity-60",
                            msg.role === "user" ? "text-right" : "text-left"
                          )}
                        >
                          {msg.time}
                        </div>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-[#f4ebe1] text-[#227736] flex items-center justify-center shrink-0">
                          <UserIcon size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#227736] text-white flex items-center justify-center shrink-0">
                        <Bot size={14} />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
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

                {messages.length <= 1 && !typing && (
                  <div className="px-4 py-2 border-t border-slate-100 bg-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Quick Questions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="text-xs px-2.5 py-1 rounded-full bg-[#eaf6ee] text-[#227736] 
                            hover:bg-[#227736] hover:text-white transition-colors font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-200 p-3 bg-white shrink-0">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Sawal likhein..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border-2 border-slate-200 
                        px-3 py-2.5 text-sm outline-none 
                        focus:border-[#227736] focus:ring-4 focus:ring-[#227736]/10 
                        transition-all placeholder:text-slate-400 max-h-24"
                      style={{ minHeight: 42 }}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || typing}
                      className="w-10 h-10 rounded-xl bg-[#227736] text-white flex items-center justify-center 
                        hover:bg-[#1c6430] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <button
                      onClick={clearChat}
                      className="text-[10px] text-slate-400 hover:text-[#227736] font-medium"
                    >
                      Clear chat
                    </button>
                    <p className="text-[10px] text-slate-400">Powered by AI</p>
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