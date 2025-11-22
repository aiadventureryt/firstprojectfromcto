// Shared types and utilities for the fullstack monorepo

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  theme: 'light' | 'dark';
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SavedItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  originalPrice?: number;
  addedAt: string;
  inStock: boolean;
  discount?: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'order_placed' | 'order_cancelled' | 'item_saved' | 'item_removed' | 'profile_updated' | 'login';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ORDERS: '/orders',
  SAVED_ITEMS: '/saved-items',
  ACTIVITY: '/activity',
  PROFILE: '/profile',
} as const;
