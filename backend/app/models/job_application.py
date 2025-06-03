from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class JobApplicationBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    position: str
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: str
    created_at: datetime
    status: str = "new"  # new, reviewing, interviewed, rejected, accepted
    notes: Optional[str] = None

class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None