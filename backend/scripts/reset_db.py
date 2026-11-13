"""Reset the database — drop all tables and recreate empty schema.

⚠️  DESTRUCTIVE — this deletes ALL data.

Run from the backend directory:
    python -m scripts.reset_db --confirm
"""

import sys
from pathlib import Path

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import argparse

from app.database import Base, engine, init_db
from app import models  # noqa: F401  — register all models with Base.metadata


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Drop all tables and recreate empty database schema."
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Confirm destructive reset (required)",
    )
    parser.add_argument(
        "--keep-tables",
        action="store_true",
        help="Only delete rows, keep table structure intact",
    )
    args = parser.parse_args()

    if not args.confirm:
        parser.error(
            "This is destructive. Re-run with --confirm to proceed."
        )

    print("⚠️  WARNING: This will delete ALL data in the database.")
    print(f"   Database: {engine.url}")

    if args.keep_tables:
        # Delete rows only, keep tables
        from app.database import SessionLocal
        db = SessionLocal()
        try:
            for table in reversed(Base.metadata.sorted_tables):
                db.execute(table.delete())
            db.commit()
            print("✅ All rows deleted (tables preserved).")
        except Exception as exc:
            db.rollback()
            raise SystemExit(f"❌ Reset failed: {exc}")
        finally:
            db.close()
    else:
        # Drop and recreate all tables
        try:
            Base.metadata.drop_all(bind=engine)
            print("✅ All tables dropped.")
            init_db()
            print("✅ Empty schema recreated.")
        except Exception as exc:
            raise SystemExit(f"❌ Reset failed: {exc}")

    print("\n✅ Database reset complete.")


if __name__ == "__main__":
    main()