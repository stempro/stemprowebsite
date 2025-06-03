# backend/app/api/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from app.models.user import User, UserUpdate
from app.api.auth import get_current_user, get_current_admin_user
from app.utils.file_db import file_db

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all users (admin only)"""
    users = file_db.get_all_users(skip=skip, limit=limit)
    return [User(**user) for user in users]

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get user by ID"""
    # Users can only get their own info unless they're admin
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    user = file_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return User(**user)

@router.patch("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user information"""
    # Users can only update their own info unless they're admin
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    # Non-admins cannot update admin status
    if not current_user.is_admin and user_update.is_admin is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can grant admin privileges"
        )

    update_data = user_update.model_dump(exclude_unset=True)
    updated_user = file_db.update_user(user_id, update_data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return User(**updated_user)

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a user (admin only)"""
    # Prevent admin from deleting themselves
    if current_admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    success = file_db.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "User deleted successfully"}

@router.post("/{user_id}/make-admin")
async def make_admin(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Make a user an admin (admin only)"""
    updated_user = file_db.update_user(user_id, {"is_admin": True})

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "User is now an admin"}

@router.post("/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Toggle user active status (admin only)"""
    user = file_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    new_status = not user.get('is_active', True)
    updated_user = file_db.update_user(user_id, {"is_active": new_status})

    return {
        "message": f"User is now {'active' if new_status else 'inactive'}",
        "is_active": new_status
    }

# backend/app/api/courses.py
from fastapi import APIRouter, Depends
from typing import List

from app.models.user import User
from app.api.auth import get_current_user

router = APIRouter()

# Static course data
COURSES = [
    {
        "id": "junior-ai",
        "name": "Junior AI Program",
        "description": "AI and Programming In Action - For Middle & High School Students",
        "duration": "6 weeks (12 lesson hours)",
        "max_students": 8,
        "level": "beginner"
    },
    {
        "id": "generative-ai",
        "name": "Generative AI Program",
        "description": "Generative AI Education for Middle Graders",
        "duration": "6 weeks (12 lesson hours)",
        "max_students": 5,
        "level": "intermediate"
    },
    {
        "id": "advanced-ai",
        "name": "Advanced Generative AI Program",
        "description": "Advanced Generative AI Education for High School Students",
        "duration": "8 weeks (16 lesson hours)",
        "max_students": 5,
        "level": "advanced"
    }
]

PROGRAMS = [
    {
        "id": "college-ninja",
        "name": "CollegeNinja: Code-to-Campus",
        "description": "Master College Applications with AI & Programming",
        "duration": "Flexible",
        "max_students": 8,
        "type": "program"
    },
    {
        "id": "junior-researcher",
        "name": "Junior Researcher Program",
        "description": "High-Impact Research Mentorship",
        "duration": "Flexible",
        "max_students": 1,
        "type": "program"
    },
    {
        "id": "interview-clinic",
        "name": "Interview Clinic",
        "description": "Mastering Interviews for Internships, Jobs, and Admissions",
        "duration": "On-demand",
        "max_students": 1,
        "type": "program"
    }
]

@router.get("/")
async def get_courses():
    """Get all available courses"""
    return {"courses": COURSES, "programs": PROGRAMS}

@router.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get specific course details"""
    course = next((c for c in COURSES if c["id"] == course_id), None)
    if not course:
        return {"error": "Course not found"}
    return course

@router.get("/programs/{program_id}")
async def get_program(program_id: str):
    """Get specific program details"""
    program = next((p for p in PROGRAMS if p["id"] == program_id), None)
    if not program:
        return {"error": "Program not found"}
    return program