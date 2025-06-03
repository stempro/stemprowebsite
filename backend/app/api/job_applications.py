# backend/app/api/job_applications.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from app.models.job_application import JobApplication, JobApplicationCreate, JobApplicationUpdate
from app.models.user import User
from app.api.auth import get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_job_application_confirmation, send_job_application_notification

router = APIRouter()

@router.post("/", response_model=JobApplication)
async def create_job_application(application: JobApplicationCreate):
    """Submit a new job application"""
    application_data = application.model_dump()

    try:
        created_application = file_db.create_job_application(application_data)

        # Send confirmation email to applicant
        try:
            await send_job_application_confirmation(
                application.email,
                application.name,
                application.position
            )
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")

        # Send notification to admin
        try:
            await send_job_application_notification(
                application.name,
                application.position,
                application.email
            )
        except Exception as e:
            print(f"Failed to send admin notification: {e}")

        return JobApplication(**created_application)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[JobApplication])
async def get_job_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None, description="Filter by status"),
    position: Optional[str] = Query(None, description="Filter by position"),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all job applications (admin only)"""
    applications = file_db.get_job_applications(skip=skip, limit=limit)

    # Apply filters
    if status:
        applications = [a for a in applications if a.get('status', 'new') == status]

    if position:
        applications = [a for a in applications if a.get('position', '').lower() == position.lower()]

    return [JobApplication(**app) for app in applications]

@router.get("/positions")
async def get_available_positions():
    """Get list of available positions"""
    return {
        "positions": [
            {
                "id": "ai-instructor",
                "title": "AI Program Instructor",
                "type": "Part-time",
                "location": "Remote"
            },
            {
                "id": "fullstack-developer",
                "title": "Full-Stack Developer",
                "type": "Contract",
                "location": "Remote"
            },
            {
                "id": "program-coordinator",
                "title": "Program Coordinator",
                "type": "Part-time",
                "location": "Remote"
            },
            {
                "id": "marketing-partner",
                "title": "Marketing Partner",
                "type": "Contract",
                "location": "Remote"
            }
        ]
    }

@router.get("/{application_id}", response_model=JobApplication)
async def get_job_application(
    application_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Get specific job application (admin only)"""
    application = file_db.get_job_application_by_id(application_id)

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application not found"
        )

    return JobApplication(**application)

@router.patch("/{application_id}", response_model=JobApplication)
async def update_job_application(
    application_id: str,
    application_update: JobApplicationUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update job application status (admin only)"""
    # Validate status if provided
    valid_statuses = ["new", "reviewing", "interviewed", "rejected", "accepted"]
    if application_update.status and application_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    update_data = application_update.model_dump(exclude_unset=True)
    updated_application = file_db.update_job_application(application_id, update_data)

    if not updated_application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application not found"
        )

    return JobApplication(**updated_application)

@router.delete("/{application_id}")
async def delete_job_application(
    application_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a job application (admin only)"""
    success = file_db.delete_job_application(application_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job application not found"
        )

    return {"message": "Job application deleted successfully"}

@router.get("/stats/summary")
async def get_application_stats(
    current_admin: User = Depends(get_current_admin_user)
):
    """Get job application statistics (admin only)"""
    all_applications = file_db.get_job_applications(skip=0, limit=10000)

    stats = {
        "total": len(all_applications),
        "by_status": {},
        "by_position": {},
        "recent_applications": []
    }

    # Calculate statistics
    for app in all_applications:
        # By status
        status = app.get('status', 'new')
        stats['by_status'][status] = stats['by_status'].get(status, 0) + 1

        # By position
        position = app.get('position', 'Unknown')
        stats['by_position'][position] = stats['by_position'].get(position, 0) + 1

    # Get 5 most recent applications
    recent = sorted(all_applications, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
    stats['recent_applications'] = [
        {
            "id": app['id'],
            "name": app['name'],
            "position": app['position'],
            "created_at": app['created_at']
        }
        for app in recent
    ]

    return stats