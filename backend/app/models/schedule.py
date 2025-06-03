from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ScheduleBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    zip_code: str
    student_type: str
    country: str
    comments: Optional[str] = None

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: str
    created_at: datetime
    status: str = "pending"  # pending, scheduled, completed

class ScheduleUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_date: Optional[datetime] = None