'use client';

import { useApi, usePostApi } from './useApi';
import { User } from '@workspace/shared';

export const useProfile = () => {
  return useApi<User>('/profile', { immediate: true });
};

export const useUpdateProfile = () => {
  const { execute: updateProfile, loading, error, data } = usePostApi<Partial<User>, User>('/profile', {
    method: 'PUT',
  });
  
  return {
    updateProfile,
    loading,
    error,
    data,
  };
};