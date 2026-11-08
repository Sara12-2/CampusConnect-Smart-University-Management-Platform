import { NextRequest, NextResponse } from "next/server";

const UNIVERSITY_KNOWLEDGE_CONTEXT = `
--- UNIVERSITY OFFICIAL KNOWLEDGE BASE ---
1. Smart Notice Board & Academic Calendar:
   - Midterm Examinations: Commence on October 20 for the Fall semester.
   - Final Examinations: Begin on January 10.
   - Date sheets and room allotments are posted on the digital Notice Board.
   - Mandatory Requirements: Bring original university student ID card and clear all tuition/fee dues before examinations.

2. Complaints & Grievance Redressal:
   - To submit an issue, navigate to the "Complaints" section in your Student Dashboard.
   - Click "New Complaint", select category (Wi-Fi, Electricity, Lab equipment, Maintenance, Sanitation), enter description, and submit.
   - Students receive real-time updates and ticket tracking until resolved.

3. Lost & Found Management:
   - Navigate to the "Lost & Found" module from the sidebar.
   - To report an item: Click "Report Item" with photos and location details.
   - To claim an item: Browse found items, click "Claim This Item", and provide verified proof of ownership.

4. Scholarships & Financial Aid:
   - Merit-Based Scholarship: Minimum CGPA of 3.50 required. Up to 100% tuition concession.
   - Need-Based Scholarship: Minimum CGPA of 2.50 required.
   - Application Deadline: October 15.
   - Required Documents: Official academic transcript, CNIC/B-Form copy, and parent/guardian income certificate. Submit at Student Affairs Office.

5. Office Timings & Administration:
   - Working Hours: Monday to Friday, 9:00 AM to 4:00 PM (Lunch/Prayer break: 1:00 PM - 2:00 PM). Closed weekends and public holidays.
   - Location: Administration Block near the main campus entrance.

6. Helplines & Emergency Contacts:
   - General Helpline & Student Affairs: +92-51-111-222-333 (studentaffairs@campusconnect.edu)
   - IT Helpdesk & Wi-Fi Support: +92-51-111-222-334 (it-support@campusconnect.edu)
   - Campus Security & Lost/Found Desk: +92-51-111-222-335 (security@campusconnect.edu)
   - Registrar Office: +92-51-111-222-336 (registrar@campusconnect.edu)
   - Medical Emergency Clinic: +92-51-111-222-337 or 1122

7. Campus Policies:
   - Attendance Policy: Minimum 75% attendance in each registered course is mandatory to qualify for midterm and final examinations.
   - ID Card Policy: Wearing official university ID cards on campus at all times is strictly required.
   - Library Policy: Undergraduates can borrow up to 3 books for 14 days (overdue fine: Rs. 200/day).
   - Code of Conduct: Zero tolerance for harassment, cheating, or ragging.
------------------------------------------
`;

const SYSTEM_PROMPT = `You are CampusConnect Assistant, the official AI guide for CampusConnect — Smart University Management Platform.
Your mission is to assist university students, faculty, and administrative staff with kindness, accuracy, and professionalism.

CRITICAL LANGUAGE RULE:
- You operate exclusively in the English language.
- If the user writes or asks a question in Roman Urdu, Urdu script, or any language other than English, you MUST NOT answer their question. Under no circumstances should you answer, translate, or summarize questions asked in other languages.
- When non-English or Roman Urdu is detected, you must respond ONLY with:
  "Please ask your question in English. CampusConnect Assistant only accepts inquiries in English."

Capabilities & Guidelines:
1. Always base your university-specific answers on the official knowledge context provided.
2. Tone: Warm, welcoming, respectful, and helpful.
3. Structure your answers cleanly using bullet points (•) or numbered lists (1, 2, 3).
4. If asked about Midterm Exams, always explicitly state that Midterms start on October 20 and Finals on January 10.
5. If asked about Scholarships, always explicitly state the 3.50 CGPA requirement for Merit Scholarships and the October 15 deadline.
6. If the user asks something completely outside university scope (e.g., cricket match scores, movies, weather, politics, cooking), politely decline and state that you only answer questions related to CampusConnect and university operations.
7. STRICT EMOJI POLICY: You must NEVER use emojis or emoticons in your answers. Keep all output strictly professional, clean, and emoji-free.
`;

function getApiKey(): string {
  return (
    process.env.GROQ_API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();
}

async function callDirectGroq(message: string, history: any[] = []): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  const candidateModels = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
  ];

  const messages: any[] = [
    {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\n${UNIVERSITY_KNOWLEDGE_CONTEXT}`,
    },
  ];

  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-4);
    for (const h of recent) {
      messages.push({
        role: h.role === "bot" || h.role === "assistant" ? "assistant" : "user",
        content: String(h.content || ""),
      });
    }
  }

  messages.push({ role: "user", content: message });

  let lastErrorDetail = "";

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CampusConnect/1.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: 600,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) {
          return content;
        }
      } else {
        const errText = await res.text();
        lastErrorDetail = `Model ${model} (${res.status}): ${errText.slice(0, 150)}`;
        console.warn(lastErrorDetail);
      }
    } catch (err: any) {
      lastErrorDetail = `Model ${model} network error: ${err.message}`;
      console.warn(lastErrorDetail);
    }
  }

  throw new Error(`Groq API error: ${lastErrorDetail || "All models failed to respond"}`);
}

function resolveRelevantSources(message: string, reply: string): string[] {
  const combined = `${message} ${reply}`.toLowerCase();

  // If greeting, identity, or polite chatter without specific university inquiry, no sources needed
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you|who are you|introduce yourself)\b/i.test(message.trim()) &&
    !combined.includes("exam") &&
    !combined.includes("scholarship") &&
    !combined.includes("complaint") &&
    !combined.includes("policy") &&
    !combined.includes("timing")
  ) {
    return [];
  }

  const sources: string[] = [];

  // Exams & Date Sheets
  if (combined.match(/exam|midterm|final|date sheet|datesheet|admit card|hall allotment/)) {
    sources.push("Notice: Midterm Examination Schedule");
    sources.push("Academic Calendar & Regulations");
  }

  // Scholarships & Financial Aid
  if (combined.match(/scholarship|financial aid|merit|need-based|cgpa|concession/)) {
    sources.push("Notice: Merit & Need-Based Scholarships");
    sources.push("Student Affairs Financial Aid Guidelines");
  }

  // Complaints & Grievance
  if (combined.match(/complaint|grievance|wi-fi|wifi|electricity|maintenance|lab issue/)) {
    sources.push("Guide 1: How to Submit & Track Complaints");
    sources.push("Policy 8: Student Grievance Redressal");
  }

  // Lost & Found
  if (combined.match(/lost|found|claim|misplaced|belonging|claimant/)) {
    sources.push("Guide 2: How to Report Lost or Found Items");
    sources.push("Policy 7: Lost & Found Property Policy");
  }

  // Office Timings & Contacts
  if (combined.match(/timing|hours|office|admin block|helpline|phone|contact|emergency|clinic/)) {
    sources.push("Guide 8: University Office Timings & Administration");
    sources.push("Guide 10: Departmental Helplines & Emergency Contacts");
  }

  // Campus Policies (Attendance, Library, Code of Conduct)
  if (combined.match(/attendance|75%|absent|leave|library|books|fine|conduct|discipline|id card|harassment/)) {
    sources.push("Policy 2: Attendance & Leave Regulations");
    sources.push("Policy 3: Student Code of Conduct & Campus Discipline");
  }

  // Profile & Account Settings
  if (combined.match(/profile|password|account settings|update profile/)) {
    sources.push("Guide 5: How to Update Profile & Account Settings");
  }

  if (sources.length === 0) {
    if (combined.match(/university|campus|student|portal|faculty|department/)) {
      sources.push("CampusConnect Official Knowledge Base");
    }
  }

  return sources.slice(0, 2);
}

function isNonEnglishQuery(text: string): boolean {
  if (!text) return false;
  // Check for Arabic / Urdu script
  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
    return true;
  }

  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = new Set(cleaned.split(/\s+/).filter(Boolean));

  // Strong Roman Urdu indicators (a single match indicates non-English inquiry)
  const strongIndicators = [
    "kya", "kia", "kaise", "kese", "kaisay", "kesay",
    "kyun", "kyu", "kyn", "kahan", "kidhar", "kab",
    "konsa", "konsi", "konse", "kon", "kaun",
    "batao", "batayein", "bataye", "bataiye", "btao", "btain", "batana",
    "chahiye", "chahye", "mujhe", "mjhe", "mjy", "hamara", "humara", "hamari",
    "shikayat", "shikayaat", "wazifa", "wazaif", "gumshuda", "rabta", "auqat",
    "masla", "maslay", "masail", "karein", "karen", "sakte", "saktay", "sakta", "sakti",
    "parhai", "dakhla", "chutti", "chuttiyan", "samjhao", "karo", "kijiye", "dijiye"
  ];

  for (const ind of strongIndicators) {
    if (words.has(ind)) return true;
  }

  // Auxiliary & grammatical particles (strictly non-English tokens)
  const particles = [
    "hai", "hain", "hyn", "hy", "hoon", "hun", "tha", "thi", "thay",
    "hoga", "hogi", "honge", "hongay", "mera", "meri", "mere", "meray",
    "tera", "teri", "tere", "teray", "apna", "apne", "apni", "aapna", "aapne", "aapni",
    "uska", "uski", "unka", "unki", "inka", "iski", "aap", "tum",
    "karna", "karta", "karti", "karte", "kartay", "karun", "karu",
    "nahi", "nhi", "nahin", "mat", "bhi", "bhe", "wale", "wali", "wala", "walay",
    "baare", "bare", "baray", "ke", "ki", "ko", "se", "sy", "mein", "mai", "ka", "kitna", "kitne"
  ];

  const particleCount = particles.filter((p) => words.has(p)).length;
  if (particleCount >= 2) return true;
  if (particleCount === 1 && words.size <= 5) return true;

  return false;
}

const REJECT_NON_ENGLISH_REPLY =
  "Please ask your question in English. CampusConnect Assistant only accepts inquiries in English.";

function isRefusalOrNonEnglishAnswer(replyText: string): boolean {
  if (!replyText) return false;
  const lower = replyText.toLowerCase();
  const refusalSignatures = [
    "strictly and exclusively in english",
    "communicate strictly and exclusively in english",
    "communicate strictly in english",
    "only accepts inquiries in english",
    "only in english",
    "only communicate in english",
    "i communicate strictly",
    "as the campusconnect assistant, i communicate strictly",
  ];
  return refusalSignatures.some((sig) => lower.includes(sig));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body?.message || "").trim();
    const history = body?.history || [];

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // Strictly decline Roman Urdu or Urdu queries immediately
    if (isNonEnglishQuery(message)) {
      return NextResponse.json({
        reply: REJECT_NON_ENGLISH_REPLY,
        sources: [],
        mode: "verified",
      });
    }

    // 1. Try forwarding to FastAPI backend if available
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const backendRes = await fetch(`${backendUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          use_rag: true,
          history,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        const replyText = data.reply || "";

        // If backend or Gemini detected Roman Urdu and added a refusal preamble while answering
        if (isRefusalOrNonEnglishAnswer(replyText)) {
          return NextResponse.json({
            reply: REJECT_NON_ENGLISH_REPLY,
            sources: [],
            mode: "verified",
          });
        }

        return NextResponse.json({
          reply: replyText,
          sources: data.sources || resolveRelevantSources(message, replyText),
          mode: data.mode || "rag",
        });
      }
    } catch {
      // Backend not running, proceed to direct Gemini call
    }

    // 2. Direct Groq AI Generation using GROQ_API_KEY
    const rawReply = await callDirectGroq(message, history);

    // If direct Groq responded with refusal preamble while trying to answer
    if (isRefusalOrNonEnglishAnswer(rawReply)) {
      return NextResponse.json({
        reply: REJECT_NON_ENGLISH_REPLY,
        sources: [],
        mode: "verified",
      });
    }

    const sources = resolveRelevantSources(message, rawReply);

    return NextResponse.json({
      reply: rawReply,
      sources,
      mode: "verified",
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate answer from Groq API.",
        reply: `Connection Error: Unable to reach Groq API (${error.message || "Check API key & internet"}). Please verify your connection.`,
        mode: "error",
      },
      { status: 500 }
    );
  }
}
