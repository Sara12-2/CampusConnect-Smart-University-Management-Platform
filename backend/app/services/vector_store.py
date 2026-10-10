"""CampusConnect Vector Store Service.

Manages persistent ChromaDB vector storage for university knowledge documents,
FAQs, guides, notices, and policies.
"""

import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from app.config import settings

logger = logging.getLogger(__name__)

COLLECTION_NAME = "campusconnect_knowledge"


def get_vector_store_path() -> Path:
    """Return absolute path to vector_store directory."""
    raw_path = getattr(settings, "chroma_dir", "vector_store")
    p = Path(raw_path)
    if not p.is_absolute():
        # Relative to backend root
        backend_root = Path(__file__).resolve().parents[2]
        p = backend_root / raw_path
    p.mkdir(parents=True, exist_ok=True)
    return p


_chroma_client = None


def get_chroma_client():
    """Returns singleton PersistentClient for ChromaDB."""
    global _chroma_client
    if _chroma_client is not None:
        return _chroma_client

    try:
        import chromadb  # type: ignore
        store_path = str(get_vector_store_path())
        _chroma_client = chromadb.PersistentClient(path=store_path)
        return _chroma_client
    except ImportError:

        logger.error("chromadb is not installed. Run 'pip install chromadb'.")
        return None
    except Exception as exc:
        logger.error(f"Failed to initialize ChromaDB PersistentClient: {exc}")
        return None


def get_collection(name: str = COLLECTION_NAME):
    """Retrieve or create the specified ChromaDB collection."""
    client = get_chroma_client()
    if client is None:
        return None
    try:
        return client.get_or_create_collection(
            name=name,
            metadata={"hnsw:space": "cosine"},
        )
    except Exception as exc:
        logger.error(f"Failed to get/create ChromaDB collection '{name}': {exc}")
        return None


def clear_collection(name: str = COLLECTION_NAME) -> bool:
    """Deletes and recreates the collection to reset knowledge index."""
    client = get_chroma_client()
    if client is None:
        return False
    try:
        try:
            client.delete_collection(name=name)
        except Exception:
            pass
        client.get_or_create_collection(
            name=name,
            metadata={"hnsw:space": "cosine"},
        )
        return True
    except Exception as exc:
        logger.error(f"Failed to reset collection '{name}': {exc}")
        return False


def add_documents(
    documents: List[str],
    metadatas: List[Dict[str, Any]],
    ids: List[str],
    embeddings: Optional[List[List[float]]] = None,
    name: str = COLLECTION_NAME,
) -> bool:
    """Add documents with metadata and optional precomputed embeddings to ChromaDB."""
    coll = get_collection(name)
    if coll is None:
        return False

    if not documents:
        return True

    try:
        kwargs = {
            "documents": documents,
            "metadatas": metadatas,
            "ids": ids,
        }
        if embeddings is not None and len(embeddings) == len(documents):
            kwargs["embeddings"] = embeddings

        coll.upsert(**kwargs)
        return True
    except Exception as exc:
        logger.error(f"Error upserting documents into ChromaDB: {exc}")
        return False


def query_similar(
    query_text: Optional[str] = None,
    query_embedding: Optional[List[float]] = None,
    n_results: int = 3,
    name: str = COLLECTION_NAME,
) -> List[Dict[str, Any]]:
    """Query ChromaDB for similar knowledge documents."""
    coll = get_collection(name)
    if coll is None:
        return []

    count = get_document_count(name)
    if count == 0:
        return []

    limit = min(n_results, count)

    try:
        kwargs: Dict[str, Any] = {"n_results": limit}
        if query_embedding is not None:
            kwargs["query_embeddings"] = [query_embedding]
        elif query_text is not None:
            kwargs["query_texts"] = [query_text]
        else:
            return []

        results = coll.query(**kwargs)
        records = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results.get("metadatas", [[]])[0] if results.get("metadatas") else []
            dists = results.get("distances", [[]])[0] if results.get("distances") else []
            ids = results.get("ids", [[]])[0] if results.get("ids") else []

            for i, doc in enumerate(docs):
                meta = metas[i] if i < len(metas) else {}
                dist = dists[i] if i < len(dists) else 1.0
                doc_id = ids[i] if i < len(ids) else f"doc_{i}"
                records.append({
                    "id": doc_id,
                    "document": doc,
                    "metadata": meta,
                    "distance": dist,
                })
        return records
    except Exception as exc:
        logger.error(f"Error querying ChromaDB: {exc}")
        return []


def get_document_count(name: str = COLLECTION_NAME) -> int:
    """Return the total number of documents in the collection."""
    coll = get_collection(name)
    if coll is None:
        return 0
    try:
        return coll.count()
    except Exception as exc:
        logger.error(f"Failed to get collection count: {exc}")
        return 0
