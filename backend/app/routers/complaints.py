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

from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintUpdate,
)

from app.services.complaint_service import (
    create_complaint,
    delete_complaint,
    get_complaint,
    list_complaints,
    update_complaint,
)


router = APIRouter(
    prefix="/api/complaints",
    tags=["Complaints"],
)


@router.get(
    "",
    response_model=list[ComplaintResponse],
)
def get_complaints(
    status: str | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    user: dict = Depends(get_current_user),
):

    student_id = None

    if user["role"] != "admin":
        student_id = str(user["id"])

    return list_complaints(
        student_id,
        status,
        category,
        search,
    )


@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse,
)
def get_single_complaint(
    complaint_id: str,
    user: dict = Depends(get_current_user),
):

    complaint = get_complaint(
        complaint_id
    )

    if (
        user["role"] != "admin"
        and complaint["studentId"] != str(user["id"])
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return complaint


@router.post(
    "",
    response_model=ComplaintResponse,
)
def create_new_complaint(
    data: ComplaintCreate,
    user: dict = Depends(get_current_user),
):

    return create_complaint(
        data,
        user,
    )


@router.put(
    "/{complaint_id}",
    response_model=ComplaintResponse,
)
def edit_complaint(
    complaint_id: str,
    data: ComplaintUpdate,
    _: dict = Depends(require_admin),
):

    return update_complaint(
        complaint_id,
        data,
    )


@router.delete(
    "/{complaint_id}",
)
def remove_complaint(
    complaint_id: str,
    _: dict = Depends(require_admin),
):

    delete_complaint(
        complaint_id
    )

    return {
        "message": "Complaint deleted successfully"
    }