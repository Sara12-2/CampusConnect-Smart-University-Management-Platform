"""CampusConnect Text Chunker Utility.

Provides text chunking and section extraction functions for RAG ingestion.
"""

import re
from typing import List, Dict, Any


def clean_text(text: str) -> str:
    """Normalize whitespace and strip unnecessary characters."""
    if not text:
        return ""
    # Replace multiple spaces/newlines with clean representations
    cleaned = re.sub(r"\r\n|\r", "\n", text)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def chunk_text(
    text: str,
    chunk_size: int = 500,
    chunk_overlap: int = 100,
) -> List[str]:
    """Split text into chunks of roughly `chunk_size` characters with `chunk_overlap`.

    Tries to split on sentence or newline boundaries when possible.
    """
    text = clean_text(text)
    if not text:
        return []

    if len(text) <= chunk_size:
        return [text]

    chunks: List[str] = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        if end >= len(text):
            chunk = text[start:].strip()
            if chunk:
                chunks.append(chunk)
            break

        # Look for a paragraph or sentence break near the end
        boundary = -1
        # Check for paragraph break
        p_break = text.rfind("\n\n", start, end)
        if p_break != -1 and p_break > start + (chunk_size // 2):
            boundary = p_break + 2
        else:
            # Check for sentence ending period, question mark, or exclamation
            for punct in [". ", "? ", "!\n", "\n"]:
                s_break = text.rfind(punct, start, end)
                if s_break != -1 and s_break > start + (chunk_size // 3):
                    boundary = s_break + len(punct)
                    break

        if boundary == -1:
            boundary = end

        chunk = text[start:boundary].strip()
        if chunk:
            chunks.append(chunk)

        # Advance start with overlap
        step = boundary - chunk_overlap
        if step <= start:
            step = boundary
        start = step

    return chunks


def chunk_markdown_sections(text: str) -> List[Dict[str, str]]:
    """Splits markdown or section-based text into titled chunks.

    Recognizes headings like `#`, `##`, `###`, or numbered sections like `Policy 1:`.
    """
    cleaned = clean_text(text)
    if not cleaned:
        return []

    # Regex matches headings like: # Heading or ## Heading or Section 1: Heading
    pattern = r"(?m)^(?:#{1,4}\s+|(?:\d+\.\s+|[A-Z\s]{3,}:))(.*)$"
    matches = list(re.finditer(pattern, cleaned))

    if not matches:
        return [{"title": "General", "content": cleaned}]

    sections: List[Dict[str, str]] = []

    # Content before first heading if any
    first_start = matches[0].start()
    if first_start > 0:
        intro = cleaned[:first_start].strip()
        if intro:
            sections.append({"title": "Introduction", "content": intro})

    for i, m in enumerate(matches):
        raw_title = m.group(0).lstrip("#").strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(cleaned)
        content = cleaned[start:end].strip()
        if content:
            sections.append({
                "title": raw_title,
                "content": f"{raw_title}\n{content}",
            })

    return sections
