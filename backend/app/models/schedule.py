# backend/app/models/schedule.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ScheduleBase(BaseModel):
    """Base schedule model with common fields"""
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    country: Optional[str] = None
    service_type: Optional[str] = None
    message: Optional[str] = ""

class ScheduleCreate(ScheduleBase):
    """Model for creating a new schedule"""
    pass

class ScheduleUpdate(BaseModel):
    """Model for updating a schedule"""
    status: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    notes: Optional[str] = None

class Schedule(ScheduleBase):
    """Complete schedule model with all fields"""
    id: str
    status: str = "pending"
    created_at: str
    updated_at: Optional[str] = None
    scheduled_date: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True