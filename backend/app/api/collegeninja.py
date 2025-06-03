# backend/app/api/collegeninja.py
from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Optional

from app.models.collegeninja import (
    CollegeNinjaStudent, CollegeNinjaStudentCreate,
    CollegeNinjaCounselor, CollegeNinjaCounselorCreate
)
from app.models.user import User
from app.api.auth import get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_collegeninja_student_confirmation, send_collegeninja_counselor_confirmation, send_collegeninja_admin_notification

router = APIRouter()

@router.post("/student-signup", response_model=CollegeNinjaStudent)
async def create_student_signup(student: CollegeNinjaStudentCreate):
    """Create a new CollegeNinja student/parent signup"""
    student_data = student.model_dump()

    try:
        created_student = file_db.create_collegeninja_student(student_data)

        # Send confirmation email to student/parent
        try:
            await send_collegeninja_student_confirmation(
                student.email,
                student.name
            )
        except Exception as e:
            print(f"Failed to send student confirmation email: {e}")

        # Send notification to admin
        try:
            await send_collegeninja_admin_notification(
                "student",
                student.name,
                student.email,
                student.gradeLevel
            )
        except Exception as e:
            print(f"Failed to send admin notification: {e}")

        return CollegeNinjaStudent(**created_student)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/counselor-signup", response_model=CollegeNinjaCounselor)
async def create_counselor_signup(counselor: CollegeNinjaCounselorCreate):
    """Create a new CollegeNinja counselor signup"""
    counselor_data = counselor.model_dump()

    try:
        created_counselor = file_db.create_collegeninja_counselor(counselor_data)

        # Send confirmation email to counselor
        try:
            await send_collegeninja_counselor_confirmation(
                counselor.email,
                counselor.name
            )
        except Exception as e:
            print(f"Failed to send counselor confirmation email: {e}")

        # Send notification to admin
        try:
            await send_collegeninja_admin_notification(
                "counselor",
                counselor.name,
                counselor.email
            )
        except Exception as e:
            print(f"Failed to send admin notification: {e}")

        return CollegeNinjaCounselor(**created_counselor)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/students", response_model=List[CollegeNinjaStudent])
async def get_student_signups(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all CollegeNinja student signups (admin only)"""
    students = file_db.get_collegeninja_students(skip=skip, limit=limit)

    if status:
        students = [s for s in students if s.get('status') == status]

    return [CollegeNinjaStudent(**student) for student in students]

@router.get("/counselors", response_model=List[CollegeNinjaCounselor])
async def get_counselor_signups(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all CollegeNinja counselor signups (admin only)"""
    counselors = file_db.get_collegeninja_counselors(skip=skip, limit=limit)

    if status:
        counselors = [c for c in counselors if c.get('status') == status]

    return [CollegeNinjaCounselor(**counselor) for counselor in counselors]

@router.get("/stats")
async def get_collegeninja_stats(
    current_admin: User = Depends(get_current_admin_user)
):
    """Get CollegeNinja signup statistics (admin only)"""
    all_students = file_db.get_collegeninja_students(skip=0, limit=10000)
    all_counselors = file_db.get_collegeninja_counselors(skip=0, limit=10000)

    # Grade level distribution
    grade_distribution = {}
    for student in all_students:
        grade = student.get('gradeLevel', 'unknown')
        grade_distribution[grade] = grade_distribution.get(grade, 0) + 1

    stats = {
        "total_students": len(all_students),
        "total_counselors": len(all_counselors),
        "total_signups": len(all_students) + len(all_counselors),
        "grade_distribution": grade_distribution,
        "student_status": {
            "pending": len([s for s in all_students if s.get('status') == 'pending']),
            "contacted": len([s for s in all_students if s.get('status') == 'contacted']),
            "enrolled": len([s for s in all_students if s.get('status') == 'enrolled'])
        },
        "counselor_status": {
            "pending": len([c for c in all_counselors if c.get('status') == 'pending']),
            "contacted": len([c for c in all_counselors if c.get('status') == 'contacted']),
            "partner": len([c for c in all_counselors if c.get('status') == 'partner'])
        }
    }

    return stats

@router.patch("/students/{student_id}")
async def update_student_status(
    student_id: str,
    status: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update student signup status (admin only)"""
    valid_statuses = ["pending", "contacted", "enrolled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    updated = file_db.update_collegeninja_student(student_id, {"status": status})
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student signup not found"
        )

    return {"message": "Status updated successfully"}

@router.patch("/counselors/{counselor_id}")
async def update_counselor_status(
    counselor_id: str,
    status: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update counselor signup status (admin only)"""
    valid_statuses = ["pending", "contacted", "partner"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    updated = file_db.update_collegeninja_counselor(counselor_id, {"status": status})
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Counselor signup not found"
        )

    return {"message": "Status updated successfully"}