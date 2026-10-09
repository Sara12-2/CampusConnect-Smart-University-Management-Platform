def generate_chat_response(message: str) -> str:
    message = message.strip().lower()

    if not message:
        return "Please enter a question."

    if "notice" in message:
        return (
            "You can view university notices from the "
            "Notices section."
        )

    if "complaint" in message:
        return (
            "You can submit and track complaints from "
            "the Complaints section."
        )

    if "lost" in message or "found" in message:
        return (
            "You can report lost or found items from "
            "the Lost & Found section."
        )

    if "claim" in message:
        return (
            "You can submit a claim for an item from "
            "the Claims section."
        )

    return (
        "I can help with notices, complaints, "
        "lost and found, and claims."
    )


def answer_from_local_knowledge(message: str) -> str:
    return generate_chat_response(message)