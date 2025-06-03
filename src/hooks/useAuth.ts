
'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from 'cookies-next';

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

  useEffect(() => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token as string);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (err) {
      console.error('Token inválido', err);
    }
  }, []);

  return { user, isAuthenticated: !!user };
};
