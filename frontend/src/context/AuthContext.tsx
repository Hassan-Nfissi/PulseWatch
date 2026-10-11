import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithDevMode: (devUsername: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pulsewatch_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pulsewatch_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pulsewatch_token');
      if (storedToken) {
        try {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('pulsewatch_user', JSON.stringify(currentUser));
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    const data = await apiClient.googleAuth(idToken);
    localStorage.setItem('pulsewatch_token', data.token);
    localStorage.setItem('pulsewatch_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const loginWithDevMode = async (devUsername: string) => {
    const devToken = `dev-google-token-${devUsername.trim().toLowerCase()}`;
    await loginWithGoogle(devToken);
  };

  const logout = () => {
    localStorage.removeItem('pulsewatch_token');
    localStorage.removeItem('pulsewatch_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginWithGoogle,
        loginWithDevMode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
