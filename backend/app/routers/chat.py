from fastapi import APIRouter

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.rag_service import (
    answer_from_local_knowledge,
)


router = APIRouter(
    prefix="/api/chat",
    tags=["Chatbot"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    data: ChatRequest,
):

    return {
        "reply": answer_from_local_knowledge(
            data.message
        )
    }