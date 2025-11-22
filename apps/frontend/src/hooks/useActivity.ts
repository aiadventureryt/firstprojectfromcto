'use client';

import { useApi } from './useApi';
import { Activity } from '@workspace/shared';

export const useActivity = () => {
  return useApi<Activity[]>('/activity', { immediate: true });
};