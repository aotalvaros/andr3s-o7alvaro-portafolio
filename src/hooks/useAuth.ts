
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

  const clearAuth = () => {
    setUser(null);
    deleteCookie('token');
    deleteCookie('refreshToken');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar tanto cookie como localStorage
        const cookieToken = getCookie('token');
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = cookieToken || localToken;

        if (!token) {
          setIsLoading(false);
          return;
        }

        const decoded: DecodedToken = jwtDecode(token as string);
        const currentTime = Date.now() / 1000;

        // Verificar si el token ha expirado
        if (decoded.exp < currentTime) {
          clearAuth();
          setIsLoading(false);
          return;
        }

        setUser(decoded);
        setIsLoading(false);
      } catch (err) {
        console.error('Token inválido', err);
        clearAuth();
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { 
    user, 
    isAuthenticated: !!user, 
    isLoading,
    clearAuth 
  };
};
