'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useLoadingStore } from '@/store/loadingStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const {setLoading, isLoading} = useLoadingStore((state) => state);

  useEffect(() => {
    setLoading(false); // Ensure loading is false on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isLoading])

  return (
    <main className="pt-22 flex items-center justify-center bg-muted px-4 dark:bg-primary-foreground">
      <LoginForm />
    </main>
  );
}
