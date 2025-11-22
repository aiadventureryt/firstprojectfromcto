'use client';

import { useApi, usePostApi } from './useApi';
import { SavedItem } from '@workspace/shared';

export const useSavedItems = () => {
  return useApi<SavedItem[]>('/saved-items', { immediate: true });
};

export const useSaveItem = () => {
  const { execute: saveItem, loading, error, data } = usePostApi<{ productId: string }, SavedItem>('/saved-items');
  
  return {
    saveItem,
    loading,
    error,
    data,
  };
};

export const useRemoveSavedItem = () => {
  const removeItem = async (itemId: string) => {
    try {
      const tokens = localStorage.getItem('authTokens');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(tokens && { Authorization: `Bearer ${JSON.parse(tokens).accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing saved item:', error);
      throw error;
    }
  };

  return { removeItem };
};