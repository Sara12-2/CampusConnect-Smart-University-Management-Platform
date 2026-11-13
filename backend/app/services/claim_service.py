from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.models.lost_found import LostFound


# ============================================================
# Helpers
# ============================================================
def _serialize(claim: Claim) -> dict:
    """Convert Claim model → API response."""
    return {
        "id": claim.id,
        "itemId": claim.item_id,
        "claimantId": claim.claimant_id,
        "message": claim.message,
        "status": claim.status,
        "createdAt": claim.created_at,
    }


# ============================================================
# List Claims
# ============================================================
def list_claims(
    db: Session,
    claimant_id: int | None = None,
    item_id: int | None = None,
    status: str | None = None,
):
    query = db.query(Claim)

    if claimant_id is not None:
        query = query.filter(Claim.claimant_id == claimant_id)

    if item_id is not None:
        query = query.filter(Claim.item_id == item_id)

    if status:
        query = query.filter(Claim.status == status)

    query = query.order_by(Claim.created_at.desc())

    return [_serialize(c) for c in query.all()]


# ============================================================
# Get Single Claim
# ============================================================
def get_claim(db: Session, claim_id: int):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    return _serialize(claim) if claim else None


# ============================================================
# Create Claim
# ============================================================
def create_claim(
    db: Session,
    data,
    claimant_id: int,
    claimant_name: str | None = None,  # kept for backward compat
):
    if hasattr(data, "model_dump"):
        data = data.model_dump()

    item = db.query(LostFound).filter(LostFound.id == data["itemId"]).first()
    if not item:
        return None

    claim = Claim(
        item_id=data["itemId"],
        claimant_id=claimant_id,
        message=data.get("message", ""),
        status="pending",
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)

    return _serialize(claim)


# ============================================================
# Update Claim Status
# ============================================================
def update_claim(
    db: Session,
    claim_id: int,
    status: str,
    verifier_id: int | None = None,
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        return None

    claim.status = status

    if verifier_id:
        claim.verified_by = verifier_id

    if status == "approved":
        item = db.query(LostFound).filter(LostFound.id == claim.item_id).first()
        if item:
            item.status = "claimed"

    db.commit()
    db.refresh(claim)

    return _serialize(claim)