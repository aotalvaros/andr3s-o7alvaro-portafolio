'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useLoadingStore } from '@/store/loadingStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(false); // Ensure loading is false on mount
  },[])

  return (
    <main className="pt-24 flex items-center justify-center bg-muted px-4 dark:bg-primary-foreground">
      <LoginForm />
    </main>
  );
}
