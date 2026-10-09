import re


def generate_summary(
    text: str,
    max_sentences: int = 2,
) -> str:

    clean_text = re.sub(
        r"\s+",
        " ",
        text,
    ).strip()

    if not clean_text:
        return ""

    sentences = re.split(
        r"(?<=[.!?])\s+",
        clean_text,
    )

    summary = " ".join(
        sentences[:max_sentences]
    )

    if len(summary) > 300:
        summary = (
            summary[:297]
            .rsplit(" ", 1)[0]
            + "..."
        )

    return summary