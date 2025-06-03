# backend/app/api/enrollments.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from app.models.enrollment import Enrollment, EnrollmentCreate, EnrollmentUpdate
from app.models.user import User
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db
from app.utils.email import send_enrollment_confirmation

router = APIRouter()

# Valid courses list
VALID_COURSES = [
    "Junior AI Program",
    "Generative AI Program",
    "Advanced Generative AI Program",
    "CollegeNinja",
    "High School Research Program",
    "Interview Clinic",
    "Music AI Research Program"
]

# Valid student types
VALID_STUDENT_TYPES = ["HStudent", "MStudent", "CStudent", "Parent", "Career", "Other"]

# Valid countries
VALID_COUNTRIES = ["USA", "Canada", "Other"]

@router.post("/", response_model=Enrollment)
async def create_enrollment(enrollment: EnrollmentCreate):
    """Create a new course enrollment"""

    # Log incoming data for debugging
    print(f"Received enrollment data: {enrollment.model_dump()}")

    # Validate course
    if enrollment.course not in VALID_COURSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid course. Must be one of: {', '.join(VALID_COURSES)}"
        )

    # Validate student type
    if enrollment.student_type not in VALID_STUDENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid student type. Must be one of: {', '.join(VALID_STUDENT_TYPES)}"
        )

    # Validate country
    if enrollment.country not in VALID_COUNTRIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid country. Must be one of: {', '.join(VALID_COUNTRIES)}"
        )

    # Validate email format
    if not enrollment.email or '@' not in enrollment.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address"
        )

    # Clean the data
    enrollment_data = enrollment.model_dump()
    enrollment_data['email'] = enrollment_data['email'].lower().strip()
    enrollment_data['first_name'] = enrollment_data['first_name'].strip()
    enrollment_data['last_name'] = enrollment_data['last_name'].strip()
    enrollment_data['phone'] = enrollment_data['phone'].strip()
    enrollment_data['zip_code'] = enrollment_data['zip_code'].strip()

    # Handle optional comments field
    if 'comments' in enrollment_data and enrollment_data['comments']:
        enrollment_data['comments'] = enrollment_data['comments'].strip()
    else:
        enrollment_data['comments'] = ''

    # Add timestamp if not present
    if 'created_at' not in enrollment_data:
        enrollment_data['created_at'] = datetime.utcnow().isoformat()

    # Set default status
    if 'status' not in enrollment_data:
        enrollment_data['status'] = 'pending'

    try:
        # Check if email already enrolled for this course
        try:
            existing_enrollments = file_db.get_enrollments()
            if existing_enrollments:  # Check if list is not empty
                for existing in existing_enrollments:
                    if (existing.get('email', '').lower() == enrollment_data['email'] and
                        existing.get('course') == enrollment_data['course']):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"This email is already registered for {enrollment_data['course']}"
                        )
        except AttributeError as e:
            # Handle case where file_db might not be properly initialized
            print(f"Warning: Could not check existing enrollments: {e}")
            # Continue with enrollment creation

        # Create the enrollment
        created_enrollment = file_db.create_enrollment(enrollment_data)

        if not created_enrollment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create enrollment"
            )

        # Send confirmation email (don't fail if email fails)
        try:
            await send_enrollment_confirmation(
                enrollment.email,
                enrollment.first_name,
                enrollment.course
            )
        except Exception as e:
            print(f"Failed to send enrollment email: {e}")
            # Don't fail the enrollment if email fails

        return Enrollment(**created_enrollment)

    except HTTPException:
        raise
    except AttributeError as e:
        # This is likely where the 'str' object has no attribute 'exists' error comes from
        print(f"AttributeError in enrollment creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database configuration error. Please contact support."
        )
    except Exception as e:
        print(f"Error creating enrollment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create enrollment: {str(e)}"
        )

@router.get("/", response_model=List[Enrollment])
async def get_enrollments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all enrollments (admin only)"""
    try:
        enrollments = file_db.get_enrollments(skip=skip, limit=limit)
        if not enrollments:
            return []
        return [Enrollment(**enrollment) for enrollment in enrollments]
    except Exception as e:
        print(f"Error getting enrollments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve enrollments"
        )

@router.get("/my", response_model=List[Enrollment])
async def get_my_enrollments(
    current_user: User = Depends(get_current_user)
):
    """Get current user's enrollments"""
    try:
        all_enrollments = file_db.get_enrollments()
        if not all_enrollments:
            return []
        user_enrollments = [
            e for e in all_enrollments
            if e.get('email', '').lower() == current_user.email.lower()
        ]
        return [Enrollment(**enrollment) for enrollment in user_enrollments]
    except Exception as e:
        print(f"Error getting user enrollments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve enrollments"
        )

@router.get("/{enrollment_id}", response_model=Enrollment)
async def get_enrollment(
    enrollment_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get enrollment by ID"""
    try:
        enrollment = file_db.get_enrollment_by_id(enrollment_id)

        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrollment not found"
            )

        # Check permissions
        if not current_user.is_admin and enrollment.get('email', '').lower() != current_user.email.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )

        return Enrollment(**enrollment)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting enrollment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve enrollment"
        )

@router.patch("/{enrollment_id}", response_model=Enrollment)
async def update_enrollment(
    enrollment_id: str,
    enrollment_update: EnrollmentUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update enrollment status (admin only)"""
    try:
        update_data = enrollment_update.model_dump(exclude_unset=True)

        # Validate status if provided
        if 'status' in update_data and update_data['status'] not in ['pending', 'confirmed', 'completed', 'cancelled']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be one of: pending, confirmed, completed, cancelled"
            )

        updated_enrollment = file_db.update_enrollment(enrollment_id, update_data)

        if not updated_enrollment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Enrollment not found"
            )

        return Enrollment(**updated_enrollment)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating enrollment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update enrollment"
        )