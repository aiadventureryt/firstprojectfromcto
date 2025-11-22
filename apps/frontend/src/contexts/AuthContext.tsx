'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginRequest, RegisterRequest, AuthResponse } from '@workspace/shared';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        tokens: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const tokens = localStorage.getItem('authTokens');
    const headers = {
      'Content-Type': 'application/json',
      ...(tokens && { Authorization: `Bearer ${JSON.parse(tokens).accessToken}` }),
      ...options.headers,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      localStorage.setItem('authTokens', JSON.stringify(response.tokens));
      dispatch({ type: 'AUTH_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response: AuthResponse = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      localStorage.setItem('authTokens', JSON.stringify(response.tokens));
      dispatch({ type: 'AUTH_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  const logout = () => {
    localStorage.removeItem('authTokens');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshToken = async () => {
    try {
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) return;

      const parsedTokens: AuthTokens = JSON.parse(tokens);
      const response: AuthTokens = await apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: parsedTokens.refreshToken }),
      });

      localStorage.setItem('authTokens', JSON.stringify(response));
      // Update tokens in state but keep user
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: state.user!, tokens: response } });
    } catch (error) {
      // If refresh fails, log out
      logout();
    }
  };

  const checkAuth = async () => {
    const tokens = localStorage.getItem('authTokens');
    if (!tokens) return;

    try {
      dispatch({ type: 'AUTH_START' });
      const user: User = await apiCall('/auth/me');
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      // Try to refresh token
      await refreshToken();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};