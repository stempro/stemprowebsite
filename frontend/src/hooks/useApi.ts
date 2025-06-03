// frontend/src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T }>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const response = await apiFunction(...args);
        const data = response.data;
        setState({ data, error: null, isLoading: false });
        return data;
      } catch (error) {
        const errorMessage =
          (error as AxiosError<ApiError>)?.response?.data?.detail ||
          (error as Error)?.message ||
          'An unexpected error occurred';

        setState({ data: null, error: errorMessage, isLoading: false });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, execute, reset };
}

// frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// frontend/src/hooks/usePagination.ts
import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + itemsPerPage, totalItems),
    [startIndex, itemsPerPage, totalItems]
  );

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    isFirstPage,
    isLastPage,
  };
}

// frontend/src/hooks/useToastNotification.ts
import { useToast, UseToastOptions } from '@chakra-ui/react';
import { useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export function useToastNotification() {
  const toast = useToast();

  const showSuccess = useCallback(
    ({ title, description, duration = 3000 }: ToastOptions) => {
      toast({
        title,
        description,
        status: 'success',
        duration,
        isClosable: true,
        position: 'top-right',
      });
    },
    [toast]
  );

  const showError = useCallback(
    ({ title, description, duration = 5000 }: ToastOptions) => {
      toast({
        title,
        description,
        status: 'error',
        duration,
        isClosable: true,
        position: 'top-right',
      });
    },
    [toast]
  );

  const showWarning = useCallback(
    ({ title, description, duration = 4000 }: ToastOptions) => {
      toast({
        title,
        description,
        status: 'warning',
        duration,
        isClosable: true,
        position: 'top-right',
      });
    },
    [toast]
  );

  const showInfo = useCallback(
    ({ title, description, duration = 3000 }: ToastOptions) => {
      toast({
        title,
        description,
        status: 'info',
        duration,
        isClosable: true,
        position: 'top-right',
      });
    },
    [toast]
  );

  return { showSuccess, showError, showWarning, showInfo };
}

// frontend/src/hooks/useAuth.ts
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

// frontend/src/hooks/useFormPersist.ts
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFormPersistProps<T> {
  form: UseFormReturn<T>;
  storageKey: string;
  exclude?: (keyof T)[];
}

export function useFormPersist<T>({
  form,
  storageKey,
  exclude = [],
}: UseFormPersistProps<T>) {
  const { watch, setValue } = form;
  const watchedValues = watch();

  // Save form data to sessionStorage
  useEffect(() => {
    const subscription = watch((values) => {
      const valuesToStore = { ...values };

      // Remove excluded fields
      exclude.forEach((field) => {
        delete valuesToStore[field];
      });

      sessionStorage.setItem(storageKey, JSON.stringify(valuesToStore));
    });

    return () => subscription.unsubscribe();
  }, [watch, storageKey, exclude]);

  // Load form data from sessionStorage on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem(storageKey);

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        Object.entries(parsedData).forEach(([key, value]) => {
          if (!exclude.includes(key as keyof T)) {
            setValue(key as any, value as any);
          }
        });
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
  }, [storageKey, setValue, exclude]);

  const clearPersistedData = () => {
    sessionStorage.removeItem(storageKey);
  };

  return { clearPersistedData };
}

// frontend/src/hooks/useConfirm.ts
import { useState, useCallback } from 'react';

interface UseConfirmReturn {
  isOpen: boolean;
  confirm: () => Promise<boolean>;
  onOpen: () => void;
  onClose: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(() => {
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const onOpen = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  const onClose = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  return { isOpen, confirm, onOpen, onClose };
}

// frontend/src/hooks/index.ts
export { useApi } from './useApi';
export { useDebounce } from './useDebounce';
export { usePagination } from './usePagination';
export { useToastNotification } from './useToastNotification';
export { useAuth } from './useAuth';
export { useFormPersist } from './useFormPersist';
export { useConfirm } from './useConfirm';