from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers.auth import get_current_user, require_admin

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


@router.get("", response_model=list[ComplaintResponse])
def get_complaints(
    status: str | None = Query(default=None),
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student_id = None
    if user["role"] != "admin":
        student_id = int(user["id"])

    return list_complaints(
        db,
        student_id=student_id,
        status=status,
        category=category,
        search=search,
    )


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_single_complaint(
    complaint_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    complaint = get_complaint(db, complaint_id)

    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )

    if user["role"] != "admin" and complaint["studentId"] != int(user["id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    return complaint


@router.post("", response_model=ComplaintResponse)
def create_new_complaint(
    data: ComplaintCreate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_complaint(db, data, user)


@router.put("/{complaint_id}", response_model=ComplaintResponse)
def edit_complaint(
    complaint_id: int,
    data: ComplaintUpdate,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    complaint = update_complaint(db, complaint_id, data)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )
    return complaint


@router.delete("/{complaint_id}")
def remove_complaint(
    complaint_id: int,
    _: dict = Depends(require_admin),
    db: Session = Depends(get_db),
):
    deleted = delete_complaint(db, complaint_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found",
        )
    return {"message": "Complaint deleted successfully"}