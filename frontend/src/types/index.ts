// frontend/src/types/index.ts
export type UserRole = 'student' | 'parent' | 'teacher' | 'visitor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country: string;
  postal_code: string;
  comments?: string;
  created_at: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  country: string;
  postal_code: string;
  comments?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordReset {
  email: string;
}

export interface PasswordResetConfirm {
  email: string;
  code: string;
  new_password: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  max_students: number;
  level?: string;
  type?: string;
}

export interface Enrollment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  course: string;
  student_type: string;
  country: string;
  comments?: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface EnrollmentCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  course: string;
  student_type: string;
  country: string;
  comments?: string;
}

export interface Schedule {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  student_type: string;
  country: string;
  comments?: string;
  created_at: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduled_date?: string;
}

export interface ScheduleCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  student_type: string;
  country: string;
  comments?: string;
}

export interface ApiError {
  detail: string;
  status?: number;
}