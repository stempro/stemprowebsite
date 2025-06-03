# backend/app/api/schedules.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from app.models.schedule import Schedule, ScheduleCreate, ScheduleUpdate
from app.models.user import User
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_schedule_confirmation

router = APIRouter()

@router.post("/")
async def create_schedule(schedule: ScheduleCreate):
    """Create a new consultation schedule request"""

    try:
        # Log incoming data for debugging
        print(f"Received schedule data: {schedule.model_dump()}")

        # Convert to dict
        schedule_data = schedule.model_dump()

        # Ensure all fields have values (even if empty strings)
        # This ensures the created record has all fields the Schedule model expects
        schedule_data['email'] = schedule_data.get('email', '').lower().strip()
        schedule_data['first_name'] = schedule_data.get('first_name', '').strip()
        schedule_data['last_name'] = schedule_data.get('last_name', '').strip()
        schedule_data['phone'] = schedule_data.get('phone', '').strip()
        schedule_data['zip_code'] = schedule_data.get('zip_code', '').strip()
        schedule_data['country'] = schedule_data.get('country', '')
        schedule_data['service_type'] = schedule_data.get('service_type', '')
        schedule_data['student_type'] = schedule_data.get('student_type', '')
        schedule_data['message'] = schedule_data.get('message', '').strip()

        print(f"Cleaned schedule data: {schedule_data}")

        # Create the schedule using file_db
        created_schedule = file_db.create_schedule(schedule_data)

        if not created_schedule:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create schedule - no data returned"
            )

        print(f"Created schedule from file_db: {created_schedule}")

        # Send confirmation email (optional - don't fail if it doesn't work)
        try:
            await send_schedule_confirmation(
                created_schedule.get('email', ''),
                created_schedule.get('first_name', '')
            )
            print("Confirmation email sent successfully")
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")
            # Continue anyway - email is not critical

        # Ensure the response has ALL fields required by the Schedule model
        # This is important because the Schedule model validation happens here
        response_data = {
            'id': created_schedule.get('id', str(uuid.uuid4())),
            'first_name': created_schedule.get('first_name', ''),
            'last_name': created_schedule.get('last_name', ''),
            'email': created_schedule.get('email', ''),
            'phone': created_schedule.get('phone', ''),
            'zip_code': created_schedule.get('zip_code', ''),  # ENSURE THIS FIELD EXISTS
            'country': created_schedule.get('country', ''),
            'service_type': created_schedule.get('service_type', ''),
            'student_type': created_schedule.get('student_type', ''),  # ENSURE THIS FIELD EXISTS
            'message': created_schedule.get('message', ''),
            'status': created_schedule.get('status', 'pending'),
            'created_at': created_schedule.get('created_at', datetime.utcnow().isoformat()),
            'updated_at': created_schedule.get('updated_at', created_schedule.get('created_at', datetime.utcnow().isoformat())),
            'scheduled_date': created_schedule.get('scheduled_date'),
            'notes': created_schedule.get('notes', '')
        }

        print(f"Response data being sent: {response_data}")

        # Return a dict, not a Schedule object - FastAPI will handle the conversion
        return response_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in create_schedule: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

@router.get("/", response_model=List[Schedule])
async def get_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all schedule requests (admin only)"""
    try:
        schedules = file_db.get_schedules(skip=skip, limit=limit)
        if not schedules:
            return []

        # Ensure each schedule has all required fields
        validated_schedules = []
        for schedule in schedules:
            validated_schedule = {
                'id': schedule.get('id', ''),
                'first_name': schedule.get('first_name', ''),
                'last_name': schedule.get('last_name', ''),
                'email': schedule.get('email', ''),
                'phone': schedule.get('phone', ''),
                'zip_code': schedule.get('zip_code', ''),
                'country': schedule.get('country', ''),
                'service_type': schedule.get('service_type', ''),
                'student_type': schedule.get('student_type', ''),
                'message': schedule.get('message', ''),
                'status': schedule.get('status', 'pending'),
                'created_at': schedule.get('created_at', ''),
                'updated_at': schedule.get('updated_at'),
                'scheduled_date': schedule.get('scheduled_date'),
                'notes': schedule.get('notes', '')
            }
            validated_schedules.append(validated_schedule)

        return validated_schedules
    except Exception as e:
        print(f"Error getting schedules: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve schedules"
        )

@router.get("/my", response_model=List[Schedule])
async def get_my_schedules(
    current_user: User = Depends(get_current_user)
):
    """Get current user's schedule requests"""
    try:
        all_schedules = file_db.get_schedules()
        if not all_schedules:
            return []

        user_schedules = []
        for s in all_schedules:
            if s.get('email', '').lower() == current_user.email.lower():
                # Ensure all required fields
                validated_schedule = {
                    'id': s.get('id', ''),
                    'first_name': s.get('first_name', ''),
                    'last_name': s.get('last_name', ''),
                    'email': s.get('email', ''),
                    'phone': s.get('phone', ''),
                    'zip_code': s.get('zip_code', ''),
                    'country': s.get('country', ''),
                    'service_type': s.get('service_type', ''),
                    'student_type': s.get('student_type', ''),
                    'message': s.get('message', ''),
                    'status': s.get('status', 'pending'),
                    'created_at': s.get('created_at', ''),
                    'updated_at': s.get('updated_at'),
                    'scheduled_date': s.get('scheduled_date'),
                    'notes': s.get('notes', '')
                }
                user_schedules.append(validated_schedule)

        return user_schedules
    except Exception as e:
        print(f"Error getting user schedules: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve schedules"
        )

@router.get("/{schedule_id}", response_model=Schedule)
async def get_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get schedule by ID"""
    try:
        schedule = file_db.get_schedule_by_id(schedule_id)

        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Schedule not found"
            )

        # Check permissions
        if not current_user.is_admin and schedule.get('email', '').lower() != current_user.email.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )

        # Ensure all required fields
        validated_schedule = {
            'id': schedule.get('id', ''),
            'first_name': schedule.get('first_name', ''),
            'last_name': schedule.get('last_name', ''),
            'email': schedule.get('email', ''),
            'phone': schedule.get('phone', ''),
            'zip_code': schedule.get('zip_code', ''),
            'country': schedule.get('country', ''),
            'service_type': schedule.get('service_type', ''),
            'student_type': schedule.get('student_type', ''),
            'message': schedule.get('message', ''),
            'status': schedule.get('status', 'pending'),
            'created_at': schedule.get('created_at', ''),
            'updated_at': schedule.get('updated_at'),
            'scheduled_date': schedule.get('scheduled_date'),
            'notes': schedule.get('notes', '')
        }

        return validated_schedule
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting schedule: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve schedule"
        )

@router.patch("/{schedule_id}", response_model=Schedule)
async def update_schedule(
    schedule_id: str,
    schedule_update: ScheduleUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update schedule status and details (admin only)"""
    try:
        update_data = schedule_update.model_dump(exclude_unset=True)

        # Convert datetime to ISO format if present
        if 'scheduled_date' in update_data and update_data['scheduled_date']:
            update_data['scheduled_date'] = update_data['scheduled_date'].isoformat()

        # Validate status if provided
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

        # Ensure all required fields
        validated_schedule = {
            'id': updated_schedule.get('id', ''),
            'first_name': updated_schedule.get('first_name', ''),
            'last_name': updated_schedule.get('last_name', ''),
            'email': updated_schedule.get('email', ''),
            'phone': updated_schedule.get('phone', ''),
            'zip_code': updated_schedule.get('zip_code', ''),
            'country': updated_schedule.get('country', ''),
            'service_type': updated_schedule.get('service_type', ''),
            'student_type': updated_schedule.get('student_type', ''),
            'message': updated_schedule.get('message', ''),
            'status': updated_schedule.get('status', 'pending'),
            'created_at': updated_schedule.get('created_at', ''),
            'updated_at': updated_schedule.get('updated_at'),
            'scheduled_date': updated_schedule.get('scheduled_date'),
            'notes': updated_schedule.get('notes', '')
        }

        return validated_schedule
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating schedule: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update schedule"
        )