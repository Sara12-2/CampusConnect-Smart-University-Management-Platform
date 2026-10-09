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

from app.services.claim_service import (
    create_claim,
    get_claim,
    list_claims,
    update_claim,
)


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
    user: dict = Depends(get_current_user),
):

    claimant_id = None

    if user["role"] != "admin":
        claimant_id = str(user["id"])

    return list_claims(
        claimant_id,
        item_id,
    )


@router.get(
    "/{claim_id}",
    response_model=ClaimResponse,
)
def get_single_claim(
    claim_id: str,
    user: dict = Depends(get_current_user),
):

    claim = get_claim(
        claim_id
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

    return create_claim(
        data,
        user,
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

    return update_claim(
        claim_id,
        data,
    )