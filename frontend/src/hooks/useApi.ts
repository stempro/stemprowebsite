// frontend/src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        // Handle both direct data and axios responses
        const actualData = (result as any)?.data !== undefined ? (result as any).data : result;
        setData(actualData);
        return actualData;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, isLoading, error, execute };
}