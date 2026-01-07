import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OneCallWeatherData, AirQuality, CitySearchResult } from '@/types/weather.interface';

interface WeatherState {
  // Data
  weatherData: OneCallWeatherData | null;
  airQuality: AirQuality | null;
  searchResults: CitySearchResult[];
  
  // UI State
  cityName: string;
  query: string;
  isNighttime: boolean;
  
  // Loading States
  isLoading: boolean;
  isSearching: boolean;
  isLoadingLocation: boolean;
  
  // Error States
  error: string | null;
  isRateLimited: boolean;
  
  // Actions
  setWeatherData: (data: OneCallWeatherData | null) => void;
  setAirQuality: (data: AirQuality | null) => void;
  setSearchResults: (results: CitySearchResult[]) => void;
  setCityName: (name: string) => void;
  setQuery: (query: string) => void;
  setIsNighttime: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSearching: (value: boolean) => void;
  setIsLoadingLocation: (value: boolean) => void;
  setError: (error: string | null) => void;
  setIsRateLimited: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  weatherData: null,
  airQuality: null,
  searchResults: [],
  cityName: 'Medellin',
  query: '',
  isNighttime: false,
  isLoading: true,
  isSearching: false,
  isLoadingLocation: false,
  error: null,
  isRateLimited: false
};

export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setWeatherData: (data) => set({ weatherData: data }),
      setAirQuality: (data) => set({ airQuality: data }),
      setSearchResults: (results) => set({ searchResults: results }),
      setCityName: (name) => set({ cityName: name }),
      setQuery: (query) => set({ query }),
      setIsNighttime: (value) => set({ isNighttime: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      setIsSearching: (value) => set({ isSearching: value }),
      setIsLoadingLocation: (value) => set({ isLoadingLocation: value }),
      setError: (error) => set({ error }),
      setIsRateLimited: (value) => set({ isRateLimited: value }),
      reset: () => set(initialState)
    }),
    { name: 'WeatherStore' }
  )
);

/*
  Este archivo define una tienda de estado para una aplicación meteorológica utilizando Zustand.
  La tienda maneja datos meteorológicos, calidad del aire, resultados de búsqueda de ciudades,
  estados de carga y errores, junto con acciones para actualizar estos estados.

  Funciones clave:
  - setWeatherData: Actualiza los datos meteorológicos.
  - setAirQuality: Actualiza los datos de calidad del aire.
  - setSearchResults: Actualiza los resultados de búsqueda de ciudades.
  - setCityName: Actualiza el nombre de la ciudad actual.
  - setQuery: Actualiza la consulta de búsqueda.
  - setIsNighttime: Establece si es de noche o no.
  - setIsLoading: Establece el estado de carga principal.
  - setIsSearching: Establece el estado de búsqueda.
  - setIsLoadingLocation: Establece el estado de carga de la ubicación.
  - setError: Establece un mensaje de error.
  - setIsRateLimited: Establece si se ha alcanzado el límite de tasa.
  - reset: Restablece todos los estados a sus valores iniciales.

  La tienda está envuelta con middleware de devtools para facilitar la depuración. (Opcional)

*/