from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EnrollmentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    zip_code: str
    course: str
    student_type: str
    country: str
    comments: Optional[str] = None

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: str
    created_at: datetime
    status: str = "pending"  # pending, confirmed, completed

class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None