"""CampusConnect Chat Router.

Provides API endpoints for interacting with the CampusConnect AI Chatbot,
supporting both simple Gemini dialogue and full RAG semantic search.
"""

from fastapi import APIRouter, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_service import process_chat, ensure_vector_store_populated  # type: ignore
from app.services.vector_store import get_document_count  # type: ignore
from app.config import settings


router = APIRouter(
    prefix="/api/chat",
    tags=["Chatbot"],
)


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with CampusConnect Assistant",
    description="Processes user messages using RAG (with ChromaDB) or direct Gemini AI.",
)
@router.post(
    "/",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """Handles chat request and returns reply with source citations."""
    history_dicts = None
    if request.history:
        history_dicts = [h.model_dump() for h in request.history]

    result = process_chat(
        message=request.message,
        use_rag=request.use_rag,
        history=history_dicts,
    )

    return ChatResponse(
        reply=result.get("reply", ""),
        sources=result.get("sources", []),
        mode=result.get("mode", "rag" if request.use_rag else "simple"),
    )


@router.api_route(
    "/status",
    methods=["GET", "HEAD"],
    summary="Get Chatbot & Vector Store status",
)
def chat_status():
    """Returns vector store document count and AI configuration status."""
    ensure_vector_store_populated()
    doc_count = get_document_count()
    has_api_key = bool(settings.gemini_api_key)
    return {
        "status": "online",
        "gemini_configured": has_api_key,
        "model": settings.ai_model,
        "vector_store_documents": doc_count,
        "rag_ready": doc_count > 0,
    }
