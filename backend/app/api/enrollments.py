# backend/app/api/enrollments.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List

from app.models.enrollment import Enrollment, EnrollmentCreate, EnrollmentUpdate
from app.models.user import User
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_enrollment_confirmation

router = APIRouter()

@router.post("/", response_model=Enrollment)
async def create_enrollment(enrollment: EnrollmentCreate):
    """Create a new course enrollment"""
    enrollment_data = enrollment.model_dump()

    try:
        created_enrollment = file_db.create_enrollment(enrollment_data)

        # Send confirmation email
        try:
            await send_enrollment_confirmation(
                enrollment.email,
                enrollment.first_name,
                enrollment.course
            )
        except Exception as e:
            print(f"Failed to send enrollment email: {e}")

        return Enrollment(**created_enrollment)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[Enrollment])
async def get_enrollments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all enrollments (admin only)"""
    enrollments = file_db.get_enrollments(skip=skip, limit=limit)
    return [Enrollment(**enrollment) for enrollment in enrollments]

@router.get("/my", response_model=List[Enrollment])
async def get_my_enrollments(
    current_user: User = Depends(get_current_user)
):
    """Get current user's enrollments"""
    all_enrollments = file_db.get_enrollments()
    user_enrollments = [e for e in all_enrollments if e['email'].lower() == current_user.email.lower()]
    return [Enrollment(**enrollment) for enrollment in user_enrollments]

@router.get("/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(
    enrollment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get enrollment by ID"""
    enrollment = file_db.get_enrollment_by_id(enrollment_id)

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    # Check permissions
    if not current_user.is_admin and enrollment['email'].lower() != current_user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return Enrollment(**enrollment)

@router.patch("/{enrollment_id}", response_model=Enrollment)
async def update_enrollment(
    enrollment_id: str,
    enrollment_update: EnrollmentUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update enrollment status (admin only)"""
    update_data = enrollment_update.model_dump(exclude_unset=True)
    updated_enrollment = file_db.update_enrollment(enrollment_id, update_data)

    if not updated_enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    return Enrollment(**updated_enrollment)

# backend/app/api/schedules.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List

from app.models.schedule import Schedule, ScheduleCreate, ScheduleUpdate
from app.models.user import User
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_schedule_confirmation

router = APIRouter()

@router.post("/", response_model=Schedule)
async def create_schedule(schedule: ScheduleCreate):
    """Create a new consultation schedule request"""
    schedule_data = schedule.model_dump()

    try:
        created_schedule = file_db.create_schedule(schedule_data)

        # Send confirmation email
        try:
            await send_schedule_confirmation(
                schedule.email,
                schedule.first_name
            )
        except Exception as e:
            print(f"Failed to send schedule email: {e}")

        return Schedule(**created_schedule)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[Schedule])
async def get_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all schedule requests (admin only)"""
    schedules = file_db.get_schedules(skip=skip, limit=limit)
    return [Schedule(**schedule) for schedule in schedules]

@router.get("/my", response_model=List[Schedule])
async def get_my_schedules(
    current_user: User = Depends(get_current_user)
):
    """Get current user's schedule requests"""
    all_schedules = file_db.get_schedules()
    user_schedules = [s for s in all_schedules if s['email'].lower() == current_user.email.lower()]
    return [Schedule(**schedule) for schedule in user_schedules]

@router.get("/{schedule_id}", response_model=Schedule)
async def get_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get schedule by ID"""
    schedule = file_db.get_schedule_by_id(schedule_id)

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    # Check permissions
    if not current_user.is_admin and schedule['email'].lower() != current_user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return Schedule(**schedule)

@router.patch("/{schedule_id}", response_model=Schedule)
async def update_schedule(
    schedule_id: str,
    schedule_update: ScheduleUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update schedule status and details (admin only)"""
    update_data = schedule_update.model_dump(exclude_unset=True)

    # Convert datetime to ISO format if present
    if 'scheduled_date' in update_data and update_data['scheduled_date']:
        update_data['scheduled_date'] = update_data['scheduled_date'].isoformat()

    updated_schedule = file_db.update_schedule(schedule_id, update_data)

    if not updated_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    return Schedule(**updated_schedule)