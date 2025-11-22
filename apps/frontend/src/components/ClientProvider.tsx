'use client';

import { AuthProvider } from '@/contexts/AuthContext';

interface ClientProviderProps {
  children: React.ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};