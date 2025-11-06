'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Si ya está autenticado, redirigir al admin
      if (isAuthenticated) {
        router.push("/admin");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Mostrar loading mientras verificamos
  if (isChecking && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Redirigiendo...</div>
      </div>
    );
  }

  // Solo mostrar login si NO está autenticado
  return <>{children}</>;
}