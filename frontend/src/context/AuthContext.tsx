import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../features/auth/types/auth.types';
import type { LoginInput, RegisterInput } from '../features/auth/schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../api/axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      setUser(null);
      setAccessToken(null);
    }
  };

  const checkAuth = async () => {
    try {
      // Attempt to refresh the access token on startup using the refresh cookie
      const response = await authApi.refresh();
      if (response.success && response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        await fetchProfile();
      }
    } catch (error) {
      // No valid refresh session, normal flow
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform checkAuth once on app mount
  useEffect(() => {
    checkAuth();

    // Listen for forced logout event triggered by axios interceptor
    const handleForcedLogout = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth-logout', handleForcedLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForcedLogout);
    };
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const response = await authApi.login(data);
      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const googleLogin = async (token: string) => {
    try {
      setAccessToken(token);
      await fetchProfile();
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw new Error('Google authentication failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
