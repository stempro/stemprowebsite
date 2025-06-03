# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "StemPro Academy"
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESET_CODE_EXPIRE_MINUTES: int = 15

    # Database
    DATA_DIR: str = "./data"

    # Email
    MAILGUN_API_KEY: Optional[str] = None
    MAILGUN_DOMAIN: Optional[str] = None

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()

# backend/app/core/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

# backend/app/models/user.py
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

# backend/app/models/enrollment.py
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

# backend/app/models/schedule.py
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