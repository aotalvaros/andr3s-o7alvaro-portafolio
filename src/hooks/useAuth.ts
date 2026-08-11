
'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { deleteCookie, getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/core/domain/entities/User';
import { getUserProfile } from '@/services/user/user.service';

interface DecodedToken {
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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

  const cookieToken = getCookie('token');
  const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const token = cookieToken || localToken;

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded: DecodedToken = jwtDecode(token as string);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  const { data: userData, isLoading: queryLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: isTokenValid(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isTokenValid()) {
      clearAuth();
    } else if (userData) {
      setUser(userData);
    }
    setIsLoading(queryLoading);
    setIsInitialized(true);
  }, [userData, queryLoading]);

  return { 
    user, 
    isAuthenticated: !!user, 
    isLoading,
    isInitialized,
    clearAuth 
  };
};
