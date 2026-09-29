"use client";
import { useState } from "react";
import StudentSidebar from "@/components/layout/StudentSidebar";
import Topbar from "@/components/layout/Topbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#f8faf9] min-h-screen">

      {/* ============ DESKTOP SIDEBAR — STICKY ============ */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <StudentSidebar />
        </div>
      </div>

      {/* ============ MOBILE SIDEBAR DRAWER ============ */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative bg-white z-10 shadow-2xl">
            <StudentSidebar />
          </div>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar role="student" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}