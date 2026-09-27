export type Role = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  semester?: number;
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  summary?: string;
  department: string;
  semester?: number;
  pinned: boolean;
  deadline?: string;
  createdAt: string;
  author: string;
  category: "exam" | "event" | "fee" | "general" | "urgent";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "notice" | "deadline" | "complaint" | "claim";
  read: boolean;
  createdAt: string;
}

export type ComplaintStatus = "submitted" | "assigned" | "in-progress" | "resolved";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: "classroom" | "lab" | "electricity" | "wifi" | "furniture" | "other";
  status: ComplaintStatus;
  images: string[];
  studentId: string;
  studentName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemType = "lost" | "found";
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface LostFoundItem {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  location: string;
  date: string;
  images: string[];
  reportedBy: string;
  reporterName: string;
  status: "open" | "claimed" | "returned";
  createdAt: string;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName: string;
  proof: string;
  status: ClaimStatus;
  createdAt: string;
}