// CampusConnect — Fallback AI Assistant responses (Strictly English Only)

export const OUT_OF_SCOPE_REPLY_EN = `I don't have information about that. I can only provide answers about CampusConnect and university operations:

📢 Smart Notice Board: Announcements, exam schedules, dates, and official events.
📝 Complaints & Grievances: Submitting, tracking, Wi-Fi, electricity, lab, and maintenance issues.
🔍 Lost & Found: Reporting lost belongings, claiming found items, and proof of ownership.
🎓 Scholarships & Financial Aid: Eligibility criteria, CGPA requirements, and application deadlines.
🏛️ University Information: Campus policies, office timings, administration, and contact details.

Please feel free to ask questions related to these university topics, or contact the university office for further assistance.`;

export function getFallbackReply(message: string): string {
  const m = (message || "").toLowerCase().trim();
  if (!m) return "Please enter a question or message.";

  // Identity & Introduction
  if (
    m.includes("who are you") ||
    m.includes("what are you") ||
    m.includes("about yourself") ||
    m.includes("introduce yourself") ||
    m.includes("what can you do") ||
    m.includes("your name")
  ) {
    return `Hello! 👋 I am CampusConnect Assistant, the official AI guide for CampusConnect — Smart University Management Platform.

I can assist you with:
• 📢 Smart Notice Board: Official announcements & examination schedules
• 📝 Complaints & Grievances: Submitting & tracking facility issues
• 🔍 Lost & Found: Reporting misplaced items & verifying ownership claims
• 🎓 Scholarships & Aid: Merit & need-based scholarship criteria & deadlines
• 🏛️ Campus Policies: Office hours, attendance rules (75% minimum), & contact directories

How can I help you today?`;
  }

  // Greetings
  if (m === "hi" || m === "hello" || m === "hey" || m.startsWith("good morning") || m.startsWith("good afternoon") || m.startsWith("good evening")) {
    return "Hello! 👋 Welcome to CampusConnect. How can I assist you today with notices, exam dates, complaints, scholarships, or university policies?";
  }

  // Exams & Schedule
  if (m.match(/exam|mid.?term|final|paper|schedule|datesheet|date sheet/)) {
    return `📝 Examination Schedule:

• Midterm Examinations commence on October 20 for the Fall semester.
• Final Examinations begin on January 10.
• Detailed date sheets and hall allotments are published on the Notice Board.
• Requirement: Students must bring their original university ID card and clear fee dues before exams.`;
  }

  // Scholarships
  if (m.match(/scholarship|financial aid|merit|need-based|fee concession/)) {
    return `💰 University Scholarships & Financial Aid:

• Merit Scholarship: Minimum 3.50 CGPA required (up to 100% tuition fee waiver).
• Need-Based Scholarship: Minimum 2.50 CGPA required.
• Application Deadline: October 15.
• Required Documents: Official transcript, CNIC copy, and guardian income certificate. Submit at the Student Affairs Office.`;
  }

  // Complaints
  if (m.match(/complaint|lodge|report issue|wifi issue|electricity|grievance/)) {
    return `💬 How to Submit a Complaint:

1. Open your Student Dashboard and click on "Complaints" in the sidebar.
2. Click "New Complaint".
3. Select category (Wi-Fi, Electricity, Lab equipment, Maintenance).
4. Enter issue details, attach optional photos, and click Submit.
5. You can track real-time resolution updates from your dashboard.`;
  }

  // Lost & Found
  if (m.match(/lost|found|claim item|misplaced|belonging/)) {
    return `🔍 Lost & Found System:

• Report Misplaced Item: Open "Lost & Found" from the sidebar and click "Report Item" with photos and location details.
• Claim Found Item: Browse verified found items, click "Claim This Item", and provide proof of ownership for administrator verification.`;
  }

  // Office Timings & Contacts
  if (m.match(/timing|hours|office|admin block|contact|helpline|phone|email/)) {
    return `🏛️ University Office Hours & Contacts:

• Hours: Monday to Friday, 9:00 AM – 4:00 PM (Lunch break: 1:00 PM – 2:00 PM). Closed on weekends and holidays.
• Administration Block: Located near the main campus entrance.
• Student Affairs Helpline: +92-51-111-222-333 (studentaffairs@campusconnect.edu)
• IT & Wi-Fi Helpdesk: +92-51-111-222-334 (it-support@campusconnect.edu)
• Security & Emergency Clinic: +92-51-111-222-337 or 1122`;
  }

  // Campus Policies & Rules
  if (m.match(/policy|policies|rules|regulation|attendance|discipline|id card|library/)) {
    return `📜 Key Campus Policies:

• Attendance: Minimum 75% attendance in each course is strictly required to appear in midterm and final examinations.
• ID Card: Wearing your official university student ID card at all times on campus is mandatory.
• Library: Undergraduates may borrow up to 3 books for 14 days (overdue fine: Rs. 200/day).
• Conduct: Zero tolerance for harassment, cheating, or ragging.`;
  }

  // Gratitude / Thank you
  if (m.match(/thank|thanks/)) {
    return `You're welcome! 😊 Feel free to ask if you need anything else.`;
  }

  // English Fallback
  return OUT_OF_SCOPE_REPLY_EN;
}

// Backwards compatibility alias
export const getMockReply = getFallbackReply;
