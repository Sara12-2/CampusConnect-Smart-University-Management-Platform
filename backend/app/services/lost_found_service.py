from datetime import datetime

from app.database import (
    lost_found_items,
    next_lost_found_id,
)


def list_items(
    item_type: str | None = None,
    status: str | None = None,
    search: str | None = None,
):
    result = lost_found_items.copy()

    if item_type:
        result = [
            item
            for item in result
            if item["type"] == item_type
        ]

    if status:
        result = [
            item
            for item in result
            if item["status"] == status
        ]

    if search:
        search_text = search.lower()

        result = [
            item
            for item in result
            if search_text in item["title"].lower()
            or search_text in item["description"].lower()
            or search_text in item["location"].lower()
        ]

    result.sort(
        key=lambda item: item["createdAt"],
        reverse=True,
    )

    return result


def get_item(item_id: str):
    for item in lost_found_items:
        if item["id"] == item_id:
            return item

    return None


def create_item(
    data: dict,
    reported_by: int,
    reporter_name: str,
):
    item = {
        "id": next_lost_found_id(),
        "type": data["type"],
        "title": data["title"],
        "description": data["description"],
        "location": data["location"],
        "date": data["date"],
        "images": data.get("images", []),
        "reportedBy": reported_by,
        "reporterName": reporter_name,
        "status": "open",
        "createdAt": datetime.utcnow(),
    }

    lost_found_items.append(item)

    return item


def update_item(
    item_id: str,
    data: dict,
):
    item = get_item(item_id)

    if not item:
        return None

    for key, value in data.items():
        if value is not None:
            item[key] = value

    return item


def delete_item(item_id: str):
    item = get_item(item_id)

    if not item:
        return False

    lost_found_items.remove(item)

    return True