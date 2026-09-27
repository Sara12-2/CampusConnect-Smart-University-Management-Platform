import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            Campus<span className="text-orange-500">Connect</span>
          </div>
          <p className="text-sm text-slate-600">
            Smart University Management & Student Services Platform.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
            <li><Link href="/about" className="hover:text-orange-600">About</Link></li>
            <li><Link href="/services" className="hover:text-orange-600">Services</Link></li>
            <li><Link href="/contact" className="hover:text-orange-600">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Notice Board</li>
            <li>Complaints</li>
            <li>Lost & Found</li>
            <li>AI Summaries</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Mail size={14} /> info@campusconnect.edu</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +92 300 0000000</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> University Campus</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CampusConnect — All rights reserved.
      </div>
    </footer>
  );
}