"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, X, Upload } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { mockComplaints } from "@/data/mock-data";
import { formatDate, statusColors } from "@/lib/utils";

export default function ComplaintsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">My Complaints</h1>
          <p className="text-slate-500 text-sm mt-1">Apni complaints submit karein aur track karein.</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="primary" size="md">
          <Plus size={16} /> New Complaint
        </Button>
      </motion.div>

      <div className="grid gap-4">
        {mockComplaints.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/student/complaints/${c.id}`}>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-orange-200 hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[c.status]}>{c.status}</Badge>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">{c.category}</Badge>
                    </div>
                    <h3 className="font-bold text-slate-800">{c.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{c.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                  <span>Submitted: {formatDate(c.createdAt)}</span>
                  {c.assignedTo && <span>Assigned to: {c.assignedTo}</span>}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">New Complaint</h2>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); setOpen(false); }}
                className="space-y-4"
              >
                <Input label="Title" placeholder="Wi-Fi not working in Lab 3" required />
                <Select
                  label="Category"
                  options={[
                    { value: "classroom", label: "Classroom" },
                    { value: "lab", label: "Computer Lab" },
                    { value: "electricity", label: "Electricity" },
                    { value: "wifi", label: "Wi-Fi" },
                    { value: "furniture", label: "Furniture" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <Textarea label="Description" rows={4} placeholder="Issue detail mein likhein..." required />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Evidence Image (optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-orange-400 transition-all cursor-pointer">
                    <Upload className="mx-auto text-slate-400 mb-2" size={22} />
                    <p className="text-sm text-slate-500">Click to upload image</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Submit Complaint
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}