
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from app.routers.auth import (
    get_current_user,
    require_admin,
)

from app.schemas.claim import (
    ClaimCreate,
    ClaimResponse,
    ClaimUpdate,
)

from app.services import claim_service


router = APIRouter(
    prefix="/api/claims",
    tags=["Claims"],
)


@router.get(
    "",
    response_model=list[ClaimResponse],
)
def get_claims(
    item_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    user: dict = Depends(get_current_user),
):

    claimant_id = None

    if user["role"] != "admin":
        claimant_id = str(user["id"])

    return claim_service.list_claims(
        claimant_id=claimant_id,
        item_id=item_id,
        status=status,
    )


@router.get(
    "/{claim_id}",
    response_model=ClaimResponse,
)
def get_single_claim(
    claim_id: str,
    user: dict = Depends(get_current_user),
):

    get_claim_handler = getattr(claim_service, "get_claim")
    claim = get_claim_handler(claim_id)

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found",
        )

    if (
        user["role"] != "admin"
        and claim["claimantId"] != str(user["id"])
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return claim


@router.post(
    "",
    response_model=ClaimResponse,
)
def create_new_claim(
    data: ClaimCreate,
    user: dict = Depends(get_current_user),
):

    create_handler = getattr(claim_service, "create_claim")

    return create_handler(
        data,
        str(user["id"]),
        user["name"],
    )


@router.put(
    "/{claim_id}",
    response_model=ClaimResponse,
)
def edit_claim(
    claim_id: str,
    data: ClaimUpdate,
    _: dict = Depends(require_admin),
):

    update_handler = getattr(
        claim_service,
        "update_claim_status",
        getattr(claim_service, "update_claim"),
    )

    return update_handler(
        claim_id,
        data.status,
    )
