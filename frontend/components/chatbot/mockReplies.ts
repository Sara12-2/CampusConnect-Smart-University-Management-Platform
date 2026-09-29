// CampusConnect — Chatbot replies (English)
// TODO: Replace with real backend API call when ready.

export function getMockReply(message: string): string {
  const m = message.toLowerCase();

  // Exam / notices
  if (m.match(/exam|mid.?term|final|paper|test/)) {
    return `📝 Mid-term examinations start on October 20, 2025.

✔️ Bring your original student ID card
✔️ Fee clearance is mandatory
✔️ Full schedule is available on the university portal

Would you like me to open the Notices page?`;
  }

  if (m.match(/scholarship|financial aid|fee concession/)) {
    return `💰 Merit-based scholarship applications are now open.

✔️ Minimum CGPA: 3.5
✔️ Deadline: October 15, 2025
✔️ Documents: Transcript, CNIC copy, income certificate

Incomplete applications will not be accepted.`;
  }

  if (m.match(/sports|gala|event|fest/)) {
    return `🎉 The Annual Sports Gala runs from November 5–10, 2025.

Events: Cricket, Football, Badminton, Athletics
Register with the Sports Department to participate.`;
  }

  // Complaints
  if (m.match(/complaint|issue|problem|broken|not working/)) {
    return `💬 To submit a complaint:

1️⃣ Open the Complaints page
2️⃣ Click "New Complaint"
3️⃣ Fill in title, category, and description
4️⃣ Attach an image (optional)
5️⃣ Submit

You'll get live status updates as it's resolved.`;
  }

  if (m.match(/wifi|wi.fi|internet|network/)) {
    return `📶 For Wi-Fi issues:

1️⃣ Go to the Complaints page
2️⃣ Select category "Wi-Fi"
3️⃣ Add location and details
4️⃣ Submit

IT staff typically resolve these within 1–2 days.`;
  }

  if (m.match(/electric|fan|light|power/)) {
    return `⚡ For electricity-related issues:

✔️ Category: Electricity
✔️ Location: Room or lab number
✔️ Description: What's not working

Your complaint will be assigned to the maintenance team.`;
  }

  // Lost & Found
  if (m.match(/lost|found|missing|wallet|phone|mobile|id card/)) {
    return `🔍 Lost & Found:

📌 To report an item:
• Sidebar → "Lost & Found" → "Report Item"
• Choose Lost or Found
• Add description, location, and date

📌 To claim an item:
• Open the item
• Click "Claim This Item"
• Provide proof and contact info
• Admin will verify`;
  }

  if (m.match(/claim|my item|ownership/)) {
    return `📋 To track your claims:

1️⃣ Sidebar → "My Claims"
2️⃣ View all your claims
3️⃣ Check status: Pending / Approved / Rejected

Claims are usually verified within 24–48 hours.`;
  }

  // General
  if (m.match(/hello|hi|hey|salam|assalam/)) {
    return `Hello! 👋

I'm the CampusConnect Assistant. You can ask me about:

• Notices
• Complaints
• Lost & Found
• Claims`;
  }

  if (m.match(/thank|thanks|shukriya/)) {
    return `You're welcome! 😊 Feel free to ask if you need anything else.`;
  }

  if (m.match(/campusconnect|platform|website|about/)) {
    return `🎓 CampusConnect is a Smart University Management Platform.

📌 Features:
✔️ Smart Digital Notice Board
✔️ Complaint & Issue Management
✔️ Lost & Found System
✔️ AI-powered Notice Summaries
✔️ Role-based dashboards`;
  }

  if (m.match(/login|sign in|password/)) {
    return `🔐 To sign in:

1️⃣ Click "Login" on the homepage
2️⃣ Select your role (Student / Admin)
3️⃣ Enter your email and password

For a quick demo, any valid email and a 6+ character password will work.`;
  }

  if (m.match(/help|how|guide|assist/)) {
    return `I can help you with:

📢 Viewing notices
💬 Submitting complaints
🔍 Reporting lost items
📋 Tracking claims
👤 Updating your profile

What would you like to do?`;
  }

  if (m.match(/profile|account|my data/)) {
    return `👤 To update your profile:

1️⃣ Sidebar → "Profile"
2️⃣ Edit your name, department, or semester
3️⃣ Click "Save Changes"

Your email can't be changed here — please contact admin.`;
  }

  // Default
  return `Hmm, I didn't quite understand that. 🤔

Here are some things you can ask me:

• 📢 Notices (exams, scholarships)
• 💬 Complaints (Wi-Fi, electricity)
• 🔍 Lost & Found items
• 📋 Claims

Or type "help" to see all options.`;
}