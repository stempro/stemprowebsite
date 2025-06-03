from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class CollegeNinjaStudentBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    zipCode: str
    currentSchool: str
    gradeLevel: str

class CollegeNinjaStudentCreate(CollegeNinjaStudentBase):
    pass

class CollegeNinjaStudent(CollegeNinjaStudentBase):
    id: str
    created_at: datetime
    status: str = "pending"  # pending, contacted, enrolled

class CollegeNinjaCounselorBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    zipCode: str

class CollegeNinjaCounselorCreate(CollegeNinjaCounselorBase):
    pass

class CollegeNinjaCounselor(CollegeNinjaCounselorBase):
    id: str
    created_at: datetime
    status: str = "pending"  # pending, contacted, partner