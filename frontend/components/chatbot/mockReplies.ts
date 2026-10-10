// CampusConnect — Chatbot replies (Bilingual: English & Roman Urdu)

const OUT_OF_SCOPE_REPLY_EN = `I don't have information about that. I can only provide answers about CampusConnect and university operations:

📢 Smart Notice Board: Announcements, exam schedules, dates, and official events.
📝 Complaints & Grievances: Submitting, tracking, Wi-Fi, electricity, lab, and maintenance issues.
🔍 Lost & Found: Reporting lost belongings, claiming found items, and proof of ownership.
🎓 Scholarships & Financial Aid: Eligibility criteria, CGPA requirements, and application deadlines.
🏛️ University Information: Campus policies, office timings, administration, and contact details.

Please feel free to ask questions related to these university topics, or contact the university office for further assistance.`;

const OUT_OF_SCOPE_REPLY_UR = `Mujhe is ke baray mein maloomat nahi hai. Main sirf CampusConnect aur university ke in mauzoat (topics) par jawab de sakta hoon:

📢 Smart Notice Board: University ke elaanat (announcements), imtehanat ka schedule, dates aur events.
📝 Complaints & Grievance Redressal: Shikayat darj karna, status track karna, Wi-Fi, bijli ya lab ke masail.
🔍 Lost & Found: Gumshuda ashiya report karna, claim karna aur ownership ka saboot.
🎓 Scholarships & Financial Aid: Wazaif ka criteria, CGPA ki sharten aur aakhri tareekhein (deadlines).
🏛️ University Information: Policies, office ke auqat (timings), administration aur rabta ki tafseelat.

Barah-e-karam inhi topics se mutaliq sawal poochein, ya mazeed maloomat ke liye university office se rabta karein.`;

function isRomanUrdu(text: string): boolean {
  if (!text) return false;
  // Check Urdu script
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
    return true;
  }
  const t = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = new Set(t.split(/\s+/).filter(Boolean));
  // Check for obvious English phrase constructs without strong Roman Urdu markers
  const englishPhrases = [
    "what is", "what are", "when is", "when are", "where is", "where are",
    "how do", "how can", "how to", "tell me", "can you", "who is", "which is",
    "how does", "is there", "are there"
  ];
  const hasEnglishPhrase = englishPhrases.some((p) => t.includes(p));

  const strongRomanUrduTokens = new Set([
    "kya", "kia", "kaise", "kese", "kaisa", "kesa", "kaisay", "kesay",
    "kyun", "kyu", "kahan", "kidhar", "kab", "kon", "kaun", "kitna", "kitne",
    "apne", "aapne", "apna", "aapna", "apni", "aap", "tum", "mera", "meri", "mere", "tera", "teri",
    "uska", "uski", "unka", "unki", "hain", "hoon", "hun", "hoga", "honge",
    "karein", "karen", "batao", "bataiye", "batayein", "btao", "btain", "bata",
    "chahiye", "chahye", "sakte", "saktay", "sakta", "shikayat", "shikayaat", "wazifa", "wazaif",
    "darj", "madad", "masla", "maslay", "gum", "gumshuda", "cheez", "cheezein",
    "salam", "salaam", "aoa", "rabta", "qanoon", "qawaneen", "hazri"
  ]);

  const hasStrongUrduToken = Array.from(words).some((w) => strongRomanUrduTokens.has(w));
  if (hasEnglishPhrase && !hasStrongUrduToken) {
    return false;
  }

  // Roman Urdu tokens strictly excluding English words ("the", "do", "me", "or", "to", "mat", "so", "no", "is", "in")
  const romanUrduTokens = new Set([
    "apne", "aapne", "apna", "aapna", "apni", "aap", "ap", "tum", "tumhara", "tumhari", "tumhare",
    "mai", "main", "hum", "ham", "woh", "wo", "yeh", "ye", "mera", "meri", "mere",
    "tera", "teri", "tere", "uska", "uski", "uske", "unka", "unki", "unke",
    "kya", "kia", "kaise", "kese", "kaisa", "kesa", "kaisay", "kesay", "kyun",
    "kyu", "kahan", "kaha", "kidhar", "kab", "kon", "kaun", "kitna", "kitne", "kitni",
    "mein", "ma", "se", "say", "par", "pe", "ko", "ka", "ki", "ke", "kay",
    "baray", "bara", "baare", "bare", "bary", "liye", "lia", "leeye", "tak", "saath",
    "aur", "ya", "lekin", "magar", "bhi", "toh", "nahi", "nahin", "na",
    "ha", "hai", "hain", "ho", "hoon", "hun", "tha", "thi", "hoga",
    "hogi", "honge", "karo", "karein", "karen", "karna", "karta", "karti", "karte",
    "karun", "karu", "kara", "kare", "batao", "bataiye", "batayein", "btao", "btain", "bata",
    "chahiye", "chahye", "sakte", "sakti", "sakta", "saktay", "sakun", "saku",
    "shikayat", "shikayaat", "wazifa", "wazaif", "darj", "madad", "masla", "maslay",
    "gum", "gumshuda", "cheez", "cheezein", "salam", "salaam", "aoa",
    "rabta", "qanoon", "qawaneen", "hazri"
  ]);

  for (const w of words) {
    if (romanUrduTokens.has(w)) return true;
  }

  const phrases = [
    "kia ha", "kya ha", "kia hai", "kya hai", "kesa darj", "kaise darj",
    "bara ma", "baray mein", "bare me", "baare me", "apne bara", "apne baray",
    "apne bare", "apne baare", "aapna bara", "apna bara", "aapna baray", "aapne bara",
    "tum kon", "aap kon", "kya hal", "kia haal", "kaise ho", "kese ho",
    "darj kara", "darj karein", "darj karo", "lost aur found", "woh the", "wo the", "log the",
  ];
  return phrases.some((p) => t.includes(p));
}

export function getMockReply(message: string): string {
  const m = (message || "").toLowerCase().trim();
  if (!m) return "Please enter a question or message.";

  const isUrdu = isRomanUrdu(m);

  // ==================== IDENTITY & INTRODUCTORY QUERIES ====================
  // Check self-identity queries FIRST before any domain or out-of-scope filtering
  const isUrduIdentity = Boolean(
    // 1. (apne|aapne|apna|aapna|ap|aap) followed by (bara|baray|bare|baare|bary|taaruf|taruf|intro|introduction)
    m.match(/\b(apne|aapne|apna|aapna|ap|aap)\b.*\b(bara|baray|bare|baare|bary|taaruf|taruf|intro|introduction)\b/) ||
    // 2. (bara|baray|bare|baare|bary) followed by (ma|me|mein|mai) and (batao|bata|batayein|btao|bataiye|btain)
    m.match(/\b(bara|baray|bare|baare|bary)\b.*\b(ma|me|mein|mai)\b.*\b(batao|bata|batayein|btao|bataiye|btain)\b/) ||
    // 3. (tum|aap|ap|tu) (kon|kaun|kya|kia) (ho|hain|hn)
    m.match(/\b(tum|aap|ap|tu)\b\s*\b(kon|kaun|kya|kia)\b\s*\b(ho|hain|hn)\b/) ||
    // 4. (kon|kaun) ho (tum|aap|ap)
    m.match(/\b(kon|kaun)\b\s*ho\s*\b(tum|aap|ap)\b/) ||
    // 5. (tumhara|aap ka|ap ka) (naam|name)
    m.match(/\b(tumhara|aap ka|ap ka)\b.*\b(naam|name)\b/) ||
    // 6. (kya|kia) madad (kar|kr)
    m.match(/\b(kya|kia)\b.*\bmadad\b.*\b(kar|kr)\b/) ||
    // 7. Explicit phrases including phonetic variations
    m.match(/apne baray|apne bara|apne bare|apne baare|aapna bara|aapna baray|aapna bare|aapna baare|apna bara|apna baray|apna bare|aapne bara|aapne baray|aapne bare|tum kon|aap kon|ap kon|kon ho|kaun ho|apna taaruf|aapna taaruf|taaruf|taruf|meri kya madad|meri kia madad|apna intro|aapna intro/)
  );

  const isEnglishIdentity = Boolean(
    m.match(/\b(who are you|what are you|tell me about yourself|tell me about you|introduce yourself|what can you do|what do you do|who created you|who made you|what is your name|your name|give me your introduction)\b/) ||
    m.match(/who are you|tell me about yourself|tell me about you|introduce yourself|what can you do|what do you do|your name|who created you/)
  );

  if (isUrduIdentity || (isEnglishIdentity && isUrdu)) {
    return `Assalam-o-Alaikum! 👋 Main CampusConnect Assistant hoon, CampusConnect — Smart University Management Platform ka official AI guide.

Main university ke talaba (students), asatiza (teachers), aur staff ki madad ke liye hazir hoon. Main in ahem shobon (modules) mein aap ki poori madad kar sakta hoon:

📢 Smart Notice Board: University ke ahem elaanat, imtehanat (exam) ka schedule aur AI summaries dekhna.
📝 Complaints & Grievance Redressal: Wi-Fi, bijli, lab ya deegar masail ki shikayat darj karna aur status track karna.
🔍 Lost & Found: Gumshuda ashiya report karna, mili hui cheezein dekhna aur claim darj karna.
🎓 Scholarships & Financial Aid: Merit aur need-based wazaif (scholarships), CGPA ki sharten aur deadlines.
🏛️ University Guidelines: Office ke auqat (timings), administration aur university ke qawaneen.

Aap mujh se English ya Roman Urdu mein university ke baray mein kuch bhi pooch saktay hain!`;
  }

  if (isEnglishIdentity) {
    return `Hello! 👋 I am CampusConnect Assistant, the official AI guide for CampusConnect — Smart University Management Platform.

I am here to assist university students, faculty, and administrative staff. Here is what I can help you with:

📢 Smart Notice Board: Official announcements, examination schedules, deadlines, and AI summaries.
📝 Complaints & Grievance Redressal: Submitting and tracking issues (Wi-Fi, electricity, lab equipment, maintenance).
🔍 Lost & Found: Reporting lost belongings, finding misplaced items, and filing verified ownership claims.
🎓 Scholarships & Financial Aid: Checking eligibility criteria, CGPA rules, and submission dates.
🏛️ University Guidelines: Campus policies, office timings, departmental contacts, and administration.

Feel free to ask questions in English or Roman Urdu!`;
  }

  // ==================== STRICT OUT OF SCOPE CHECK ====================
  // Check non-university topics (cricket, weather, movies, politics, etc.)
  const isOutOfScope = Boolean(
    m.match(/\b(cricket|football|hockey|ipl|psl|match|world cup|weather|mausam|forecast|rain|barish|movie|film|cinema|actor|actress|drama|politics|siasat|election|crypto|bitcoin|recipe|biryani)\b/)
  );
  if (isOutOfScope) {
    return isUrdu ? OUT_OF_SCOPE_REPLY_UR : OUT_OF_SCOPE_REPLY_EN;
  }

  // ==================== ROMAN URDU ROUTING ====================
  if (isUrdu) {
    // Greetings
    if (m.match(/Assalamualikum|salam|aoa/)) {
      return `Assalam-o-Alaikum! 😊 Main CampusConnect AI Assistant hoon. Main notices, shikayaat, Lost & Found, ya wazaif mein aap ki kya madad kar sakta hoon?`;
    }

    // Complaints in Roman Urdu
    if (m.match(/shikayat|darj|masla|problem|complaint/)) {
      return `💬 Complaint darj karnay ka tareeqa:

1️⃣ Student Dashboard par "Complaints" section kholen
2️⃣ "New Complaint" button dabayein
3️⃣ Title, category (Wi-Fi, Electricity, Lab, etc.) aur details darj karein
4️⃣ Optional tasveer attach karein aur Submit karein

Aap ko real-time status updates milengi!`;
    }

    // Lost & Found in Roman Urdu (e.g. "lost aur found system kia ha")
    if (m.match(/lost|found|gum|kho gaya|cheez|claim/)) {
      return `🔍 Lost & Found System:

📌 Agar koi cheez gum hui ya mili hai:
• Sidebar se "Lost & Found" kholen
• "Report Item" par click karein
• Details, tareekh aur location daal kar submit karein

📌 Agar aap ki cheez wahan nazar aa rahi hai:
• "Claim This Item" par click karein aur ownership ka saboot dain. Admin verify karega!`;
    }

    // Exams & Notices in Roman Urdu
    if (m.match(/exam|imtehan|paper|date sheet|schedule|notice/)) {
      return `📝 Imtehanat (Exams) aur Notices:

✔️ Mid-term examinations 20 October se shuru ho rahay hain
✔️ Asal student ID card aur fee clearance slip lazmi hai
✔️ Tamam taza notices Notice Board section mein dastyab hain`;
    }

    // Scholarships in Roman Urdu
    if (m.match(/scholarship|wazifa|financial aid|fee concession/)) {
      return `💰 Scholarships (Wazaif):

✔️ Merit scholarship ke liye kam az kam 3.5 CGPA darkar hai
✔️ Aakhri tareekh (deadline) 15 October hai
✔️ Zaroori kaghazat: Transcript, CNIC aur income certificate`;
    }

    // Profile & Account Management in Roman Urdu
    if (m.match(/profile|account|password|settings/)) {
      return `👤 Profile aur Account Settings:

Profile update karnay ke liye Student Dashboard par login karein, "Profile" ya "Settings" section par jayen, apni zaati ya taleemi tafseelat (naam, department, semester, phone, password) update karein, aur "Save Changes" par click karein.`;
    }

    // Campus Policies in Roman Urdu
    if (m.match(/policy|policies|qanoon|qawaneen|rules|attendance policy|hazri|discipline/)) {
      return `📜 University Policies & Rules (Qawaneen):

1️⃣ Attendance Policy (Hazri):
Har course mein kam az kam 75% attendance lazmi hai. 75% se kam hazri honay par midterm ya final exams mein baithne ki ijazat nahi hoti.

2️⃣ Code of Conduct & Discipline:
Harassment, cheating, plagiarism, ragging aur bad-nazmi par zero-tolerance policy hai. Khilaf-warzi par disciplinary committee foran sakht action leti hai.

3️⃣ Student ID Card Policy:
Campus premises aur examination halls mein official student ID card pehanna lazmi hai.

4️⃣ Library Policy:
Students 14 din ke liye 3 kitabein issue karwa saktay hain. Late return par Rs. 20 rozana jurmana hota hai.

5️⃣ Grading & CGPA:
Passing marks 50% (Grade D) hain aur degree mukammal karnay ke liye kam az kam 2.00 CGPA lazmi hai.`;
    }

    // Contact Numbers & Helplines in Roman Urdu
    if (m.match(/contact|number|phone|helpline|rabta|email|call|helpdesk/)) {
      return `📞 University Contact Numbers & Helplines:

🏛️ General Helpline & Info: +92-51-111-222-333 (info@campusconnect.edu)
🎓 Student Affairs & Financial Aid: +92-51-111-222-333 (studentaffairs@campusconnect.edu)
💻 IT Helpdesk & Support: +92-51-111-222-334 (it-support@campusconnect.edu)
🔍 Campus Security & Lost/Found: +92-51-111-222-335 (security@campusconnect.edu)
📝 Registrar Office: +92-51-111-222-336 (registrar@campusconnect.edu)
🚑 Medical Emergency Clinic: +92-51-111-222-337 (Emergency Hotline: 1122)

Office ke auqat Peer se Jummay, 9:00 AM se 4:00 PM tak hain.`;
    }

    // Office Timings & Administration Contact in Roman Urdu
    if (m.match(/office|timing|timings|hours|auqat|administration|admin block/)) {
      return `🏛️ University Office Timings & Administration:

University offices Peer se Jummay (Monday to Friday) subah 9:00 AM se shaam 4:00 PM tak khulay hotay hain (Lunch break: 1:00 PM se 2:00 PM). Haftay, Itwar aur sarkari chuttiyon par band hotay hain. Administration block main campus ke dakhli raste (main entrance) ke qareeb waqay hai.`;
    }

    // Roman Urdu Fallback
    return OUT_OF_SCOPE_REPLY_UR;
  }

  // ==================== ENGLISH ROUTING ====================

  // Exams & Notices
  if (m.match(/exam|mid.?term|final|paper|test|notice|schedule/)) {
    return `📝 Mid-term examinations start on October 20, 2025.

✔️ Bring your original student ID card
✔️ Fee clearance is mandatory
✔️ Full schedule is available on the Notice Board section

Would you like me to open the Notices page?`;
  }

  // Scholarships
  if (m.match(/scholarship|financial aid|fee concession/)) {
    return `💰 Merit-based scholarship applications are now open.

✔️ Minimum CGPA: 3.5
✔️ Deadline: October 15, 2025
✔️ Documents: Transcript, CNIC copy, income certificate

Incomplete applications will not be accepted.`;
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

  // Wi-Fi
  if (m.match(/wifi|wi.fi|internet|network/)) {
    return `📶 For Wi-Fi issues:

1️⃣ Go to the Complaints page
2️⃣ Select category "Wi-Fi"
3️⃣ Add location and details
4️⃣ Submit

IT staff typically resolve these within 1–2 days.`;
  }

  // Electricity
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

  // Claims
  if (m.match(/claim|my item|ownership/)) {
    return `📋 To track your claims:

1️⃣ Sidebar → "My Claims"
2️⃣ View all your claims
3️⃣ Check status: Pending / Approved / Rejected

Claims are usually verified within 24–48 hours.`;
  }

  // Profile & Account Management
  if (m.match(/profile|account|update profile|how do i update my profile|password|settings/)) {
    return `👤 Profile & Account Management:

Students can update their profile by logging into their dashboard, navigating to the Profile or Settings section, updating their personal/academic details, and clicking "Save Changes".`;
  }

  // Campus Policies & Rules
  if (m.match(/policy|policies|rules|regulation|regulations|code of conduct|attendance policy/)) {
    return `📜 University Policies & Guidelines:

1️⃣ Course Attendance Policy:
A minimum of 75% attendance in each registered course is mandatory to sit for midterm and final examinations. Attendance below 75% results in course debarment.

2️⃣ Student Code of Conduct & Discipline:
Zero-tolerance policy for harassment, cheating, plagiarism, ragging, vandalism, or unauthorized political activity. Violations result in disciplinary action up to suspension or expulsion.

3️⃣ Student ID Card Policy:
Wearing and displaying the official university student ID card is mandatory on campus premises and during exams. Entry without an ID card is strictly restricted.

4️⃣ Library Policy:
Students can borrow up to 3 books for 14 days. An overdue fine of Rs. 20 per day per book applies to late returns.

5️⃣ Grading & Academic Standing:
Minimum passing score is 50% (Grade D). Undergraduate students must maintain a minimum cumulative CGPA of 2.00 to avoid academic probation.`;
  }

  // Contact Numbers & Department Helplines
  if (m.match(/contact|phone|number|helpline|call|email|reach|hotline/)) {
    return `📞 University Contact Numbers & Helplines:

🏛️ General Helpline & Info: +92-51-111-222-333 (info@campusconnect.edu)
🎓 Student Affairs & Financial Aid: +92-51-111-222-333 (studentaffairs@campusconnect.edu)
💻 IT Helpdesk & Portal Support: +92-51-111-222-334 (it-support@campusconnect.edu)
🔍 Campus Security & Lost/Found Desk: +92-51-111-222-335 (security@campusconnect.edu)
📝 Registrar Office: +92-51-111-222-336 (registrar@campusconnect.edu)
🚑 Medical Emergency Clinic Hotline: +92-51-111-222-337 (Emergency: 1122)

Office hours: Monday to Friday, 9:00 AM to 4:00 PM.`;
  }

  // Office Timings & Administration Contact Info
  if (m.match(/office|timing|timings|hours|office hours|administration|admin block/)) {
    return `🏛️ Office Timings & Administration Contact Info:

University offices are open Monday to Friday, from 9:00 AM to 4:00 PM (Lunch break: 1:00 PM - 2:00 PM). Closed on weekends and gazetted holidays. The Administration block is located near the main campus entrance.`;
  }

  // Specific About CampusConnect
  if (m.match(/about campusconnect|about the platform|what is campusconnect/)) {
    return `🎓 CampusConnect is a Smart University Management Platform.

📌 Features:
✔️ Smart Digital Notice Board
✔️ Complaint & Issue Management
✔️ Lost & Found System
✔️ AI-powered Notice Summaries
✔️ Role-based dashboards`;
  }

  // Greetings in English
  if (m.match(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/)) {
    return `Hello! 👋

I'm the CampusConnect Assistant. You can ask me about:

• Notices & Exam Schedules
• Submitting Complaints
• Lost & Found Items
• Scholarships`;
  }

  if (m.match(/thank|thanks/)) {
    return `You're welcome! 😊 Feel free to ask if you need anything else.`;
  }

  // English Fallback
  return OUT_OF_SCOPE_REPLY_EN;
}