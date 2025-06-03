// src/components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

   useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
