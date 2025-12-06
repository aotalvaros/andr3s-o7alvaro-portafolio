/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useDynamicIconStore } from '@/store/dynamicIconStore';
import { IconContext, IconConfig } from '@/types/dynamicIcon.interface';

/**
 * Hook principal para manejar iconos dinámicos
 * Proporciona funciones helper y estado reactivo
 */
export const useDynamicIcon = () => {
  const store = useDynamicIconStore();

  const updateIcon = useCallback(
    (context: IconContext, state: string) => {
      store.setIcon(context, state);
    },
    [store.setIcon]
  );

  const updateCustomIcon = useCallback(
    (icon: IconConfig) => {
      store.setCustomIcon(icon);
    },
    [store.setCustomIcon]
  );

  const resetIcon = useCallback(() => {
    store.resetToDefault();
  }, [store.resetToDefault]);

  return {
    // Estado
    currentIcon: store.currentIcon,
    context: store.context,
    state: store.state,
    isLoading: store.isLoading,
    error: store.error,
    
    // Acciones
    updateIcon,
    updateCustomIcon,
    resetIcon,
    setLoading: store.setLoading,
    setError: store.setError
  };
};