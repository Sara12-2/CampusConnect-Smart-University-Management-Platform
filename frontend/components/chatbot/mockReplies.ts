// Mock AI replies based on keywords
// Backend lagne ke baad, ise API call se replace karenge

export function getMockReply(message: string): string {
  const m = message.toLowerCase();

  // Notice / Exam
  if (m.match(/exam|mid.?term|final|paper|test/)) {
    return `📝 Mid-term examinations 20 October 2025 se shuru honge.

✔️ Original ID card zaroori hai
✔️ Fee clearance mandatory hai
✔️ Detailed schedule university portal par available hai.

Kya aap chahte hain main aapko /student/notices page ka link dun?`;
  }

  if (m.match(/scholarship|financial aid|fee concession/)) {
    return `💰 Merit-based scholarship applications open hain!

✔️ CGPA 3.5+ required
✔️ Last date: 15 October 2025
✔️ Documents: Transcript, CNIC copy, Income certificate

Incomplete applications reject ho jayengi.`;
  }

  if (m.match(/sports|gala|event|fest/)) {
    return `🎉 Annual Sports Gala 5-10 November 2025 tak chalega!

Events: Cricket, Football, Badminton, Athletics
Register karne ke liye Sports Department se rabta karein.`;
  }

  // Complaints
  if (m.match(/complaint|issue|problem|kharab|broken|not working/)) {
    return `💬 Complaint submit karne ke liye:

1️⃣ Sidebar mein "Complaints" par jaayein
2️⃣ "New Complaint" button dabayein
3️⃣ Title, category, description bharein
4️⃣ Image attach karein (optional)
5️⃣ Submit karein

Aap apni complaint track bhi kar sakte hain — status updates milte rahenge.`;
  }

  if (m.match(/wifi|wi.fi|internet|network/)) {
    return `📶 Wi-Fi issue report karne ke liye:

1️⃣ "Complaints" page par jaayein
2️⃣ Category mein "Wi-Fi" select karein
3️⃣ Location aur detail likhein
4️⃣ Submit karein

IT Staff 1-2 din mein resolve karta hai.`;
  }

  if (m.match(/electric|fan|light|bijli/)) {
    return `⚡ Electricity issue ke liye "Complaints" page par:

✔️ Category: Electricity
✔️ Location: Room/Lab number
✔️ Description: Issue ki detail

Maintenance staff ko assign kar diya jayega.`;
  }

  // Lost & Found
  if (m.match(/lost|found|gum|mila|wallet|phone|mobile|id card/)) {
    return `🔍 Lost & Found ke liye:

📌 Item Report karne ke liye:
- Sidebar → "Lost & Found" → "Report Item"
- Type select karein (Lost/Found)
- Description, location, date bharein
- Image attach karein (optional)

📌 Claim karne ke liye:
- Item par click karein
- "Claim This Item" button dabayein
- Proof aur contact dein
- Admin verify karega`;
  }

  if (m.match(/claim|mera|my item/)) {
    return `📋 Claims track karne ke liye:

1️⃣ Sidebar → "My Claims"
2️⃣ Wahan apni saari claims dikhengi
3️⃣ Status check karein: Pending / Approved / Rejected

Claim submit karne ke baad admin 24-48 hours mein verify karta hai.`;
  }

  // General
  if (m.match(/hello|hi|hey|salam|assalam/)) {
    return `Wa Alaikum Assalam! 😊

Main CampusConnect Assistant hoon. Aap mujh se pooch sakte hain:

• Notices
• Complaints
• Lost & Found
• Claims
• Ya koi bhi campus-related sawal`;
  }

  if (m.match(/thank|shukriya|jazak/)) {
    return `Khush rahein! 😊 Koi aur sawal ho to zaroor poochein.`;
  }

  if (m.match(/campusconnect|platform|website|about/)) {
    return `🎓 CampusConnect ek Smart University Management Platform hai.

📌 Features:
✔️ Smart Digital Notice Board
✔️ Complaint & Issue Management
✔️ Lost & Found System
✔️ AI-powered Notice Summaries
✔️ Role-based Dashboards (Student + Admin)

Aur detail ke liye /about page dekhen.`;
  }

  if (m.match(/login|sign in|password/)) {
    return `🔐 Login karne ke liye:

1️⃣ Homepage par "Login" click karein
2️⃣ Role select karein (Student/Admin)
3️⃣ Email aur password daalein

⚠️ Filhaal koi bhi valid email/password chalega (demo mode).`;
  }

  if (m.match(/help|madad|kaise|how/)) {
    return `Main aapki madad kar sakta hoon in cheezon mein:

📢 Notices dekhna
💬 Complaint submit karna
🔍 Lost items report karna
📋 Claims check karna
👤 Profile update karna

Kis baare mein jaanna chahte hain?`;
  }

  if (m.match(/profile|account|mera data/)) {
    return `👤 Profile update karne ke liye:

1️⃣ Sidebar → "Profile"
2️⃣ Name, department, semester edit karein
3️⃣ "Save Changes" dabayein

Email change nahi ho sakti (admin se contact karein).`;
  }

  // Default reply
  return `Hmm, main samajh nahi paya. 🤔

Aap in cheezon ke baare mein pooch sakte hain:

• 📢 Notices (exam, scholarship)
• 💬 Complaints (Wi-Fi, electricity)
• 🔍 Lost & Found items
• 📋 Claims
• 👤 Profile

Ya "help" likh kar options dekhein.`;
}