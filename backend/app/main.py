# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from pathlib import Path

from app.api import auth, users, courses, enrollments, schedules
from app.core.config import settings
from app.utils.file_db import FileDB

# Initialize file database
file_db = FileDB()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    file_db.initialize_files()
    yield
    # Shutdown
    print("Shutting down...")

app = FastAPI(
    title="StemPro Academy API",
    description="Modern API for StemPro Academy",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(enrollments.router, prefix="/api/enrollments", tags=["enrollments"])
app.include_router(schedules.router, prefix="/api/schedules", tags=["schedules"])

# Serve static files in production
if settings.ENVIRONMENT == "production":
    static_path = Path(__file__).parent.parent / "static"
    if static_path.exists():
        app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}