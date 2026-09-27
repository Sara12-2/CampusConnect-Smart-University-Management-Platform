import type { Notice, Complaint, LostFoundItem, Claim, User, Notification } from "@/types";

export const mockNotices: Notice[] = [
  {
    id: "n1",
    title: "Mid-Term Examination Schedule Fall 2025",
    content:
      "All students are hereby informed that the mid-term examinations for Fall 2025 semester will commence from 20th October 2025. The detailed schedule is available on the university portal. Students must bring their original ID cards. Any student found without an ID card will not be allowed to sit in the examination. Fee clearance is mandatory before the exam. Late submissions will not be accepted under any circumstances.",
    summary:
      "Mid-terms start 20 Oct 2025. Bring original ID card. Fee clearance is mandatory. No late entry allowed.",
    department: "Computer Science",
    semester: 5,
    pinned: true,
    deadline: "2025-10-20",
    createdAt: "2025-09-25",
    author: "Admin",
    category: "exam",
  },
  {
    id: "n2",
    title: "Scholarship Applications Open",
    content:
      "Merit-based scholarship applications are now open for all departments. Students with CGPA 3.5 or above are eligible to apply. Required documents include transcript, CNIC copy, and income certificate. Last date to submit is 15th October 2025. Incomplete applications will be rejected.",
    summary:
      "Merit scholarship open. CGPA 3.5+ eligible. Deadline 15 Oct 2025. Submit transcript, CNIC, income certificate.",
    department: "All",
    pinned: false,
    deadline: "2025-10-15",
    createdAt: "2025-09-20",
    author: "Admin",
    category: "fee",
  },
  {
    id: "n3",
    title: "Annual Sports Gala 2025",
    content:
      "The Annual Sports Gala will be held from 5th to 10th November 2025. Students interested in participating should register with the sports department. Events include cricket, football, badminton, and athletics.",
    summary:
      "Sports Gala 5–10 Nov 2025. Register with sports dept. Events: cricket, football, badminton, athletics.",
    department: "All",
    pinned: false,
    deadline: "2025-11-05",
    createdAt: "2025-09-18",
    author: "Admin",
    category: "event",
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "c1",
    title: "Wi-Fi not working in Lab 3",
    description:
      "The Wi-Fi connection in Computer Lab 3 has been down for the past 3 days. Students are unable to complete their lab tasks.",
    category: "wifi",
    status: "in-progress",
    images: [],
    studentId: "s1",
    studentName: "Sara Manzoor",
    assignedTo: "IT Staff",
    createdAt: "2025-09-22",
    updatedAt: "2025-09-24",
  },
  {
    id: "c2",
    title: "Broken chairs in Classroom 12",
    description: "Several chairs in Classroom 12 are broken and need replacement.",
    category: "furniture",
    status: "submitted",
    images: [],
    studentId: "s1",
    studentName: "Sara Manzoor",
    createdAt: "2025-09-24",
    updatedAt: "2025-09-24",
  },
  {
    id: "c3",
    title: "Fan not working in Room 8",
    description: "Ceiling fan has stopped working.",
    category: "electricity",
    status: "resolved",
    images: [],
    studentId: "s1",
    studentName: "Sara Manzoor",
    assignedTo: "Maintenance",
    createdAt: "2025-09-10",
    updatedAt: "2025-09-15",
  },
];

export const mockLostFound: LostFoundItem[] = [
  {
    id: "l1",
    type: "lost",
    title: "Black Wallet",
    description: "Black leather wallet containing CNIC and student card. Lost near cafeteria.",
    location: "Cafeteria, Block B",
    date: "2025-09-23",
    images: [],
    reportedBy: "s1",
    reporterName: "Sara Manzoor",
    status: "open",
    createdAt: "2025-09-23",
  },
  {
    id: "l2",
    type: "found",
    title: "Blue Water Bottle",
    description: "Found a blue steel water bottle in Library Hall.",
    location: "Library Hall",
    date: "2025-09-24",
    images: [],
    reportedBy: "s2",
    reporterName: "Abdullah",
    status: "open",
    createdAt: "2025-09-24",
  },
];

export const mockClaims: Claim[] = [
  {
    id: "cl1",
    itemId: "l2",
    claimantId: "s1",
    claimantName: "Sara Manzoor",
    proof: "My name is written on the bottom of the bottle.",
    status: "pending",
    createdAt: "2025-09-25",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "nt1",
    title: "New Notice Published",
    message: "Mid-Term Examination Schedule Fall 2025 has been published.",
    type: "notice",
    read: false,
    createdAt: "2025-09-25",
  },
  {
    id: "nt2",
    title: "Complaint Update",
    message: "Your complaint 'Wi-Fi not working in Lab 3' is now In Progress.",
    type: "complaint",
    read: false,
    createdAt: "2025-09-24",
  },
];

export const mockUser: User = {
  id: "s1",
  name: "Sara Manzoor",
  email: "sara@campusconnect.edu",
  role: "student",
  department: "Computer Science",
  semester: 5,
};

export const mockAdmin: User = {
  id: "a1",
  name: "Sir Safi Ullah",
  email: "admin@campusconnect.edu",
  role: "admin",
};