"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-green-50/40">
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Get in{" "}
              <span className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Koi sawal hai? Hum se raabta karein.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-8">
          {/* Info */}
          <div className="md:col-span-2 space-y-5">
            {[
              { icon: Mail, title: "Email", value: "info@campusconnect.edu" },
              { icon: Phone, title: "Phone", value: "+92 300 0000000" },
              { icon: MapPin, title: "Address", value: "University Campus, Pakistan" },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-green-100 text-orange-600 flex items-center justify-center shrink-0">
                  <c.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">{c.title}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{c.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-2">Send us a message</h2>

            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl"
              >
                <CheckCircle2 size={16} /> Message sent successfully!
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="Sara Manzoor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="sara@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <Input
              label="Subject"
              placeholder="Kis baare mein?"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
            <Textarea
              label="Message"
              rows={5}
              placeholder="Apna message likhein..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <Button type="submit" variant="primary" size="lg" className="w-full">
              <Send size={16} /> Send Message
            </Button>
          </motion.form>
        </section>
      </main>
      <Footer />
    </>
  );
}