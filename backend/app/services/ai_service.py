"""CampusConnect AI Service.

Integrates with Google Gemini AI via google-genai (or google.generativeai fallback)
to provide intelligent, friendly, bilingual (English & Roman Urdu) chat capabilities
with strict language enforcement, robust self-identity handling, and university
out-of-context safeguards.
"""

import os
import re
import logging
from typing import List, Optional, Dict, Any

from app.config import settings

logger = logging.getLogger(__name__)

# ============================================================
# STANDARD REPLIES (BILINGUAL)
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
    "Feel free to ask questions in English or Roman Urdu! How can I help you today?"
)

IDENTITY_REPLY_UR = (
    "Assalam-o-Alaikum! 👋 Main CampusConnect Assistant hoon, CampusConnect — "
    "Smart University Management Platform ka official AI guide.\n\n"
    "Main university ke talaba (students), asatiza (teachers), aur staff ki madad ke liye hazir hoon. "
    "Main in ahem shobon (modules) mein aap ki poori madad kar sakta hoon:\n\n"
    "📢 Smart Notice Board: University ke ahem elaanat, imtehanat (exam) ka schedule aur AI summaries dekhna.\n\n"
    "📝 Complaints & Grievance Redressal: Wi-Fi, bijli, lab ya deegar masail ki shikayat darj karna aur status track karna.\n\n"
    "🔍 Lost & Found: Gumshuda ashiya report karna, mili hui cheezein dekhna aur claim darj karna.\n\n"
    "🎓 Scholarships & Financial Aid: Merit aur need-based wazaif (scholarships), CGPA ki sharten aur deadlines.\n\n"
    "🏛️ University Guidelines: Office ke auqat (timings), administration aur university ke qawaneen.\n\n"
    "Aap mujh se English ya Roman Urdu mein university ke baray mein kuch bhi pooch saktay hain. "
    "Aaj main aap ki kya madad karoon?"
)

GREETING_REPLY_EN = (
    "Hello! 👋 Welcome to CampusConnect. How can I assist you today with notices, "
    "complaints, lost & found items, scholarships, or campus policies?"
)

GREETING_REPLY_UR = (
    "Assalam-o-Alaikum! 👋 CampusConnect mein khush amdeed. Aaj main notices, shikayaat, "
    "Lost & Found, wazaif (scholarships), ya university guidelines ke baray mein aap ki kya madad karoon?"
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

OUT_OF_SCOPE_REPLY_UR = (
    "Mujhe is ke baray mein maloomat nahi hai. Main sirf CampusConnect aur university ke in mauzoat (topics) par jawab de sakta hoon:\n\n"
    "📢 Smart Notice Board: University ke elaanat (announcements), imtehanat ka schedule, dates aur events.\n\n"
    "📝 Complaints & Grievance Redressal: Shikayat darj karna, status track karna, Wi-Fi, bijli ya lab ke masail.\n\n"
    "🔍 Lost & Found: Gumshuda ashiya report karna, claim karna aur ownership ka saboot.\n\n"
    "🎓 Scholarships & Financial Aid: Wazaif ka criteria, CGPA ki sharten aur aakhri tareekhein (deadlines).\n\n"
    "🏛️ University Information: Policies, office ke auqat (timings), administration aur rabta ki tafseelat.\n\n"
    "Barah-e-karam inhi topics se mutaliq sawal poochein, ya mazeed maloomat ke liye university office se rabta karein."
)

# Out-of-domain keywords that strictly do not belong to university operations
OUT_OF_DOMAIN_KEYWORDS = [
    "news", "khabar", "khabrain", "politics", "siasat", "election",
    "weather", "forecast", "rain today", "sunny today", "temperature outside",
    "mausam", "barish", "cricket", "match score", "ipl", "psl", "world cup",
    "football", "cinema", "movie", "film", "drama", "song", "actress", "actor",
    "stock market", "crypto", "bitcoin", "trading", "horoscope", "astrology",
    "recipe", "cooking", "restaurant", "biryani", "joke", "shayari", "poetry",
]

# University domain terms that whitelist queries
UNIVERSITY_WHITELIST = [
    "campus", "university", "notice", "notices", "exam", "exams", "paper",
    "complaint", "complaints", "shikayat", "shikayaat", "lost", "found", "gum",
    "claim", "scholarship", "scholarships", "wazifa", "wazaif", "gala", "sports gala",
    "portal", "admin", "department", "semester", "cgpa", "fee", "fees", "id card",
    "card", "library", "lab", "wifi", "wi-fi", "attendance", "hostel", "teacher",
    "student", "course", "grade", "grading", "result", "timetable", "schedule",
    "profile", "account", "settings", "password", "timing", "timings", "hours",
    "office", "administration", "entrance", "contact", "contacts", "details", "update", "auqat",
    "policy", "policies", "rule", "rules", "regulation", "regulations", "qanoon", "qawaneen",
    "phone", "number", "helpline", "email", "rabta", "emergency", "clinic", "hotline",
]

# ============================================================
# LANGUAGE & QUERY CLASSIFIERS
# ============================================================

def detect_language(text: str) -> str:
    """Detect whether query is 'roman_urdu', 'urdu', or 'english'.
    
    Returns 'roman_urdu' for both Roman Urdu and Urdu script to guarantee responses
    are generated in natural Roman Urdu as required. Returns 'english' otherwise.
    """
    if not text:
        return "english"

    # Check for Urdu / Arabic script
    if re.search(r"[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]", text):
        return "roman_urdu"

    t = text.lower()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    words = set(cleaned.split())

    # Check for obvious English phrase constructs without strong Roman Urdu markers
    english_phrases = [
        "what is", "what are", "when is", "when are", "where is", "where are",
        "how do", "how can", "how to", "tell me", "can you", "who is", "which is",
        "how does", "is there", "are there"
    ]
    has_english_phrase = any(p in cleaned for p in english_phrases)

    # Strong unambiguous Roman Urdu tokens that indicate the user intended Roman Urdu even if English words exist
    strong_urdu_tokens = {
        "kya", "kia", "kaise", "kese", "kaisa", "kesa", "kaisay", "kesay",
        "kyun", "kyu", "kahan", "kidhar", "kab", "kon", "kaun", "kitna", "kitne",
        "apne", "aapne", "apna", "aapna", "apni", "aap", "tum", "mera", "meri", "mere", "tera", "teri",
        "uska", "uski", "unka", "unki", "hain", "hoon", "hun", "hoga", "honge",
        "karein", "karen", "batao", "bataiye", "batayein", "btao", "btain", "bata",
        "chahiye", "chahye", "sakte", "saktay", "sakta", "shikayat", "shikayaat", "wazifa", "wazaif",
        "darj", "madad", "masla", "maslay", "gum", "gumshuda", "cheez", "cheezein",
        "salam", "salaam", "aoa"
    }

    if has_english_phrase and not words.intersection(strong_urdu_tokens):
        return "english"

    # Roman Urdu common words & tokens (strictly excluded English collision words: "the", "do", "me", "or", "to", "mat", "so", "no", "is", "in", "it", "at")
    roman_urdu_words = {
        # Pronouns & demonstratives
        "apne", "aapne", "apna", "aapna", "apni", "aap", "ap", "tum", "tumhara", "tumhari", "tumhare",
        "mai", "main", "hum", "ham", "woh", "wo", "yeh", "ye", "mera", "meri", "mere",
        "tera", "teri", "tere", "uska", "uski", "uske", "unka", "unki", "unke",
        "inhe", "unhe", "kisi", "sab", "kuch",
        # Question words
        "kya", "kia", "kaise", "kese", "kaisa", "kesa", "kaisay", "kesay", "kyun",
        "kyu", "kahan", "kaha", "kidhar", "kab", "kon", "kaun", "kitna", "kitne",
        "kitni", "konsa", "kounsa", "konsi",
        # Prepositions / conjunctions / particles
        "mein", "ma", "se", "say", "par", "pe", "ko", "ka", "ki", "ke", "kay",
        "baray", "bara", "baare", "bare", "bary", "liye", "lia", "leeye", "tak", "saath",
        "aur", "ya", "lekin", "magar", "bhi", "toh", "nahi", "nahin", "na",
        "wala", "wali", "wale",
        # Verbs & modals
        "ha", "hai", "hain", "ho", "hoon", "hun", "tha", "thi", "hoga",
        "hogi", "honge", "hona", "hone", "karo", "karein", "karen", "karna",
        "karta", "karti", "karte", "karun", "karu", "kara", "kare", "karega",
        "batao", "bataiye", "batayein", "batana", "bata", "btao", "btain", "dekhna", "dekho", "dekhein",
        "raha", "rahi", "rahe", "chahiye", "chahye", "sakte", "sakti", "sakta",
        "saktay", "sakun", "saku", "mila", "mili", "mile", "mil", "gaya", "gayi",
        "gaye", "jana", "jaye", "jayen", "aaya", "aayi", "aaye", "aana", "aao",
        "dena", "dein", "rakhna", "rakho", "lena", "lo", "lein",
        # Domain terms & vocabulary
        "shikayat", "shikayaat", "wazifa", "wazaif", "darj", "madad", "masla",
        "maslay", "masail", "shukriya", "shukria", "meherbani", "maloomat",
        "itlaa", "sawaal", "sawal", "jawab", "daakhla", "dakhla", "chutti",
        "chuttiyan", "imtehan", "parcha", "gum", "gumshuda", "ashiya", "cheez",
        "cheezein", "kamra", "shoba", "theek", "thik", "accha", "acha",
        "salam", "salaam", "aoa", "adaab", "khushamdeed",
    }

    if words.intersection(roman_urdu_words):
        return "roman_urdu"

    # Multi-word phrase checks
    roman_urdu_phrases = [
        "kia ha", "kya ha", "kia hai", "kya hai", "kesa darj", "kaise darj",
        "bara ma", "baray mein", "bare me", "baare me", "apne bara", "apne baray",
        "apne bare", "apne baare", "aapna bara", "apna bara", "aapna baray", "aapne bara",
        "tum kon", "aap kon", "kya hal", "kia haal", "kaise ho", "kese ho", "kya kar", "kia kar",
        "kar saktay", "kar sakte", "madad kar", "darj karein", "darj karo", "darj kara",
        "gum ho", "mil sakta", "mil sakti", "lost aur found", "woh the", "wo the", "log the",
    ]
    if any(p in cleaned for p in roman_urdu_phrases):
        return "roman_urdu"

    return "english"


def is_roman_urdu(text: str) -> bool:
    """Convenience helper checking if text is Roman Urdu or Urdu."""
    return detect_language(text) == "roman_urdu"


def is_identity_query(text: str) -> bool:
    """Check if query is asking for the bot's self-identity or introduction."""
    if not text:
        return False
    t = text.lower().strip()
    cleaned = re.sub(r"[^\w\s]", " ", t)

    # 1. Regex pattern matching for Roman Urdu self-identity variations:
    # Matches: (apne|aapne|apna|aapna|ap|aap) followed anywhere by (bara|baray|bare|baare|bary|taaruf|taruf|intro)
    if re.search(r"\b(apne|aapne|apna|aapna|ap|aap)\b.*\b(bara|baray|bare|baare|bary|taaruf|taruf|intro|introduction)\b", cleaned):
        return True

    # Matches: (bara|baray|bare|baare|bary) followed by (ma|me|mein|mai) and (batao|bata|batayein|btao|bataiye)
    if re.search(r"\b(bara|baray|bare|baare|bary)\b.*\b(ma|me|mein|mai)\b.*\b(batao|bata|batayein|btao|bataiye|btain)\b", cleaned):
        return True

    # Matches: (tum|aap|ap|tu)\s+(kon|kaun|kya|kia)\s+(ho|hain|hn)
    if re.search(r"\b(tum|aap|ap|tu)\b\s*\b(kon|kaun|kya|kia)\b\s*\b(ho|hain|hn)\b", cleaned):
        return True

    # Matches: (kon|kaun)\s+ho\s+(tum|aap|ap)
    if re.search(r"\b(kon|kaun)\b\s*ho\s*\b(tum|aap|ap)\b", cleaned):
        return True

    # Matches: (tumhara|aap ka|ap ka)\s+(naam|name)
    if re.search(r"\b(tumhara|aap ka|ap ka)\b.*\b(naam|name)\b", cleaned):
        return True

    # Matches: (kya|kia)\s+madad\s+(kar|kr)
    if re.search(r"\b(kya|kia)\s+madad\s+(kar|kr)", cleaned):
        return True

    # 2. English identity regex patterns
    if re.search(r"\b(who are you|what are you|tell me about yourself|tell me about you|introduce yourself|what can you do|what do you do|who created you|who made you|what is your name|your name|give me your introduction)\b", cleaned):
        return True

    # 3. Direct phrase list
    identity_phrases = [
        "who are you", "what are you", "tell me about yourself", "tell me about you",
        "about yourself", "introduce yourself", "introduction", "what can you do",
        "what do you do", "who created you", "what is your name", "your name",
        "apne baray mein", "apne bara ma", "apne bare me", "apne baare me", "apne baray me",
        "apne bare mai", "aapna bara ma", "aapna baray mein", "aapna bare me", "aapne bara ma",
        "apna bara ma", "apna baray mein", "apna bare me", "apna taaruf", "aapna taaruf",
        "taaruf karao", "taaruf karwayen", "taaruf karayein", "taruf karao", "taruf karwayen",
        "tum kon ho", "aap kon hain", "ap kon ho", "kaun ho tum", "kon ho tum",
        "aap kaun hain", "tum kaun ho", "ap kya ho", "aap kya ho", "kya kar sakte ho",
        "kia kar saktay ho", "kia kar sakti ho", "kya madad kar sakte ho", "meri kya madad",
        "meri kia madad", "tumhara naam", "aap ka naam", "apna intro", "aapna intro",
    ]
    if any(p in cleaned for p in identity_phrases):
        return True

    # 4. Urdu script phrases
    if any(p in t for p in ["آپ کون ہیں", "اپنے بارے میں", "تعارف", "تم کون ہو", "اپنا تعارف"]):
        return True

    return False


def is_greeting_query(text: str) -> bool:
    """Check if query is a simple greeting."""
    if not text:
        return False
    t = text.lower().strip()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    tokens = cleaned.split()
    if len(tokens) <= 4:
        greeting_words = {"hi", "hello", "hey", "salam", "salaam", "aoa", "assalam", "assalamu", "adaab"}
        if set(tokens).intersection(greeting_words):
            return True
        greeting_phrases = ["kya hal", "kia haal", "kaise ho", "kese ho", "good morning", "good afternoon", "good evening"]
        if any(p in cleaned for p in greeting_phrases):
            return True
    return False


def is_out_of_domain(text: str) -> bool:
    """Strictly checks if query is completely unrelated to university operations."""
    if not text:
        return False

    # Identity and greetings are NEVER out of domain
    if is_identity_query(text) or is_greeting_query(text):
        return False

    t = text.lower()
    cleaned = re.sub(r"[^\w\s]", " ", t)
    words = set(cleaned.split())

    # Whitelisted university operations queries are NEVER out of domain
    if words.intersection(UNIVERSITY_WHITELIST):
        return False
    if any(term in cleaned for term in ["sports gala", "campusconnect", "wi fi", "lost and found", "lost & found"]):
        return False

    # Check against strictly out-of-domain terms
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
        "profile update", "account settings", "how do i update my profile", "timing kya hai",
        "contact number", "phone number", "helpline number", "emergency number", "rabta number",
        "contact info", "attendance policy", "campus policy", "university policy",
        "rules and regulations", "discipline policy", "code of conduct", "qanoon", "qawaneen",
    ])


def get_out_of_scope_message(message: str) -> str:
    """Returns bilingual out-of-scope response strictly matching user's language."""
    if detect_language(message) == "roman_urdu":
        return OUT_OF_SCOPE_REPLY_UR
    return OUT_OF_SCOPE_REPLY_EN


# ============================================================
# SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = f"""You are CampusConnect Assistant, the official AI guide for CampusConnect — Smart University Management Platform.
Your mission is to assist university students, teachers, and staff with kindness, accuracy, and professionalism.

Capabilities & Personality:
1. Tone: Warm, welcoming, respectful, and helpful.
2. Core University Topics (ALL ARE VALID IN-DOMAIN UNIVERSITY TOPICS):
   - Smart Notice Board: Announcements, exam schedules, dates, and AI notice summaries.
   - Complaints & Grievance Redressal: Submitting issues (Wi-Fi, electricity, lab, maintenance), tracking status, and follow-ups.
   - Lost & Found: Reporting lost belongings, finding misplaced items, and claim verification.
   - Scholarships & Financial Aid: Merit-based & need-based scholarships, CGPA requirements, and deadlines.
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
     * Library Policy: Maximum 3 books for 14 days; late fee Rs. 20/day.
     * Grading Policy: Minimum passing grade is D (50%). Minimum cumulative CGPA of 2.00 is required for graduation.
   - Profile & Account Management: Students can update their profile by logging into their dashboard, navigating to the Profile or Settings section, updating personal/academic details, and clicking "Save Changes".

Knowledge & Scope Rules:
- Queries regarding campus policies, rules, regulations, contact numbers, phone numbers, helplines, profile settings, account updates, and office hours are VALID university/platform topics and MUST NEVER be classified as out-of-context. Answer them helpfully with clear instructions.
- When context from the university knowledge base is provided, base your answer strictly on that context.
- If the user asks anything strictly OUT OF CONTEXT (such as general news, weather, movies, celebrities, cricket match scores, politics, or general topics unrelated to university operations), you MUST respond with the exact message below:
  For English questions:
  "{OUT_OF_SCOPE_REPLY_EN}"
  For Roman Urdu questions:
  "{OUT_OF_SCOPE_REPLY_UR}"
- Keep your answers structured, easy to read, with numbered steps or bullet points when explaining procedures.
"""


def _get_api_key() -> str:
    key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
    return key.strip()


def _get_client():
    api_key = _get_api_key()
    if not api_key:
        logger.warning("GEMINI_API_KEY is not set.")
        return None

    # Try newer google-genai SDK first
    try:
        from google import genai  # type: ignore
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.debug(f"google.genai SDK check: {e}")

    # Fallback to legacy google.generativeai if available
    try:
        import google.generativeai as legacy_genai  # type: ignore
        legacy_genai.configure(api_key=api_key)
        return legacy_genai
    except Exception as e:
        logger.debug(f"google.generativeai SDK check: {e}")

    return None


def generate_chat_response(
    prompt: str,
    context: str = "",
    history: Optional[List[Dict[str, Any]]] = None,
    system_instruction: str = SYSTEM_PROMPT,
) -> str:
    """Generate a chat response with dynamic language enforcement and strict out-of-context checks."""
    user_query = (prompt or "").strip()
    if not user_query:
        return "Please enter a question or message."

    user_lang = detect_language(user_query)

    # 1. Identity / Introduction Queries ("Who are you?", "Apne baray mein batao", "Tum kon ho?")
    if is_identity_query(user_query):
        return IDENTITY_REPLY_UR if user_lang == "roman_urdu" else IDENTITY_REPLY_EN

    # 2. Standalone Greeting Queries ("Salam", "Hi", "AOA")
    if is_greeting_query(user_query) and not context:
        return GREETING_REPLY_UR if user_lang == "roman_urdu" else GREETING_REPLY_EN

    # 3. Strict Out-of-Domain Check:
    # If the query is strictly unrelated to university operations, enforce exact out-of-context fallback
    if is_out_of_domain(user_query):
        return OUT_OF_SCOPE_REPLY_UR if user_lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN

    # 4. If retrieved RAG context is empty and the query is NOT a university topic,
    # enforce the exact fallback response matching the user's language
    if not context.strip() and not is_university_query(user_query):
        return OUT_OF_SCOPE_REPLY_UR if user_lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN

    # 5. Dynamic System Instruction Injection based on detected language
    if user_lang == "roman_urdu":
        dynamic_rule = (
            "CRITICAL: The user has asked in Roman Urdu. You MUST reply completely in fluent Roman Urdu. "
            "Do not reply in English under any circumstances, even if background context documents are in English. "
            "Translate and explain all facts entirely in natural Roman Urdu."
        )
    else:
        dynamic_rule = "CRITICAL: The user has asked in English. Reply in English."

    effective_system_instruction = f"{dynamic_rule}\n\n{system_instruction}"

    api_key = _get_api_key()
    if not api_key:
        return _fallback_offline_response(user_query, context)

    # Build prompt with dynamic language enforcement banner
    full_prompt = f"[{dynamic_rule}]\n\n"
    if context:
        full_prompt += f"--- UNIVERSITY KNOWLEDGE BASE CONTEXT ---\n{context}\n------------------------------------------\n\n"
    if history:
        history_str = "\n".join([f"{h.get('role', 'user')}: {h.get('content', '')}" for h in history[-4:]])
        full_prompt += f"Recent Conversation:\n{history_str}\n\n"
    full_prompt += f"User: {user_query}\nAssistant:"

    # 1. Try google-genai SDK
    try:
        from google import genai  # type: ignore
        from google.genai import types  # type: ignore

        client = genai.Client(api_key=api_key)
        model_name = getattr(settings, "ai_model", "gemini-2.0-flash")

        config = types.GenerateContentConfig(
            system_instruction=effective_system_instruction,
            temperature=0.3,
            max_output_tokens=1000,
        )

        response = client.models.generate_content(
            model=model_name,
            contents=full_prompt,
            config=config,
        )
        if response and response.text:
            reply = response.text.strip()
            # Double check if model returned out-of-scope phrasing
            if "don't have information" in reply.lower() or "maloomat nahi" in reply.lower():
                return OUT_OF_SCOPE_REPLY_UR if user_lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN
            return reply
    except Exception as exc:
        logger.warning(f"google.genai call attempt failed ({exc}). Trying alternative...")

    # 2. Try google.generativeai SDK
    try:
        import google.generativeai as legacy_genai  # type: ignore

        legacy_genai.configure(api_key=api_key)
        model = legacy_genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=effective_system_instruction,
        )
        response = model.generate_content(full_prompt)
        if response and response.text:
            reply = response.text.strip()
            if "don't have information" in reply.lower() or "maloomat nahi" in reply.lower():
                return OUT_OF_SCOPE_REPLY_UR if user_lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN
            return reply
    except Exception as exc:
        logger.error(f"Generative AI call failed: {exc}")

    # Fallback to local heuristic answer
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
            prompt = f"Summarize this university notice into 1 or 2 concise, clear sentences:\n\n{text}"
            response = client.models.generate_content(
                model=getattr(settings, "ai_model", "gemini-2.0-flash"),
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception:
            pass

    # Clean text fallback
    words = text.split()
    summary = " ".join(words[:40])
    if len(words) > 40:
        summary += "..."
    return summary


def _fallback_offline_response(message: str, context: str = "") -> str:
    """Intelligent fallback when API is unreachable or key is pending."""
    user_query = (message or "").strip()
    lang = detect_language(user_query)
    m = user_query.lower()

    # 1. Identity & Introduction
    if is_identity_query(user_query):
        return IDENTITY_REPLY_UR if lang == "roman_urdu" else IDENTITY_REPLY_EN

    # 2. Greetings
    if is_greeting_query(user_query):
        return GREETING_REPLY_UR if lang == "roman_urdu" else GREETING_REPLY_EN

    # 3. Out-of-scope check
    if is_out_of_domain(user_query) or (not context and not is_university_query(user_query)):
        return OUT_OF_SCOPE_REPLY_UR if lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN

    # 4. If context has direct answers and query is in-domain
    if context and len(context) > 20 and is_university_query(user_query):
        first_section = context.split("\n\n")[0]
        if lang == "roman_urdu":
            return f"{first_section}\n\n(Maloomat CampusConnect ke verified knowledge base se li gayi hai)."
        return f"{first_section}\n\n(Note: Generated from verified CampusConnect knowledge base)."

    # 5. Domain specific fallback responses in matched language
    if "shukriya" in m or "shukria" in m or "meherbani" in m:
        return "Aap ka khair muqadam! Agar aap ko mazeed koi madad chahiye ho toh zaroor bataiye ga. 😊"
    if "thank" in m or "thanks" in m:
        return "You're welcome! Feel free to ask if you need any more help with CampusConnect. 😊"

    if any(k in m for k in ["shikayat", "complaint", "darj", "problem"]):
        if lang == "roman_urdu":
            return (
                "Shikayat darj karnay ke liye Student Dashboard par ja kar 'Complaints' section open karein.\n\n"
                "1. 'New Complaint' par click karein.\n"
                "2. Category muntakhib karein (Wi-Fi, Electricity, Lab, etc.).\n"
                "3. Maslay ki tafseelat aur tasveer (optional) attach karein aur submit kar dein.\n\n"
                "Aap ko real-time status updates milti rahengi."
            )
        return (
            "To submit a complaint, navigate to the Complaints section in your student dashboard:\n\n"
            "1. Click 'New Complaint'.\n"
            "2. Select the issue category (Wi-Fi, Electricity, Lab, etc.).\n"
            "3. Enter the description and attach a photo (optional), then submit.\n\n"
            "You will receive real-time status updates."
        )

    if any(k in m for k in ["lost", "found", "gum", "claim"]):
        if lang == "roman_urdu":
            return (
                "Lost & Found ke liye sidebar mein 'Lost & Found' section par jayen:\n\n"
                "1. Agar koi cheez gum hui ya mili ho toh 'Report Item' par click karein.\n"
                "2. Agar mili hui cheez aap ki hai toh 'Claim This Item' par click karke saboot faraham karein."
            )
        return (
            "For Lost & Found services, open the Lost & Found section in the sidebar:\n\n"
            "1. Click 'Report Item' to report a lost or found object.\n"
            "2. Select a found item and click 'Claim This Item' with proof of ownership to claim it."
        )

    if any(k in m for k in ["exam", "notice", "schedule", "paper", "dates", "announcement"]):
        if lang == "roman_urdu":
            return (
                "Aap university ke tamam taza tareen notices, imtehanat ka schedule aur AI summaries Notice Board section mein dekh saktay hain.\n\n"
                "Imtehan ke liye student ID card aur fee clearance lazmi hai."
            )
        return (
            "You can view all current official notices, examination schedules, and AI summaries in the Notice Board section.\n\n"
            "Remember to bring your original student ID card and fee clearance slip for exams."
        )

    if any(k in m for k in ["profile", "account", "password", "settings"]):
        if lang == "roman_urdu":
            return (
                "Profile update karnay ke liye Student Dashboard par login karein, 'Profile' ya 'Settings' section par jayen, "
                "apni zaati ya taleemi tafseelat update karein, aur 'Save Changes' par click karein."
            )
        return (
            "Students can update their profile by logging into their dashboard, navigating to the Profile or Settings section, "
            "updating their personal/academic details, and clicking 'Save Changes'."
        )

    if any(k in m for k in ["office", "timing", "timings", "hours", "auqat", "administration", "admin block"]):
        if lang == "roman_urdu":
            return (
                "University offices Peer se Jummay (Monday to Friday) subah 9:00 AM se shaam 4:00 PM tak khulay hotay hain. "
                "Haftay, Itwar aur sarkari chuttiyon par band hotay hain. "
                "Administration block main campus ke dakhli raste (main entrance) ke qareeb waqay hai."
            )
        return (
            "University offices are open Monday to Friday, from 9:00 AM to 4:00 PM. "
            "Closed on weekends and gazetted holidays. "
            "The Administration block is located near the main campus entrance."
        )

    # Final fallback strictly matching user language
    return OUT_OF_SCOPE_REPLY_UR if lang == "roman_urdu" else OUT_OF_SCOPE_REPLY_EN
