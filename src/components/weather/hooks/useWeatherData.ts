import { useCallback } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { getOneCallWeather, getAirQuality } from '@/services/weather';
import { useDynamicIcon } from '@/hooks/useDynamicIcon';

export function useWeatherData() {
  const { updateIcon } = useDynamicIcon();
  const {
    setWeatherData,
    setAirQuality,
    setIsLoading,
    setError,
    setIsRateLimited,
    setCityName,
    setIsNighttime
  } = useWeatherStore();

  const loadWeather = useCallback(async (lat: number, lon: number, city?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsRateLimited(false);

      if (city) setCityName(city);

      const [weather, air] = await Promise.all([
        getOneCallWeather(lat, lon),
        getAirQuality(lat, lon).catch(() => null),
      ]);

      setWeatherData(weather);
      setAirQuality(air);

      // Update nighttime status
      const currentTime = weather.current.dt;
      const isNight = currentTime < weather.current.sunrise || currentTime > weather.current.sunset;
      setIsNighttime(isNight);

      // Update icon
      updateIcon('weather', weather.current.weather[0].main);
    } catch (err) {
      if (err instanceof Error && err.message === 'RATE_LIMIT_EXCEEDED') {
        setIsRateLimited(true);
        setError(null);
      } else {
        setError('No se pudo cargar el clima. Intenta de nuevo.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setWeatherData, setAirQuality, setIsLoading, setError, setIsRateLimited, setCityName, setIsNighttime, updateIcon]);

  return { loadWeather };
}

/*
  Que hace este hook:
  - Proporciona una función `loadWeather` para cargar datos meteorológicos y de calidad del aire.
  - Actualiza el estado global usando `useWeatherStore`.
  - Maneja estados de carga, errores y limitaciones de tasa.
  - Actualiza el icono dinámicamente basado en las condiciones meteorológicas actuales.

  Explicación del código:
  - Importa los hooks y servicios necesarios.
  - Define el hook `useWeatherData` que utiliza `useCallback` para memorizar la función `loadWeather`.
  - Dentro de `loadWeather`, se manejan las llamadas asíncronas para obtener datos meteorológicos y de calidad del aire.
  - Actualiza varios estados en la tienda global según los resultados de las llamadas.
  - Maneja errores específicos, incluyendo limitaciones de tasa.
  - Finalmente, devuelve la función `loadWeather` para ser utilizada en componentes.

*/