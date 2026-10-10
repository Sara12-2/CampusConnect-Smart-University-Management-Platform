from typing import List, Optional
from pydantic import BaseModel, Field


class ChatHistoryItem(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'assistant'/'bot'")
    content: str = Field(..., description="Message text")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's query or message")
    use_rag: bool = Field(default=True, description="Enable Retrieval-Augmented Generation")
    history: Optional[List[ChatHistoryItem]] = Field(
        default=None,
        description="Optional prior conversation turns for multi-turn dialogue context",
    )


class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI generated reply")
    sources: List[str] = Field(
        default_factory=list,
        description="List of document titles, FAQ questions, or sources retrieved via RAG",
    )
    mode: str = Field(
        default="rag",
        description="Execution mode: 'rag' or 'simple'",
    )
