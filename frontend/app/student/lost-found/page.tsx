"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MapPin, Calendar, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import { mockLostFound } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function LostFoundPage() {
  const [tab, setTab] = useState<"all" | "lost" | "found">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = mockLostFound.filter((it) => {
    const matchTab = tab === "all" || it.type === tab;
    const q = query.toLowerCase();
    const matchQ = it.title.toLowerCase().includes(q) || it.location.toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Lost & Found</h1>
          <p className="text-slate-500 text-sm mt-1">Gumshuda items report karein ya claim karein.</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="primary">
          <Plus size={16} /> Report Item
        </Button>
      </motion.div>

      <Card hover={false}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              placeholder="Search items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none"
            />
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {(["all", "lost", "found"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize",
                  tab === t ? "bg-white text-orange-600 shadow-sm" : "text-slate-500"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="Koi item nahi mila" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/student/lost-found/${it.id}`}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all h-full">
                  <div className={`h-32 bg-gradient-to-br ${
                    it.type === "lost" ? "from-orange-400 to-orange-500" : "from-green-400 to-green-500"
                  } flex items-center justify-center text-white`}>
                    <Search size={36} />
                  </div>
                  <div className="p-5">
                    <Badge className={it.type === "lost"
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-green-100 text-green-700 border-green-200"}>
                      {it.type}
                    </Badge>
                    <h3 className="font-bold text-slate-800 mt-2">{it.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{it.description}</p>
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-1"><MapPin size={11} /> {it.location}</p>
                      <p className="flex items-center gap-1"><Calendar size={11} /> {formatDate(it.date)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Report Item</h2>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setOpen(false); }} className="space-y-4">
                <Select
                  label="Type"
                  options={[
                    { value: "lost", label: "I Lost Something" },
                    { value: "found", label: "I Found Something" },
                  ]}
                />
                <Input label="Item Name" placeholder="Black Wallet" required />
                <Textarea label="Description" rows={3} placeholder="Item ke baare mein detail..." required />
                <Input label="Location" placeholder="Cafeteria, Block B" required />
                <Input label="Date" type="date" required />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" variant="primary" className="flex-1">Submit</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}