'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
    const checkAuth = async () => {
      // Verificar tanto el token como el estado de autenticación
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      if (!token || !isAuthenticated) {
        router.push("/login");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Mostrar loading mientras verificamos autenticación
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    );
  }

  // Solo renderizar children si está autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
