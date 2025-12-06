import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DynamicIconStore, IconContext } from '@/types/dynamicIcon.interface';
import { ICON_MAPPINGS, DEFAULT_ICON } from '@/config/iconMappings';

/**
 * Store para manejar iconos dinámicos basados en diferentes contextos
 * Soporta persistencia y devtools para desarrollo
 */
export const useDynamicIconStore = create<DynamicIconStore>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        currentIcon: DEFAULT_ICON,
        context: 'weather',
        state: 'default',
        isLoading: false,
        error: null,

        // Acciones
        setIcon: (context: IconContext, state: string) => {
          const mapping = ICON_MAPPINGS[context];
          
          if (!mapping) {
            set(
              { error: `Contexto no válido: ${context}` },
              false,
              'dynamicIcon/setIcon/error'
            );
            return;
          }

          const iconConfig = mapping[state.toLowerCase()];
          
          if (!iconConfig) {
            set(
              { 
                error: `Estado no válido para ${context}: ${state}`,
                currentIcon: DEFAULT_ICON,
                context,
                state: 'default'
              },
              false,
              'dynamicIcon/setIcon/fallback'
            );
            return;
          }

          set(
            {
              currentIcon: iconConfig,
              context,
              state,
              error: null
            },
            false,
            'dynamicIcon/setIcon/success'
          );
        },

        setCustomIcon: (icon) => {
          set(
            {
              currentIcon: icon,
              context: 'weather', // Contexto por defecto
              state: 'custom',
              error: null
            },
            false,
            'dynamicIcon/setCustomIcon'
          );
        },

        resetToDefault: () => {
          set(
            {
              currentIcon: DEFAULT_ICON,
              context: 'weather',
              state: 'default',
              error: null,
              isLoading: false
            },
            false,
            'dynamicIcon/resetToDefault'
          );
        },

        setLoading: (loading) => {
          set(
            { isLoading: loading },
            false,
            'dynamicIcon/setLoading'
          );
        },

        setError: (error) => {
          set(
            { error },
            false,
            'dynamicIcon/setError'
          );
        }
      }),
      {
        name: 'dynamic-icon-storage',
        // Solo persistir el estado necesario
        partialize: (state) => ({
          currentIcon: state.currentIcon,
          context: state.context,
          state: state.state
        }),
      }
    ),
    {
      name: 'DynamicIconStore',
    }
  )
);