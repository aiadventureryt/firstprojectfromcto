import { ApiResponse } from '@workspace/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface FetchOptions extends RequestInit {
  skipErrorHandling?: boolean;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipErrorHandling, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!skipErrorHandling) {
      console.error('API call failed:', endpoint, error);
    }
    throw error;
  }
}

export async function apiGet<T = any>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, method: 'GET' });
}

export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = any>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, method: 'DELETE' });
}
