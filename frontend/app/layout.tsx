import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/chatbot/ChatBot";

/* ============================================================
   FONT — Plus Jakarta Sans
   ============================================================ */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/* ============================================================
   METADATA
   ============================================================ */
export const metadata: Metadata = {
  title: {
    default: "CampusConnect — Smart University Management",
    template: "%s · CampusConnect",
  },
  description:
    "Centralized platform for university notices, complaints, and Lost & Found services. Powered by AI.",
  keywords: [
    "CampusConnect",
    "University Management",
    "Notice Board",
    "Student Complaints",
    "Lost and Found",
    "AI Summaries",
    "Student Services",
  ],
  authors: [{ name: "CampusConnect Team" }],
  creator: "CampusConnect",
  publisher: "CampusConnect",
  applicationName: "CampusConnect",
  category: "Education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CampusConnect — Smart University Management",
    description:
      "Centralized platform for university notices, complaints, and Lost & Found services.",
    siteName: "CampusConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusConnect — Smart University Management",
    description:
      "Centralized platform for university notices, complaints, and Lost & Found services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ============================================================
   VIEWPORT
   ============================================================ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#227736" },
    { media: "(prefers-color-scheme: dark)", color: "#165127" },
  ],
  colorScheme: "light",
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={jakarta.variable}
      suppressHydrationWarning
    >
      <body
        className={`${jakarta.className} antialiased bg-white text-[#0f1d17] min-h-screen`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}