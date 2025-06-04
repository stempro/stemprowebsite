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
