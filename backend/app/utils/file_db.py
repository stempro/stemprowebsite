# backend/app/utils/file_db.py
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid
from datetime import datetime
from contextlib import contextmanager
import sys
import time

class FileDB:
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)

        # Define file paths
        self.users_file = self.data_dir / "users.json"
        self.enrollments_file = self.data_dir / "enrollments.json"
        self.schedules_file = self.data_dir / "schedules.json"
        self.reset_codes_file = self.data_dir / "reset_codes.json"

    def initialize_files(self):
        """Initialize JSON files if they don't exist"""
        files = [
            (self.users_file, []),
            (self.enrollments_file, []),
            (self.schedules_file, []),
            (self.reset_codes_file, {})
        ]

        for file_path, default_content in files:
            if not file_path.exists():
                self._write_json(file_path, default_content)

    @contextmanager
    def _file_lock(self, file_path: Path):
        """Context manager for file locking - Windows compatible"""
        # For Windows, we'll use a simple lock file approach
        lock_file = Path(str(file_path) + '.lock')

        # Try to acquire lock
        max_attempts = 50
        attempt = 0

        while attempt < max_attempts:
            try:
                # Try to create lock file exclusively
                lock_fd = os.open(str(lock_file), os.O_CREAT | os.O_EXCL | os.O_RDWR)
                os.close(lock_fd)
                break
            except FileExistsError:
                # Lock file exists, wait and retry
                time.sleep(0.1)
                attempt += 1
        else:
            # Could not acquire lock after max attempts
            raise TimeoutError(f"Could not acquire lock for {file_path}")

        try:
            # Open and yield the actual file
            with open(file_path, 'r+', encoding='utf-8') as f:
                yield f
        finally:
            # Release lock by removing lock file
            try:
                os.remove(lock_file)
            except:
                pass

    def _read_json(self, file_path: Path) -> Any:
        """Read JSON file with locking"""
        if not file_path.exists():
            # Return default empty structure
            if "users" in str(file_path) or "enrollments" in str(file_path) or "schedules" in str(file_path):
                return []
            else:
                return {}

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                return json.loads(content) if content else []
        except (json.JSONDecodeError, FileNotFoundError):
            # Return default empty structure if file is corrupted or missing
            if "users" in str(file_path) or "enrollments" in str(file_path) or "schedules" in str(file_path):
                return []
            else:
                return {}

    def _write_json(self, file_path: Path, data: Any) -> None:
        """Write JSON file with locking"""
        # Create a temporary file first
        temp_file = Path(str(file_path) + '.tmp')

        # Write to temporary file
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)

        # Atomic rename (as atomic as possible on Windows)
        if sys.platform == 'win32':
            # On Windows, remove the target file first if it exists
            if file_path.exists():
                os.remove(file_path)

        os.rename(temp_file, file_path)

    # User operations
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        users = self._read_json(self.users_file)

        # Check if email already exists
        if any(u['email'].lower() == user_data['email'].lower() for u in users):
            raise ValueError("Email already exists")

        # Add user data
        user_data['id'] = str(uuid.uuid4())
        user_data['created_at'] = datetime.utcnow().isoformat()
        user_data['is_active'] = True
        user_data['is_admin'] = False

        users.append(user_data)
        self._write_json(self.users_file, users)

        return user_data

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        users = self._read_json(self.users_file)
        for user in users:
            if user['email'].lower() == email.lower():
                return user
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        users = self._read_json(self.users_file)
        for user in users:
            if user['id'] == user_id:
                return user
        return None

    def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user data"""
        users = self._read_json(self.users_file)

        for i, user in enumerate(users):
            if user['id'] == user_id:
                users[i].update(update_data)
                self._write_json(self.users_file, users)
                return users[i]

        return None

    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all users with pagination"""
        users = self._read_json(self.users_file)
        return users[skip:skip + limit]

    def delete_user(self, user_id: str) -> bool:
        """Delete a user"""
        users = self._read_json(self.users_file)
        original_length = len(users)
        users = [u for u in users if u['id'] != user_id]

        if len(users) < original_length:
            self._write_json(self.users_file, users)
            return True
        return False

    # Enrollment operations
    def create_enrollment(self, enrollment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new enrollment"""
        enrollments = self._read_json(self.enrollments_file)

        enrollment_data['id'] = str(uuid.uuid4())
        enrollment_data['created_at'] = datetime.utcnow().isoformat()
        enrollment_data['status'] = 'pending'

        enrollments.append(enrollment_data)
        self._write_json(self.enrollments_file, enrollments)

        return enrollment_data

    def get_enrollments(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all enrollments with pagination"""
        enrollments = self._read_json(self.enrollments_file)
        return enrollments[skip:skip + limit]

    def get_enrollment_by_id(self, enrollment_id: str) -> Optional[Dict[str, Any]]:
        """Get enrollment by ID"""
        enrollments = self._read_json(self.enrollments_file)
        for enrollment in enrollments:
            if enrollment['id'] == enrollment_id:
                return enrollment
        return None

    def update_enrollment(self, enrollment_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update enrollment data"""
        enrollments = self._read_json(self.enrollments_file)

        for i, enrollment in enumerate(enrollments):
            if enrollment['id'] == enrollment_id:
                enrollments[i].update(update_data)
                self._write_json(self.enrollments_file, enrollments)
                return enrollments[i]

        return None

    # Schedule operations
    def create_schedule(self, schedule_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new schedule"""
        schedules = self._read_json(self.schedules_file)

        schedule_data['id'] = str(uuid.uuid4())
        schedule_data['created_at'] = datetime.utcnow().isoformat()
        schedule_data['status'] = 'pending'

        schedules.append(schedule_data)
        self._write_json(self.schedules_file, schedules)

        return schedule_data

    def get_schedules(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all schedules with pagination"""
        schedules = self._read_json(self.schedules_file)
        return schedules[skip:skip + limit]

    def get_schedule_by_id(self, schedule_id: str) -> Optional[Dict[str, Any]]:
        """Get schedule by ID"""
        schedules = self._read_json(self.schedules_file)
        for schedule in schedules:
            if schedule['id'] == schedule_id:
                return schedule
        return None

    def update_schedule(self, schedule_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update schedule data"""
        schedules = self._read_json(self.schedules_file)

        for i, schedule in enumerate(schedules):
            if schedule['id'] == schedule_id:
                schedules[i].update(update_data)
                self._write_json(self.schedules_file, schedules)
                return schedules[i]

        return None

    # Reset code operations
    def save_reset_code(self, email: str, code: str, expiration: str) -> None:
        """Save password reset code"""
        reset_codes = self._read_json(self.reset_codes_file)
        reset_codes[email.lower()] = {
            'code': code,
            'expiration': expiration
        }
        self._write_json(self.reset_codes_file, reset_codes)

    def get_reset_code(self, email: str) -> Optional[Dict[str, str]]:
        """Get reset code for email"""
        reset_codes = self._read_json(self.reset_codes_file)
        return reset_codes.get(email.lower())

    def delete_reset_code(self, email: str) -> None:
        """Delete reset code after use"""
        reset_codes = self._read_json(self.reset_codes_file)
        if email.lower() in reset_codes:
            del reset_codes[email.lower()]
            self._write_json(self.reset_codes_file, reset_codes)

# Add these methods to your existing file_db.py FileDB class

def create_schedule(self, schedule_data: dict) -> dict:
    """Create a new schedule"""
    schedules = self._read_json('schedules.json')

    # Generate unique ID
    schedule_id = f"sch_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"

    # Create schedule record
    schedule = {
        'id': schedule_id,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat(),
        'status': 'pending',
        'scheduled_date': None,
        **schedule_data
    }

    schedules['schedules'].append(schedule)
    self._write_json('schedules.json', schedules)

    return schedule

def get_schedules(self, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get all schedules with pagination"""
    schedules = self._read_json('schedules.json')

    # Sort by created_at descending (newest first)
    sorted_schedules = sorted(
        schedules.get('schedules', []),
        key=lambda x: x.get('created_at', ''),
        reverse=True
    )

    # Apply pagination
    return sorted_schedules[skip:skip + limit]

def get_schedule_by_id(self, schedule_id: str) -> Optional[dict]:
    """Get schedule by ID"""
    schedules = self._read_json('schedules.json')

    for schedule in schedules.get('schedules', []):
        if schedule['id'] == schedule_id:
            return schedule

    return None

def update_schedule(self, schedule_id: str, update_data: dict) -> Optional[dict]:
    """Update schedule"""
    schedules = self._read_json('schedules.json')

    for i, schedule in enumerate(schedules.get('schedules', [])):
        if schedule['id'] == schedule_id:
            # Update fields
            schedules['schedules'][i].update(update_data)
            schedules['schedules'][i]['updated_at'] = datetime.now(timezone.utc).isoformat()

            self._write_json('schedules.json', schedules)
            return schedules['schedules'][i]

    return None

def delete_schedule(self, schedule_id: str) -> bool:
    """Delete schedule"""
    schedules = self._read_json('schedules.json')

    original_count = len(schedules.get('schedules', []))
    schedules['schedules'] = [
        s for s in schedules.get('schedules', [])
        if s['id'] != schedule_id
    ]

    if len(schedules['schedules']) < original_count:
        self._write_json('schedules.json', schedules)
        return True

    return False

def get_schedules_by_email(self, email: str) -> List[dict]:
    """Get all schedules for a specific email"""
    schedules = self._read_json('schedules.json')

    user_schedules = [
        s for s in schedules.get('schedules', [])
        if s.get('email', '').lower() == email.lower()
    ]

    # Sort by created_at descending
    return sorted(
        user_schedules,
        key=lambda x: x.get('created_at', ''),
        reverse=True
    )

# Global instance
file_db = FileDB()