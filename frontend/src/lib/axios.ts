// frontend/src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// frontend/src/services/api.ts
import axios from '@/lib/axios';
import {
  UserCreate,
  LoginCredentials,
  PasswordReset,
  PasswordResetConfirm,
  EnrollmentCreate,
  ScheduleCreate,
} from '@/types';

export const authApi = {
  register: (data: UserCreate) => axios.post('/api/auth/register', data),
  login: (data: LoginCredentials) => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    return axios.post('/api/auth/login', formData);
  },
  checkEmail: (email: string) => axios.post('/api/auth/check-email', null, { params: { email } }),
  getMe: () => axios.get('/api/auth/me'),
  requestPasswordReset: (data: PasswordReset) => axios.post('/api/auth/password-reset', data),
  confirmPasswordReset: (data: PasswordResetConfirm) => axios.post('/api/auth/password-reset-confirm', data),
  verifyCode: (email: string, code: string) => axios.post('/api/auth/verify-code', null, { params: { email, code } }),
};

export const usersApi = {
  getAll: () => axios.get('/api/users'),
  getById: (id: string) => axios.get(`/api/users/${id}`),
  update: (id: string, data: any) => axios.patch(`/api/users/${id}`, data),
  delete: (id: string) => axios.delete(`/api/users/${id}`),
  toggleActive: (id: string) => axios.post(`/api/users/${id}/toggle-active`),
  makeAdmin: (id: string) => axios.post(`/api/users/${id}/make-admin`),
};

export const coursesApi = {
  getAll: () => axios.get('/api/courses'),
  getCourse: (id: string) => axios.get(`/api/courses/courses/${id}`),
  getProgram: (id: string) => axios.get(`/api/courses/programs/${id}`),
};

export const enrollmentsApi = {
  create: (data: EnrollmentCreate) => axios.post('/api/enrollments', data),
  getAll: () => axios.get('/api/enrollments'),
  getMy: () => axios.get('/api/enrollments/my'),
  getById: (id: string) => axios.get(`/api/enrollments/${id}`),
  update: (id: string, data: any) => axios.patch(`/api/enrollments/${id}`, data),
};

export const schedulesApi = {
  create: (data: ScheduleCreate) => axios.post('/api/schedules', data),
  getAll: () => axios.get('/api/schedules'),
  getMy: () => axios.get('/api/schedules/my'),
  getById: (id: string) => axios.get(`/api/schedules/${id}`),
  update: (id: string, data: any) => axios.patch(`/api/schedules/${id}`, data),
};

// frontend/src/lib/utils.ts
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getErrorMessage(error: any): string {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}