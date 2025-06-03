# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
import random
from typing import Optional

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token
from app.models.user import UserCreate, UserLogin, User, Token, PasswordReset, PasswordResetConfirm
from app.utils.file_db import file_db
from app.utils.email import send_reset_code_email, send_password_reset_confirmation

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = file_db.get_user_by_email(email)
    if user is None:
        raise credentials_exception

    return User(**user)

async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current admin user"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

@router.post("/register", response_model=User)
async def register(user_create: UserCreate):
    """Register a new user"""
    # Check if email exists
    existing_user = file_db.get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user_data = user_create.model_dump()
    password = user_data.pop('password')
    user_data['password_hash'] = get_password_hash(password)

    try:
        created_user = file_db.create_user(user_data)
        return User(**created_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login with email and password"""
    user = file_db.get_user_by_email(form_data.username)  # username field contains email

    if not user or not verify_password(form_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get('is_active', True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@router.post("/check-email")
async def check_email(email: str):
    """Check if email is already registered"""
    user = file_db.get_user_by_email(email)
    return {"email_taken": user is not None}

@router.post("/password-reset")
async def request_password_reset(reset_request: PasswordReset):
    """Request password reset code"""
    user = file_db.get_user_by_email(reset_request.email)

    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset code will be sent"}

    # Generate 6-digit code
    code = f"{random.randint(100000, 999999)}"
    expiration = datetime.now(timezone.utc) + timedelta(minutes=settings.RESET_CODE_EXPIRE_MINUTES)

    # Save code
    file_db.save_reset_code(reset_request.email, code, expiration.isoformat())

    # Send email (implement based on your email service)
    try:
        await send_reset_code_email(reset_request.email, code)
    except Exception as e:
        print(f"Failed to send email: {e}")

    return {"message": "Reset code sent to email"}

@router.post("/password-reset-confirm")
async def confirm_password_reset(reset_confirm: PasswordResetConfirm):
    """Confirm password reset with code"""
    # Get stored code
    stored_code_data = file_db.get_reset_code(reset_confirm.email)

    if not stored_code_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code"
        )

    # Check expiration
    expiration = datetime.fromisoformat(stored_code_data['expiration'])
    if datetime.now(timezone.utc) > expiration:
        file_db.delete_reset_code(reset_confirm.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code has expired"
        )

    # Check code
    if stored_code_data['code'] != reset_confirm.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset code"
        )

    # Update password
    user = file_db.get_user_by_email(reset_confirm.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )

    new_password_hash = get_password_hash(reset_confirm.new_password)
    file_db.update_user(user['id'], {'password_hash': new_password_hash})

    # Delete used code
    file_db.delete_reset_code(reset_confirm.email)

    # Send confirmation email
    try:
        await send_password_reset_confirmation(reset_confirm.email)
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")

    return {"message": "Password reset successful"}

@router.post("/verify-code")
async def verify_reset_code(email: str, code: str):
    """Verify if reset code is valid"""
    stored_code_data = file_db.get_reset_code(email)

    if not stored_code_data:
        return {"valid": False}

    # Check expiration
    expiration = datetime.fromisoformat(stored_code_data['expiration'])
    if datetime.now(timezone.utc) > expiration:
        return {"valid": False}

    # Check code
    return {"valid": stored_code_data['code'] == code}