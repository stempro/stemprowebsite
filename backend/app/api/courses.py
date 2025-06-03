from fastapi import APIRouter

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
    }
]

@router.get("/")
async def get_courses():
    """Get all available courses"""
    return {"courses": COURSES, "programs": []}