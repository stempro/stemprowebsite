
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
