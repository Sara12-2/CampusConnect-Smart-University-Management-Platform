"""Clear in-memory records only after an explicit confirmation.
Run: python -m scripts.reset_db --confirm
This affects only the Python process running this script, not a separate server process.
"""
import argparse
from app import database


def main() -> None:
    parser = argparse.ArgumentParser(description="Clear current process in-memory data")
    parser.add_argument("--confirm", action="store_true", help="confirm destructive reset")
    args = parser.parse_args()
    if not args.confirm:
        parser.error("This is destructive. Re-run with --confirm to proceed.")
    for name in ("users", "notices", "complaints", "lost_found_items", "claims", "notifications", "staff"):
        getattr(database, name).clear()
    print("Cleared in-memory collections in this script process only.")
    print("This does not clear data in a separately running Uvicorn process.")


if __name__ == "__main__":
    main()
