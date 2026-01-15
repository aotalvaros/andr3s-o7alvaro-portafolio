import { useCallback, useEffect } from 'react';
import { useLoadingStore } from '@/store/loadingStore';
import { useThemeStore } from '@/store/themeStore';
import { useWeatherStore } from '@/store/weatherStore';
import { getWeatherGradient } from '@/utils/weather/getWeatherGradient';
import { CitySearchResult } from '@/types/weather.interface';
import { useWeatherData } from './useWeatherData';
import { useCitySearch } from './useCitySearch';
import { useUserLocation } from './useUserLocation';
import { useDynamicIcon } from '@/hooks/useDynamicIcon';

export function useWeather() {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { resetIcon } = useDynamicIcon();
  
  const {
    weatherData,
    airQuality,
    error,
    cityName,
    isLoadingLocation,
    isRateLimited,
    searchResults,
    isSearching,
    isLoading,
    isNighttime,
    setError
  } = useWeatherStore();

  const { loadWeather } = useWeatherData();
  const { query, setQuery } = useCitySearch();
  const { handleUseCurrentLocation } = useUserLocation();

  useEffect(() => {
    setLoading(false);
    loadWeather(6.251, -75.5636, 'Medellin');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      resetIcon();
    };
  }, [resetIcon]);

  const backgroundGradient = weatherData
    ? getWeatherGradient(
        weatherData.current.weather[0].main,
        weatherData.current.dt > weatherData.current.sunrise &&
          weatherData.current.dt < weatherData.current.sunset,
        isDarkMode
      )
    : 'from-blue-200 via-cyan-100 to-blue-100';

  const handleCitySelect = useCallback((result: CitySearchResult) => {
    const cityName = result.state
      ? `${result.name}, ${result.state}, ${result.country}`
      : `${result.name}, ${result.country}`;
    loadWeather(result.lat, result.lon, cityName);
    useWeatherStore.getState().setSearchResults([]);
  }, [loadWeather]);

  const handleSearchChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, [setQuery]);

  return {
    weatherData,
    airQuality,
    error,
    backgroundGradient,
    cityName,
    isLoadingLocation,
    isRateLimited,
    results: searchResults,
    isSearching,
    isLoading,
    isNighttime,
    query,

    handleSearchChange,
    setError,
    handleUseCurrentLocation,
    handleCitySelect,
  };
}

/*
  El hook useWeather centraliza la lógica relacionada con la obtención y gestión de datos meteorológicos.
  Utiliza varios hooks personalizados para manejar la carga de datos, búsqueda de ciudades y obtención
  de la ubicación del usuario. Proporciona estados y funciones clave para interactuar con los datos
  meteorológicos y la interfaz de usuario.

  Estados clave:
  - weatherData: Datos meteorológicos actuales.
  - airQuality: Datos de calidad del aire.
  - error: Mensajes de error relacionados con la obtención de datos.
  - cityName: Nombre de la ciudad actual.
  - isLoadingLocation: Estado de carga al obtener la ubicación del usuario.
  - isRateLimited: Indica si se ha alcanzado el límite de solicitudes a la API.
  - searchResults: Resultados de búsqueda de ciudades.
  - isSearching: Estado de búsqueda activa.
  - isLoading: Estado general de carga.
  - isNighttime: Indica si es de noche en la ubicación actual.

  Funciones clave:
  - handleSearchChange: Actualiza la consulta de búsqueda de ciudades.
  - handleUseCurrentLocation: Obtiene la ubicación del usuario y carga los datos meteorológicos.
  - handleCitySelect: Carga los datos meteorológicos para una ciudad seleccionada de los resultados de búsqueda.

*/