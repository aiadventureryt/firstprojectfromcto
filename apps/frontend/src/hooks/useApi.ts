'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@workspace/shared';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T = any>(
  endpoint: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (requestOptions: RequestInit = {}) => {
    try {
      setLoading(true);
      setError(null);

      const tokens = localStorage.getItem('authTokens');
      const headers = {
        'Content-Type': 'application/json',
        ...(tokens && { Authorization: `Bearer ${JSON.parse(tokens).accessToken}` }),
        ...requestOptions.headers,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...requestOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        options.onSuccess?.(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'API request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export const usePostApi = <T = any, R = any>(
  endpoint: string,
  options: UseApiOptions<R> = {}
) => {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (payload: T, requestOptions: RequestInit = {}) => {
    try {
      setLoading(true);
      setError(null);

      const tokens = localStorage.getItem('authTokens');
      const headers = {
        'Content-Type': 'application/json',
        ...(tokens && { Authorization: `Bearer ${JSON.parse(tokens).accessToken}` }),
        ...requestOptions.headers,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        ...requestOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<R> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        options.onSuccess?.(result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'API request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};