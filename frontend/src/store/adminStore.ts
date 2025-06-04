// frontend/src/store/adminStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { User, Enrollment, Schedule } from '@/types';

interface AdminState {
  users: User[];
  enrollments: Enrollment[];
  schedules: Schedule[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  fetchEnrollments: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;
  makeUserAdmin: (userId: string) => Promise<void>;
  updateEnrollment: (enrollmentId: string, data: any) => Promise<void>;
  updateSchedule: (scheduleId: string, data: any) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  enrollments: [],
  schedules: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/users');
      set({ users: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchEnrollments: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/enrollments');
      set({ enrollments: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchSchedules: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/api/schedules');
      set({ schedules: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const response = await axios.patch(`/api/users/${userId}`, data);
    const updatedUser = response.data;
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? updatedUser : user
      ),
    }));
  },

  deleteUser: async (userId: string) => {
    await axios.delete(`/api/users/${userId}`);
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    }));
  },

  toggleUserActive: async (userId: string) => {
    const response = await axios.post(`/api/users/${userId}/toggle-active`);
    const { is_active } = response.data;
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, is_active } : user
      ),
    }));
  },

  makeUserAdmin: async (userId: string) => {
    await axios.post(`/api/users/${userId}/make-admin`);
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, is_admin: true } : user
      ),
    }));
  },

  updateEnrollment: async (enrollmentId: string, data: any) => {
    const response = await axios.patch(`/api/enrollments/${enrollmentId}`, data);
    const updatedEnrollment = response.data;
    set((state) => ({
      enrollments: state.enrollments.map((enrollment) =>
        enrollment.id === enrollmentId ? updatedEnrollment : enrollment
      ),
    }));
  },

  updateSchedule: async (scheduleId: string, data: any) => {
    const response = await axios.patch(`/api/schedules/${scheduleId}`, data);
    const updatedSchedule = response.data;
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId ? updatedSchedule : schedule
      ),
    }));
  },
}));