import { useCallback } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { getUserLocation } from '@/services/weather';
import { useWeatherData } from './useWeatherData';

export function useUserLocation() {
  const { setIsLoadingLocation, setError } = useWeatherStore();
  const { loadWeather } = useWeatherData();

  const handleUseCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const { lat, lon } = await getUserLocation();
      await loadWeather(lat, lon, 'Tu ubicación');
    } catch (err) {
      console.error('Error getting location:', err);
      setError('No se pudo obtener tu ubicación. Por favor permite el acceso.');
    } finally {
      setIsLoadingLocation(false);
    }
  }, [loadWeather, setIsLoadingLocation, setError]);

  return { handleUseCurrentLocation };
}

/*
  El hook useUserLocation permite obtener la ubicación del usuario y cargar los datos meteorológicos correspondientes.
  Utiliza la función getUserLocation para acceder a las coordenadas del usuario y luego carga los datos meteorológicos
  mediante el hook useWeatherData. Maneja estados de carga y errores relacionados con la obtención de la ubicación.

  Funciones clave:
  - handleUseCurrentLocation: Función asíncrona que obtiene la ubicación del usuario y carga los datos meteorológicos.

*/