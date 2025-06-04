import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface UseAuthOptions {
  redirectTo?: string;
  requireAdmin?: boolean;
}

export function useAuth(options?: UseAuthOptions) {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && options?.redirectTo) {
      router.push(options.redirectTo);
    }

    if (options?.requireAdmin && isAuthenticated && !user?.is_admin) {
      router.push('/');
    }
  }, [isAuthenticated, user, router, options]);

  return { user, isAuthenticated, isAdmin: user?.is_admin || false };
}