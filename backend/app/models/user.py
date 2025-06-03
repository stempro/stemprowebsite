from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    STUDENT = "student"
    PARENT = "parent"
    TEACHER = "teacher"
    VISITOR = "visitor"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole
    country: str
    postal_code: str
    comments: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: str
    password_hash: str
    created_at: datetime
    is_active: bool = True
    is_admin: bool = False

class User(UserBase):
    id: str
    created_at: datetime
    is_active: bool
    is_admin: bool

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    comments: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str = Field(..., min_length=8)