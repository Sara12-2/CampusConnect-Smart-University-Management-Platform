"""Validate local FAQ/policy knowledge files for the current keyword chatbot.

This project currently has no ChromaDB/vector-store integration. This script deliberately
validates files instead of pretending to build a vector index. Add ChromaDB only when
semantic retrieval is implemented in rag_service.py.
Run: python -m scripts.ingest_chroma
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def main() -> None:
    DATA.mkdir(exist_ok=True)
    faq_file = DATA / "faqs.json"
    if not faq_file.exists():
        faq_file.write_text(json.dumps([
            {"question": "How do I submit a complaint?", "answer": "Open the Complaints section and submit the form."},
            {"question": "Where can I find notices?", "answer": "Open the Notices section."},
        ], indent=2), encoding="utf-8")
        print(f"Created starter FAQ file: {faq_file}")
    try:
        faqs = json.loads(faq_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {faq_file}: {exc}")
    if not isinstance(faqs, list) or any(not isinstance(x, dict) or not x.get("question") or not x.get("answer") for x in faqs):
        raise SystemExit("faqs.json must be a list of objects with question and answer fields.")
    print(f"Validated {len(faqs)} FAQ record(s). No vector index was built: ChromaDB is not configured.")


if __name__ == "__main__":
    main()
