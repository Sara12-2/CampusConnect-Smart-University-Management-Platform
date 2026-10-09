"""Insert small demo records into the current in-memory store.
Run from backend directory: python -m scripts.seed_db
"""
from app.database import notices
from app.services.notice_service import create_notice


def main() -> None:
    if notices:
        print(f"Seed skipped: {len(notices)} notice(s) already exist in memory.")
        return
    samples = [
        {"title": "Midterm examination schedule", "content": "The midterm examination schedule will be shared by the department soon. Please check official updates regularly.", "department": "All", "category": "exam", "pinned": True},
        {"title": "Campus cleanliness campaign", "content": "Students are invited to join the campus cleanliness campaign this Friday. Please contact student affairs for details.", "department": "All", "category": "event", "pinned": False},
    ]
    for item in samples:
        create_notice(item, "CampusConnect Admin")
    print(f"Added {len(samples)} sample notices to the current in-memory session.")
    print("Note: data is not persistent and will be lost when the server restarts.")


if __name__ == "__main__":
    main()
