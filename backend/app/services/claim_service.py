def list_claims(
    claimant_id: str | None = None,
    item_id: str | None = None,
    status: str | None = None,
):
    result = list(globals().get("claims", []))

    if claimant_id is not None:
        result = [
            claim
            for claim in result
            if str(claim["claimantId"]) == str(claimant_id)
        ]

    if item_id is not None:
        result = [
            claim
            for claim in result
            if str(claim["itemId"]) == str(item_id)
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
