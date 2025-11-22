'use client';

import { useApi } from './useApi';
import { Order } from '@workspace/shared';

export const useOrders = () => {
  return useApi<Order[]>('/orders', { immediate: true });
};

export const useOrder = (id: string) => {
  return useApi<Order>(`/orders/${id}`, { immediate: !!id });
};

export const useCreateOrder = () => {
  // This would be implemented for creating new orders
  // For now, we'll return a mock implementation
  const createOrder = async (orderData: Partial<Order>) => {
    // Mock implementation - in real app, this would call the API
    console.log('Creating order:', orderData);
    return null;
  };

  return { createOrder, loading: false, error: null };
};