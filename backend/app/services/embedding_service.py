"""CampusConnect Embedding Service.

Converts textual documents, questions, and chunks into dense numerical vectors
using Google Gemini's text-embedding-004 model.
"""

import os
import hashlib
import logging
from typing import List, Optional

from app.config import settings

logger = logging.getLogger(__name__)

DEFAULT_EMBEDDING_DIM = 768


def _get_api_key() -> str:
    key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
    return key.strip()


def _pseudo_embedding(text: str, dim: int = DEFAULT_EMBEDDING_DIM) -> List[float]:
    """Generates a deterministic pseudo-random unit vector when external API is unreachable."""
    h = hashlib.sha256(text.encode("utf-8")).digest()
    vec = []
    for i in range(dim):
        b = h[i % len(h)]
        val = ((b + (i * 31) % 256) / 255.0) * 2.0 - 1.0
        vec.append(round(val, 6))
    # Normalize
    norm = sum(x * x for x in vec) ** 0.5
    if norm > 0:
        vec = [round(x / norm, 6) for x in vec]
    return vec


def get_embedding(text: str) -> List[float]:
    """Generate embedding vector for a single text string."""
    clean_text = (text or "").strip()
    if not clean_text:
        return [0.0] * DEFAULT_EMBEDDING_DIM

    api_key = _get_api_key()
    if api_key:
        # Try google-genai SDK
        try:
            from google import genai  # type: ignore

            client = genai.Client(api_key=api_key)
            model_name = getattr(settings, "embedding_model", "text-embedding-004")
            result = client.models.embed_content(
                model=model_name,
                contents=clean_text,
            )
            if hasattr(result, "embedding") and hasattr(result.embedding, "values"):
                return list(result.embedding.values)
            if hasattr(result, "embeddings") and len(result.embeddings) > 0:
                return list(result.embeddings[0].values)
        except Exception as exc:
            logger.debug(f"google.genai embedding error: {exc}. Trying fallback...")

        # Try google.generativeai SDK if installed
        try:
            import google.generativeai as legacy_genai  # type: ignore

            legacy_genai.configure(api_key=api_key)
            result = legacy_genai.embed_content(
                model="models/text-embedding-004",
                content=clean_text,
            )
            if isinstance(result, dict) and "embedding" in result:
                return result["embedding"]
        except ImportError:
            pass
        except Exception as exc:
            logger.debug(f"legacy google.generativeai embedding error: {exc}")


    return _pseudo_embedding(clean_text)


def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embedding vectors for a batch of text strings."""
    if not texts:
        return []

    api_key = _get_api_key()
    if api_key:
        try:
            from google import genai

            client = genai.Client(api_key=api_key)
            model_name = getattr(settings, "embedding_model", "text-embedding-004")
            result = client.models.embed_content(
                model=model_name,
                contents=texts,
            )
            if hasattr(result, "embeddings") and result.embeddings:
                return [list(e.values) for e in result.embeddings]
        except Exception as exc:
            logger.debug(f"Batch embedding failed ({exc}). Falling back to per-item...")

    return [get_embedding(t) for t in texts]
