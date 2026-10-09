from datetime import datetime

from app.database import (
    claims,
    next_claim_id,
)
from app.services.lost_found_service import get_item


def list_claims(
    claimant_id: int | None = None,
    status: str | None = None,
):
    result = claims.copy()

    if claimant_id is not None:
        result = [
            claim
            for claim in result
            if claim["claimantId"] == claimant_id
        ]

    if status:
        result = [
            claim
            for claim in result
            if claim["status"] == status
        ]

    result.sort(
        key=lambda claim: claim["createdAt"],
        reverse=True,
    )

    return result


def get_claim(claim_id: str):
    for claim in claims:
        if claim["id"] == claim_id:
            return claim

    return None


def create_claim(
    data: dict,
    claimant_id: int,
    claimant_name: str,
):
    item = get_item(data["itemId"])

    if not item:
        return None

    claim = {
        "id": next_claim_id(),
        "itemId": data["itemId"],
        "claimantId": claimant_id,
        "claimantName": claimant_name,
        "proof": data["proof"],
        "status": "pending",
        "createdAt": datetime.utcnow(),
    }

    claims.append(claim)

    return claim


def update_claim(
    claim_id: str,
    status: str,
):
    claim = get_claim(claim_id)

    if not claim:
        return None

    claim["status"] = status

    if status == "approved":
        item = get_item(claim["itemId"])

        if item:
            item["status"] = "claimed"

    return claim