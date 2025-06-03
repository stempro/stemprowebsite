# backend/app/api/schedules.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.models.schedule import Schedule, ScheduleCreate, ScheduleUpdate
from app.models.user import User
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_schedule_confirmation, send_schedule_update_notification

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
            print(f"Failed to send schedule confirmation email: {e}")
            # Don't fail the request if email fails

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
    status: Optional[str] = Query(None, description="Filter by status (pending, scheduled, completed)"),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all schedule requests (admin only)"""
    schedules = file_db.get_schedules(skip=skip, limit=limit)

    # Filter by status if provided
    if status:
        schedules = [s for s in schedules if s.get('status', 'pending') == status]

    return [Schedule(**schedule) for schedule in schedules]

@router.get("/my", response_model=List[Schedule])
async def get_my_schedules(
    current_user: User = Depends(get_current_user)
):
    """Get current user's schedule requests"""
    user_schedules = file_db.get_schedules_by_email(current_user.email)
    return [Schedule(**schedule) for schedule in user_schedules]

@router.get("/pending", response_model=List[Schedule])
async def get_pending_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all pending schedule requests (admin only)"""
    all_schedules = file_db.get_schedules(skip=skip, limit=limit)
    pending_schedules = [s for s in all_schedules if s.get('status', 'pending') == 'pending']
    return [Schedule(**schedule) for schedule in pending_schedules]

@router.get("/stats/summary")
async def get_schedule_stats(
    current_admin: User = Depends(get_current_admin_user)
):
    """Get schedule statistics (admin only)"""
    # Get all schedules for stats (no pagination)
    all_schedules = file_db.get_schedules(skip=0, limit=10000)

    stats = {
        "total": len(all_schedules),
        "pending": len([s for s in all_schedules if s.get('status', 'pending') == 'pending']),
        "scheduled": len([s for s in all_schedules if s.get('status') == 'scheduled']),
        "completed": len([s for s in all_schedules if s.get('status') == 'completed']),
        "by_student_type": {},
        "by_country": {}
    }

    # Additional statistics
    for schedule in all_schedules:
        # By student type
        student_type = schedule.get('student_type', 'unknown')
        stats['by_student_type'][student_type] = stats['by_student_type'].get(student_type, 0) + 1

        # By country
        country = schedule.get('country', 'unknown')
        stats['by_country'][country] = stats['by_country'].get(country, 0) + 1

    return stats

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

    # Check permissions - users can only see their own schedules unless admin
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
    # Get existing schedule first
    existing_schedule = file_db.get_schedule_by_id(schedule_id)
    if not existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    update_data = schedule_update.model_dump(exclude_unset=True)

    # Convert datetime to ISO format if present
    if 'scheduled_date' in update_data and update_data['scheduled_date']:
        update_data['scheduled_date'] = update_data['scheduled_date'].isoformat()

    # Validate status values
    if 'status' in update_data and update_data['status'] not in ['pending', 'scheduled', 'completed', 'cancelled']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be one of: pending, scheduled, completed, cancelled"
        )

    updated_schedule = file_db.update_schedule(schedule_id, update_data)

    if not updated_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    # Send notification email if status changed to scheduled
    if (schedule_update.status == 'scheduled' and
        existing_schedule.get('status') != 'scheduled' and
        update_data.get('scheduled_date')):
        try:
            await send_schedule_update_notification(
                updated_schedule['email'],
                updated_schedule['first_name'],
                datetime.fromisoformat(updated_schedule['scheduled_date'])
            )
        except Exception as e:
            print(f"Failed to send schedule update email: {e}")

    return Schedule(**updated_schedule)

@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a schedule request (admin only)"""
    # Check if schedule exists first
    existing_schedule = file_db.get_schedule_by_id(schedule_id)
    if not existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    success = file_db.delete_schedule(schedule_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete schedule"
        )

    return {"message": "Schedule deleted successfully"}

@router.post("/{schedule_id}/complete")
async def mark_schedule_complete(
    schedule_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Mark a schedule as completed (admin only)"""
    existing_schedule = file_db.get_schedule_by_id(schedule_id)
    if not existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    updated_schedule = file_db.update_schedule(schedule_id, {"status": "completed"})

    if not updated_schedule:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update schedule"
        )

    return {"message": "Schedule marked as completed", "schedule": Schedule(**updated_schedule)}

@router.post("/{schedule_id}/cancel")
async def cancel_schedule(
    schedule_id: str,
    reason: Optional[str] = None,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cancel a schedule (admin only)"""
    existing_schedule = file_db.get_schedule_by_id(schedule_id)
    if not existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )

    update_data = {"status": "cancelled"}
    if reason:
        update_data["cancellation_reason"] = reason

    updated_schedule = file_db.update_schedule(schedule_id, update_data)

    if not updated_schedule:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel schedule"
        )

    return {"message": "Schedule cancelled", "schedule": Schedule(**updated_schedule)}