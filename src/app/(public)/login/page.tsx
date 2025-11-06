'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import PublicRoute from '@/components/auth/PublicRoute';
import { useLoadingStore } from '@/store/loadingStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(false); // Ensure loading is false on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
     <PublicRoute>
      <main className="pt-22 flex items-center justify-center bg-muted px-4 dark:bg-primary-foreground">
        <LoginForm />
      </main>
     </PublicRoute>
  );
}
