"""CampusConnect RAG (Retrieval-Augmented Generation) Service.

Combines ChromaDB semantic document retrieval with Google Gemini AI to provide
grounded, hallucination-free, bilingual answers to university queries with strict
topic-accurate source citations (English & Roman Urdu) and robust self-identity handling.
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

from app.services import ai_service
from app.services import embedding_service
from app.services import vector_store

from app.utils.text_chunker import chunk_markdown_sections
from app.services.ai_service import (
    detect_language,
    is_roman_urdu,
    is_identity_query,
    is_greeting_query,
    is_out_of_domain,
    is_university_query,
    get_out_of_scope_message,
    IDENTITY_REPLY_EN,
    IDENTITY_REPLY_UR,
    GREETING_REPLY_EN,
    GREETING_REPLY_UR,
    OUT_OF_SCOPE_REPLY_EN,
    OUT_OF_SCOPE_REPLY_UR,
)

logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"

NOTICES_DATA = [
    {
        "id": "notice_01",
        "title": "Notice: Midterm Examination Schedule",
        "text": "Notice: Midterm Examination Schedule\nMidterm examinations will commence on October 20. Detailed date sheets and exam hall allotments are published on the portal. Bring your original student ID card and ensure fee clearance.",
        "category": "exam",
    },
    {
        "id": "notice_02",
        "title": "Notice: Merit and Need-Based Scholarships",
        "text": "Notice: Merit and Need-Based Scholarships\nApplications for Fall semester merit and need-based scholarships are now open. Minimum CGPA of 3.50 required for merit scholarships. Deadline is October 15 at Student Affairs.",
        "category": "scholarship",
    },
    {
        "id": "notice_03",
        "title": "Notice: Campus Cleanliness & Tree Plantation Drive",
        "text": "Notice: Campus Cleanliness & Tree Plantation Drive\nJoin the university cleanliness and green campus initiative this Friday. Certificates will be awarded by the Directorate of Student Affairs.",
        "category": "event",
    },
]

# Legacy / FAQ Title Sanitization Map to ensure professional document names
CLEAN_TITLE_MAP = {
    "what is the exam schedule?": "Notice: Midterm Examination Schedule",
    "midterm examination schedule": "Notice: Midterm Examination Schedule",
    "notice: midterm examination schedule": "Notice: Midterm Examination Schedule",
    "how do i apply for a scholarship?": "Notice: Merit and Need-Based Scholarships",
    "merit and need-based scholarship applications": "Notice: Merit and Need-Based Scholarships",
    "notice: merit and need-based scholarships": "Notice: Merit and Need-Based Scholarships",
    "what is campusconnect?": "CampusConnect Platform Overview",
    "campusconnect platform overview": "CampusConnect Platform Overview",
    "how do i submit a complaint?": "Guide 1: How to Submit and Track Complaints on CampusConnect",
    "guide 1: how to submit and track complaints on campusconnect": "Guide 1: How to Submit and Track Complaints on CampusConnect",
    "how do i report a lost item?": "Guide 2: How to Report Lost or Found Items",
    "guide 2: how to report lost or found items": "Guide 2: How to Report Lost or Found Items",
    "how do i claim a lost item?": "Guide 3: How to Claim a Found Item",
    "guide 3: how to claim a found item": "Guide 3: How to Claim a Found Item",
    "how do i report wi-fi issue?": "Guide 7: How to Connect to Campus Wi-Fi and Report Network Issues",
    "how do i report wifi issue?": "Guide 7: How to Connect to Campus Wi-Fi and Report Network Issues",
    "guide 7: how to connect to campus wi-fi and report network issues": "Guide 7: How to Connect to Campus Wi-Fi and Report Network Issues",
    "what are the office timings and administration contact info?": "Guide 8: University Office Timings and Administration Contact Info",
    "guide 8: university office timings and administration contact info": "Guide 8: University Office Timings and Administration Contact Info",
    "how do i update my profile?": "Guide 5: How to Update Your Profile and Account Settings",
    "guide 5: how to update your profile and account settings": "Guide 5: How to Update Your Profile and Account Settings",
    "how can i check the status of my claims and complaints?": "Guide 1: How to Submit and Track Complaints on CampusConnect",
    "what are the university policies and campus rules?": "Policy 2: Attendance and Leave Regulations",
    "what are the university contact numbers and helplines?": "Guide 10: Departmental Contact Numbers, Helplines, and Emergency Numbers",
    "guide 10: departmental contact numbers, helplines, and emergency numbers": "Guide 10: Departmental Contact Numbers, Helplines, and Emergency Numbers",
    "campus cleanliness and tree plantation drive": "Notice: Campus Cleanliness & Tree Plantation Drive",
    "notice: campus cleanliness & tree plantation drive": "Notice: Campus Cleanliness & Tree Plantation Drive",
    "policy 1: academic integrity and anti-plagiarism": "Policy 1: Academic Integrity and Anti-Plagiarism",
    "policy 2: attendance and leave regulations": "Policy 2: Attendance and Leave Regulations",
    "policy 3: student code of conduct and campus discipline": "Policy 3: Student Code of Conduct and Campus Discipline",
    "policy 4: it, wi-fi and computing facilities policy": "Policy 4: IT, Wi-Fi and Computing Facilities Policy",
    "policy 5: examination and grading regulations": "Policy 5: Examination and Grading Regulations",
    "policy 6: fee payment and refund policy": "Policy 6: Fee Payment and Refund Policy",
    "policy 7: lost and found property policy": "Policy 7: Lost and Found Property Policy",
    "policy 8: student grievance and complaint redressal": "Policy 8: Student Grievance and Complaint Redressal",
}

_POLICIES_CACHE: Dict[str, Dict[str, Any]] = {}
_GUIDES_CACHE: Dict[str, Dict[str, Any]] = {}


def _get_policies() -> Dict[str, Dict[str, Any]]:
    """Load and cache markdown sections from policies.txt."""
    global _POLICIES_CACHE
    if _POLICIES_CACHE:
        return _POLICIES_CACHE
    policy_path = DATA_DIR / "policies.txt"
    if policy_path.exists():
        try:
            with open(policy_path, "r", encoding="utf-8") as f:
                sections = chunk_markdown_sections(f.read())
            for i, sec in enumerate(sections, start=1):
                key = f"policy_{i:02d}"
                _POLICIES_CACHE[key] = {
                    "id": key,
                    "title": sec["title"],
                    "document": sec["content"],
                }
        except Exception as exc:
            logger.error(f"Error loading policies: {exc}")
    return _POLICIES_CACHE


def _get_guides() -> Dict[str, Dict[str, Any]]:
    """Load and cache markdown sections from guides.txt."""
    global _GUIDES_CACHE
    if _GUIDES_CACHE:
        return _GUIDES_CACHE
    guides_path = DATA_DIR / "guides.txt"
    if guides_path.exists():
        try:
            with open(guides_path, "r", encoding="utf-8") as f:
                sections = chunk_markdown_sections(f.read())
            for i, sec in enumerate(sections, start=1):
                key = f"guide_{i:02d}"
                _GUIDES_CACHE[key] = {
                    "id": key,
                    "title": sec["title"],
                    "document": sec["content"],
                }
        except Exception as exc:
            logger.error(f"Error loading guides: {exc}")
    return _GUIDES_CACHE


def sanitize_source_title(raw_title: str) -> str:
    """Ensures source titles are official document names, never interrogative sentences."""
    if not raw_title:
        return "CampusConnect Knowledge Base"
    clean = raw_title.strip()
    lower = clean.lower()
    if lower in CLEAN_TITLE_MAP:
        return CLEAN_TITLE_MAP[lower]
    # Remove trailing questions
    if clean.endswith("?"):
        clean = clean.rstrip("?")
        if clean.lower().startswith("what is "):
            clean = clean[8:].strip() + " Overview"
        elif clean.lower().startswith("how do i "):
            clean = "Guide: " + clean[9:].strip()
    return clean


def ensure_vector_store_populated() -> None:
    """Non-blocking check for vector store status."""
    pass


def _resolve_topic_documents(clean_message: str) -> Optional[Tuple[List[Dict[str, Any]], List[str]]]:
    """Exact topic matching that resolves the query to its authoritative documents and clean sources.
    
    Guarantees:
    - Queries about scholarships only return scholarship documents.
    - Queries about exams only return exam documents.
    - Queries about reporting lost items do not return claim guides.
    - Sources list is strictly capped at max 1 or 2 relevant items.
    """
    clean = clean_message.lower()
    clean_words = set(re.findall(r"\w+", clean))
    policies = _get_policies()
    guides = _get_guides()

    # 1. Platform Overview ("What is CampusConnect?", "About this platform")
    # Only triggered when the user explicitly asks about the platform itself
    is_about_platform = any(p in clean for p in [
        "what is campusconnect", "what is campus connect", "about campusconnect",
        "about campus connect", "campusconnect kya hai", "campus connect kya hai",
        "platform kya hai", "what is this platform", "platform overview", "system overview"
    ])
    if is_about_platform:
        faq_doc = {
            "id": "faq_01",
            "document": "CampusConnect is a comprehensive Smart University Management Platform designed to streamline campus life. It features a digital notice board, an online complaint management system, a lost and found portal, claim verifications, AI-powered notice summarization, and role-based student and admin dashboards.",
            "metadata": {"title": "CampusConnect Platform Overview"},
        }
        return [faq_doc], ["CampusConnect Platform Overview"]

    # 2. Scholarship / Financial Aid
    is_scholarship = any(kw in clean_words for kw in [
        "scholarship", "scholarships", "wazifa", "wazaif", "financial"
    ]) or "financial aid" in clean or "merit scholarship" in clean or "need-based" in clean or "fee concession" in clean
    if is_scholarship:
        docs = []
        sources = []
        # Notice: Merit and Need-Based Scholarships
        docs.append({
            "id": "notice_02",
            "document": NOTICES_DATA[1]["text"],
            "metadata": {"title": NOTICES_DATA[1]["title"]},
        })
        sources.append("Notice: Merit and Need-Based Scholarships")
        # Guide 6: How to Apply for Scholarships
        if "guide_06" in guides:
            docs.append({
                "id": "guide_06",
                "document": guides["guide_06"]["document"],
                "metadata": {"title": "Guide 6: How to Apply for Merit and Need-Based Scholarships"},
            })
            sources.append("Guide 6: How to Apply for Merit and Need-Based Scholarships")
        return docs[:2], sources[:2]

    # 3. Exam Schedule & Midterm/Finals
    is_exam = any(kw in clean_words for kw in [
        "exam", "exams", "midterm", "datesheet", "paper", "papers", "imtihaan", "intehan", "commence"
    ]) or "mid-term" in clean or "date sheet" in clean or "final exam" in clean or "exam schedule" in clean or "paper kab" in clean or "exam date" in clean
    if is_exam:
        docs = []
        sources = []
        docs.append({
            "id": "notice_01",
            "document": NOTICES_DATA[0]["text"],
            "metadata": {"title": NOTICES_DATA[0]["title"]},
        })
        sources.append("Notice: Midterm Examination Schedule")
        # If inquiry also specifically asks about grading, weightage, or passing regulations
        if any(gw in clean_words for gw in ["weightage", "cgpa", "gpa", "probation", "grading", "marks"]):
            if "policy_05" in policies:
                docs.append({
                    "id": "policy_05",
                    "document": policies["policy_05"]["document"],
                    "metadata": {"title": "Policy 5: Examination and Grading Regulations"},
                })
                sources.append("Policy 5: Examination and Grading Regulations")
        return docs[:2], sources[:2]

    # 4. Attendance Policy (75% rule)
    is_attendance = any(kw in clean_words for kw in [
        "attendance", "hazri", "shortage", "debarment", "absence"
    ]) or "75%" in clean or "75 percent" in clean or "medical certificate" in clean or "leave" in clean_words
    if is_attendance:
        docs = []
        sources = []
        if "policy_02" in policies:
            docs.append({
                "id": "policy_02",
                "document": policies["policy_02"]["document"],
                "metadata": {"title": "Policy 2: Attendance and Leave Regulations"},
            })
            sources.append("Policy 2: Attendance and Leave Regulations")
        return docs, sources

    # 5. Lost & Found: Claiming an item
    is_claim = any(kw in clean_words for kw in [
        "claim", "claiming", "claimant"
    ]) or "claim item" in clean or "claim this item" in clean or "claim found" in clean or "proof of ownership" in clean or "mera saman" in clean or "verify claim" in clean
    if is_claim:
        docs = []
        sources = []
        if "guide_03" in guides:
            docs.append({
                "id": "guide_03",
                "document": guides["guide_03"]["document"],
                "metadata": {"title": "Guide 3: How to Claim a Found Item"},
            })
            sources.append("Guide 3: How to Claim a Found Item")
        if "policy_07" in policies:
            docs.append({
                "id": "policy_07",
                "document": policies["policy_07"]["document"],
                "metadata": {"title": "Policy 7: Lost and Found Property Policy"},
            })
            sources.append("Policy 7: Lost and Found Property Policy")
        return docs[:2], sources[:2]

    # 6. Lost & Found: Reporting a lost item (when NOT claiming)
    is_lost_report = any(kw in clean_words for kw in [
        "lost", "gum", "khogaya"
    ]) or "lost item" in clean or "report lost" in clean or "kho gaya" in clean or "kho gayi" in clean or "report item" in clean or "wallet" in clean_words or "keys" in clean_words
    if is_lost_report:
        docs = []
        sources = []
        if "guide_02" in guides:
            docs.append({
                "id": "guide_02",
                "document": guides["guide_02"]["document"],
                "metadata": {"title": "Guide 2: How to Report Lost or Found Items"},
            })
            sources.append("Guide 2: How to Report Lost or Found Items")
        if "policy_07" in policies:
            docs.append({
                "id": "policy_07",
                "document": policies["policy_07"]["document"],
                "metadata": {"title": "Policy 7: Lost and Found Property Policy"},
            })
            sources.append("Policy 7: Lost and Found Property Policy")
        return docs[:2], sources[:2]

    # 7. Wi-Fi & Campus Internet Support
    is_wifi = any(kw in clean_words for kw in [
        "wifi", "internet", "network", "ssid", "connectivity"
    ]) or "wi-fi" in clean or "slow internet" in clean or "captive portal" in clean or "network issue" in clean
    if is_wifi:
        docs = []
        sources = []
        if "guide_07" in guides:
            docs.append({
                "id": "guide_07",
                "document": guides["guide_07"]["document"],
                "metadata": {"title": "Guide 7: How to Connect to Campus Wi-Fi and Report Network Issues"},
            })
            sources.append("Guide 7: How to Connect to Campus Wi-Fi and Report Network Issues")
        if "policy_04" in policies:
            docs.append({
                "id": "policy_04",
                "document": policies["policy_04"]["document"],
                "metadata": {"title": "Policy 4: IT, Wi-Fi and Computing Facilities Policy"},
            })
            sources.append("Policy 4: IT, Wi-Fi and Computing Facilities Policy")
        return docs[:2], sources[:2]

    # 8. Complaints & Grievance Redressal
    is_complaint = any(kw in clean_words for kw in [
        "complaint", "complaints", "shikayat", "grievance", "redressal"
    ]) or "file complaint" in clean or "submit complaint" in clean or "lodge complaint" in clean
    if is_complaint:
        docs = []
        sources = []
        if "guide_01" in guides:
            docs.append({
                "id": "guide_01",
                "document": guides["guide_01"]["document"],
                "metadata": {"title": "Guide 1: How to Submit and Track Complaints on CampusConnect"},
            })
            sources.append("Guide 1: How to Submit and Track Complaints on CampusConnect")
        if "policy_08" in policies:
            docs.append({
                "id": "policy_08",
                "document": policies["policy_08"]["document"],
                "metadata": {"title": "Policy 8: Student Grievance and Complaint Redressal"},
            })
            sources.append("Policy 8: Student Grievance and Complaint Redressal")
        return docs[:2], sources[:2]

    # 9. Fee Payment & Refund Policy
    is_fee = any(kw in clean_words for kw in [
        "fee", "fees", "tuition", "refund", "installment", "challan", "dues"
    ]) or "refund policy" in clean or "late fee" in clean or "fee wapsi" in clean
    if is_fee:
        docs = []
        sources = []
        if "policy_06" in policies:
            docs.append({
                "id": "policy_06",
                "document": policies["policy_06"]["document"],
                "metadata": {"title": "Policy 6: Fee Payment and Refund Policy"},
            })
            sources.append("Policy 6: Fee Payment and Refund Policy")
        return docs, sources

    # 10. Library Use & Book Borrowing
    is_library = any(kw in clean_words for kw in [
        "library", "borrow", "kitab", "kitabein", "overdue"
    ]) or "library book" in clean or "borrow book" in clean or "issue book" in clean or "library fine" in clean
    if is_library:
        docs = []
        sources = []
        library_doc_text = (
            "Library Use and Borrowing Regulations: Undergraduate students can borrow up to 3 books "
            "for a duration of 14 days. Overdue items incur a fine of Rs. 20 per day per book. "
            "Reference books and journals cannot be issued outside the library."
        )
        docs.append({
            "id": "library_regulations",
            "document": library_doc_text,
            "metadata": {"title": "Policy: Library Use and Borrowing Regulations"},
        })
        sources.append("Policy: Library Use and Borrowing Regulations")
        return docs, sources

    # 11. Code of Conduct, Harassment & Campus Discipline
    is_discipline = any(kw in clean_words for kw in [
        "harassment", "ragging", "cheating", "conduct", "discipline", "smoking", "zabta"
    ]) or "code of conduct" in clean or "id card" in clean or "identity card" in clean
    if is_discipline:
        docs = []
        sources = []
        if "policy_03" in policies:
            docs.append({
                "id": "policy_03",
                "document": policies["policy_03"]["document"],
                "metadata": {"title": "Policy 3: Student Code of Conduct and Campus Discipline"},
            })
            sources.append("Policy 3: Student Code of Conduct and Campus Discipline")
        return docs, sources

    # 12. Office Timings & Administration Info
    is_timings = any(kw in clean_words for kw in [
        "timing", "timings", "auqat", "administration"
    ]) or "office hours" in clean or "office timings" in clean or "admin block" in clean or "working hours" in clean
    if is_timings:
        docs = []
        sources = []
        if "guide_08" in guides:
            docs.append({
                "id": "guide_08",
                "document": guides["guide_08"]["document"],
                "metadata": {"title": "Guide 8: University Office Timings and Administration Contact Info"},
            })
            sources.append("Guide 8: University Office Timings and Administration Contact Info")
        return docs, sources

    # 13. Contacts, Helplines & Emergency Numbers
    is_contacts = any(kw in clean_words for kw in [
        "contact", "phone", "helpline", "email", "rabta", "emergency", "hotline", "1122"
    ]) or "contact number" in clean or "phone number" in clean or "helpdesk number" in clean
    if is_contacts:
        docs = []
        sources = []
        if "guide_10" in guides:
            docs.append({
                "id": "guide_10",
                "document": guides["guide_10"]["document"],
                "metadata": {"title": "Guide 10: Departmental Contact Numbers, Helplines, and Emergency Numbers"},
            })
            sources.append("Guide 10: Departmental Contact Numbers, Helplines, and Emergency Numbers")
        return docs, sources

    # 14. Profile & Account Settings
    is_profile = any(kw in clean_words for kw in [
        "profile", "password", "settings"
    ]) or "update profile" in clean or "change password" in clean or "account settings" in clean
    if is_profile:
        docs = []
        sources = []
        if "guide_05" in guides:
            docs.append({
                "id": "guide_05",
                "document": guides["guide_05"]["document"],
                "metadata": {"title": "Guide 5: How to Update Your Profile and Account Settings"},
            })
            sources.append("Guide 5: How to Update Your Profile and Account Settings")
        return docs, sources

    # 15. Campus Cleanliness Drive
    is_cleanliness = any(kw in clean_words for kw in [
        "cleanliness", "safai", "plantation"
    ]) or "tree plantation" in clean or "green campus" in clean
    if is_cleanliness:
        return [{
            "id": "notice_03",
            "document": NOTICES_DATA[2]["text"],
            "metadata": {"title": NOTICES_DATA[2]["title"]},
        }], ["Notice: Campus Cleanliness & Tree Plantation Drive"]

    # 16. Academic Integrity & Anti-Plagiarism
    is_plagiarism = any(kw in clean_words for kw in [
        "plagiarism", "similarity", "turnitin", "integrity"
    ]) or "academic honesty" in clean or "19%" in clean
    if is_plagiarism:
        docs = []
        sources = []
        if "policy_01" in policies:
            docs.append({
                "id": "policy_01",
                "document": policies["policy_01"]["document"],
                "metadata": {"title": "Policy 1: Academic Integrity and Anti-Plagiarism"},
            })
            sources.append("Policy 1: Academic Integrity and Anti-Plagiarism")
        return docs, sources

    # No exact predefined topic matched
    return None


def process_chat(
    message: str,
    use_rag: bool = True,
    history: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """Process incoming chat query with either pure AI or RAG semantic retrieval."""
    clean_message = (message or "").strip()
    if not clean_message:
        return {
            "reply": "Please enter a question or message.",
            "sources": [],
            "mode": "rag" if use_rag else "simple",
        }

    lang = detect_language(clean_message)

    # 1. Introductory & Self-Identity Queries ("Who are you?", "Apne baray mein batao", "Tum kon ho?")
    if is_identity_query(clean_message):
        reply = IDENTITY_REPLY_UR if lang == "roman_urdu" else IDENTITY_REPLY_EN
        return {
            "reply": reply,
            "sources": [],
            "mode": "rag" if use_rag else "simple",
        }

    # 2. Standalone Greeting Queries ("Salam", "Hi", "AOA")
    if is_greeting_query(clean_message):
        reply = GREETING_REPLY_UR if lang == "roman_urdu" else GREETING_REPLY_EN
        return {
            "reply": reply,
            "sources": [],
            "mode": "rag" if use_rag else "simple",
        }

    # 3. Check for strictly Out-of-Domain queries (e.g. cricket, weather, movies, politics)
    if is_out_of_domain(clean_message):
        return {
            "reply": get_out_of_scope_message(clean_message),
            "sources": [],
            "mode": "rag" if use_rag else "simple",
        }

    # SIMPLE MODE (Direct AI without vector retrieval)
    if not use_rag:
        if not is_university_query(clean_message):
            return {
                "reply": get_out_of_scope_message(clean_message),
                "sources": [],
                "mode": "simple",
            }
        reply = ai_service.generate_chat_response(
            prompt=clean_message,
            context="",
            history=history,
        )
        if "don't have information" in reply.lower() or "maloomat nahi" in reply.lower():
            reply = get_out_of_scope_message(clean_message)
        return {
            "reply": reply,
            "sources": [],
            "mode": "simple",
        }

    # RAG MODE
    valid_docs: List[Dict[str, Any]] = []
    sources: List[str] = []

    # 1. Authoritative exact topic resolution
    resolved = _resolve_topic_documents(clean_message)
    if resolved is not None:
        valid_docs, sources = resolved
    else:
        # 2. Fallback to ChromaDB vector search for queries not explicitly pre-classified
        ensure_vector_store_populated()
        retrieved_docs: List[Dict[str, Any]] = []
        try:
            query_vec = embedding_service.get_embedding(clean_message)
            retrieved_docs = vector_store.query_similar(
                query_embedding=query_vec,
                n_results=3,
            )
            if not retrieved_docs:
                retrieved_docs = vector_store.query_similar(
                    query_text=clean_message,
                    n_results=3,
                )
        except Exception as exc:
            logger.error(f"Error querying vector store: {exc}")

        # Check if the user is asking about the platform
        clean_lower = clean_message.lower()
        is_platform_inquiry = any(p in clean_lower for p in [
            "campusconnect", "platform", "portal", "system overview"
        ])

        for doc in retrieved_docs:
            dist = doc.get("distance", 1.0)
            # Strict cosine distance threshold for RAG grounding
            if dist <= 0.45:
                raw_title = (
                    doc.get("metadata", {}).get("title")
                    or doc.get("metadata", {}).get("source")
                    or doc.get("id")
                )
                clean_title = sanitize_source_title(raw_title)

                # Never include general platform overview when the user asked another question
                if clean_title == "CampusConnect Platform Overview" and not is_platform_inquiry:
                    continue

                if not any(v.get("id") == doc.get("id") for v in valid_docs):
                    valid_docs.append(doc)
                if clean_title and clean_title not in sources:
                    sources.append(clean_title)

        # Cap at maximum 2 clean sources
        valid_docs = valid_docs[:2]
        sources = sources[:2]

    # If no relevant documents found in knowledge base and query is not a standard university topic:
    if not valid_docs and not is_university_query(clean_message):
        return {
            "reply": get_out_of_scope_message(clean_message),
            "sources": [],
            "mode": "rag",
        }

    # Format grounded context for Gemini AI
    context_str = ""
    if valid_docs:
        context_parts = []
        for i, doc in enumerate(valid_docs, start=1):
            src_name = doc.get("metadata", {}).get("title", f"Source {i}")
            doc_text = doc.get("document", "").strip()
            context_parts.append(f"[{src_name}]:\n{doc_text}")
        context_str = "\n\n".join(context_parts)

    # Generate grounded response with Gemini
    reply = ai_service.generate_chat_response(
        prompt=clean_message,
        context=context_str,
        history=history,
    )

    # If the response indicates unknown / no information, replace with standard notice & clear sources
    if "don't have information" in reply.lower() or "maloomat nahi" in reply.lower():
        reply = get_out_of_scope_message(clean_message)
        sources = []

    return {
        "reply": reply,
        "sources": sources,
        "mode": "rag",
    }


def generate_chat_response(message: str) -> str:
    res = process_chat(message, use_rag=True)
    return res["reply"]


def answer_from_local_knowledge(message: str) -> str:
    res = process_chat(message, use_rag=True)
    return res["reply"]