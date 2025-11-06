
'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { deleteCookie, getCookie } from 'cookies-next';

interface DecodedToken {
  email: string;
  role: string;
  name: string;
  avatar?: string;
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const clearAuth = () => {
    setUser(null);
    deleteCookie('token');
    deleteCookie('refreshToken');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  const validateAndSetUser = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        clearAuth();
        return false;
      }

      setUser(decoded);
      return true;
    } catch (err) {
      console.error('Token inválido', err);
      clearAuth();
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Priorizar cookie sobre localStorage para mejor SSR
        const cookieToken = getCookie('token');
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = cookieToken || localToken;

        if (!token) {
          setUser(null);
        } else {
          validateAndSetUser(token as string);
        }
      } catch (err) {
        console.error('Error checking auth', err);
        clearAuth();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, []);

  return { 
    user, 
    isAuthenticated: !!user, 
    isLoading,
    isInitialized,
    clearAuth 
  };
};
