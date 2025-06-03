// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('username', email); // OAuth2PasswordRequestForm expects username
          formData.append('password', password);

          const response = await axios.post('/api/auth/login', formData);
          const { access_token } = response.data;

          // Set token in axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          // Get user info
          const userResponse = await axios.get('/api/auth/me');

          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/auth/register', userData);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch (error) {
          get().logout();
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// frontend/src/store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isLoading: false,
  notification: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  showNotification: (type, message) => {
    set({ notification: { type, message } });
    // Auto clear after 5 seconds
    setTimeout(() => {
      set({ notification: null });
    }, 5000);
  },

  clearNotification: () => set({ notification: null }),
}));

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