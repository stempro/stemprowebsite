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
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  pageNumbers: number[];
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Generate page numbers for pagination UI
  const pageNumbers = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i, index) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // -1 represents dots
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    pageNumbers,
  };
}

// frontend/src/hooks/useFormPersist.ts
import { useEffect, useCallback } from 'react';

interface UseFormPersistProps {
  formKey: string;
  watch: () => any;
  reset: (values: any) => void;
  exclude?: string[];
}

export function useFormPersist({
  formKey,
  watch,
  reset,
  exclude = [],
}: UseFormPersistProps) {
  const formData = watch();

  // Save form data to localStorage
  const saveFormData = useCallback(() => {
    if (!formData) return;

    const dataToSave = { ...formData };

    // Remove excluded fields
    exclude.forEach((field) => {
      delete dataToSave[field];
    });

    localStorage.setItem(formKey, JSON.stringify(dataToSave));
  }, [formData, formKey, exclude]);

  // Load saved form data
  const loadFormData = useCallback(() => {
    const saved = localStorage.getItem(formKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [formKey, reset]);

  // Clear saved form data
  const clearFormData = useCallback(() => {
    localStorage.removeItem(formKey);
  }, [formKey]);

  // Auto-save form data on change
  useEffect(() => {
    const timeoutId = setTimeout(saveFormData, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [formData, saveFormData]);

  // Load saved data on mount
  useEffect(() => {
    loadFormData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    saveFormData,
    loadFormData,
    clearFormData,
  };
}