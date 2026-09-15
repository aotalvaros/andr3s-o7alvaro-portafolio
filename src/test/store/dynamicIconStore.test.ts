import { beforeEach, describe, expect, it } from 'vitest';
import { useDynamicIconStore } from '@/store/dynamicIconStore';
import { DEFAULT_ICON } from '@/config/iconMappings';

describe('dynamicIconStore', () => {
  beforeEach(() => {
    useDynamicIconStore.setState({
      currentIcon: DEFAULT_ICON,
      context: 'weather',
      state: 'default',
      isLoading: false,
      error: null,
    });
  });

  it('should set the icon from the configured mapping for a valid context and state', () => {
    useDynamicIconStore.getState().setIcon('weather', 'clear');

    expect(useDynamicIconStore.getState().currentIcon).toMatchObject({
      src: '/assets/climateScenario/sunny.png',
      alt: 'Clima soleado',
      fallbackSrc: '/assets/iconoBlackAndWhite.png',
    });
    expect(useDynamicIconStore.getState().state).toBe('clear');
    expect(useDynamicIconStore.getState().error).toBeNull();
  });

  it('should keep the current state and mark an error when the provided context is invalid', () => {
    useDynamicIconStore.getState().setIcon('weather', 'clear');
    useDynamicIconStore.getState().setIcon('unknown' as never, 'clear');

    expect(useDynamicIconStore.getState().error).toContain('Contexto no válido');
    expect(useDynamicIconStore.getState().currentIcon).toMatchObject({
      src: '/assets/climateScenario/sunny.png',
      alt: 'Clima soleado',
    });
  });

  it('should reset to default when the provided state is not mapped in the selected context', () => {
    useDynamicIconStore.getState().setIcon('weather', 'unknown-state');

    expect(useDynamicIconStore.getState().error).toContain('Estado no válido');
    expect(useDynamicIconStore.getState().currentIcon).toEqual(DEFAULT_ICON);
    expect(useDynamicIconStore.getState().state).toBe('default');
  });

  it('should support custom icons and later resets', () => {
    const customIcon = {
      src: '/assets/custom.png',
      alt: 'Icono personalizado',
      fallbackSrc: '/assets/fallback.png',
    };

    useDynamicIconStore.getState().setCustomIcon(customIcon);
    expect(useDynamicIconStore.getState().currentIcon).toEqual(customIcon);
    expect(useDynamicIconStore.getState().context).toBe('weather');
    expect(useDynamicIconStore.getState().state).toBe('custom');

    useDynamicIconStore.getState().setLoading(true);
    expect(useDynamicIconStore.getState().isLoading).toBe(true);

    useDynamicIconStore.getState().setError('Algo falló');
    expect(useDynamicIconStore.getState().error).toBe('Algo falló');

    useDynamicIconStore.getState().resetToDefault();
    expect(useDynamicIconStore.getState().currentIcon).toEqual(DEFAULT_ICON);
    expect(useDynamicIconStore.getState().isLoading).toBe(false);
    expect(useDynamicIconStore.getState().error).toBeNull();
  });
});
