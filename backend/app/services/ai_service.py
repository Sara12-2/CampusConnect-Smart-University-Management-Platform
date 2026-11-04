"""CampusConnect AI Service.

Integrates with Google Gemini AI via google-genai (with direct REST API fallback)
to provide intelligent, friendly, English-only chat capabilities with strict
university domain knowledge and RAG grounding.
"""

import os
import re
import json
import logging
import urllib.request
from typing import List, Optional, Dict, Any

from app.config import settings

logger = logging.getLogger(__name__)

# ============================================================
# STANDARD REPLIES (ENGLISH ONLY)
# ============================================================

IDENTITY_REPLY_EN = (
    "Hello! 👋 I am CampusConnect Assistant, the official AI guide for CampusConnect — "
    "Smart University Management Platform.\n\n"
    "I am here to assist university students, faculty, and administrative staff. "
    "Here is what I can help you with:\n\n"
    "📢 Smart Notice Board: Official announcements, examination schedules, deadlines, and AI summaries.\n\n"
    "📝 Complaints & Grievance Redressal: Submitting and tracking issues (Wi-Fi, electricity, lab equipment, maintenance).\n\n"
    "🔍 Lost & Found: Reporting lost items, finding misplaced property, and filing verified ownership claims.\n\n"
    "🎓 Scholarships & Financial Aid: Merit & need-based scholarship criteria, CGPA rules, and submission dates.\n\n"
    "🏛️ University Guidelines: Campus policies, office timings, departmental contacts, and administration.\n\n"
    "How can I help you today?"
)

GREETING_REPLY_EN = (
    "Hello! 👋 Welcome to CampusConnect. How can I assist you today with notices, "
    "complaints, lost & found items, scholarships, or campus policies?"
)

OUT_OF_SCOPE_REPLY_EN = (
    "I don't have information about that. I can only provide answers about CampusConnect and university operations:\n\n"
    "📢 Smart Notice Board: Announcements, exam schedules, deadlines, and official events.\n\n"
    "📝 Complaints & Grievances: Submitting, tracking, Wi-Fi, electricity, lab, and maintenance issues.\n\n"
    "🔍 Lost & Found: Reporting lost belongings, claiming found items, and proof of ownership.\n\n"
    "🎓 Scholarships & Financial Aid: Eligibility criteria, CGPA requirements, and application deadlines.\n\n"
    "🏛️ University Information: Campus policies, office timings, administration, and contact details.\n\n"
    "Please feel free to ask questions related to these university topics, or contact the university office for further assistance."
)

# Out-of-domain keywords that strictly do not belong to university operations
OUT_OF_DOMAIN_KEYWORDS = [
    "news", "politics", "election", "weather", "forecast", "rain today",
    "sunny today", "temperature outside", "cricket", "match score", "ipl",
    "psl", "world cup", "football", "cinema", "movie", "film", "drama",
    "song", "actress", "actor", "stock market", "crypto", "bitcoin", "trading",
    "horoscope", "astrology", "recipe", "cooking", "restaurant", "biryani",
    "joke", "poetry",
]

# University domain terms that whitelist queries
UNIVERSITY_WHITELIST = [
    "campus", "university", "notice", "notices", "exam", "exams", "paper",
    "complaint", "complaints", "lost", "found", "claim", "scholarship",
    "scholarships", "gala", "sports gala", "portal", "admin", "department",
    "semester", "cgpa", "fee", "fees", "id card", "card", "library", "lab",
    "wifi", "wi-fi", "attendance", "hostel", "teacher", "student", "course",
    "grade", "grading", "result", "timetable", "schedule", "profile", "account",
    "settings", "password", "timing", "timings", "hours", "office",
    "administration", "entrance", "contact", "contacts", "details", "update",
    "policy", "policies", "rule", "rules", "regulation", "regulations",
    "phone", "number", "helpline", "email", "emergency", "clinic", "hotline",
]


# ============================================================
# LANGUAGE & QUERY CLASSIFIERS (STRICT ENGLISH ENFORCEMENT)
# ============================================================

NON_ENGLISH_REJECT_REPLY = (
    "Please ask your question in English. CampusConnect Assistant only accepts inquiries in English."
)


def detect_language(text: str) -> str:
    """Always enforce English as the system language."""
    return "english"


def is_roman_urdu(text: str) -> bool:
    """Detects whether user is asking in Roman Urdu or Urdu script."""
    if not text:
        return False
    if re.search(r"[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]", text):
        return True
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    words = set(cleaned.split())

    # Strong Roman Urdu indicators (a single match indicates non-English inquiry)
    strong_indicators = [
        "kya", "kia", "kaise", "kese", "kaisa", "kesa", "kaisay", "kesay",
        "kyun", "kyu", "kyn", "kahan", "kidhar", "kab", "kon", "kaun",
        "konsa", "konsi", "konse", "batao", "batayein", "bataye", "bataiye",
        "btao", "btain", "batana", "chahiye", "chahye", "mujhe", "mjhe", "mjy",
        "hamara", "humara", "hamari", "shikayat", "shikayaat", "wazifa", "wazaif",
        "gumshuda", "rabta", "auqat", "masla", "maslay", "masail",
        "karein", "karen", "sakte", "saktay", "sakta", "sakti",
        "parhai", "dakhla", "chutti", "chuttiyan", "samjhao", "karo", "kijiye", "dijiye"
    ]
    for ind in strong_indicators:
        if ind in words:
            return True

    # Auxiliary & grammatical particles
    particles = [
        "hai", "hain", "hyn", "hy", "hoon", "hun", "tha", "thi", "thay",
        "hoga", "hogi", "honge", "hongay", "mera", "meri", "mere", "meray",
        "tera", "teri", "tere", "teray", "apna", "apne", "apni", "aapna", "aapne", "aapni",
        "uska", "uski", "unka", "unki", "inka", "iski", "aap", "tum",
        "karna", "karta", "karti", "karte", "kartay", "karun", "karu",
        "nahi", "nhi", "nahin", "mat", "bhi", "bhe", "wale", "wali", "wala", "walay",
        "baare", "bare", "baray", "ke", "ki", "ko", "se", "sy", "mein", "mai", "ka", "kitna", "kitne"
    ]
    particle_count = sum(1 for p in particles if p in words)
    if particle_count >= 2:
        return True
    if particle_count == 1 and len(words) <= 5:
        return True
    return False


def is_refusal_or_non_english(reply_text: str) -> bool:
    """Check if AI generated a response stating it only communicates in English."""
    if not reply_text:
        return False
    lower = reply_text.lower()
    signatures = [
        "strictly and exclusively in english",
        "communicate strictly and exclusively in english",
        "communicate strictly in english",
        "only accepts inquiries in english",
        "only in english",
        "only communicate in english",
        "i communicate strictly",
        "as the campusconnect assistant, i communicate strictly",
    ]
    return any(sig in lower for sig in signatures)


def is_identity_query(text: str) -> bool:
    """Check if query is asking for self-identity or introduction."""
    if not text:
        return False
    t = text.lower().strip()
    cleaned = re.sub(r"[^\w\s]", " ", t)

    if re.search(
        r"\b(who are you|what are you|tell me about yourself|tell me about you|introduce yourself|what can you do|what do you do|who created you|who made you|what is your name|your name|give me your introduction)\b",
        cleaned,
    ):
        return True

    identity_phrases = [
        "who are you",
        "what are you",
        "tell me about yourself",
        "tell me about you",
        "about yourself",
        "introduce yourself",
        "introduction",
        "what can you do",
        "what do you do",
        "who created you",
        "what is your name",
        "your name",
    ]
    return any(p in cleaned for p in identity_phrases)


def is_greeting_query(text: str) -> bool:
    """Check if query is a simple greeting."""
    if not text:
        return False
    t = text.lower().strip()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    tokens = cleaned.split()
    if len(tokens) <= 4:
        greeting_words = {"hi", "hello", "hey", "greetings"}
        if set(tokens).intersection(greeting_words):
            return True
        greeting_phrases = ["good morning", "good afternoon", "good evening", "how are you"]
        if any(p in cleaned for p in greeting_phrases):
            return True
    return False


def is_out_of_domain(text: str) -> bool:
    """Checks if query is completely unrelated to university operations."""
    if not text:
        return False

    if is_identity_query(text) or is_greeting_query(text):
        return False

    t = text.lower()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    words = set(cleaned.split())

    if words.intersection(UNIVERSITY_WHITELIST):
        return False
    if any(term in cleaned for term in ["sports gala", "campusconnect", "wi fi", "lost and found", "lost & found"]):
        return False

    for kw in OUT_OF_DOMAIN_KEYWORDS:
        if " " in kw:
            if kw in cleaned:
                return True
        else:
            if kw in words:
                return True

    return False


def is_university_query(text: str) -> bool:
    """Check if query specifically pertains to university/CampusConnect operations."""
    if not text:
        return False
    t = text.lower()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    words = set(cleaned.split())
    if words.intersection(UNIVERSITY_WHITELIST):
        return True
    return any(term in cleaned for term in [
        "sports gala", "campusconnect", "lost and found", "lost & found",
        "notice board", "student dashboard", "submit complaint", "update profile",
        "my profile", "office timing", "office timings", "office hours", "admin block",
        "administration contact", "change password", "save changes", "profile settings",
        "profile update", "account settings", "how do i update my profile",
        "contact number", "phone number", "helpline number", "emergency number",
        "contact info", "attendance policy", "campus policy", "university policy",
        "rules and regulations", "discipline policy", "code of conduct",
    ])


def get_out_of_scope_message(message: str = "") -> str:
    """Returns English out-of-scope response."""
    return OUT_OF_SCOPE_REPLY_EN


# ============================================================
# SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = f"""You are CampusConnect Assistant, the official AI guide for CampusConnect — Smart University Management Platform.
Your mission is to assist university students, teachers, and staff with kindness, accuracy, and professionalism.

CRITICAL LANGUAGE RULE:
- You operate strictly and exclusively in the English language.
- If the user writes or asks a question in Roman Urdu, Urdu script, or any language other than English, you MUST NOT answer their question. Under no circumstances should you answer, summarize, or translate questions asked in other languages.
- When non-English or Roman Urdu is detected, you must respond ONLY with:
  "{NON_ENGLISH_REJECT_REPLY}"

Capabilities & Personality:
1. Tone: Warm, welcoming, respectful, and helpful.
2. Core University Topics:
   - Smart Notice Board & Academic Calendar:
     * Midterm Examinations start on October 20 (Fall semester).
     * Final Examinations begin on January 10.
     * Official date sheets, room allotments, and notices are published on the Notice Board.
     * Requirements: Students must bring their original university ID card and clear fee dues before examinations.
   - Complaints & Grievance Redressal: Submitting issues (Wi-Fi, electricity, lab, maintenance), tracking status, and follow-ups.
   - Lost & Found: Reporting lost belongings, finding misplaced items, and claim verification.
   - Scholarships & Financial Aid:
     * Merit-based scholarships: Minimum CGPA of 3.50 required. Application deadline is October 15. Up to 100% tuition concession.
     * Need-based scholarships: Minimum CGPA of 2.50 required. Application deadline is October 15. Apply via Student Affairs office.
     * Required documents: Academic transcript, CNIC copy, and income certificate.
   - Office Timings & Administration Contact Info:
     * Office Hours: Monday to Friday, 9:00 AM to 4:00 PM (Lunch break: 1:00 PM - 2:00 PM). Closed weekends & holidays.
     * Location: Administration Block is near the main campus entrance.
   - Contact Numbers & Department Helplines:
     * General Helpline & Student Affairs: +92-51-111-222-333 (studentaffairs@campusconnect.edu)
     * IT Helpdesk & Portal Support: +92-51-111-222-334 (it-support@campusconnect.edu)
     * Campus Security & Lost/Found Desk: +92-51-111-222-335 (security@campusconnect.edu)
     * Registrar Office: +92-51-111-222-336 (registrar@campusconnect.edu)
     * Medical Emergency Clinic Hotline: +92-51-111-222-337 or 1122
   - University Campus Policies & Regulations:
     * Attendance Policy: Minimum 75% attendance in each course is strictly required to sit in midterm and final exams.
     * Code of Conduct & Discipline: Zero-tolerance for harassment, cheating, plagiarism, or ragging.
     * Student ID Card Policy: Wearing official university student ID card at all times on campus is mandatory.
     * Library Policy: Maximum 3 books for 14 days; late fee Rs. 200/day.
     * Grading Policy: Minimum passing grade is D (50%). Minimum cumulative CGPA of 2.00 is required for graduation.
   - Profile & Account Management: Students can update their profile by logging into their dashboard, navigating to the Profile or Settings section, updating personal/academic details, and clicking "Save Changes".

Knowledge & Scope Rules:
- When asked about exams or exam schedule, always explicitly state that Midterm examinations start on October 20, and Final examinations begin on January 10.
- When asked about scholarships, state the minimum 3.50 CGPA requirement for Merit Scholarships and the deadline of October 15.
- Queries regarding campus policies, rules, regulations, contact numbers, phone numbers, helplines, profile settings, account updates, and office hours are VALID university/platform topics and MUST NEVER be classified as out-of-context. Answer them helpfully with clear instructions.
- When context from the university knowledge base is provided, base your answer strictly on that context.
- If the user asks anything strictly OUT OF CONTEXT (such as general news, weather, movies, celebrities, cricket match scores, politics, or general topics unrelated to university operations), respond with the standard message:
  "{OUT_OF_SCOPE_REPLY_EN}"
- Keep your answers structured, clean, and easy to read in English. Use numbered lists (1, 2, 3) or clean bullet points (•).
"""


def _get_api_key() -> str:
    key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
    return key.strip()


def test_gemini_connection() -> Dict[str, Any]:
    """Tests real-time connectivity to Google Gemini API using configured key."""
    api_key = _get_api_key()
    if not api_key:
        return {
            "connected": False,
            "error": "GEMINI_API_KEY is not configured.",
            "model": settings.ai_model,
        }

    # 1. Test using direct Google Generative Language REST API
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.ai_model}?key={api_key}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "CampusConnect/1.0", "Accept": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=7) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                display_name = data.get("displayName", settings.ai_model)
                return {
                    "connected": True,
                    "model": settings.ai_model,
                    "displayName": display_name,
                    "message": f"Successfully connected to Google Gemini API ({display_name}).",
                }
    except Exception as exc:
        logger.debug(f"Direct REST model query failed: {exc}")

    # 2. Test using google.genai SDK
    try:
        from google import genai  # type: ignore

        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model=settings.ai_model,
            contents="Respond with 'OK' only.",
        )
        if resp and resp.text:
            return {
                "connected": True,
                "model": settings.ai_model,
                "message": f"Successfully connected to Gemini API via google-genai SDK ({settings.ai_model}).",
            }
    except Exception as exc:
        return {
            "connected": False,
            "error": str(exc),
            "model": settings.ai_model,
        }

    return {
        "connected": False,
        "error": "Unable to verify Gemini connectivity.",
        "model": settings.ai_model,
    }


def _call_gemini_rest(prompt: str, system_instruction: str, api_key: str) -> Optional[str]:
    """Direct REST call to Gemini generateContent endpoint."""
    model_candidates = [
        settings.ai_model,
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        "gemini-3-flash-preview",
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest",
    ]

    for model_name in model_candidates:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": system_instruction}]
                },
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1000,
                },
            }
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "CampusConnect/1.0",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=20) as response:
                if response.status == 200:
                    resp_json = json.loads(response.read().decode("utf-8"))
                    candidates = resp_json.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"].strip()
        except Exception as exc:
            logger.debug(f"Direct REST generateContent failed for {model_name}: {exc}")

    return None


def generate_chat_response(
    prompt: str,
    context: str = "",
    history: Optional[List[Dict[str, Any]]] = None,
    system_instruction: str = SYSTEM_PROMPT,
) -> str:
    """Generate a chat response strictly in English using Google Gemini API."""
    user_query = (prompt or "").strip()
    if not user_query:
        return "Please enter a question or message."

    # 0. Strictly decline Roman Urdu or Urdu queries immediately
    if is_roman_urdu(user_query):
        return NON_ENGLISH_REJECT_REPLY

    # 1. Identity / Introduction Queries
    if is_identity_query(user_query):
        return IDENTITY_REPLY_EN

    # 2. Standalone Greeting Queries
    if is_greeting_query(user_query) and not context:
        return GREETING_REPLY_EN

    # 3. Strict Out-of-Domain Check
    if is_out_of_domain(user_query):
        return OUT_OF_SCOPE_REPLY_EN

    # 4. If retrieved RAG context is empty and query is not a university topic
    if not context.strip() and not is_university_query(user_query):
        return OUT_OF_SCOPE_REPLY_EN

    api_key = _get_api_key()
    if not api_key:
        logger.error("GEMINI_API_KEY is not set.")
        return _fallback_offline_response(user_query, context)

    # Build full prompt
    full_prompt = ""
    if context:
        full_prompt += f"--- UNIVERSITY KNOWLEDGE BASE CONTEXT ---\n{context}\n------------------------------------------\n\n"
    if history:
        history_str = "\n".join([f"{h.get('role', 'user')}: {h.get('content', '')}" for h in history[-4:]])
        full_prompt += f"Recent Conversation:\n{history_str}\n\n"
    full_prompt += f"User: {user_query}\nAssistant:"

    # 1. Try google-genai SDK
    candidate_models = [
        settings.ai_model,
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        "gemini-3-flash-preview",
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest",
    ]

    try:
        from google import genai  # type: ignore
        from google.genai import types  # type: ignore

        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3,
            max_output_tokens=1000,
        )

        for model_name in candidate_models:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=full_prompt,
                    config=config,
                )
                if response and response.text:
                    reply = response.text.strip()
                    if is_refusal_or_non_english(reply):
                        return NON_ENGLISH_REJECT_REPLY
                    if "don't have information" in reply.lower():
                        return OUT_OF_SCOPE_REPLY_EN
                    return reply
            except Exception as model_err:
                logger.debug(f"google.genai call attempt with {model_name} failed: {model_err}")
    except Exception as exc:
        logger.debug(f"google.genai SDK exception: {exc}")

    # 2. Try Direct Google Generative Language REST API
    rest_reply = _call_gemini_rest(full_prompt, system_instruction, api_key)
    if rest_reply:
        if is_refusal_or_non_english(rest_reply):
            return NON_ENGLISH_REJECT_REPLY
        if "don't have information" in rest_reply.lower():
            return OUT_OF_SCOPE_REPLY_EN
        return rest_reply

    # 3. Try legacy google.generativeai SDK
    try:
        import google.generativeai as legacy_genai  # type: ignore

        legacy_genai.configure(api_key=api_key)
        for legacy_model in ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]:
            try:
                model = legacy_genai.GenerativeModel(
                    model_name=legacy_model,
                    system_instruction=system_instruction,
                )
                response = model.generate_content(full_prompt)
                if response and response.text:
                    reply = response.text.strip()
                    if is_refusal_or_non_english(reply):
                        return NON_ENGLISH_REJECT_REPLY
                    if "don't have information" in reply.lower():
                        return OUT_OF_SCOPE_REPLY_EN
                    return reply
            except Exception:
                pass
    except Exception as exc:
        logger.error(f"Generative AI legacy SDK failed: {exc}")

    # If all API calls fail, fallback to local knowledge
    return _fallback_offline_response(user_query, context)


def generate_summary(content: str) -> str:
    """Summarize university notice text for digital notice board."""
    text = (content or "").strip()
    if not text:
        return ""

    api_key = _get_api_key()
    if api_key:
        try:
            from google import genai  # type: ignore

            client = genai.Client(api_key=api_key)
            prompt = f"Summarize this university notice into 1 or 2 concise, clear English sentences:\n\n{text}"
            for m in [settings.ai_model, "gemini-2.5-flash", "gemini-flash-latest"]:
                try:
                    response = client.models.generate_content(
                        model=m,
                        contents=prompt,
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    pass
        except Exception:
            pass

    words = text.split()
    summary = " ".join(words[:40])
    if len(words) > 40:
        summary += "..."
    return summary


def _fallback_offline_response(message: str, context: str = "") -> str:
    """English-only fallback when API is unreachable or key is pending."""
    user_query = (message or "").strip()
    m = user_query.lower()

    if is_identity_query(user_query):
        return IDENTITY_REPLY_EN

    if is_greeting_query(user_query):
        return GREETING_REPLY_EN

    if is_out_of_domain(user_query) or (not context and not is_university_query(user_query)):
        return OUT_OF_SCOPE_REPLY_EN

    if context and len(context) > 20 and is_university_query(user_query):
        sections = context.split("\n\n")
        query_words = set(re.findall(r"\w+", m)) - {"what", "is", "the", "how", "do", "i"}
        best_section = None
        for sec in sections:
            sec_lower = sec.lower()
            if any(w in sec_lower for w in query_words):
                best_section = sec
                break
        if best_section:
            return f"{best_section}\n\n(Note: Generated from verified CampusConnect knowledge base)."

    if "thank" in m or "thanks" in m:
        return "You're welcome! Feel free to ask if you need any more help with CampusConnect. 😊"

    if any(k in m for k in ["complaint", "problem", "lodge", "issue"]):
        return (
            "To submit a complaint, navigate to the Complaints section in your student dashboard:\n\n"
            "1. Click 'New Complaint'.\n"
            "2. Select the issue category (Wi-Fi, Electricity, Lab, etc.).\n"
            "3. Enter the description and attach a photo (optional), then submit.\n\n"
            "You will receive real-time status updates."
        )

    if any(k in m for k in ["lost", "found", "claim"]):
        return (
            "For Lost & Found services, open the Lost & Found section in the sidebar:\n\n"
            "1. Click 'Report Item' to report a lost or found object.\n"
            "2. Select a found item and click 'Claim This Item' with proof of ownership to claim it."
        )

    if any(k in m for k in ["exam", "notice", "schedule", "dates", "announcement", "midterm", "final", "date sheet", "datesheet"]):
        return (
            "📝 Midterm examinations commence on October 20 for the Fall semester.\n"
            "Final examinations begin on January 10.\n\n"
            "Detailed date sheets and hall allotments are published in the Notice Board section. "
            "Students must bring their original university ID card and clear all fee dues prior to examinations."
        )

    if any(k in m for k in ["scholarship", "financial aid", "merit", "fee concession"]):
        return (
            "🎓 Scholarship Details:\n\n"
            "• Merit Scholarships: Minimum 3.50 CGPA required (up to 100% tuition concession).\n"
            "• Need-Based Scholarships: Minimum 2.50 CGPA required.\n"
            "• Application Deadline: October 15.\n\n"
            "Submit your academic transcript, CNIC copy, and income certificate to the Student Affairs office."
        )

    if any(k in m for k in ["profile", "account", "password", "settings"]):
        return (
            "Students can update their profile by logging into their dashboard, navigating to the Profile or Settings section, "
            "updating their personal/academic details, and clicking 'Save Changes'."
        )

    if any(k in m for k in ["office", "timing", "timings", "hours", "administration", "admin block"]):
        return (
            "University offices are open Monday to Friday, from 9:00 AM to 4:00 PM. "
            "Closed on weekends and gazetted holidays. "
            "The Administration block is located near the main campus entrance."
        )

    return OUT_OF_SCOPE_REPLY_EN
