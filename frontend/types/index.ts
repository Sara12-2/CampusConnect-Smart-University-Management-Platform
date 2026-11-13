// ============================================================
// User
// ============================================================
export type Role = "student" | "staff" | "admin";

export interface User {
  id: number;              // ✅ backend int
  name: string;
  email: string;
  role: Role;
  department?: string | null;
  semester?: number | null;
  avatar?: string | null;
  is_active: boolean;      // ✅ backend field
}

// ============================================================
// Notice
// ============================================================
export interface Notice {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  department: string;
  semester?: number | null;
  pinned: boolean;
  deadline?: string | null;
  createdAt: string;
  author: string;
  category: "exam" | "event" | "fee" | "general" | "urgent";
  priority?: "normal" | "high";
}

// ============================================================
// Notification
// ============================================================
export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;         // ✅ backend field name
  link?: string | null;    // ✅ backend field
  userId: number;          // ✅ backend field
  createdAt: string;
}

// ============================================================
// Complaint
// ============================================================
export type ComplaintStatus =
  | "submitted"
  | "assigned"
  | "in-progress"
  | "resolved";

export type ComplaintCategory =
  | "classroom"
  | "lab"
  | "electricity"
  | "wifi"
  | "furniture"
  | "other";

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  images: string[];
  studentId: number;
  studentName: string;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Lost & Found
// ============================================================
export type ItemType = "lost" | "found";
export type ItemStatus = "open" | "claimed" | "returned";

export interface LostFoundItem {
  id: number;
  type: ItemType;
  title: string;
  description: string;
  location?: string | null;
  imageUrl?: string | null;    // ✅ backend field
  status: ItemStatus;
  reporterId: number;          // ✅ backend field name
  createdAt: string;
}

// ============================================================
// Claim
// ============================================================
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  message: string;             // ✅ backend field (was "proof")
  status: ClaimStatus;
  createdAt: string;
}

// ============================================================
// Auth
// ============================================================
export interface LoginRequest {
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  department?: string;
  semester?: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ============================================================
// Chat
// ============================================================
export interface ChatHistoryItem {
  role: "user" | "assistant" | "bot";
  content: string;
}

export interface ChatRequest {
  message: string;
  use_rag?: boolean;
  history?: ChatHistoryItem[];
}

export interface ChatResponse {
  reply: string;
  sources: string[];
  mode: string;
}