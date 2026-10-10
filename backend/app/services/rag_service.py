"""CampusConnect RAG (Retrieval-Augmented Generation) Service.

Combines ChromaDB semantic document retrieval with Google Gemini AI to provide
grounded, hallucination-free, bilingual answers to university queries with strict
language matching (English & Roman Urdu) and robust self-identity handling.
"""

import logging
from typing import List, Dict, Any, Optional

try:
    from app.services import ai_service, embedding_service, vector_store  # type: ignore
except ImportError:
    import app.services.ai_service as ai_service  # type: ignore
    import app.services.embedding_service as embedding_service  # type: ignore
    import app.services.vector_store as vector_store  # type: ignore

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
        # If not a university query and no context, enforce fallback
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
    # Retrieve relevant documents from ChromaDB
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

    # Check distance / relevance threshold (cosine distance <= 0.75 is considered relevant)
    valid_docs = []
    sources = []
    for doc in retrieved_docs:
        dist = doc.get("distance", 1.0)
        # Cosine distance: closer to 0 is more similar; anything > 0.75 is irrelevant
        if dist <= 0.75:
            valid_docs.append(doc)
            title = (
                doc.get("metadata", {}).get("title")
                or doc.get("metadata", {}).get("source")
                or doc.get("id")
            )
            if title and title not in sources:
                sources.append(title)

    # If no relevant documents found in knowledge base and the query is not a standard university topic:
    if not valid_docs and not is_university_query(clean_message):
        return {
            "reply": get_out_of_scope_message(clean_message),
            "sources": [],
            "mode": "rag",
        }

    # Format context for Gemini
    context_str = ""
    if valid_docs:
        context_parts = []
        for i, doc in enumerate(valid_docs, start=1):
            src_name = doc.get("metadata", {}).get("title", f"Source {i}")
            doc_text = doc.get("document", "").strip()
            context_parts.append(f"[{src_name}]:\n{doc_text}")
        context_str = "\n\n".join(context_parts)

    # Generate grounded response with Gemini (with context if found, or platform system knowledge)
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