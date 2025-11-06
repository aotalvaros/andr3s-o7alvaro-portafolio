'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si ya se inicializó la autenticación
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  // Mostrar loading mientras se inicializa o está cargando
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    );
  }

  // No renderizar nada si no está autenticado (se está redirigiendo)
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
