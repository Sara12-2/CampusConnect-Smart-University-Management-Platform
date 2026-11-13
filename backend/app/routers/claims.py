from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, require_admin
from app.schemas.claim import ClaimCreate, ClaimResponse, ClaimUpdate
from app.services import claim_service

router = APIRouter(
    prefix="/api/claims",
    tags=["Claims"],
)


@router.get("", response_model=list[ClaimResponse])
def get_claims(
    item_id: int | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    claimant_id = None
    if user["role"] != "admin":
        claimant_id = int(user["id"])

    return claim_service.list_claims(
        db=db,
        claimant_id=claimant_id,
        status=status_filter,
        item_id=item_id,
    )


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_single_claim(
    claim_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    claim = claim_service.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if user["role"] != "admin":
        owner_id = claim.get("claimantId")
        if owner_id is None or int(owner_id) != int(user["id"]):
            raise HTTPException(status_code=403, detail="Access denied")

    return claim


@router.post("", response_model=ClaimResponse)
def create_new_claim(
    data: ClaimCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    claim = claim_service.create_claim(
        db=db,
        data=data,
        claimant_id=int(user["id"]),
        claimant_name=user["name"],
    )
    if not claim:
        raise HTTPException(status_code=404, detail="Item not found")
    return claim


@router.put("/{claim_id}", response_model=ClaimResponse)
def edit_claim(
    claim_id: int,
    data: ClaimUpdate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    claim = claim_service.update_claim(db, claim_id, data.status)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim