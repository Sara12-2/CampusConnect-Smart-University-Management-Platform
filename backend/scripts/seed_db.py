"""Insert small demo records into the database.

Run from the backend directory:
    python -m scripts.seed_db
"""

import sys
from pathlib import Path

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import SessionLocal, init_db
from app.models.notice import Notice
from app.services.notice_service import create_notice


SAMPLES = [
    {
        "title": "Midterm Examination Schedule",
        "content": (
            "The midterm examination schedule for the Fall semester will be "
            "published on the notice board and student portal shortly. "
            "Students are advised to check official updates regularly and "
            "ensure all fee dues are cleared before the examination period."
        ),
        "department": "All",
        "category": "exam",
        "pinned": True,
        "priority": "high",
    },
    {
        "title": "Campus Cleanliness Campaign",
        "content": (
            "All students are invited to join the campus cleanliness and green "
            "campus campaign this Friday. Participation certificates will be "
            "awarded by the Directorate of Student Affairs. Please contact the "
            "Student Affairs office for further details."
        ),
        "department": "All",
        "category": "event",
        "pinned": False,
        "priority": "normal",
    },
]


def main() -> None:
    # Ensure tables exist
    init_db()

    db = SessionLocal()
    try:
        existing_count = db.query(Notice).count()
        if existing_count > 0:
            print(f"ℹ️  Seed skipped: {existing_count} notice(s) already exist in database.")
            return

        created = 0
        for item in SAMPLES:
            try:
                notice = create_notice(db, item, author="CampusConnect Admin")
                created += 1
                print(f"   ✅ Added: {notice['title']}")
            except Exception as exc:
                print(f"   ❌ Failed to add '{item['title']}': {exc}")

        print(f"\n✅ Added {created} sample notice(s) to the database.")

    except Exception as exc:
        db.rollback()
        raise SystemExit(f"❌ Seeding failed: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    main()